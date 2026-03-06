/**
 * PromotionsTab — CRUD for promotional days.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WEEKDAYS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  createPromotionAction,
  deletePromotionAction,
  getPromotionsAction,
  updatePromotionAction,
} from '@/server/actions/promotion.actions';
import { Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface PromotionsTabProps {
  shopId: string;
  services: { id: string; name: string }[];
}

interface PromoRow {
  id: string;
  name: string;
  discountPercent: number;
  dayOfWeek: number;
  serviceId: string | null;
  isActive: boolean;
  serviceName: string | null;
}

export function PromotionsTab({ shopId, services }: PromotionsTabProps) {
  const [promos, setPromos] = React.useState<PromoRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [formName, setFormName] = React.useState('');
  const [formDiscount, setFormDiscount] = React.useState('');
  const [formDay, setFormDay] = React.useState<number | null>(null);
  const [formService, setFormService] = React.useState<string>('');

  // Loading
  const loadPromos = React.useCallback(async () => {
    const result = await getPromotionsAction(shopId);
    if (result.success) {
      setPromos(result.data as PromoRow[]);
    }
    setLoading(false);
  }, [shopId]);

  React.useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  function resetForm() {
    setFormName('');
    setFormDiscount('');
    setFormDay(null);
    setFormService('');
    setShowForm(false);
  }

  async function handleCreate() {
    if (!formName.trim() || !formDiscount || formDay === null) {
      toast.error('Completá todos los campos');
      return;
    }
    setCreating(true);
    const fd = new FormData();
    fd.set('name', formName.trim());
    fd.set('discountPercent', formDiscount);
    fd.set('dayOfWeek', String(formDay));
    if (formService) fd.set('serviceId', formService);

    const result = await createPromotionAction(shopId, fd);
    if (result.success) {
      toast.success('Promoción creada');
      resetForm();
      loadPromos();
    } else {
      toast.error(result.error ?? 'Error al crear');
    }
    setCreating(false);
  }

  async function handleToggle(promo: PromoRow) {
    const fd = new FormData();
    fd.set('isActive', String(!promo.isActive));
    const result = await updatePromotionAction(promo.id, shopId, fd);
    if (result.success) {
      setPromos((prev) =>
        prev.map((p) =>
          p.id === promo.id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } else {
      toast.error(result.error ?? 'Error');
    }
  }

  async function handleDelete(id: string) {
    const result = await deletePromotionAction(id, shopId);
    if (result.success) {
      setPromos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Promoción eliminada');
    } else {
      toast.error(result.error ?? 'Error');
    }
  }

  const dayLabel = (d: number) =>
    WEEKDAYS.find((w) => w.id === d)?.fullLabel ?? `Día ${d}`;

  if (loading) {
    return (
      <div className="bg-card flex items-center justify-center rounded-xl border p-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card space-y-4 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Promociones</h2>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Nueva
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Las promociones se aplican automáticamente al registrar una venta en el
        día configurado.
      </p>

      {/* Create form */}
      {showForm && (
        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-sm font-medium">Nueva promoción</p>
          <Input
            placeholder="Nombre (ej: Martes de descuento)"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            maxLength={100}
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Descuento %"
              min={1}
              max={100}
              value={formDiscount}
              onChange={(e) => setFormDiscount(e.target.value)}
              className="w-28"
            />
            <select
              value={formDay ?? ''}
              onChange={(e) =>
                setFormDay(e.target.value ? Number(e.target.value) : null)
              }
              className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Día de la semana</option>
              {WEEKDAYS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullLabel}
                </option>
              ))}
            </select>
          </div>
          <select
            value={formService}
            onChange={(e) => setFormService(e.target.value)}
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todos los servicios</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Crear'
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Promotions list */}
      {promos.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Sparkles className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No tenés promociones configuradas
          </p>
          <p className="text-muted-foreground text-xs">
            Creá una para ofrecer descuentos automáticos ciertos días
          </p>
        </div>
      )}

      {promos.length > 0 && (
        <div className="divide-y rounded-lg border">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={cn(
                'flex items-center justify-between gap-3 px-4 py-3',
                !promo.isActive && 'opacity-50',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{promo.name}</p>
                <p className="text-muted-foreground text-xs">
                  {dayLabel(promo.dayOfWeek)} · -{promo.discountPercent}%
                  {promo.serviceName
                    ? ` · ${promo.serviceName}`
                    : ' · Todos los servicios'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={promo.isActive ? 'outline' : 'default'}
                  onClick={() => handleToggle(promo)}
                  className="h-7 px-2 text-xs"
                >
                  {promo.isActive ? 'Pausar' : 'Activar'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(promo.id)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
