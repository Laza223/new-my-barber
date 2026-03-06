/**
 * Tabla: promotions
 *
 * Promociones por día de la semana.
 * Ej: "Martes -20% en Corte"
 *
 * - dayOfWeek: 0=Dom … 6=Sáb (matches JS getDay())
 * - serviceId null = aplica a TODOS los servicios
 * - discountPercent: 1–100
 *
 * Único por (shopId, dayOfWeek, serviceId) para evitar duplicados.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { services } from './services';
import { shops } from './shops';

export const promotions = pgTable(
  'promotions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    shopId: uuid('shop_id')
      .references(() => shops.id, { onDelete: 'cascade' })
      .notNull(),

    /** Nombre descriptivo. Ej: "Martes de descuento" */
    name: varchar('name', { length: 100 }).notNull(),

    /** Porcentaje de descuento (1–100) */
    discountPercent: integer('discount_percent').notNull(),

    /** Día de la semana: 0=Dom, 1=Lun, ..., 6=Sáb */
    dayOfWeek: integer('day_of_week').notNull(),

    /** Servicio específico (null = todos los servicios) */
    serviceId: uuid('service_id').references(() => services.id, {
      onDelete: 'cascade',
    }),

    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    /** Una promo por día por servicio por shop */
    uniqueIndex('idx_promotions_unique').on(
      table.shopId,
      table.dayOfWeek,
      table.serviceId,
    ),
  ],
);
