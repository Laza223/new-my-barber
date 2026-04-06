/**
 * ResetPasswordForm — Formulario para crear nueva contraseña.
 * Recibe el token via URL search params (enviado por Better-Auth en el email).
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { authClient } from '@/server/lib/auth-client';
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

const resetSchema = z
  .object({
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmPassword: z.string({
      required_error: 'Confirmá tu contraseña',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/** Calcula la fuerza del password (0-4) */
function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const strengthLabels = [
  'Muy débil',
  'Débil',
  'Regular',
  'Fuerte',
  'Muy fuerte',
];
const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-400',
  'bg-emerald-500',
];

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );

  const strength = getPasswordStrength(password);

  // Sin token → link inválido
  if (!token) {
    return (
      <div className="flex flex-col items-center space-y-4 py-6 text-center">
        <div className="bg-destructive/10 rounded-full p-4">
          <ShieldCheck className="text-destructive h-10 w-10" />
        </div>
        <h2 className="font-display text-xl font-bold">Link inválido</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Este link de restablecimiento no es válido o ya expiró. Pedí uno
          nuevo.
        </p>
        <Link
          href="/forgot-password"
          className="text-primary text-sm font-medium hover:underline"
        >
          Solicitar nuevo link
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setFieldErrors({});

    const parsed = resetSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const err of parsed.error.errors) {
        const field = err.path[0] as string;
        if (!errors[field]) errors[field] = err.message;
      }
      setFieldErrors(errors);
      setIsPending(false);
      return;
    }

    try {
      const result = await authClient.resetPassword({
        newPassword: parsed.data.password,
        token: token ?? '',
      });

      if (result.error) {
        setError('El link expiró o ya fue usado. Solicitá uno nuevo.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Ocurrió un error inesperado. Intentá de nuevo.');
    } finally {
      setIsPending(false);
    }
  }

  // ── Éxito ──
  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4 py-6 text-center">
        <div className="rounded-full bg-emerald-500/10 p-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="font-display text-xl font-bold">
          ¡Contraseña actualizada!
        </h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Tu contraseña fue cambiada correctamente. Ya podés iniciar sesión.
        </p>
        <Link
          href="/login"
          className="bg-primary text-primary-foreground inline-block rounded-md px-6 py-2 text-sm font-medium"
        >
          Ir a iniciar sesión
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

      <div className="space-y-2">
        <Input
          label="Nueva contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          leftIcon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i < strength ? strengthColors[strength] : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              {strengthLabels[strength]}
            </p>
          </div>
        )}
      </div>

      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="Repetí tu contraseña"
        autoComplete="new-password"
        leftIcon={<ShieldCheck />}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
      />

      <Button type="submit" className="w-full" loading={isPending}>
        <CheckCircle2 className="h-4 w-4" />
        Guardar nueva contraseña
      </Button>
    </form>
  );
}
