/**
 * Dashboard Repository — queries optimizadas para el dashboard.
 * Todos los montos en CENTAVOS.
 */
import { db } from '@/db';
import { professionals } from '@/db/schema/professionals';
import { sales } from '@/db/schema/sales';
import { shops } from '@/db/schema/shops';
import { and, asc, desc, eq, gte, isNull, lt, sql } from 'drizzle-orm';

const AR_TZ = 'America/Argentina/Buenos_Aires';

function todayAR(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: AR_TZ });
}

function yesterdayAR(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: AR_TZ });
}

function startOfMonthAR(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function prevMonthRangeAR() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toLocaleDateString(
    'en-CA',
  );
  return { start, end };
}

function sevenDaysAgoAR(): string {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toLocaleDateString('en-CA', { timeZone: AR_TZ });
}

export const dashboardRepository = {
  async getDashboard(shopId: string) {
    const today = todayAR();
    const yesterday = yesterdayAR();
    const monthStart = startOfMonthAR();
    const prev = prevMonthRangeAR();
    const weekStart = sevenDaysAgoAR();

    const activeWhere = and(eq(sales.shopId, shopId), isNull(sales.deletedAt));

    const [
      todayTotals,
      yesterdayTotals,
      monthTotals,
      prevMonthTotals,
      last7Days,
      byPayment,
      topServices,
      byProfessional,
      recentSales,
      shopData,
    ] = await Promise.all([
      // Today totals
      db
        .select({
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
          avgTicket: sql<number>`case when count(*) > 0 then coalesce(sum(${sales.servicePrice}), 0) / count(*) else 0 end`,
        })
        .from(sales)
        .where(and(activeWhere, eq(sales.saleDate, today))),

      // Yesterday totals
      db
        .select({
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        })
        .from(sales)
        .where(and(activeWhere, eq(sales.saleDate, yesterday))),

      // This month totals
      db
        .select({
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
          avgTicket: sql<number>`case when count(*) > 0 then coalesce(sum(${sales.servicePrice}), 0) / count(*) else 0 end`,
          commissions: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
          ownerRevenue: sql<number>`coalesce(sum(${sales.ownerAmount}), 0)`,
        })
        .from(sales)
        .where(and(activeWhere, gte(sales.saleDate, monthStart))),

      // Previous month totals
      db
        .select({
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(sales)
        .where(
          and(
            activeWhere,
            gte(sales.saleDate, prev.start),
            lt(sales.saleDate, monthStart),
          ),
        ),

      // Last 7 days chart
      db
        .select({
          date: sales.saleDate,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          salesCount: sql<number>`count(*)`,
        })
        .from(sales)
        .where(and(activeWhere, gte(sales.saleDate, weekStart)))
        .groupBy(sales.saleDate)
        .orderBy(asc(sales.saleDate)),

      // Payment breakdown
      db
        .select({
          method: sales.paymentMethod,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        })
        .from(sales)
        .where(and(activeWhere, gte(sales.saleDate, monthStart)))
        .groupBy(sales.paymentMethod),

      // Top services
      db
        .select({
          name: sales.serviceName,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(sales)
        .where(and(activeWhere, gte(sales.saleDate, monthStart)))
        .groupBy(sales.serviceName)
        .orderBy(desc(sql`coalesce(sum(${sales.servicePrice}), 0)`))
        .limit(5),

      // By professional
      db
        .select({
          id: professionals.id,
          name: professionals.name,
          colorIndex: professionals.colorIndex,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          commission: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
          salesCount: sql<number>`count(${sales.id})`,
        })
        .from(professionals)
        .leftJoin(
          sales,
          and(
            eq(sales.professionalId, professionals.id),
            gte(sales.saleDate, monthStart),
            isNull(sales.deletedAt),
          ),
        )
        .where(
          and(
            eq(professionals.shopId, shopId),
            eq(professionals.isActive, true),
            isNull(professionals.deletedAt),
          ),
        )
        .groupBy(professionals.id, professionals.name, professionals.colorIndex)
        .orderBy(desc(sql`coalesce(sum(${sales.servicePrice}), 0)`)),

      // Recent sales (last 10)
      db
        .select({
          id: sales.id,
          shopId: sales.shopId,
          professionalId: sales.professionalId,
          serviceId: sales.serviceId,
          serviceName: sales.serviceName,
          servicePrice: sales.servicePrice,
          commissionRate: sales.commissionRate,
          commissionAmount: sales.commissionAmount,
          ownerAmount: sales.ownerAmount,
          tipAmount: sales.tipAmount,
          paymentMethod: sales.paymentMethod,
          notes: sales.notes,
          saleDate: sales.saleDate,
          saleTime: sales.saleTime,
          createdAt: sales.createdAt,
          deletedAt: sales.deletedAt,
          professionalName: professionals.name,
        })
        .from(sales)
        .innerJoin(professionals, eq(sales.professionalId, professionals.id))
        .where(activeWhere)
        .orderBy(desc(sales.saleDate), desc(sales.saleTime))
        .limit(10),

      // Shop (for goal)
      db.query.shops.findFirst({ where: eq(shops.id, shopId) }),
    ]);

    const tToday = todayTotals[0];
    const tYesterday = yesterdayTotals[0];
    const tMonth = monthTotals[0];
    const tPrev = prevMonthTotals[0];

    const todayRev = Number(tToday?.revenue ?? 0);
    const yesterdayRev = Number(tYesterday?.revenue ?? 0);
    const monthRev = Number(tMonth?.revenue ?? 0);
    const monthCount = Number(tMonth?.count ?? 0);

    // Compared to yesterday
    const comparedToYesterday =
      yesterdayRev > 0
        ? Math.round(((todayRev - yesterdayRev) / yesterdayRev) * 100)
        : todayRev > 0
          ? 100
          : 0;

    // Monthly projection
    const daysWithSales = last7Days.length || 1;
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const dayOfMonth = now.getDate();
    const avgDaily = daysWithSales > 0 ? monthRev / Math.max(dayOfMonth, 1) : 0;
    const projectedRevenue = Math.round(avgDaily * daysInMonth);

    // Goal
    const goalAmount = shopData?.monthlyGoal ?? null;
    const goalProgress =
      goalAmount && goalAmount > 0
        ? Math.min(100, Math.round((monthRev / goalAmount) * 100))
        : null;

    // Payment breakdown percentages
    const totalPaymentRev = byPayment.reduce(
      (s, p) => s + Number(p.revenue),
      0,
    );

    return {
      today: {
        revenue: todayRev,
        salesCount: Number(tToday?.count ?? 0),
        averageTicket: Number(tToday?.avgTicket ?? 0),
        comparedToYesterday,
      },
      thisMonth: {
        revenue: monthRev,
        salesCount: monthCount,
        averageTicket: Number(tMonth?.avgTicket ?? 0),
        totalCommissions: Number(tMonth?.commissions ?? 0),
        totalOwnerRevenue: Number(tMonth?.ownerRevenue ?? 0),
        goalAmount,
        goalProgress,
        projectedRevenue,
      },
      charts: {
        last7Days: last7Days.map((d) => ({
          date: d.date,
          revenue: Number(d.revenue),
          sales: Number(d.salesCount),
        })),
        byPaymentMethod: byPayment.map((p) => ({
          method: p.method,
          revenue: Number(p.revenue),
          percentage:
            totalPaymentRev > 0
              ? Math.round((Number(p.revenue) / totalPaymentRev) * 100)
              : 0,
        })),
        topServices: topServices.map((s) => ({
          name: s.name,
          revenue: Number(s.revenue),
          count: Number(s.count),
        })),
        byProfessional: byProfessional.map((p) => ({
          id: p.id,
          name: p.name,
          revenue: Number(p.revenue),
          commission: Number(p.commission),
          sales: Number(p.salesCount),
          colorIndex: p.colorIndex,
        })),
      },
      recentSales: recentSales,
      insights: [] as {
        icon: string;
        text: string;
        type: 'positive' | 'negative' | 'neutral';
      }[],
      _meta: {
        prevMonthRevenue: Number(tPrev?.revenue ?? 0),
        prevMonthSales: Number(tPrev?.count ?? 0),
      },
    };
  },
};
