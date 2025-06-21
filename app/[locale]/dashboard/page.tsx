'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Package,
  ShoppingCart,
  Users,
  Store,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const t = useTranslations();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalStores: 0,
    totalCategories: 0,
    totalVariants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: productsCount },
        { count: ordersCount },
        { count: customersCount },
        { count: storesCount },
        { count: categoriesCount },
        { count: variantsCount },
      ] = await Promise.all([
        supabase.from('product').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('store').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('variant').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalCustomers: customersCount || 0,
        totalStores: storesCount || 0,
        totalCategories: categoriesCount || 0,
        totalVariants: variantsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.totalProducts'),
      value: stats.totalProducts,
      description: t('dashboard.totalProducts'),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.totalOrders'),
      value: stats.totalOrders,
      description: t('dashboard.totalOrders'),
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.totalCustomers'),
      value: stats.totalCustomers,
      description: t('dashboard.totalCustomers'),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.totalStores'),
      value: stats.totalStores,
      description: t('dashboard.totalStores'),
      icon: Store,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('dashboard.totalCategories'),
      value: stats.totalCategories,
      description: t('dashboard.totalCategories'),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: t('dashboard.totalVariants'),
      value: stats.totalVariants,
      description: t('dashboard.totalVariants'),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.systemInformation')}</CardTitle>
              <CardDescription>
                {t('dashboard.databaseTablesStatus')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('categories.title')}</span>
                <Badge variant="success">{stats.totalCategories} records</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('customers.title')}</span>
                <Badge variant="success">{stats.totalCustomers} records</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('orders.title')}</span>
                <Badge variant="success">{stats.totalOrders} records</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('products.title')}</span>
                <Badge variant="success">{stats.totalProducts} records</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('stores.title')}</span>
                <Badge variant="success">{stats.totalStores} records</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('variants.title')}</span>
                <Badge variant="success">{stats.totalVariants} records</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
              <CardDescription>
                {t('dashboard.latestSystemActivities')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('dashboard.systemInitialized')}</p>
                    <p className="text-xs text-gray-500">{t('dashboard.justNow')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('dashboard.dataLoaded')}</p>
                    <p className="text-xs text-gray-500">{t('dashboard.justNow')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('dashboard.dashboardReady')}</p>
                    <p className="text-xs text-gray-500">{t('dashboard.justNow')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}