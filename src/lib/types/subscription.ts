/**
 * Tipos de suscripción y planes.
 */
import type { subscriptions } from '@/db/schema/subscriptions';
import type { InferSelectModel } from 'drizzle-orm';

/** Suscripción completa del DB */
export type Subscription = InferSelectModel<typeof subscriptions>;

/** IDs de plan disponibles */
export type PlanId = 'free' | 'individual' | 'business';

/** Features que pueden estar limitadas por plan */
export type PlanFeature =
  | 'professionals'
  | 'services'
  | 'dailySales'
  | 'salesHistory'
  | 'exports'
  | 'insights'
  | 'whatsappSummary'
  | 'monthlyGoal'
  | 'liquidations';

/** Resultado de verificar acceso a una feature */
export interface PlanAccess {
  allowed: boolean;
  /** Razón de bloqueo (ej: "Disponible en plan Business") */
  reason?: string;
  /** Límite numérico si aplica (ej: max 10 ventas/día) */
  limit?: number;
}
