/**
 * Paso 1: Datos de la barbería.
 * Nombre (requerido), dirección, teléfono.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createShopSchema } from '@/lib/validations/shop';
import { ArrowRight, MapPin, Phone, Store } from 'lucide-react';
import * as React from 'react';

export interface ShopData {
  name: string;
  address?: string;
  phone?: string;
}

interface StepShopInfoProps {
  data: ShopData;
  onNext: (data: ShopData) => void;
}

export function StepShopInfo({ data, onNext }: StepShopInfoProps) {
  const [name, setName] = React.useState(data.name);
  const [address, setAddress] = React.useState(data.address ?? '');
  const [phone, setPhone] = React.useState(data.phone ?? '');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function handleNext() {
    const result = createShopSchema.safeParse({
      name: name.trim(),
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const e of result.error.errors) {
        const field = e.path[0];
        if (field && typeof field === 'string') errs[field] = e.message;
      }
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext(result.data);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold">
          ¿Cómo se llama tu barbería?
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          ¡Genial! En 2 minutos vas a estar registrando tu primera venta.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nombre de la barbería"
          placeholder="Ej: BarberKing"
          autoFocus
          leftIcon={<Store />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="Dirección (opcional)"
          placeholder="Ej: Av. Corrientes 1234, CABA"
          leftIcon={<MapPin />}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={errors.address}
        />

        <Input
          label="Teléfono (opcional)"
          placeholder="Ej: +5491155001234"
          type="tel"
          leftIcon={<Phone />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
      </div>

      <Button onClick={handleNext} className="w-full" size="lg">
        Siguiente
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
