import { sql } from 'drizzle-orm';
import {
    boolean,
    check,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { shops } from './shops';

/**
 * Tabla services — servicios que ofrece la barbería.
 * Max 50 activos por shop (Free: max 3).
 * Soft delete para mantener referencias en ventas históricas.
 * Precios en centavos (integer).
 */
export const services = pgTable(
  'services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shopId: uuid('shop_id')
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    // Precio en centavos. Ej: $5.000 = 500_000
    priceCents: integer('price_cents').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check('price_positive', sql`${table.priceCents} > 0`),
  ],
);
