/**
 * Better-Auth — Cliente para componentes client-side.
 *
 * Uso en componentes "use client":
 * import { authClient } from '@/server/lib/auth-client';
 * const { data: session } = authClient.useSession();
 */
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // Empty = uses relative URLs, works from any origin (localhost, phone IP, production)
});

export const { signIn, signUp, signOut, useSession } = authClient;
