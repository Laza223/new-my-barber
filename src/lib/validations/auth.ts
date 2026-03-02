/**
 * Validaciones Zod para autenticación.
 * Mensajes de error en español.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('El email no es válido')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'El nombre es requerido' })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede superar 100 caracteres')
      .trim(),
    email: z
      .string({ required_error: 'El email es requerido' })
      .email('El email no es válido')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
      .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
    confirmPassword: z.string({
      required_error: 'Confirmá tu contraseña',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
