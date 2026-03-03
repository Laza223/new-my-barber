/**
 * MonthProgressCard — monthly progress with animated bar.
 */
'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

interface MonthProgressCardProps {
  revenue: number;
  goalAmount: number | null;
  goalProgress: number | null;
  projectedRevenue: number;
  isFree: boolean;
}

export function MonthProgressCard({
  revenue,
  goalAmount,
  goalProgress,
  projectedRevenue,
  isFree,
}: MonthProgressCardProps) {
  const [barWidth, setBarWidth] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(goalProgress ?? 0);
    }, 200);
    return () => clearTimeout(timer);
  }, [goalProgress]);

  const barColor =
    barWidth < 30
      ? 'bg-destructive'
      : barWidth < 70
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <div className="bg-card space-y-3 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Este mes</span>
        <span className="text-xl">📊</span>
      </div>
      <div className="font-display text-2xl font-bold">
        {formatCurrency(revenue)}
      </div>

      {/* Progress bar */}
      {goalAmount && goalProgress !== null ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Meta: {formatCurrency(goalAmount)}
            </span>
            <span className="font-bold">{goalProgress}%</span>
          </div>
          <div className="bg-muted h-2.5 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000 ease-out',
                barColor,
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          {goalAmount > revenue && (
            <p className="text-muted-foreground text-xs">
              Te faltan {formatCurrency(goalAmount - revenue)} para la meta
            </p>
          )}
        </div>
      ) : isFree ? (
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Lock className="h-3.5 w-3.5" />
          <span>Meta mensual disponible en plan Individual</span>
        </div>
      ) : (
        <Link href="/settings" className="text-primary text-xs hover:underline">
          Configurar meta mensual →
        </Link>
      )}

      {/* Projection */}
      <div className="text-muted-foreground text-xs">
        Proyección:{' '}
        <strong className="text-foreground">
          {formatCurrency(projectedRevenue)}
        </strong>
      </div>
    </div>
  );
}
