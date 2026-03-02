import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

/**
 * Layout para páginas de autenticación.
 * Centrado, sin sidebar, con branding mínimo.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 px-4">
        {/* Logo / branding */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">My Barber</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
