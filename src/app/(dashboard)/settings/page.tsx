/**
 * Settings — Server Component.
 */
import { SettingsPage } from '@/components/settings/settings-page';
import { requireOwner } from '@/server/lib/get-session';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
import { redirect } from 'next/navigation';

export default async function SettingsPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const subscription = await subscriptionRepository.findByShopId(
    session.shop.id,
  );

  return (
    <SettingsPage
      shopId={session.shop.id}
      shopName={session.shop.name}
      userName={session.user.name}
      userEmail={session.user.email}
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
