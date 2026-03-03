/**
 * SaleFlow — Flujo principal de nueva venta (≤4 taps).
 * Orquesta los 5 pasos con framer-motion transitions.
 */
'use client';

import { registerSaleAction } from '@/server/actions/sale.actions';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { DailyLimitWarning } from './daily-limit-warning';
import { PaymentSelector } from './payment-selector';
import { ProfessionalSelector } from './professional-selector';
import { SaleConfirm } from './sale-confirm';
import { SaleSuccess } from './sale-success';
import { ServiceSelector } from './service-selector';

type Step = 'professional' | 'service' | 'payment' | 'confirm' | 'success';

interface SaleFlowProps {
  shopId: string;
  professionals: {
    id: string;
    name: string;
    colorIndex: number;
    isOwner: boolean;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
    duration: number | null;
    sortOrder: number;
  }[];
  todaySalesCount: number;
  dailySalesLimit: number | null;
  canSell: boolean;
}

const STEP_ORDER: Step[] = [
  'professional',
  'service',
  'payment',
  'confirm',
  'success',
];

export function SaleFlow({
  shopId,
  professionals,
  services,
  todaySalesCount: initialTodayCount,
  dailySalesLimit,
  canSell: initialCanSell,
}: SaleFlowProps) {
  // Determine initial step: skip pro selection if only 1
  const initialPro = professionals.length === 1 ? professionals[0]!.id : null;
  const initialStep: Step = initialPro ? 'service' : 'professional';

  const [step, setStep] = React.useState<Step>(initialStep);
  const [selectedPro, setSelectedPro] = React.useState<string | null>(
    initialPro,
  );
  const [selectedSvc, setSelectedSvc] = React.useState<string | null>(
    services.length === 1 ? services[0]!.id : null,
  );
  const [selectedPay, setSelectedPay] = React.useState<string | null>(null);
  const [tipAmount, setTipAmount] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  // Running totals for success screen
  const [todaySalesCount, setTodaySalesCount] =
    React.useState(initialTodayCount);
  const [todayTotal, setTodayTotal] = React.useState(0);
  const [lastSaleAmount, setLastSaleAmount] = React.useState(0);
  const [canSell, setCanSell] = React.useState(initialCanSell);

  function goTo(target: Step) {
    const currentIdx = STEP_ORDER.indexOf(step);
    const targetIdx = STEP_ORDER.indexOf(target);
    setDirection(targetIdx > currentIdx ? 1 : -1);
    setStep(target);
  }

  function goBack() {
    const currentIdx = STEP_ORDER.indexOf(step);
    if (currentIdx <= 0) return;
    const prev = STEP_ORDER[currentIdx - 1];
    // Skip pro step if only 1
    if (prev === 'professional' && professionals.length === 1) return;
    if (prev) goTo(prev);
  }

  // Professional selected → auto-advance
  function handleSelectPro(id: string) {
    setSelectedPro(id);
    setTimeout(() => goTo('service'), 150);
  }

  // Service selected → auto-advance
  function handleSelectSvc(id: string) {
    setSelectedSvc(id);
    setTimeout(() => goTo('payment'), 150);
  }

  // Payment selected → auto-advance
  function handleSelectPay(id: string) {
    setSelectedPay(id);
    setTimeout(() => goTo('confirm'), 150);
  }

  // Confirm sale
  async function handleConfirm() {
    if (!selectedPro || !selectedSvc || !selectedPay) return;
    setIsSubmitting(true);

    const svc = services.find((s) => s.id === selectedSvc);
    const amount = svc?.price ?? 0;

    // Optimistic: show success immediately
    setLastSaleAmount(amount);
    setTodayTotal((prev) => prev + amount);
    setTodaySalesCount((prev) => prev + 1);
    goTo('success');

    try {
      const formData = new FormData();
      formData.append('professionalId', selectedPro);
      formData.append('serviceId', selectedSvc);
      formData.append('paymentMethod', selectedPay);
      if (tipAmount > 0) formData.append('tipAmount', String(tipAmount));
      if (notes) formData.append('notes', notes);

      const result = await registerSaleAction(shopId, formData);

      if (!result.success) {
        // Revert optimistic
        setTodayTotal((prev) => prev - amount);
        setTodaySalesCount((prev) => prev - 1);
        toast.error(result.error);

        if (result.code === 'PLAN_LIMIT_EXCEEDED') {
          setCanSell(false);
        }

        resetFlow();
      }
    } catch {
      setTodayTotal((prev) => prev - amount);
      setTodaySalesCount((prev) => prev - 1);
      toast.error('Error al registrar la venta');
      resetFlow();
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetFlow() {
    const firstStep: Step =
      professionals.length === 1 ? 'service' : 'professional';
    setSelectedSvc(services.length === 1 ? services[0]!.id : null);
    setSelectedPay(null);
    setTipAmount(0);
    setNotes('');
    goTo(firstStep);
  }

  function handleSuccessDismiss() {
    resetFlow();
  }

  const showBackButton = step !== 'success' && step !== initialStep;

  const currentPro = professionals.find((p) => p.id === selectedPro);
  const currentSvc = services.find((s) => s.id === selectedSvc);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  // Progress dots
  const visibleSteps =
    professionals.length === 1
      ? ['service', 'payment', 'confirm']
      : ['professional', 'service', 'payment', 'confirm'];
  const currentDotIdx = visibleSteps.indexOf(step);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      {/* Top bar: back + progress dots */}
      {step !== 'success' && (
        <div className="flex items-center justify-between px-1 py-3">
          <div className="w-10">
            {showBackButton && (
              <button
                type="button"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground p-2 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Mini dots */}
          <div className="flex gap-1.5">
            {visibleSteps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i <= currentDotIdx
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 w-1.5'
                }`}
              />
            ))}
          </div>

          <div className="w-10" />
        </div>
      )}

      {/* Daily limit warning */}
      {dailySalesLimit && step !== 'success' && (
        <div className="mb-4">
          <DailyLimitWarning
            todaySalesCount={todaySalesCount}
            dailyLimit={dailySalesLimit}
          />
        </div>
      )}

      {/* Steps */}
      <div className="flex flex-1 items-center justify-center px-1">
        {!canSell && step !== 'success' ? (
          <DailyLimitWarning
            todaySalesCount={todaySalesCount}
            dailyLimit={dailySalesLimit ?? 15}
          />
        ) : (
          <div className="w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              >
                {step === 'professional' && (
                  <ProfessionalSelector
                    professionals={professionals}
                    selected={selectedPro}
                    onSelect={handleSelectPro}
                  />
                )}
                {step === 'service' && (
                  <ServiceSelector
                    services={services}
                    selected={selectedSvc}
                    onSelect={handleSelectSvc}
                  />
                )}
                {step === 'payment' && (
                  <PaymentSelector
                    selected={selectedPay}
                    onSelect={handleSelectPay}
                  />
                )}
                {step === 'confirm' &&
                  currentPro &&
                  currentSvc &&
                  selectedPay && (
                    <SaleConfirm
                      professional={currentPro}
                      service={currentSvc}
                      paymentMethod={selectedPay}
                      tipAmount={tipAmount}
                      notes={notes}
                      onTipChange={setTipAmount}
                      onNotesChange={setNotes}
                      onConfirm={handleConfirm}
                      onCancel={resetFlow}
                      isSubmitting={isSubmitting}
                    />
                  )}
                {step === 'success' && (
                  <SaleSuccess
                    amount={lastSaleAmount}
                    todayTotal={todayTotal}
                    todaySalesCount={todaySalesCount}
                    onDismiss={handleSuccessDismiss}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
