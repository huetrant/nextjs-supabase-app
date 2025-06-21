import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { getBadgeColors } from '@/lib/colors';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  // Sử dụng màu sắc từ file colors.ts tập trung
  const variantClasses = getBadgeColors(variant);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border',
        variantClasses,
        className
      )}
      {...props}
    />
  );
}

export { Badge };