import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * PostgreSQL enums para My Barber.
 * Definidos como pgEnum para type-safety con Drizzle.
 */

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'individual',
  'business',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trial',
  'active',
  'past_due',
  'cancelled',
  'expired',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'card',
  'transfer',
  'mercadopago',
]);
