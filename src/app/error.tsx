'use client';

/**
 * Error boundary global.
 * Muestra un fallback amigable cuando ocurre un error inesperado.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="mt-2 text-muted-foreground">
          Ocurrió un error inesperado. Intentá de nuevo.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            Código de error: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
