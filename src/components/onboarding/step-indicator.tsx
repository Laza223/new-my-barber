/**
 * StepIndicator — Barra de progreso del wizard.
 * Desktop: dots con labels. Mobile: "Paso X de 4".
 */
'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Barbería' },
  { id: 2, label: 'Servicios' },
  { id: 3, label: 'Equipo' },
  { id: 4, label: '¡Listo!' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <>
      {/* Mobile */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="text-muted-foreground text-sm">
          Paso{' '}
          <span className="text-foreground font-semibold">
            {Math.min(currentStep, 4)}
          </span>{' '}
          de 4
        </span>
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-between sm:flex">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-200',
                    isCompleted &&
                      'border-emerald-500 bg-emerald-500 text-white',
                    isActive &&
                      'border-primary bg-primary text-primary-foreground',
                    !isCompleted &&
                      !isActive &&
                      'border-muted-foreground/30 text-muted-foreground',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-xs transition-colors',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground',
                    isCompleted && 'text-emerald-500',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-[2px] flex-1 transition-colors duration-200',
                    isCompleted ? 'bg-emerald-500' : 'bg-muted-foreground/20',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
