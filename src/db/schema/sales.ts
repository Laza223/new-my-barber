import { sql } from 'drizzle-orm';
import {
    check,
    date,
    index,
    integer,
    pgTable,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { paymentMethodEnum } from './enums';
import { professionals } from './professionals';
import { services } from './services';
import { shops } from './shops';

/**
 * Tabla sales — ventas registradas.
 *
 * Decisiones de diseño:
 * - priceCents es snapshot (inmutable, no referencia al servicio)
 * - commissionCents y houseCents se calculan al crear
 * - businessDate es DATE (concepto de negocio, no timestamp)
 * - NO tiene updated_at (ventas son inmutables, solo se eliminan)
 * - Hard delete solo del día actual
 */
export const sales = pgTable(
  'sales',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shopId: uuid('shop_id')
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),
    // null = dueño atendió, sin profesional asignado
    professionalId: uuid('professional_id').references(
      () => professionals.id,
    ),
    // Snapshot del precio al momento de la venta (centavos)
    priceCents: integer('price_cents').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    // Fecha de negocio, NO timestamp. Ej: 2025-01-15
    businessDate: date('business_date').notNull(),
    // Comisión del profesional (centavos). 0 si no hay profesional.
    commissionCents: integer('commission_cents').notNull().default(0),
    // Monto que queda para el negocio (centavos)
    houseCents: integer('house_cents').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Índices para queries frecuentes
    index('sales_shop_date_idx').on(table.shopId, table.businessDate),
    index('sales_shop_professional_idx').on(
      table.shopId,
      table.professionalId,
    ),
    index('sales_business_date_idx').on(table.businessDate),
    // CHECK constraints
    check('sale_price_positive', sql`${table.priceCents} > 0`),
    check(
      'commission_non_negative',
      sql`${table.commissionCents} >= 0`,
    ),
    check(
      'house_amount_non_negative',
      sql`${table.houseCents} >= 0`,
    ),
  ],
);
