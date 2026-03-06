/**
 * Validaciones Zod para promociones.
 * Mensajes de error en español.
 */
import { z } from 'zod';

export const createPromotionSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  discountPercent: z
    .number({ required_error: 'El descuento es requerido' })
    .int('El descuento debe ser un número entero')
    .min(1, 'El descuento mínimo es 1%')
    .max(100, 'El descuento máximo es 100%'),
  dayOfWeek: z
    .number({ required_error: 'El día es requerido' })
    .int()
    .min(0, 'Día inválido')
    .max(6, 'Día inválido'),
  serviceId: z.string().uuid('ID de servicio inválido').nullable().optional(),
});

export const updatePromotionSchema = createPromotionSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreatePromotionSchema = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionSchema = z.infer<typeof updatePromotionSchema>;
