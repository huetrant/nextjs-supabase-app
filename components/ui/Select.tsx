import React from 'react';
import { getSelectStyles } from '@/lib/colors';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  variant?: 'primary' | 'secondary' | 'accent';
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  variant = 'primary',
  error,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  const selectId = React.useId();

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[#3E2C1C] mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0522D] z-10">
            {icon}
          </div>
        )}

        <select
          id={selectId}
          className={`
            ${getSelectStyles(variant)} 
            beverage-select 
            ${icon ? 'pl-10' : ''} 
            ${error ? 'border-[#CD5C5C] focus:ring-[#CD5C5C]' : ''} 
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-[#CD5C5C] mt-1">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-[#A0522D] mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;