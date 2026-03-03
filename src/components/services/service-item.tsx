/**
 * ServiceItem — item sortable de un servicio con acciones inline.
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
import { Switch } from '@/components/ui/switch';
import { cn, formatCurrency } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

interface ServiceItemProps {
  service: {
    id: string;
    name: string;
    price: number;
    duration: number | null;
    isActive: boolean;
  };
  onEdit: () => void;
  onToggleActive: (active: boolean) => void;
  onRemove: () => Promise<void>;
}

export function ServiceItem({
  service: svc,
  onEdit,
  onToggleActive,
  onRemove,
}: ServiceItemProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: svc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handleRemove() {
    setRemoving(true);
    await onRemove();
    setRemoving(false);
    setConfirmOpen(false);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-card flex items-center gap-3 rounded-lg border p-3 transition-shadow',
          isDragging && 'ring-primary/30 z-50 shadow-lg ring-2',
          !svc.isActive && 'opacity-50',
        )}
      >
        {/* Drag handle */}
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{svc.name}</p>
          {svc.duration && (
            <p className="text-muted-foreground text-xs">{svc.duration} min</p>
          )}
        </div>

        {/* Price */}
        <span className="shrink-0 text-sm font-bold">
          {formatCurrency(svc.price)}
        </span>

        {/* Active toggle */}
        <Switch
          checked={svc.isActive}
          onCheckedChange={onToggleActive}
          className="shrink-0"
        />

        {/* Actions */}
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmOpen(true)}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar &quot;{svc.name}&quot;?</DialogTitle>
            <DialogDescription>
              Las ventas pasadas de este servicio no se afectan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              loading={removing}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
