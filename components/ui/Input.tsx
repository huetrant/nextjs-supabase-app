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
            'flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error
              ? 'border-[#CD5C5C] focus:ring-[#CD5C5C] focus:border-[#CD5C5C] bg-red-50 placeholder:text-red-400'
              : 'border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60',
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
