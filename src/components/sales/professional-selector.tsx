/**
 * ProfessionalSelector — Grid de profesionales para selección rápida.
 */
'use client';

import { cn, getInitials } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-cyan-500/15 text-cyan-600 border-cyan-500',
  'bg-violet-500/15 text-violet-600 border-violet-500',
  'bg-amber-500/15 text-amber-600 border-amber-500',
  'bg-emerald-500/15 text-emerald-600 border-emerald-500',
  'bg-rose-500/15 text-rose-600 border-rose-500',
  'bg-sky-500/15 text-sky-600 border-sky-500',
  'bg-orange-500/15 text-orange-600 border-orange-500',
  'bg-indigo-500/15 text-indigo-600 border-indigo-500',
];

interface ProfessionalSelectorProps {
  professionals: {
    id: string;
    name: string;
    colorIndex: number;
    isOwner: boolean;
  }[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function ProfessionalSelector({
  professionals,
  selected,
  onSelect,
}: ProfessionalSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-lg font-bold">¿Quién atendió?</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {professionals.map((pro) => {
          const isSelected = selected === pro.id;
          const colorIdx = pro.colorIndex % AVATAR_COLORS.length;
          const colors = AVATAR_COLORS[colorIdx] ?? AVATAR_COLORS[0]!;

          return (
            <motion.button
              key={pro.id}
              type="button"
              onClick={() => onSelect(pro.id)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                'flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 active:bg-muted/50',
              )}
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold',
                  colors,
                )}
              >
                {getInitials(pro.name)}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{pro.name}</span>
                {pro.isOwner && (
                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
