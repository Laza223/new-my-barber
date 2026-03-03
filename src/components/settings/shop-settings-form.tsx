/**
 * ShopSettingsForm — edit shop details + monthly goal.
 */
'use client';

import { CurrencyInput } from '@/components/services/currency-input';
import { Button } from '@/components/ui/button';
import {
  updateShopAction,
  updateShopSettingsAction,
} from '@/server/actions/shop.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const shopFormSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

interface ShopSettingsFormProps {
  shopId: string;
  initialData: {
    name: string;
    address: string | null;
    phone: string | null;
    monthlyGoal: number | null;
  };
}

export function ShopSettingsForm({
  shopId,
  initialData,
}: ShopSettingsFormProps) {
  const [saving, setSaving] = React.useState(false);
  const [goalCents, setGoalCents] = React.useState(
    initialData.monthlyGoal ?? 0,
  );
  const [savingGoal, setSavingGoal] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: initialData.name,
      address: initialData.address ?? '',
      phone: initialData.phone ?? '',
    },
  });

  async function onSubmit(data: ShopFormValues) {
    setSaving(true);
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.address) formData.append('address', data.address);
    if (data.phone) formData.append('phone', data.phone);

    const result = await updateShopAction(shopId, formData);
    if (result.success) {
      toast.success('Datos actualizados');
    } else {
      toast.error(result.error);
    }
    setSaving(false);
  }

  async function handleSaveGoal() {
    setSavingGoal(true);
    const formData = new FormData();
    formData.append('monthlyGoal', String(goalCents));

    const result = await updateShopSettingsAction(shopId, formData);
    if (result.success) {
      toast.success('Meta mensual actualizada');
    } else {
      toast.error(result.error);
    }
    setSavingGoal(false);
  }

  return (
    <div className="space-y-6">
      {/* Shop info */}
      <div className="bg-card space-y-4 rounded-xl border p-5">
        <h2 className="text-lg font-bold">Datos de la barbería</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-muted-foreground text-xs">Nombre *</label>
            <input
              {...register('name')}
              className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="text-destructive mt-1 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-muted-foreground text-xs">Dirección</label>
            <input
              {...register('address')}
              className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-xs">Teléfono</label>
            <input
              {...register('phone')}
              className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" size="sm" loading={saving} disabled={!isDirty}>
            Guardar cambios
          </Button>
        </form>
      </div>

      {/* Monthly goal */}
      <div className="bg-card space-y-4 rounded-xl border p-5">
        <h2 className="text-lg font-bold">Meta mensual</h2>
        <p className="text-muted-foreground text-sm">
          Establecé un objetivo de facturación mensual para ver tu progreso en
          el dashboard.
        </p>
        <CurrencyInput
          value={goalCents}
          onChange={setGoalCents}
          placeholder="Ej: $500.000"
        />
        <Button size="sm" onClick={handleSaveGoal} loading={savingGoal}>
          Guardar meta
        </Button>
      </div>
    </div>
  );
}
