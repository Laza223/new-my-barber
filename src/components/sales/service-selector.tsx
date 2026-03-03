/**
 * ServiceSelector — Grid de servicios con precios.
 */
'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ServiceSelectorProps {
  services: {
    id: string;
    name: string;
    price: number;
    duration: number | null;
    sortOrder: number;
  }[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function ServiceSelector({
  services,
  selected,
  onSelect,
}: ServiceSelectorProps) {
  const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-lg font-bold">¿Qué servicio?</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map((svc) => {
          const isSelected = selected === svc.id;

          return (
            <motion.button
              key={svc.id}
              type="button"
              onClick={() => onSelect(svc.id)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                'flex min-h-[100px] flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 active:bg-muted/50',
              )}
            >
              <span className="text-center text-sm leading-tight font-medium">
                {svc.name}
              </span>
              <span className="text-primary text-lg font-bold">
                {formatCurrency(svc.price)}
              </span>
              {svc.duration && (
                <span className="text-muted-foreground text-xs">
                  {svc.duration} min
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
