/**
 * Página — Olvidé mi contraseña.
 * Si ya está autenticado → redirect a /dashboard.
 */
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { getSession } from '@/server/lib/get-session';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">
          Recuperar contraseña
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Ingresá tu email y te enviaremos un link para restablecer tu
          contraseña.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
