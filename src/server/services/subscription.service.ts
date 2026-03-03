/**
 * Subscription Service — lógica de suscripciones y verificación de plan.
 */
import { db } from '@/db';
import { sales } from '@/db/schema/sales';
import { APP_CONFIG, PLANS } from '@/lib/constants';
import type { PlanAccess, PlanFeature } from '@/lib/types/subscription';
import { NotFoundError } from '@/server/lib/errors';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
import { and, eq, isNull, sql } from 'drizzle-orm';

/** Límites por feature según plan */
const FEATURE_LIMITS: Record<
  string,
  Record<
    PlanFeature,
    { limit?: number; allowed: boolean; planRequired?: string }
  >
> = {
  free: {
    professionals: {
      limit: PLANS.FREE.limits.maxProfessionals,
      allowed: true,
      planRequired: 'Individual',
    },
    services: {
      limit: PLANS.FREE.limits.maxServices,
      allowed: true,
      planRequired: 'Individual',
    },
    dailySales: {
      limit: PLANS.FREE.limits.maxSalesPerDay,
      allowed: true,
      planRequired: 'Individual',
    },
    salesHistory: {
      limit: PLANS.FREE.limits.historyDays,
      allowed: true,
      planRequired: 'Individual',
    },
    exports: { allowed: false, planRequired: 'Individual' },
    insights: { allowed: false, planRequired: 'Business' },
    whatsappSummary: { allowed: false, planRequired: 'Business' },
    monthlyGoal: { allowed: true },
    liquidations: { allowed: false, planRequired: 'Business' },
  },
  individual: {
    professionals: {
      limit: PLANS.INDIVIDUAL.limits.maxProfessionals,
      allowed: true,
      planRequired: 'Business',
    },
    services: { allowed: true },
    dailySales: { allowed: true },
    salesHistory: { allowed: true },
    exports: { allowed: true },
    insights: { allowed: false, planRequired: 'Business' },
    whatsappSummary: { allowed: false, planRequired: 'Business' },
    monthlyGoal: { allowed: true },
    liquidations: { allowed: false, planRequired: 'Business' },
  },
  business: {
    professionals: {
      limit: PLANS.BUSINESS.limits.maxProfessionals,
      allowed: true,
    },
    services: { allowed: true },
    dailySales: { allowed: true },
    salesHistory: { allowed: true },
    exports: { allowed: true },
    insights: { allowed: true },
    whatsappSummary: { allowed: true },
    monthlyGoal: { allowed: true },
    liquidations: { allowed: true },
  },
};

export const subscriptionService = {
  /**
   * Crea suscripción trial para una nueva barbería.
   * 14 días de prueba con acceso completo.
   */
  async createTrialSubscription(shopId: string) {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + APP_CONFIG.trialDays);

    return subscriptionRepository.create({
      shopId,
      plan: 'free',
      status: 'trialing',
      trialEndsAt: trialEnd,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
    });
  },

  /**
   * Verifica si el shop tiene acceso a una feature según su plan.
   * Durante trial, todo está permitido.
   */
  async checkAccess(shopId: string, feature: PlanFeature): Promise<PlanAccess> {
    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) throw new NotFoundError('Suscripción');

    // Trial activo → todo permitido
    if (
      sub.status === 'trialing' &&
      sub.trialEndsAt &&
      sub.trialEndsAt > new Date()
    ) {
      return { allowed: true };
    }

    const planLimits = FEATURE_LIMITS[sub.plan];
    if (!planLimits) return { allowed: false, reason: 'Plan no reconocido' };

    const featureConfig = planLimits[feature];
    if (!featureConfig) return { allowed: true };

    if (!featureConfig.allowed) {
      return {
        allowed: false,
        reason: `Disponible en plan ${featureConfig.planRequired}`,
        limit: featureConfig.limit,
      };
    }

    return { allowed: true, limit: featureConfig.limit };
  },

  /**
   * Verifica el límite diario de ventas según el plan.
   */
  async checkDailySalesLimit(shopId: string): Promise<PlanAccess> {
    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) throw new NotFoundError('Suscripción');

    // Trial → sin límite
    if (
      sub.status === 'trialing' &&
      sub.trialEndsAt &&
      sub.trialEndsAt > new Date()
    ) {
      return { allowed: true };
    }

    const plan = PLANS[sub.plan.toUpperCase() as keyof typeof PLANS];
    if (!plan) return { allowed: true };

    const limit = plan.limits.maxSalesPerDay;
    if (!isFinite(limit)) return { allowed: true };

    // Contar ventas de hoy
    const today = new Date().toISOString().split('T')[0];
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.saleDate, today!),
          isNull(sales.deletedAt),
        ),
      );

    const count = Number(result[0]?.count ?? 0);

    if (count >= limit) {
      return {
        allowed: false,
        reason: `Alcanzaste el límite de ${limit} ventas diarias. Actualizá tu plan.`,
        limit,
      };
    }

    return { allowed: true, limit };
  },
};
