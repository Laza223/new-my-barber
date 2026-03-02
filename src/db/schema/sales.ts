/**
 * Tabla: sales
 *
 * Registro inmutable de cada venta.
 * NO tiene updatedAt — una venta una vez creada NO se modifica.
 * Solo se puede soft-delete (deletedAt) para anulaciones.
 *
 * ═══════════════════════════════════════════════════════
 * SNAPSHOTS: ¿Por qué guardamos serviceName, servicePrice
 * y commissionRate si ya tenemos los FK?
 *
 * Porque los servicios y profesionales CAMBIAN:
 * - El dueño puede subir el precio de "Corte" de $8.000 a $10.000
 * - Puede cambiar la comisión de un barbero del 45% al 50%
 * - Puede renombrar un servicio
 *
 * Si usáramos solo FK, los reportes históricos serían INCORRECTOS.
 * Los snapshots preservan la verdad al momento de la venta.
 *
 * commissionAmount y ownerAmount son PRE-CALCULADOS al crear
 * la venta para evitar recalcular cada vez que se consultan reportes.
 * ═══════════════════════════════════════════════════════
 *
 * Todos los montos en CENTAVOS (integer).
 */
import { sql } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { paymentMethodEnum } from './enums';
import { professionals } from './professionals';
import { services } from './services';
import { shops } from './shops';

export const sales = pgTable(
  'sales',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    shopId: uuid('shop_id')
      .references(() => shops.id, { onDelete: 'cascade' })
      .notNull(),

    professionalId: uuid('professional_id')
      .references(() => professionals.id, { onDelete: 'restrict' })
      .notNull(),

    serviceId: uuid('service_id')
      .references(() => services.id, { onDelete: 'restrict' })
      .notNull(),

    // ── SNAPSHOTS ─────────────────────────────────────
    // Valores congelados al momento de la venta.
    // Ver comentario del header.

    /** Nombre del servicio AL MOMENTO de la venta */
    serviceName: varchar('service_name', { length: 100 }).notNull(),

    /** Precio del servicio en centavos AL MOMENTO de la venta */
    servicePrice: integer('service_price').notNull(),

    /** Comisión del profesional (0-100) AL MOMENTO de la venta */
    commissionRate: integer('commission_rate').notNull(),

    // ── MONTOS CALCULADOS ─────────────────────────────
    // Pre-calculados al crear para evitar recálculos en reportes.

    /** Lo que se lleva el profesional en centavos.
     *  = servicePrice × commissionRate / 100 */
    commissionAmount: integer('commission_amount').notNull(),

    /** Lo que se lleva la "casa" (dueño) en centavos.
     *  = servicePrice - commissionAmount */
    ownerAmount: integer('owner_amount').notNull(),

    /** Propina en centavos (va directo al profesional) */
    tipAmount: integer('tip_amount').default(0).notNull(),

    paymentMethod: paymentMethodEnum('payment_method').notNull(),

    notes: text('notes'),

    /** Fecha de negocio (puede diferir del createdAt si se carga retroactivamente) */
    saleDate: date('sale_date').notNull(),

    /** Hora de la venta */
    saleTime: time('sale_time').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),

    /** Soft delete para anulaciones. NO hay updatedAt. */
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    /** Ventas del día de una barbería (la query más frecuente) */
    index('idx_sales_shop_date').on(table.shopId, table.saleDate),

    /** Liquidaciones por profesional y período */
    index('idx_sales_shop_prof_date').on(
      table.shopId,
      table.professionalId,
      table.saleDate,
    ),

    /** Desglose por método de pago */
    index('idx_sales_shop_payment').on(table.shopId, table.paymentMethod),

    /** Ventas activas (no anuladas) por día */
    index('idx_sales_shop_date_active').on(
      table.shopId,
      table.saleDate,
      table.deletedAt,
    ),
  ],
);
