'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { beverageColors } from '@/lib/colors';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms delay
  };

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg
          ${beverageColors.background.bgSecondary} 
          ${beverageColors.text.textSecondary}
          hover:${beverageColors.accent.bg}
          hover:${beverageColors.text.textPrimary}
          transition-all duration-200
          ${beverageColors.shadows.sm}
        `}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === locale)?.flag}
        </span>
        <span className="hidden sm:inline text-sm">
          {languages.find(lang => lang.code === locale)?.name}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`
            absolute right-0 top-full mt-1 w-48 
            ${beverageColors.background.bgMain}
            ${beverageColors.shadows.lg}
            rounded-lg border ${beverageColors.primary.border}
            transition-all duration-200 z-50
          `}
        >
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 text-left
                  hover:${beverageColors.background.bgSecondary}
                  transition-colors duration-150
                  ${locale === lang.code
                    ? `${beverageColors.background.bgSecondary} ${beverageColors.text.textPrimary}`
                    : beverageColors.text.textSecondary
                  }
                `}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {locale === lang.code && (
                  <div className={`ml-auto w-2 h-2 rounded-full ${beverageColors.secondary.bg}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}