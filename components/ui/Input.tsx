import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { beverageColors } from '@/lib/colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              error ? beverageColors.states.error.text : beverageColors.text.textPrimary
            )}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error
              ? `border-red-500 focus:ring-red-500 focus:border-red-500 ${beverageColors.states.error.bg}`
              : `border-[${beverageColors.primary.main}] bg-[${beverageColors.background.bgMain}] text-[${beverageColors.text.textPrimary}] focus:outline-none focus:ring-2 focus:ring-[${beverageColors.accent.main}] focus:border-[${beverageColors.accent.main}]`,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={cn('text-sm', beverageColors.states.error.text)}>{error}</p>
        )}
        {helperText && !error && (
          <p className={cn('text-sm', beverageColors.text.textMuted)}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
