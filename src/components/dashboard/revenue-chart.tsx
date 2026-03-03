/**
 * RevenueChart — last 7 days area/line chart with Recharts.
 */
'use client';

import { formatCurrency } from '@/lib/utils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenue: number; sales: number }[];
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-AR', { weekday: 'short', timeZone: 'UTC' });
}

function formatK(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    day: formatDay(d.date),
    revenue: d.revenue / 100,
    sales: d.sales,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-5">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Últimos 7 días
        </h3>
        <p className="text-muted-foreground py-8 text-center text-sm">
          Sin datos todavía
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">
        Últimos 7 días
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="day"
            className="fill-muted-foreground text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            className="fill-muted-foreground text-xs"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatK}
            width={45}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload as
                | { day: string; revenue: number; sales: number }
                | undefined;
              if (!item) return null;
              return (
                <div className="bg-card rounded-lg border px-3 py-2 text-sm shadow-md">
                  <p className="font-medium">{item.day}</p>
                  <p className="text-primary">
                    {formatCurrency(item.revenue * 100)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.sales} ventas
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#revGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
