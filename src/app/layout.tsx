import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'My Barber — Gestión financiera para barberías',
    template: '%s | My Barber',
  },
  description:
    'Registrá ventas, calculá comisiones y controlá las finanzas de tu barbería. Simple, rápido y pensado para barberos argentinos.',
  keywords: [
    'barbería',
    'gestión',
    'ventas',
    'comisiones',
    'Argentina',
    'SaaS',
  ],
  authors: [{ name: 'My Barber' }],
  creator: 'My Barber',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'My Barber',
    title: 'My Barber — Gestión financiera para barberías',
    description:
      'Registrá ventas, calculá comisiones y controlá las finanzas de tu barbería.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0891b2', // cyan-600
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
