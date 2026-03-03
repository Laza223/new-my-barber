/**
 * Layout de autenticación (login, register).
 * Centrado con gradiente oscuro, card estilizada, logo arriba.
 * Responsive: full width en mobile, card centrada en desktop.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-0 -bottom-40 h-60 w-60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            <span className="text-primary">My</span>{' '}
            <span className="text-foreground">Barber</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestión financiera para barberías
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border p-6 shadow-lg sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-6 text-center text-xs">
          © {new Date().getFullYear()} My Barber. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
