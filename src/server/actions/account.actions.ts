/**
 * Account Server Actions — eliminación de cuenta.
 */
'use server';

import { db } from '@/db';
import { paymentHistory } from '@/db/schema/payment-history';
import { professionals } from '@/db/schema/professionals';
import { promotions } from '@/db/schema/promotions';
import { sales } from '@/db/schema/sales';
import { services } from '@/db/schema/services';
import { shops } from '@/db/schema/shops';
import { subscriptions } from '@/db/schema/subscriptions';
import { users } from '@/db/schema/users';
import type { ActionResponse } from '@/lib/types/common';
import { requireOwner } from '@/server/lib/get-session';
import { eq } from 'drizzle-orm';

/**
 * Elimina la cuenta del usuario y TODOS sus datos asociados.
 * Orden de borrado respeta foreign keys (restrict en sales → professionals/services).
 *
 * Datos eliminados:
 * - Ventas
 * - Historial de pagos
 * - Promociones
 * - Suscripciones
 * - Servicios
 * - Profesionales
 * - Barbería
 * - Sesiones y cuentas (cascade desde user)
 * - Usuario
 */
export async function deleteAccountAction(): Promise<ActionResponse<void>> {
  try {
    const session = await requireOwner();
    const shopId = session.shop.id;
    const userId = session.user.id;

    // Orden estricto: respetar FK restrict en sales → professionals/services
    // 1. Eliminar ventas (tienen FK restrict a professionals y services)
    await db.delete(sales).where(eq(sales.shopId, shopId));

    // 2. Eliminar historial de pagos (FK cascade desde subscriptions, pero por claridad)
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.shopId, shopId),
    });
    if (sub) {
      await db
        .delete(paymentHistory)
        .where(eq(paymentHistory.subscriptionId, sub.id));
    }

    // 3. Eliminar promociones (FK set null a services, cascade desde shop)
    await db.delete(promotions).where(eq(promotions.shopId, shopId));

    // 4. Eliminar suscripciones
    await db.delete(subscriptions).where(eq(subscriptions.shopId, shopId));

    // 5. Eliminar servicios y profesionales (ya sin restricciones de sales)
    await db.delete(services).where(eq(services.shopId, shopId));
    await db.delete(professionals).where(eq(professionals.shopId, shopId));

    // 6. Eliminar barbería
    await db.delete(shops).where(eq(shops.id, shopId));

    // 7. Eliminar usuario (cascade borra sessions + accounts automáticamente)
    await db.delete(users).where(eq(users.id, userId));

    return { success: true, data: undefined };
  } catch (error) {
    console.error('[DELETE_ACCOUNT] error:', error);
    return { success: false, error: 'Error al eliminar la cuenta' };
  }
}
