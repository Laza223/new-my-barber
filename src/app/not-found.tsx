import Link from 'next/link';

/**
 * Página 404 — Not Found.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          La página que buscás no existe.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm underline underline-offset-4"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
