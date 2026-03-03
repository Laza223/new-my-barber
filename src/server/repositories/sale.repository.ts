/**
 * Sale Repository — queries de ventas con SQL optimizado.
 * Todos los montos en CENTAVOS.
 */
import { db } from '@/db';
import { professionals } from '@/db/schema/professionals';
import { sales } from '@/db/schema/sales';
import { shops } from '@/db/schema/shops';
import { and, asc, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

/** Fecha de hoy en timezone Argentina (YYYY-MM-DD) */
function todayArgentina(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: ARGENTINA_TZ });
}

export const saleRepository = {
  /** Crear una venta con snapshots */
  async create(data: typeof sales.$inferInsert) {
    const [created] = await db.insert(sales).values(data).returning();
    if (!created) throw new Error('Failed to create sale');
    return created;
  },

  async findById(id: string) {
    return db.query.sales.findFirst({
      where: and(eq(sales.id, id), isNull(sales.deletedAt)),
    });
  },

  /** Ventas paginadas con filtros + nombre del profesional */
  async findByShopId(
    shopId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      professionalId?: string;
      paymentMethod?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(sales.shopId, shopId), isNull(sales.deletedAt)];

    if (filters.startDate)
      conditions.push(gte(sales.saleDate, filters.startDate));
    if (filters.endDate) conditions.push(lte(sales.saleDate, filters.endDate));
    if (filters.professionalId)
      conditions.push(eq(sales.professionalId, filters.professionalId));
    if (filters.paymentMethod) {
      conditions.push(sql`${sales.paymentMethod} = ${filters.paymentMethod}`);
    }

    const where = and(...conditions);

    const [data, countResult] = await Promise.all([
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
        .where(where)
        .orderBy(desc(sales.saleDate), desc(sales.saleTime))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(sales)
        .where(where),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async softDelete(id: string) {
    await db
      .update(sales)
      .set({ deletedAt: new Date() })
      .where(eq(sales.id, id));
  },

  /** Contar ventas de HOY (timezone Argentina) no eliminadas */
  async countTodaySales(shopId: string): Promise<number> {
    const today = todayArgentina();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.saleDate, today),
          isNull(sales.deletedAt),
        ),
      );
    return Number(result[0]?.count ?? 0);
  },

  /** Resumen diario con CTEs optimizadas */
  async getDailySummary(shopId: string, date: string) {
    // Totals
    const totalsResult = await db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        totalSales: sql<number>`count(*)`,
        totalCommissions: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
        totalOwnerRevenue: sql<number>`coalesce(sum(${sales.ownerAmount}), 0)`,
        averageTicket: sql<number>`case when count(*) > 0 then coalesce(sum(${sales.servicePrice}), 0) / count(*) else 0 end`,
      })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.saleDate, date),
          isNull(sales.deletedAt),
        ),
      );

    // By professional
    const byProfessional = await db
      .select({
        id: professionals.id,
        name: professionals.name,
        revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        sales: sql<number>`count(${sales.id})`,
        commission: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
      })
      .from(professionals)
      .leftJoin(
        sales,
        and(
          eq(sales.professionalId, professionals.id),
          eq(sales.saleDate, date),
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
      .groupBy(professionals.id, professionals.name);

    // By payment method
    const byPayment = await db
      .select({
        method: sales.paymentMethod,
        revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.saleDate, date),
          isNull(sales.deletedAt),
        ),
      )
      .groupBy(sales.paymentMethod);

    // By service
    const byService = await db
      .select({
        name: sales.serviceName,
        revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.saleDate, date),
          isNull(sales.deletedAt),
        ),
      )
      .groupBy(sales.serviceName)
      .orderBy(desc(sql`coalesce(sum(${sales.servicePrice}), 0)`));

    const totals = totalsResult[0];
    const totalRev = Number(totals?.totalRevenue ?? 0);

    return {
      date,
      totalRevenue: totalRev,
      totalSales: Number(totals?.totalSales ?? 0),
      totalCommissions: Number(totals?.totalCommissions ?? 0),
      totalOwnerRevenue: Number(totals?.totalOwnerRevenue ?? 0),
      averageTicket: Number(totals?.averageTicket ?? 0),
      byProfessional: byProfessional.map((p) => ({
        id: p.id,
        name: p.name,
        revenue: Number(p.revenue),
        sales: Number(p.sales),
        commission: Number(p.commission),
      })),
      byPaymentMethod: byPayment.map((pm) => ({
        method: pm.method,
        revenue: Number(pm.revenue),
        count: Number(pm.count),
        percentage:
          totalRev > 0 ? Math.round((Number(pm.revenue) / totalRev) * 100) : 0,
      })),
      byService: byService.map((s) => ({
        name: s.name,
        revenue: Number(s.revenue),
        count: Number(s.count),
      })),
    };
  },

  /** Resumen mensual con daily breakdown, meta, proyección */
  async getMonthlySummary(shopId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    // Previous month range
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStartDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
    const prevLastDay = new Date(prevYear, prevMonth, 0).getDate();
    const prevEndDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevLastDay).padStart(2, '0')}`;

    // Current month totals
    const monthWhere = and(
      eq(sales.shopId, shopId),
      gte(sales.saleDate, startDate),
      lte(sales.saleDate, endDate),
      isNull(sales.deletedAt),
    );

    const [
      totalsResult,
      prevTotalsResult,
      dailyBreakdown,
      byProfessional,
      byPayment,
      byService,
      shopData,
    ] = await Promise.all([
      // Current month totals
      db
        .select({
          totalRevenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          totalSales: sql<number>`count(*)`,
          totalCommissions: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
          totalOwnerRevenue: sql<number>`coalesce(sum(${sales.ownerAmount}), 0)`,
          averageTicket: sql<number>`case when count(*) > 0 then coalesce(sum(${sales.servicePrice}), 0) / count(*) else 0 end`,
        })
        .from(sales)
        .where(monthWhere),

      // Previous month totals
      db
        .select({
          totalRevenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          totalSales: sql<number>`count(*)`,
        })
        .from(sales)
        .where(
          and(
            eq(sales.shopId, shopId),
            gte(sales.saleDate, prevStartDate),
            lte(sales.saleDate, prevEndDate),
            isNull(sales.deletedAt),
          ),
        ),

      // Daily breakdown
      db
        .select({
          date: sales.saleDate,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          sales: sql<number>`count(*)`,
        })
        .from(sales)
        .where(monthWhere)
        .groupBy(sales.saleDate)
        .orderBy(asc(sales.saleDate)),

      // By professional
      db
        .select({
          id: professionals.id,
          name: professionals.name,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          sales: sql<number>`count(${sales.id})`,
          commission: sql<number>`coalesce(sum(${sales.commissionAmount}), 0)`,
        })
        .from(professionals)
        .leftJoin(
          sales,
          and(
            eq(sales.professionalId, professionals.id),
            gte(sales.saleDate, startDate),
            lte(sales.saleDate, endDate),
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
        .groupBy(professionals.id, professionals.name),

      // By payment method
      db
        .select({
          method: sales.paymentMethod,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(sales)
        .where(monthWhere)
        .groupBy(sales.paymentMethod),

      // By service
      db
        .select({
          name: sales.serviceName,
          revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(sales)
        .where(monthWhere)
        .groupBy(sales.serviceName)
        .orderBy(desc(sql`coalesce(sum(${sales.servicePrice}), 0)`)),

      // Shop for goal
      db.query.shops.findFirst({ where: eq(shops.id, shopId) }),
    ]);

    const totals = totalsResult[0];
    const prevTotals = prevTotalsResult[0];
    const totalRev = Number(totals?.totalRevenue ?? 0);
    const totalSalesCount = Number(totals?.totalSales ?? 0);
    const prevRev = Number(prevTotals?.totalRevenue ?? 0);
    const prevSalesCount = Number(prevTotals?.totalSales ?? 0);

    // Days worked = days with at least 1 sale
    const daysWorked = dailyBreakdown.length;
    const today = todayArgentina();
    const todayDate = new Date(today);
    const endOfMonth = new Date(year, month, 0);
    const daysRemaining = Math.max(
      0,
      endOfMonth.getDate() - todayDate.getDate(),
    );

    // Projected revenue
    const avgDailyRevenue = daysWorked > 0 ? totalRev / daysWorked : 0;
    const projectedRevenue = Math.round(
      totalRev + avgDailyRevenue * daysRemaining,
    );

    // Goal
    const goalAmount = shopData?.monthlyGoal ?? null;
    const goalProgress =
      goalAmount && goalAmount > 0
        ? Math.min(100, Math.round((totalRev / goalAmount) * 100))
        : null;

    // Compared to last month
    const revenueChange =
      prevRev > 0
        ? Math.round(((totalRev - prevRev) / prevRev) * 100)
        : totalRev > 0
          ? 100
          : 0;
    const salesChange =
      prevSalesCount > 0
        ? Math.round(
            ((totalSalesCount - prevSalesCount) / prevSalesCount) * 100,
          )
        : totalSalesCount > 0
          ? 100
          : 0;

    return {
      date: startDate,
      totalRevenue: totalRev,
      totalSales: totalSalesCount,
      totalCommissions: Number(totals?.totalCommissions ?? 0),
      totalOwnerRevenue: Number(totals?.totalOwnerRevenue ?? 0),
      averageTicket: Number(totals?.averageTicket ?? 0),
      byProfessional: byProfessional.map((p) => ({
        id: p.id,
        name: p.name,
        revenue: Number(p.revenue),
        sales: Number(p.sales),
        commission: Number(p.commission),
      })),
      byPaymentMethod: byPayment.map((pm) => ({
        method: pm.method,
        revenue: Number(pm.revenue),
        count: Number(pm.count),
        percentage:
          totalRev > 0 ? Math.round((Number(pm.revenue) / totalRev) * 100) : 0,
      })),
      byService: byService.map((s) => ({
        name: s.name,
        revenue: Number(s.revenue),
        count: Number(s.count),
      })),
      goalAmount,
      goalProgress,
      projectedRevenue,
      daysWorked,
      daysRemaining,
      dailyBreakdown: dailyBreakdown.map((d) => ({
        date: d.date,
        revenue: Number(d.revenue),
        sales: Number(d.sales),
      })),
      comparedToLastMonth: { revenueChange, salesChange },
    };
  },

  /** Liquidación de un profesional */
  async getProfessionalLiquidation(
    shopId: string,
    professionalId: string,
    startDate: string,
    endDate: string,
  ) {
    const [pro] = await db
      .select()
      .from(professionals)
      .where(
        and(
          eq(professionals.id, professionalId),
          eq(professionals.shopId, shopId),
        ),
      );

    if (!pro) return null;

    const salesData = await db
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
      .where(
        and(
          eq(sales.shopId, shopId),
          eq(sales.professionalId, professionalId),
          gte(sales.saleDate, startDate),
          lte(sales.saleDate, endDate),
          isNull(sales.deletedAt),
        ),
      )
      .orderBy(asc(sales.saleDate), asc(sales.saleTime));

    const totalRevenue = salesData.reduce((sum, s) => sum + s.servicePrice, 0);
    const totalCommission = salesData.reduce(
      (sum, s) => sum + s.commissionAmount,
      0,
    );
    const totalTips = salesData.reduce((sum, s) => sum + s.tipAmount, 0);

    return {
      professional: pro,
      period: { start: startDate, end: endDate },
      totalRevenue,
      totalCommission,
      totalTips,
      totalPayout: totalCommission + totalTips,
      sales: salesData,
    };
  },

  /** Revenue por rango de fechas (para gráficos) */
  async getRevenueByDateRange(
    shopId: string,
    startDate: string,
    endDate: string,
  ) {
    return db
      .select({
        date: sales.saleDate,
        revenue: sql<number>`coalesce(sum(${sales.servicePrice}), 0)`,
        sales: sql<number>`count(*)`,
      })
      .from(sales)
      .where(
        and(
          eq(sales.shopId, shopId),
          gte(sales.saleDate, startDate),
          lte(sales.saleDate, endDate),
          isNull(sales.deletedAt),
        ),
      )
      .groupBy(sales.saleDate)
      .orderBy(asc(sales.saleDate));
  },
};
