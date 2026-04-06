/**
 * Analytics — utilidad para tracking de eventos de conversión.
 *
 * Envía eventos a GA4 (si está configurado) y Vercel Analytics.
 * Los eventos se ignoran silenciosamente si no hay analytics configurado.
 */
import { track } from '@vercel/analytics';

/** Eventos de negocio para tracking */
type AnalyticsEvent =
  | { name: 'sign_up'; properties?: { method?: string } }
  | { name: 'login'; properties?: { method?: string } }
  | { name: 'onboarding_completed'; properties?: { shopName?: string } }
  | {
      name: 'sale_created';
      properties?: { amount?: number; paymentMethod?: string };
    }
  | {
      name: 'plan_upgraded';
      properties?: { planId?: string; planName?: string };
    }
  | { name: 'plan_cancelled'; properties?: { planId?: string } }
  | { name: 'service_created'; properties?: { serviceName?: string } }
  | { name: 'professional_added'; properties?: Record<string, string> }
  | { name: 'promotion_created'; properties?: Record<string, string> };

/**
 * Trackea un evento de conversión.
 * Envía a Vercel Analytics y GA4 (si está configurado).
 */
export function trackEvent(event: AnalyticsEvent) {
  // Vercel Analytics
  try {
    track(event.name, event.properties ?? {});
  } catch {
    // Silently ignore if analytics not available
  }

  // Google Analytics 4 (si está configurado)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', event.name, event.properties);
    } catch {
      // Silently ignore
    }
  }
}
