/**
 * Progress — Barra de progreso con color dinámico y porcentaje.
 * Rojo (<30%), Amarillo (30-70%), Verde (>70%).
 */
'use client';

import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

function getProgressColor(value: number): string {
  if (value < 30) return 'bg-red-500';
  if (value < 70) return 'bg-amber-500';
  return 'bg-emerald-500';
}

interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  /** Muestra el porcentaje como texto adentro de la barra */
  showPercentage?: boolean;
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, showPercentage, ...props }, ref) => {
  const safeValue = Math.min(100, Math.max(0, value ?? 0));
  const colorClass = getProgressColor(safeValue);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        showPercentage && 'h-5',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full flex-1 rounded-full transition-all duration-500 ease-out',
          colorClass,
          showPercentage && 'flex items-center justify-end',
        )}
        style={{ width: `${safeValue}%` }}
      >
        {showPercentage && safeValue > 10 && (
          <span className="px-2 text-[10px] font-bold text-white">
            {Math.round(safeValue)}%
          </span>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
export type { ProgressProps };
