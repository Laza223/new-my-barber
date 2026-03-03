/**
 * Paso 2: Servicios — seleccionar sugeridos + agregar custom.
 * Precios en ARS. Internamente se guardan en centavos.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SUGGESTED_SERVICES } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

export interface ServiceItem {
  name: string;
  price: number; // centavos
  selected: boolean;
  isCustom?: boolean;
}

interface StepServicesProps {
  data: ServiceItem[];
  onNext: (data: ServiceItem[]) => void;
  onBack: () => void;
}

function getInitialServices(existing: ServiceItem[]): ServiceItem[] {
  if (existing.length > 0) return existing;

  return SUGGESTED_SERVICES.map((s, i) => ({
    name: s.name,
    price: s.priceCents,
    selected: i < 3, // First 3 selected by default
  }));
}

export function StepServices({ data, onNext, onBack }: StepServicesProps) {
  const [services, setServices] = React.useState<ServiceItem[]>(() =>
    getInitialServices(data),
  );
  const [error, setError] = React.useState('');

  function toggleService(index: number) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s)),
    );
  }

  function updatePrice(index: number, value: string) {
    const cents = Math.round(Number(value.replace(/\D/g, '')) * 100);
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, price: cents } : s)),
    );
  }

  function updateName(index: number, name: string) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, name } : s)),
    );
  }

  function addCustomService() {
    setServices((prev) => [
      ...prev,
      { name: '', price: 0, selected: true, isCustom: true },
    ]);
  }

  function removeService(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNext() {
    const selected = services.filter((s) => s.selected);
    if (selected.length === 0) {
      setError('Seleccioná al menos un servicio');
      return;
    }
    // Validate custom services have name and price
    const invalid = selected.find((s) => !s.name.trim() || s.price < 100);
    if (invalid) {
      setError('Cada servicio debe tener nombre y precio (mínimo $1)');
      return;
    }
    setError('');
    onNext(services);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold">
          ¿Qué servicios ofrecés?
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Seleccioná los que apliquen y ajustá los precios.
        </p>
      </div>

      <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
        {services.map((service, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 transition-colors',
              service.selected
                ? 'border-primary/40 bg-primary/5'
                : 'border-border/50 opacity-60',
            )}
          >
            <Checkbox
              checked={service.selected}
              onCheckedChange={() => toggleService(index)}
            />

            <div className="flex min-w-0 flex-1 items-center gap-2">
              {service.isCustom ? (
                <Input
                  placeholder="Nombre del servicio"
                  value={service.name}
                  onChange={(e) => updateName(index, e.target.value)}
                  className="h-8 text-sm"
                />
              ) : (
                <span className="truncate text-sm font-medium">
                  {service.name}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="w-24">
                <Input
                  placeholder="$0"
                  value={service.price > 0 ? String(service.price / 100) : ''}
                  onChange={(e) => updatePrice(index, e.target.value)}
                  className="h-8 text-right text-sm"
                  inputMode="numeric"
                />
              </div>
              {service.price > 0 && (
                <span className="text-muted-foreground hidden w-16 text-right text-xs sm:block">
                  {formatCurrency(service.price)}
                </span>
              )}
              {service.isCustom && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCustomService}
        className="w-full"
      >
        <Plus className="h-4 w-4" />
        Agregar servicio personalizado
      </Button>

      {error && <p className="text-destructive text-center text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Siguiente
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
