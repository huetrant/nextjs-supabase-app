import React from 'react';
import { Filter } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { cn } from '@/lib/utils';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = 'Filter...',
  className,
  icon = <Filter className="h-4 w-4" />,
  ...props
}: FilterSelectProps) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      icon={icon}
      placeholder={placeholder}
      options={options}
      className={cn('min-w-[200px]', className)}
      {...props}
    />
  );
}