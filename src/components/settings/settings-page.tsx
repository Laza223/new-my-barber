/**
 * SettingsPage — tabs for plan, shop details, account.
 */
'use client';

import { cn } from '@/lib/utils';
import { CreditCard, Store, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { PlanSection } from './plan-section';

interface SettingsPageProps {
  shopId: string;
  shopName: string;
  userName: string;
  userEmail: string;
  subscription: {
    plan: string;
    status: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  } | null;
}

type Tab = 'plan' | 'shop' | 'account';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'plan', label: 'Plan', icon: CreditCard },
  { id: 'shop', label: 'Mi Barbería', icon: Store },
  { id: 'account', label: 'Cuenta', icon: User },
];

export function SettingsPage({
  shopId,
  shopName,
  userName,
  userEmail,
  subscription,
}: SettingsPageProps) {
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState<Tab>('plan');

  // Handle payment return
  React.useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success('¡Pago exitoso! Tu plan se actualizará en unos instantes.');
    } else if (payment === 'failure') {
      toast.error('El pago no se pudo procesar. Intentá de nuevo.');
    } else if (payment === 'pending') {
      toast.info(
        'Tu pago está pendiente. Te notificaremos cuando se confirme.',
      );
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Configuración</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto border-b pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                '-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'plan' && subscription && (
        <PlanSection
          shopId={shopId}
          currentPlan={subscription.plan}
          status={subscription.status}
          trialEndsAt={subscription.trialEndsAt}
          currentPeriodEnd={subscription.currentPeriodEnd}
        />
      )}

      {tab === 'shop' && (
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-bold">Mi Barbería</h2>
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground text-xs">Nombre</label>
              <p className="text-sm font-medium">{shopName}</p>
            </div>
            <p className="text-muted-foreground text-xs">
              Para editar los datos de tu barbería, contactanos a
              soporte@mybarber.app
            </p>
          </div>
        </div>
      )}

      {tab === 'account' && (
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-bold">Mi Cuenta</h2>
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground text-xs">Nombre</label>
              <p className="text-sm font-medium">{userName}</p>
            </div>
            <div>
              <label className="text-muted-foreground text-xs">Email</label>
              <p className="text-sm font-medium">{userEmail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
