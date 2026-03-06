/**
 * Inicio — Server Component.
 * Muestra las ventas del día + bottom sheet para nueva venta.
 */
import { InicioPage } from '@/components/dashboard/inicio-page';
import { requireOwner } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { saleRepository } from '@/server/repositories/sale.repository';
import { serviceRepository } from '@/server/repositories/service.repository';
import { dashboardService } from '@/server/services/dashboard.service';
import { subscriptionService } from '@/server/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function InicioRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const [data, pros, svcs, todayCount, dailyLimit] = await Promise.all([
    dashboardService.getDashboard(session.shop.id, session.user.id),
    professionalRepository.findByShopId(session.shop.id, true),
    serviceRepository.findByShopId(session.shop.id, true),
    saleRepository.countTodaySales(session.shop.id),
    subscriptionService.checkDailySalesLimit(session.shop.id),
  ]);

  return (
    <InicioPage
      shopId={session.shop.id}
      today={data.today}
      recentSales={data.recentSales}
      isNewShop={
        data.thisMonth.salesCount === 0 && data.recentSales.length === 0
      }
      saleFormData={{
        professionals: pros.map((p) => ({
          id: p.id,
          name: p.name,
          colorIndex: p.colorIndex,
          isOwner: p.isOwner,
        })),
        services: svcs.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          duration: s.duration,
          sortOrder: s.sortOrder,
        })),
        todaySalesCount: todayCount,
        dailySalesLimit: dailyLimit.limit ?? null,
        canSell: dailyLimit.allowed,
      }}
    />
  );
}
