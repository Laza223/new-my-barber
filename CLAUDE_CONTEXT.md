# My Barber — Contexto del Proyecto

## Qué es

SaaS de gestión financiera para barberías en Argentina.
Permite registrar ventas rápidamente, calcular comisiones
de profesionales automáticamente, ver métricas del negocio
y exportar liquidaciones. NO es un sistema de turnos/agenda.

## Stack

- Framework: Next.js 15 (App Router + Server Actions + Server Components)
- UI: React 19 + Tailwind CSS v4 + shadcn/ui
- DB: PostgreSQL 16 (Neon) + Drizzle ORM
- Auth: Better-Auth (email/password, JWT cookies)
- Pagos: MercadoPago (fetch-based, sin SDK oficial)
- Charts: Recharts
- Forms: react-hook-form + zod
- Animations: framer-motion
- Email: Resend + React Email (6 templates)
- Analytics: Vercel Analytics + SpeedInsights + GA4 (condicional)
- Error tracking: Sentry (client + server + edge)
- WhatsApp: URL builder (wa.me)
- Testing: Vitest + Testing Library
- PWA: manifest.json + apple-mobile-web-app
- Deploy: Vercel + Neon
- Package manager: pnpm 9

## Modelo de negocio

- Plan FREE: 1 profesional, 3 servicios, 10 ventas/día, 7 días historial
- Plan Individual ($24.999 ARS/mes): 1 profesional, ilimitado, exportar
- Plan Business ($47.999 ARS/mes): hasta 10 profesionales, comisiones,
  liquidaciones, insights, WhatsApp
- Trial: 14 días con acceso completo

## Convenciones de código

- TypeScript estricto (no any, no as, no !)
- Archivos en kebab-case
- Componentes React en PascalCase
- Server Actions en camelCase con prefijo (ej: createSale, updateShop)
- Siempre named exports (no default exports excepto pages)
- Montos en centavos (integer), nunca decimales
- Fechas en timezone America/Argentina/Buenos_Aires
- Usar "type" en vez de "interface"
- Comentarios en español para lógica de negocio
- Comentarios en inglés para lógica técnica

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx            # Root: Inter, Sentry, Analytics, GA4, OG
│   ├── globals.css           # Tailwind v4 + design tokens (light/dark)
│   ├── sitemap.ts            # XML sitemap dinámico
│   ├── robots.ts             # Bloquea dashboard/API
│   ├── error.tsx             # Error boundary + Sentry + soporte
│   ├── not-found.tsx         # 404 + soporte
│   │
│   ├── (auth)/
│   │   ├── layout.tsx        # Auth layout (centered)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (marketing)/
│   │   ├── layout.tsx        # SEO metadata
│   │   ├── page.tsx          # Landing: hero, features, pricing, CTA
│   │   ├── terms/page.tsx    # Términos de Servicio
│   │   └── privacy/page.tsx  # Política de Privacidad
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx        # Sidebar + header + trial banner + mobile nav
│   │   ├── dashboard/page.tsx
│   │   ├── new-sale/page.tsx + loading.tsx
│   │   ├── sales/page.tsx
│   │   ├── professionals/page.tsx + loading.tsx
│   │   ├── services/page.tsx + loading.tsx
│   │   ├── reports/page.tsx + loading.tsx
│   │   └── settings/page.tsx
│   │
│   ├── onboarding/page.tsx   # 5-step wizard
│   │
│   └── api/
│       ├── auth/[...all]/route.ts       # Better-Auth handler
│       ├── health/route.ts
│       ├── webhooks/mercadopago/route.ts # MP webhook (HMAC)
│       └── cron/
│           ├── check-trials/route.ts
│           └── check-subscriptions/route.ts
│
├── components/
│   ├── auth/                 # Login, Register, ForgotPassword, ResetPassword forms
│   ├── layout/               # sidebar, mobile-nav, dashboard-header
│   ├── onboarding/           # Wizard: 5 steps + indicator
│   ├── dashboard/            # Metrics cards, charts, ranking, insights
│   ├── sales/                # Sale flow (≤4 taps), filters, list, summary
│   ├── professionals/        # Page, card, form
│   ├── services/             # Page, card, form, currency-input
│   ├── reports/              # Liquidation table, export PDF/Excel/WhatsApp
│   ├── settings/             # Plan, shop, account tabs
│   ├── subscription/         # Trial banner
│   └── ui/                   # shadcn/ui base components
│
├── db/
│   ├── index.ts              # Drizzle client (Neon)
│   └── schema/               # users, shops, professionals, services, sales,
│                             # subscriptions, payment-history, promotions,
│                             # accounts, sessions, verifications, enums, relations
│
├── server/
│   ├── lib/
│   │   ├── auth.ts           # Better-Auth config + Resend email callbacks
│   │   ├── auth-client.ts    # Client-side auth helpers
│   │   ├── get-session.ts    # requireSession, requireOwner
│   │   ├── errors.ts         # AppError, NotFoundError, etc.
│   │   ├── mercadopago.ts    # Fetch-based MP client + HMAC verify
│   │   └── resend.ts         # Resend sendEmail wrapper
│   │
│   ├── repositories/         # shop, sale, professional, service,
│   │                         # subscription, dashboard, promotion
│   ├── services/             # Matching services for each repository
│   ├── actions/              # account, auth, dashboard, onboarding,
│   │                         # professional, promotion, sale, service,
│   │                         # shop, subscription
│   └── emails/templates.ts   # 6 HTML email templates
│
├── lib/
│   ├── constants.ts          # PLANS, PAYMENT_METHODS, APP_CONFIG
│   ├── utils.ts              # formatCurrency, getInitials, cn
│   ├── analytics.ts          # trackEvent() → Vercel + GA4
│   ├── logger.ts             # JSON (prod) / readable (dev) + Sentry
│   ├── validations/          # Zod schemas
│   └── types/                # ActionResponse, DashboardData, etc.
│
├── middleware.ts             # Auth + public routes
└── instrumentation.ts        # Sentry init (server/edge)

# Root config files
├── sentry.client.config.ts   # Sentry client (replays)
├── sentry.server.config.ts   # Sentry server
├── sentry.edge.config.ts     # Sentry edge
├── next.config.ts            # withSentryConfig + security headers
├── .env.local                # Environment variables (never commit)
└── .env.example              # Template with all required vars
```

## Schema de DB (14 tablas)

| Tabla           | Descripción                                                       |
| --------------- | ----------------------------------------------------------------- |
| users           | Email, nombre, passwordHash, role                                 |
| accounts        | Better-Auth OAuth accounts                                        |
| sessions        | JWT sessions (cascade from users)                                 |
| verifications   | Email verification tokens                                         |
| shops           | Barbería (1:1 user), slug, monthlyGoal, dailySalesLimit           |
| professionals   | Equipo, colorIndex, commissionRate                                |
| services        | Catálogo, duración, precio                                        |
| sales           | Snapshot (serviceName, servicePrice, commissionRate, ownerAmount)  |
| subscriptions   | Plan, status, MP IDs, trial/period dates                          |
| payment_history | Historial de pagos MP                                             |
| promotions      | Días promocionales, descuento, servicio                           |

## Patrones

- Server Components para páginas que muestran datos
- Client Components ("use client") solo cuando necesitan
  interactividad (formularios, animaciones, estado local)
- Server Actions para mutaciones (crear, actualizar, eliminar)
- Zod para validación en server Y client
- AppError para errores de negocio
- Drizzle queries tipadas, SQL raw solo para aggregations complejas
- Optimistic updates en el registro de venta
- Repository → Service → Action (3-layer architecture)
- Snapshots en ventas (precio y comisión inmutables)
- Auto-refresh en dashboard (60s interval)
- HMAC verification en webhooks
- Structured logging (JSON en prod, readable en dev)
- Sentry error capture en error boundary y logger

## API Routes

| Route                          | Método | Descripción                                  |
| ------------------------------ | ------ | -------------------------------------------- |
| /api/auth/[...all]             | *      | Better-Auth handler                          |
| /api/health                    | GET    | Health check                                 |
| /api/webhooks/mercadopago      | POST   | MP payment webhook (HMAC)                    |
| /api/cron/check-trials         | GET    | Expire trials (CRON_SECRET)                  |
| /api/cron/check-subscriptions  | GET    | Cancel past_due subs (CRON_SECRET)           |

## Email Templates (6)

| Template             | Disparador                    |
| -------------------- | ----------------------------- |
| welcomeEmail         | Completar onboarding          |
| verificationEmail    | Registro (Better-Auth)        |
| passwordResetEmail   | Forgot password               |
| planActivatedEmail   | Pago aprobado (webhook MP)    |
| trialWarningEmail    | Cron: 3 días antes de vencer  |
| cancellationEmail    | Cancelar suscripción          |

## Env vars requeridas

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=...
NEXT_PUBLIC_APP_URL=https://...
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_WEBHOOK_SECRET=...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=...
CRON_SECRET=...
NEXT_PUBLIC_SENTRY_DSN=...          # opcional
NEXT_PUBLIC_GA_MEASUREMENT_ID=...   # opcional
```

## Reglas inquebrantables

1. NUNCA exponer passwordHash al cliente
2. NUNCA confiar solo en validación del cliente
3. SIEMPRE verificar ownership antes de mutar datos
4. SIEMPRE usar snapshots en ventas (precio y comisión inmutables)
5. SIEMPRE verificar límites del plan en el servidor
6. TODOS los montos en centavos
7. NUNCA usar "any"
