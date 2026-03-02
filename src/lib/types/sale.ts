/**
 * Tipos de venta, resúmenes y liquidaciones.
 * Todos los montos en CENTAVOS (integer).
 */
import type { sales } from '@/db/schema/sales';
import type { InferSelectModel } from 'drizzle-orm';
import type { Professional } from './professional';

/** Venta completa del DB */
export type Sale = InferSelectModel<typeof sales>;

/** Métodos de pago (coincide con el enum de Drizzle) */
export type PaymentMethod =
  | 'cash'
  | 'transfer'
  | 'mercadopago'
  | 'debit'
  | 'credit';

/** Input para crear una venta */
export interface CreateSaleInput {
  professionalId: string;
  serviceId: string;
  paymentMethod: PaymentMethod;
  /** Propina en CENTAVOS */
  tipAmount?: number;
  notes?: string;
}

/** Venta con nombre del profesional (para listados) */
export interface SaleWithDetails extends Sale {
  professionalName: string;
}

// ══════════════════════════════════════════════════════════════
// RESÚMENES — Datos agregados para reportes
// ══════════════════════════════════════════════════════════════

/** Resumen de un día de trabajo */
export interface DailySummary {
  date: string;
  /** Facturación total en CENTAVOS */
  totalRevenue: number;
  totalSales: number;
  /** Total comisiones pagadas en CENTAVOS */
  totalCommissions: number;
  /** Lo que queda para el dueño en CENTAVOS */
  totalOwnerRevenue: number;
  /** Ticket promedio en CENTAVOS */
  averageTicket: number;
  byProfessional: {
    id: string;
    name: string;
    /** Facturación en CENTAVOS */
    revenue: number;
    sales: number;
    /** Comisión en CENTAVOS */
    commission: number;
  }[];
  byPaymentMethod: {
    method: string;
    /** Facturación en CENTAVOS */
    revenue: number;
    count: number;
    /** Porcentaje del total (0-100) */
    percentage: number;
  }[];
  byService: {
    name: string;
    /** Facturación en CENTAVOS */
    revenue: number;
    count: number;
  }[];
}

/** Resumen mensual (extiende el diario con meta y proyección) */
export interface MonthlySummary extends DailySummary {
  /** Meta mensual en CENTAVOS (null si no configurada) */
  goalAmount: number | null;
  /** Progreso hacia la meta (0-100, null si no hay meta) */
  goalProgress: number | null;
  /** Proyección de facturación al final del mes en CENTAVOS */
  projectedRevenue: number;
  daysWorked: number;
  daysRemaining: number;
  dailyBreakdown: {
    date: string;
    /** Facturación del día en CENTAVOS */
    revenue: number;
    sales: number;
  }[];
  comparedToLastMonth: {
    /** % de cambio en facturación vs mes anterior */
    revenueChange: number;
    /** % de cambio en cantidad de ventas vs mes anterior */
    salesChange: number;
  };
}

/** Liquidación de un profesional en un período */
export interface ProfessionalLiquidation {
  professional: Professional;
  period: { start: string; end: string };
  /** Facturación total en CENTAVOS */
  totalRevenue: number;
  /** Comisión total en CENTAVOS */
  totalCommission: number;
  /** Propinas totales en CENTAVOS */
  totalTips: number;
  /** Total a pagar = comisión + propinas, en CENTAVOS */
  totalPayout: number;
  sales: SaleWithDetails[];
}
