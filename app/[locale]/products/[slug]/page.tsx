'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createSlug } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles } from '@/lib/colors';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, Info, Package, Image as ImageIcon, Layers, Plus } from 'lucide-react';
import { Product, Variant } from '@/types';
import { VariantAttributesTable } from '@/components/ui/VariantAttributesTable';
import { VariantModal } from '@/components/ui/VariantModal';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProductDetail();
    }
  }, [slug]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);

      // First, fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
      }

      // Then fetch all products
      const { data: allProducts, error: productsError } = await supabase
        .from('product')
        .select('*');

      if (productsError) throw productsError;

      // Find the product that matches the slug
      const matchingProduct = allProducts?.find(product =>
        createSlug(product.name) === slug
      );

      if (!matchingProduct) {
        throw new Error('Product not found');
      }

      // Add category information manually
      const productWithCategory = {
        ...matchingProduct,
        categories: matchingProduct.categories_id && categoriesData
          ? categoriesData.find(cat => cat.id === matchingProduct.categories_id)
          : null
      };

      setProduct(productWithCategory);

      // Fetch variants for this product
      const { data: variantsData, error: variantsError } = await supabase
        .from('variant')
        .select('*')
        .eq('product_id', matchingProduct.id)
        .order('Beverage_Option');

      if (variantsError) {
        console.error('Variants error:', variantsError);
      } else {
        setVariants(variantsData || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Variant
  const handleAddVariant = () => {
    setEditingVariant(null);
    setIsModalOpen(true);
  };

  // Handle Edit Variant
  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
  };

  // Handle Delete Variant
  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm(locale === 'vi' ? 'Bạn có chắc chắn muốn xóa variant này?' : 'Are you sure you want to delete this variant?')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('variant')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      // Update local state
      setVariants(prev => prev.filter(v => v.id !== variantId));

      setError('');
    } catch (error) {
      console.error('Error deleting variant:', error);
      setError(locale === 'vi' ? 'Lỗi khi xóa variant' : 'Error deleting variant');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Variant (Add/Edit)
  const handleSaveVariant = async (variantData: Partial<Variant>) => {
    if (!product) return;

    setActionLoading(true);
    try {
      if (editingVariant) {
        // Update existing variant
        const { data, error } = await supabase
          .from('variant')
          .update(variantData)
          .eq('id', editingVariant.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setVariants(prev => prev.map(v => v.id === editingVariant.id ? data : v));
      } else {
        // Add new variant
        const { data, error } = await supabase
          .from('variant')
          .insert({
            ...variantData,
            product_id: product.id
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setVariants(prev => [...prev, data]);
      }

      setError('');
      setIsModalOpen(false);
      setEditingVariant(null);
    } catch (error) {
      console.error('Error saving variant:', error);
      setError(locale === 'vi' ? 'Lỗi khi lưu variant' : 'Error saving variant');
    } finally {
      setActionLoading(false);
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

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {locale === 'vi'
              ? 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'
              : 'The product you are looking for does not exist or has been deleted.'}
          </p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'vi' ? 'Quay lại danh sách sản phẩm' : 'Back to products'}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Hero Section with Warm Gradient Background */}
      <div className={`relative ${beverageColors.gradients.warm} rounded-xl p-6 mb-6 overflow-hidden ${beverageColors.shadows.lg}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#A0522D]/5 to-[#D2691E]/5"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/products')}
                className={`${getButtonStyles('outline')} ${beverageColors.shadows.sm} hover:${beverageColors.shadows.md}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'vi' ? 'Quay lại' : 'Back'}
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${beverageColors.text.textPrimary}`}>
                  {locale === 'vi' ? 'Chi tiết sản phẩm' : 'Product Details'}
                </h1>
                <p className={`${beverageColors.text.textSecondary} text-sm mt-1`}>
                  {locale === 'vi' ? 'Thông tin chi tiết sản phẩm' : 'Detailed product information'}
                </p>
              </div>
            </div>
            <div>
              <span className={`${getBadgeStyles('success')} ${beverageColors.shadows.sm}`}>
                {locale === 'vi' ? 'Hoạt động' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {error && (
          <Alert variant="error" className={`${beverageColors.states.error.bg} ${beverageColors.text.textWhite} ${beverageColors.shadows.md} rounded-lg`}>
            {error}
          </Alert>
        )}

        {/* Product Information */}
        <div className={`${getCardStyles('primary')} overflow-hidden`}>
          <div className={`${beverageColors.primary.gradient} text-white p-4 flex items-center`}>
            <div className={`p-2 ${beverageColors.background.bgMain}/20 rounded-lg mr-3`}>
              <Info className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">
              {locale === 'vi' ? 'Thông tin sản phẩm' : 'Product Information'}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Image */}
              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className={`w-full aspect-square max-w-xs mx-auto ${beverageColors.gradients.soft} rounded-xl overflow-hidden flex items-center justify-center ${beverageColors.shadows.md} group-hover:${beverageColors.shadows.lg} transition-all duration-300 border-2 ${beverageColors.secondary.border}`}>
                    {product.link_image ? (
                      <img
                        src={product.link_image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`flex flex-col items-center justify-center ${beverageColors.text.textMuted} ${product.link_image ? 'hidden' : ''}`}>
                      <div className={`p-3 ${beverageColors.secondary.bgDark} rounded-full mb-3`}>
                        <ImageIcon className="h-12 w-12" />
                      </div>
                      <span className="text-sm font-medium">
                        {locale === 'vi' ? 'Không có hình ảnh' : 'No image available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-2 space-y-3">
                {/* Product Name */}
                <div className="pb-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t('products.productName')}
                  </label>
                  <h2 className={`text-xl font-bold ${beverageColors.text.textPrimary} mt-1`}>{product.name}</h2>
                </div>

                {/* Category - Highlighted */}
                <div className="pb-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t('common.category')}
                  </label>
                  <div className="mt-2">
                    {product.categories?.name_cat ? (
                      <span className={`${getBadgeStyles('accent')}`}>
                        {product.categories.name_cat}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        {locale === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.descriptions && (
                  <div className="pb-3 border-b border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {t('common.description')}
                    </label>
                    <p className={`${beverageColors.text.textPrimary} leading-relaxed whitespace-pre-wrap text-sm mt-2`}>
                      {product.descriptions}
                    </p>
                  </div>
                )}

                {/* Image Link */}
                {product.link_image && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {locale === 'vi' ? 'Link hình ảnh' : 'Image URL'}
                    </label>
                    <a
                      href={product.link_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${beverageColors.accent.text} hover:${beverageColors.primary.text} break-all text-sm hover:underline transition-colors duration-200 mt-2 block`}
                    >
                      {product.link_image}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Variants & Attributes */}
        <div className={`${getCardStyles('secondary')} overflow-hidden`}>
          <div className={`${beverageColors.accent.gradient} text-white p-4 flex items-center justify-between`}>
            <div className="flex items-center">
              <div className={`p-2 ${beverageColors.background.bgMain}/20 rounded-lg mr-3`}>
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {locale === 'vi' ? 'Thông tin các biến thể sản phẩm' : 'Product variation information'}
                </h2>
                <p className={`${beverageColors.text.textWhite}/80 text-sm mt-1`}>
                  {locale === 'vi'
                    ? `Tổng cộng ${variants.length} biến thể với đầy đủ thông tin dinh dưỡng`
                    : `Total ${variants.length} variants with complete nutritional information`}
                </p>
              </div>
            </div>
            <button
              onClick={handleAddVariant}
              disabled={actionLoading}
              className={`px-4 py-2 ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} rounded-lg font-medium transition-all duration-200 flex items-center hover:${beverageColors.secondary.bgDark} ${beverageColors.shadows.sm} hover:${beverageColors.shadows.md}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              {locale === 'vi' ? 'Thêm biến thể' : 'Add Variant'}
            </button>
          </div>
          <div className="p-6">
            {variants.length > 0 ? (
              <div className={`overflow-x-auto ${beverageColors.gradients.soft} rounded-lg p-4 ${beverageColors.shadows.sm}`}>
                <VariantAttributesTable
                  variants={variants}
                  locale={locale}
                  onEditVariant={handleEditVariant}
                  onDeleteVariant={handleDeleteVariant}
                />
              </div>
            ) : (
              <div className={`text-center py-12 ${beverageColors.gradients.soft} rounded-xl border-2 border-dashed ${beverageColors.accent.border}/30`}>
                <div className={`p-4 ${beverageColors.accent.bgLight} rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <Layers className={`h-8 w-8 ${beverageColors.accent.text}`} />
                </div>
                <h3 className={`text-lg font-bold ${beverageColors.text.textPrimary} mb-2`}>
                  {locale === 'vi' ? 'Chưa có biến thể' : 'No variants available'}
                </h3>
                <p className={`${beverageColors.text.textSecondary} max-w-md mx-auto text-sm`}>
                  {locale === 'vi'
                    ? 'Sản phẩm này chưa có biến thể nào được tạo. Sử dụng nút "Thêm Variant" ở trên để bắt đầu!'
                    : 'This product does not have any variants created yet. Use the "Add Variant" button above to get started!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      <VariantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVariant(null);
        }}
        onSave={handleSaveVariant}
        variant={editingVariant}
        locale={locale}
      />
    </DashboardLayout>
  );
}