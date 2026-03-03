/**
 * DailyLimitWarning — banner de límite diario del plan FREE.
 */
'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DailyLimitWarningProps {
  todaySalesCount: number;
  dailyLimit: number;
}

export function DailyLimitWarning({
  todaySalesCount,
  dailyLimit,
}: DailyLimitWarningProps) {
  const router = useRouter();
  const remaining = dailyLimit - todaySalesCount;

  // Limit reached
  if (remaining <= 0) {
    return (
      <div className="border-destructive/30 bg-destructive/5 space-y-3 rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <Lock className="text-destructive h-5 w-5" />
          <h3 className="text-sm font-bold">Límite alcanzado</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Llegaste al límite de {dailyLimit} ventas diarias del plan gratuito.
        </p>
        <Button
          onClick={() => router.push('/settings')}
          size="sm"
          className="w-full"
        >
          ACTUALIZAR PLAN
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Warning: ≤3 remaining
  if (remaining <= 3) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-muted-foreground text-xs">
          Te quedan <strong className="text-foreground">{remaining}</strong>{' '}
          {remaining === 1 ? 'venta' : 'ventas'} hoy (plan gratuito)
        </p>
      </div>
    );
  }

  return null;
}
