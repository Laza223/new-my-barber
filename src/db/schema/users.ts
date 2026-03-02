/**
 * Tabla: users
 *
 * Datos de autenticación y perfil del usuario.
 * Un owner puede tener una barbería.
 * Un professional puede estar vinculado a una barbería.
 * Soft delete con deletedAt para mantener integridad referencial.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),

  role: userRoleEnum('role').default('owner').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
