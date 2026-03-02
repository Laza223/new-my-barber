/**
 * Tabla: payment_history
 *
 * Historial de pagos de suscripción (no ventas de la barbería).
 * Cada cobro de MercadoPago genera un registro aquí.
 * Sirve como audit trail y para reconciliación.
 *
 * amount en CENTAVOS.
 */
import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { paymentStatusEnum } from './enums';
import { subscriptions } from './subscriptions';

export const paymentHistory = pgTable('payment_history', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  subscriptionId: uuid('subscription_id')
    .references(() => subscriptions.id, { onDelete: 'cascade' })
    .notNull(),

  /** ID del pago en MercadoPago */
  mpPaymentId: varchar('mp_payment_id', { length: 255 }).notNull(),

  /** Monto cobrado en CENTAVOS */
  amount: integer('amount').notNull(),

  currency: varchar('currency', { length: 3 }).default('ARS').notNull(),

  status: paymentStatusEnum('status').notNull(),

  /** Fecha efectiva del cobro */
  paidAt: timestamp('paid_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
