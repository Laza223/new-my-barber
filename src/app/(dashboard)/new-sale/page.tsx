/**
 * New Sale — Server Component.
 * Pre-carga profesionales y servicios activos.
 */
import { SaleFlow } from '@/components/sales/sale-flow';
import { requireOwner } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { saleRepository } from '@/server/repositories/sale.repository';
import { serviceRepository } from '@/server/repositories/service.repository';
import { subscriptionService } from '@/server/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function NewSalePage() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const [pros, svcs, todayCount, dailyLimit] = await Promise.all([
    professionalRepository.findByShopId(session.shop.id, true),
    serviceRepository.findByShopId(session.shop.id, true),
    saleRepository.countTodaySales(session.shop.id),
    subscriptionService.checkDailySalesLimit(session.shop.id),
  ]);

  if (svcs.length === 0) {
    redirect('/services');
  }

  return (
    <SaleFlow
      shopId={session.shop.id}
      professionals={pros.map((p) => ({
        id: p.id,
        name: p.name,
        colorIndex: p.colorIndex,
        isOwner: p.isOwner,
      }))}
      services={svcs.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        sortOrder: s.sortOrder,
      }))}
      todaySalesCount={todayCount}
      dailySalesLimit={dailyLimit.limit ?? null}
      canSell={dailyLimit.allowed}
    />
  );
}
