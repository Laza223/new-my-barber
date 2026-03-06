/**
 * SettingsPage — tabs for plan, shop details, account.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { updateShopAction } from '@/server/actions/shop.actions';
import { CreditCard, Loader2, Sparkles, Store, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { PlanSection } from './plan-section';
import { PromotionsTab } from './promotions-tab';

interface SettingsPageProps {
  shopId: string;
  shopName: string;
  userName: string;
  userEmail: string;
  services: { id: string; name: string }[];
  subscription: {
    plan: string;
    status: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  } | null;
}

type Tab = 'plan' | 'shop' | 'promotions' | 'account';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'plan', label: 'Plan', icon: CreditCard },
  { id: 'shop', label: 'Mi Barbería', icon: Store },
  { id: 'promotions', label: 'Promos', icon: Sparkles },
  { id: 'account', label: 'Cuenta', icon: User },
];

export function SettingsPage({
  shopId,
  shopName,
  userName,
  userEmail,
  services,
  subscription,
}: SettingsPageProps) {
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState<Tab>('plan');

  // Editable shop fields
  const [name, setName] = React.useState(shopName);
  const [saving, setSaving] = React.useState(false);
  const hasChanges = name.trim() !== shopName;

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

  async function handleSaveShop() {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.set('name', name.trim());
    const result = await updateShopAction(shopId, formData);
    if (result.success) {
      toast.success('Barbería actualizada');
      // Reload to update sidebar/header with new name
      window.location.reload();
    } else {
      toast.error(result.error ?? 'Error al guardar');
    }
    setSaving(false);
  }

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
              <label
                htmlFor="shop-name"
                className="text-muted-foreground mb-1 block text-xs"
              >
                Nombre
              </label>
              <Input
                id="shop-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de tu barbería"
                maxLength={50}
              />
            </div>
          </div>
          {hasChanges && (
            <Button onClick={handleSaveShop} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          )}
        </div>
      )}

      {tab === 'promotions' && (
        <PromotionsTab shopId={shopId} services={services} />
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
