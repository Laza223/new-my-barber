/**
 * TopServicesChart — horizontal bar chart.
 */
'use client';

import { formatCurrency } from '@/lib/utils';

interface TopServicesChartProps {
  data: { name: string; revenue: number; count: number }[];
}

export function TopServicesChart({ data }: TopServicesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-5">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Servicios top
        </h3>
        <p className="text-muted-foreground py-4 text-center text-sm">
          Sin datos
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">
        Servicios top
      </h3>
      <div className="space-y-3">
        {data.map((item) => {
          const width = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2 shrink-0">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${width}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {item.count} {item.count === 1 ? 'venta' : 'ventas'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
