/**
 * Validaciones Zod para barbería.
 * Mensajes de error en español.
 */
import { z } from 'zod';

/** Regex para teléfono argentino: +54 o sin prefijo, 10-13 dígitos */
const phoneRegex = /^(\+54)?\d{10,13}$/;

export const createShopSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  address: z
    .string()
    .max(255, 'La dirección no puede superar 255 caracteres')
    .optional(),
  phone: z
    .string()
    .regex(
      phoneRegex,
      'El teléfono no tiene un formato válido (ej: +5491155001234)',
    )
    .optional(),
});

export const updateShopSchema = createShopSchema.partial();

export const updateShopSettingsSchema = z.object({
  /** Meta mensual en CENTAVOS (integer). 0 = sin meta. */
  monthlyGoal: z
    .number()
    .int('La meta debe ser un número entero (centavos)')
    .min(0, 'La meta no puede ser negativa')
    .optional(),
  whatsappNumber: z
    .string()
    .regex(phoneRegex, 'El número de WhatsApp no tiene un formato válido')
    .optional()
    .nullable(),
  emailSummaryEnabled: z.boolean().optional(),
  whatsappSummaryEnabled: z.boolean().optional(),
  /** Hora del resumen diario (0-23) */
  summaryHour: z
    .number()
    .int()
    .min(0, 'La hora debe ser entre 0 y 23')
    .max(23, 'La hora debe ser entre 0 y 23')
    .optional(),
});

export type CreateShopSchema = z.infer<typeof createShopSchema>;
export type UpdateShopSchema = z.infer<typeof updateShopSchema>;
export type UpdateShopSettingsSchema = z.infer<typeof updateShopSettingsSchema>;
