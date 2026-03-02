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
 * Tabla professionals — profesionales de la barbería.
 * Requiere plan Business. Max 10 activos por shop.
 * Soft delete: deleted_at IS NULL = activo.
 */
export const professionals = pgTable(
  'professionals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shopId: uuid('shop_id')
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    // Porcentaje de comisión: 0-100 (entero)
    commissionPercentage: integer('commission_percentage')
      .notNull()
      .default(0),
    isActive: boolean('is_active').notNull().default(true),
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
    check(
      'commission_valid',
      sql`${table.commissionPercentage} >= 0 AND ${table.commissionPercentage} <= 100`,
    ),
  ],
);
