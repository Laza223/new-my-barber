/**
 * Tabla: subscriptions
 *
 * Suscripción de la barbería al SaaS.
 * Relación 1:1 con shops (shopId unique).
 *
 * Integración con MercadoPago:
 * - mpSubscriptionId: ID de la suscripción en MP
 * - mpPayerId: ID del pagador en MP
 *
 * Ciclo de vida:
 * trialing → active → (past_due ↔ active) → cancelled
 *
 * trialEndsAt: fecha en que termina el trial gratuito.
 * Si pasa esta fecha sin pagar, status → past_due → cancelled.
 */
import { sql } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { subscriptionPlanEnum, subscriptionStatusEnum } from './enums';
import { shops } from './shops';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  /** Barbería suscrita — relación 1:1 */
  shopId: uuid('shop_id')
    .references(() => shops.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),

  plan: subscriptionPlanEnum('plan').default('free').notNull(),
  status: subscriptionStatusEnum('status').default('trialing').notNull(),

  // ── Integración MercadoPago ──
  /** ID de la suscripción en MercadoPago */
  mpSubscriptionId: varchar('mp_subscription_id', { length: 255 }),

  /** ID del pagador en MercadoPago */
  mpPayerId: varchar('mp_payer_id', { length: 255 }),

  // ── Período de facturación ──
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),

  /** Fin del período de prueba */
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),

  /** Fecha de cancelación (null si no está cancelada) */
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
