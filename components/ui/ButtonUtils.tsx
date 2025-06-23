// Import hooks từ thư mục hooks
import { ButtonLoadingState, ConfirmationState } from '@/hooks';

// Utility functions cho button styling
export const ButtonUtils = {
  // Tạo class names cho button dựa trên props
  getButtonClasses: (props: {
    variant?: string;
    size?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }) => {
    const classes = [];
    
    if (props.fullWidth) classes.push('w-full');
    if (props.disabled) classes.push('opacity-50 cursor-not-allowed');
    if (props.loading) classes.push('cursor-wait');
    
    return classes.join(' ');
  },

  // Tạo icon size dựa trên button size
  getIconSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    switch (size) {
      case 'xs': return 'h-3 w-3';
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-4 w-4';
      case 'lg': return 'h-5 w-5';
      case 'xl': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  },

  // Tạo spacing cho icon
  getIconSpacing: (position: 'left' | 'right' = 'left') => {
    return position === 'left' ? 'mr-2' : 'ml-2';
  }
};

// Constants cho button configuration
export const ButtonConfig = {
  // Default props cho các loại button
  defaults: {
    primary: { variant: 'primary' as const, size: 'md' as const },
    secondary: { variant: 'secondary' as const, size: 'md' as const },
    danger: { variant: 'danger' as const, size: 'sm' as const },
    success: { variant: 'success' as const, size: 'md' as const },
  },

  // Animation classes
  animations: {
    hover: 'hover:-translate-y-0.5 hover:shadow-lg',
    press: 'active:translate-y-0 active:shadow-md',
    scale: 'hover:scale-105 active:scale-95',
    fade: 'transition-opacity hover:opacity-90',
  },

  // Common button combinations
  combinations: {
    formSave: {
      variant: 'success' as const,
      size: 'md' as const,
      className: 'min-w-[100px]'
    },
    formCancel: {
      variant: 'outline' as const,
      size: 'md' as const,
      className: 'min-w-[100px]'
    },
    tableAction: {
      size: 'sm' as const,
      className: 'p-2'
    },
    headerAction: {
      variant: 'primary' as const,
      size: 'lg' as const,
      className: 'px-6 py-3'
    }
  }
};

// Export types
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Helper function để merge button props
export const mergeButtonProps = (
  defaultProps: Record<string, any>,
  userProps: Record<string, any>
) => {
  return {
    ...defaultProps,
    ...userProps,
    className: [defaultProps.className, userProps.className].filter(Boolean).join(' ')
  };
};