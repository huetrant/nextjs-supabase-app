import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getSelectStyles } from '@/lib/colors';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'primary' | 'secondary' | 'accent';
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  variant = 'primary',
  error,
  helperText,
  icon,
  className = '',
  placeholder = 'Select an option...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectId = React.useId();

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

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

      <div className="relative" ref={selectRef}>
        <div
          id={selectId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          className={`
            ${getSelectStyles(variant)} 
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-between
            ${icon ? 'pl-10' : ''} 
            ${error ? 'border-[#CD5C5C] focus:ring-[#CD5C5C]' : ''} 
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0522D] z-10">
              {icon}
            </div>
          )}

          <span className={selectedOption ? 'text-[#3E2C1C]' : 'text-[#A0522D]'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown
            className={`h-4 w-4 text-[#A0522D] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[#FFF8F0] border border-[#D2B48C] rounded-md shadow-lg max-h-60 overflow-auto">
            <ul role="listbox" className="py-1">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`
                    px-3 py-2 cursor-pointer transition-colors duration-150
                    ${option.value === value
                      ? 'bg-[#A0522D] text-[#FFF8F0] font-medium'
                      : highlightedIndex === index
                        ? 'bg-[#F4E1D2] text-[#A0522D]'
                        : 'bg-[#FFF8F0] text-[#3E2C1C] hover:bg-[#F4E1D2] hover:text-[#A0522D]'
                    }
                  `}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
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

export default CustomSelect;