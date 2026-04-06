/**
 * LoginForm — Formulario de inicio de sesión.
 * Uses Better-Auth client-side signIn so cookies are properly set.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/analytics';
import { loginSchema, type LoginSchema } from '@/lib/validations/auth';
import { signIn } from '@/server/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    setIsPending(true);
    setServerError(null);

    try {
      // Use client-side signIn so the browser receives Set-Cookie headers
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setServerError('Email o contraseña incorrectos');
      } else {
        trackEvent({ name: 'login', properties: { method: 'email' } });
        toast.success('¡Bienvenido!');
        // Redirect to dashboard (middleware will handle onboarding check)
        router.push('/inicio');
        router.refresh();
      }
    } catch {
      setServerError('Ocurrió un error inesperado');
    } finally {
      setIsPending(false);
    }
  }

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
        label="Email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        leftIcon={<Mail />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        leftIcon={<Lock />}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-primary text-xs transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" className="w-full" loading={isPending}>
        <LogIn className="h-4 w-4" />
        Iniciar sesión
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        ¿No tenés cuenta?{' '}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Registrate
        </Link>
      </p>
    </form>
  );
}
