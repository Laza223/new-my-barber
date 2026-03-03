/**
 * Cron: Verificar suscripciones.
 * Se ejecuta todos los días a las 3:05 UTC (0:05 AR).
 * Protegido por CRON_SECRET.
 *
 * Acciones:
 * - Expirar trials vencidos → status=expired, plan=free
 * - Cancelar past_due > 3 días → cancelled
 * - Log de trials que expiran en 3 días
 */
import { db } from '@/db';
import { subscriptions } from '@/db/schema/subscriptions';
import { and, eq, isNull, lt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  let expiredTrials = 0;
  let cancelledPastDue = 0;

  try {
    // 1. Expire trials that have ended
    const expiredResults = await db
      .update(subscriptions)
      .set({
        status: 'active',
        plan: 'free',
        updatedAt: now,
      })
      .where(
        and(
          eq(subscriptions.status, 'trialing'),
          lt(subscriptions.trialEndsAt, now),
        ),
      )
      .returning({ id: subscriptions.id });

    expiredTrials = expiredResults.length;

    // 2. Cancel subscriptions past_due > 3 days
    const cancelledResults = await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        plan: 'free',
        cancelledAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(subscriptions.status, 'past_due'),
          lt(subscriptions.updatedAt, threeDaysAgo),
          isNull(subscriptions.cancelledAt),
        ),
      )
      .returning({ id: subscriptions.id });

    cancelledPastDue = cancelledResults.length;

    // 3. Log trials expiring in 3 days (for future notification)
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringTrials = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.status, 'trialing'),
        lt(subscriptions.trialEndsAt, threeDaysFromNow),
      ),
    });

    if (expiringTrials.length > 0) {
      console.log(`[CRON] ${expiringTrials.length} trials expiring in 3 days`);
    }

    return NextResponse.json({
      success: true,
      expiredTrials,
      cancelledPastDue,
      expiringTrials: expiringTrials.length,
    });
  } catch (error) {
    console.error('[CRON] check-subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
