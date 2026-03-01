📋 My Barber v2 — Documentación Técnica Definitiva
Versión final unificada. Incluye todas las correcciones de auditoría, análisis de seguridad, requisitos legales, convenciones de desarrollo, y checklist pre-launch. Cada corrección o adición respecto a versiones anteriores está marcada con su origen.

ÍNDICE
text

PARTE I — FUNDAMENTOS

1.  Visión General y Decisiones Arquitectónicas
2.  Stack Tecnológico Final
3.  Estructura del Monorepo
4.  Variables de Entorno

PARTE II — CONVENCIONES (definir ANTES de codear) 5. Base de Datos — Modelo Completo 6. Convenciones Globales

PARTE III — DESARROLLO (fase por fase) 7. FASE 1: Cimientos (Infraestructura + Auth) 8. FASE 2: Core del Negocio 9. FASE 3: Suscripciones y Pagos con MercadoPago 10. FASE 4: Dashboard, Reportes y Exportación 11. FASE 5: Pulido, PWA, Testing, Deploy

PARTE IV — CALIDAD Y OPERACIONES 12. Seguridad 13. Performance y Optimización 14. Logging y Observabilidad 15. Testing — Estrategia Completa 16. Requisitos Legales 17. Infraestructura y Operaciones 18. Guía de Errores y Edge Cases

PARTE V — LAUNCH Y POST-LAUNCH 19. Checklist Pre-Launch 20. Analytics y Métricas Post-Launch 21. Futuras Mejoras
PARTE I — FUNDAMENTOS

1. VISIÓN GENERAL Y DECISIONES ARQUITECTÓNICAS
   1.1 Qué es My Barber
   SaaS de gestión financiera para barberías argentinas. Registra ventas, calcula comisiones, genera reportes y gestiona suscripciones. Dos planes: Individual ($24,999 ARS/mes) y Business ($47,999 ARS/mes, hasta 10 profesionales).

No es un sistema de turnos/agenda. No es un CRM. Es una herramienta financiera: cuánto facturé, cuánto le debo a cada profesional, cómo voy respecto a mi meta mensual.

1.2 Principios de diseño
Simplicidad sobre abstracción: función simple > clase con 5 interfaces
Type-safety end-to-end: TypeScript estricto desde la DB hasta el componente React
Una fuente de verdad: cada dato vive en un solo lugar
Autogestión: sin dependencia de servicios con límites arbitrarios
Convención sobre configuración: patrones predecibles en todo el codebase
Explícito sobre implícito: cada convención documentada antes de codear
1.3 Arquitectura General
text

┌─────────────────────────────────────────────────────┐
│ CLIENTE │
│ React 19 SPA (Vite) — PWA instalable │
│ Se comunica con el backend vía REST + HttpOnly cookies│
└──────────────────────┬──────────────────────────────┘
│ HTTPS
┌──────────────────────▼──────────────────────────────┐
│ API (Fastify) │
│ Monolito modular: Controller → Service → Repository │
│ Middleware: authenticate, authorize, rateLimiter │
│ Request ID en cada request para trazabilidad │
└──────────┬────────────────────┬─────────────────────┘
│ │
┌───────▼───────┐ ┌──────▼──────┐
│ PostgreSQL │ │ Servicios │
│ (self-hosted)│ │ Externos │
│ Drizzle ORM │ │ • MercadoPago│
│ UTC timezone │ │ • Resend │
└───────────────┘ │ • Sentry │
└─────────────┘
Monolito modular. Un solo servidor Fastify. Cada dominio de negocio separado en módulos con 3 capas:

Controller: recibe request, delega al service, envía response. No contiene lógica de negocio.
Service: TODA la lógica de negocio, cálculos, validaciones, reglas. Es lo que se testea con unit tests.
Repository: único punto de contacto con la DB. Queries puras, sin lógica.
¿Por qué no arquitectura limpia/hexagonal/DDD? Con 7 entidades y un desarrollador, esas abstracciones agregan capas sin valor. Controller-Service-Repository da separación suficiente. Si crece a 20+ entidades y equipo de 5+, ahí se justifica.

1.4 Formato de respuestas API
text

Éxito: { success: true, data: { ... } }
Error: { success: false, error: { code: "NOT_FOUND", message: "...", requestId: "uuid", details?: ... } }
Lista: { success: true, data: [...], meta: { total, page, limit, totalPages } }
Cada response de error incluye requestId para que el usuario pueda compartirlo al reportar problemas.

1.5 Nomenclatura
La entidad barbers representa al negocio/dueño, no solo a la persona:

barbers.name = nombre del dueño (persona)
barbers.fantasy_name = nombre del local (negocio)
En código: siempre barber como nombre de variable
1.6 Versionado de API
No se versiona. El único consumidor es el frontend propio que se deploya junto con el backend. Si en el futuro se abre API pública, se implementa /api/v1/. Decisión consciente.

2. STACK TECNOLÓGICO FINAL
   Capa Tecnología Versión Justificación
   Monorepo Turborepo + pnpm Latest Cache de builds, pnpm eficiente
   Runtime Node.js 20 LTS Soporte hasta Apr 2026
   Framework Fastify 5.x 5x más rápido que Express, TS nativo, Pino integrado
   ORM Drizzle ORM Pinear exacta SQL-like, type-safe, drizzle-zod
   DB PostgreSQL 16 Self-hosted. Soporte hasta Nov 2028
   Validación Zod 3.x Compartido front/back vía monorepo
   Auth JWT custom - Access (15min) + Refresh (7d) en HttpOnly cookies
   Pagos MercadoPago SDK 2.x Preapproval para suscripciones en Argentina
   Email Resend + React Email Latest 3000/mes gratis, templates con React
   Logging Pino (Fastify) Incluido 10x más rápido que Winston
   Errores Sentry Latest tracesSampleRate 0.1 en producción
   Aritmética decimal.js Latest Cálculos monetarios sin floating point
   Compresión @fastify/compress Latest gzip/brotli automático
   Frontend React 19 useActionState, useOptimistic
   Build Vite + SWC Latest HMR instantáneo
   Estilos TailwindCSS 4 + shadcn/ui Latest Accesible (Radix), tema customizable
   State TanStack Query 5.x Cache, revalidación, optimistic updates
   Routing React Router 7.x Suficiente para SPA
   Gráficos Recharts Latest Solo Recharts, sin Nivo
   Animaciones Framer Motion Latest Solo transiciones y onboarding
   PWA vite-plugin-pwa Latest Service Worker, instalabilidad
   Testing Vitest + Supertest + Testing Library + Playwright Latest Unit, integration, component, E2E
   Exportación PDFKit + ExcelJS Latest PDF y Excel server-side
   CI/CD GitHub Actions - Lint, tests, deploy automático
   Lint ESLint + eslint-plugin-security Latest Strict rules desde día 1
   Dead code Knip Latest Detecta exports/deps/archivos no usados
   Monitoreo UptimeRobot Free 50 monitores gratis, checks cada 5min

2.1 Notas de compatibilidad
React 19 + shadcn/ui: soportado desde enero 2025. forwardRef ya no necesario.

Fastify 5 + plugins: todos los plugins oficiales soportan v5. Verificar versión al instalar.

TailwindCSS 4: config cambió respecto a v3. Ya no usa tailwind.config.js — config va en CSS con @theme. shadcn tiene templates para v4.

React Router 7: API diferente a v6. Leer guía de migración.

Drizzle ORM: pinear versión exacta. No usar ^ ni ~:

JSON

"drizzle-orm": "0.38.3",
"drizzle-kit": "0.30.1"
2.2 Base de datos autogestionada
VPS con PostgreSQL instalado (DigitalOcean $6/mes):

1GB RAM, 25GB SSD
PostgreSQL directamente en el servidor
Backups diarios con pg_dump → S3
Control total, sin límites
Backend corre en el mismo servidor 3. ESTRUCTURA DEL MONOREPO
text

my-barber/
├── apps/
│ ├── api/
│ │ ├── src/
│ │ │ ├── app.ts # Config Fastify + plugins
│ │ │ ├── server.ts # Entry point
│ │ │ ├── modules/
│ │ │ │ ├── auth/
│ │ │ │ │ ├── auth.controller.ts
│ │ │ │ │ ├── auth.service.ts
│ │ │ │ │ ├── auth.repository.ts
│ │ │ │ │ ├── auth.routes.ts
│ │ │ │ │ ├── auth.schemas.ts # Zod schemas input/output
│ │ │ │ │ ├── auth.errors.ts # Errores específicos
│ │ │ │ │ └── **tests**/
│ │ │ │ ├── barbers/
│ │ │ │ ├── sales/
│ │ │ │ ├── services/
│ │ │ │ ├── professionals/
│ │ │ │ ├── subscriptions/
│ │ │ │ ├── reports/
│ │ │ │ ├── export/
│ │ │ │ └── webhooks/
│ │ │ ├── infrastructure/
│ │ │ │ ├── database/
│ │ │ │ │ ├── connection.ts
│ │ │ │ │ ├── schema.ts # TODAS las tablas
│ │ │ │ │ ├── migrations/
│ │ │ │ │ └── seed.ts
│ │ │ │ ├── email/
│ │ │ │ │ ├── email.service.ts
│ │ │ │ │ └── templates/
│ │ │ │ ├── payments/
│ │ │ │ │ └── mercadopago.service.ts
│ │ │ │ └── jobs/
│ │ │ │ └── check-trials.ts
│ │ │ ├── shared/
│ │ │ │ ├── middleware/
│ │ │ │ │ ├── authenticate.ts
│ │ │ │ │ ├── authorize.ts
│ │ │ │ │ ├── rate-limiter.ts
│ │ │ │ │ └── error-handler.ts
│ │ │ │ ├── plugins/
│ │ │ │ │ ├── request-id.plugin.ts
│ │ │ │ │ ├── auth.plugin.ts
│ │ │ │ │ └── cors.plugin.ts
│ │ │ │ ├── errors/
│ │ │ │ │ └── app-errors.ts
│ │ │ │ └── utils/
│ │ │ │ ├── date.ts
│ │ │ │ ├── money.ts # decimal.js helpers
│ │ │ │ └── pagination.ts
│ │ │ └── config/
│ │ │ ├── env.ts # Zod-validated
│ │ │ └── constants.ts
│ │ ├── tests/
│ │ │ ├── integration/
│ │ │ │ └── helpers/
│ │ │ │ ├── setup.ts
│ │ │ │ └── factories.ts
│ │ │ └── e2e/
│ │ ├── drizzle.config.ts
│ │ ├── tsconfig.json
│ │ └── vitest.config.ts
│ │
│ └── web/
│ ├── src/
│ │ ├── app/
│ │ │ ├── App.tsx
│ │ │ ├── routes.tsx
│ │ │ ├── layouts/
│ │ │ │ ├── AuthLayout.tsx
│ │ │ │ ├── AppLayout.tsx
│ │ │ │ └── OnboardingLayout.tsx
│ │ │ └── providers/
│ │ │ ├── AuthProvider.tsx
│ │ │ ├── QueryProvider.tsx
│ │ │ └── ThemeProvider.tsx
│ │ ├── features/
│ │ │ ├── auth/
│ │ │ │ ├── components/
│ │ │ │ ├── api/
│ │ │ │ │ ├── auth.api.ts
│ │ │ │ │ └── auth.queries.ts
│ │ │ │ ├── hooks/
│ │ │ │ └── pages/
│ │ │ ├── sales/
│ │ │ ├── dashboard/
│ │ │ ├── services/
│ │ │ ├── professionals/
│ │ │ ├── commissions/
│ │ │ ├── subscription/
│ │ │ ├── settings/
│ │ │ └── onboarding/
│ │ ├── shared/
│ │ │ ├── components/
│ │ │ │ ├── ui/ # shadcn (no tocar)
│ │ │ │ └── common/
│ │ │ ├── hooks/
│ │ │ ├── lib/
│ │ │ │ ├── api-client.ts # Fetch wrapper + refresh mutex
│ │ │ │ ├── utils.ts
│ │ │ │ └── format.ts
│ │ │ └── types/
│ │ └── config/
│ ├── public/
│ ├── vite.config.ts
│ └── tailwind.config.ts
│
├── packages/
│ ├── shared-types/ # DTOs, enums, interfaces
│ └── shared-validators/ # Zod schemas compartidos
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
├── TECH_DECISIONS.md # Versiones y justificaciones
└── README.md
3.1 Paquetes compartidos
shared-validators: schemas Zod usados en frontend Y backend. createSaleSchema, loginSchema, etc. Si cambiás una regla de validación, cambia en ambos lados.

shared-types: interfaces TypeScript de los DTOs. ApiResponse<T>, SaleDTO, DailySummaryDTO. Si agregás un campo en la API, TypeScript te obliga a usarlo en el frontend.

4. VARIABLES DE ENTORNO
   4.1 Backend — .env.example (se commitea)
   env

# ============================================

# My Barber — Variables de Entorno

# ============================================

# Copiá este archivo como .env y completá los valores

# NUNCA commitear .env con valores reales

# ---------- General ----------

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# ---------- Base de Datos ----------

DATABASE_URL=postgres://mybarber:mybarber_dev@localhost:5432/mybarber_dev

# ---------- Timezone ----------

APP_TIMEZONE=America/Argentina/Buenos_Aires

# ---------- JWT ----------

# Generar con: openssl rand -hex 32

JWT_SECRET=genera-un-string-aleatorio-de-32-caracteres-minimo
JWT_REFRESH_SECRET=genera-otro-string-aleatorio-diferente-al-anterior
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ---------- MercadoPago ----------

MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=tu-webhook-secret-configurado-en-mp

# ---------- Resend (Email) ----------

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=My Barber <no-reply@tudominio.com>

# ---------- Sentry ----------

SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxx@oXXXXXX.ingest.sentry.io/XXXXXXX

# ---------- CORS ----------

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ---------- Rate Limiting ----------

RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# ---------- Cookies ----------

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=localhost

# ---------- Planes ----------

PLAN_INDIVIDUAL_PRICE=24999
PLAN_BUSINESS_PRICE=47999
TRIAL_DAYS=14

4.2 Frontend — apps/web/.env
env

VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My Barber
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
4.3 Validación al arrancar
config/env.ts valida TODAS las variables con Zod al iniciar el servidor. Si falta alguna o tiene formato incorrecto, el servidor NO arranca y muestra exactamente qué variable está mal. Incluye:

NODE_ENV debe ser development, production, o test
PORT se coerce a número
DATABASE_URL debe ser URL válida con formato postgres://
JWT_SECRET y JWT_REFRESH_SECRET mínimo 32 caracteres
ALLOWED_ORIGINS se transforma de string con comas a array
Variables opcionales como SENTRY_DSN usan .optional()
Variables con default como RATE_LIMIT_MAX usan .default(100)
PARTE II — CONVENCIONES 5. BASE DE DATOS — MODELO COMPLETO
5.1 Diagrama (8 tablas + enums)
text

ENUMS:
subscription_plan: 'individual' | 'business'
subscription_status: 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired'
payment_method: 'cash' | 'card' | 'transfer' | 'mercadopago'

┌──────────────────────────────┐
│ users │
├──────────────────────────────┤
│ id UUID PK │──────┐
│ email VARCHAR UQ │ │
│ password VARCHAR │ │ 1:1
│ is_email_verified BOOLEAN │ │
│ token_version INT d:0 │ │
│ created_at TIMESTAMPTZ│ │
│ updated_at TIMESTAMPTZ│ │
└──────────────────────────────┘ │
│
┌──────────────────────────────┐ │
│ barbers │ │
├──────────────────────────────┤ │
│ id UUID PK │◄─────┘
│ user_id UUID FK UQ │ (cascade delete)
│ name VARCHAR │───┐───┐───┐
│ fantasy_name VARCHAR? │ │ │ │
│ phone VARCHAR? │ │ │ │
│ working_days INT[] │ │ │ │
│ onboarding_completed BOOL │ │ │ │
│ onboarding_step INT d:1 │ │ │ │
│ monthly_goal DECIMAL? │ │ │ │
│ created_at TIMESTAMPTZ│ │ │ │
│ updated_at TIMESTAMPTZ│ │ │ │
└──────────────────────────────┘ │ │ │
│ │ │
┌──────────────────────────┘ │ │
│ ┌───────────────┘ │
│ │ │
▼ 1:1 ▼ 1:N ▼ 1:N
┌────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ subscriptions │ │ services │ │ professionals │
├────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id PK │ │ id PK │ │ id PK │
│ barber_id FK UQ│ │ barber_id FK │ │ barber_id FK │
│ plan ENUM │ │ name VAR │ │ name VAR │
│ status ENUM │ │ price DEC │ │ commission% DEC │
│ amount DEC │ │ is_active BOOL │ │ is_active BOOL │
│ mp_sub_id VAR? │ │ deleted_at TSZ? │ │ deleted_at TSZ? │
│ trial_ends TSZ?│ │ created_at TSZ │ │ created_at TSZ │
│ period_start ? │ │ updated_at TSZ │ │ updated_at TSZ │
│ period_end ? │ │ │ │ │
│ cancelled_at ? │ │ CHECK price > 0 │ │ CHECK comm │
│ created_at TSZ │ │ │ │ >= 0 AND <= 100│
│ updated_at TSZ │ └───────┬─────────┘ └───────┬─────────┘
│ │ │ │
│ CHECK amt > 0 │ │ 1:N │ 1:N (nullable)
└──────┬─────────┘ │ │
│ ▼ ▼
│ 1:N ┌─────────────────────────────────────┐
│ │ sales │
│ ├─────────────────────────────────────┤
│ │ id UUID PK │
│ │ barber_id UUID FK │
│ │ service_id UUID FK │
│ │ professional_id UUID? FK │
│ │ price DECIMAL │
│ │ payment_method ENUM │
│ │ business_date DATE │
│ │ professional_commission DECIMAL │
│ │ house_amount DECIMAL │
│ │ created_at TIMESTAMPTZ │
│ │ │
│ │ CHECK price > 0 │
│ │ CHECK professional_commission >= 0 │
│ │ CHECK house_amount >= 0 │
│ │ CHECK business_date <= CURRENT_DATE │
│ │ │
│ │ IDX(barber_id, business_date) │
│ │ IDX(barber_id, professional_id) │
│ │ IDX(business_date) │
│ └─────────────────────────────────────┘
│
▼
┌─────────────────────────────┐
│ subscription_events │
├─────────────────────────────┤
│ id UUID PK │
│ subscription_id UUID FK │
│ event_type VARCHAR │
│ from_status VARCHAR? │
│ to_status VARCHAR │
│ metadata JSONB? │
│ created_at TIMESTAMPTZ │
│ │
│ IDX(subscription_id, │
│ created_at) │
└─────────────────────────────┘

┌─────────────────────────────┐
│ analytics_events │
├─────────────────────────────┤
│ id UUID PK │
│ barber_id UUID FK │
│ event_name VARCHAR │
│ metadata JSONB? │
│ created_at TIMESTAMPTZ │
│ │
│ IDX(barber_id, event_name, │
│ created_at) │
└─────────────────────────────┘
5.2 Explicación de cada decisión
token_version en users

Entero que se incrementa para invalidar TODOS los refresh tokens. Los refresh tokens JWT contienen version en el payload. Al verificar, se compara token.version === user.token_version. Si no matchea, inválido. "Logout everywhere" = incrementar token_version.

onboarding_step en barbers

Entero 1-5 que persiste el progreso del onboarding. El frontend lee esto de /api/auth/me para saber exactamente a qué paso enviar al usuario. Elimina la necesidad de hacer múltiples requests para inferir el estado.

subscription_events

Auditoría de suscripciones. Cada cambio de estado inserta un registro con:

event_type: 'created', 'trial_started', 'activated', 'payment_received', 'payment_failed', 'plan_changed', 'cancelled', 'expired', 'reactivated'
from_status / to_status: transición
metadata: JSONB con datos del webhook (ID de pago MP, monto, motivo)
Sirve para: disputas de pago, debugging de MercadoPago, timeline de soporte, analytics de churn.

analytics_events

Tabla liviana para tracking de comportamiento post-launch. Eventos como sale_created, login, report_viewed, export_downloaded. Permite calcular DAU, feature adoption, trial-to-paid sin depender de servicios externos.

Se implementa la tabla ahora pero el tracking de eventos se agrega después de la fase 2.

Soft deletes en services y professionals

deleted_at IS NULL = activo. deleted_at = fecha = eliminado de la UI pero las ventas históricas mantienen sus referencias. Las queries filtran WHERE deleted_at IS NULL.

Diferencia con is_active:

is_active = false: pausado temporalmente (visible en config, no en formulario de ventas)
deleted_at = fecha: eliminado permanentemente de UI (solo para historial)
business_date como DATE

Concepto de negocio, no instante en el tiempo. Un barbero que registra venta a las 23:30 la asigna al día laboral que terminó. El frontend envía la fecha local como YYYY-MM-DD. No se convierte a UTC.

Snapshot de precios en ventas

sales.price es lo que se cobró, no referencia al precio actual del servicio. professional_commission y house_amount se calculan al crear la venta y se guardan fijos. Si mañana cambiás el precio del servicio, ventas históricas mantienen el original.

sales NO tiene updated_at

Decisión de diseño: ventas son inmutables. Solo se pueden eliminar (del día actual). No existe "editar venta". Si se equivocó, elimina y crea nueva. Intencional.

working_days como INT[]

Array de PostgreSQL, valores 0-6 (domingo a sábado). El schema Zod deduplica y ordena automáticamente.

Todos los timestamps son TIMESTAMPTZ

PostgreSQL los almacena en UTC internamente. El driver los devuelve como Date en UTC. El frontend convierte a hora local para display.

5.3 CHECK Constraints
Última línea de defensa — la DB rechaza datos inválidos incluso si un bug bypasea Zod:

Tabla Constraint Regla
services price_positive price > 0
professionals commission_valid commission_percentage >= 0 AND commission_percentage <= 100
sales sale_price_positive price > 0
sales commission_non_negative professional_commission >= 0
sales house_amount_non_negative house_amount >= 0
sales no_future_sales business_date <= CURRENT_DATE
subscriptions amount_positive amount > 0
En Drizzle, se definen en el tercer argumento de pgTable usando check().

5.4 Índices
Tabla Índice Query que cubre
sales (barber_id, business_date) Ventas por fecha — todos los reportes
sales (barber_id, professional_id) Ventas por profesional — comisiones
sales (business_date) Queries globales por fecha
subscription_events (subscription_id, created_at) Timeline de una suscripción
analytics_events (barber_id, event_name, created_at) Métricas por barbero
Auto (PK) Todos los id Lookups por ID
Auto (UNIQUE) users.email, barbers.user_id, subscriptions.barber_id Unicidad
5.5 Migraciones
Bash

pnpm drizzle-kit generate # Genera migración SQL del diff
pnpm drizzle-kit migrate # Aplica migraciones pendientes
pnpm drizzle-kit studio # UI web para explorar la DB
Migraciones son archivos SQL determinísticos que se commitean. Nada de synchronize: true.

5.6 Seed de desarrollo
Crea: 1 usuario verificado, 1 barbería con onboarding completo, 1 suscripción trial, 5 servicios, 3 profesionales, ~100 ventas en 30 días con variedad.

6. CONVENCIONES GLOBALES
   Definir ANTES de escribir una sola línea de código.

6.1 Decimales y Dinero
Regla: NUNCA usar float ni number de JS para dinero.

text

DB (DECIMAL) → Drizzle (string) → Backend (string) → JSON (string) → Frontend (string)
↓
Cálculos con decimal.js
↓
Resultado como string
Capa Formato Ejemplo
PostgreSQL DECIMAL(10,2) 5000.00
Drizzle string (default del driver) "5000.00"
Backend → Frontend string en JSON "5000.00"
Frontend → Backend string en JSON "5000.00"
Frontend display Intl.NumberFormat $5.000,00
Cálculos decimal.js new Decimal("5000.00")
Schema Zod reutilizable: moneySchema valida strings con formato "NNNN.NN".

Helpers en shared/utils/money.ts: calculateCommission(price, percentage), subtractMoney(a, b), formatARS(amount). Todos usan decimal.js internamente, reciben/devuelven strings.

NUNCA: parseFloat(price) \* percentage / 100

6.2 Timezone
Capa Timezone Notas
PostgreSQL UTC TIMESTAMPTZ almacena en UTC
Backend (Node) UTC Date objects en UTC
business_date (DATE) Timezone del barbero Fecha de negocio, frontend envía YYYY-MM-DD
Cron jobs America/Argentina/Buenos_Aires Medianoche = medianoche argentina
Frontend display Hora local del browser Intl.DateTimeFormat
Frontend → Backend ISO 8601 UTC para timestamps, YYYY-MM-DD para dates Sin ambigüedad
6.3 Semántica de PATCH
Campos parciales: solo se actualizan los campos incluidos en el body
Campos no reconocidos: se rechazan con 422 (Zod .strict())
null explícito: borra un campo opcional. { "monthlyGoal": null } setea NULL en DB
Campo ausente: no lo modifica
Body vacío {}: válido, responde 200 con datos actuales sin cambios
6.4 Ownership
TODOS los endpoints filtran por barber_id en el WHERE. No se busca por id solo y después se verifica ownership.

SQL

-- ✅ Correcto
SELECT \* FROM sales WHERE id = $1 AND barber_id = $2

-- ❌ Incorrecto
SELECT \* FROM sales WHERE id = $1
-- y después: if (sale.barberId !== currentBarberId) throw 403
Si no encuentra → 404 NOT_FOUND (no 403). No revelar existencia de recursos de otros usuarios.

Aplica a: GET por ID, PATCH, DELETE. Los GET de listados ya filtran por barber_id.

6.5 Paginación

Endpoint ¿Paginado? Motivo
GET /api/sales ✅ Sí, default 50, max 200 Miles en rangos amplios
GET /api/services ❌ No Max 50, lista completa
GET /api/professionals ❌ No Max 10, lista completa
GET /api/reports/_ ❌ No Datos agregados
GET /api/export/_ ❌ N/A Archivos streameados
Meta de paginación: { total, page, limit, totalPages }.

6.6 Copy y Microcopy
Todo texto visible al usuario debe ser accionable y en español neutro.

Tipo ❌ Mal ✅ Bien
Botón "Enviar", "OK" "Registrar Venta", "Guardar Servicio"
Error "Error 422" "El precio debe ser mayor a $0"
Empty state "No hay datos" "Todavía no registraste ventas hoy. ¡Arrancá con la primera!"
Loading spinner genérico Skeleton del contenido real
Confirmación "¿Estás seguro?" "¿Eliminar 'Corte + Barba'? Las ventas históricas se mantienen."
Upsell "Necesitas plan Business" "Gestioná tu equipo con el Plan Business — comisiones, ranking y más"
Trial "Tu trial expira pronto" "Te quedan 3 días de prueba. Suscribite para seguir registrando ventas"
6.7 ESLint y TypeScript Strict
tsconfig.json — en TODOS los proyectos del monorepo:

JSON

{
"compilerOptions": {
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
"exactOptionalPropertyTypes": true
}
}
noUncheckedIndexedAccess obliga a verificar array[0] antes de usarlo (es T | undefined, no T).

ESLint rules críticas:

complexity max 10
max-lines-per-function max 50
@typescript-eslint/no-explicit-any → error
@typescript-eslint/no-non-null-assertion → warn
@typescript-eslint/no-unsafe-assignment → error
eslint-plugin-security → patterns inseguros
Verificación en CI:

Bash

grep -r "as any\|: any\|<any>" apps/ packages/ --include="_.ts" --include="_.tsx"

# Si devuelve resultados, falla

Knip — correr después de cada fase:

Bash

npx knip
Detecta exports no usados, dependencias instaladas sin usar, archivos huérfanos.

PARTE III — DESARROLLO 7. FASE 1: CIMIENTOS (Semana 1-2)
7.1 Entregables
Monorepo configurado (Turborepo + pnpm + paquetes compartidos)
Docker Compose con PostgreSQL
Fastify configurado con todos los plugins
Schema de DB completo + migraciones + seed
Sistema de errores centralizado
Validación de env vars
Auth completo (register, login, logout, logout-all, refresh, verify-email, resend-verification, forgot-password, reset-password, me)
Middleware authenticate + authorize
ESLint + TypeScript strict configurados
CI básico (lint + type-check + tests)
7.2 Docker Compose
YAML

services:
postgres:
image: postgres:16-alpine
container_name: mybarber-db
environment:
POSTGRES_USER: mybarber
POSTGRES_PASSWORD: mybarber_dev
POSTGRES_DB: mybarber_dev
ports: - '5432:5432'
volumes: - pgdata:/var/lib/postgresql/data
healthcheck:
test: ['CMD-SHELL', 'pg_isready -U mybarber']
interval: 5s
timeout: 5s
retries: 5

postgres-test:
image: postgres:16-alpine
container_name: mybarber-db-test
environment:
POSTGRES_USER: mybarber
POSTGRES_PASSWORD: mybarber_test
POSTGRES_DB: mybarber_test
ports: - '5433:5432'
tmpfs: - /var/lib/postgresql/data

volumes:
pgdata:
postgres-test usa tmpfs (en memoria) para tests rápidos.

7.3 Setup de Fastify
app.ts registra plugins en este orden:

Request ID plugin: UUID único por request. Si viene x-request-id en header, lo reutiliza. Se propaga en logs y responses de error.

@fastify/compress: gzip/brotli automático. Reduce responses JSON 70-80%.

@fastify/sensible: helpers como reply.notFound().

@fastify/cors: origins de ALLOWED_ORIGINS, credentials: true.

@fastify/cookie: parsing y setting de cookies.

@fastify/rate-limit: global + por ruta.

@fastify/helmet: security headers.

Error handler global: clasifica errores (AppError, ZodError, inesperados), loguea, reporta a Sentry, response consistente con requestId.

Health check:

GET /api/health — status, timestamp, versión, uptime
GET /api/health/ready — verifica DB conectada. 503 si no.
Rutas por módulo:

Prefijo Módulo Auth
/api/auth auth ❌
/api/barbers barbers ✅
/api/sales sales ✅
/api/services services ✅
/api/professionals professionals ✅ + Business
/api/subscriptions subscriptions ✅
/api/reports reports ✅
/api/export export ✅
/api/webhooks webhooks ❌ (HMAC)
server.ts es mínimo: importa app, llama listen(), maneja SIGTERM/SIGINT para graceful shutdown.

7.4 Rate Limiting por Endpoint
Categoría Límite Clave
Global 100/min Por IP
POST /auth/login 10/min Por IP
POST /auth/register 5/min Por IP
POST /auth/forgot-password 3/min Por IP
POST /auth/resend-verification 1/2min Por email
POST /sales 30/min Por barberId
GET /reports/_ 20/min Por barberId
GET /export/_ 5/min Por barberId
POST /webhooks/\* Sin límite MercadoPago
Rate limits por user usan barberId del JWT, no IP.

7.5 Sistema de Errores
Error Status Code
BadRequestError 400 BAD_REQUEST
UnauthorizedError 401 UNAUTHORIZED
InvalidCredentialsError 401 INVALID_CREDENTIALS
ForbiddenError 403 FORBIDDEN
PlanRequiredError 403 PLAN_REQUIRED
SubscriptionRequiredError 403 SUBSCRIPTION_REQUIRED
NotFoundError 404 NOT_FOUND
ConflictError 409 CONFLICT
ValidationError 422 VALIDATION_ERROR
InternalError 500 INTERNAL_ERROR
Controllers NUNCA hacen try/catch. Errores burbujean al error handler global.

7.6 Autenticación Completa
7.6.1 Registro
POST /api/auth/register

Input: { email, password, name }

email: formato válido, lowercase, trimmed
password: min 8, al menos 1 mayúscula, 1 minúscula, 1 número
name: 2-100 chars, trimmed
Flujo:

Zod valida (Fastify automático)
Verifica email no existe → ConflictError si existe
Hashea password con bcrypt (salt rounds: 12)
Transacción — crea:
users: email, password hash, is_email_verified false, token_version 0
barbers: user_id, name, onboarding_completed false, onboarding_step 1
subscriptions: barber_id, plan 'individual', status 'trial', trial_ends_at +14 días
subscription_events: type 'created', to_status 'trial'
Genera JWT access (15min) + refresh (7 días)
Envía email verificación vía Resend
Setea cookies HttpOnly
Devuelve user + barber + subscription
¿Por qué suscripción en el registro? Todo usuario empieza con trial de 14 días automáticamente. Sin paso de "elegir plan". Reduce fricción. El plan se elige al pagar.

7.6.2 Login
POST /api/auth/login — { email, password }

Busca usuario por email
Si no existe → InvalidCredentialsError (no dice "email no encontrado")
bcrypt compare → si falla → InvalidCredentialsError
Genera tokens, setea cookies, devuelve datos
Rate limit: 10/min por IP.

7.6.3 Tokens y Cookies
Access Token: { userId, barberId, email }, 15min, cookie access_token, HttpOnly, Secure (prod), SameSite Strict, Path /

Refresh Token: { userId, barberId, version }, 7 días, cookie refresh_token, HttpOnly, Secure, SameSite Strict, Path /api/auth/refresh

¿Por qué HttpOnly cookies? JavaScript no puede leer el token → immune a XSS. SameSite Strict → mitiga CSRF. El frontend no sabe cuál es el token — solo sabe si está autenticado (por /api/auth/me).

7.6.4 Refresh con Mutex en Frontend
Cuando el access token expira (401), el API client intercepta automáticamente.

Problema: 2 tabs abiertas, ambas detectan 401 simultáneamente → ambas intentan refresh → race condition.

Solución: el API client mantiene refreshPromise como mutex:

Tab A recibe 401 → refreshPromise === null → crea Promise de refresh, la guarda
Tab B recibe 401 → refreshPromise !== null → espera la misma Promise
Refresh completa → nueva cookie seteada → refreshPromise = null
Ambas tabs reintentan su request original
Si refresh falla → ambas tabs reciben error → redirige a /login.

7.6.5 Logout
POST /api/auth/logout: limpia cookies (maxAge: 0).

POST /api/auth/logout-all: incrementa token_version. Todos los refresh tokens existentes se invalidan.

7.6.6 Verificación de Email
En registro: JWT con { userId, purpose: 'email-verification' }, 24h
Email con link: https://dominio.com/verify-email?token=xxx
Frontend llama POST /api/auth/verify-email con { token }
Backend setea is_email_verified: true
Reenvío: POST /api/auth/resend-verification, 1/2min.

Para suscribirse (pagar), DEBE tener email verificado.

7.6.7 Reset de Password
POST /api/auth/forgot-password con { email }
SIEMPRE 200: "Si el email existe, recibirás un link"
JWT reset: { userId, purpose: 'password-reset' }, 1h
POST /api/auth/reset-password con { token, newPassword }
Verifica JWT, hashea nueva password, incrementa token_version
7.6.8 Endpoint /api/auth/me
GET /api/auth/me — primera llamada del frontend al cargar.

JSON

{
"success": true,
"data": {
"user": { "id": "uuid", "email": "...", "isEmailVerified": true },
"barber": {
"id": "uuid", "name": "Carlos", "fantasyName": "Barber Shop",
"phone": "1122334455", "workingDays": [1,2,3,4,5,6],
"onboardingCompleted": true, "onboardingStep": 5,
"monthlyGoal": "500000.00"
},
"subscription": {
"plan": "individual", "status": "trial",
"trialEndsAt": "2025-02-15T00:00:00Z", "daysRemaining": 12
}
}
}
Cache: staleTime: Infinity en TanStack Query. Solo se revalida en acciones que cambian datos del usuario.

7.6.9 Middleware Authenticate
Extrae token de cookie access_token
Sin cookie → UnauthorizedError
Verifica JWT (firma + expiración)
Falla → UnauthorizedError
OK → request.user = { userId, barberId, email }
7.6.10 Middleware Authorize
Busca suscripción activa del barbero
Sin suscripción → SubscriptionRequiredError
Status expired/cancelled → SubscriptionRequiredError
Requiere business y tiene individual → PlanRequiredError
Trial: acceso a Individual solamente + preview de Business. Features de Business visibles con datos de demo pero no funcionales. Esto muestra el valor del upgrade sin permitir explotación del trial (registrarse cada 14 días con otro email).

7.7 API Client del Frontend
shared/lib/api-client.ts maneja:

Credentials: credentials: 'include' en todas las requests
Refresh mutex: refreshPromise como variable compartida
Network errors: TypeError: "Failed to fetch" → NetworkError con mensaje amigable
Error parsing: extrae code, message, requestId del body de error 8. FASE 2: CORE DEL NEGOCIO (Semana 3-4)
8.1 Entregables
Onboarding completo (5 pasos)
CRUD Servicios
CRUD Profesionales
Sistema de ventas (crear, listar, resumen diario, eliminar)
Frontend: Auth pages, Onboarding, Sales page (home)
Protección de rutas (auth, onboarding, plan)
8.2 Onboarding (5 pasos)
Progreso persistido en barbers.onboarding_step.

Paso 1: Nombre del negocio — fantasyName, phone (opcional). → step 2
Paso 2: Días laborales — checkboxes, default Lun-Sáb. → step 3
Paso 3: Servicios — agregar con nombre y precio, mínimo 1. → step 4
Paso 4: Meta mensual — monto numérico, opcional (salteable). → step 5
Paso 5: Confirmación — resumen de todo. Botón "Empezar" → onboarding_completed = true, redirect a /sales

Nota: profesionales NO se agregan en onboarding (trial = Individual). Se agregan desde la sección de profesionales con plan Business.

Endpoints:

PATCH /api/barbers/onboarding/step — actualiza campos + incrementa step
POST /api/services — CRUD normal
PATCH /api/barbers/onboarding/complete — marca completado
Si recarga: /api/auth/me devuelve onboardingStep → frontend sabe a dónde ir.

8.3 CRUD Servicios
Método Ruta Descripción
GET /api/services Listar activos
POST /api/services Crear
PATCH /api/services/:id Actualizar
DELETE /api/services/:id Soft delete
Reglas: max 50 activos, nombre único por barbería (case-insensitive), precio > 0 (moneySchema), ownership por barber_id, soft delete setea deleted_at + is_active = false.

8.4 CRUD Profesionales
Método Ruta Auth Plan
GET /api/professionals ✅ Business
POST /api/professionals ✅ Business
PATCH /api/professionals/:id ✅ Business
DELETE /api/professionals/:id ✅ Business
Reglas: max 10 activos, comisión 0-100%, soft delete, ownership por barber_id.

8.5 Sistema de Ventas
Registrar Venta — POST /api/sales
Input:

serviceId (requerido)
professionalId (opcional)
paymentMethod (requerido): cash | card | transfer | mercadopago
businessDate (opcional, default hoy): YYYY-MM-DD
priceOverride (opcional): moneySchema
Flujo:

Busca servicio por ID + barber_id + deleted_at IS NULL → 404 si no
Si professionalId: busca por ID + barber_id + deleted_at IS NULL → 404 si no
Si professionalId + plan Individual → 403
Precio: priceOverride ?? service.price
Comisión: calculateCommission(price, professional.commissionPercentage) con decimal.js
House: subtractMoney(price, commission) con decimal.js
Crea en DB, devuelve con join
Restricciones: no businessDate futuro. Más de 7 días atrás: confirmación en frontend.

Listar Ventas — GET /api/sales
Query params: date, from/to, professionalId, paymentMethod, page (d:1), limit (d:50, max:200).

Resumen Diario — GET /api/sales/daily-summary?date=YYYY-MM-DD
Una query con SUM/COUNT/GROUP BY en PostgreSQL. Devuelve: totales, desglose por método de pago, desglose por profesional, servicio top, promedio por venta. Todos los montos como strings.

Eliminar Venta — DELETE /api/sales/:id
Busca por ID + barber_id → 404 si no. Verifica business_date === hoy → 403 si no. Hard delete.

8.6 Página de Ventas (Home) — UX
text

┌─────────────────────────────────────────┐
│ 📅 Hoy: Miércoles 15 de Enero │
│ 💰 Total: $75.000 [████████░░] 75% │
│ │
│ ┌── Formulario ───────────────────────┐│
│ │ Servicio: [botones/select] ││
│ │ Profesional: [select] (si Business) ││
│ │ Método: [💵] [💳] [🏦] [📱] ││
│ │ Precio: $5.000 [Registrar Venta]││
│ └─────────────────────────────────────┘│
│ │
│ Ventas de hoy (15) │
│ 14:30 Corte+Barba Juan $5.000 │
│ 14:00 Corte --- $3.000 │
│ │
│ 💵 $40.000 (8) 💳 $20.000 (4) │
│ 🏦 $10.000 (2) 📱 $5.000 (1) │
└─────────────────────────────────────────┘
UX crítica:

≤ 4 taps para registrar venta
Botones ≥ 44px de altura
Servicio: grilla de botones si <8, select si más
Método: 4 botones con iconos, default último usado
Post-submit: resetea manteniendo profesional y método
Optimistic update: venta aparece inmediatamente con "guardando..."
Empty state: "¡Arrancá con tu primera venta del día!" con flecha al formulario
8.7 Protección de Rutas Frontend
Capa 1 — Auth: ProtectedRoute llama a /api/auth/me. 401 → /login.
Capa 2 — Onboarding: si onboardingCompleted === false → /onboarding al paso onboardingStep.
Capa 3 — Plan: <RequiresPlan plan="business"> muestra upsell card.

text

Públicas: /login, /register, /forgot-password, /reset-password, /verify-email
Protegidas: /sales, /dashboard, /settings, /subscription, /onboarding
Business: /professionals, /commissions
8.8 UX Checklist — Verificar antes de cerrar la fase
¿Cuántos taps para registrar venta? (≤ 4)
¿Botón "Registrar Venta" alcanzable con pulgar?
¿Tap targets ≥ 44px?
¿Empty state con CTA en ventas?
¿Feedback en cada acción? (toast éxito/error)
¿Skeleton en estados de carga?
¿Confirmación en acciones destructivas?
¿Formulario usable con una mano en celular? 9. FASE 3: SUSCRIPCIONES Y PAGOS (Semana 5-6)
9.1 Entregables
Integración MercadoPago (crear suscripción, callback, webhooks)
Máquina de estados de suscripción
Cron jobs (trials, past_due)
Emails transaccionales
Frontend: páginas de suscripción
9.2 Planes
Feature Individual ($24,999) Business ($47,999)
Ventas ✅ ✅
Dashboard básico ✅ ✅
Servicios ilimitados ✅ ✅
Export PDF/Excel ✅ ✅
Meta mensual ✅ ✅
Profesionales (hasta 10) ❌ ✅
Comisiones ❌ ✅
Dashboard avanzado ❌ ✅
Business Insights ❌ ✅
9.3 Máquina de Estados
text

TRIAL ──(paga)──→ ACTIVE ACTIVE ──(pago falla)──→ PAST_DUE
TRIAL ──(14d)───→ EXPIRED ACTIVE ──(cancela)─────→ CANCELLED

PAST_DUE ──(paga)──→ ACTIVE EXPIRED ──(paga)──→ ACTIVE
PAST_DUE ──(3d)────→ CANCELLED CANCELLED ──(re)──→ ACTIVE
Estado Acceso
TRIAL Individual + preview Business
ACTIVE Según plan
PAST_DUE Según plan + banner
EXPIRED Solo lectura
CANCELLED Según plan hasta period_end, luego EXPIRED
9.4 Crear Suscripción
POST /api/subscriptions/create — { plan: 'individual' | 'business' }

Email verificado → si no, 403
No tener suscripción activa → si tiene, 409
Llama MP Preapproval.create(): reason, frecuencia mensual, monto, ARS, back_url, external_reference barberId
Guarda mp_subscription_id
Inserta subscription_events (payment_initiated)
Devuelve init_point → frontend redirige
9.5 Callback Post-Pago
Frontend lee query params de MP, llama POST /api/subscriptions/verify con { preapprovalId }. Backend consulta API de MP para verificar estado real (NUNCA confiar solo en query params). Si authorized → active + guardar periodo + evento. Redirige a success o error.

9.6 Webhooks MercadoPago
POST /api/webhooks/mercadopago — sin JWT, validado por HMAC.

Flujo (responder ANTES de procesar):

Verificar firma HMAC con crypto.timingSafeEqual
Si inválida → 401
Si válida → RESPONDER 200 INMEDIATAMENTE
DESPUÉS procesar en background con setImmediate()
Si procesamiento falla → log en Sentry (la response ya se envió)
Idempotencia: si el estado ya es el correcto, no-op. MP puede reintentar webhooks.

Evento MP Acción Evento registrado
preapproval authorized → active, guardar periodo activated
preapproval paused → past_due payment_failed
preapproval cancelled → cancelled cancelled
payment approved actualizar periodo payment_received
payment rejected → past_due, email payment_failed
Cada transición inserta en subscription_events con metadata del webhook.

9.7 Cancelar / Cambiar Plan
Cancelar: POST /api/subscriptions/cancel. Cancela en MP, status cancelled, acceso hasta period_end.

Cambiar plan (v1 simplificada): cancela actual, crea nueva. Pierde tiempo restante. Prorrateo en v2.

9.8 Cron Jobs
Timezone: America/Argentina/Buenos_Aires.

Job Horario Acción
Expirar trials 00:05 trial + trial_ends_at < now → expired + evento + email
Notificar trial 10:00 trial + trial_ends_at < +3 días → email recordatorio
Cancelar past_due 00:10 past_due > 3 días → cancelled + evento + email
9.9 Emails
Email Trigger
Verificación Registro
Bienvenida Post-verificación
Trial 3 días Cron
Trial expirado Cron
Pago exitoso Webhook MP
Pago fallido Webhook MP
Cancelación Cancelación
Reset password Request
Templates con React Email. Resend free: 3,000/mes.

10. FASE 4: DASHBOARD, REPORTES Y EXPORTACIÓN (Semana 7-8)
    10.1 Entregables
    Todos los endpoints de reportes
    Dashboard básico + avanzado
    Gráficos con Recharts
    Exportación PDF/Excel
    Frontend: Dashboard, Commissions
    10.2 Endpoints de Reportes
    Endpoint Descripción Plan
    GET /reports/daily?date= Detalle día Todos
    GET /reports/weekly?date= Resumen semana Todos
    GET /reports/monthly?month= Resumen mes Todos
    GET /reports/yearly?year= Resumen año Todos
    GET /reports/date-range?from=&to= Rango custom Todos
    GET /reports/trends?period= Tendencias Todos
    GET /reports/payment-methods?month= Por método pago Todos
    GET /reports/top-services?month=&limit= Top servicios Todos
    GET /reports/professionals?month= Por profesional Business
    GET /reports/professional/:id?month= Detalle profesional Business
    GET /reports/commissions?month= Comisiones Business
    GET /reports/goal-progress?month= Progreso meta Todos
    GET /reports/projections?month= Proyección Todos
    Heatmap NO incluido en v1 — requiere hora exacta de la venta, no created_at. Se implementa en v2 con campo service_time.

Todos usan agregaciones PostgreSQL (SUM/COUNT/GROUP BY), no cálculos en Node. Todos devuelven montos como strings. No paginados (datos agregados).

10.3 Proyecciones — Lógica de cálculo
Días laborales del mes (usando working_days)
Días laborales transcurridos
Promedio diario: totalRevenue / diasTranscurridos (decimal.js)
Proyección: promedioDiario \* diasTotales
requiredDailyAverage: (monthlyGoal - currentRevenue) / diasRestantes
10.4 Dashboard Frontend
Básico (todos): ingresos hoy vs ayer, semana (barras), mes (líneas), progreso meta, top 5 servicios (pie), métodos de pago (donut).

Avanzado (Business): + ranking profesionales (tabla), comparativa mensual (barras dobles), proyección, Business Insights (textos con lógica: "Tu día más productivo es el viernes", "Juan generó 35% más").

10.5 Exportación
Endpoint Output
GET /export/daily-pdf?date= PDF resumen diario
GET /export/monthly-pdf?month= PDF resumen mensual
GET /export/commissions-pdf?month= PDF liquidación (Business)
GET /export/sales-excel?from=&to= Excel ventas del rango
GET /export/monthly-excel?month= Excel resumen mensual
Datasets grandes se streamean (pipe del stream de generación al response). Headers: Content-Type: application/pdf, Content-Disposition: attachment; filename="...".

11. FASE 5: PULIDO (Semana 9)
    11.1 Entregables
    PWA completa
    Dark mode
    Testing (unit + integration + E2E)
    CI/CD con GitHub Actions
    Deploy a producción
    Documentación
    Legal (TyC, Política de Privacidad)
    Endpoints de datos personales (export, delete account)
    Checklist pre-launch completado
    11.2 PWA
    vite-plugin-pwa: name "My Barber", theme cyan-600, display standalone, start URL /sales.

Cache: App Shell cache-first, API network-first (fallback cache), fonts cache-first 30d.

Offline: ve ventas del día cacheadas. No registra ventas offline. Banner "Sin conexión".

Install prompt: después de 3ra visita, banner custom.

11.3 Tema
Primary: cyan. Background: slate-950. Dark mode por defecto. Light mode en settings. shadcn via CSS variables.

11.4 Deploy
Backend: VPS DigitalOcean $6/mes

Ubuntu 22.04, Node 20 (nvm), PostgreSQL 16, PM2, Nginx + HTTPS (Let's Encrypt)
Backups diarios pg_dump → S3
Frontend: Vercel (gratis)

GitHub connected, build automático, preview deploys
DNS: Cloudflare (gratis)

api.mybarber.com.ar → VPS
app.mybarber.com.ar → Vercel
11.5 CI/CD
En Push/PR:

Lint (ESLint)
Type-check (tsc --noEmit)
pnpm audit --audit-level=critical
Zero any check (grep)
Unit tests backend
Unit tests frontend
Integration tests (PostgreSQL en GH Actions service)
Build frontend
En merge a main: 9. Deploy backend (SSH/webhook) 10. Deploy frontend (Vercel automático) 11. Migraciones producción

PARTE IV — CALIDAD Y OPERACIONES 12. SEGURIDAD
12.1 Checklist

# Check Detalle

1 Passwords hasheados bcrypt, salt 12
2 JWT HttpOnly cookies Nunca localStorage
3 SameSite Strict + Secure CSRF + HTTPS
4 Token versioning Invalidación de sesiones
5 CORS configurado Solo origins permitidos
6 Rate limiting por categoría Diferenciado por endpoint
7 Input validation Zod strict
8 SQL injection prevention Drizzle (prepared statements)
9 XSS prevention React + Helmet
10 Webhook HMAC timingSafeEqual
11 Secrets no commiteados .env en .gitignore
12 Error messages genéricos Sin stack traces
13 Email no revela existencia "Si el email existe..."
14 Ownership check WHERE barber_id en toda query
15 Request IDs Trazabilidad
16 Helmet headers CSP, X-Frame-Options
17 DB passwords fuertes openssl rand
18 SSH key-only Sin password auth
19 Firewall Solo 80, 443, 22
20 Deps actualizadas pnpm audit en CI, Dependabot
21 Logs sin data sensible Nunca passwords/tokens
22 CHECK constraints DB valida integridad
23 eslint-plugin-security Patterns inseguros
12.2 Pen Testing Manual — 5 Tests Pre-Launch
Test 1 — IDOR:
2 cuentas (A, B). Loguearte como A. Intentar GET/PATCH/DELETE recursos de B cambiando UUIDs. Resultado: 404 en todos.

Test 2 — Token Manipulation:
Modificar payload de JWT válido (cambiar barberId). Enviar. Resultado: 401. Probar token expirado y algorithm "none".

Test 3 — Rate Limiting:
20 POST a /auth/login en 10s. Primeros 10 OK, 11+ → 429. Verificar desbloqueo después del window.

Test 4 — Input Fuzzing:
A cada endpoint: strings 10,000 chars, ', ", <script>, null bytes, números negativos, arrays en vez de strings, body vacío. Resultado: 422 en todos (Zod).

Test 5 — Cookies:
DevTools → Application → Cookies:

access_token y refresh_token tienen HttpOnly ✓
Tienen Secure en producción ✓
SameSite Strict ✓
document.cookie no muestra tokens ✓
refresh_token tiene Path /api/auth/refresh ✓
12.3 Herramientas Puntuales
Antes del launch:

npx semgrep --config auto apps/api/ — una vez, buscar patterns inseguros
securityheaders.com — verificar headers del dominio
ssllabs.com — verificar SSL
En CI (continuo):

pnpm audit --audit-level=critical
eslint-plugin-security
Grep zero any 13. PERFORMANCE Y OPTIMIZACIÓN
Backend
Índices compuestos en sales → queries <50ms
Agregaciones en PostgreSQL, no en Node
Connection pooling del driver
Pino (no bloquea event loop)
@fastify/compress
.returning() en inserts (1 query, no 2)
No N+1 queries (JOINs/batch)

Frontend
TanStack Query staleTime: servicios 5min, ventas 30s
Code splitting (lazy por página)
Tree shaking (Vite)
Solo Recharts
Una font, font-display: swap
Bundle target: <300KB gzip
Verificación
Lighthouse > 90 después de cada fase (Chrome Incognito)
npx vite-bundle-visualizer después de cada fase
EXPLAIN ANALYZE en queries de reportes después de fase 4
web-vitals en producción (console.log → Sentry Performance futuro)
Memory Monitoring
Log periódico en producción:

TypeScript

setInterval(() => {
const usage = process.memoryUsage();
app.log.info({
rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
}, 'Memory usage');
}, 5 _ 60 _ 1000);
Si heapUsed crece constantemente sin bajar → memory leak → investigar con clinic.js.

14. LOGGING Y OBSERVABILIDAD
    14.1 Niveles
    Nivel Qué Entorno
    DEBUG Queries SQL, cache hits Solo dev
    INFO Request/response, eventos de negocio Todos
    WARN Rate limit, token inválido, acceso denegado Todos
    ERROR Errores inesperados, fallos DB/externos Todos
    FATAL No conecta DB, env vars faltantes Todos
    Producción: nivel mínimo INFO.

14.2 Formato
Dev: pino-pretty (colorizado)
Prod: JSON estructurado
Cada log incluye: requestId, userId (si autenticado), timestamp, level.

NUNCA loguear: passwords, JWT tokens, números de tarjeta, emails completos (maskear: c\*\*\*@gmail.com).

14.3 Rotación
PM2 + pm2-logrotate: max 10MB por archivo, retención 30 días.

14.4 Sentry
tracesSampleRate: 0.1 (10%)
Solo errores 5xx a Sentry
4xx se loguean localmente
Contexto: requestId, userId, barberId 15. TESTING
15.1 Unit Tests (Vitest)
Services — la lógica de negocio. Repositories mockeados.

Ejemplos clave:

salesService.create() calcula comisión con decimal.js
salesService.create() falla si servicio no pertenece al barbero
salesService.create() falla si servicio soft-deleted
subscriptionService.handleWebhookEvent() transiciones correctas
subscriptionService.handleWebhookEvent() idempotencia
authService.register() crea user + barber + subscription + evento en transacción
reportsService.getProjections() calcula con decimal.js
15.2 Integration Tests (Vitest + Supertest)
DB de test real. Factories para datos.

POST /auth/register → crea todo, cookies, response
POST /sales con token → venta con comisión
POST /sales sin token → 401
POST /sales con serviceId de otro barbero → 404
DELETE /sales/:id de ayer → 403
POST /webhooks/mercadopago firma inválida → 401
POST /webhooks/mercadopago firma válida → 200 + actualización
POST /webhooks/mercadopago duplicado → 200 + no-op
15.3 Component Tests (Testing Library)
SaleForm: render servicios, selección actualiza precio, submit llama API
DailySummary: totales, desglose
ProfessionalsList: lista, confirm delete
15.4 E2E (Playwright)
Registro → Onboarding → Venta → Ver en lista
Login → 5 ventas → Dashboard
Login → Suscripción → Redirección a MP
15.5 Testing MercadoPago
Unit: mock SDK, testear transiciones y periodos
Integration: MSW simula API de MP
Sandbox: tarjetas de prueba en TESTING.md
Webhook local: Cloudflare Tunnel o ngrok
15.6 Coverage
Capa Target
Services 90%+
Controllers 70%+
Frontend components 60%+
E2E 3-5 flujos 16. REQUISITOS LEGALES
16.1 Obligatorio antes del launch
Ley 25.326 (Protección de Datos Personales de Argentina) aplica.

Política de Privacidad — página accesible desde footer y registro:

Qué datos recolectás (email, nombre, teléfono, ventas)
Para qué los usás (provisión del servicio, comunicaciones)
Con quién compartís (MercadoPago, Resend)
Dónde se almacenan (servidor en [país del VPS])
Cómo acceder, modificar o eliminar datos
Cookies usadas (solo funcionales)
Términos y Condiciones — misma accesibilidad:

Descripción del servicio
Precios y condiciones (suscripción mensual, cobro automático MP)
Cancelación (en cualquier momento, acceso hasta fin periodo)
Reembolso (según política de MP)
Limitación de responsabilidad
Jurisdicción
Checkbox en registro: "Acepto los [TyC] y la [Política de Privacidad]" — NO pre-checkeado. Registro no procede sin aceptar.

16.2 Endpoints de datos personales
GET /api/barbers/export-my-data: JSON/ZIP con todo — perfil, servicios, profesionales, ventas, suscripción, eventos. Implementar en fase 5.

POST /api/barbers/delete-my-account: soft delete con periodo de gracia de 30 días. Email de confirmación. Después de 30 días, hard delete (excepto datos con retención legal — consultar contador).

16.3 MercadoPago
Verificar antes del launch:

Mostrar precio y frecuencia antes de redirigir a checkout
Usuario puede cancelar fácilmente
Página de política de reembolso accesible 17. INFRAESTRUCTURA Y OPERACIONES
17.1 Monitoreo
UptimeRobot (gratis, 50 monitores):

https://api.tudominio.com/api/health — check cada 5min
https://app.tudominio.com — check cada 5min
Alertas por email (opcionalmente Telegram/Discord)
17.2 Backup Strategy
Métrica Target
RPO (datos que podés perder) < 24 horas
RTO (tiempo de restauración) < 2 horas
Frecuencia Diario a las 03:00
Retención 30 días
Testing 1 restauración/mes
Script de backup (cron en VPS):

Bash

#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/mybarber_${TIMESTAMP}.sql.gz"
pg_dump -U mybarber mybarber_prod | gzip > "$BACKUP_FILE"
aws s3 cp "$BACKUP_FILE" s3://mybarber-backups/
find /backups -name "_.sql.gz" -mtime +7 -delete
Cron: 0 3 _ \* \* /scripts/backup-db.sh

Verificación mensual: restaurar en DB de test, verificar datos.

17.3 Disaster Recovery
Setup server script (guardar en repo):

Bash

#!/bin/bash

# setup-server.sh

apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx ufw

# Node 20

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc && nvm install 20

# pnpm + PM2

npm install -g pnpm pm2
pm2 startup

# PostgreSQL 16

sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update && apt install -y postgresql-16

# DB

sudo -u postgres createuser mybarber
sudo -u postgres createdb mybarber_prod -O mybarber
sudo -u postgres psql -c "ALTER USER mybarber PASSWORD 'CHANGE';"

# Firewall

ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable

echo "Manual: Nginx config, SSL (certbot), deploy, PM2 config"
Secrets: guardar en password manager (Bitwarden/1Password), NO solo en .env del servidor.

Escenarios:

Escenario Acción Target
VPS muere setup-server.sh + restaurar backup + deploy < 2h
DB corrupta Restaurar último backup < 1h, RPO < 24h
Hackeo Incrementar token_version, revocar API keys MP, notificar usuarios Inmediato
17.4 DB Performance en Producción
Después de una semana de uso real:

SQL

-- Activar tracking de queries
CREATE EXTENSION pg_stat_statements;

-- Top 10 queries lentas
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;
Si alguna > 100ms, optimizar.

18. EDGE CASES
    Negocio
    Situación Manejo
    Venta 00:30 AM businessDate es día anterior si no se cambió
    Cambio precio servicio Ventas históricas mantienen precio original
    Eliminar servicio con ventas Soft delete, ventas intactas
    Eliminar profesional con comisiones Soft delete, comisiones intactas
    Trial expira durante uso 403 → modal suscripción
    Webhook antes de callback Procesa normal, callback verifica estado
    Webhook duplicado Idempotente, no-op si ya procesado
    0 ventas en mes Reportes devuelven zeros
    Email duplicado 409 Conflict
    Internet se corta al registrar Toast error, venta no se guarda
    Individual intenta profesionales Upsell card
    Downgrade Business → Individual Profesionales inactivos, historial intacto
    Trial abuse (nuevo email) Trial solo Individual + preview
    working_days duplicados Zod deduplica/ordena
    Técnico
    Situación Manejo
    DB se cae Health check detecta, PM2 reinicia
    JWT secret cambia Todos los tokens inválidos
    Migration falla en prod Rollback, testear en staging
    Resend down Log Sentry
    MercadoPago down Webhooks se reintentan
    Body > 1MB Fastify rechaza
    Muchas requests misma IP Rate limiter
    Floating point en dinero decimal.js
    2 tabs refresh simultáneo Mutex frontend
    Network error NetworkError amigable
    Venta 23:30 hora ARG businessDate local explícito
    PARTE V — LAUNCH Y POST-LAUNCH
19. CHECKLIST PRE-LAUNCH
    text

CÓDIGO
□ 0 errores TypeScript (tsc --noEmit)
□ 0 warnings ESLint
□ 0 `any` (grep verification)
□ 0 secrets en código
□ Tests pasan 100%
□ Coverage > 70% services
□ Knip: 0 exports/deps no usados

SEGURIDAD
□ 5 pen tests manuales completados
□ pnpm audit: 0 vulnerabilidades críticas
□ Semgrep: 0 findings críticos
□ securityheaders.com: grade A+
□ ssllabs.com: grade A+

PERFORMANCE
□ Lighthouse > 90 (Performance, Accessibility, Best Practices)
□ Bundle < 300KB gzip
□ EXPLAIN ANALYZE en queries reportes: Index Scan

BASE DE DATOS
□ CHECK constraints implementados
□ Migraciones testeadas
□ Backup script configurado y probado
□ Seed funciona
□ Índices verificados

INFRAESTRUCTURA
□ UptimeRobot configurado
□ Sentry recibiendo errores
□ Logs rotando
□ SSL instalado
□ Firewall configurado
□ PM2 auto-restart
□ Secrets en password manager

NEGOCIO
□ Política de Privacidad publicada
□ Términos y Condiciones publicados
□ Checkbox de aceptación en registro
□ MercadoPago en producción (no sandbox)
□ Flujo pago probado con tarjeta real
□ Emails transaccionales probados
□ Export my data funciona
□ Delete account funciona

UX
□ Empty states con CTA
□ Errores legibles
□ Mobile responsive en dispositivo real
□ Onboarding completo
□ Dark mode: no texto invisible
□ Tap targets ≥ 44px en formulario ventas
□ ≤ 4 taps para registrar venta

DOCUMENTACIÓN
□ README con setup en 5 minutos
□ .env.example completo
□ setup-server.sh actualizado
□ TECH_DECISIONS.md con versiones 20. ANALYTICS POST-LAUNCH
20.1 Tabla analytics_events
Ya definida en el schema. Tracking mínimo inicial:

Evento Cuándo
login Login exitoso
sale_created Venta registrada
report_viewed Cualquier endpoint de reportes
export_downloaded PDF/Excel generado
subscription_started Pago exitoso
subscription_cancelled Cancelación
Agregar más según necesidad.

20.2 Métricas a calcular
Métrica Query
DAU Barberos con sale_created hoy
Trial-to-Paid Barberos con subscription_started / total
Monthly churn Barberos sin sale_created en 30d (que sí en 30d anterior)
Feature adoption % barberos con export_downloaded / total activos
Time to first sale Diferencia entre registro y primer sale_created
20.3 Pricing — Preguntas a responder post-launch
¿Los barberos perciben valor suficiente para pagar?
¿La diferencia Individual/Business justifica 2x precio?
¿Descuento anual reduciría churn? (10 meses, 2 gratis) 21. FUTURAS MEJORAS
Corto plazo (1-3 meses)
Notificaciones push (web push)
service_time en ventas + heatmap
WhatsApp recordatorios (Twilio)
Prorrateo en cambio de plan
Swagger/OpenAPI auto-generado
Mediano plazo (3-6 meses)
Plan Enterprise (múltiples sucursales)
Inventario básico (productos)
Programa de fidelidad
App nativa (Capacitor)
Largo plazo (6-12 meses)
Marketplace de barberías
IA insights
Integración contable argentina
API pública (con /api/v1/)
RESUMEN DE FASES
Fase Duración Contenido
1 2 sem Monorepo, Fastify+Drizzle, DB+migrations, errores, env, auth completo, middleware
2 2 sem Onboarding, CRUD servicios/profesionales, ventas, página home
3 1.5 sem MercadoPago, webhooks HMAC, máquina estados, cron jobs, emails
4 2 sem Reportes, dashboard, gráficos, export PDF/Excel
5 1.5 sem PWA, testing, CI/CD, deploy, legal, documentación
Total ~9 sem MVP completo
Este documento es la fuente de verdad del proyecto. Toda decisión técnica, convención, y regla de negocio está aquí. Si algo no está documentado, se define antes de implementar y se agrega.
