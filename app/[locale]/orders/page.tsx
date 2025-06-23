'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Button, ActionButtons, IconButtons } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { Pagination, usePagination } from '@/components/ui/Pagination';
import { ShoppingCart, Search, Calendar, User, Store, TrendingUp, Plus, Edit, Trash2, Eye, DollarSign, AlertCircle, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Order } from '@/types';
import { beverageColors, getCardStyles, getBadgeStyles } from '@/lib/colors';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const statusColors = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error'
} as const;

export default function OrdersPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<string>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // First, let's try to fetch orders without relationships to see if the basic query works
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (ordersError) throw ordersError;

      // If we have orders, try to fetch related data separately
      if (ordersData && ordersData.length > 0) {
        // Get unique customer IDs and store IDs
        const customerIds = [...new Set(ordersData.map(order => order.customer_id).filter(Boolean))];
        const storeIds = [...new Set(ordersData.map(order => order.store_id).filter(Boolean))];

        // Fetch customers and stores separately
        const [customersResult, storesResult] = await Promise.all([
          customerIds.length > 0 ? supabase
            .from('customers')
            .select('id, name, location')
            .in('id', customerIds) : { data: [], error: null },
          storeIds.length > 0 ? supabase
            .from('store')
            .select('id, name_store, address')
            .in('id', storeIds) : { data: [], error: null }
        ]);

        // Create lookup maps
        const customersMap = new Map(customersResult.data?.map(c => [c.id, c]) || []);
        const storesMap = new Map(storesResult.data?.map(s => [s.id, s]) || []);

        // Combine the data
        const ordersWithRelations = ordersData.map(order => ({
          ...order,
          customers: order.customer_id ? customersMap.get(order.customer_id) : null,
          store: order.store_id ? storesMap.get(order.store_id) : null
        }));

        setOrders(ordersWithRelations);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 opacity-100" />
    ) : (
      <ChevronDown className="h-4 w-4 opacity-100" />
    );
  };

  const sortedAndFilteredOrders = orders
    .filter(order =>
      order.id.toString().includes(searchTerm) ||
      order.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customers?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.store?.name_store?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'order_date':
          aValue = new Date(a.order_date);
          bValue = new Date(b.order_date);
          break;
        case 'customer':
          aValue = a.customers?.name || '';
          bValue = b.customers?.name || '';
          break;
        case 'customer_location':
          aValue = a.customers?.location || '';
          bValue = b.customers?.location || '';
          break;
        case 'store':
          aValue = a.store?.name_store || '';
          bValue = b.store?.name_store || '';
          break;
        case 'total_amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status || 'pending';
          bValue = b.status || 'pending';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Sử dụng pagination hook với 10 items per page
  const {
    currentPage,
    totalPages,
    currentData: paginatedOrders,
    goToPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(sortedAndFilteredOrders, 10);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    const stats = sortedAndFilteredOrders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([status, count]) => ({
      status,
      count,
      label: t(`status.${status}`)
    }));
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/${locale}/orders/${orderId}`);
  };

  const handleEditOrder = (orderId: string) => {
    router.push(`/${locale}/orders/${orderId}/edit`);
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      // Delete order items first
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderToDelete.id);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderToDelete.id);

      if (orderError) throw orderError;

      // Refresh the orders list
      await fetchOrders();
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(t('error.deleteData'));
    }
  };

  const handleAddOrder = () => {
    router.push(`/${locale}/orders/new`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${beverageColors.gradients.warm} p-6 space-y-8`}>
        {/* Header Section with Enhanced Styling */}
        <div className={`${getCardStyles('primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary} flex items-center`}>
                <ShoppingCart className={`h-8 w-8 mr-3 ${beverageColors.secondary.text}`} />
                {t('orders.title')}
              </h1>
              <p className={`${beverageColors.text.textSecondary} mt-2 text-lg`}>
                {t('orders.subtitle')}
              </p>
            </div>
            <ActionButtons.Add
              onClick={handleAddOrder}
              className={`${beverageColors.shadows.md} hover:scale-105 transition-transform duration-200`}
            >
              {t('orders.addOrder')}
            </ActionButtons.Add>
          </div>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${getCardStyles('primary')} p-6 transform hover:scale-105 transition-transform duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${beverageColors.text.textSecondary} text-sm font-medium uppercase tracking-wide`}>
                  {t('orders.totalOrders')}
                </p>
                <p className={`${beverageColors.text.textPrimary} text-3xl font-bold mt-2`}>
                  {sortedAndFilteredOrders.length}
                </p>
              </div>
              <div className={`${beverageColors.primary.gradient} p-3 rounded-full ${beverageColors.shadows.md}`}>
                <ShoppingCart className={`h-6 w-6 ${beverageColors.text.textWhite}`} />
              </div>
            </div>
          </div>

          {getStatusStats().slice(0, 3).map((stat, index) => {
            const cardVariants = ['secondary', 'accent', 'soft'] as const;
            const gradientVariants = [beverageColors.secondary.gradient, beverageColors.accent.gradient, beverageColors.highlight.gradient];

            return (
              <div key={stat.status} className={`${getCardStyles(cardVariants[index % 3])} p-6 transform hover:scale-105 transition-transform duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${beverageColors.text.textSecondary} text-sm font-medium uppercase tracking-wide`}>
                      {stat.label}
                    </p>
                    <p className={`${beverageColors.text.textPrimary} text-3xl font-bold mt-2`}>
                      {stat.count}
                    </p>
                  </div>
                  <div className={`${gradientVariants[index % 3]} p-3 rounded-full ${beverageColors.shadows.md}`}>
                    <span className={`${getBadgeStyles(statusColors[stat.status as keyof typeof statusColors] as any)} text-lg font-bold`}>
                      {stat.count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Orders Table */}
        <div className={`${getCardStyles('primary')} overflow-hidden`}>
          <div className={`${beverageColors.secondary.gradient} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${beverageColors.text.textWhite} flex items-center`}>
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  {t('orders.orderList')}
                </h2>
                <p className={`${beverageColors.text.textWhite} opacity-90 mt-1`}>
                  {t('common.total')} {totalItems} orders ({startIndex}-{endIndex} of {totalItems})
                </p>
              </div>
              <div className="relative">
                <Search className={`h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${beverageColors.text.textMuted}`} />
                <Input
                  placeholder={t('orders.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-72 pl-10 ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-2 ${beverageColors.primary.border} focus:${beverageColors.secondary.border} ${beverageColors.shadows.md}`}
                />
              </div>
            </div>
          </div>

          <div className={`${beverageColors.background.bgMain} p-6`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={`${beverageColors.background.bgSecondary} border-b-2 ${beverageColors.primary.border}`}>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('id')}
                      title="Click để sắp xếp theo ID"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <TrendingUp className="h-4 w-4" />
                        </span>
                        <span>STT</span>
                        {getSortIcon('id')}
                      </div>
                    </TableHead>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('order_date')}
                      title="Click để sắp xếp theo ngày đặt hàng"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <Calendar className="h-4 w-4" />
                        </span>
                        <span>{t('common.date')}</span>
                        {getSortIcon('order_date')}
                      </div>
                    </TableHead>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('customer')}
                      title="Click để sắp xếp theo tên khách hàng"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <User className="h-4 w-4" />
                        </span>
                        <span>{t('orders.customer')}</span>
                        {getSortIcon('customer')}
                      </div>
                    </TableHead>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('store')}
                      title="Click để sắp xếp theo tên cửa hàng"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <Store className="h-4 w-4" />
                        </span>
                        <span>{t('common.store')}</span>
                        {getSortIcon('store')}
                      </div>
                    </TableHead>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('total_amount')}
                      title="Click để sắp xếp theo tổng tiền"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <span>{t('orders.totalAmount')}</span>
                        {getSortIcon('total_amount')}
                      </div>
                    </TableHead>
                    <TableHead
                      className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide cursor-pointer hover:bg-opacity-10 hover:${beverageColors.primary.bg} transition-colors duration-200`}
                      onClick={() => handleSort('status')}
                      title="Click để sắp xếp theo trạng thái"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <AlertCircle className="h-4 w-4" />
                        </span>
                        <span>{t('common.status')}</span>
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold text-sm uppercase tracking-wide`}>
                      <div className="flex items-center gap-2">
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                          <Settings className="h-4 w-4" />
                        </span>
                        <span>{t('common.actions')}</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className={`hover:${beverageColors.background.bgSecondary} transition-colors duration-200 ${index % 2 === 0 ? beverageColors.background.bgMain : beverageColors.background.bgSecondary
                        }`}
                    >
                      <TableCell className={`font-bold ${beverageColors.text.textPrimary}`}>
                        <span className={`${beverageColors.secondary.gradient} ${beverageColors.text.textWhite} px-3 py-1 rounded-full text-sm`}>
                          {startIndex + index}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`${beverageColors.text.textSecondary} font-medium`}>
                          {formatDate(order.order_date)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className={`font-semibold ${beverageColors.text.textPrimary}`}>
                            {order.customers?.name || 'N/A'}
                          </div>
                          <div className={`text-sm ${beverageColors.text.textMuted}`}>
                            {order.customers?.location || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${beverageColors.text.textSecondary}`}>
                          {order.store?.name_store || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${beverageColors.text.textPrimary}`}>
                          {order.total_amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`${getBadgeStyles(statusColors[(order.status || 'pending') as keyof typeof statusColors] as any)} ${beverageColors.shadows.sm}`}>
                          {t(`status.${order.status || 'pending'}`)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-start space-x-2">
                          <IconButtons.View
                            onClick={() => handleViewOrder(order.id)}
                            size="sm"
                          />
                          <IconButtons.Edit
                            onClick={() => handleEditOrder(order.id)}
                            size="sm"
                          />
                          <IconButtons.Delete
                            onClick={() => handleDeleteOrder(order)}
                            size="sm"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="mt-6 px-6 pb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  className={`${beverageColors.background.bgMain} p-4 rounded-lg ${beverageColors.shadows.md}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Xác nhận xóa đơn hàng"
        >
          <div className="space-y-4">
            <p className={`${beverageColors.text.textSecondary}`}>
              Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
            </p>
            {orderToDelete && (
              <div className={`${getCardStyles('soft')} p-4`}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${beverageColors.text.textSecondary}`}>Mã đơn hàng:</span>
                    <span className={`font-semibold ${beverageColors.text.textPrimary}`}>
                      {orderToDelete.id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${beverageColors.text.textSecondary}`}>Khách hàng:</span>
                    <span className={`font-semibold ${beverageColors.text.textPrimary}`}>
                      {orderToDelete.customers?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${beverageColors.text.textSecondary}`}>Tổng tiền:</span>
                    <span className={`font-bold ${beverageColors.secondary.text}`}>
                      ${orderToDelete.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <ActionButtons.Cancel
                onClick={() => setDeleteModalOpen(false)}
              >
                {t('common.cancel')}
              </ActionButtons.Cancel>
              <ActionButtons.Delete
                onClick={confirmDeleteOrder}
              >
                {t('common.delete')}
              </ActionButtons.Delete>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}