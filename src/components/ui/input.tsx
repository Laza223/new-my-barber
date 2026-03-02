/**
 * Input — Campo de texto con label, error, iconos y variante currency.
 * La variante "currency" formatea como ARS ($X.XXX) al blur.
 */
'use client';

import { cn, formatCurrency, parseCurrencyInput } from '@/lib/utils';
import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Activa formateo ARS al blur. El value interno es en centavos. */
  currency?: boolean;
  onValueChange?: (centavos: number) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      leftIcon,
      rightIcon,
      currency,
      onValueChange,
      onBlur,
      onFocus,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? React.useId();
    const errorId = error ? `${inputId}-error` : undefined;

    const [displayValue, setDisplayValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    // Currency: formatear al inicializar si hay defaultValue
    React.useEffect(() => {
      if (currency && props.defaultValue) {
        const cents = Number(props.defaultValue);
        if (!isNaN(cents) && cents > 0) {
          setDisplayValue(formatCurrency(cents));
        }
      }
    }, [currency, props.defaultValue]);

    const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Al focus, mostrar el número limpio sin formatear
      if (currency) {
        const cents = parseCurrencyInput(displayValue);
        if (cents > 0) {
          setDisplayValue((cents / 100).toString());
        }
      }
      onFocus?.(e);
    };

    const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (currency) {
        const cents = parseCurrencyInput(e.target.value);
        setDisplayValue(cents > 0 ? formatCurrency(cents) : '');
        onValueChange?.(cents);
      }
      onBlur?.(e);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currency) {
        setDisplayValue(e.target.value);
      }
    };

    const currencyProps = currency
      ? {
          value: displayValue,
          onChange: handleCurrencyChange,
          onFocus: handleCurrencyFocus,
          onBlur: handleCurrencyBlur,
          inputMode: 'decimal' as const,
          placeholder: props.placeholder ?? '$0',
        }
      : { onBlur, onFocus };

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-4">
              {leftIcon}
            </div>
          )}
          <input
            type={currency ? 'text' : type}
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={cn(
              'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-destructive focus-visible:ring-destructive',
              className,
            )}
            {...currencyProps}
            {...props}
          />
          {rightIcon && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-destructive text-xs" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
