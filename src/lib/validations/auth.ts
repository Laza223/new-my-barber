import { z } from 'zod';

/**
 * Validaciones de autenticación.
 * Se usan en Server Actions y en formularios del frontend.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos 1 mayúscula')
    .regex(/[a-z]/, 'Debe tener al menos 1 minúscula')
    .regex(/[0-9]/, 'Debe tener al menos 1 número'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({
      message: 'Debés aceptar los términos y condiciones',
    }),
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos 1 mayúscula')
    .regex(/[a-z]/, 'Debe tener al menos 1 minúscula')
    .regex(/[0-9]/, 'Debe tener al menos 1 número'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
