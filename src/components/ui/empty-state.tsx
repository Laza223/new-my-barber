/**
 * EmptyState — Componente para cuando no hay datos.
 * Muestra icono, título, descripción y botón de acción opcional.
 */
import { cn } from '@/lib/utils';
import * as React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="bg-muted text-muted-foreground mb-4 rounded-full p-4 [&_svg]:size-8">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { EmptyStateProps };
