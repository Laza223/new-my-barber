/**
 * Tipos de promoción.
 */
import type { promotions } from '@/db/schema/promotions';
import type { InferSelectModel } from 'drizzle-orm';

/** Promoción completa del DB */
export type Promotion = InferSelectModel<typeof promotions>;

/** Input para crear una promoción */
export interface CreatePromotionInput {
  name: string;
  discountPercent: number;
  dayOfWeek: number;
  serviceId?: string | null;
}

/** Promoción con nombre del servicio (para listados) */
export interface PromotionWithService extends Promotion {
  serviceName: string | null;
}
