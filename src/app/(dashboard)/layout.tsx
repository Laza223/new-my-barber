import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

/**
 * Layout principal de la app (protegido).
 * Incluye sidebar y header de navegación.
 * Solo accesible con sesión activa + onboarding completado.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — se implementa en fase de UI */}
      <aside className="hidden w-64 border-r md:block">
        <div className="p-4">
          <h2 className="text-lg font-bold">My Barber</h2>
        </div>
        {/* Navigation links — próxima fase */}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header / mobile nav — próxima fase */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
