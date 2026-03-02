/**
 * Validaciones Zod para profesionales.
 * Mensajes de error en español.
 */
import { z } from 'zod';

export const createProfessionalSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  phone: z
    .string()
    .regex(/^(\+54)?\d{10,13}$/, 'El teléfono no tiene un formato válido')
    .optional(),
  commissionRate: z
    .number({ required_error: 'La comisión es requerida' })
    .int('La comisión debe ser un número entero')
    .min(0, 'La comisión no puede ser negativa')
    .max(100, 'La comisión no puede superar 100%'),
});

export const updateProfessionalSchema = createProfessionalSchema.partial();

export type CreateProfessionalSchema = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalSchema = z.infer<typeof updateProfessionalSchema>;
