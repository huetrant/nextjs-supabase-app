'use client';

import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Tags
} from 'lucide-react';
import { beverageColors } from '@/lib/colors';

const getNavigation = (t: (key: string) => string) => [
  { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
  { name: t('nav.products'), href: '/products', icon: Package },
  { name: t('nav.orders'), href: '/orders', icon: ShoppingCart },
  { name: t('nav.customers'), href: '/customers', icon: Users },
  { name: t('nav.stores'), href: '/stores', icon: Store },
  { name: t('nav.categories'), href: '/categories', icon: Tags },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const navigation = getNavigation(t);

  return (
    <div className={cn(`flex flex-col w-64 ${beverageColors.background.bgMain} backdrop-blur-sm border-r ${beverageColors.primary.border} shadow-lg`, className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? `${beverageColors.primary.gradient} text-white shadow-md`
                    : `${beverageColors.text.textSecondary} hover:${beverageColors.background.bgMuted} hover:${beverageColors.text.textPrimary} hover:shadow-sm`
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-white' : `${beverageColors.text.textMuted} group-hover:${beverageColors.text.textPrimary}`
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}