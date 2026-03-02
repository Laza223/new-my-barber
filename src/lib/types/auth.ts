/**
 * Tipos de autenticación.
 * NUNCA incluir passwordHash en tipos que van al cliente.
 */
import type { sessions } from '@/db/schema/sessions';
import type { users } from '@/db/schema/users';
import type { InferSelectModel } from 'drizzle-orm';

/** Usuario completo del DB */
export type User = InferSelectModel<typeof users>;

/** Sesión del DB */
export type Session = InferSelectModel<typeof sessions>;

/** Usuario seguro — sin campos sensibles */
export type AuthUser = Omit<User, 'passwordHash' | 'deletedAt'>;

/** Sesión autenticada completa */
export interface AuthSession {
  user: AuthUser;
  session: Session;
}

/** Input para login */
export interface LoginInput {
  email: string;
  password: string;
}

/** Input para registro */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
