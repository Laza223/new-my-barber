/**
 * ForgotPasswordForm — Solicita reset de contraseña por email.
 * Usa Better-Auth client-side forgetPassword API.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/server/lib/auth-client';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('El email no es válido')
    .toLowerCase()
    .trim(),
});

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [emailSent, setEmailSent] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Email inválido');
      setIsPending(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (authClient as any).forgetPassword({
        email: parsed.data.email,
        redirectTo: '/reset-password',
      });

      if (result.error) {
        // Don't reveal if email exists or not — always show success
        setEmailSent(parsed.data.email);
      } else {
        setEmailSent(parsed.data.email);
      }
    } catch {
      // Still show success to avoid email enumeration
      setEmailSent(parsed.data.email);
    } finally {
      setIsPending(false);
    }
  }

  // ── Email enviado → pantalla de confirmación ──
  if (emailSent) {
    return (
      <div className="flex flex-col items-center space-y-4 py-6 text-center">
        <div className="bg-primary/10 rounded-full p-4">
          <MailCheck className="text-primary h-10 w-10" />
        </div>
        <h2 className="font-display text-xl font-bold">¡Revisá tu email!</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Si existe una cuenta con{' '}
          <strong className="text-foreground">{emailSent}</strong>, te enviamos
          un link para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className="text-primary text-sm font-medium hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  // ── Formulario ──
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div
          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        leftIcon={<Mail />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button type="submit" className="w-full" loading={isPending}>
        Enviar link de recuperación
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        <Link
          href="/login"
          className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Volver al login
        </Link>
      </p>
    </form>
  );
}
