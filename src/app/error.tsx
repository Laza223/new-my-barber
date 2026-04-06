'use client';

/**
 * Error boundary global.
 * Muestra un fallback amigable cuando ocurre un error inesperado.
 */
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-muted-foreground mt-2">
          Ocurrió un error inesperado. Intentá de nuevo.
        </p>
        {error.digest && (
          <p className="text-muted-foreground mt-1 text-xs">
            Código de error: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2 text-sm"
        >
          Reintentar
        </button>
        <p className="text-muted-foreground mt-4 text-xs">
          Si el problema persiste, escribinos a{' '}
          <a
            href="mailto:soporte@mybarber.com.ar"
            className="text-primary underline underline-offset-2"
          >
            soporte@mybarber.com.ar
          </a>
        </p>
      </div>
    </div>
  );
}
