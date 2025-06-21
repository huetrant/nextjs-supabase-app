'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { User } from '@supabase/supabase-js';
import { beverageColors } from '@/lib/colors';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={`${beverageColors.background.bgMain} backdrop-blur-sm shadow-lg border-b ${beverageColors.primary.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className={`text-xl font-bold ${beverageColors.primary.gradient} bg-clip-text text-transparent`}>
              Store Management
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {user && (
              <>
                <Link href="/dashboard" className={`${beverageColors.text.textSecondary} hover:${beverageColors.text.textPrimary}`}>
                  {t('nav.dashboard')}
                </Link>
                <Link href="/products" className={`${beverageColors.text.textSecondary} hover:${beverageColors.text.textPrimary}`}>
                  {t('nav.products')}
                </Link>
                <Link href="/orders" className={`${beverageColors.text.textSecondary} hover:${beverageColors.text.textPrimary}`}>
                  {t('nav.orders')}
                </Link>
                <Link href="/customers" className={`${beverageColors.text.textSecondary} hover:${beverageColors.text.textPrimary}`}>
                  {t('nav.customers')}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {loading ? (
              <div className={`${beverageColors.background.bgMuted} h-8 w-20 rounded animate-pulse`}></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className={`${beverageColors.text.textSecondary} text-sm`}>
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    {t('auth.login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    {t('auth.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}