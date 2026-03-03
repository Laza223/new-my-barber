/**
 * Better-Auth catch-all route handler.
 * Delega todas las rutas de /api/auth/* a Better-Auth.
 *
 * Endpoints manejados automáticamente:
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - GET  /api/auth/session
 * - POST /api/auth/verify-email
 * - etc.
 */
import { auth } from '@/server/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
