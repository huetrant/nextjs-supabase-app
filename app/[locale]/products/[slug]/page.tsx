'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createSlug } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
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
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles } from '@/lib/colors';

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
        <div className={`min-h-screen ${beverageColors.gradients.warm} p-6`}>
          <div className={`${getCardStyles('primary')} p-12`}>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className={`p-4 rounded-full ${beverageColors.primary.gradient} ${beverageColors.shadows.lg}`}>
                <Package className={`h-12 w-12 ${beverageColors.text.textWhite} animate-pulse`} />
              </div>
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${beverageColors.text.textPrimary} mb-2`}>
                  {locale === 'vi' ? 'Chi tiết sản phẩm' : 'Product Details'}
                </h2>
                <p className={`${beverageColors.text.textMuted} mb-4`}>
                  {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
                </p>
                <LoadingSpinner size="lg" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen ${beverageColors.gradients.warm} p-6`}>
          <div className={`${getCardStyles('primary')} text-center py-12`}>
            <div className={`mx-auto w-24 h-24 ${beverageColors.background.bgMuted} rounded-full flex items-center justify-center mb-4`}>
              <Package className={`h-12 w-12 ${beverageColors.text.textMuted}`} />
            </div>
            <h2 className={`text-xl font-semibold ${beverageColors.text.textPrimary} mb-2`}>
              {locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found'}
            </h2>
            <p className={`${beverageColors.text.textMuted} mb-6`}>
              {locale === 'vi'
                ? 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'
                : 'The product you are looking for does not exist or has been deleted.'}
            </p>
            <Button
              onClick={() => router.push('/products')}
              className={getButtonStyles('primary')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === 'vi' ? 'Quay lại danh sách sản phẩm' : 'Back to products'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${beverageColors.gradients.warm} p-6 space-y-6`}>
        {/* Header Section */}
        <div className={`${getCardStyles('primary')} p-4 md:p-6 animate-slideIn`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/products')}
                className={`${getButtonStyles('outline')} px-4 py-2`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'vi' ? 'Quay lại' : 'Back'}
              </Button>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${beverageColors.secondary.gradient} ${beverageColors.shadows.md}`}>
                  <Package className={`h-8 w-8 ${beverageColors.text.textWhite}`} />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                    {locale === 'vi' ? 'Chi tiết sản phẩm' : 'Product Details'}
                  </h1>
                  <p className={`${beverageColors.text.textSecondary} mt-1`}>
                    {locale === 'vi' ? 'Thông tin chi tiết sản phẩm' : 'Detailed product information'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Badge className={getBadgeStyles('success')}>
                {locale === 'vi' ? 'Hoạt động' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`${beverageColors.states.error.bg} ${beverageColors.text.textWhite} p-4 rounded-xl ${beverageColors.shadows.md}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Information */}
        <Card className={`${getCardStyles('primary')} animate-fadeIn`} style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${beverageColors.accent.gradient}`}>
                <Info className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
              </div>
              <div>
                <CardTitle className={`text-xl ${beverageColors.text.textPrimary}`}>
                  {locale === 'vi' ? 'Thông tin sản phẩm' : 'Product Information'}
                </CardTitle>
                <CardDescription className={beverageColors.text.textMuted}>
                  {locale === 'vi' ? 'Chi tiết thông tin sản phẩm' : 'Detailed product information'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Image */}
              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className={`w-full aspect-square max-w-xs mx-auto ${beverageColors.background.bgSecondary} rounded-lg overflow-hidden flex items-center justify-center ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg} transition-all duration-300 border border-[#D2B48C]`}>
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
                      <div className={`p-3 ${beverageColors.background.bgMuted} rounded-full mb-3`}>
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
              <div className="lg:col-span-2 space-y-4">
                {/* Product Name */}
                <div className="pb-3 border-b border-[#D2B48C]/30">
                  <label className={`text-xs font-medium ${beverageColors.text.textMuted} uppercase tracking-wide`}>
                    {t('products.productName')}
                  </label>
                  <h2 className={`text-xl font-bold ${beverageColors.text.textPrimary} mt-1`}>{product.name}</h2>
                </div>

                {/* Category - Highlighted */}
                <div className="pb-3 border-b border-[#D2B48C]/30">
                  <label className={`text-xs font-medium ${beverageColors.text.textMuted} uppercase tracking-wide`}>
                    {t('common.category')}
                  </label>
                  <div className="mt-2">
                    {product.categories?.name_cat ? (
                      <Badge className={getBadgeStyles('secondary')}>
                        {product.categories.name_cat}
                      </Badge>
                    ) : (
                      <span className={`${beverageColors.text.textMuted} italic text-sm`}>
                        {locale === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.descriptions && (
                  <div className="pb-3 border-b border-[#D2B48C]/30">
                    <label className={`text-xs font-medium ${beverageColors.text.textMuted} uppercase tracking-wide`}>
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
                    <label className={`text-xs font-medium ${beverageColors.text.textMuted} uppercase tracking-wide`}>
                      {locale === 'vi' ? 'Link hình ảnh' : 'Image URL'}
                    </label>
                    <a
                      href={product.link_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${beverageColors.secondary.text} hover:${beverageColors.accent.text} break-all text-sm hover:underline transition-colors duration-200 mt-2 block`}
                    >
                      {product.link_image}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Product Variants & Attributes */}
        <Card className={`${getCardStyles('primary')} animate-scaleIn`} style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${beverageColors.highlight.gradient}`}>
                  <Layers className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                </div>
                <div>
                  <CardTitle className={`text-xl ${beverageColors.text.textPrimary}`}>
                    {locale === 'vi' ? 'Thông tin các biến thể sản phẩm' : 'Product variation information'}
                  </CardTitle>
                  <CardDescription className={`${beverageColors.text.textMuted} text-sm mt-1`}>
                    {locale === 'vi'
                      ? `Tổng cộng ${variants.length} biến thể với đầy đủ thông tin dinh dưỡng`
                      : `Total ${variants.length} variants with complete nutritional information`}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getBadgeStyles('primary')}>
                  {variants.length} {locale === 'vi' ? 'biến thể' : 'variants'}
                </Badge>
                <Button
                  onClick={handleAddVariant}
                  disabled={actionLoading}
                  className={`${getButtonStyles('primary')} px-4 py-2 hover:scale-105 transition-all duration-200`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {locale === 'vi' ? 'Thêm biến thể' : 'Add Variant'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {variants.length > 0 ? (
              <div className={`overflow-x-auto ${beverageColors.background.bgSecondary} rounded-lg p-4 border border-[#D2B48C]/30`}>
                <VariantAttributesTable
                  variants={variants}
                  locale={locale}
                  onEditVariant={handleEditVariant}
                  onDeleteVariant={handleDeleteVariant}
                />
              </div>
            ) : (
              <div className={`text-center py-12 ${beverageColors.background.bgSecondary} rounded-lg border-2 border-dashed border-[#D2B48C]/50`}>
                <div className={`p-4 ${beverageColors.highlight.bgLight} rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <Layers className={`h-8 w-8 ${beverageColors.secondary.text}`} />
                </div>
                <h3 className={`text-lg font-bold ${beverageColors.text.textPrimary} mb-2`}>
                  {locale === 'vi' ? 'Chưa có biến thể' : 'No variants available'}
                </h3>
                <p className={`${beverageColors.text.textMuted} max-w-md mx-auto text-sm mb-6`}>
                  {locale === 'vi'
                    ? 'Sản phẩm này chưa có biến thể nào được tạo. Sử dụng nút "Thêm Variant" ở trên để bắt đầu!'
                    : 'This product does not have any variants created yet. Use the "Add Variant" button above to get started!'}
                </p>
                <Button
                  onClick={handleAddVariant}
                  className={getButtonStyles('primary')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {locale === 'vi' ? 'Thêm biến thể' : 'Add Variant'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
      </div>
    </DashboardLayout>
  );
}