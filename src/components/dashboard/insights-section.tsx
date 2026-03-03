/**
 * InsightsSection — AI-generated insights.
 */
'use client';

import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface InsightsSectionProps {
  insights: {
    icon: string;
    text: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
  isFree: boolean;
}

export function InsightsSection({ insights, isFree }: InsightsSectionProps) {
  if (isFree) {
    return (
      <div className="bg-card relative overflow-hidden rounded-xl border p-5">
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Insights
        </h3>
        <div className="pointer-events-none space-y-2 blur-sm select-none">
          <div className="rounded-lg border p-3 text-sm">
            📈 Tu facturación subió 23% respecto al mes pasado
          </div>
          <div className="rounded-lg border p-3 text-sm">
            🏆 Tu mejor día fue el viernes con $85.000
          </div>
        </div>
        <div className="bg-card/80 absolute inset-0 flex flex-col items-center justify-center">
          <Lock className="text-muted-foreground mb-2 h-6 w-6" />
          <p className="text-sm font-medium">Desbloqueá con PRO</p>
          <Link
            href="/settings"
            className="text-primary mt-1 text-xs hover:underline"
          >
            Actualizar plan
          </Link>
        </div>
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        Insights
      </h3>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-2 rounded-lg border p-3 text-sm',
              insight.type === 'positive' &&
                'border-emerald-500/20 bg-emerald-500/5',
              insight.type === 'negative' &&
                'border-destructive/20 bg-destructive/5',
              insight.type === 'neutral' && 'border-border',
            )}
          >
            <span className="shrink-0">{insight.icon}</span>
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
