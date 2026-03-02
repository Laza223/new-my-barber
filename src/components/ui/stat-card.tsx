/**
 * StatCard — Card para métricas del dashboard.
 * El valor se anima al cargar (count up).
 * Change positivo = verde ▲, negativo = rojo ▼.
 */
'use client';

import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Skeleton } from './skeleton';

interface StatCardProps {
  label: string;
  value: string;
  /** Porcentaje de cambio vs período anterior */
  change?: number;
  /** Descripción del período de comparación */
  changePeriod?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, change, changePeriod, icon, loading, className }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      // Trigger animation after mount
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('bg-card rounded-lg border p-6 shadow-sm', className)}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="mt-3 h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-card rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          {icon && (
            <div className="bg-muted text-muted-foreground rounded-md p-2 [&_svg]:size-4">
              {icon}
            </div>
          )}
        </div>

        <p
          className={cn(
            'font-display mt-2 text-2xl font-bold tracking-tight transition-all duration-500',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
          )}
        >
          {value}
        </p>

        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {change > 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="font-medium text-emerald-500">
                  +{Math.abs(change).toFixed(1)}%
                </span>
              </>
            ) : change < 0 ? (
              <>
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="font-medium text-red-500">
                  {change.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <Minus className="text-muted-foreground h-3 w-3" />
                <span className="text-muted-foreground font-medium">0%</span>
              </>
            )}
            {changePeriod && (
              <span className="text-muted-foreground">vs {changePeriod}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);
StatCard.displayName = 'StatCard';

export { StatCard };
export type { StatCardProps };
