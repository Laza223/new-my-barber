# My Barber — Documentación del Sistema

> Última actualización: Abril 2026
> Repositorio: https://github.com/Laza223/new-my-barber

---

## 1. Visión del Producto

**My Barber** es un SaaS de gestión financiera para barberías argentinas. Permite registrar ventas en ≤4 toques, calcular comisiones de profesionales automáticamente, visualizar métricas del negocio y exportar liquidaciones en PDF/Excel.

**No es** un sistema de turnos, agenda ni CRM. Es una herramienta financiera: cuánto facturé, cuánto le debo a cada profesional, cómo voy respecto a mi meta mensual.

**Usuario objetivo:** Barberos argentinos, usan celular todo el día, no son técnicos, necesitan flujos simples.

---

## 2. Modelo de Negocio

### Planes

| Plan | Precio | Profesionales | Servicios | Ventas/día | Características |
|------|--------|---------------|-----------|------------|-----------------|
| **Free** | Gratis | 1 | 3 | 10 | 7 días de historial |
| **Individual** | $24.999/mes | 1 | 50 | ∞ | Reportes, exportar PDF/Excel |
| **Business** | $47.999/mes | 10 | 50 | ∞ | Comisiones, insights, WhatsApp, exportar |

- **Trial:** 14 días con acceso completo al registrarse
- **Pagos:** MercadoPago (preferencias de pago)
- **Moneda:** ARS. Todos los montos en centavos (integer) para evitar floating point

### Métodos de pago que acepta el barbero

Efectivo, Transferencia, MercadoPago, Débito, Crédito.

---

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router + Server Components + Server Actions) |
| Runtime | Node.js ≥22 |
| Lenguaje | TypeScript estricto |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui (Radix) |
| DB | PostgreSQL 16 (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Better-Auth (email/password, JWT cookies) |
| Pagos | MercadoPago (fetch-based client) |
| Email | Resend + React Email |
| Charts | Recharts |
| Forms | react-hook-form + Zod |
| Animaciones | Framer Motion |
| Exportación | jsPDF (PDF), xlsx (Excel) |
| Analytics | Vercel Analytics + Speed Insights + GA4 (condicional) |
| Error tracking | Sentry (@sentry/nextjs) |
| Testing | Vitest + Testing Library |
| Deploy | Vercel + Neon |
| Package manager | pnpm 9 |

---

## 4. Arquitectura

```
┌───────────────────────────────────────────┐
│            Next.js 15 App Router          │
│  Server Components → Server Actions       │
│  Client Components (forms, charts, etc)   │
└──────────┬───────────────┬────────────────┘
           │               │
    ┌──────▼──────┐  ┌─────▼───────┐
    │  PostgreSQL  │  │  Servicios   │
    │  (Neon)      │  │  Externos    │
    │  Drizzle ORM │  │  • MercadoPago│
    │              │  │  • Resend    │
    └──────────────┘  │  • Sentry   │
                      └─────────────┘
```

### Capas del servidor

```
Repository  →  Service  →  Action (Server Action)
(queries)     (lógica)    (entrada del cliente)
```

- **Repository:** Único punto de contacto con la DB. Queries puras.
- **Service:** Lógica de negocio, cálculos, validaciones, reglas.
- **Action:** Server Action de Next.js. Valida input con Zod, delega al service.

---

## 5. Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx            # Root: Inter font, Sentry, Vercel Analytics, GA4, OG
│   ├── globals.css           # Tailwind v4 + design tokens (light/dark)
│   ├── sitemap.ts            # XML sitemap dinámico
│   ├── robots.ts             # Bloquea dashboard/API de indexación
│   ├── error.tsx             # Error boundary + Sentry capture + soporte
│   ├── not-found.tsx         # 404 + link soporte
│   │
│   ├── (auth)/               # Login, Register, Forgot/Reset Password
│   ├── (marketing)/          # Landing, Terms, Privacy
│   ├── (dashboard)/          # Dashboard, New Sale, Sales, Professionals,
│   │                         # Services, Reports, Settings
│   ├── onboarding/           # Wizard 5 pasos
│   │
│   └── api/
│       ├── auth/[...all]/    # Better-Auth handler
│       ├── health/           # Health check
│       ├── webhooks/mercadopago/  # Webhook con HMAC
│       └── cron/
│           ├── check-trials/     # Vencer trials expirados
│           └── check-subscriptions/ # Cancelar past_due
│
├── components/
│   ├── auth/                 # Login, Register, ForgotPassword, ResetPassword forms
│   ├── dashboard/            # Cards de métricas, charts, ranking, insights
│   ├── sales/                # Flujo ≤4 toques, filtros, lista, summary
│   ├── professionals/        # CRUD profesionales
│   ├── services/             # CRUD servicios
│   ├── reports/              # Liquidación, exportar PDF/Excel/WhatsApp
│   ├── settings/             # Plan, tienda, cuenta
│   ├── onboarding/           # Wizard steps
│   ├── subscription/         # Trial banner
│   ├── layout/               # Sidebar, mobile nav, header
│   └── ui/                   # shadcn/ui base
│
├── db/
│   ├── index.ts              # Drizzle client (Neon)
│   └── schema/               # 14 archivos de esquema
│
├── server/
│   ├── lib/                  # Auth config, errors, MercadoPago, Resend, get-session
│   ├── repositories/         # 7 repositorios (shop, sale, professional, etc.)
│   ├── services/             # 7 servicios de negocio
│   ├── actions/              # 10 server actions
│   └── emails/templates.ts   # 6 email templates HTML
│
├── lib/
│   ├── constants.ts          # PLANS, PAYMENT_METHODS, APP_CONFIG
│   ├── utils.ts              # formatCurrency, getInitials, cn
│   ├── analytics.ts          # trackEvent() → Vercel + GA4
│   ├── logger.ts             # JSON en prod, readable en dev + Sentry
│   ├── validations/          # Schemas Zod
│   └── types/                # ActionResponse, DashboardData, etc.
│
├── hooks/                    # Custom React hooks
├── middleware.ts             # Auth + rutas públicas
└── instrumentation.ts        # Sentry init (server/edge)
```

---

## 6. Base de Datos (14 tablas)

| Tabla | Descripción | FK principal |
|-------|-------------|-------------|
| `users` | Email, nombre, passwordHash, role | — |
| `accounts` | Better-Auth OAuth | → users |
| `sessions` | JWT sessions | → users (cascade) |
| `verifications` | Email verification tokens | — |
| `shops` | Barbería, slug, monthlyGoal, dailySalesLimit | → users (cascade) |
| `professionals` | Equipo, colorIndex, commissionRate | → shops (cascade), → users |
| `services` | Catálogo, duración, precio | → shops (cascade) |
| `sales` | Snapshot inmutable (precio, comisión, ownerAmount) | → shops (cascade), → professionals, → services |
| `subscriptions` | Plan, status, MP IDs, trial/period dates | → shops (cascade) |
| `payment_history` | Historial de pagos MP | → subscriptions (cascade) |
| `promotions` | Días promocionales con descuento | → shops (cascade), → services |
| `enums` | subscription_plan, subscription_status, payment_method, user_role | — |
| `relations` | Drizzle relaciones entre tablas | — |

### Patrón Snapshot en ventas

`sales` guarda `serviceName`, `servicePrice`, `commissionRate`, `ownerAmount` como valores fijos al momento de la venta. Si cambiás el precio del servicio después, las ventas históricas mantienen el valor original.

### Foreign Keys y cascadas

- Borrar un `user` → cascadea a `shops` → cascadea a todo lo demás
- `sales` tiene `restrict` a `professionals` y `services` (no se puede borrar un profesional con ventas)

---

## 7. Autenticación

**Proveedor:** Better-Auth (email/password).

### Flujos implementados

| Flujo | Ruta | Descripción |
|-------|------|-------------|
| Registro | `/register` | Email + password + nombre → crea user + shop + subscription trial |
| Login | `/login` | Email + password → sesión con JWT cookie |
| Forgot Password | `/forgot-password` | Envía email con link de reset |
| Reset Password | `/reset-password` | Token + nueva password |
| Verificación email | Automática via Better-Auth | Email al registrarse con link de verificación |
| Logout | Server Action | Limpia sesión |

### Middleware de autenticación

`middleware.ts` define rutas públicas (`/`, `/login`, `/register`, `/terms`, `/privacy`, `/forgot-password`, `/reset-password`, `/api/auth/*`, `/api/health`, `/api/webhooks/*`, `/api/cron/*`). Todo lo demás requiere sesión.

---

## 8. Pagos (MercadoPago)

### Flujo de suscripción

1. Usuario elige plan → `createCheckoutAction` crea preferencia de pago en MP
2. MP redirecciona al usuario a pagar
3. Webhook `POST /api/webhooks/mercadopago` recibe notificación
4. Validación de firma HMAC
5. Idempotencia: verifica que el pago no fue procesado antes
6. Actualiza `subscriptions` en DB (status, period dates, plan)
7. Envía email de confirmación

### Estados de suscripción

`trial` → `active` → `past_due` → `cancelled` / `expired`

---

## 9. Emails (Resend)

### Templates implementados (6)

| Template | Disparador |
|----------|-----------|
| `welcomeEmail` | Completar onboarding |
| `verificationEmail` | Registro |
| `passwordResetEmail` | Solicitud de reset |
| `planActivatedEmail` | Pago aprobado (webhook MP) |
| `trialWarningEmail` | Cron: 3 días antes de vencer trial |
| `cancellationEmail` | Cancelar suscripción |

---

## 10. Analytics y SEO

- **Vercel Analytics + Speed Insights:** Integrados en root layout
- **Google Analytics 4:** Condicional (requiere `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- **trackEvent():** Función tipada que envía a Vercel + GA4 (login, sign_up, etc.)
- **Sentry:** Client + Server + Edge configs, error boundary con capture automático
- **Sitemap:** Dinámico en `app/sitemap.ts`
- **robots.txt:** Bloquea `/dashboard`, `/api`, `/onboarding`
- **OG Image:** `public/og-image.png` (1200×630)
- **Metadata:** Title template, description, OG, Twitter cards

---

## 11. Cron Jobs

| Job | Ruta | Frecuencia | Función |
|-----|------|-----------|---------|
| Check Trials | `/api/cron/check-trials` | Diario | Marca trials vencidos como `expired` + envía warning email |
| Check Subscriptions | `/api/cron/check-subscriptions` | Diario | Cancela suscripciones `past_due` vencidas |

Protegidos con `CRON_SECRET` en header.

---

## 12. Variables de Entorno

```env
# General
NEXT_PUBLIC_APP_URL=https://mybarber.com.ar

# DB
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=...     # openssl rand -base64 32
BETTER_AUTH_URL=...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_WEBHOOK_SECRET=...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=...

# Email
RESEND_API_KEY=...
EMAIL_FROM="My Barber <no-reply@mybarber.com.ar>"

# Sentry
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=...
SENTRY_PROJECT=...

# Analytics (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Cron
CRON_SECRET=...
```

---

## 13. Legal

- **Términos de Servicio:** `/terms` — 10 secciones, ley argentina, CABA jurisdicción
- **Política de Privacidad:** `/privacy` — Ley 25.326, detalla datos recolectados, terceros (MercadoPago, Resend, Sentry, Vercel)
- **Eliminación de cuenta:** `deleteAccountAction` — borra todos los datos del usuario respetando FK

---

## 14. Páginas y Flujos Principales

### Landing (`/`)
Hero + pain points + features + testimonios + pricing + FOMO + CTA.

### Onboarding (`/onboarding`)
Wizard 5 pasos: info del negocio → servicios → equipo (Business) → primera venta demo → éxito.

### Dashboard (`/dashboard`)
10 queries paralelas: ventas de hoy, mes, charts (7 días), breakdown por método de pago, ranking profesionales, últimas ventas, insights (Business only).

### Nueva Venta (`/new-sale`)
Flujo ≤4 toques con animaciones: seleccionar profesional → servicio → método de pago → confirmar.

### Reportes (`/reports`)
Rango de fechas + selector de profesional → tabla de liquidación → exportar PDF/Excel/WhatsApp.

### Settings (`/settings`)
3 tabs: Plan (upgrade/cancelar), Tienda (nombre, dirección, meta), Cuenta.
