/**
 * Avatar — Basado en Radix UI con fallback de iniciales.
 * Borde de color configurable (para profesionales en gráficos).
 */
'use client';

import { cn, getInitials } from '@/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    /** Color del borde (hex). Útil para diferenciar profesionales. */
    borderColor?: string;
  }
>(({ className, borderColor, style, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      borderColor && 'ring-2',
      className,
    )}
    style={{
      ...style,
      ...(borderColor
        ? ({ '--tw-ring-color': borderColor } as React.CSSProperties)
        : {}),
    }}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    /** Nombre completo para generar iniciales automáticamente */
    name?: string;
  }
>(({ className, name, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'bg-muted flex h-full w-full items-center justify-center rounded-full text-sm font-medium',
      className,
    )}
    {...props}
  >
    {children ?? (name ? getInitials(name) : '?')}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
