import { DashboardHeader } from '@/components/layout/dashboard-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Sidebar } from '@/components/layout/sidebar';
import { TrialBanner } from '@/components/subscription/trial-banner';
import { db } from '@/db';
import { shops } from '@/db/schema/shops';
import { getSession } from '@/server/lib/get-session';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.user.id),
  });
  if (!shop) redirect('/onboarding');

  const subscription = await subscriptionRepository.findByShopId(shop.id);
  const planId = subscription?.plan ?? 'free';
  const isTrial =
    planId !== 'free' &&
    subscription?.status === 'trialing' &&
    subscription?.trialEndsAt &&
    subscription.trialEndsAt > new Date();

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar shopName={shop.name} planId={planId} />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Trial banner */}
        {isTrial && subscription?.trialEndsAt && (
          <TrialBanner trialEndsAt={subscription.trialEndsAt.toISOString()} />
        )}

        {/* Header */}
        <DashboardHeader shopName={shop.name} userName={session.user.name} />

        {/* Content */}
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
