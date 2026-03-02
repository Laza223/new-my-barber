/**
 * Tipos de barbería (shop).
 */
import type { shops } from '@/db/schema/shops';
import type { InferSelectModel } from 'drizzle-orm';
import type { Professional } from './professional';
import type { Service } from './service';
import type { Subscription } from './subscription';

/** Barbería completa del DB */
export type Shop = InferSelectModel<typeof shops>;

/** Input para crear barbería (onboarding) */
export interface CreateShopInput {
  name: string;
  address?: string;
  phone?: string;
}

/** Input para actualizar barbería */
export type UpdateShopInput = Partial<CreateShopInput> & {
  /** Meta mensual en CENTAVOS */
  monthlyGoal?: number;
};

/** Barbería con todas sus relaciones cargadas */
export interface ShopWithDetails extends Shop {
  professionals: Professional[];
  services: Service[];
  subscription: Subscription;
}
