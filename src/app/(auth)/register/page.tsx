/**
 * Página de registro.
 * Si ya está autenticado → redirect a /dashboard.
 */
import { RegisterForm } from '@/components/auth/register-form';
import { getSession } from '@/server/lib/get-session';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Crear cuenta',
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Crear cuenta</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Registrate para empezar a gestionar tu barbería
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
