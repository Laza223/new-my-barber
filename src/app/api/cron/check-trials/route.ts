/**
 * Cron: check-trials — sends warning emails for expiring trials.
 * Should be called daily via Vercel Cron or similar.
 *
 * GET /api/cron/check-trials?secret=CRON_SECRET
 */
import { db } from '@/db';
import { shops } from '@/db/schema/shops';
import { subscriptions } from '@/db/schema/subscriptions';
import { users } from '@/db/schema/users';
import { trialWarningEmail } from '@/server/emails/templates';
import { sendEmail } from '@/server/lib/resend';
import { and, eq, gte, lte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find trials ending in 3 days or less
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringTrials = await db
      .select({
        shopId: subscriptions.shopId,
        trialEndsAt: subscriptions.trialEndsAt,
        ownerName: users.name,
        ownerEmail: users.email,
      })
      .from(subscriptions)
      .innerJoin(shops, eq(shops.id, subscriptions.shopId))
      .innerJoin(users, eq(users.id, shops.ownerId))
      .where(
        and(
          eq(subscriptions.status, 'trialing'),
          lte(subscriptions.trialEndsAt, threeDaysFromNow),
          gte(subscriptions.trialEndsAt, now),
        ),
      );

    let sent = 0;
    for (const trial of expiringTrials) {
      if (!trial.trialEndsAt) continue;

      const daysLeft = Math.max(
        1,
        Math.ceil(
          (trial.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      const email = trialWarningEmail(trial.ownerName, daysLeft);
      await sendEmail({
        to: trial.ownerEmail,
        subject: email.subject,
        html: email.html,
      });
      sent++;
    }

    console.log(`[CRON] check-trials: sent ${sent} warning emails`);
    return NextResponse.json({ sent, total: expiringTrials.length });
  } catch (error) {
    console.error('[CRON] check-trials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
