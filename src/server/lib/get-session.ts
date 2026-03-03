/**
 * Helpers de sesión para Server Components y Server Actions.
 *
 * getSession()      → sesión o null
 * requireSession()  → sesión o throw UnauthorizedError
 * requireOwner()    → sesión + shop, o throw error
 */
import { db } from '@/db';
import { shops } from '@/db/schema/shops';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from './auth';
import { ForbiddenError, NotFoundError, UnauthorizedError } from './errors';

/**
 * Obtiene la sesión actual desde las cookies del request.
 * Retorna null si no hay sesión válida.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return {
    user: session.user,
    session: session.session,
  };
}

/**
 * Exige sesión autenticada. Throw UnauthorizedError si no hay.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

/**
 * Exige que el usuario sea owner de la barbería indicada.
 * Si no se pasa shopId, busca la barbería del usuario.
 *
 * Retorna la sesión + shop.
 */
export async function requireOwner(shopId?: string) {
  const session = await requireSession();

  // Buscar la barbería del usuario
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.user.id),
  });

  if (!shop) {
    throw new NotFoundError('Barbería');
  }

  // Si se pasó shopId, verificar que coincida
  if (shopId && shop.id !== shopId) {
    throw new ForbiddenError('No tenés acceso a esta barbería');
  }

  return { ...session, shop };
}
