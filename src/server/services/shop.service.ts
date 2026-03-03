/**
 * Shop Service — lógica de negocio de barberías.
 */
import type { CreateShopInput, UpdateShopInput } from '@/lib/types/shop';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@/server/lib/errors';
import { requireOwner, requireSession } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { shopRepository } from '@/server/repositories/shop.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import slugify from 'slugify';

/** Genera un slug URL-friendly con sufijo aleatorio si hay conflicto */
async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name, { lower: true, strict: true, locale: 'es' });
  const existing = await shopRepository.findBySlug(base);
  if (!existing) return base;

  // Agregar sufijo aleatorio de 4 caracteres
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export const shopService = {
  /**
   * Crea una barbería nueva para el owner.
   * También crea la suscripción trial y al owner como profesional.
   */
  async createShop(ownerId: string, input: CreateShopInput) {
    // Verificar que no tenga ya una barbería
    const existing = await shopRepository.findByOwnerId(ownerId);
    if (existing) {
      throw new ConflictError('Ya tenés una barbería registrada');
    }

    // Generar slug único
    const slug = await generateUniqueSlug(input.name);

    // Crear barbería
    const shop = await shopRepository.create({
      ownerId,
      name: input.name,
      slug,
      address: input.address,
      phone: input.phone,
    });

    if (!shop) throw new Error('Error al crear la barbería');

    // Crear suscripción trial (14 días)
    await subscriptionService.createTrialSubscription(shop.id);

    // Crear al owner como profesional (comisión 100%, isOwner)
    const session = await requireSession();
    await professionalRepository.create({
      userId: ownerId,
      shopId: shop.id,
      name: session.user.name,
      commissionRate: 100,
      colorIndex: 0,
      isOwner: true,
    });

    return shop;
  },

  /**
   * Obtiene la barbería con details (professionals, services, subscription).
   * Verifica que el usuario tenga acceso.
   */
  async getShop(shopId: string, userId: string) {
    const shop = await shopRepository.findByIdWithDetails(shopId);
    if (!shop) throw new NotFoundError('Barbería');

    // Verificar acceso: es owner o profesional del shop
    const isOwner = shop.ownerId === userId;
    if (!isOwner) {
      const pro = await professionalRepository.findByUserId(userId);
      if (!pro || pro.shopId !== shopId) {
        throw new ForbiddenError('No tenés acceso a esta barbería');
      }
    }

    return shop;
  },

  /**
   * Actualiza datos básicos de la barbería.
   */
  async updateShop(shopId: string, userId: string, input: UpdateShopInput) {
    const { shop } = await requireOwner(shopId);

    if (shop.ownerId !== userId) {
      throw new ForbiddenError('Solo el dueño puede editar la barbería');
    }

    return shopRepository.update(shopId, {
      ...(input.name && { name: input.name }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.monthlyGoal !== undefined && {
        monthlyGoal: input.monthlyGoal,
      }),
    });
  },

  /**
   * Actualiza settings de la barbería (meta, notificaciones, etc.).
   */
  async updateShopSettings(
    shopId: string,
    userId: string,
    input: {
      monthlyGoal?: number;
      whatsappNumber?: string | null;
      emailSummaryEnabled?: boolean;
      whatsappSummaryEnabled?: boolean;
      summaryHour?: number;
    },
  ) {
    const { shop } = await requireOwner(shopId);

    if (shop.ownerId !== userId) {
      throw new ForbiddenError('Solo el dueño puede cambiar la configuración');
    }

    return shopRepository.update(shopId, input);
  },

  /**
   * Soft delete de la barbería y todo lo asociado.
   */
  async deleteShop(shopId: string, userId: string) {
    const { shop } = await requireOwner(shopId);

    if (shop.ownerId !== userId) {
      throw new ForbiddenError('Solo el dueño puede eliminar la barbería');
    }

    // Soft delete profesionales
    await professionalRepository.softDeleteByShopId(shopId);

    // Soft delete shop
    await shopRepository.softDelete(shopId);
  },
};
