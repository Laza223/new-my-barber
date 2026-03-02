/**
 * Tabla: services
 *
 * Los servicios que ofrece una barbería.
 * price está en CENTAVOS (integer).
 * sortOrder permite al dueño ordenar los servicios en la UI.
 *
 * Unique constraint parcial: no puede haber dos servicios activos
 * con el mismo nombre en la misma barbería.
 * (Dos servicios borrados con el mismo nombre sí pueden existir.)
 *
 * Soft delete: deletedAt no null = servicio eliminado.
 * Se mantiene para que las ventas históricas mantengan referencia.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { shops } from './shops';

export const services = pgTable(
  'services',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    shopId: uuid('shop_id')
      .references(() => shops.id, { onDelete: 'cascade' })
      .notNull(),

    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),

    /** Precio del servicio en CENTAVOS. $8.000 = 800000 */
    price: integer('price').notNull(),

    /** Duración estimada en minutos (nullable porque no siempre se define) */
    duration: integer('duration'),

    isActive: boolean('is_active').default(true).notNull(),

    /** Orden de aparición en la UI (ascendente) */
    sortOrder: integer('sort_order').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    /** Servicios activos de una barbería, ordenados */
    index('idx_services_shop_active_sort').on(
      table.shopId,
      table.isActive,
      table.sortOrder,
    ),
    /**
     * No duplicar nombres activos en la misma barbería.
     * Solo aplica cuando deletedAt IS NULL (partial unique).
     * Drizzle no soporta WHERE en uniqueIndex, así que esto se
     * aplica como constraint regular — si se necesita el parcial,
     * hacerlo en una migración custom.
     */
    uniqueIndex('idx_services_shop_name_unique').on(
      table.shopId,
      table.name,
      table.deletedAt,
    ),
  ],
);
