'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Button, ActionButtons, IconButtons } from '@/components/ui';
import { VariantAttributesTable } from '@/components/ui/VariantAttributesTable';
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  User,
  Store,
  Package,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  UserCircle,
  Hash,
  Users,
  Clock,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import { Order, OrderDetail, Product, Variant } from '@/types';
import { beverageColors, getCardStyles, getBadgeStyles } from '@/lib/colors';

const statusColors = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error'
} as const;

export default function OrderDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const locale = params.locale as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<any>(null);

  // Form states
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
      fetchProducts();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);

      // Fetch order with customer and store info
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, order_date, total_amount, customer_id, store_id')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      if (orderData) {
        // Fetch customer info
        let customerData = null;
        if (orderData.customer_id) {
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('id, name, location, sex, age, picture, username')
            .eq('id', orderData.customer_id)
            .single();

          if (!customerError) {
            customerData = customer;
          }
        }

        // Fetch store info
        let storeData = null;
        if (orderData.store_id) {
          const { data: store, error: storeError } = await supabase
            .from('store')
            .select('id, name_store, address, phone, open_close')
            .eq('id', orderData.store_id)
            .single();

          if (!storeError) {
            storeData = store;
          }
        }

        // Fetch order details
        const { data: orderDetails, error: detailsError } = await supabase
          .from('order_detail')
          .select('id, order_id, variant_id, quantity, rate, unit_price')
          .eq('order_id', orderId);

        if (detailsError) throw detailsError;

        // Fetch product and variant details for each order detail
        const enrichedOrderDetails: OrderDetail[] = [];
        if (orderDetails) {
          for (const detail of orderDetails) {
            // Fetch variant details (order_detail references variant directly)
            let variant: Variant | undefined = undefined;
            let product: Product | undefined = undefined;
            if (detail.variant_id) {
              const { data: variantData, error: variantError } = await supabase
                .from('variant')
                .select('id, Beverage_Option, calories, dietary_fibre_g, sugars_g, protein_g, "vitamin_a_%", "vitamin_c_%", caffeine_mg, price, sales_rank, product_id')
                .eq('id', detail.variant_id)
                .single();

              if (!variantError && variantData) {
                variant = variantData;

                // Fetch product details from variant's product_id
                if (variant.product_id) {
                  const { data: productData, error: productError } = await supabase
                    .from('product')
                    .select('id, name, descriptions, link_image, categories_id')
                    .eq('id', variant.product_id)
                    .single();

                  if (!productError && productData) {
                    product = productData;
                  }
                }
              }
            }

            enrichedOrderDetails.push({
              ...detail,
              products: product,
              variants: variant
            });
          }
        }

        // Combine all data
        const orderWithDetails = {
          ...orderData,
          customers: customerData || undefined,
          store: storeData || undefined,
          order_details: enrichedOrderDetails
        };

        setOrder(orderWithDetails);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleRowClick = (detailId: string) => {
    setExpandedRow(expandedRow === detailId ? null : detailId);
  };

  const handleEditOrderDetail = async (detailId: string) => {
    const detail = order?.order_details?.find(d => d.id === detailId);
    if (!detail) return;

    setEditingDetail(detail);
    setSelectedProductId(detail.variants?.product_id || '');
    setSelectedVariantId(detail.variant_id || '');
    setQuantity(detail.quantity);
    setUnitPrice(detail.unit_price);

    // Fetch variants for the product
    if (detail.variants?.product_id) {
      await fetchVariantsByProduct(detail.variants.product_id);
    }

    setShowEditModal(true);
  };

  const handleSaveEditOrderDetail = async () => {
    if (!editingDetail || !selectedVariantId || quantity <= 0) {
      alert(t('orders.validationError'));
      return;
    }

    try {
      const { error } = await supabase
        .from('order_detail')
        .update({
          variant_id: selectedVariantId,
          quantity: quantity,
          unit_price: unitPrice
        })
        .eq('id', editingDetail.id);

      if (error) throw error;

      // Update order total and refresh data
      await updateOrderTotal();
      await fetchOrderDetail();
      setShowEditModal(false);
      setEditingDetail(null);
      resetForm();
      alert(t('orders.updateSuccess'));
    } catch (error) {
      console.error('Error updating order detail:', error);
      alert(t('orders.updateError'));
    }
  };

  const handleDeleteOrderDetail = async (detailId: string) => {
    if (confirm(t('orders.deleteConfirmItem'))) {
      try {
        const { error } = await supabase
          .from('order_detail')
          .delete()
          .eq('id', detailId);

        if (error) throw error;

        // Update order total and refresh data
        await updateOrderTotal();
        await fetchOrderDetail();
        alert(t('orders.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting order detail:', error);
        alert(t('orders.deleteError'));
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: productsData, error } = await supabase
        .from('product')
        .select('id, name, descriptions, link_image, categories_id')
        .order('name');

      if (error) throw error;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchVariantsByProduct = async (productId: string) => {
    try {
      const { data: variantsData, error } = await supabase
        .from('variant')
        .select('id, Beverage_Option, calories, dietary_fibre_g, sugars_g, protein_g, "vitamin_a_%", "vitamin_c_%", caffeine_mg, price, sales_rank, product_id')
        .eq('product_id', productId)
        .order('Beverage_Option');

      if (error) throw error;
      setVariants(variantsData || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
  };

  const resetForm = () => {
    setSelectedProductId('');
    setSelectedVariantId('');
    setQuantity(1);
    setUnitPrice(0);
    setVariants([]);
  };

  const handleProductChange = async (productId: string) => {
    setSelectedProductId(productId);
    setSelectedVariantId('');
    setUnitPrice(0);
    if (productId) {
      await fetchVariantsByProduct(productId);
    } else {
      setVariants([]);
    }
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const selectedVariant = variants.find(v => v.id === variantId);
    if (selectedVariant) {
      setUnitPrice(selectedVariant.price || 0);
    }
  };

  const handleAddOrderDetail = () => {
    resetForm();
    setShowAddModal(true);
  };

  const updateOrderTotal = async () => {
    try {
      // Calculate new total from order details
      const { data: orderDetails, error } = await supabase
        .from('order_detail')
        .select('quantity, unit_price')
        .eq('order_id', orderId);

      if (error) throw error;

      const newTotal = orderDetails?.reduce((sum, detail) =>
        sum + (detail.quantity * detail.unit_price), 0) || 0;

      // Update order total
      await supabase
        .from('orders')
        .update({ total_amount: newTotal })
        .eq('id', orderId);

    } catch (error) {
      console.error('Error updating order total:', error);
    }
  };

  const handleSaveNewOrderDetail = async () => {
    if (!selectedVariantId || quantity <= 0) {
      alert(t('orders.validationError'));
      return;
    }

    try {
      const { error } = await supabase
        .from('order_detail')
        .insert({
          order_id: orderId,
          variant_id: selectedVariantId,
          quantity: quantity,
          unit_price: unitPrice,
          rate: 5 // Default rate
        });

      if (error) throw error;

      // Update order total and refresh data
      await updateOrderTotal();
      await fetchOrderDetail();
      setShowAddModal(false);
      resetForm();
      alert(t('orders.addSuccess'));
    } catch (error) {
      console.error('Error adding order detail:', error);
      alert(t('orders.addError'));
    }
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

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="error">
            {error || t('orders.orderNotFound')}
          </Alert>
          <ActionButtons.Back
            onClick={() => router.back()}
            className="mt-4"
          >
            {t('orders.backToOrders')}
          </ActionButtons.Back>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${beverageColors.gradients.warm} p-6 space-y-6`}>
        {/* Header */}
        <div className={`${getCardStyles('primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ActionButtons.Back
                onClick={() => router.back()}
                size="sm"
              >
                {t('orders.backToOrders')}
              </ActionButtons.Back>
              <div>
                <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary} flex items-center`}>
                  <ShoppingCart className={`h-8 w-8 mr-3 ${beverageColors.secondary.text}`} />
                  {t('orders.orderDetail')}
                </h1>
                <p className={`${beverageColors.text.textSecondary} mt-2`}>
                  {t('orders.orderDetailSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`${getBadgeStyles('primary')} text-lg px-4 py-2`}>
                {t('nav.orders')}
              </div>
            </div>
          </div>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className={`${getCardStyles('primary')} p-6`}>
            <div className="flex items-center mb-4">
              <Package className={`h-6 w-6 mr-3 ${beverageColors.secondary.text}`} />
              <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                {t('orders.orderInfo')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>{t('orders.totalItems')}:</span>
                </div>
                <span className={`font-semibold ${beverageColors.text.textPrimary}`}>
                  {order.order_details?.reduce((total, detail) => total + detail.quantity, 0) || 0} {t('orders.items')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>{t('orders.orderDate')}:</span>
                </div>
                <span className={`font-semibold ${beverageColors.text.textPrimary}`}>
                  {formatDate(order.order_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>{t('orders.totalAmount')}:</span>
                </div>
                <span className={`font-bold text-xl ${beverageColors.secondary.text}`}>
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className={`${getCardStyles('secondary')} p-6`}>
            <div className="flex items-center mb-4">
              <User className={`h-6 w-6 mr-3 ${beverageColors.accent.text}`} />
              <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                {t('orders.customerInfo')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <UserCircle className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                <span className={`${beverageColors.text.textPrimary} font-semibold`}>
                  {order.customers?.name || 'N/A'}
                </span>
              </div>

              {order.customers?.username && (
                <div className="flex items-center">
                  <User className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    @{order.customers.username}
                  </span>
                </div>
              )}
              {order.customers?.sex && (
                <div className="flex items-center">
                  <UserCircle className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {t('orders.gender')}: {order.customers.sex}
                  </span>
                </div>
              )}
              {order.customers?.age && (
                <div className="flex items-center">
                  <Clock className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {t('orders.age')}: {order.customers.age}
                  </span>
                </div>
              )}
              {order.customers?.location && (
                <div className="flex items-center">
                  <MapPin className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {order.customers.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Store Info */}
          <div className={`${getCardStyles('accent')} p-6`}>
            <div className="flex items-center mb-4">
              <Store className={`h-6 w-6 mr-3 ${beverageColors.highlight.text}`} />
              <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                {t('orders.storeInfo')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Store className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                <span className={`${beverageColors.text.textPrimary} font-semibold`}>
                  {order.store?.name_store || 'N/A'}
                </span>
              </div>
              {order.store?.address && (
                <div className="flex items-center">
                  <MapPin className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {order.store.address}
                  </span>
                </div>
              )}
              {order.store?.phone && (
                <div className="flex items-center">
                  <Phone className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {order.store.phone}
                  </span>
                </div>
              )}
              {order.store?.open_close && (
                <div className="flex items-center">
                  <Store className={`h-4 w-4 mr-2 ${beverageColors.text.textMuted}`} />
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {t('orders.openHours')}: {order.store.open_close}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className={`${getCardStyles('primary')} overflow-hidden`}>
          <div className={`${beverageColors.secondary.gradient} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${beverageColors.text.textWhite} flex items-center`}>
                  <Package className="h-6 w-6 mr-3" />
                  {t('orders.orderItems')}
                </h2>
                <p className={`${beverageColors.text.textWhite} opacity-90 mt-1`}>
                  {t('orders.orderItemsSubtitle')}
                </p>
              </div>
              <ActionButtons.Add
                onClick={handleAddOrderDetail}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              >
                {t('orders.addProduct')}
              </ActionButtons.Add>
            </div>
          </div>

          <div className={`${beverageColors.background.bgMain} p-6`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={`${beverageColors.background.bgSecondary} border-b-2 ${beverageColors.primary.border}`}>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.product')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.variant')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.quantity')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.unitPrice')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.calories')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.protein')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.caffeine')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold`}>{t('orders.subtotal')}</TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-bold text-center`}>{t('orders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_details?.map((detail, index) => (
                    <React.Fragment key={detail.id}>
                      <TableRow
                        className={`hover:${beverageColors.background.bgMuted} transition-all duration-200 cursor-pointer ${expandedRow === detail.id ? `${beverageColors.highlight.bgLight} border-l-4 ${beverageColors.highlight.border}` : ''
                          }`}
                        onClick={() => handleRowClick(detail.id)}
                      >
                        <TableCell>
                          <div className="flex items-center justify-between">
                            <div className={`font-semibold ${beverageColors.text.textPrimary}`}>
                              {detail.products?.name || 'N/A'}
                            </div>
                            <div className={`ml-2 transition-transform duration-200 ${expandedRow === detail.id ? 'rotate-180' : ''}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${beverageColors.text.textPrimary}`}>
                            {detail.variants?.Beverage_Option || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${beverageColors.text.textPrimary} text-center`}>
                            {detail.quantity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${beverageColors.text.textPrimary}`}>
                            {formatCurrency(detail.unit_price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-center ${beverageColors.text.textSecondary}`}>
                            {detail.variants?.calories || 0} cal
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-center ${beverageColors.text.textSecondary}`}>
                            {detail.variants?.protein_g || 0}g
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-center ${beverageColors.text.textSecondary}`}>
                            {detail.variants?.caffeine_mg || 0}mg
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-bold ${beverageColors.secondary.text}`}>
                            {formatCurrency(detail.quantity * detail.unit_price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <IconButtons.Edit
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrderDetail(detail.id);
                              }}
                            />
                            <IconButtons.Delete
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrderDetail(detail.id);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Nutrition Details */}
                      {expandedRow === detail.id && detail.variants && (
                        <TableRow className={`${beverageColors.background.bgMuted} border-l-4 ${beverageColors.highlight.border}`}>
                          <TableCell colSpan={9} className="p-0">
                            <div className="p-4 animate-in slide-in-from-top-2 duration-300">
                              <div className={`${getCardStyles('accent')} p-4`}>
                                <h5 className={`text-md font-semibold ${beverageColors.text.textPrimary} mb-3 flex items-center`}>
                                  <Package className="h-4 w-4 mr-2" />
                                  {t('orders.nutritionInfo')}
                                </h5>
                                <VariantAttributesTable
                                  variants={[detail.variants]}
                                  locale={locale}
                                  showPrice={false}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex justify-end">
                <div className={`${getCardStyles('secondary')} p-4 min-w-[300px]`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                      {t('common.total')}:
                    </span>
                    <span className={`text-2xl font-bold ${beverageColors.secondary.text}`}>
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Order Detail Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${getCardStyles('primary')} p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary} mb-4`}>
              {t('orders.addProduct')}
            </h3>

            <div className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.selectProduct')}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">-- {t('orders.selectProduct')} --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant Selection */}
              {variants.length > 0 && (
                <div>
                  <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                    {t('orders.selectVariant')}
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => handleVariantChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  >
                    <option value="">-- {t('orders.selectVariant')} --</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.Beverage_Option} - {formatCurrency(variant.price || 0)}
                      </option>
                    ))}
                  </select>

                  {/* Variant Details Table */}
                  {selectedVariantId && (
                    <div className={`mt-3 p-4 ${beverageColors.background.bgSecondary} rounded-lg border`}>
                      <h4 className={`text-sm font-semibold ${beverageColors.text.textPrimary} mb-3 flex items-center`}>
                        <Package className="h-4 w-4 mr-2" />
                        {t('orders.nutritionInfo')}
                      </h4>
                      {(() => {
                        const selectedVariant = variants.find(v => v.id === selectedVariantId);
                        if (!selectedVariant) return null;

                        return (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.calories')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant.calories || 0} cal
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.protein')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant.protein_g || 0}g
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.dietaryFiber')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant.dietary_fibre_g || 0}g
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.sugars')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant.sugars_g || 0}g
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.caffeine')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant.caffeine_mg || 0}mg
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.vitaminA')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant['vitamin_a_%'] || 0}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${beverageColors.text.textMuted}`}>{t('orders.vitaminC')}:</span>
                                <span className={`font-medium ${beverageColors.text.textPrimary}`}>
                                  {selectedVariant['vitamin_c_%'] || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.enterQuantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.unitPrice')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <ActionButtons.Cancel
                onClick={() => setShowAddModal(false)}
              >
                {t('common.cancel')}
              </ActionButtons.Cancel>
              <ActionButtons.Save
                onClick={handleSaveNewOrderDetail}
              >
                {t('common.save')}
              </ActionButtons.Save>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Detail Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${getCardStyles('primary')} p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary} mb-4`}>
              {t('orders.editItem')}
            </h3>

            <div className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.selectProduct')}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">-- {t('orders.selectProduct')} --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant Selection */}
              {variants.length > 0 && (
                <div>
                  <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                    {t('orders.selectVariant')}
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => handleVariantChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  >
                    <option value="">-- {t('orders.selectVariant')} --</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.Beverage_Option} - {formatCurrency(variant.price || 0)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.enterQuantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className={`block text-sm font-medium ${beverageColors.text.textSecondary} mb-2`}>
                  {t('orders.unitPrice')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 border rounded-lg ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <ActionButtons.Cancel
                onClick={() => setShowEditModal(false)}
              >
                {t('common.cancel')}
              </ActionButtons.Cancel>
              <ActionButtons.Update
                onClick={handleSaveEditOrderDetail}
              >
                {t('common.update')}
              </ActionButtons.Update>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}