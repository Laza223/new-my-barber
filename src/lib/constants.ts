/**
 * Constantes globales del proyecto My Barber.
 *
 * Todos los precios están en CENTAVOS (integer) para evitar
 * problemas de floating point. Ej: $24.999 = 2_499_900 centavos.
 */

// ── Planes ──────────────────────────────────────────────

export const PLANS = {
  FREE: {
    id: 'free' as const,
    name: 'Free',
    description: 'Para probar la plataforma',
    priceCents: 0,
    priceDisplay: 'Gratis',
    limits: {
      maxProfessionals: 1,
      maxServices: 3,
      maxSalesPerDay: 15,
      historyDays: 7,
      hasCommissions: false,
      hasReports: false,
      hasExport: false,
      hasWhatsapp: false,
      hasInsights: false,
    },
  },
  INDIVIDUAL: {
    id: 'individual' as const,
    name: 'Individual',
    description: 'Para barberos independientes',
    priceCents: 2_499_900,
    priceDisplay: '$24.999',
    limits: {
      maxProfessionals: 1,
      maxServices: 50,
      maxSalesPerDay: Infinity,
      historyDays: Infinity,
      hasCommissions: false,
      hasReports: true,
      hasExport: true,
      hasWhatsapp: false,
      hasInsights: false,
    },
  },
  BUSINESS: {
    id: 'business' as const,
    name: 'Business',
    description: 'Para barberías con equipo',
    priceCents: 4_799_900,
    priceDisplay: '$47.999',
    limits: {
      maxProfessionals: 10,
      maxServices: 50,
      maxSalesPerDay: Infinity,
      historyDays: Infinity,
      hasCommissions: true,
      hasReports: true,
      hasExport: true,
      hasWhatsapp: true,
      hasInsights: true,
    },
  },
} as const;

export type PlanId = (typeof PLANS)[keyof typeof PLANS]['id'];

// ── Métodos de Pago ─────────────────────────────────────

export const PAYMENT_METHODS = [
  { id: 'cash' as const, label: 'Efectivo', icon: '💵' },
  { id: 'card' as const, label: 'Tarjeta', icon: '💳' },
  { id: 'transfer' as const, label: 'Transferencia', icon: '🏦' },
  { id: 'mercadopago' as const, label: 'MercadoPago', icon: '📱' },
] as const;

export type PaymentMethodId =
  (typeof PAYMENT_METHODS)[number]['id'];

// ── Servicios Sugeridos (para onboarding) ───────────────

export const SUGGESTED_SERVICES = [
  { name: 'Corte', priceCents: 500_000 },
  { name: 'Corte + Barba', priceCents: 700_000 },
  { name: 'Barba', priceCents: 350_000 },
  { name: 'Corte Infantil', priceCents: 400_000 },
  { name: 'Cejas', priceCents: 150_000 },
  { name: 'Alisado', priceCents: 1_200_000 },
  { name: 'Tintura', priceCents: 800_000 },
  { name: 'Diseño de Barba', priceCents: 450_000 },
] as const;

// ── Días de la Semana ───────────────────────────────────

export const WEEKDAYS = [
  { id: 0, label: 'Dom', fullLabel: 'Domingo' },
  { id: 1, label: 'Lun', fullLabel: 'Lunes' },
  { id: 2, label: 'Mar', fullLabel: 'Martes' },
  { id: 3, label: 'Mié', fullLabel: 'Miércoles' },
  { id: 4, label: 'Jue', fullLabel: 'Jueves' },
  { id: 5, label: 'Vie', fullLabel: 'Viernes' },
  { id: 6, label: 'Sáb', fullLabel: 'Sábado' },
] as const;

// ── Config de la App ────────────────────────────────────

export const APP_CONFIG = {
  name: 'My Barber',
  description: 'Gestión financiera para barberías',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  locale: 'es-AR',
  timezone: 'America/Argentina/Buenos_Aires',
  currency: 'ARS',
  trialDays: 14,
  support: {
    email: 'soporte@mybarber.com.ar',
  },
} as const;

// ── Onboarding Steps ────────────────────────────────────

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Tu negocio',
    description: 'Nombre y datos de contacto',
  },
  {
    id: 2,
    title: 'Días laborales',
    description: 'Qué días trabaja tu barbería',
  },
  {
    id: 3,
    title: 'Servicios',
    description: 'Los servicios que ofrecés',
  },
  {
    id: 4,
    title: 'Meta mensual',
    description: 'Objetivo de facturación',
  },
  {
    id: 5,
    title: 'Confirmación',
    description: 'Revisá todo y empezá',
  },
] as const;

// ── Subscription Status ─────────────────────────────────

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
