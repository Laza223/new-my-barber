/**
 * robots.txt dinámico — Next.js App Router.
 * Permite indexación de páginas públicas, bloquea el dashboard y API.
 */
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mybarber.com.ar';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/terms', '/privacy'],
        disallow: [
          '/dashboard',
          '/inicio',
          '/settings',
          '/professionals',
          '/services',
          '/sales',
          '/reports',
          '/new-sale',
          '/onboarding',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
