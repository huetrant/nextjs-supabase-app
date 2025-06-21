import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { beverageColors } from '@/lib/colors';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg'
    };

    // Đồng bộ màu sắc ấm từ beverageColors
    const variantClasses = (() => {
      switch (variant) {
        case 'primary':
          return `${beverageColors.primary.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg}`;
        case 'secondary':
          return `${beverageColors.secondary.bg} ${beverageColors.text.textPrimary} ${beverageColors.shadows.sm} ${beverageColors.secondary.hover}`;
        case 'accent':
          return `${beverageColors.accent.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg}`;
        case 'outline':
          return `${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} ${beverageColors.primary.border} border-2 hover:${beverageColors.secondary.bgDark}`;
        case 'danger':
          return `${beverageColors.states.error.bg} ${beverageColors.text.textWhite} hover:bg-[#B22222] ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg}`;
        case 'ghost':
          return `${beverageColors.text.textMuted} hover:${beverageColors.background.bgSecondary}`;
        default:
          return `${beverageColors.primary.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md}`;
      }
    })();

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses,
          sizes[size],
          'shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
