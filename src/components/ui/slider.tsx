/**
 * Slider — Para porcentaje de comisión (0-100).
 * Muestra el valor actual arriba del thumb.
 */
'use client';

import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> {
  /** Muestra el valor actual arriba del thumb */
  showValue?: boolean;
  /** Sufijo del valor (default: "%") */
  valueSuffix?: string;
  label?: string;
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, showValue = true, valueSuffix = '%', label, id, ...props },
    ref,
  ) => {
    const sliderId = id ?? React.useId();
    const currentValue = props.value ?? props.defaultValue ?? [0];

    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm leading-none font-medium"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-primary text-sm font-semibold">
                {currentValue[0]}
                {valueSuffix}
              </span>
            )}
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          id={sliderId}
          className={cn(
            'relative flex w-full touch-none items-center select-none',
            className,
          )}
          {...props}
        >
          <SliderPrimitive.Track className="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
            <SliderPrimitive.Range className="bg-primary absolute h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      </div>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export type { SliderProps };
