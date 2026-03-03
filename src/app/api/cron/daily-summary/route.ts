/**
 * Cron: Resumen diario.
 * Se ejecuta todos los días a las 7:00 UTC (4:00 AR).
 * Protegido por CRON_SECRET.
 *
 * Genera un resumen diario del día anterior para cada shop.
 * En el futuro: enviar por email o WhatsApp.
 */
import { db } from '@/db';
import { sales } from '@/db/schema/sales';
import { shops } from '@/db/schema/shops';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Yesterday in AR timezone
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    // Get all active shops with yesterday's sales summary
    const summaries = await db
      .select({
        shopId: shops.id,
        shopName: shops.name,
        revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        salesCount: sql<number>`count(${sales.id})`,
        avgTicket: sql<number>`case when count(${sales.id}) > 0 then coalesce(sum(${sales.servicePrice}), 0) / count(${sales.id}) else 0 end`,
      })
      .from(shops)
      .leftJoin(
        sales,
        and(
          eq(sales.shopId, shops.id),
          eq(sales.saleDate, yesterdayStr),
          isNull(sales.deletedAt),
        ),
      )
      .where(isNull(shops.deletedAt))
      .groupBy(shops.id, shops.name);

    const withSales = summaries.filter((s) => Number(s.salesCount) > 0);

    console.log(
      `[CRON] Daily summary: ${withSales.length}/${summaries.length} shops with sales yesterday`,
    );

    // TODO: Send email/WhatsApp notifications for Business plan shops
    // For now, just log the summaries
    for (const summary of withSales) {
      console.log(
        `[CRON] ${summary.shopName}: $${Number(summary.revenue) / 100} (${Number(summary.salesCount)} ventas)`,
      );
    }

    return NextResponse.json({
      success: true,
      date: yesterdayStr,
      totalShops: summaries.length,
      shopsWithSales: withSales.length,
    });
  } catch (error) {
    console.error('[CRON] daily-summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
