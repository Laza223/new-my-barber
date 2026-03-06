/**
 * Settings — Server Component.
 */
import { SettingsPage } from '@/components/settings/settings-page';
import { requireOwner } from '@/server/lib/get-session';
import { serviceRepository } from '@/server/repositories/service.repository';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
import { redirect } from 'next/navigation';

export default async function SettingsPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const [subscription, services] = await Promise.all([
    subscriptionRepository.findByShopId(session.shop.id),
    serviceRepository.findByShopId(session.shop.id),
  ]);

  return (
    <SettingsPage
      shopId={session.shop.id}
      shopName={session.shop.name}
      userName={session.user.name}
      userEmail={session.user.email}
      services={services.map((s) => ({ id: s.id, name: s.name }))}
      subscription={
        subscription
          ? {
              plan: subscription.plan,
              status: subscription.status,
              trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
              currentPeriodEnd:
                subscription.currentPeriodEnd?.toISOString() ?? null,
            }
          : null
      }
    />
  );
}
