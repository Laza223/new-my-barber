/**
 * Tabla: verifications
 *
 * Tokens de verificación para Better-Auth.
 * Email verification, password reset, magic links, etc.
 */
import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),

  /** Identificador del objetivo (ej: email del usuario) */
  identifier: text('identifier').notNull(),

  /** Token o código de verificación */
  value: text('value').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
