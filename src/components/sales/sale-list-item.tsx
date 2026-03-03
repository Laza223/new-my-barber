/**
 * SaleListItem — item expandible con detalles de la venta.
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
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Trash2 } from 'lucide-react';
import * as React from 'react';

interface SaleListItemProps {
  sale: {
    id: string;
    saleTime: string;
    professionalName: string;
    serviceName: string;
    servicePrice: number;
    commissionRate: number;
    commissionAmount: number;
    ownerAmount: number;
    tipAmount: number;
    paymentMethod: string;
    notes: string | null;
    saleDate: string;
  };
  isToday: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function SaleListItem({ sale, isToday, onDelete }: SaleListItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const pm = PAYMENT_METHODS.find((m) => m.id === sale.paymentMethod);
  const time = sale.saleTime.slice(0, 5); // HH:MM

  async function handleDelete() {
    setDeleting(true);
    await onDelete(sale.id);
    setDeleting(false);
    setConfirmOpen(false);
  }

  return (
    <>
      <div className="bg-card overflow-hidden rounded-lg border">
        {/* Main row */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3 p-3 text-left"
        >
          <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs">
            {time}
          </span>
          <span className="flex-1 truncate text-sm">
            <span className="font-medium">{sale.professionalName}</span>
            <span className="text-muted-foreground"> · </span>
            <span>{sale.serviceName}</span>
          </span>
          <span className="shrink-0 text-sm font-bold">
            {formatCurrency(sale.servicePrice)}
          </span>
          <span className="shrink-0 text-sm">{pm?.icon}</span>
          <ChevronDown
            className={cn(
              'text-muted-foreground h-4 w-4 shrink-0 transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/30 space-y-2 border-t px-3 py-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Comisión:</span>{' '}
                    <span className="font-medium">
                      {formatCurrency(sale.commissionAmount)} (
                      {sale.commissionRate}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dueño:</span>{' '}
                    <span className="font-medium">
                      {formatCurrency(sale.ownerAmount)}
                    </span>
                  </div>
                </div>

                {sale.tipAmount > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Propina:</span>{' '}
                    <span className="font-medium">
                      {formatCurrency(sale.tipAmount)}
                    </span>
                  </div>
                )}

                {sale.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Nota:</span>{' '}
                    <span className="italic">{sale.notes}</span>
                  </div>
                )}

                {isToday && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmOpen(true);
                    }}
                    className="mt-2 w-full"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar venta
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar esta venta?</DialogTitle>
            <DialogDescription>
              {sale.serviceName} · {formatCurrency(sale.servicePrice)}
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
              onClick={handleDelete}
              loading={deleting}
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
