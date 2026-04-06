/**
 * Página — Restablecer contraseña.
 * Recibe token via query param desde el email.
 */
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getSession } from '@/server/lib/get-session';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
};

export default async function ResetPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Nueva contraseña</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Elegí una contraseña segura para tu cuenta.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
