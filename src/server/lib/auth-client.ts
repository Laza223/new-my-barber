/**
 * Better-Auth — Cliente para componentes client-side.
 *
 * Uso en componentes "use client":
 * import { authClient } from '@/server/lib/auth-client';
 * const { data: session } = authClient.useSession();
 */
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
