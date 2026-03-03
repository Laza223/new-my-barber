/**
 * SaleConfirm — Pantalla de confirmación con propina y nota expandibles.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Banknote,
  ChevronDown,
  CreditCard,
  Scissors,
  User,
} from 'lucide-react';
import * as React from 'react';

interface SaleConfirmProps {
  professional: { id: string; name: string };
  service: { id: string; name: string; price: number };
  paymentMethod: string;
  tipAmount: number;
  notes: string;
  onTipChange: (cents: number) => void;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const TIP_PRESETS = [50_000, 100_000, 200_000]; // $500, $1000, $2000

export function SaleConfirm({
  professional,
  service,
  paymentMethod,
  tipAmount,
  notes,
  onTipChange,
  onNotesChange,
  onConfirm,
  onCancel,
  isSubmitting,
}: SaleConfirmProps) {
  const [showTip, setShowTip] = React.useState(tipAmount > 0);
  const [showNotes, setShowNotes] = React.useState(!!notes);
  const [customTip, setCustomTip] = React.useState('');

  const pm = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  function handleConfirm() {
    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50]);
    }
    onConfirm();
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-lg font-bold">Confirmar venta</h2>
      </div>

      {/* Summary card */}
      <div className="bg-card space-y-3 rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <User className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-sm">{professional.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Scissors className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-sm">{service.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Banknote className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-primary text-lg font-bold">
            {formatCurrency(service.price)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-sm">
            {pm?.icon} {pm?.label}
          </span>
        </div>
      </div>

      {/* Expandable tip */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <button
          type="button"
          onClick={() => setShowTip(!showTip)}
          className="flex w-full items-center justify-between p-4 text-sm font-medium"
        >
          <span>
            + Agregar propina
            {tipAmount > 0 && (
              <span className="text-primary ml-2">
                ({formatCurrency(tipAmount)})
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              showTip && 'rotate-180',
            )}
          />
        </button>
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 px-4 pb-4">
                <div className="flex gap-2">
                  {TIP_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        onTipChange(tipAmount === preset ? 0 : preset);
                        setCustomTip('');
                      }}
                      className={cn(
                        'flex-1 rounded-lg border py-2 text-sm font-medium transition-all',
                        tipAmount === preset
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40',
                      )}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Otra cantidad..."
                    value={customTip}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setCustomTip(raw);
                      onTipChange(raw ? Number(raw) * 100 : 0);
                    }}
                    className="border-input bg-background flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                  {tipAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onTipChange(0);
                        setCustomTip('');
                      }}
                      className="text-muted-foreground hover:text-destructive px-2 text-xs"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expandable notes */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="flex w-full items-center justify-between p-4 text-sm font-medium"
        >
          <span>+ Agregar nota</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              showNotes && 'rotate-180',
            )}
          />
        </button>
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <Textarea
                  placeholder="Nota opcional..."
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  maxLength={500}
                  className="min-h-[60px]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Total with tip */}
      {tipAmount > 0 && (
        <div className="text-muted-foreground text-center text-sm">
          Total con propina:{' '}
          <strong className="text-foreground">
            {formatCurrency(service.price + tipAmount)}
          </strong>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleConfirm}
        loading={isSubmitting}
        disabled={isSubmitting}
        className="min-h-[56px] w-full text-base font-bold"
        size="lg"
      >
        REGISTRAR VENTA
      </Button>

      <button
        type="button"
        onClick={onCancel}
        className="text-muted-foreground hover:text-foreground w-full py-2 text-center text-sm"
      >
        Cancelar
      </button>
    </div>
  );
}
