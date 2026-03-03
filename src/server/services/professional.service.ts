/**
 * Professional Service — lógica de negocio de profesionales/barberos.
 */
import { db } from '@/db';
import { sales } from '@/db/schema/sales';
import type {
  CreateProfessionalInput,
  UpdateProfessionalInput,
} from '@/lib/types/professional';
import {
  ForbiddenError,
  NotFoundError,
  PlanLimitError,
} from '@/server/lib/errors';
import { requireOwner } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import { and, eq, gte, isNull, lte, sql } from 'drizzle-orm';

export const professionalService = {
  /**
   * Agrega un profesional a la barbería.
   * Verifica límite del plan y asigna colorIndex automáticamente.
   */
  async addProfessional(
    shopId: string,
    userId: string,
    input: CreateProfessionalInput,
  ) {
    await requireOwner(shopId);

    // Verificar límite del plan
    const access = await subscriptionService.checkAccess(
      shopId,
      'professionals',
    );
    if (access.limit !== undefined) {
      const currentCount =
        await professionalRepository.countActiveByShopId(shopId);
      if (currentCount >= access.limit) {
        throw new PlanLimitError('profesionales', 'Business');
      }
    }

    // Asignar color automáticamente
    const colorIndex = await professionalRepository.getNextColorIndex(shopId);

    return professionalRepository.create({
      shopId,
      name: input.name,
      phone: input.phone,
      commissionRate: input.commissionRate,
      colorIndex,
      isOwner: false,
    });
  },

  /**
   * Actualiza un profesional. No permite cambiar isOwner.
   */
  async updateProfessional(
    professionalId: string,
    userId: string,
    input: UpdateProfessionalInput,
  ) {
    const pro = await professionalRepository.findById(professionalId);
    if (!pro) throw new NotFoundError('Profesional');

    await requireOwner(pro.shopId);

    return professionalRepository.update(professionalId, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.commissionRate !== undefined && {
        commissionRate: input.commissionRate,
      }),
    });
  },

  /**
   * Soft delete de un profesional. No permite eliminar al owner.
   */
  async removeProfessional(professionalId: string, userId: string) {
    const pro = await professionalRepository.findById(professionalId);
    if (!pro) throw new NotFoundError('Profesional');

    await requireOwner(pro.shopId);

    if (pro.isOwner) {
      throw new ForbiddenError(
        'No podés eliminar al dueño de la barbería como profesional',
      );
    }

    await professionalRepository.softDelete(professionalId);
  },

  /**
   * Obtiene profesionales con estadísticas de ventas.
   */
  async getProfessionalsWithStats(
    shopId: string,
    userId: string,
    dateRange?: { start: string; end: string },
  ) {
    await requireOwner(shopId);

    const pros = await professionalRepository.findByShopId(shopId);

    // Query de estadísticas por profesional
    const conditions = [eq(sales.shopId, shopId), isNull(sales.deletedAt)];

    if (dateRange) {
      conditions.push(gte(sales.saleDate, dateRange.start));
      conditions.push(lte(sales.saleDate, dateRange.end));
    }

    const stats = await db
      .select({
        professionalId: sales.professionalId,
        totalSales: sql<number>`count(*)`,
        totalRevenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        totalCommission: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
      })
      .from(sales)
      .where(and(...conditions))
      .groupBy(sales.professionalId);

    // Merge pros con stats
    const statsMap = new Map(stats.map((s) => [s.professionalId, s]));

    return pros.map((pro) => {
      const s = statsMap.get(pro.id);
      return {
        ...pro,
        totalSales: Number(s?.totalSales ?? 0),
        totalRevenue: Number(s?.totalRevenue ?? 0),
        totalCommission: Number(s?.totalCommission ?? 0),
      };
    });
  },
};
