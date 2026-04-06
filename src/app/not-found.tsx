import Link from 'next/link';

/**
 * Página 404 — Not Found.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          La página que buscás no existe.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm underline underline-offset-4"
        >
          Volver al inicio
        </Link>
        <p className="text-muted-foreground mt-4 text-xs">
          ¿Necesitás ayuda?{' '}
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
