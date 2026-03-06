/**
 * DashboardPage — main dashboard with auto-refresh.
 */
'use client';

import type { DashboardData } from '@/lib/types/dashboard';
import { getDashboardAction } from '@/server/actions/dashboard.actions';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as React from 'react';
import { InsightsSection } from './insights-section';
import { MonthProgressCard } from './month-progress-card';
import { ProfessionalRanking } from './professional-ranking';
import { RecentSalesList } from './recent-sales-list';
import { TodayCard } from './today-card';
import { TopServicesChart } from './top-services-chart';

/* ── Lazy-loaded recharts components (keep out of initial bundle) ── */
const RevenueChart = dynamic(
  () => import('./revenue-chart').then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card animate-pulse rounded-xl border p-5">
        <div className="bg-muted mb-4 h-4 w-24 rounded" />
        <div className="bg-muted h-[200px] rounded-lg" />
      </div>
    ),
  },
);

const PaymentBreakdown = dynamic(
  () => import('./payment-breakdown').then((m) => m.PaymentBreakdown),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card animate-pulse rounded-xl border p-5">
        <div className="bg-muted mb-4 h-4 w-28 rounded" />
        <div className="bg-muted mx-auto h-[140px] w-[140px] rounded-full" />
      </div>
    ),
  },
);

interface DashboardPageProps {
  shopId: string;
  initialData: DashboardData;
}

export function DashboardPage({ shopId, initialData }: DashboardPageProps) {
  const [data, setData] = React.useState(initialData);

  // Auto-refresh every 60 seconds
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getDashboardAction(shopId);
      if (result.success) setData(result.data);
    }, 60_000);
    return () => clearInterval(interval);
  }, [shopId]);

  // Determine if free plan (no insights)
  const isFree =
    data.insights.length === 0 && data.thisMonth.goalAmount === null;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TodayCard
          revenue={data.today.revenue}
          salesCount={data.today.salesCount}
          comparedToYesterday={data.today.comparedToYesterday}
        />
        <MonthProgressCard
          revenue={data.thisMonth.revenue}
          goalAmount={data.thisMonth.goalAmount}
          goalProgress={data.thisMonth.goalProgress}
          projectedRevenue={data.thisMonth.projectedRevenue}
          isFree={isFree}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart data={data.charts.last7Days} />
        <PaymentBreakdown data={data.charts.byPaymentMethod} />
      </div>

      {/* Rankings row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopServicesChart data={data.charts.topServices} />
        <ProfessionalRanking data={data.charts.byProfessional} />
      </div>

      {/* Insights */}
      <InsightsSection insights={data.insights} isFree={isFree} />

      {/* Recent sales */}
      <RecentSalesList sales={data.recentSales} />

      {/* Mobile FAB — Nueva venta */}
      <Link
        href="/new-sale"
        className="bg-primary text-primary-foreground fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 md:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
