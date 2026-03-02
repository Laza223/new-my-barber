/**
 * Textarea — Área de texto con label, error y contador de caracteres.
 */
import { cn } from '@/lib/utils';
import * as React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  /** Muestra contador de caracteres si se define maxLength */
  showCounter?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCounter, maxLength, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const [charCount, setCharCount] = React.useState(0);

    return (
      <div className="space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="text-sm leading-none font-medium"
            >
              {label}
            </label>
            {showCounter && maxLength && (
              <span
                className={cn(
                  'text-muted-foreground text-xs',
                  charCount > maxLength * 0.9 && 'text-destructive',
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={errorId}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
          }}
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-destructive text-xs" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
