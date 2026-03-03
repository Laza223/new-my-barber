/**
 * ProfessionalsPage — página principal de gestión del equipo.
 */
'use client';

import { UpsellModal } from '@/components/subscription/upsell-modal';
import { Button } from '@/components/ui/button';
import type { CreateProfessionalSchema } from '@/lib/validations/professional';
import {
  addProfessionalAction,
  removeProfessionalAction,
  updateProfessionalAction,
} from '@/server/actions/professional.actions';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { ProfessionalCard } from './professional-card';
import { ProfessionalForm } from './professional-form';

interface ProfessionalData {
  id: string;
  name: string;
  phone: string | null;
  commissionRate: number;
  colorIndex: number;
  isOwner: boolean;
  isActive: boolean;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
}

interface ProfessionalsPageProps {
  shopId: string;
  professionals: ProfessionalData[];
  canAddMore: boolean;
  planRequired?: string;
}

export function ProfessionalsPage({
  shopId,
  professionals: initialPros,
  canAddMore,
  planRequired,
}: ProfessionalsPageProps) {
  const [professionals, setProfessionals] = React.useState(initialPros);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPro, setEditingPro] = React.useState<ProfessionalData | null>(
    null,
  );
  const [upsellOpen, setUpsellOpen] = React.useState(false);

  // Sort: owner first, then by name
  const sorted = [...professionals].sort((a, b) => {
    if (a.isOwner && !b.isOwner) return -1;
    if (!a.isOwner && b.isOwner) return 1;
    return a.name.localeCompare(b.name);
  });

  function handleAdd() {
    if (!canAddMore) {
      setUpsellOpen(true);
      return;
    }
    setEditingPro(null);
    setFormOpen(true);
  }

  async function handleCreate(data: CreateProfessionalSchema) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('commissionRate', String(data.commissionRate));

    const result = await addProfessionalAction(shopId, formData);
    if (result.success) {
      toast.success('Profesional agregado');
      // Reload page data
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  async function handleUpdate(data: CreateProfessionalSchema) {
    if (!editingPro) return;
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('commissionRate', String(data.commissionRate));

    const result = await updateProfessionalAction(editingPro.id, formData);
    if (result.success) {
      toast.success('Profesional actualizado');
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === editingPro.id
            ? { ...p, name: data.name, commissionRate: data.commissionRate }
            : p,
        ),
      );
    } else {
      toast.error(result.error);
    }
  }

  async function handleRemove(id: string) {
    const result = await removeProfessionalAction(id);
    if (result.success) {
      toast.success('Profesional eliminado');
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Tu equipo</h1>
          <p className="text-muted-foreground text-sm">
            {professionals.length}{' '}
            {professionals.length === 1 ? 'profesional' : 'profesionales'}
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((pro) => (
          <ProfessionalCard
            key={pro.id}
            professional={pro}
            onEdit={() => {
              setEditingPro(pro);
              setFormOpen(true);
            }}
            onRemove={() => handleRemove(pro.id)}
          />
        ))}
      </div>

      {/* Form dialog */}
      <ProfessionalForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPro(null);
        }}
        onSubmit={editingPro ? handleUpdate : handleCreate}
        defaultValues={
          editingPro
            ? {
                name: editingPro.name,
                phone: editingPro.phone ?? undefined,
                commissionRate: editingPro.commissionRate,
              }
            : undefined
        }
        mode={editingPro ? 'edit' : 'create'}
      />

      {/* Upsell modal */}
      <UpsellModal
        open={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        feature="agregar más profesionales"
        planRequired={planRequired ?? 'Business'}
      />
    </div>
  );
}
