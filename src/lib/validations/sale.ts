import { z } from 'zod';

/**
 * Validaciones de ventas.
 */

const paymentMethodValues = [
  'cash',
  'card',
  'transfer',
  'mercadopago',
] as const;

export const createSaleSchema = z.object({
  serviceId: z.string().uuid('ID de servicio inválido'),
  professionalId: z
    .string()
    .uuid('ID de profesional inválido')
    .optional()
    .nullable(),
  paymentMethod: z.enum(paymentMethodValues, {
    errorMap: () => ({ message: 'Método de pago inválido' }),
  }),
  // YYYY-MM-DD, opcional (default: hoy)
  businessDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Formato de fecha inválido (YYYY-MM-DD)',
    )
    .optional(),
  // Override del precio en centavos (opcional)
  priceOverrideCents: z
    .number()
    .int()
    .positive('El precio debe ser mayor a $0')
    .optional()
    .nullable(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
