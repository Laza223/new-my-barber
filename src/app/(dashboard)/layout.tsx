/**
 * Dashboard Layout — sidebar + mobile nav + header + trial banner.
 * Server component that fetches session data for layout.
 */
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Sidebar } from '@/components/layout/sidebar';
import { TrialBanner } from '@/components/subscription/trial-banner';
import { requireOwner } from '@/server/lib/get-session';
import { subscriptionRepository } from '@/server/repositories/subscription.repository';
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
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const subscription = await subscriptionRepository.findByShopId(
    session.shop.id,
  );
  const planId = subscription?.plan ?? 'free';
  const isTrial =
    subscription?.status === 'trialing' &&
    subscription?.trialEndsAt &&
    subscription.trialEndsAt > new Date();

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar shopName={session.shop.name} planId={planId} />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Trial banner */}
        {isTrial && subscription?.trialEndsAt && (
          <TrialBanner trialEndsAt={subscription.trialEndsAt.toISOString()} />
        )}

        {/* Header */}
        <DashboardHeader
          shopName={session.shop.name}
          userName={session.user.name}
        />

        {/* Content */}
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
