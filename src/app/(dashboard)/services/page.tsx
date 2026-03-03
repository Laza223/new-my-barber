/**
 * Gestión de servicios — Server Component.
 */
import { ServicesPage } from '@/components/services/services-page';
import { requireOwner } from '@/server/lib/get-session';
import { serviceRepository } from '@/server/repositories/service.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function ServicesPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const services = await serviceRepository.findByShopId(
    session.shop.id,
    false, // Include inactive
  );

  const access = await subscriptionService.checkAccess(
    session.shop.id,
    'services',
  );

  const activeCount = services.filter((s) => s.isActive).length;
  const canAddMore =
    access.allowed &&
    (access.limit === undefined || activeCount < access.limit);

  return (
    <ServicesPage
      shopId={session.shop.id}
      services={services}
      canAddMore={canAddMore}
      planRequired={access.allowed ? undefined : 'Individual'}
    />
  );
}
