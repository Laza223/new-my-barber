import { z } from 'zod';

/**
 * Validaciones de servicios.
 */

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo')
    .trim(),
  priceCents: z
    .number()
    .int('El precio debe ser un número entero (centavos)')
    .positive('El precio debe ser mayor a $0'),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
