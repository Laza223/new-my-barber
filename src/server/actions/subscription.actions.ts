/**
 * Subscription Server Actions.
 */
'use server';

import { PLANS } from '@/lib/constants';
import type { ActionResponse } from '@/lib/types/common';
import { cancellationEmail } from '@/server/emails/templates';
import { AppError, NotFoundError } from '@/server/lib/errors';
import { requireOwner } from '@/server/lib/get-session';
import { mercadopago } from '@/server/lib/mercadopago';
import { sendEmail } from '@/server/lib/resend';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';

/**
 * Get current subscription status.
 */
export async function getSubscriptionAction(shopId: string): Promise<
  ActionResponse<{
    plan: string;
    status: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
    mpSubscriptionId: string | null;
  }>
> {
  try {
    await requireOwner(shopId);
    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) throw new NotFoundError('Suscripción');

    return {
      success: true,
      data: {
        plan: sub.plan,
        status: sub.status,
        trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
        mpSubscriptionId: sub.mpSubscriptionId,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al obtener suscripción' };
  }
}

/**
 * Create MercadoPago checkout for plan upgrade.
 */
export async function createCheckoutAction(
  shopId: string,
  planId: 'individual' | 'business',
): Promise<ActionResponse<{ checkoutUrl: string }>> {
  try {
    const session = await requireOwner(shopId);

    const planKey = planId.toUpperCase() as 'INDIVIDUAL' | 'BUSINESS';
    const plan = PLANS[planKey];
    if (!plan) {
      return { success: false, error: 'Plan no válido' };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const preference = await mercadopago.createPreference({
      shopId,
      planId,
      planName: plan.name,
      priceCents: plan.priceCents,
      payerEmail: session.user.email,
      backUrl: baseUrl,
    });

    return {
      success: true,
      data: {
        checkoutUrl:
          process.env.NODE_ENV === 'production'
            ? preference.init_point
            : preference.sandbox_init_point,
      },
    };
  } catch (error) {
    console.error('[CHECKOUT] error:', error);
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al crear checkout' };
  }
}

/**
 * Cancel subscription (remains active until period end).
 */
export async function cancelSubscriptionAction(
  shopId: string,
): Promise<ActionResponse<void>> {
  try {
    const session = await requireOwner(shopId);
    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) throw new NotFoundError('Suscripción');

    if (sub.plan === 'free') {
      return { success: false, error: 'No tenés una suscripción activa' };
    }

    await subscriptionRepository.update(sub.id, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    // Send cancellation email (fire-and-forget)
    const planKey = sub.plan.toUpperCase() as keyof typeof PLANS;
    const planConfig = PLANS[planKey];
    const periodEnd = sub.currentPeriodEnd
      ? sub.currentPeriodEnd.toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'fin de período';
    const email = cancellationEmail(
      session.user.name,
      planConfig?.name ?? sub.plan,
      periodEnd,
    );
    sendEmail({
      to: session.user.email,
      subject: email.subject,
      html: email.html,
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al cancelar suscripción' };
  }
}

/**
 * Reactivate to free plan after cancellation.
 */
export async function downgradeToFreeAction(
  shopId: string,
): Promise<ActionResponse<void>> {
  try {
    await requireOwner(shopId);
    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) throw new NotFoundError('Suscripción');

    await subscriptionRepository.update(sub.id, {
      plan: 'free',
      status: 'active',
      mpSubscriptionId: null,
      mpPayerId: null,
      cancelledAt: null,
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al cambiar plan' };
  }
}
