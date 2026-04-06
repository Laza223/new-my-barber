/**
 * Logger estructurado para producción.
 *
 * En producción → JSON estructurado (parseable por Vercel Logs / Datadog).
 * En desarrollo → console.log legible con prefijos.
 */
import * as Sentry from '@sentry/nextjs';

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'production') {
      console.log(
        JSON.stringify({
          level: 'info',
          message,
          ...meta,
          ts: new Date().toISOString(),
        }),
      );
    } else {
      console.log(`[INFO] ${message}`, meta ?? '');
    }
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        JSON.stringify({
          level: 'warn',
          message,
          ...meta,
          ts: new Date().toISOString(),
        }),
      );
    } else {
      console.warn(`[WARN] ${message}`, meta ?? '');
    }
  },

  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    const payload = {
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...meta,
      ts: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify(payload));
    } else {
      console.error(`[ERROR] ${message}`, error ?? '', meta ?? '');
    }

    // Reportar a Sentry
    if (error) {
      Sentry.captureException(error, { extra: meta });
    }
  },
};
