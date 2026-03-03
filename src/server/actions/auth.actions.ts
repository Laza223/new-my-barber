/**
 * Server Actions de autenticación.
 *
 * Todas retornan ActionResponse — nunca tiran errores al cliente.
 * Validación con Zod antes de llamar a Better-Auth.
 */
'use server';

import { db } from '@/db';
import { shops } from '@/db/schema/shops';
import type { ActionResponse } from '@/lib/types/common';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { auth } from '@/server/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Login — valida credenciales y crea sesión.
 * Post-login: redirect a /dashboard o /onboarding según tenga shop.
 */
export async function loginAction(
  formData: FormData,
): Promise<ActionResponse<{ redirectTo: string }>> {
  try {
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    // Intentar sign-in con Better-Auth
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: 'Email o contraseña incorrectos',
        code: 'INVALID_CREDENTIALS',
      };
    }

    // Determinar redirect: ¿tiene barbería?
    const shop = await db.query.shops.findFirst({
      where: eq(shops.ownerId, result.user.id),
    });

    const redirectTo = shop ? '/dashboard' : '/onboarding';

    return { success: true, data: { redirectTo } };
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return {
      success: false,
      error: 'Email o contraseña incorrectos',
      code: 'INVALID_CREDENTIALS',
    };
  }
}

/**
 * Registro — crea usuario y envía email de verificación.
 */
export async function registerAction(
  formData: FormData,
): Promise<ActionResponse<{ email: string }>> {
  try {
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    // Crear usuario con Better-Auth
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: { email: parsed.data.email },
    };
  } catch (error: unknown) {
    console.error('[AUTH] Register error:', error);

    // Detectar email duplicado
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('already') || message.includes('duplicate')) {
      return {
        success: false,
        error: 'Ya existe una cuenta con ese email',
        code: 'CONFLICT',
      };
    }

    return {
      success: false,
      error: 'No se pudo crear la cuenta. Intentá de nuevo.',
      code: 'INTERNAL_ERROR',
    };
  }
}

/**
 * Logout — cierra sesión y redirect a /login.
 */
export async function logoutAction(): Promise<never> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch {
    // Ignorar error si la sesión ya expiró
  }

  redirect('/login');
}
