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
- Pagos: MercadoPago (suscripciones)
- Email: Resend + React Email
- WhatsApp: Twilio
- Testing: Vitest + Testing Library
- Deploy: Vercel + Neon

## Modelo de negocio

- Plan FREE: 1 profesional, 3 servicios, 10 ventas/día, 7 días historial
- Plan Individual ($24.999 ARS/mes): 1 profesional, ilimitado
- Plan Business ($47.999 ARS/mes): hasta 10 profesionales, comisiones,
  liquidaciones, insights, WhatsApp

## Convenciones de código

- TypeScript estricto (no any, no as, no !)
- Archivos en kebab-case
- Componentes React en PascalCase
- Server Actions en camelCase con prefijo (ej: createSale, updateShop)
- Siempre named exports (no default exports)
- Montos en centavos (integer), nunca decimales
- Fechas en timezone America/Argentina/Buenos_Aires
- Usar "type" en vez de "interface"
- Usar "satisfies" donde mejore type inference
- Comentarios en español para lógica de negocio
- Comentarios en inglés para lógica técnica

## Estructura del proyecto

[Se actualiza después de cada fase]

## Schema de DB

[Se actualiza después de la Fase 1]

## Patrones

- Server Components para páginas que muestran datos
- Client Components ("use client") solo cuando necesitan
  interactividad (formularios, animaciones, estado local)
- Server Actions para mutaciones (crear, actualizar, eliminar)
- Zod para validación en server Y client
- AppError para errores de negocio
- Drizzle queries tipadas, SQL raw solo para aggregations complejas
- Optimistic updates en el registro de venta

## Reglas inquebrantables

1. NUNCA exponer passwordHash al cliente
2. NUNCA confiar solo en validación del cliente
3. SIEMPRE verificar ownership antes de mutar datos
4. SIEMPRE usar snapshots en ventas (precio y comisión inmutables)
5. SIEMPRE verificar límites del plan en el servidor
6. TODOS los montos en centavos
7. NUNCA usar "any"
