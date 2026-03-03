/**
 * Paso 5: Éxito — confetti, resumen, tips, CTA al dashboard.
 */
'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Lightbulb, PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface StepSuccessProps {
  shopName: string;
  servicesCount: number;
  professionalsCount: number;
}

/** Simple confetti particles */
function ConfettiParticles() {
  const colors = ['#00E5FF', '#F0133B', '#facc15', '#22c55e', '#a855f7'];
  const particles = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        color: colors[i % colors.length],
        size: 4 + Math.random() * 6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: [0, 400, 600],
            opacity: [1, 1, 0],
            rotate: [0, 180, 360],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export function StepSuccess({
  shopName,
  servicesCount,
  professionalsCount,
}: StepSuccessProps) {
  const router = useRouter();

  function handleGo() {
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="relative">
      <ConfettiParticles />

      <motion.div
        className="relative z-10 space-y-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <PartyPopper className="text-primary h-16 w-16" />
          </motion.div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">
            ¡Tu barbería está lista!
          </h2>
          <p className="text-primary mt-2 text-lg font-medium">{shopName}</p>
        </div>

        <div className="text-muted-foreground flex justify-center gap-6 text-sm">
          <span>
            <strong className="text-foreground">{servicesCount}</strong>{' '}
            servicios
          </span>
          <span>
            <strong className="text-foreground">{professionalsCount}</strong>{' '}
            {professionalsCount === 1 ? 'profesional' : 'profesionales'}
          </span>
        </div>

        {/* Tips */}
        <div className="bg-card space-y-3 rounded-xl border p-4 text-left">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Consejos rápidos</span>
          </div>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              • Después de cada corte, tocá <strong>Nueva Venta</strong>
            </li>
            <li>
              • Al final del día, mirá tu <strong>Dashboard</strong>
            </li>
            <li>• Los precios los podés cambiar cuando quieras</li>
          </ul>
        </div>

        {/* Trial badge */}
        <div className="border-primary/30 bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <Gift className="text-primary h-4 w-4" />
          <span>
            Tenés <strong>14 días</strong> de prueba gratuita del plan completo
          </span>
        </div>

        {/* CTA */}
        <Button onClick={handleGo} size="lg" className="w-full text-base">
          IR A MI DASHBOARD
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
