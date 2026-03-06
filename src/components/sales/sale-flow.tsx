/**
 * SaleFlow — Compact sale form, no scroll needed.
 * Designed for inline use (modal/sheet) and standalone page.
 */
'use client';

import { Button } from '@/components/ui/button';
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import { registerSaleAction } from '@/server/actions/sale.actions';
import { ArrowLeft, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { DailyLimitWarning } from './daily-limit-warning';

/* ── Avatar colors ── */
const AVATAR_COLORS = [
  'bg-cyan-500/15 text-cyan-600 border-cyan-500/40',
  'bg-violet-500/15 text-violet-600 border-violet-500/40',
  'bg-amber-500/15 text-amber-600 border-amber-500/40',
  'bg-emerald-500/15 text-emerald-600 border-emerald-500/40',
  'bg-rose-500/15 text-rose-600 border-rose-500/40',
  'bg-sky-500/15 text-sky-600 border-sky-500/40',
  'bg-orange-500/15 text-orange-600 border-orange-500/40',
  'bg-indigo-500/15 text-indigo-600 border-indigo-500/40',
];

/* ── Types ── */
interface SaleFlowProps {
  shopId: string;
  professionals: {
    id: string;
    name: string;
    colorIndex: number;
    isOwner: boolean;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
    duration: number | null;
    sortOrder: number;
  }[];
  todaySalesCount: number;
  dailySalesLimit: number | null;
  canSell: boolean;
  /** Called after a successful sale (e.g. to close a sheet) */
  onSuccess?: () => void;
}

export function SaleFlow({
  shopId,
  professionals,
  services,
  todaySalesCount: initialTodayCount,
  dailySalesLimit,
  canSell: initialCanSell,
  onSuccess,
}: SaleFlowProps) {
  const router = useRouter();

  const autoProId =
    professionals.length === 1 ? (professionals[0]?.id ?? null) : null;
  const autoSvcId = services.length === 1 ? (services[0]?.id ?? null) : null;

  const [selectedPro, setSelectedPro] = React.useState<string | null>(
    autoProId,
  );
  const [selectedSvc, setSelectedSvc] = React.useState<string | null>(
    autoSvcId,
  );
  const [selectedPay, setSelectedPay] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [successPrice, setSuccessPrice] = React.useState(0);
  const [todaySalesCount, setTodaySalesCount] =
    React.useState(initialTodayCount);
  const [canSell, setCanSell] = React.useState(initialCanSell);

  const sortedServices = React.useMemo(
    () => [...services].sort((a, b) => a.sortOrder - b.sortOrder),
    [services],
  );

  const currentSvc = services.find((s) => s.id === selectedSvc);
  const isReady = selectedPro && selectedSvc && selectedPay;
  const [idempotencyKey, setIdempotencyKey] = React.useState(() => {
    // crypto.randomUUID() no existe en Safari < 15.4 / iOS < 15.4
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: UUID v4 manual
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  });

  async function handleSubmit() {
    if (!isReady || isSubmitting) return;
    setIsSubmitting(true);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50]);
    }

    try {
      const formData = new FormData();
      formData.append('professionalId', selectedPro);
      formData.append('serviceId', selectedSvc);
      formData.append('paymentMethod', selectedPay);
      formData.append('idempotencyKey', idempotencyKey);

      const result = await registerSaleAction(shopId, formData);

      if (result.success) {
        const salePrice = currentSvc?.price ?? 0;
        setTodaySalesCount((prev) => prev + 1);
        setSuccessPrice(salePrice);
        setSelectedSvc(autoSvcId);
        setSelectedPay(null);
        // Generate new idempotency key for next sale
        setIdempotencyKey(crypto.randomUUID());
        // Show success animation
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (onSuccess) {
            onSuccess();
          } else {
            toast.success(`¡Venta registrada! ${formatCurrency(salePrice)}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 1200);
      } else {
        toast.error(result.error);
        if (result.code === 'PLAN_LIMIT_EXCEEDED') {
          setCanSell(false);
        }
      }
    } catch {
      toast.error('Error al registrar la venta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {/* ── Success overlay ── */}
      {showSuccess && (
        <div className="bg-background/95 absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl">
          <div className="sale-success-check">
            <svg viewBox="0 0 52 52" className="h-16 w-16">
              <circle
                className="sale-success-circle"
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
              />
              <path
                className="sale-success-tick"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 26l7 7 15-15"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-emerald-600">
            ¡Venta registrada!
          </p>
          <p className="text-muted-foreground text-xs">
            {formatCurrency(successPrice)}
          </p>
          {/* CSS animations */}
          <style>{`
            .sale-success-circle {
              stroke-dasharray: 151;
              stroke-dashoffset: 151;
              animation: sale-draw-circle 0.4s ease-out forwards;
            }
            .sale-success-tick {
              stroke-dasharray: 40;
              stroke-dashoffset: 40;
              animation: sale-draw-tick 0.3s 0.3s ease-out forwards;
            }
            @keyframes sale-draw-circle {
              to { stroke-dashoffset: 0; }
            }
            @keyframes sale-draw-tick {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>
      )}

      <div className="space-y-5">
        {/* Header — hidden when inside a sheet */}
        {!onSuccess && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/inicio')}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold">Nueva venta</h1>
          </div>
        )}

        {/* Daily limit warning */}
        {dailySalesLimit && (
          <DailyLimitWarning
            todaySalesCount={todaySalesCount}
            dailyLimit={dailySalesLimit}
          />
        )}

        {!canSell ? (
          <DailyLimitWarning
            todaySalesCount={todaySalesCount}
            dailyLimit={dailySalesLimit ?? 10}
          />
        ) : (
          <>
            {/* ── 1. Professional (chip-style) ── */}
            {professionals.length > 1 && (
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  ¿Quién atendió?
                </p>
                <div className="flex flex-wrap gap-2">
                  {professionals.map((pro) => {
                    const isSelected = selectedPro === pro.id;
                    const colors =
                      AVATAR_COLORS[pro.colorIndex % AVATAR_COLORS.length] ??
                      AVATAR_COLORS[0];

                    return (
                      <button
                        key={pro.id}
                        type="button"
                        onClick={() => setSelectedPro(pro.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-[0.97]',
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary ring-primary/20 ring-1'
                            : 'border-border bg-card hover:border-primary/40',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                            isSelected ? 'bg-primary/20 text-primary' : colors,
                          )}
                        >
                          {getInitials(pro.name)}
                        </div>
                        {pro.name}
                        {pro.isOwner && (
                          <Crown className="h-3 w-3 text-amber-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 2. Services (compact grid) ── */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                ¿Qué servicio?
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {sortedServices.map((svc) => {
                  const isSelected = selectedSvc === svc.id;

                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedSvc(svc.id)}
                      className={cn(
                        'flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-all active:scale-[0.97]',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-primary/20 ring-1'
                          : 'border-border bg-card hover:border-primary/40',
                      )}
                    >
                      <span className="truncate pr-2 text-sm font-medium">
                        {svc.name}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 text-sm font-bold',
                          isSelected ? 'text-primary' : 'text-muted-foreground',
                        )}
                      >
                        {formatCurrency(svc.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. Payment method (chip row) ── */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                ¿Cómo pagó?
              </p>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPay === pm.id;

                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPay(pm.id)}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary ring-primary/20 ring-1'
                          : 'border-border bg-card hover:border-primary/40 text-muted-foreground',
                      )}
                    >
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── CTA ── */}
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!isReady || isSubmitting}
              className={cn(
                'w-full text-base font-bold transition-all',
                isReady ? 'min-h-[48px]' : 'min-h-[44px] opacity-60',
              )}
              size="lg"
            >
              {isReady && currentSvc
                ? `REGISTRAR  ·  ${formatCurrency(currentSvc.price)}`
                : 'REGISTRAR VENTA'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
