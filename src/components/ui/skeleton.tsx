/**
 * Skeleton — Placeholder con shimmer animation.
 */
import { cn } from '@/lib/utils';
import * as React from 'react';

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('skeleton', className)} {...props} />
));
Skeleton.displayName = 'Skeleton';

export { Skeleton };
