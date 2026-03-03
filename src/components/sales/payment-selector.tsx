/**
 * PaymentSelector — Botones grandes de método de pago.
 */
'use client';

import { PAYMENT_METHODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PaymentSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-lg font-bold">¿Cómo pagó?</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((pm) => {
          const isSelected = selected === pm.id;

          return (
            <motion.button
              key={pm.id}
              type="button"
              onClick={() => onSelect(pm.id)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                'flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 active:bg-muted/50',
                // Center the 5th item if odd count
                PAYMENT_METHODS.length % 2 !== 0 &&
                  pm === PAYMENT_METHODS[PAYMENT_METHODS.length - 1] &&
                  'col-span-2 mx-auto w-full max-w-[50%]',
              )}
            >
              <span className="text-2xl">{pm.icon}</span>
              <span className={cn('text-sm font-medium', pm.color)}>
                {pm.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
