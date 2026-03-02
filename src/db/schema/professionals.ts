/**
 * Tabla: professionals
 *
 * Los profesionales/barberos de una barbería.
 * Un profesional puede opcionalmente estar vinculado a un usuario
 * del sistema (userId nullable) — esto permite cargar barberos
 * que no tengan cuenta en la app.
 *
 * commissionRate: porcentaje 0-100 que el profesional se lleva
 * de cada venta. El resto va a la "casa" (dueño).
 * Ej: commissionRate=45 → profesional se lleva 45%, casa 55%.
 *
 * colorIndex: índice para asignar un color en gráficos/charts.
 * Se mapea a la paleta PROFESSIONAL_COLORS de utils.ts.
 *
 * isOwner: marca si este profesional es el dueño de la barbería
 * (que también atiende clientes). commissionRate=100 típicamente.
 *
 * Soft delete: deletedAt no null = profesional inactivo.
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
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { shops } from './shops';
import { users } from './users';

export const professionals = pgTable(
  'professionals',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    /** Cuenta del profesional (opcional, puede no tener login) */
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    shopId: uuid('shop_id')
      .references(() => shops.id, { onDelete: 'cascade' })
      .notNull(),

    name: varchar('name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    avatarUrl: text('avatar_url'),

    /** Porcentaje de comisión (0-100). Ej: 45 = se lleva 45% */
    commissionRate: integer('commission_rate').notNull(),

    /** Índice para color en gráficos (0-9, cíclico) */
    colorIndex: integer('color_index').default(0).notNull(),

    /** true si este profesional es el dueño de la barbería */
    isOwner: boolean('is_owner').default(false).notNull(),

    isActive: boolean('is_active').default(true).notNull(),

    joinedAt: timestamp('joined_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    /** Profesionales activos de una barbería (listados) */
    index('idx_professionals_shop_active').on(table.shopId, table.isActive),
    /** Profesionales no borrados de una barbería (incluye inactivos) */
    index('idx_professionals_shop_deleted').on(table.shopId, table.deletedAt),
  ],
);
