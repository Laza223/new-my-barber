/**
 * Tabla: accounts
 *
 * Cuentas de autenticación para Better-Auth.
 * Permite login con email/password y OAuth providers.
 * Un usuario puede tener múltiples cuentas (ej: email + Google).
 */
import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),

  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  /** ID de la cuenta en el provider (ej: sub de Google) */
  accountId: text('account_id').notNull(),

  /** Nombre del provider: 'credential', 'google', etc. */
  providerId: text('provider_id').notNull(),

  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),

  /** Hash del password (solo para provider 'credential') */
  password: text('password'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
