/**
 * SalesFilters — Filtros de historial que actualizan la URL.
 */
'use client';

import { Button } from '@/components/ui/button';
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

interface SalesFiltersProps {
  professionals: { id: string; name: string }[];
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

function startOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function lastMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const end = last.toLocaleDateString('en-CA');
  return { start, end };
}

type Preset = 'today' | 'week' | 'month' | 'lastMonth' | 'custom';

export function SalesFilters({ professionals }: SalesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStart = searchParams.get('start') ?? '';
  const currentEnd = searchParams.get('end') ?? '';
  const currentPro = searchParams.get('professional') ?? '';
  const currentPay = searchParams.get('payment') ?? '';

  const [preset, setPreset] = React.useState<Preset>('today');
  const [customStart, setCustomStart] = React.useState(currentStart);
  const [customEnd, setCustomEnd] = React.useState(currentEnd);

  function updateURL(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams(searchParams.toString());
    // Reset page when filters change
    sp.delete('page');
    for (const [key, val] of Object.entries(params)) {
      if (val) sp.set(key, val);
      else sp.delete(key);
    }
    router.push(`/sales?${sp.toString()}`);
  }

  function applyPreset(p: Preset) {
    setPreset(p);
    const today = todayStr();
    switch (p) {
      case 'today':
        updateURL({ start: today, end: today });
        break;
      case 'week':
        updateURL({ start: startOfWeek(), end: today });
        break;
      case 'month':
        updateURL({ start: startOfMonth(), end: today });
        break;
      case 'lastMonth': {
        const lm = lastMonth();
        updateURL({ start: lm.start, end: lm.end });
        break;
      }
      case 'custom':
        break;
    }
  }

  function applyCustom() {
    if (customStart && customEnd) {
      updateURL({ start: customStart, end: customEnd });
    }
  }

  const presets: { id: Preset; label: string }[] = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'lastMonth', label: 'Anterior' },
    { id: 'custom', label: 'Custom' },
  ];

  // Active filter chips
  const chips: { key: string; label: string }[] = [];
  if (currentPro) {
    const pro = professionals.find((p) => p.id === currentPro);
    chips.push({ key: 'professional', label: pro?.name ?? 'Profesional' });
  }
  if (currentPay) {
    const pm = PAYMENT_METHODS.find((m) => m.id === currentPay);
    chips.push({ key: 'payment', label: pm?.label ?? 'Pago' });
  }

  return (
    <div className="space-y-3">
      {/* Date presets — horizontal scroll on mobile */}
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className={cn(
              'shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
              preset === p.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/40',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      {preset === 'custom' && (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-muted-foreground text-xs">Desde</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground text-xs">Hasta</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <Button size="sm" onClick={applyCustom}>
            Aplicar
          </Button>
        </div>
      )}

      {/* Dropdowns */}
      <div className="flex gap-2">
        <select
          value={currentPro}
          onChange={(e) =>
            updateURL({ professional: e.target.value || undefined })
          }
          className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos los profesionales</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={currentPay}
          onChange={(e) => updateURL({ payment: e.target.value || undefined })}
          className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todo medio de pago</option>
          {PAYMENT_METHODS.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.icon} {pm.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="bg-muted/50 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => updateURL({ [chip.key]: undefined })}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
