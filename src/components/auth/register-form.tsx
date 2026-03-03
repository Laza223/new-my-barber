/**
 * RegisterForm — Formulario de registro.
 * React Hook Form + Zod. Password strength indicator.
 * Post-registro exitoso muestra pantalla de verificación.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth';
import { registerAction } from '@/server/actions/auth.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Lock,
  Mail,
  MailCheck,
  ShieldCheck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

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

export function RegisterForm() {
  const [isPending, setIsPending] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(
    null,
  );
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const password = watch('password', '');
  const strength = getPasswordStrength(password);

  async function onSubmit(data: RegisterSchema) {
    if (!acceptedTerms) return;

    setIsPending(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await registerAction(formData);

      if (result.success) {
        setRegisteredEmail(result.data.email);
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError('Ocurrió un error inesperado');
    } finally {
      setIsPending(false);
    }
  }

  // ── Pantalla de verificación post-registro ──
  if (registeredEmail) {
    return (
      <div className="flex flex-col items-center space-y-4 py-6 text-center">
        <div className="bg-primary/10 rounded-full p-4">
          <MailCheck className="text-primary h-10 w-10" />
        </div>
        <h2 className="font-display text-xl font-bold">¡Verificá tu email!</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          Te enviamos un link de verificación a{' '}
          <strong className="text-foreground">{registeredEmail}</strong>. Revisá
          tu bandeja de entrada y spam.
        </p>
        <Link
          href="/login"
          className="text-primary text-sm font-medium hover:underline"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  // ── Formulario de registro ──
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div
          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Nombre"
        placeholder="Tu nombre completo"
        autoComplete="name"
        leftIcon={<User />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        leftIcon={<Mail />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-2">
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          leftIcon={<Lock />}
          error={errors.password?.message}
          {...register('password')}
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
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className="flex items-start space-x-2 pt-1">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(c) => setAcceptedTerms(c === true)}
        />
        <label
          htmlFor="terms"
          className="text-muted-foreground text-xs leading-tight"
        >
          Acepto los{' '}
          <Link href="/terms" className="text-primary hover:underline">
            términos y condiciones
          </Link>{' '}
          y la{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            política de privacidad
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isPending}
        disabled={!acceptedTerms}
      >
        <CheckCircle2 className="h-4 w-4" />
        Crear cuenta
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        ¿Ya tenés cuenta?{' '}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
