/**
 * Tipos de servicio.
 */
import type { services } from '@/db/schema/services';
import type { InferSelectModel } from 'drizzle-orm';

/** Servicio completo del DB */
export type Service = InferSelectModel<typeof services>;

/** Input para crear servicio */
export interface CreateServiceInput {
  name: string;
  /** Precio en CENTAVOS. $8.000 = 800000 */
  price: number;
  /** Duración en minutos */
  duration?: number;
  description?: string;
}

/** Input para actualizar servicio */
export type UpdateServiceInput = Partial<CreateServiceInput>;
