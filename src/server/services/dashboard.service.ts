/**
 * Dashboard Service — genera insights inteligentes.
 */
import type { DashboardData } from '@/lib/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import { requireOwner } from '@/server/lib/get-session';
import { dashboardRepository } from '@/server/repositories/dashboard.repository';
import { subscriptionService } from '@/server/services/subscription.service';

export const dashboardService = {
  async getDashboard(shopId: string, _userId: string): Promise<DashboardData> {
    await requireOwner(shopId);

    const raw = await dashboardRepository.getDashboard(shopId);

    // Generate insights (PRO/BUSINESS only)
    const access = await subscriptionService.checkAccess(shopId, 'reports');
    const insights: DashboardData['insights'] = [];

    if (access.allowed) {
      const meta = raw._meta;

      // Revenue trend vs last month
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

      // Best day
      if (raw.charts.last7Days.length > 0) {
        const best = raw.charts.last7Days.reduce((a, b) =>
          b.revenue > a.revenue ? b : a,
        );
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

      // Top service
      if (raw.charts.topServices.length > 0) {
        const top = raw.charts.topServices[0]!;
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

    return {
      today: raw.today,
      thisMonth: raw.thisMonth,
      charts: raw.charts,
      recentSales: raw.recentSales,
      insights: insights.slice(0, 3),
    };
  },
};
