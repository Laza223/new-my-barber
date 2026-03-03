/**
 * Página de login.
 * Si ya está autenticado → redirect a /dashboard.
 */
import { LoginForm } from '@/components/auth/login-form';
import { getSession } from '@/server/lib/get-session';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Iniciar sesión</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Ingresá a tu cuenta para gestionar tu barbería
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
