import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Barber — Gestión financiera para barberías',
};

/**
 * Layout para páginas de marketing (landing page).
 * No tiene sidebar ni navegación de la app.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header de marketing — se implementa en siguiente fase */}
      <main className="flex-1">{children}</main>
      {/* Footer — se implementa en siguiente fase */}
    </div>
  );
}
