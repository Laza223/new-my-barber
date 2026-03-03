/**
 * Reports — Server Component.
 * Verifica plan PRO/BUSINESS.
 */
import { ReportsPage } from '@/components/reports/reports-page';
import { requireOwner } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function ReportsPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const [professionals, access] = await Promise.all([
    professionalRepository.findByShopId(session.shop.id, true),
    subscriptionService.checkAccess(session.shop.id, 'reports'),
  ]);

  return (
    <ReportsPage
      shopId={session.shop.id}
      shopName={session.shop.name}
      professionals={professionals.map((p) => ({
        id: p.id,
        name: p.name,
        commissionRate: p.commissionRate,
        isOwner: p.isOwner,
      }))}
      hasAccess={access.allowed}
    />
  );
}
