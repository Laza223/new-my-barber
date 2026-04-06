# TODO — My Barber

---

## ⚫ Bloque 0 — Infraestructura crítica (escala y correctitud)

- [ ] **Activar connection pooling de Neon (PgBouncer)** — Cambiar la
      DATABASE_URL por la URL del pooler de Neon y configurar Drizzle con
      `max: 1` para entorno serverless. Sin esto, bajo carga moderada la app
      empieza a tirar errores de conexión.

- [ ] **Agregar índices compuestos en la DB** — Como mínimo:
      `(shop_id, created_at)` y `(shop_id, professional_id)` en `sales`.
      `(shop_id)` en `professionals` y `services`. Sin índices, las queries
      se vuelven full table scans a medida que crece el volumen de datos.

- [ ] **Idempotencia en el webhook de MercadoPago** — Agregar constraint
      UNIQUE en `payment_history.mp_payment_id` y verificar en el handler que
      el pago no fue procesado antes. MP puede enviar el mismo evento múltiples
      veces.

- [ ] **Transacciones en operaciones compuestas** — Verificar que `createSale`
      y cualquier operación que toque múltiples tablas use transacciones de
      Drizzle para garantizar consistencia.

- [ ] **Implementar caching en queries del dashboard** — Usar `unstable_cache`
      de Next.js en las queries de métricas (ventas de hoy, del mes, charts).
      Cache de 60s server-side — el mismo intervalo del auto-refresh. Reduce
      drásticamente la carga en la DB bajo uso concurrente.

- [ ] **Dynamic imports para librerías pesadas** — Aplicar `dynamic(() => 
import(...))` en jsPDF, xlsx y opcionalmente recharts. Solo se cargan
      cuando el usuario los necesita, no en el bundle inicial.

- [x] **Verificar y completar la configuración de Sentry** — ✅ Creados
      `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`,
      `instrumentation.ts`. next.config.ts envuelto con `withSentryConfig`.
      Error boundary captura en Sentry. Falta: configurar DSN real en env vars.

- [ ] **Hacer los cron jobs resilientes** — Agregar logging de resultado
      (éxito/fallo + cantidad de registros afectados) y `captureException` de
      Sentry en el catch de ambos crons. Para `check-subscriptions`, documentar
      el procedimiento de ejecución manual en caso de fallo.

- [ ] **Enforcer TypeScript estricto a nivel de tooling** — Verificar que
      `tsconfig.json` tenga `strict: true` y `noUncheckedIndexedAccess: true`.
      Agregar reglas ESLint `@typescript-eslint/no-explicit-any` y
      `@typescript-eslint/no-non-null-assertion` en modo `error`.

- [ ] **Ampliar cobertura de tests** — Agregar tests para la lógica de
      negocio crítica: `sale.service.ts` (comisiones, límites de plan),
      `subscription.service.ts` (acceso por plan), handler del webhook de MP,
      y validaciones Zod principales.

- [ ] **Idempotencia en createSale** — Generar un token único al iniciar el
      flujo de venta en el cliente. Enviarlo con la Server Action. Si el token
      ya existe en DB, devolver la venta original. Previene duplicados por
      doble tap, lag de red y retry automático.

- [ ] **Soft deletes en professionals y services** — Agregar columna
      `deleted_at` en lugar de hard delete. Preserva la integridad del
      historial de ventas y los datos del snapshot.

- [ ] **Helper scopedDb(shopId)** — Query builder de Drizzle pre-filtrado
      por shop_id del usuario autenticado. Hace estructuralmente imposible
      olvidar el filtro de tenant en cualquier query.

- [ ] **Función centralizada calculateCommission()** — Con regla de redondeo
      documentada y tests que cubran casos con decimales. Único lugar donde se
      calcula comisión en todo el sistema.

- [ ] **Verificar timezone en todas las queries de agregación** — Confirmar
      que los date_trunc y rangos mensuales usen America/Argentina/Buenos_Aires
      en PostgreSQL, no conversión posterior en JS.

- [x] **Logging estructurado en eventos críticos** — ✅ Creado `lib/logger.ts`
      con output JSON en prod y readable en dev. Integrado con Sentry. Webhook
      MP ya loguea todos los eventos de pago.

- [ ] **Alertas en Sentry** — Configurar alertas para: tasa de error de
      Server Actions elevada, webhook de MP con fallos consecutivos, cron job
      sin ejecutarse en más de 25 horas.

- [ ] **Sanitización de errores de DB** — Asegurar que ningún AppError
      exponga stack traces, nombres de tablas ni fragmentos de queries al
      cliente.

- [ ] **Especificar completamente el flujo de downgrade** — Definir qué
      pasa con los profesionales excedentes al bajar de Business a Individual
      antes de implementar. Documentar en CLAUDE_CONTEXT.md.

- [ ] **Documentar procedimiento de restore y reconciliación con MP** —
      En caso de restore de DB, script para reconciliar payment_history contra
      la API de MercadoPago del período afectado.

- [ ] **Test de IDOR** — Agregar test de integración que intente acceder
      a datos de otro shop_id con sesión válida. Debe retornar 403.

- [ ] **Timeout de Vercel en exports pesados** — Verificar que la generación
      de PDF/Excel ocurre en el cliente con datos ya cargados, no en una
      función serverless que puede hacer timeout.

- [ ] **Ruta /admin interna** — Panel básico protegido con: total de shops
      activos, shops en trial, MRR aproximado y ventas del día. Para operar
      el negocio sin entrar a la DB manualmente.
- [ ] **Sesión única por cuenta** — Al iniciar sesión en un dispositivo,
      invalidar automáticamente todas las sesiones anteriores usando
      revokeOtherSessions() de Better-Auth. El dispositivo desplazado debe
      recibir el mensaje "Tu sesión fue iniciada en otro dispositivo" al
      intentar cualquier acción, no un error genérico. No aplica panel de
      gestión de dispositivos — una cuenta, un dispositivo activo.

## 🔴 Bloque 1 — Bugs críticos (roto hoy)

- [ ] **Arreglar toggle de tema claro/oscuro** — El botón existe pero no cambia el modo, solo muestra el estado actual.

- [ ] **Corregir alerta de trial gratuita** — La alerta "Te quedan X días de prueba gratuita" solo debe mostrarse cuando el usuario está en período de prueba de un plan pago (Individual o Business). Nunca debe aparecer en el plan Free permanente.

---

## 🟠 Bloque 2 — Flujos de negocio incompletos (afectan conversión y dinero)

- [ ] **Épica: Gestión de suscripción completa** — Implementar en un solo flujo integrado:
  - Cambio de plan (upgrade y downgrade) con lógica de prorrateo en MercadoPago.
  - Cancelación de suscripción con timing correcto (la suscripción permanece activa hasta el fin del período ya pago).
  - UI en Settings con estado actual del plan, fecha de próxima renovación y opciones claras de acción.

- [ ] **Validación proactiva del límite diario de ventas** — En `/new-sale`, verificar server-side si el usuario alcanzó el límite del plan antes de renderizar el formulario. Si llegó al límite, mostrar una pantalla de bloqueo con el conteo (`15/15 ventas hoy`) y un CTA de upgrade. El usuario nunca debe intentar registrar una venta que va a fallar — la experiencia tiene que ser proactiva, no reactiva.

- [ ] **Manejo de errores consistente en toda la app** — Auditar todas las Server Actions y garantizar que tanto errores de negocio como errores técnicos muestren toasts descriptivos al usuario (usando `sonner`, ya instalado). Ningún error debe fallar silenciosamente.

---

## 🟡 Bloque 3 — UX y retención

- [x] **Emails transaccionales con Resend** — ✅ 6 templates implementados:
  - Bienvenida (welcomeEmail) — al completar onboarding.
  - Verificación de email (verificationEmail) — al registrarse.
  - Reset de password (passwordResetEmail) — forgot password.
  - Plan activado (planActivatedEmail) — webhook MP aprobado.
  - Aviso de trial (trialWarningEmail) — cron 3 días antes.
  - Cancelación (cancellationEmail) — al cancelar suscripción.

- [ ] **Eliminar "Nueva Venta" de la barra lateral** — El flujo de `/new-sale` tarda en cargar. La experiencia es más rápida y liviana desde el modal del dashboard. El acceso queda centralizado en la página de inicio.

- [ ] **Agregar secciones faltantes en la barra lateral desktop** — Incluir accesos visibles a: Servicios, Reportes y Profesionales.

- [ ] **Implementar lazy loading y skeleton loading** — Prioritario en: cards de métricas del dashboard, charts, ranking de profesionales, lista de ventas y tabla de liquidación en reportes. El dashboard ejecuta 10 queries paralelas — los skeletons son prácticamente obligatorios.

- [ ] **Implementar días promocionales** — Especificación completa:
  - Nueva tabla `promotions` en DB con campos: `day_of_week` (0-6), `discount_percentage`, `service_id` (nullable — si es null aplica a todos los servicios), `name`, `active`.
  - En el flujo de Nueva Venta, detectar automáticamente si hoy hay una promoción activa.
  - En el selector de servicios, mostrar el precio original tachado junto al precio con descuento aplicado.
  - Al confirmar la venta, guardar en el snapshot: `original_price`, `discount_applied` y `promotion_id`.
  - En reportes: badge visual en ventas con descuento y columna separada para ver el impacto total de promociones.
  - CRUD de promociones en Settings: crear, activar/desactivar y eliminar.

- [ ] **Verificar y mejorar el onboarding wizard** — El componente ya existe (5 pasos). Verificar que el flujo completo funcione sin fricción. Agregar modal de bienvenida para usuarios que acaban de pagar un plan y aún no terminaron de configurar su barbería. Si el wizard ya existe y funciona bien, proponer mejoras puntuales en lugar de rehacerlo.

- [ ] **Permitir editar el nombre de "Mi Barbería"** — Desde la sección correspondiente en Settings.

---

## 🟢 Bloque 4 — Crecimiento y valor percibido

- [ ] **Insights como análisis de IA** — Integrar la API de un modelo de lenguaje (Claude o GPT) para generar insights contextuales basados en los datos reales del negocio: días más rentables, servicios con mejor margen, profesional con mayor conversión, etc. Cada insight debe incluir una acción sugerida concreta, no solo una observación. Ejemplo: no "vendiste más el martes" sino "considerá reforzar el turno tarde los martes, es tu franja horaria más rentable". Los insights deben sentirse como un análisis hecho por un consultor, no como un resumen de estadísticas.

- [ ] **PWA: probar y validar el flujo completo** — Testear "Agregar a pantalla de inicio" en iOS Safari y Android Chrome. Verificar que el manifest, íconos y splash screens estén correctamente configurados. Es una funcionalidad clave para barberías que usan la app desde el celular todo el día.

---

## 🔵 Bloque 5 — Seguridad y deuda técnica

- [ ] **Rate limiting en Server Actions críticas** — Implementar con Upstash Redis + `@upstash/ratelimit` en: `createSale`, `createProfessional`, `createService` y el endpoint del webhook de MercadoPago. Protege la base de datos de abuso accidental (loops, bugs) o malicioso (bots). Upstash tiene free tier y se integra en pocas líneas dentro de las actions.

- [x] **SEO y metadata dinámica** — ✅ OG image, Twitter cards, metadata en layout.
      Sitemap dinámico, robots.ts bloqueando dashboard/API. Dashboard layout con
      `noindex`. Terms y Privacy linkeados en footer. Copyright dinámico.

- [ ] **Optimizar el rendimiento general** — Revisar bundle size, lazy imports de librerías pesadas (jsPDF, xlsx, recharts) y caching de queries frecuentes en el dashboard.

- [ ] **Documentación del esquema de DB y rutas principales** — Documentar las 13 tablas con sus relaciones y las rutas de API/actions más importantes. Indispensable si el proyecto va a ser retomado por otro desarrollador sin depender de microgestión.

🚨 Cosas que te pueden explotar el día 1
El flujo de registro → onboarding → primer pago nunca fue testeado de punta a punta
Es el camino más crítico del sistema y el más fácil de que tenga un bug que nadie vio porque cada parte se testea por separado. Un usuario se registra, hace el onboarding, va a pagar, MercadoPago lo redirige de vuelta, y... ¿qué pasa exactamente? ¿El webhook llega antes que el redirect? ¿El plan se activa correctamente? ¿El usuario ve confirmación o una pantalla rara? Ese flujo completo necesita ser ejecutado manualmente con una tarjeta real antes de lanzar.
MercadoPago en sandbox no se comporta igual que producción
El webhook en producción tiene delays variables, puede llegar segundos o minutos después del pago. En sandbox llega casi instantáneo. Si el UX asume que el plan está activo inmediatamente después del redirect, en producción el usuario va a volver a la app y seguir viendo "plan free" por un momento. Necesitás un estado intermedio: "Procesando tu pago..." con polling o con el webhook actualizando en background.
Las credenciales de MercadoPago de producción son distintas a las de sandbox
Parece obvio pero es el error más común al lanzar. El MERCADOPAGO_ACCESS_TOKEN de producción tiene que estar en Vercel antes del lanzamiento y el webhook URL tiene que apuntar al dominio de producción, no a localhost o a un ngrok que ya no existe.

💳 MercadoPago — Detalles que muerden
¿Qué plan de MP tienen para las suscripciones?
MP tiene dos formas de hacer suscripciones: Suscripciones (cobro automático recurrente) y preferencias de pago manuales cada mes. Si están usando preferencias manuales, el cobro no es automático — el usuario tiene que volver a pagar cada mes manualmente. Eso no es una suscripción SaaS, es una factura mensual. Necesitás confirmar que están usando la API de Suscripciones de MP con cobro automático.
Gestión de fallos de cobro
Si la tarjeta del cliente no tiene fondos el día del cobro, MP reintenta. ¿El sistema sabe que está en past_due? El cron check-subscriptions lo maneja, pero ¿cuántos días de gracia le das antes de bajar el plan? ¿El usuario recibe un email avisando que el cobro falló? Sin ese email, el usuario no sabe por qué perdió acceso y llama a quejarse.

⚖️ Legal y compliance en Argentina — Lo que nadie piensa hasta que lo necesita
Facturación:
Estás cobrando $24.999 y $47.999 ARS por mes. En Argentina eso implica obligaciones fiscales. ¿Están emitiendo factura electrónica por cada cobro? MercadoPago puede generar el comprobante del lado del pagador pero vos como proveedor del servicio tenés que emitir factura. Si no, cuando un cliente lo pida (y alguno lo va a pedir), no vas a tener forma de dársela. Mínimo: tenerlo resuelto antes de lanzar aunque sea manualmente al principio.
Términos y condiciones y política de privacidad:
Si hay un registro de usuarios con email y datos de negocio, en Argentina aplica la Ley 25.326 de Protección de Datos Personales. Necesitás al menos una página de Términos de Servicio y una de Política de Privacidad con el checkbox de aceptación en el registro. Sin eso, si un usuario se queja o pide que borres sus datos, no tenés base legal documentada.

🧪 Testing de negocio que falta antes de producción
Estos no son tests de código — son escenarios que hay que ejecutar a mano antes de lanzar:

Registrarse → completar onboarding → registrar 15 ventas → intentar la 16 (¿se bloquea correctamente?)
Registrarse → activar trial → esperar a que venza (o simular en DB) → ¿qué ve el usuario?
Plan Business → downgrade a Individual → ¿qué pasa con los datos?
Registrar una venta → cerrar la app antes de recibir confirmación → volver → ¿hay duplicado?
Cambiar contraseña → ¿la sesión activa en el otro dispositivo se invalida?

🎨 UX que genera soporte innecesario
No hay página de estado del sistema
Si Neon tiene un incidente o Vercel cae, el usuario solo ve que la app no carga. Sin una página de estado (aunque sea una URL de Vercel status o una página estática) vas a recibir mensajes de "se cayó el sistema" sin poder responder nada. Solución mínima: agregar el link al status de Vercel en algún lugar visible, o usar BetterUptime para una página de status propia.
El primer uso después de registrarse es confuso sin datos
El dashboard con todos los charts vacíos y ceros es desorientante. Un usuario nuevo no sabe si la app está rota o si realmente no hay datos. Necesitás un estado vacío ("empty state") específico para cuenta nueva: "Registrá tu primera venta para ver tus métricas acá" con un CTA directo. Distinto al estado vacío de un día sin ventas para un usuario ya activo.
¿Qué pasa si el usuario cierra el onboarding a mitad?
Si el wizard es interrumpible, el usuario puede quedar en un estado donde tiene cuenta pero no tiene servicios ni profesionales configurados. La próxima vez que entre, ¿arranca el onboarding de nuevo? ¿Lo manda directo al dashboard roto? Necesitás un flag onboarding_completed en shops y un middleware que lo redirectee al onboarding si no está completo.

📊 Métricas que necesitás desde el día 1
No para el usuario — para vos como operador del negocio:
¿Cómo sabés si el onboarding tiene fricción?
Si 100 personas se registran y 40 no completan el onboarding, tenés un problema. Sin tracking de eventos (Posthog, Mixpanel, o simplemente Vercel Analytics con eventos custom) no lo sabés hasta que el negocio no crece y no entendés por qué.
Los eventos mínimos que necesitás trackear: user_registered, onboarding_completed, first_sale_created, plan_upgraded, subscription_cancelled.
Con esos 5 eventos podés calcular el funnel completo y saber exactamente dónde se van los usuarios.

🏁 Veredicto final antes de producción
Lo que está listo: la arquitectura es sólida, el stack es correcto, las convenciones son buenas. El código parece estar bien pensado.
Lo que no puede faltar antes de lanzar, en orden:

Test end-to-end del flujo de pago con tarjeta real en producción
Estado intermedio "procesando pago" en el redirect de MP
Email de fallo de cobro implementado
Empty states para cuenta nueva
Flag onboarding_completed con redirect middleware
Términos y condiciones + política de privacidad con checkbox en registro
Credenciales de producción de MP verificadas en Vercel
El cron de check-subscriptions ejecutado manualmente una vez para verificar que funciona
