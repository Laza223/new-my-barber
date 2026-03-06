/**
 * Better-Auth — Configuración del servidor.
 *
 * Punto central de autenticación. Usa Drizzle como adapter
 * y PostgreSQL (Neon) como base de datos.
 *
 * Providers: email + password.
 * Sesiones: cookie-based, httpOnly, secure en prod, 7 días.
 *
 * Build-safe: no crashea si DATABASE_URL no está definida
 * durante next build.
 */
import * as schema from '@/db/schema';
import { neon } from '@neondatabase/serverless';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { and, eq, ne } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

function createAuth() {
  const url = process.env.DATABASE_URL;

  // En build time, DATABASE_URL no existe. Crear adapter dummy.
  let db: ReturnType<typeof drizzle<typeof schema>>;
  if (url) {
    const sql = neon(url);
    db = drizzle(sql, { schema });
  } else {
    // Proxy que crashea solo si se intenta usar en runtime sin DB
    db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get(_, prop) {
        if (prop === 'then' || prop === 'catch') return undefined;
        throw new Error('DATABASE_URL no definida');
      },
    });
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),

    /* ── Email + Password ── */
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: false,
    },

    /* ── Verificación de email ── */
    emailVerification: {
      sendVerificationEmail: async ({ user, url: verifyUrl }) => {
        // TODO: Enviar con Resend cuando se configure
        console.log(`[AUTH] Verificar email para ${user.email}: ${verifyUrl}`);
      },
      sendOnSignUp: true,
    },

    /* ── Sesión ── */
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 días
      updateAge: 60 * 60 * 24, // Refrescar cada 24h de actividad
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 min cache
      },
    },

    /* ── Sesión única: al crear sesión, borrar las anteriores ── */
    databaseHooks: {
      session: {
        create: {
          after: async (session) => {
            // Delete all other sessions for this user (single-device enforcement)
            try {
              await db
                .delete(schema.sessions)
                .where(
                  and(
                    eq(schema.sessions.userId, session.userId),
                    ne(schema.sessions.id, session.id),
                  ),
                );
            } catch (err) {
              console.error('[AUTH] Failed to revoke old sessions:', err);
            }
          },
        },
      },
    },

    /* ── Configuración avanzada ── */
    advanced: {
      cookiePrefix: 'mybarber',
      generateId: false,
    },

    /* ── Trusted origins ── */
    trustedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'http://192.168.1.14:3000', // Red local para testing desde celular
    ],
  });
}

export const auth = createAuth();

/** Tipo del auth para inferencia */
export type Auth = typeof auth;
