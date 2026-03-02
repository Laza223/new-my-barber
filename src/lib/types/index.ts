/**
 * TypeScript types del proyecto.
 * Barrel export de todos los tipos.
 */

// ── Auth ──
export type { LoginInput, RegisterInput } from '@/lib/validations/auth';

// ── Common ──

/** Respuesta estándar de Server Actions */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/** Paginación */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Respuesta paginada */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Re-export types from constants ──
export type {
  PaymentMethodId,
  PlanId,
  SubscriptionStatus,
} from '@/lib/constants';
