/**
 * Wizard de onboarding — 5 pasos.
 * Server Component: verifica auth y redirect si ya tiene shop.
 */
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { getSession } from '@/server/lib/get-session';
import { shopRepository } from '@/server/repositories/shop.repository';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Configurá tu barbería — My Barber',
};

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Si ya tiene barbería → dashboard
  const shop = await shopRepository.findByOwnerId(session.user.id);
  if (shop) {
    redirect('/dashboard');
  }

  return (
    <div className="from-background via-background to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-2xl">
        <OnboardingWizard userName={session.user.name} />
      </div>
    </div>
  );
}
