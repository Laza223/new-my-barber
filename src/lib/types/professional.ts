/**
 * Tipos de profesional/barbero.
 */
import type { professionals } from '@/db/schema/professionals';
import type { InferSelectModel } from 'drizzle-orm';

/** Profesional completo del DB */
export type Professional = InferSelectModel<typeof professionals>;

/** Input para crear profesional */
export interface CreateProfessionalInput {
  name: string;
  phone?: string;
  /** Porcentaje de comisión (0-100) */
  commissionRate: number;
}

/** Input para actualizar profesional */
export type UpdateProfessionalInput = Partial<CreateProfessionalInput>;

/** Profesional con estadísticas calculadas (para reportes/listados) */
export interface ProfessionalWithStats extends Professional {
  /** Cantidad de ventas en el período */
  totalSales: number;
  /** Facturación total en CENTAVOS */
  totalRevenue: number;
  /** Comisión total ganada en CENTAVOS */
  totalCommission: number;
}
