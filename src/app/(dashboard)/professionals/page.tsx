/**
 * Gestión de profesionales — Server Component.
 */
import { ProfessionalsPage } from '@/components/professionals/professionals-page';
import { requireOwner } from '@/server/lib/get-session';
import { professionalService } from '@/server/services/professional.service';
import { subscriptionService } from '@/server/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function ProfessionalsPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const pros = await professionalService.getProfessionalsWithStats(
    session.shop.id,
    session.user.id,
  );

  const access = await subscriptionService.checkAccess(
    session.shop.id,
    'professionals',
  );

  const currentCount = pros.length;
  const canAddMore =
    access.allowed &&
    (access.limit === undefined || currentCount < access.limit);

  return (
    <ProfessionalsPage
      shopId={session.shop.id}
      professionals={pros}
      canAddMore={canAddMore}
      planRequired={access.allowed ? undefined : 'Business'}
    />
  );
}
