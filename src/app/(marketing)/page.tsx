/**
 * Landing Page — FOMO-driven, aggressive marketing, Argentine-focused.
 * Supports BOTH light and dark modes via system preference.
 * Mobile-first responsive.
 */
import { PLANS } from '@/lib/constants';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  Clock,
  Crown,
  Gift,
  Lock,
  MessageCircle,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ── Urgency banner ──────────────── */
function UrgencyBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-center text-xs font-bold tracking-wide text-white sm:text-sm">
      <span className="mr-1 inline-block animate-pulse">🔥</span>
      Solo en Marzo:{' '}
      <span className="underline underline-offset-2">14 días GRATIS</span> con
      acceso completo · Cupos limitados
      <span className="ml-1 inline-block animate-pulse">🔥</span>
    </div>
  );
}

/* ── Stat counter ────────────────── */
function StatCounter({
  value,
  label,
  suffix,
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-slate-900 tabular-nums sm:text-4xl md:text-5xl dark:text-white">
        {value}
        {suffix && (
          <span className="text-cyan-600 dark:text-cyan-400">{suffix}</span>
        )}
      </div>
      <div className="mt-1 text-[10px] tracking-wider text-slate-500 uppercase sm:text-xs dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}

/* ── Testimonial card ────────────── */
function TestimonialCard({
  quote,
  name,
  city,
  role,
}: {
  quote: string;
  name: string;
  city: string;
  role: string;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-md sm:p-6 dark:border-white/[0.06] dark:bg-[#0c1120] dark:shadow-none">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-slate-600 italic sm:text-base dark:text-slate-300">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {role} · {city}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Feature card ────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-blue-100 bg-white p-5 shadow-md transition-all duration-500 hover:border-cyan-300 hover:shadow-lg sm:p-6 dark:border-white/[0.06] dark:bg-[#0d1321] dark:shadow-none dark:hover:border-cyan-500/20 dark:hover:shadow-none">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-cyan-500/5" />
      <div className="relative space-y-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11"
          style={{
            background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
            boxShadow: `0 0 15px ${accent}10`,
          }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: accent }} />
        </div>
        <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ── Pricing card ────────────────── */
function PricingCard({
  plan,
  badge,
  glowing,
}: {
  plan: typeof PLANS.FREE;
  badge?: string;
  glowing?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-[1px] ${
        glowing
          ? 'bg-gradient-to-b from-cyan-400 via-cyan-500/50 to-transparent'
          : 'bg-slate-200 dark:bg-white/[0.06]'
      }`}
    >
      {glowing && (
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-cyan-500/10 blur-xl dark:bg-cyan-500/15" />
      )}

      <div className="relative h-full space-y-4 rounded-2xl bg-white p-5 sm:p-6 dark:bg-[#0a0f1e]">
        {badge && (
          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-[10px] font-black tracking-wider whitespace-nowrap text-white uppercase shadow-lg shadow-cyan-500/30 sm:px-4 sm:text-xs">
              <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {badge}
            </span>
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
            {plan.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {plan.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              {plan.priceCents === 0 ? 'Gratis' : plan.priceDisplay}
            </span>
            {plan.priceCents > 0 && (
              <span className="text-sm text-slate-400 dark:text-slate-500">
                /mes
              </span>
            )}
          </div>
          {plan.priceCents > 0 && (
            <p className="mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              ✨ 14 días gratis, después se cobra
            </p>
          )}
        </div>

        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            {plan.limits.maxProfessionals === 1
              ? '1 profesional'
              : `Hasta ${plan.limits.maxProfessionals} profesionales`}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            {plan.limits.maxServices <= 3
              ? `${plan.limits.maxServices} servicios`
              : 'Servicios ilimitados'}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            {isFinite(plan.limits.maxSalesPerDay)
              ? `${plan.limits.maxSalesPerDay} ventas/día`
              : 'Ventas ilimitadas'}
          </li>
          {plan.limits.hasExport && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
              Exportar PDF/Excel
            </li>
          )}
          {plan.limits.hasInsights && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Insights inteligentes
            </li>
          )}
          {plan.limits.hasWhatsapp && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Resumen WhatsApp
            </li>
          )}
        </ul>

        <Link
          href="/register"
          className={`block rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-all sm:py-3 ${
            glowing
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] hover:shadow-cyan-500/50 active:scale-[0.98]'
              : 'border border-slate-200 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 dark:border-white/10 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/5'
          }`}
        >
          {plan.priceCents === 0 ? 'Empezar gratis' : 'Probar 14 días gratis →'}
        </Link>
      </div>
    </div>
  );
}

/* ── Social proof ────────────────── */
function SocialProof() {
  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  const initials = ['L', 'M', 'J', 'C', 'R'];
  return (
    <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
      <div className="flex -space-x-2">
        {colors.map((bg, i) => (
          <div
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-50 text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-xs dark:border-[#070b16]"
            style={{ background: bg }}
          >
            {initials[i]}
          </div>
        ))}
      </div>
      <div className="text-left">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[10px] text-slate-400 sm:text-xs dark:text-slate-400">
          Usado por barberos en toda Argentina
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────── */
/* ── Main page ──────────────────── */
/* ──────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#070b16] dark:text-white">
      {/* Glow blobs (only visible in dark mode) */}
      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block">
        <div className="absolute top-[-20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.07] blur-[80px] sm:h-[600px] sm:w-[600px] sm:blur-[120px]" />
        <div className="absolute top-[40%] right-[-15%] h-[250px] w-[250px] rounded-full bg-blue-600/[0.05] blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[200px] w-[200px] rounded-full bg-violet-600/[0.04] blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />
      </div>

      {/* Light mode subtle bg pattern */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-50 via-slate-50 to-white dark:hidden" />

      {/* ── Urgency bar ── */}
      <UrgencyBanner />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#070b16]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="My Barber"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-base font-black tracking-tight sm:text-lg">
              My Barber
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="hidden text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 sm:block sm:text-sm dark:text-slate-400 dark:hover:text-white"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] sm:px-5 sm:text-sm"
            >
              Probar gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl px-5 pt-12 pb-14 text-center sm:px-6 sm:pt-20 sm:pb-24">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.08] px-4 py-2 text-xs sm:mb-8 sm:px-5 sm:py-2.5 sm:text-sm dark:bg-cyan-500/[0.08]">
          <Gift className="h-3.5 w-3.5 text-cyan-600 sm:h-4 sm:w-4 dark:text-cyan-400" />
          <span className="font-semibold text-cyan-700 dark:text-cyan-300">
            14 días gratis · Sin tarjeta · Cancelá cuando quieras
          </span>
        </div>

        {/* Logo */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="My Barber"
              width={80}
              height={80}
              className="rounded-2xl sm:h-[100px] sm:w-[100px]"
              priority
            />
            <div className="absolute -inset-2 -z-10 rounded-2xl bg-cyan-500/10 blur-xl dark:bg-cyan-500/15" />
          </div>
        </div>

        {/* H1 */}
        <h1 className="mb-4 font-black tracking-tight sm:mb-6">
          <span className="block text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Dejá de perder plata
          </span>
          <span className="mt-1 block text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            con cuentas{' '}
            <span
              className="bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-cyan-400 dark:to-blue-400"
              style={{
                WebkitTextFillColor: 'transparent',
                paddingBottom: '0.15em',
                display: 'inline-block',
                lineHeight: 1.3,
              }}
            >
              en servilletas
            </span>
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
          My Barber es la app que usan los barberos que{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            facturan en serio
          </span>
          . Registrá ventas, controlá comisiones y sabé exactamente cuánto
          ganás.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-7 py-3.5 text-base font-black text-white shadow-2xl shadow-cyan-500/30 transition-all hover:scale-[1.03] hover:shadow-cyan-500/50 active:scale-[0.97] sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
          >
            <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-lg transition-opacity group-hover:opacity-50" />
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
            Empezar gratis ahora
          </Link>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <Lock className="h-3 w-3" /> Sin tarjeta de crédito
          </p>
        </div>

        <SocialProof />

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-4 sm:mt-16 sm:gap-8">
          <StatCounter value="500" suffix="+" label="Barberías" />
          <StatCounter value="4" label="Toques x venta" />
          <StatCounter value="2" suffix="s" label="Registro" />
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className="border-t border-slate-200/60 py-14 sm:py-20 dark:border-white/[0.04]">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-xl font-black tracking-tight sm:text-3xl">
              ¿Te suena familiar?
            </h2>
            <p className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Si te pasa alguna de estas, My Barber es para vos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              'A fin de mes no sabés cuánto facturaste realmente',
              'Hacés las cuentas de comisiones a mano y siempre hay quilombo',
              'No tenés idea de cuál es tu servicio más rentable',
              'Tu socio o empleado dice "ayer corté 10" y no tenés forma de verificarlo',
              'Perdés tiempo con planillas de Excel que nunca están al día',
              'Querés crecer pero no tenés datos para tomar decisiones',
            ].map((pain) => (
              <div
                key={pain}
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 dark:border-red-500/10 dark:bg-red-500/[0.03]"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {pain}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:mt-10">
            <p className="text-sm font-bold text-cyan-600 sm:text-lg dark:text-cyan-400">
              Con My Barber, todo esto se resuelve en 1 día. Literal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-1.5 text-[10px] font-bold tracking-widest text-cyan-700 uppercase sm:text-xs dark:text-cyan-400">
              <Sparkles className="h-3 w-3" /> Qué incluye
            </span>
            <h2 className="mb-3 text-xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Todo lo que tu barbería{' '}
              <span
                className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                necesita
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Hecho por gente que entiende la barbería. Nada de humo, todo
              funcionalidad.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <FeatureCard
              icon={Smartphone}
              title="Registro en 4 toques"
              desc="Más rápido que cobrar el corte. Literalmente."
              accent="#0891b2"
            />
            <FeatureCard
              icon={BarChart3}
              title="Dashboard inteligente"
              desc="Sabé cuánto facturás por hora, día, semana y mes. En tiempo real."
              accent="#3b82f6"
            />
            <FeatureCard
              icon={Users}
              title="Comisiones automáticas"
              desc="Liquidá a tu equipo sin errores. Cada profesional ve lo que le corresponde."
              accent="#7c3aed"
            />
            <FeatureCard
              icon={Shield}
              title="Liquidaciones en PDF"
              desc="Generá el PDF, mandalo por WhatsApp y listo. Cero drama."
              accent="#db2777"
            />
            <FeatureCard
              icon={Clock}
              title="Historial completo"
              desc="Filtrás por fecha, profesional o medio de pago. Todo queda registrado."
              accent="#d97706"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Insights del negocio"
              desc="Cuál es tu mejor día, tu servicio estrella y si estás creciendo o no."
              accent="#059669"
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-slate-200/60 py-14 sm:py-24 dark:border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-4 py-1.5 text-[10px] font-bold tracking-widest text-amber-600 uppercase sm:text-xs dark:text-amber-400">
              <MessageCircle className="h-3 w-3" /> Testimonios reales
            </span>
            <h2 className="mb-3 text-xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Lo que dicen los que{' '}
              <span
                className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                ya la usan
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <TestimonialCard
              quote="Antes sumaba con la calculadora del celular a fin de mes. Hoy abro el dashboard y tengo todo. Me cambió la forma de laburar."
              name="Tomás G."
              city="CABA"
              role="Dueño de barbería"
            />
            <TestimonialCard
              quote="Lo mejor es lo de las comisiones. Mis barberos ven exactamente lo que les corresponde, cero discusión. Se terminaron los quilombos."
              name="Facundo R."
              city="Córdoba"
              role="2 locales"
            />
            <TestimonialCard
              quote="En 2 minutos registro todo. Antes perdía media hora por día con el Excel. Ahora eso es plata que facturo."
              name="Nico M."
              city="Rosario"
              role="Barbero independiente"
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-1.5 text-[10px] font-bold tracking-widest text-cyan-700 uppercase sm:text-xs dark:text-cyan-400">
              💎 Elegí tu plan
            </span>
            <h2 className="mb-3 text-xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Planes que se pagan solos{' '}
              <span
                className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                con 1 corte más al mes
              </span>
            </h2>
            <p className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Probá 14 días gratis. Sin tarjeta. Cancelá cuando quieras.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
            <PricingCard plan={PLANS.FREE} />
            <PricingCard plan={PLANS.INDIVIDUAL} badge="Más popular" glowing />
            <PricingCard plan={PLANS.BUSINESS} badge="Para equipos" />
          </div>

          {/* Trust */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 sm:mt-10 sm:gap-6 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Pagos seguros con MercadoPago
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" /> Sin permanencia
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Tus datos protegidos
            </span>
          </div>
        </div>
      </section>

      {/* ── FOMO Section ── */}
      <section className="border-t border-slate-200/60 py-14 sm:py-20 dark:border-white/[0.04]">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <div className="space-y-4 rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-transparent p-6 shadow-sm sm:space-y-6 sm:p-10 dark:border-amber-500/20 dark:from-amber-500/[0.05] dark:shadow-none">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              <Timer className="h-3.5 w-3.5 animate-pulse" /> Oferta por tiempo
              limitado
            </div>
            <h2 className="text-xl font-black sm:text-3xl">
              Mientras tu competencia sigue con el cuadernito,{' '}
              <span className="text-cyan-600 dark:text-cyan-400">
                vos ya podés tener todo automatizado
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Cada día que pasa sin controlar tus números es plata que perdés.
              Los mejores barberos ya lo saben.
            </p>
            <Link
              href="/register"
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-7 py-3.5 text-base font-black text-white shadow-2xl shadow-cyan-500/30 transition-all hover:scale-[1.03] hover:shadow-cyan-500/50 active:scale-[0.97] sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
            >
              <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-lg transition-opacity group-hover:opacity-50" />
              Quiero empezar ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>
            <p className="text-[10px] text-slate-400 sm:text-xs">
              +500 barberías ya se pasaron a My Barber este mes
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 dark:block">
          <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[80px] sm:h-[600px] sm:w-[600px] sm:blur-[120px] dark:bg-cyan-500/[0.07]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-6">
          <Image
            src="/logo.png"
            alt="My Barber"
            width={56}
            height={56}
            className="mx-auto mb-5 rounded-xl sm:mb-6"
          />
          <h2 className="mb-3 text-xl font-black tracking-tight sm:mb-4 sm:text-3xl md:text-4xl">
            Tu barbería merece{' '}
            <span
              className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-300 dark:to-blue-400"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              herramientas profesionales
            </span>
          </h2>
          <p className="mb-6 text-sm text-slate-500 sm:mb-8 sm:text-base dark:text-slate-400">
            Dejá de improvisar. Empezá a gestionar como un profesional.
          </p>
          <Link
            href="/register"
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-7 py-3.5 text-base font-black text-white shadow-2xl shadow-cyan-500/30 transition-all hover:scale-[1.03] hover:shadow-cyan-500/50 active:scale-[0.97] sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
          >
            <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-lg transition-opacity group-hover:opacity-50" />
            Crear mi cuenta gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 py-8 dark:border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="My Barber"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="text-sm font-bold">My Barber</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 sm:gap-5 sm:text-sm dark:text-slate-500">
              <a
                href="#pricing"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Planes
              </a>
              <Link
                href="/login"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Registrarse
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Términos
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Privacidad
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} My Barber · Hecho en Argentina 🇦🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
