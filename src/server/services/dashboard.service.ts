/**
 * Dashboard Service — genera insights inteligentes.
 */
import type { DashboardData } from '@/lib/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import { requireOwner } from '@/server/lib/get-session';
import { dashboardRepository } from '@/server/repositories/dashboard.repository';
import { promotionRepository } from '@/server/repositories/promotion.repository';
import { subscriptionService } from '@/server/services/subscription.service';

export const dashboardService = {
  async getDashboard(shopId: string, _userId: string): Promise<DashboardData> {
    await requireOwner(shopId);

    const raw = await dashboardRepository.getDashboard(shopId);

    // Generate insights (PRO/BUSINESS only)
    const access = await subscriptionService.checkAccess(shopId, 'insights');
    const insights: DashboardData['insights'] = [];

    if (access.allowed) {
      const meta = raw._meta;

      // 1. Revenue trend vs last month
      if (meta.prevMonthRevenue > 0) {
        const change = Math.round(
          ((raw.thisMonth.revenue - meta.prevMonthRevenue) /
            meta.prevMonthRevenue) *
            100,
        );
        if (change > 0) {
          insights.push({
            icon: '📈',
            text: `Tu facturación subió ${change}% respecto al mes pasado`,
            type: 'positive',
          });
        } else if (change < -5) {
          insights.push({
            icon: '📉',
            text: `Tu facturación bajó ${Math.abs(change)}% respecto al mes pasado`,
            type: 'negative',
          });
        }
      }

      // 2. Best day of the week
      if (raw.charts.last7Days.length > 0) {
        const best = raw.charts.last7Days.reduce((a, b) =>
          b.revenue > a.revenue ? b : a,
        );
        if (best.revenue > 0) {
          const dayName = new Date(best.date + 'T12:00:00').toLocaleDateString(
            'es-AR',
            { weekday: 'long', timeZone: 'UTC' },
          );
          insights.push({
            icon: '🏆',
            text: `Tu mejor día fue el ${dayName} con ${formatCurrency(best.revenue)}`,
            type: 'positive',
          });
        }
      }

      // 3. Top service
      if (raw.charts.topServices.length > 0) {
        const top = raw.charts.topServices[0];
        if (top) {
          const topPct =
            raw.thisMonth.revenue > 0
              ? Math.round((top.revenue / raw.thisMonth.revenue) * 100)
              : 0;
          insights.push({
            icon: '✂️',
            text: `${top.name} es tu servicio estrella (${topPct}% del total)`,
            type: 'neutral',
          });
        }
      }

      // 4. Dominant payment method
      if (raw.charts.byPaymentMethod.length > 0) {
        const dominant = raw.charts.byPaymentMethod.reduce((a, b) =>
          b.revenue > a.revenue ? b : a,
        );
        if (dominant.percentage >= 40) {
          insights.push({
            icon: '💳',
            text: `Tus clientes prefieren pagar con ${dominant.method} (${dominant.percentage}%)`,
            type: 'neutral',
          });
        }
      }

      // 5. Active promotions today
      try {
        const todayPromos =
          await promotionRepository.findActiveForToday(shopId);
        if (todayPromos.length > 0) {
          const promoNames = todayPromos
            .map((p) => p.name)
            .slice(0, 2)
            .join(', ');
          insights.push({
            icon: '🎉',
            text: `Hoy tenés ${todayPromos.length} promo${todayPromos.length > 1 ? 's' : ''} activa${todayPromos.length > 1 ? 's' : ''}: ${promoNames}`,
            type: 'positive',
          });
        }
      } catch {
        // Silently skip if promotions table doesn't exist yet
      }
    }

    return {
      today: raw.today,
      thisMonth: raw.thisMonth,
      charts: raw.charts,
      recentSales: raw.recentSales,
      insights: insights.slice(0, 5),
    };
  },
};
