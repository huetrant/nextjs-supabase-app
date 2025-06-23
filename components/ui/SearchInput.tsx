import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';
import { cn } from '@/lib/utils';
import { beverageColors } from '@/lib/colors';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onSearch?: () => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onSearch,
  autoFocus = false,
  ...props
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="relative flex-1">
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${beverageColors.text.textMuted}`}
      />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          `pl-10 w-full ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary}`,
          `border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D]`,
          `transition-all duration-200`,
          className
        )}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        {...props}
      />
    </div>
  );
}