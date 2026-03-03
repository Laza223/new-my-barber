/**
 * Server Action para onboarding — setup completo en una transacción.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import { createShopSchema } from '@/lib/validations/shop';
import { AppError, ConflictError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { serviceRepository } from '@/server/repositories/service.repository';
import { shopRepository } from '@/server/repositories/shop.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import slugify from 'slugify';
import { z } from 'zod';

/** Schema para el input completo del onboarding */
const setupSchema = z.object({
  shop: createShopSchema,
  services: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().int().min(100),
        duration: z.number().int().min(5).optional(),
      }),
    )
    .min(1, 'Agregá al menos un servicio'),
  professionals: z.array(
    z.object({
      name: z.string().min(1),
      commissionRate: z.number().int().min(0).max(100),
    }),
  ),
  ownerCommission: z.number().int().min(0).max(100),
});

export type SetupShopInput = z.infer<typeof setupSchema>;

/** Genera slug único */
async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name, { lower: true, strict: true, locale: 'es' });
  const existing = await shopRepository.findBySlug(base);
  if (!existing) return base;
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function setupShopAction(
  input: SetupShopInput,
): Promise<ActionResponse<{ shopId: string }>> {
  try {
    const session = await requireSession();

    // Validar input
    const parsed = setupSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const {
      shop: shopInput,
      services,
      professionals,
      ownerCommission,
    } = parsed.data;

    // Verificar que no tenga barbería
    const existing = await shopRepository.findByOwnerId(session.user.id);
    if (existing) {
      throw new ConflictError('Ya tenés una barbería registrada');
    }

    // Generar slug
    const slug = await generateUniqueSlug(shopInput.name);

    // 1. Crear shop
    const shop = await shopRepository.create({
      ownerId: session.user.id,
      name: shopInput.name,
      slug,
      address: shopInput.address,
      phone: shopInput.phone,
    });

    // 2. Crear suscripción trial
    await subscriptionService.createTrialSubscription(shop.id);

    // 3. Crear profesional owner
    await professionalRepository.create({
      userId: session.user.id,
      shopId: shop.id,
      name: session.user.name,
      commissionRate: ownerCommission,
      colorIndex: 0,
      isOwner: true,
    });

    // 4. Crear servicios
    if (services.length > 0) {
      await serviceRepository.createMany(
        services.map((s, i) => ({
          shopId: shop.id,
          name: s.name,
          price: s.price,
          duration: s.duration,
          sortOrder: i,
        })),
      );
    }

    // 5. Crear profesionales adicionales
    for (let i = 0; i < professionals.length; i++) {
      const pro = professionals[i];
      if (!pro) continue;
      await professionalRepository.create({
        shopId: shop.id,
        name: pro.name,
        commissionRate: pro.commissionRate,
        colorIndex: i + 1,
        isOwner: false,
      });
    }

    return { success: true, data: { shopId: shop.id } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[ONBOARDING] setup error:', error);
    return { success: false, error: 'Error al configurar la barbería' };
  }
}
