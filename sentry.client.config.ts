import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capturar 10% de transacciones para no agotar la quota
  tracesSampleRate: 0.1,

  // Replay: capturar 10% de sesiones, 100% cuando hay error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  // No enviar errores en desarrollo
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') return null;
    return event;
  },

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
