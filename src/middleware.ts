import { NextRequest, NextResponse } from 'next/server';

/**
 * Rutas públicas que NO requieren autenticación.
 * Incluye marketing, auth, API endpoints, y assets estáticos.
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const PUBLIC_PREFIXES = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/icons/',
  '/manifest.json',
  '/logo',
];

/**
 * Middleware de Next.js — se ejecuta en CADA request.
 *
 * Flujo:
 * 1. Si es ruta pública → pasar
 * 2. Si no tiene session cookie → redirect /login
 * 3. Si tiene session pero no completó onboarding → redirect /onboarding
 *
 * NOTA: Better-Auth maneja la validación real del token.
 * Acá solo verificamos la existencia de la cookie como gate inicial.
 * La validación real ocurre en el server component/action.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rutas públicas — dejar pasar
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isPublicPrefix = PUBLIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isPublicRoute || isPublicPrefix) {
    return NextResponse.next();
  }

  // 2. Verificar existencia de session cookie
  // Better-Auth usa cookiePrefix: 'mybarber' en auth.ts
  const sessionToken = request.cookies.get('mybarber.session_token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    // Guardar la URL original para redirect post-login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verificar onboarding
  // Se lee de una cookie custom que seteamos post-login
  // Si no existe la cookie, dejamos pasar y el layout del dashboard verifica
  const onboardingCompleted = request.cookies.get(
    'mybarber-onboarding-completed',
  )?.value;

  if (onboardingCompleted === 'false' && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 4. Si está en onboarding pero ya completó → redirigir al dashboard
  if (onboardingCompleted === 'true' && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher — rutas donde corre el middleware.
 * Excluye archivos estáticos y API routes internos de Next.js
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
