/**
 * SaleSuccess — Éxito con animación de checkmark SVG.
 * Auto-dismiss en 2s o al tocar.
 */
'use client';

import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface SaleSuccessProps {
  amount: number;
  todayTotal: number;
  todaySalesCount: number;
  onDismiss: () => void;
}

export function SaleSuccess({
  amount,
  todayTotal,
  todaySalesCount,
  onDismiss,
}: SaleSuccessProps) {
  const router = useRouter();

  // Auto-dismiss after 2s
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <button
      type="button"
      onClick={onDismiss}
      className="flex min-h-[300px] w-full flex-col items-center justify-center gap-6 py-8"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-emerald-500"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <motion.path
            d="M24 40 L35 51 L56 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-1 text-center"
      >
        <p className="text-lg font-bold">¡Venta registrada!</p>
        <p className="text-primary text-2xl font-bold">
          {formatCurrency(amount)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2 text-center"
      >
        <p className="text-muted-foreground text-sm">
          Hoy llevás{' '}
          <strong className="text-foreground">
            {formatCurrency(todayTotal)}
          </strong>{' '}
          en {todaySalesCount} {todaySalesCount === 1 ? 'venta' : 'ventas'}
        </p>
        <p className="text-muted-foreground animate-pulse text-xs">
          Tocá para continuar
        </p>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={(e) => {
          e.stopPropagation();
          router.push('/dashboard');
        }}
        className="text-muted-foreground text-xs underline"
      >
        Ir al dashboard
      </motion.button>
    </button>
  );
}
