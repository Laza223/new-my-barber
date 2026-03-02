/**
 * Tabla: sessions
 *
 * Sesiones de autenticación para Better-Auth.
 * Cada login crea un registro. Se borran al logout o expirar.
 * Almacena IP y user-agent para auditoría de seguridad.
 */
import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),

  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  token: text('token').unique().notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

  /** IP del cliente (IPv4 o IPv6, max 45 chars) */
  ipAddress: varchar('ip_address', { length: 45 }),

  /** User-agent del navegador para detectar sesiones sospechosas */
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
