/**
 * Historial de ventas — Server Component con searchParams.
 */
import { SalesPage } from '@/components/sales/sales-page';
import { requireOwner } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SalesPageRoute({ searchParams }: Props) {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const params = await searchParams;
  const professionals = await professionalRepository.findByShopId(
    session.shop.id,
    true,
  );

  return (
    <SalesPage
      shopId={session.shop.id}
      professionals={professionals.map((p) => ({
        id: p.id,
        name: p.name,
      }))}
      initialFilters={{
        startDate: params.start,
        endDate: params.end,
        professionalId: params.professional,
        paymentMethod: params.payment,
        page: params.page ? Number(params.page) : 1,
      }}
    />
  );
}
