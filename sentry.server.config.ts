import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capturar 10% de transacciones
  tracesSampleRate: 0.1,

  environment: process.env.NODE_ENV,

  // No enviar errores en desarrollo
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') return null;
    return event;
  },
});
