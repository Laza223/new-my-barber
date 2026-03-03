/**
 * ProfessionalCard — card de un profesional con stats y acciones.
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import { Crown, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

/** Colors for professional borders */
const PROFESSIONAL_COLORS = [
  'border-l-cyan-500',
  'border-l-violet-500',
  'border-l-amber-500',
  'border-l-emerald-500',
  'border-l-rose-500',
  'border-l-sky-500',
  'border-l-orange-500',
  'border-l-indigo-500',
  'border-l-teal-500',
  'border-l-pink-500',
];

const AVATAR_COLORS = [
  'bg-cyan-500/10 text-cyan-600',
  'bg-violet-500/10 text-violet-600',
  'bg-amber-500/10 text-amber-600',
  'bg-emerald-500/10 text-emerald-600',
  'bg-rose-500/10 text-rose-600',
  'bg-sky-500/10 text-sky-600',
  'bg-orange-500/10 text-orange-600',
  'bg-indigo-500/10 text-indigo-600',
  'bg-teal-500/10 text-teal-600',
  'bg-pink-500/10 text-pink-600',
];

interface ProfessionalCardProps {
  professional: {
    id: string;
    name: string;
    commissionRate: number;
    colorIndex: number;
    isOwner: boolean;
    totalSales: number;
    totalRevenue: number;
    totalCommission: number;
  };
  onEdit: () => void;
  onRemove: () => Promise<void>;
}

export function ProfessionalCard({
  professional: pro,
  onEdit,
  onRemove,
}: ProfessionalCardProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);

  const colorIdx = pro.colorIndex % PROFESSIONAL_COLORS.length;
  const borderColor = PROFESSIONAL_COLORS[colorIdx] ?? 'border-l-cyan-500';
  const avatarColor = AVATAR_COLORS[colorIdx] ?? 'bg-cyan-500/10 text-cyan-600';

  async function handleRemove() {
    setRemoving(true);
    await onRemove();
    setRemoving(false);
    setConfirmOpen(false);
  }

  return (
    <>
      <div
        className={cn(
          'bg-card rounded-lg border border-l-4 p-4 shadow-sm transition-shadow hover:shadow-md',
          borderColor,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                avatarColor,
              )}
            >
              {getInitials(pro.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{pro.name}</h3>
                {pro.isOwner && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Crown className="h-3 w-3" /> Dueño
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="mt-1 text-xs">
                {pro.commissionRate}% comisión
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {!pro.isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmOpen(true)}
                className="text-muted-foreground hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-lg font-bold">{pro.totalSales}</p>
            <p className="text-muted-foreground text-xs">Ventas</p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-sm font-bold">
              {formatCurrency(pro.totalRevenue)}
            </p>
            <p className="text-muted-foreground text-xs">Facturado</p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-sm font-bold">
              {formatCurrency(pro.totalCommission)}
            </p>
            <p className="text-muted-foreground text-xs">Comisión</p>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar a {pro.name}?</DialogTitle>
            <DialogDescription>
              Sus ventas pasadas se mantienen. Esta acción no se puede deshacer.
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
