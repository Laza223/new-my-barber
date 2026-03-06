/**
 * Tabla: shops
 *
 * La barbería es la entidad central del negocio.
 * Cada owner tiene exactamente una barbería (ownerId unique).
 *
 * Configuraciones de la barbería:
 * - monthlyGoal: meta de facturación mensual en centavos
 * - dailySalesLimit: depende del plan de suscripción
 * - summaryHour: hora a la que se envía el resumen diario (0-23)
 * - whatsapp/email summary: canales de notificación
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const shops = pgTable('shops', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  /** Dueño de la barbería — relación 1:1 */
  ownerId: uuid('owner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),

  name: varchar('name', { length: 100 }).notNull(),

  /** URL-friendly identifier: "barberking" */
  slug: varchar('slug', { length: 120 }).unique().notNull(),

  address: varchar('address', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  logoUrl: text('logo_url'),

  /** Meta de facturación mensual en CENTAVOS */
  monthlyGoal: integer('monthly_goal'),

  timezone: varchar('timezone', { length: 50 })
    .default('America/Argentina/Buenos_Aires')
    .notNull(),
  currency: varchar('currency', { length: 3 }).default('ARS').notNull(),

  /**
   * Límite de ventas diarias según plan:
   * - free: 10/día
   * - individual: ilimitado (se setea en 9999)
   * - business: ilimitado (se setea en 9999)
   */
  dailySalesLimit: integer('daily_sales_limit').default(10).notNull(),

  /** Número de WhatsApp para resúmenes (con código país) */
  whatsappNumber: varchar('whatsapp_number', { length: 20 }),

  /** Canales de notificación del resumen diario */
  emailSummaryEnabled: boolean('email_summary_enabled')
    .default(false)
    .notNull(),
  whatsappSummaryEnabled: boolean('whatsapp_summary_enabled')
    .default(false)
    .notNull(),

  /** Hora del resumen diario (0-23, default 22:00) */
  summaryHour: integer('summary_hour').default(22).notNull(),

  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
