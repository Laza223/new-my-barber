/**
 * Toast — Wrapper de Sonner configurado con los colores del tema.
 * Posición: bottom-right en desktop, top-center en mobile.
 *
 * Uso:
 * import { toast } from 'sonner';
 * toast.success('Venta registrada');
 * toast.error('No se pudo guardar');
 */
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster que se adapta a desktop/mobile.
 * Ya está incluido en el root layout, NO duplicar.
 */
function Toaster() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <SonnerToaster
      position={isMobile ? 'top-center' : 'bottom-right'}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'bg-card text-card-foreground border-border shadow-lg',
          title: 'font-semibold',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          success: 'border-emerald-500/30',
          error: 'border-destructive/30',
          warning: 'border-amber-500/30',
        },
      }}
    />
  );
}

export { Toaster };
