/**
 * Paso 4: Primera venta de prueba (opcional).
 * Mini versión del flujo de venta.
 */
'use client';

import { Button } from '@/components/ui/button';
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowRight, CheckCircle2, SkipForward } from 'lucide-react';
import * as React from 'react';

interface StepFirstSaleProps {
  services: { name: string; price: number }[];
  professionals: { name: string }[];
  ownerName: string;
  onNext: () => void;
  onSkip: () => void;
}

export function StepFirstSale({
  services,
  professionals,
  ownerName,
  onNext,
  onSkip,
}: StepFirstSaleProps) {
  const allPros = [{ name: ownerName }, ...professionals];
  const [selectedPro, setSelectedPro] = React.useState<number | null>(null);
  const [selectedService, setSelectedService] = React.useState<number | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] = React.useState<number | null>(
    null,
  );
  const [done, setDone] = React.useState(false);

  function handleConfirm() {
    // Simular la venta (no llama al backend en onboarding)
    setDone(true);
    setTimeout(() => onNext(), 1500);
  }

  const canConfirm =
    selectedPro !== null &&
    selectedService !== null &&
    selectedPayment !== null;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="animate-bounce">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <p className="font-display text-lg font-bold">¡Venta registrada!</p>
        <p className="text-muted-foreground text-sm">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold">
          🎉 ¡Probá cómo funciona!
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Simulá una venta de prueba. Es opcional.
        </p>
      </div>

      {/* Professional selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">¿Quién atendió?</label>
        <div className="flex flex-wrap gap-2">
          {allPros.map((pro, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedPro(i)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm transition-all',
                selectedPro === i
                  ? 'border-primary bg-primary/10 font-medium'
                  : 'border-border hover:border-primary/40',
              )}
            >
              {pro.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">¿Qué servicio?</label>
        <div className="grid grid-cols-2 gap-2">
          {services.map((svc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedService(i)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left transition-all',
                selectedService === i
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="truncate text-sm font-medium">{svc.name}</div>
              <div className="text-muted-foreground text-xs">
                {formatCurrency(svc.price)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="space-y-2">
        <label className="text-sm font-medium">¿Cómo pagó?</label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((pm, i) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setSelectedPayment(i)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm transition-all',
                selectedPayment === i
                  ? 'border-primary bg-primary/10 font-medium'
                  : 'border-border hover:border-primary/40',
              )}
            >
              {pm.icon} {pm.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          <SkipForward className="h-4 w-4" />
          Omitir
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1"
          disabled={!canConfirm}
        >
          Confirmar venta
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
