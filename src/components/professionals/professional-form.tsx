/**
 * ProfessionalForm — Dialog con formulario para crear/editar profesional.
 */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import {
  createProfessionalSchema,
  type CreateProfessionalSchema,
} from '@/lib/validations/professional';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';

interface ProfessionalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProfessionalSchema) => Promise<void>;
  defaultValues?: Partial<CreateProfessionalSchema>;
  mode: 'create' | 'edit';
}

const SAMPLE_AMOUNT = 100_000_00; // $100.000 en centavos

export function ProfessionalForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: ProfessionalFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProfessionalSchema>({
    resolver: zodResolver(createProfessionalSchema),
    defaultValues: {
      name: '',
      commissionRate: 45,
      ...defaultValues,
    },
  });

  // Reset form when opening
  React.useEffect(() => {
    if (open) {
      reset({ name: '', commissionRate: 45, ...defaultValues });
    }
  }, [open, defaultValues, reset]);

  const commission = watch('commissionRate', 45);
  const commissionAmount = Math.round((SAMPLE_AMOUNT * commission) / 100);

  async function onFormSubmit(data: CreateProfessionalSchema) {
    setIsPending(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Agregar profesional' : 'Editar profesional'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Nombre del profesional"
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Teléfono (opcional)"
            placeholder="+5491155001234"
            type="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Commission slider + input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Comisión</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[commission]}
                  onValueChange={([v]) =>
                    v !== undefined && setValue('commissionRate', v)
                  }
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <div className="w-16">
                <Input
                  value={String(commission)}
                  onChange={(e) =>
                    setValue(
                      'commissionRate',
                      Math.min(
                        100,
                        Math.max(0, Number(e.target.value.replace(/\D/g, ''))),
                      ),
                    )
                  }
                  inputMode="numeric"
                  className="h-9 text-center text-sm"
                />
              </div>
              <span className="text-muted-foreground text-sm">%</span>
            </div>
            {errors.commissionRate && (
              <p className="text-destructive text-xs">
                {errors.commissionRate.message}
              </p>
            )}

            {/* Preview */}
            <p className="text-muted-foreground text-xs">
              Si factura {formatCurrency(SAMPLE_AMOUNT)}, se lleva{' '}
              <strong className="text-foreground">
                {formatCurrency(commissionAmount)}
              </strong>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isPending} className="flex-1">
              {mode === 'create' ? 'Agregar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
