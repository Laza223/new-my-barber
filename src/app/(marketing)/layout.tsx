/**
 * Marketing Layout — used for landing page and public pages.
 * Statically generated (SSG).
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Barber — Gestión inteligente para tu barbería',
  description:
    'Registrá ventas en 4 toques, controlá comisiones, liquidaciones y reportes. La app #1 para barberos en Argentina.',
  keywords: [
    'barbería',
    'gestión barbería',
    'app barberos',
    'ventas barbería',
    'comisiones barberos',
    'software barbería argentina',
  ],
  openGraph: {
    title: 'My Barber — Gestión inteligente para tu barbería',
    description:
      'Registrá ventas en 4 toques. Dashboard, comisiones, liquidaciones y más.',
    type: 'website',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
