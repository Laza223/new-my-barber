/**
 * Validaciones Zod para servicios.
 * Mensajes de error en español.
 */
import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  /** Precio en CENTAVOS. Mínimo $1 = 100 centavos. */
  price: z
    .number({ required_error: 'El precio es requerido' })
    .int('El precio debe ser un número entero (centavos)')
    .min(100, 'El precio mínimo es $1'),
  /** Duración en minutos */
  duration: z
    .number()
    .int('La duración debe ser un número entero')
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 8 horas (480 minutos)')
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
