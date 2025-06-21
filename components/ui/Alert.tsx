import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { getAlertColors } from '@/lib/colors';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  // Sử dụng màu sắc từ file colors.ts tập trung
  const colorConfig = getAlertColors(variant);

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle
  };

  const Icon = icons[variant];

  return (
    <div className={cn('border-2 rounded-lg p-4 shadow-sm', colorConfig.container, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', colorConfig.iconColor)} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-semibold mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm font-medium">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}