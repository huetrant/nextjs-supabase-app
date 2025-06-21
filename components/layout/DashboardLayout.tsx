'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}


import { beverageColors } from '@/lib/colors';

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen ${beverageColors.gradients.warm}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 p-8 ${beverageColors.gradients.soft}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
