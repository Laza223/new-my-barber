/**
 * Tipos del dashboard principal.
 * Todos los montos en CENTAVOS.
 */
import type { SaleWithDetails } from './sale';

/** Datos completos del dashboard */
export interface DashboardData {
  today: {
    /** Facturación del día en CENTAVOS */
    revenue: number;
    salesCount: number;
    /** Ticket promedio en CENTAVOS */
    averageTicket: number;
    /** % de cambio vs ayer */
    comparedToYesterday: number;
  };
  thisMonth: {
    /** Facturación del mes en CENTAVOS */
    revenue: number;
    salesCount: number;
    /** Ticket promedio en CENTAVOS */
    averageTicket: number;
    /** Total comisiones del mes en CENTAVOS */
    totalCommissions: number;
    /** Lo que queda para el dueño en CENTAVOS */
    totalOwnerRevenue: number;
    /** Meta mensual en CENTAVOS (null si no configurada) */
    goalAmount: number | null;
    /** Progreso hacia la meta (0-100, null si no hay meta) */
    goalProgress: number | null;
    /** Proyección al fin de mes en CENTAVOS */
    projectedRevenue: number;
  };
  charts: {
    last7Days: {
      date: string;
      /** Facturación en CENTAVOS */
      revenue: number;
      sales: number;
    }[];
    byPaymentMethod: {
      method: string;
      /** Facturación en CENTAVOS */
      revenue: number;
      /** Porcentaje del total (0-100) */
      percentage: number;
    }[];
    topServices: {
      name: string;
      /** Facturación en CENTAVOS */
      revenue: number;
      count: number;
    }[];
    byProfessional: {
      id: string;
      name: string;
      /** Facturación en CENTAVOS */
      revenue: number;
      /** Comisión en CENTAVOS */
      commission: number;
      sales: number;
      colorIndex: number;
    }[];
  };
  /** Últimas ventas del día */
  recentSales: SaleWithDetails[];
  /** Insights/sugerencias generados por el sistema */
  insights: {
    icon: string;
    text: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
}
