import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Barber — Gestión financiera para barberías',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Barber — Gestión financiera para barberías',
    description:
      'Registrá ventas, calculá comisiones y controlá las finanzas de tu barbería.',
    images: ['/og-image.png'],
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="My Barber" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Google Analytics 4 — se activa solo si hay NEXT_PUBLIC_GA_MEASUREMENT_ID */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-background min-h-screen font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
