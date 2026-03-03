/**
 * Dashboard — Server Component.
 */
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { requireOwner } from '@/server/lib/get-session';
import { dashboardService } from '@/server/services/dashboard.service';
import { redirect } from 'next/navigation';

export default async function DashboardPageRoute() {
  let session;
  try {
    session = await requireOwner();
  } catch {
    redirect('/login');
  }

  const data = await dashboardService.getDashboard(
    session.shop.id,
    session.user.id,
  );

  return <DashboardPage shopId={session.shop.id} initialData={data} />;
}
