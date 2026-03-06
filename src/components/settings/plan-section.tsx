/**
 * PlanSection — plan comparison cards + upgrade/downgrade.
 */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLANS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  cancelSubscriptionAction,
  createCheckoutAction,
} from '@/server/actions/subscription.actions';
import { ArrowRight, Check, Crown, Loader2, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface PlanSectionProps {
  shopId: string;
  currentPlan: string;
  status: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

const PLAN_FEATURES = [
  { label: 'Profesionales', free: '1', individual: '1', business: 'Hasta 10' },
  {
    label: 'Servicios',
    free: '3',
    individual: 'Ilimitados',
    business: 'Ilimitados',
  },
  {
    label: 'Ventas diarias',
    free: '10',
    individual: 'Ilimitadas',
    business: 'Ilimitadas',
  },
  {
    label: 'Historial',
    free: '7 días',
    individual: 'Ilimitado',
    business: 'Ilimitado',
  },
  {
    label: 'Exportar (PDF/Excel)',
    free: false,
    individual: true,
    business: true,
  },
  { label: 'Meta mensual', free: false, individual: true, business: true },
  { label: 'Liquidaciones', free: false, individual: false, business: true },
  { label: 'Insights', free: false, individual: false, business: true },
  { label: 'Resumen WhatsApp', free: false, individual: false, business: true },
];

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-4 w-4 text-emerald-500" />
    ) : (
      <X className="text-muted-foreground/40 h-4 w-4" />
    );
  }
  return <span className="text-sm">{value}</span>;
}

export function PlanSection({
  shopId,
  currentPlan,
  status,
  trialEndsAt,
  currentPeriodEnd,
}: PlanSectionProps) {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);

  const isTrial = status === 'trialing';
  const trialDaysLeft = trialEndsAt
    ? Math.max(
        0,
        Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000),
      )
    : 0;

  async function handleUpgrade(planId: 'individual' | 'business') {
    setLoading(planId);
    const result = await createCheckoutAction(shopId, planId);
    if (result.success) {
      window.location.href = result.data.checkoutUrl;
    } else {
      toast.error(result.error);
      setLoading(null);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    const result = await cancelSubscriptionAction(shopId);
    if (result.success) {
      toast.success(
        'Suscripción cancelada. Seguirás con acceso hasta fin de período.',
      );
      setCancelOpen(false);
      window.location.reload();
    } else {
      toast.error(result.error);
    }
    setCancelling(false);
  }

  const plans = [
    { key: 'free' as const, data: PLANS.FREE },
    { key: 'individual' as const, data: PLANS.INDIVIDUAL },
    { key: 'business' as const, data: PLANS.BUSINESS },
  ];

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {isTrial && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <strong>Prueba gratuita</strong> — Te quedan {trialDaysLeft} días.
          Todo desbloqueado durante el trial.
        </div>
      )}

      {status === 'cancelled' && (
        <div className="border-destructive/30 bg-destructive/5 rounded-lg border px-4 py-3 text-sm">
          <strong>Suscripción cancelada</strong>
          {currentPeriodEnd && (
            <span>
              {' '}
              — Acceso hasta{' '}
              {new Date(currentPeriodEnd).toLocaleDateString('es-AR')}
            </span>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map(({ key, data }) => {
          const isCurrent = currentPlan === key;
          const isPopular = key === 'individual';

          return (
            <div
              key={key}
              className={cn(
                'relative space-y-4 rounded-xl border p-5',
                isCurrent && 'border-primary ring-primary ring-1',
                isPopular && !isCurrent && 'border-amber-500/50',
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-white">
                    <Crown className="h-3 w-3" /> Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-primary text-primary-foreground inline-flex rounded-full px-3 py-0.5 text-xs font-bold">
                    Tu plan
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold">{data.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {data.description}
                </p>
              </div>

              <div>
                <span className="font-display text-2xl font-bold">
                  {data.priceCents === 0 ? 'Gratis' : data.priceDisplay}
                </span>
                {data.priceCents > 0 && (
                  <span className="text-muted-foreground text-sm">/mes</span>
                )}
              </div>

              {/* CTA */}
              {isCurrent ? (
                currentPlan !== 'free' && status !== 'cancelled' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancelar plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Plan actual
                  </Button>
                )
              ) : key === 'free' ? null : (
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!!loading}
                  onClick={() => handleUpgrade(key)}
                >
                  {loading === key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Elegir plan
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature comparison table */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-center font-medium">Free</th>
              <th className="px-4 py-3 text-center font-medium">Individual</th>
              <th className="px-4 py-3 text-center font-medium">Business</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {PLAN_FEATURES.map((feature) => (
              <tr key={feature.label} className="hover:bg-muted/20">
                <td className="text-muted-foreground px-4 py-2.5">
                  {feature.label}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.free} />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.individual} />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.business} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
            <DialogDescription>
              Perderás acceso a las funcionalidades premium al final del período
              actual. Podés reactivar en cualquier momento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
              className="flex-1"
            >
              Mantener
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              loading={cancelling}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
