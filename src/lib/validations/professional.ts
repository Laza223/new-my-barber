import { z } from 'zod';

/**
 * Validaciones de profesionales.
 */

export const createProfessionalSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo')
    .trim(),
  commissionPercentage: z
    .number()
    .int('La comisión debe ser un número entero')
    .min(0, 'La comisión no puede ser negativa')
    .max(100, 'La comisión no puede ser mayor a 100%'),
});

export const updateProfessionalSchema =
  createProfessionalSchema.partial();

export type CreateProfessionalInput = z.infer<
  typeof createProfessionalSchema
>;
export type UpdateProfessionalInput = z.infer<
  typeof updateProfessionalSchema
>;
