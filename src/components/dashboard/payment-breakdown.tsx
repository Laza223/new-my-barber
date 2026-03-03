/**
 * PaymentBreakdown — donut chart with Recharts.
 */
'use client';

import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PaymentBreakdownProps {
  data: { method: string; revenue: number; percentage: number }[];
}

const COLORS: Record<string, string> = {
  cash: '#10b981',
  transfer: '#3b82f6',
  mercadopago: '#06b6d4',
  debit: '#f59e0b',
  credit: '#f97316',
};

export function PaymentBreakdown({ data }: PaymentBreakdownProps) {
  const total = data.reduce((s, d) => s + d.revenue, 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-5">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Medios de pago
        </h3>
        <p className="text-muted-foreground py-8 text-center text-sm">
          Sin ventas este mes
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: PAYMENT_METHODS.find((m) => m.id === d.method)?.label ?? d.method,
    value: d.revenue,
    color: COLORS[d.method] ?? '#94a3b8',
    percentage: d.percentage,
  }));

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">
        Medios de pago
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload as
                    | { name: string; value: number; percentage: number }
                    | undefined;
                  if (!item) return null;
                  return (
                    <div className="bg-card rounded-lg border px-3 py-2 text-sm shadow-md">
                      <p className="font-medium">{item.name}</p>
                      <p>
                        {formatCurrency(item.value)} ({item.percentage}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground flex-1 truncate">
                {item.name}
              </span>
              <span className="text-xs font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
