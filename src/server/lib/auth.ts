/**
 * Better-Auth configuration.
 * Se configura completamente en la fase de auth.
 *
 * Better-Auth maneja:
 * - Email/password authentication
 * - Session management (cookies)
 * - Email verification
 * - Password reset
 */

// TODO: Implementar en fase de auth
// import { betterAuth } from 'better-auth';
// import { drizzleAdapter } from 'better-auth/adapters/drizzle';
// import { db } from '@/db';
//
// export const auth = betterAuth({
//   database: drizzleAdapter(db, { provider: 'pg' }),
//   emailAndPassword: { enabled: true },
//   session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
// });
//
// export type Session = typeof auth.$Infer.Session;
