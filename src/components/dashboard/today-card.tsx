/**
 * TodayCard — today's revenue with count-up and vs yesterday.
 */
'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import * as React from 'react';

interface TodayCardProps {
  revenue: number;
  salesCount: number;
  comparedToYesterday: number;
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export function TodayCard({
  revenue,
  salesCount,
  comparedToYesterday,
}: TodayCardProps) {
  const animatedRevenue = useCountUp(revenue);

  return (
    <div className="bg-card space-y-2 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          Facturación de hoy
        </span>
        <span className="text-xl">💰</span>
      </div>
      <div className="font-display text-2xl font-bold">
        {formatCurrency(animatedRevenue)}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {salesCount} {salesCount === 1 ? 'venta' : 'ventas'}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 font-medium',
            comparedToYesterday > 0 && 'text-emerald-500',
            comparedToYesterday < 0 && 'text-destructive',
            comparedToYesterday === 0 && 'text-muted-foreground',
          )}
        >
          {comparedToYesterday > 0 && <TrendingUp className="h-3.5 w-3.5" />}
          {comparedToYesterday < 0 && <TrendingDown className="h-3.5 w-3.5" />}
          {comparedToYesterday === 0 && <Minus className="h-3.5 w-3.5" />}
          {comparedToYesterday > 0 && '+'}
          {comparedToYesterday}% vs ayer
        </span>
      </div>
    </div>
  );
}
