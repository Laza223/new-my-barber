import {
    index,
    integer,
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import {
    subscriptionPlanEnum,
    subscriptionStatusEnum,
} from './enums';
import { shops } from './shops';

/**
 * Tabla subscriptions — suscripciones de MercadoPago.
 * Cada shop tiene máximo 1 suscripción activa (1:1).
 */
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id')
    .notNull()
    .unique()
    .references(() => shops.id, { onDelete: 'cascade' }),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  status: subscriptionStatusEnum('status').notNull().default('trial'),
  // Precio en centavos del plan actual
  amountCents: integer('amount_cents').notNull().default(0),
  // ID de la suscripción en MercadoPago
  mpSubscriptionId: varchar('mp_subscription_id', { length: 255 }),
  // Periodo actual
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Tabla subscription_events — auditoría de suscripciones.
 * Cada cambio de estado inserta un registro.
 */
export const subscriptionEvents = pgTable(
  'subscription_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    fromStatus: varchar('from_status', { length: 20 }),
    toStatus: varchar('to_status', { length: 20 }).notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('sub_events_sub_created_idx').on(
      table.subscriptionId,
      table.createdAt,
    ),
  ],
);

/**
 * Tabla analytics_events — tracking de comportamiento.
 * Se implementa la tabla ahora pero el tracking en fase posterior.
 */
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shopId: uuid('shop_id')
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    eventName: varchar('event_name', { length: 50 }).notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('analytics_shop_event_created_idx').on(
      table.shopId,
      table.eventName,
      table.createdAt,
    ),
  ],
);
