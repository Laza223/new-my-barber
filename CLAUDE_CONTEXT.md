# My Barber — Contexto del Proyecto

## Qué es

SaaS de gestión financiera para barberías en Argentina.
Permite registrar ventas rápidamente, calcular comisiones
de profesionales automáticamente, ver métricas del negocio
y exportar liquidaciones.

## Stack

- Framework: Next.js 15 (App Router + Server Actions + Server Components)
- UI: React 19 + Tailwind CSS v4 + shadcn/ui
- DB: PostgreSQL 16 (Neon) + Drizzle ORM
- Auth: Better-Auth (email/password, JWT cookies)
- Pagos: MercadoPago (suscripciones, fetch-based sin SDK)
- Charts: Recharts
- Forms: react-hook-form + zod
- Animations: framer-motion
- Email: Resend + React Email
- WhatsApp: URL builder (wa.me)
- Testing: Vitest + Testing Library
- PWA: manifest.json + apple-mobile-web-app
- Deploy: Vercel + Neon

## Modelo de negocio

- Plan FREE: 1 profesional, 3 servicios, 15 ventas/día, 7 días historial
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
├── __tests__/
│   ├── setup.ts              # Mock env vars
│   ├── constants.test.ts     # PLANS, PAYMENT_METHODS, APP_CONFIG
│   ├── utils.test.ts         # formatCurrency, getInitials, cn
│   └── whatsapp.test.ts      # WhatsApp summary builders
│
├── app/
│   ├── layout.tsx            # Root: Inter font, SEO, viewport, PWA meta
│   ├── globals.css           # Tailwind + design tokens
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404
│   │
│   ├── (auth)/
│   │   ├── layout.tsx        # Auth layout (centered)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (marketing)/
│   │   ├── layout.tsx        # SEO metadata, OG tags
│   │   └── page.tsx          # Landing: hero, features, pricing, CTA
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx        # Sidebar + header + trial banner + mobile nav
│   │   ├── dashboard/page.tsx
│   │   ├── new-sale/page.tsx
│   │   ├── sales/page.tsx
│   │   ├── professionals/page.tsx
│   │   ├── services/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── onboarding/
│   │   └── page.tsx          # 5-step wizard
│   │
│   └── api/
│       ├── auth/[...all]/route.ts    # Better-Auth handler
│       ├── health/route.ts
│       ├── webhooks/mercadopago/route.ts  # MP webhook (HMAC)
│       └── cron/
│           ├── check-subscriptions/route.ts  # Expire trials, cancel past_due
│           └── daily-summary/route.ts        # Yesterday's sales per shop
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   │
│   ├── layout/
│   │   ├── sidebar.tsx           # Collapsible, 7 nav items, PRO badge
│   │   ├── mobile-nav.tsx        # 5 tabs, floating (+) button
│   │   └── dashboard-header.tsx  # Theme toggle, avatar dropdown
│   │
│   ├── onboarding/
│   │   ├── onboarding-wizard.tsx  # Main orchestrator (5 steps)
│   │   ├── step-shop-info.tsx
│   │   ├── step-services.tsx
│   │   ├── step-team.tsx
│   │   ├── step-first-sale.tsx
│   │   ├── step-success.tsx
│   │   └── step-indicator.tsx
│   │
│   ├── dashboard/
│   │   ├── dashboard-page.tsx        # Grid layout, auto-refresh 60s, FAB
│   │   ├── today-card.tsx            # Count-up animation, vs yesterday
│   │   ├── month-progress-card.tsx   # Animated progress bar, goal
│   │   ├── revenue-chart.tsx         # Recharts area chart (7 days)
│   │   ├── payment-breakdown.tsx     # Recharts donut chart
│   │   ├── top-services-chart.tsx    # Horizontal bars
│   │   ├── professional-ranking.tsx  # Colored avatars + bars
│   │   ├── insights-section.tsx      # Blur+lock for FREE
│   │   └── recent-sales-list.tsx     # Last 10 sales
│   │
│   ├── sales/
│   │   ├── sale-flow.tsx             # ≤4 taps, framer-motion transitions
│   │   ├── professional-selector.tsx
│   │   ├── service-selector.tsx
│   │   ├── payment-selector.tsx
│   │   ├── sale-confirm.tsx          # Expandable tip/notes
│   │   ├── sale-success.tsx          # Animated checkmark, auto-dismiss
│   │   ├── daily-limit-warning.tsx
│   │   ├── sales-page.tsx            # Filters + list + summary bar
│   │   ├── sales-filters.tsx         # Date presets, pro/payment dropdowns
│   │   ├── sale-list-item.tsx        # Expandable sale row
│   │   └── sales-summary-bar.tsx     # Sticky bottom totals
│   │
│   ├── professionals/
│   │   ├── professionals-page.tsx
│   │   ├── professional-card.tsx     # Color border, stats
│   │   └── professional-form.tsx     # Add/edit dialog
│   │
│   ├── services/
│   │   ├── services-page.tsx
│   │   ├── service-card.tsx
│   │   ├── service-form.tsx
│   │   └── currency-input.tsx        # ARS formatted input
│   │
│   ├── reports/
│   │   ├── reports-page.tsx          # Date range + pro selector
│   │   ├── liquidation-table.tsx     # Pro breakdown table
│   │   └── export-buttons.tsx        # PDF (jsPDF), Excel (xlsx), WhatsApp
│   │
│   ├── settings/
│   │   ├── settings-page.tsx         # 3 tabs (Plan/Shop/Account)
│   │   ├── plan-section.tsx          # 3 plan cards, feature table, MP checkout
│   │   └── shop-settings-form.tsx    # Edit name/address/phone/goal
│   │
│   ├── subscription/
│   │   └── trial-banner.tsx          # 3 urgency levels, daily dismiss
│   │
│   └── ui/                           # shadcn/ui base components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── sonner.tsx
│       └── ...
│
├── db/
│   ├── index.ts              # Drizzle client (Neon)
│   └── schema/
│       ├── enums.ts           # plan, status, payment_method
│       ├── users.ts
│       ├── accounts.ts        # Better-Auth
│       ├── sessions.ts        # Better-Auth
│       ├── verifications.ts   # Better-Auth
│       ├── shops.ts           # 1:1 with users
│       ├── professionals.ts   # N:1 with shops
│       ├── services.ts        # N:1 with shops
│       ├── sales.ts           # Snapshot pattern
│       ├── subscriptions.ts   # MP integration
│       ├── payment-history.ts
│       ├── relations.ts       # All Drizzle relations
│       └── index.ts           # Barrel export
│
├── server/
│   ├── lib/
│   │   ├── auth.ts            # Better-Auth config
│   │   ├── auth-client.ts     # Client-side auth helpers
│   │   ├── get-session.ts     # requireSession, requireOwner
│   │   ├── errors.ts          # AppError, NotFoundError, etc.
│   │   ├── mercadopago.ts     # Fetch-based MP client
│   │   └── whatsapp.ts        # Summary builders + URL
│   │
│   ├── repositories/
│   │   ├── shop.repository.ts
│   │   ├── professional.repository.ts
│   │   ├── service.repository.ts
│   │   ├── sale.repository.ts
│   │   ├── subscription.repository.ts
│   │   └── dashboard.repository.ts    # 10 parallel queries
│   │
│   ├── services/
│   │   ├── shop.service.ts
│   │   ├── professional.service.ts
│   │   ├── service.service.ts
│   │   ├── sale.service.ts
│   │   ├── subscription.service.ts    # Plan access + daily limit
│   │   └── dashboard.service.ts       # Insights generator
│   │
│   └── actions/
│       ├── shop.actions.ts
│       ├── professional.actions.ts
│       ├── service.actions.ts
│       ├── sale.actions.ts
│       ├── subscription.actions.ts    # Checkout, cancel, downgrade
│       └── dashboard.actions.ts
│
└── lib/
    ├── constants.ts           # PLANS, PAYMENT_METHODS, APP_CONFIG
    ├── utils.ts               # formatCurrency, getInitials, cn
    ├── validations.ts         # Zod schemas
    └── types/
        ├── common.ts          # ActionResponse, PaginatedResult
        ├── dashboard.ts       # DashboardData
        ├── sale.ts            # SaleWithDetails
        ├── subscription.ts    # PlanAccess, PlanFeature
        └── ...
```

## Schema de DB (13 tablas)

| Tabla           | Descripción                                                       |
| --------------- | ----------------------------------------------------------------- |
| users           | Email, nombre, passwordHash                                       |
| accounts        | Better-Auth OAuth accounts                                        |
| sessions        | JWT sessions                                                      |
| verifications   | Email verification tokens                                         |
| shops           | Barbería (1:1 user), slug, monthlyGoal                            |
| professionals   | Equipo, colorIndex, commissionRate                                |
| services        | Catálogo, duración, precio                                        |
| sales           | Snapshot (serviceName, servicePrice, commissionRate, ownerAmount) |
| subscriptions   | Plan, status, MP IDs, trial/period dates                          |
| payment_history | Historial de pagos MP                                             |

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

## API Routes

| Route                         | Método | Descripción                                  |
| ----------------------------- | ------ | -------------------------------------------- |
| /api/auth/[...all]            | \*     | Better-Auth handler                          |
| /api/health                   | GET    | Health check                                 |
| /api/webhooks/mercadopago     | POST   | MP payment webhook (HMAC)                    |
| /api/cron/check-subscriptions | GET    | Expire trials, cancel past_due (CRON_SECRET) |
| /api/cron/daily-summary       | GET    | Yesterday's sales summary (CRON_SECRET)      |

## Env vars requeridas

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=https://...
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_WEBHOOK_SECRET=...
CRON_SECRET=...
```

## Reglas inquebrantables

1. NUNCA exponer passwordHash al cliente
2. NUNCA confiar solo en validación del cliente
3. SIEMPRE verificar ownership antes de mutar datos
4. SIEMPRE usar snapshots en ventas (precio y comisión inmutables)
5. SIEMPRE verificar límites del plan en el servidor
6. TODOS los montos en centavos
7. NUNCA usar "any"
