import type { NextConfig } from 'next';

const securityHeaders = [
  // Previene clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Previene MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Controla el referrer
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Previene XSS en navegadores viejos
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Permissions Policy — deshabilita features innecesarias
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  /* ── ESLint ──
     Next.js built-in ESLint step no soporta flat config (ESLint 9).
     Corremos lint por separado con `pnpm lint`. */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* ── TypeScript ──
     Type-check por separado con `pnpm type-check`. */
  typescript: {
    ignoreBuildErrors: true,
  },

  /* ── Experimental ── */
  experimental: {
    // Server Actions habilitadas (default en Next 15, explícito por claridad)
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimizar imports de paquetes pesados
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      'framer-motion',
    ],
  },

  /* ── Images ── */
  images: {
    remotePatterns: [
      // Avatares de usuarios (futuro)
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  /* ── Security Headers ── */
  async headers() {
    return [
      {
        // Aplica a todas las rutas
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  /* ── Redirects ── */
  async redirects() {
    return [
      // Redirigir /dashboard a / (la home del dashboard)
      // Se maneja en middleware, esto es fallback
    ];
  },

  /* ── Logging ── */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry solo sube source maps si hay token configurado
  silent: true,
  disableLogger: true,
  // Oculta source maps del cliente en producción
  hideSourceMaps: true,
  // Deshabilita el wizard interactivo
  widenClientFileUpload: true,
});
