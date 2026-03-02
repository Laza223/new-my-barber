import { z } from 'zod';

/**
 * Validaciones de la barbería (shop).
 */

export const updateShopSchema = z.object({
  fantasyName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo')
    .trim()
    .optional(),
  phone: z
    .string()
    .min(8, 'Teléfono inválido')
    .max(20, 'Teléfono muy largo')
    .optional()
    .nullable(),
  workingDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, 'Seleccioná al menos un día')
    .transform((days) => [...new Set(days)].sort())
    .optional(),
  monthlyGoalCents: z
    .number()
    .int()
    .positive('La meta debe ser mayor a $0')
    .optional()
    .nullable(),
});

/**
 * Schema para cada paso del onboarding.
 */
export const onboardingStep1Schema = z.object({
  fantasyName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100)
    .trim(),
  phone: z.string().max(20).optional(),
});

export const onboardingStep2Schema = z.object({
  workingDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, 'Seleccioná al menos un día laboral')
    .transform((days) => [...new Set(days)].sort()),
});

export const onboardingStep4Schema = z.object({
  monthlyGoalCents: z
    .number()
    .int()
    .positive('La meta debe ser mayor a $0')
    .nullable(),
});

export type UpdateShopInput = z.infer<typeof updateShopSchema>;
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep4Input = z.infer<typeof onboardingStep4Schema>;
