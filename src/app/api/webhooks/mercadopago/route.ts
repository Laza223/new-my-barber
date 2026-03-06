/**
 * Webhook de MercadoPago.
 * Procesa notificaciones de pago.
 */
import { PLANS } from '@/lib/constants';
import { mercadopago } from '@/server/lib/mercadopago';
import { shopRepository } from '@/server/repositories/shop.repository';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Verify signature
  const signature = request.headers.get('x-signature');
  const body = await request.text();

  if (signature && !mercadopago.verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 2. Respond 200 immediately
  const response = NextResponse.json({ received: true }, { status: 200 });

  // 3. Parse and process
  try {
    const data = JSON.parse(body) as {
      type: string;
      data: { id: string };
      action: string;
    };

    if (data.type === 'payment' && data.data?.id) {
      await processPayment(data.data.id);
    }
  } catch (error) {
    console.error('[WEBHOOK] processing error:', error);
  }

  return response;
}

async function processPayment(paymentId: string) {
  try {
    const payment = await mercadopago.getPayment(paymentId);

    if (!payment.external_reference) return;

    // external_reference = "shopId:planId"
    const [shopId, planId] = payment.external_reference.split(':');
    if (!shopId || !planId) return;

    const sub = await subscriptionRepository.findByShopId(shopId);
    if (!sub) {
      console.error('[WEBHOOK] no subscription for shop:', shopId);
      return;
    }

    switch (payment.status) {
      case 'approved': {
        // Idempotency: skip if already processed this payment
        if (sub.mpSubscriptionId === String(payment.id)) {
          console.log(`[WEBHOOK] ⏭️ Already processed payment ${payment.id}`);
          break;
        }

        // Payment approved → activate subscription
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await subscriptionRepository.update(sub.id, {
          plan: planId as 'individual' | 'business',
          status: 'active',
          mpSubscriptionId: String(payment.id),
          mpPayerId: payment.payer?.id ?? null,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          trialEndsAt: null,
          cancelledAt: null,
        });

        // Update shop daily sales limit based on new plan
        const planKey = planId.toUpperCase() as keyof typeof PLANS;
        const planConfig = PLANS[planKey];
        if (planConfig) {
          await shopRepository.update(shopId, {
            dailySalesLimit: planConfig.limits.maxSalesPerDay,
          });
        }

        console.log(
          `[WEBHOOK] ✅ Subscription activated: shop=${shopId} plan=${planId}`,
        );
        break;
      }

      case 'pending':
      case 'in_process': {
        // Payment pending
        await subscriptionRepository.update(sub.id, {
          status: 'past_due',
        });
        console.log(`[WEBHOOK] ⏳ Payment pending: shop=${shopId}`);
        break;
      }

      case 'rejected':
      case 'cancelled': {
        // Payment failed
        await subscriptionRepository.update(sub.id, {
          status: 'past_due',
        });
        console.log(
          `[WEBHOOK] ❌ Payment failed: shop=${shopId} status=${payment.status}`,
        );
        break;
      }
    }
  } catch (error) {
    console.error('[WEBHOOK] payment processing error:', error);
  }
}
