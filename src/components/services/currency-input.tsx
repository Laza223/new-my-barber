/**
 * CurrencyInput — Input de moneda ARS optimizado para mobile.
 * Muestra formato "$X.XXX" al blur, número limpio al focus.
 * Internamente el value es en centavos (integer).
 */
'use client';

import { cn, formatCurrency, parseCurrencyInput } from '@/lib/utils';
import * as React from 'react';

interface CurrencyInputProps {
  value: number; // centavos
  onChange: (cents: number) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  error,
  className,
  placeholder = '$0',
}: CurrencyInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [display, setDisplay] = React.useState(
    value > 0 ? String(value / 100) : '',
  );

  // Sync from parent
  React.useEffect(() => {
    if (!focused) {
      setDisplay(value > 0 ? String(value / 100) : '');
    }
  }, [value, focused]);

  function handleFocus() {
    setFocused(true);
    setDisplay(value > 0 ? String(value / 100) : '');
  }

  function handleBlur() {
    setFocused(false);
    const cents = parseCurrencyInput(display);
    onChange(cents);
    setDisplay(cents > 0 ? String(cents / 100) : '');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and comma/dot
    const raw = e.target.value.replace(/[^0-9.,]/g, '');
    setDisplay(raw);
  }

  const formattedDisplay =
    !focused && value > 0 ? formatCurrency(value) : display;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        {!focused && value === 0 && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
            $
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={formattedDisplay}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            'placeholder:text-muted-foreground',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input',
          )}
        />
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
