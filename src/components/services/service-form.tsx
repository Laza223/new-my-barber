/**
 * ServiceForm — Dialog para crear/editar servicio.
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
import { Textarea } from '@/components/ui/textarea';
import {
  createServiceSchema,
  type CreateServiceSchema,
} from '@/lib/validations/service';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { CurrencyInput } from './currency-input';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServiceSchema) => Promise<void>;
  defaultValues?: Partial<CreateServiceSchema>;
  mode: 'create' | 'edit';
}

export function ServiceForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: ServiceFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [price, setPrice] = React.useState(defaultValues?.price ?? 0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration: 30,
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: '', price: 0, duration: 30, ...defaultValues });
      setPrice(defaultValues?.price ?? 0);
    }
  }, [open, defaultValues, reset]);

  function handlePriceChange(cents: number) {
    setPrice(cents);
    setValue('price', cents);
  }

  async function onFormSubmit(data: CreateServiceSchema) {
    setIsPending(true);
    try {
      await onSubmit({ ...data, price });
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
            {mode === 'create' ? 'Agregar servicio' : 'Editar servicio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Input
            label="Nombre del servicio"
            placeholder="Ej: Corte de pelo"
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />

          <CurrencyInput
            label="Precio"
            value={price}
            onChange={handlePriceChange}
            error={errors.price?.message}
          />

          <Input
            label="Duración (minutos, opcional)"
            placeholder="30"
            type="number"
            inputMode="numeric"
            error={errors.duration?.message}
            {...register('duration', { valueAsNumber: true })}
          />

          <Textarea
            label="Descripción (opcional)"
            placeholder="Descripción del servicio..."
            {...register('description')}
          />

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
