/**
 * TrialBanner — countdown banner for trial users.
 */
'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Clock, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

interface TrialBannerProps {
  trialEndsAt: string; // ISO date
}

export function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const lastDismiss = localStorage.getItem('trial-banner-dismiss');
    if (lastDismiss) {
      const dismissDate = new Date(lastDismiss);
      const today = new Date();
      if (
        dismissDate.getFullYear() === today.getFullYear() &&
        dismissDate.getMonth() === today.getMonth() &&
        dismissDate.getDate() === today.getDate()
      ) {
        setDismissed(true);
      }
    }
  }, []);

  if (dismissed) return null;

  const endsAt = new Date(trialEndsAt);
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (daysLeft <= 0) return null;

  const urgency = daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'warning' : 'info';

  function handleDismiss() {
    localStorage.setItem('trial-banner-dismiss', new Date().toISOString());
    setDismissed(true);
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2 text-sm',
        urgency === 'urgent' &&
          'bg-destructive/10 text-destructive border-destructive/20 border-b',
        urgency === 'warning' &&
          'border-b border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        urgency === 'info' && 'bg-muted border-b',
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0" />
        <span>
          Te quedan <strong>{daysLeft}</strong>{' '}
          {daysLeft === 1 ? 'día' : 'días'} de prueba gratuita
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 font-medium hover:underline"
        >
          Actualizar plan
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
