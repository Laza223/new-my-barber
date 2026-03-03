/**
 * OnboardingWizard — componente principal del wizard.
 * Gestiona estado, persistencia en localStorage, transiciones,
 * y orchestración de los 5 pasos.
 */
'use client';

import { setupShopAction } from '@/server/actions/onboarding.actions';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { toast } from 'sonner';
import { StepFirstSale } from './step-first-sale';
import { StepIndicator } from './step-indicator';
import { StepServices, type ServiceItem } from './step-services';
import { StepShopInfo, type ShopData } from './step-shop-info';
import { StepSuccess } from './step-success';
import { StepTeam, type TeamData } from './step-team';

const STORAGE_KEY = 'mybarber-onboarding';

interface OnboardingState {
  step: number;
  shopData: ShopData;
  servicesData: ServiceItem[];
  teamData: TeamData;
  shopId?: string;
}

const defaultState: OnboardingState = {
  step: 1,
  shopData: { name: '' },
  servicesData: [],
  teamData: { mode: null, professionals: [], ownerCommission: 100 },
};

function loadState(): OnboardingState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const [state, setState] = React.useState<OnboardingState>(loadState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [direction, setDirection] = React.useState(1); // 1=forward, -1=back

  // Persist state on change
  React.useEffect(() => {
    saveState(state);
  }, [state]);

  function goTo(step: number) {
    setDirection(step > state.step ? 1 : -1);
    setState((prev) => ({ ...prev, step }));
  }

  // Step 1 → 2
  function onShopNext(data: ShopData) {
    setState((prev) => ({ ...prev, shopData: data }));
    goTo(2);
  }

  // Step 2 → 3
  function onServicesNext(data: ServiceItem[]) {
    setState((prev) => ({ ...prev, servicesData: data }));
    goTo(3);
  }

  // Step 3 → submit + step 4
  async function onTeamNext(data: TeamData) {
    setState((prev) => ({ ...prev, teamData: data }));

    setIsSubmitting(true);
    try {
      const selectedServices = (
        state.servicesData.length > 0 ? state.servicesData : []
      ).filter((s) => s.selected);

      const result = await setupShopAction({
        shop: state.shopData,
        services: selectedServices.map((s) => ({
          name: s.name,
          price: s.price,
          duration: 30,
        })),
        professionals: data.mode === 'team' ? data.professionals : [],
        ownerCommission: data.mode === 'solo' ? 100 : data.ownerCommission,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setState((prev) => ({ ...prev, shopId: result.data.shopId }));
      goTo(4);
    } catch {
      toast.error('Error al configurar la barbería');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Step 4 → 5
  function onFirstSaleDone() {
    goTo(5);
  }

  // Step 4 skip → 5
  function onSkipSale() {
    goTo(5);
  }

  // On success navigating away, clear localStorage
  React.useEffect(() => {
    if (state.step === 5) {
      clearState();
    }
  }, [state.step]);

  const selectedServices = state.servicesData.filter((s) => s.selected);
  const totalPros =
    1 +
    (state.teamData.mode === 'team' ? state.teamData.professionals.length : 0);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">
          <span className="text-primary">My</span>{' '}
          <span className="text-foreground">Barber</span>
        </h1>
      </div>

      {/* Step indicator */}
      {state.step <= 4 && <StepIndicator currentStep={state.step} />}

      {/* Steps */}
      <div className="bg-card relative min-h-[400px] overflow-hidden rounded-xl border p-6 shadow-lg sm:p-8">
        {isSubmitting && (
          <div className="bg-card/80 absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                Creando tu barbería...
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {state.step === 1 && (
              <StepShopInfo data={state.shopData} onNext={onShopNext} />
            )}
            {state.step === 2 && (
              <StepServices
                data={state.servicesData}
                onNext={onServicesNext}
                onBack={() => goTo(1)}
              />
            )}
            {state.step === 3 && (
              <StepTeam
                data={state.teamData}
                onNext={onTeamNext}
                onBack={() => goTo(2)}
              />
            )}
            {state.step === 4 && (
              <StepFirstSale
                services={selectedServices}
                professionals={
                  state.teamData.mode === 'team'
                    ? state.teamData.professionals
                    : []
                }
                ownerName={userName}
                onNext={onFirstSaleDone}
                onSkip={onSkipSale}
              />
            )}
            {state.step === 5 && (
              <StepSuccess
                shopName={state.shopData.name}
                servicesCount={selectedServices.length}
                professionalsCount={totalPros}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
