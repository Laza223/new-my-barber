/**
 * ProfessionalRanking — ranked list with colored bars.
 */
'use client';

import { formatCurrency, getInitials } from '@/lib/utils';

interface ProfessionalRankingProps {
  data: {
    id: string;
    name: string;
    revenue: number;
    commission: number;
    sales: number;
    colorIndex: number;
  }[];
}

const BAR_COLORS = [
  'bg-cyan-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-orange-500',
  'bg-indigo-500',
];

export function ProfessionalRanking({ data }: ProfessionalRankingProps) {
  if (data.length <= 1) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">
        Ranking profesionales
      </h3>
      <div className="space-y-3">
        {data.map((pro, idx) => {
          const width = maxRevenue > 0 ? (pro.revenue / maxRevenue) * 100 : 0;
          const barColor =
            BAR_COLORS[pro.colorIndex % BAR_COLORS.length] ?? BAR_COLORS[0];

          return (
            <div key={pro.id} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-5 text-sm font-bold">
                  {idx + 1}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${barColor}`}
                >
                  {getInitials(pro.name)}
                </div>
                <span className="flex-1 truncate text-sm font-medium">
                  {pro.name}
                </span>
                <span className="shrink-0 text-sm font-bold">
                  {formatCurrency(pro.revenue)}
                </span>
              </div>
              <div className="bg-muted ml-12 h-1.5 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
