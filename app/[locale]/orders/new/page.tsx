'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button, ActionButtons } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { VariantAttributesTable, formatCurrency, formatVariantDropdownLabel, VariantTableCell } from '@/components/ui';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Store,
  Package
} from 'lucide-react';
import { Customer, StoreData, Product, Variant } from '@/types';
import { beverageColors, getCardStyles, getBadgeStyles } from '@/lib/colors';

interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
  variant?: Variant;
}

export default function NewOrderPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [customersResult, storesResult, productsResult, variantsResult] = await Promise.all([
        supabase.from('customers').select('*').order('name'),
        supabase.from('store').select('*').order('name_store'),
        supabase.from('product').select('*').order('name'),
        supabase.from('variant').select('*')
      ]);

      if (customersResult.data) setCustomers(customersResult.data);
      if (storesResult.data) setStores(storesResult.data);
      if (productsResult.data) setProducts(productsResult.data);
      if (variantsResult.data) setVariants(variantsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const getProductVariants = (productId: string) => {
    return variants.filter(v => v.product_id === productId);
  };

  const addOrderItem = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    const variant = selectedVariant ? variants.find(v => v.id === selectedVariant) : undefined;

    if (!product) return;

    const unitPrice = variant?.price || 0;
    const totalPrice = unitPrice * quantity;

    const newItem: OrderItem = {
      product_id: selectedProduct,
      variant_id: selectedVariant || undefined,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      product,
      variant
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setSelectedVariant('');
    setQuantity(1);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = orderItems.map((item, i) => {
      if (i === index) {
        const totalPrice = item.unit_price * newQuantity;
        return { ...item, quantity: newQuantity, total_price: totalPrice };
      }
      return item;
    });

    setOrderItems(updatedItems);
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedStore || orderItems.length === 0) {
      setError('Vui lòng điền đầy đủ thông tin và thêm ít nhất một sản phẩm');
      return;
    }

    try {
      setLoading(true);

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: selectedCustomer,
          store_id: selectedStore,
          order_date: new Date().toISOString(),
          total_amount: getTotalAmount(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = orderItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      router.push(`/${locale}/orders`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError(t('error.saveData'));
    } finally {
      setLoading(false);
    }
  };



  if (loading && customers.length === 0) {
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
      <div className={`min-h-screen ${beverageColors.gradients.warm} p-6 space-y-6`}>
        {/* Header */}
        <div className={`${getCardStyles('primary')} p-6`}>
          <div className="flex items-center space-x-4">
            <ActionButtons.Back
              onClick={() => router.back()}
              size="sm"
            >
              {t('common.back')}
            </ActionButtons.Back>
            <div>
              <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary} flex items-center`}>
                <ShoppingCart className={`h-8 w-8 mr-3 ${beverageColors.secondary.text}`} />
                Tạo đơn hàng mới
              </h1>
              <p className={`${beverageColors.text.textSecondary} mt-2`}>
                Thêm đơn hàng mới vào hệ thống
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Selection */}
            <div className={`${getCardStyles('primary')} p-6`}>
              <div className="flex items-center mb-4">
                <User className={`h-6 w-6 mr-3 ${beverageColors.secondary.text}`} />
                <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                  Thông tin khách hàng
                </h3>
              </div>
              <CustomSelect
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                options={customers.map(customer => ({
                  value: customer.id,
                  label: `${customer.name} - ${customer.location || 'N/A'}`
                }))}
                placeholder="Chọn khách hàng"
                className="w-full"
              />
            </div>

            {/* Store Selection */}
            <div className={`${getCardStyles('primary')} p-6`}>
              <div className="flex items-center mb-4">
                <Store className={`h-6 w-6 mr-3 ${beverageColors.secondary.text}`} />
                <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                  Thông tin cửa hàng
                </h3>
              </div>
              <CustomSelect
                value={selectedStore}
                onChange={setSelectedStore}
                options={stores.map(store => ({
                  value: store.id,
                  label: `${store.name_store} - ${store.address || 'N/A'}`
                }))}
                placeholder="Chọn cửa hàng"
                className="w-full"
              />
            </div>
          </div>

          {/* Add Products */}
          <div className={`${getCardStyles('primary')} p-6`}>
            <div className="flex items-center mb-4">
              <Package className={`h-6 w-6 mr-3 ${beverageColors.secondary.text}`} />
              <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                Thêm sản phẩm
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <CustomSelect
                value={selectedProduct}
                onChange={(value) => {
                  setSelectedProduct(value);
                  setSelectedVariant('');
                }}
                options={products.map(product => ({
                  value: product.id,
                  label: product.name
                }))}
                placeholder="Chọn sản phẩm"
              />

              <CustomSelect
                value={selectedVariant}
                onChange={setSelectedVariant}
                options={getProductVariants(selectedProduct).map(variant => ({
                  value: variant.id,
                  label: formatVariantDropdownLabel(variant)
                }))}
                placeholder="Chọn biến thể"
                disabled={!selectedProduct}
              />

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                placeholder="Số lượng"
              />

              <ActionButtons.Add
                type="button"
                onClick={addOrderItem}
                disabled={!selectedProduct}
              >
                {t('common.add')}
              </ActionButtons.Add>
            </div>

            {/* Variant Details Preview */}
            {selectedVariant && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  Chi tiết dinh dưỡng biến thể được chọn
                </h4>
                <VariantAttributesTable
                  variants={variants.filter(v => v.id === selectedVariant)}
                  locale="vi"
                  showPrice={true}
                />
              </div>
            )}
          </div>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <div className={`${getCardStyles('primary')} overflow-hidden`}>
              <div className={`${beverageColors.secondary.gradient} p-6`}>
                <h3 className={`text-xl font-bold ${beverageColors.text.textWhite}`}>
                  Danh sách sản phẩm
                </h3>
              </div>

              <div className={`${beverageColors.background.bgMain} p-6`}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-semibold">
                            {item.product?.name}
                          </TableCell>
                          <TableCell>
                            <VariantTableCell variant={item.variant} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ActionButtons.Decrease
                                type="button"
                                size="sm"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              />
                              <span className="w-8 text-center">{item.quantity}</span>
                              <ActionButtons.Increase
                                type="button"
                                size="sm"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(item.total_price)}
                          </TableCell>
                          <TableCell>
                            <ActionButtons.Delete
                              type="button"
                              size="sm"
                              onClick={() => removeOrderItem(index)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-end">
                    <div className={`${getCardStyles('secondary')} p-4 min-w-[300px]`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                          Tổng cộng:
                        </span>
                        <span className={`text-2xl font-bold ${beverageColors.secondary.text}`}>
                          {formatCurrency(getTotalAmount())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <ActionButtons.Cancel
              type="button"
              onClick={() => router.back()}
            >
              {t('common.cancel')}
            </ActionButtons.Cancel>
            <ActionButtons.Create
              type="submit"
              disabled={loading || !selectedCustomer || !selectedStore || orderItems.length === 0}
            >
              {loading ? <LoadingSpinner size="sm" /> : t('orders.createOrder')}
            </ActionButtons.Create>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}