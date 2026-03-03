/**
 * MercadoPago SDK client configuration.
 * Uses MP API v1 directly (no SDK needed — fetch-based).
 */

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? '';
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '';
const MP_BASE_URL = 'https://api.mercadopago.com';

if (!MP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
  console.warn('[MP] MERCADOPAGO_ACCESS_TOKEN not set');
}

async function mpFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${MP_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`MercadoPago API error: ${res.status} — ${error}`);
  }

  return res.json() as Promise<T>;
}

export interface MPPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface MPPayment {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  external_reference: string;
  payer: { id: string; email: string };
  date_approved: string | null;
}

export const mercadopago = {
  webhookSecret: MP_WEBHOOK_SECRET,

  /**
   * Create a checkout preference for a subscription plan.
   */
  async createPreference(params: {
    shopId: string;
    planId: string;
    planName: string;
    priceCents: number;
    payerEmail: string;
    backUrl: string;
  }): Promise<MPPreference> {
    return mpFetch<MPPreference>('/checkout/preferences', {
      method: 'POST',
      body: JSON.stringify({
        items: [
          {
            title: `My Barber — Plan ${params.planName}`,
            description: `Suscripción mensual al plan ${params.planName}`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: params.priceCents / 100,
          },
        ],
        payer: { email: params.payerEmail },
        external_reference: `${params.shopId}:${params.planId}`,
        back_urls: {
          success: `${params.backUrl}/settings?payment=success`,
          failure: `${params.backUrl}/settings?payment=failure`,
          pending: `${params.backUrl}/settings?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${params.backUrl}/api/webhooks/mercadopago`,
        statement_descriptor: 'MY BARBER',
      }),
    });
  },

  /**
   * Get payment details by ID.
   */
  async getPayment(paymentId: string): Promise<MPPayment> {
    return mpFetch<MPPayment>(`/v1/payments/${paymentId}`);
  },

  /**
   * Verify HMAC signature from webhook.
   */
  verifySignature(body: string, signature: string): boolean {
    if (!MP_WEBHOOK_SECRET) return true; // Skip in dev
    try {
      // MP sends: ts=xxx,v1=hash
      const parts = signature.split(',');
      const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1];
      const hash = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

      if (!ts || !hash) return false;

      // We'll do a simple check — in production use crypto.timingSafeEqual
      const crypto = require('crypto') as typeof import('crypto');
      const expected = crypto
        .createHmac('sha256', MP_WEBHOOK_SECRET)
        .update(`id:;request-id:;ts:${ts};`)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(expected, 'hex'),
      );
    } catch {
      return false;
    }
  },
};
