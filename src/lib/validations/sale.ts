/**
 * Validaciones Zod para ventas y filtros.
 * Mensajes de error en español.
 */
import { z } from 'zod';

const paymentMethodEnum = z.enum(
  ['cash', 'transfer', 'mercadopago', 'debit', 'credit'],
  { required_error: 'El método de pago es requerido' },
);

export const createSaleSchema = z.object({
  professionalId: z
    .string({ required_error: 'Seleccioná un profesional' })
    .uuid('ID de profesional inválido'),
  serviceId: z
    .string({ required_error: 'Seleccioná un servicio' })
    .uuid('ID de servicio inválido'),
  paymentMethod: paymentMethodEnum,
  /** Propina en CENTAVOS */
  tipAmount: z
    .number()
    .int('La propina debe ser un número entero (centavos)')
    .min(0, 'La propina no puede ser negativa')
    .optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden superar 500 caracteres')
    .optional(),
});

export const salesFilterSchema = z.object({
  startDate: z
    .string({ required_error: 'La fecha de inicio es requerida' })
    .date('Formato de fecha inválido (YYYY-MM-DD)'),
  endDate: z
    .string({ required_error: 'La fecha de fin es requerida' })
    .date('Formato de fecha inválido (YYYY-MM-DD)'),
  professionalId: z.string().uuid('ID de profesional inválido').optional(),
  paymentMethod: paymentMethodEnum.optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z
    .number()
    .int()
    .min(1, 'El límite mínimo es 1')
    .max(100, 'El límite máximo es 100')
    .default(20)
    .optional(),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
export type SalesFilterSchema = z.infer<typeof salesFilterSchema>;
