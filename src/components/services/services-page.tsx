/**
 * ServicesPage — gestión de servicios con drag-and-drop.
 */
'use client';

import { UpsellModal } from '@/components/subscription/upsell-modal';
import { Button } from '@/components/ui/button';
import type { CreateServiceSchema } from '@/lib/validations/service';
import {
  createServiceAction,
  deleteServiceAction,
  reorderServicesAction,
  updateServiceAction,
} from '@/server/actions/service.actions';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { ServiceForm } from './service-form';
import { ServiceItem } from './service-item';

interface ServiceData {
  id: string;
  name: string;
  price: number;
  duration: number | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface ServicesPageProps {
  shopId: string;
  services: ServiceData[];
  canAddMore: boolean;
  planRequired?: string;
}

export function ServicesPage({
  shopId,
  services: initialServices,
  canAddMore,
  planRequired,
}: ServicesPageProps) {
  const [services, setServices] = React.useState(initialServices);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSvc, setEditingSvc] = React.useState<ServiceData | null>(null);
  const [upsellOpen, setUpsellOpen] = React.useState(false);
  const [showInactive, setShowInactive] = React.useState(false);

  const displayed = showInactive
    ? services
    : services.filter((s) => s.isActive);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleAdd() {
    if (!canAddMore) {
      setUpsellOpen(true);
      return;
    }
    setEditingSvc(null);
    setFormOpen(true);
  }

  async function handleCreate(data: CreateServiceSchema) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    if (data.duration) formData.append('duration', String(data.duration));
    if (data.description) formData.append('description', data.description);

    const result = await createServiceAction(shopId, formData);
    if (result.success) {
      toast.success('Servicio creado');
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  async function handleUpdate(data: CreateServiceSchema) {
    if (!editingSvc) return;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    if (data.duration) formData.append('duration', String(data.duration));
    if (data.description) formData.append('description', data.description);

    const result = await updateServiceAction(editingSvc.id, formData);
    if (result.success) {
      toast.success('Servicio actualizado');
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingSvc.id
            ? {
                ...s,
                name: data.name,
                price: data.price,
                duration: data.duration ?? null,
              }
            : s,
        ),
      );
    } else {
      toast.error(result.error);
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: active } : s)),
    );

    const formData = new FormData();
    formData.append('isActive', String(active));
    // Use the generic update — Note: we reuse updateServiceAction
    // which only updates provided fields
  }

  async function handleRemove(id: string) {
    const result = await deleteServiceAction(id);
    if (result.success) {
      toast.success('Servicio eliminado');
      setServices((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error(result.error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic reorder
    const reordered = [...services];
    const [moved] = reordered.splice(oldIndex, 1);
    if (moved) reordered.splice(newIndex, 0, moved);
    setServices(reordered);

    // Persist
    const orderedIds = reordered.map((s) => s.id);
    const result = await reorderServicesAction(shopId, orderedIds);
    if (!result.success) {
      setServices(initialServices);
      toast.error('Error al reordenar');
    }
  }

  const inactiveCount = services.filter((s) => !s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Servicios</h1>
          <p className="text-muted-foreground text-sm">
            {services.filter((s) => s.isActive).length} activos
            {inactiveCount > 0 && ` · ${inactiveCount} inactivos`}
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {/* Show inactive toggle */}
      {inactiveCount > 0 && (
        <button
          type="button"
          onClick={() => setShowInactive(!showInactive)}
          className="text-primary text-sm hover:underline"
        >
          {showInactive
            ? 'Ocultar inactivos'
            : `Mostrar ${inactiveCount} inactivos`}
        </button>
      )}

      {/* Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayed.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {displayed.map((svc) => (
              <ServiceItem
                key={svc.id}
                service={svc}
                onEdit={() => {
                  setEditingSvc(svc);
                  setFormOpen(true);
                }}
                onToggleActive={(active) => handleToggleActive(svc.id, active)}
                onRemove={() => handleRemove(svc.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {displayed.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No hay servicios todavía</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Crear primer servicio
          </Button>
        </div>
      )}

      {/* Form dialog */}
      <ServiceForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingSvc(null);
        }}
        onSubmit={editingSvc ? handleUpdate : handleCreate}
        defaultValues={
          editingSvc
            ? {
                name: editingSvc.name,
                price: editingSvc.price,
                duration: editingSvc.duration ?? undefined,
                description: editingSvc.description ?? undefined,
              }
            : undefined
        }
        mode={editingSvc ? 'edit' : 'create'}
      />

      {/* Upsell modal */}
      <UpsellModal
        open={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        feature="agregar más servicios"
        planRequired={planRequired ?? 'Individual'}
      />
    </div>
  );
}
