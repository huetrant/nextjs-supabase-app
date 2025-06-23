'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createProductSlug } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button, Actions, Icons, Groups, useButtonLoading, useConfirmation, SearchInput, FilterSelect } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Pagination, usePagination } from '@/components/ui/Pagination';
import { Plus, Edit, Trash2, Package, Eye, Image as ImageIcon, Filter, SortAsc, Settings } from 'lucide-react';
import { Product, Category } from '@/types';
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles } from '@/lib/colors';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  // Sử dụng custom hooks
  const { loading: saveLoading, withLoading } = useButtonLoading();
  const { confirmAsync } = useConfirmation();
  const t = useTranslations();
  const locale = useLocale();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    descriptions: '',
    link_image: '',
    categories_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // First, try to fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
      }

      // Then fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('product')
        .select('*');

      if (productsError) throw productsError;

      // Manual join with categories
      const productsWithCategories = (productsData || []).map(product => ({
        ...product,
        categories: product.categories_id && categoriesData
          ? categoriesData.find(cat => cat.id === product.categories_id)
          : null
      }));

      setProducts(productsWithCategories);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    const slug = createProductSlug(product.name);
    router.push(`/products/${slug}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    await withLoading(async () => {
      try {
        const productData = {
          name: formData.name,
          descriptions: formData.descriptions || null,
          link_image: formData.link_image || null,
          categories_id: formData.categories_id || null,
        };

        if (editingProduct) {
          const { error } = await supabase
            .from('product')
            .update(productData)
            .eq('id', editingProduct.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('product')
            .insert([productData]);

          if (error) throw error;
        }

        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', descriptions: '', link_image: '', categories_id: '' });
        fetchData();
      } catch (error) {
        console.error('Error saving product:', error);
        setError(t('error.saveData'));
      }
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      descriptions: product.descriptions || '',
      link_image: product.link_image || '',
      categories_id: product.categories_id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await confirmAsync(
      t('products.deleteConfirm'),
      async () => {
        try {
          const { error } = await supabase
            .from('product')
            .delete()
            .eq('id', id);

          if (error) throw error;
          fetchData();
        } catch (error) {
          console.error('Error deleting product:', error);
          setError(t('error.deleteData'));
        }
      }
    );
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descriptions?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.categories_id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.categories?.name_cat?.toLowerCase() || '';
          bValue = b.categories?.name_cat?.toLowerCase() || '';
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    currentData: paginatedProducts,
    goToPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(filteredAndSortedProducts, 10);

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
                  {t('products.title')}
                </h2>
                <p className={`${beverageColors.text.textMuted} mb-4`}>
                  {t('common.loading')}
                </p>
                <LoadingSpinner size="lg" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${beverageColors.gradients.warm} p-6 space-y-6`}>
        {/* Header Section - Combined with Stats */}
        <div className={`${getCardStyles('primary')} p-4 md:p-6 animate-slideIn`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${beverageColors.secondary.gradient} ${beverageColors.shadows.md}`}>
                <Package className={`h-8 w-8 ${beverageColors.text.textWhite}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                  {t('products.title')}
                </h1>
                <p className={`${beverageColors.text.textSecondary} mt-1`}>
                  {t('products.subtitle')}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className={getBadgeStyles('secondary')}>
                    {t('common.total')}: {products.length}
                  </Badge>
                  <Badge className={getBadgeStyles('accent')}>
                    {locale === 'vi' ? 'Hiển thị' : 'Showing'} {startIndex}-{endIndex}
                  </Badge>
                </div>
              </div>
            </div>
            <Actions.Add
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="px-4 md:px-6 py-2 md:py-3 text-base md:text-lg hover:scale-105 transition-all duration-200"
            >
              <span className="hidden sm:inline">{t('products.addProduct')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </Actions.Add>
          </div>


        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="error"
            className={`animate-slideIn ${beverageColors.shadows.md}`}
          >
            {error}
          </Alert>
        )}

        {/* Main Products Card with Integrated Search and Filters */}
        <Card className={`${getCardStyles('primary')} animate-scaleIn overflow-hidden`} style={{ animationDelay: '400ms' }}>
          {/* Filters and Search */}
          <div className={`p-6 border-b border-[#D2B48C]/30 ${beverageColors.secondary.gradient}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                <CardTitle className={`text-xl ${beverageColors.text.textWhite}`}>
                  {t('products.productList')}
                </CardTitle>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1">
                  <SearchInput
                    placeholder={t('products.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <FilterSelect
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    placeholder={locale === 'vi' ? 'Tất cả danh mục' : 'All Categories'}
                    options={[
                      { value: '', label: locale === 'vi' ? 'Tất cả danh mục' : 'All Categories' },
                      ...categories.map((category) => ({
                        value: category.id,
                        label: category.name_cat
                      }))
                    ]}
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex items-center">
                  <CustomSelect
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(value) => {
                      const [field, order] = value.split('-');
                      setSortBy(field as 'name' | 'category' | 'created_at');
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="text-sm min-w-[140px]"
                    options={[
                      { value: 'name-asc', label: locale === 'vi' ? 'Tên A-Z' : 'Name A-Z' },
                      { value: 'name-desc', label: locale === 'vi' ? 'Tên Z-A' : 'Name Z-A' },
                      { value: 'category-asc', label: locale === 'vi' ? 'Danh mục A-Z' : 'Category A-Z' },
                      { value: 'category-desc', label: locale === 'vi' ? 'Danh mục Z-A' : 'Category Z-A' },
                      { value: 'created_at-desc', label: locale === 'vi' ? 'Mới nhất' : 'Newest' },
                      { value: 'created_at-asc', label: locale === 'vi' ? 'Cũ nhất' : 'Oldest' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className={`mx-auto w-24 h-24 ${beverageColors.background.bgMuted} rounded-full flex items-center justify-center mb-4`}>
                  <Package className={`h-12 w-12 ${beverageColors.text.textMuted}`} />
                </div>
                <h3 className={`text-lg font-medium ${beverageColors.text.textPrimary} mb-2`}>
                  {searchTerm || selectedCategory ? (locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'No products found') : (locale === 'vi' ? 'Chưa có sản phẩm' : 'No products yet')}
                </h3>
                <p className={`${beverageColors.text.textMuted} mb-6`}>
                  {searchTerm || selectedCategory ? (locale === 'vi' ? 'Thử thay đổi bộ lọc hoặc tìm kiếm khác' : 'Try changing your filters or search terms') : (locale === 'vi' ? 'Tạo sản phẩm đầu tiên của bạn' : 'Create your first product')}
                </p>
                {!searchTerm && !selectedCategory && (
                  <Actions.Add
                    onClick={() => setIsModalOpen(true)}
                    size="md"
                  >
                    {t('products.addProduct')}
                  </Actions.Add>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={`${beverageColors.background.bgSecondary} border-b border-[#D2B48C]`}>
                          <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6 w-20`}>
                            <div className="flex items-center gap-2">
                              <span className={`${beverageColors.accent.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                                <ImageIcon className="h-4 w-4" />
                              </span>
                              <span>{locale === 'vi' ? 'Hình ảnh' : 'Image'}</span>
                            </div>
                          </TableHead>
                          <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                            <div className="flex items-center gap-2">
                              <span className={`${beverageColors.accent.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                                <Package className="h-4 w-4" />
                              </span>
                              <span>{t('products.productName')}</span>
                            </div>
                          </TableHead>
                          <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                            <div className="flex items-center gap-2">
                              <span className={`${beverageColors.accent.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                                <Edit className="h-4 w-4" />
                              </span>
                              <span>{t('common.description')}</span>
                            </div>
                          </TableHead>
                          <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                            <div className="flex items-center gap-2">
                              <span className={`${beverageColors.accent.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                                <Filter className="h-4 w-4" />
                              </span>
                              <span>{t('common.category')}</span>
                            </div>
                          </TableHead>
                          <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6 text-right`}>
                            <div className="flex items-center gap-2">
                              <span className={`${beverageColors.accent.gradient} ${beverageColors.text.textWhite} p-2 rounded-full`}>
                                <Settings className="h-4 w-4" />
                              </span>
                              <span>{t('common.actions')}</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProducts.map((product, index) => (
                          <TableRow
                            key={product.id}
                            className={`
                            ${index % 2 === 0 ? beverageColors.background.bgMain : beverageColors.background.bgSecondary}
                            hover:${beverageColors.background.bgMuted} 
                            transition-all duration-300 ease-in-out
                            border-b border-[#EEE5DE]/50
                            hover:shadow-md hover:scale-[1.01]
                            animate-fadeIn group
                          `}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <TableCell className="py-4 px-6">
                              <div className={`w-16 h-16 ${beverageColors.background.bgSecondary} rounded-lg overflow-hidden flex items-center justify-center ${beverageColors.shadows.sm} hover:${beverageColors.shadows.md} transition-shadow duration-200 border border-[#D2B48C]/30`}>
                                {product.link_image ? (
                                  <img
                                    src={product.link_image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`flex items-center justify-center ${beverageColors.text.textMuted} ${product.link_image ? 'hidden' : ''}`}>
                                  <ImageIcon className="h-6 w-6" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <div className={`font-semibold ${beverageColors.text.textPrimary} group-hover:${beverageColors.secondary.text} transition-colors duration-200`}>
                                {product.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <div className={`max-w-xs truncate ${beverageColors.text.textSecondary}`}>
                                {product.descriptions || (
                                  <span className={`italic ${beverageColors.text.textMuted}`}>
                                    {locale === 'vi' ? 'Không có mô tả' : 'No description'}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              {product.categories?.name_cat ? (
                                <span className={`${beverageColors.text.textPrimary} font-medium text-sm`}>
                                  {product.categories.name_cat}
                                </span>
                              ) : (
                                <span className={`${beverageColors.text.textMuted} italic text-sm`}>
                                  {locale === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Groups.CrudActions
                                onView={() => handleViewProduct(product)}
                                onEdit={() => handleEdit(product)}
                                onDelete={() => handleDelete(product.id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                <div className={`px-6 py-4 border-t border-[#D2B48C]/30 ${beverageColors.background.bgSecondary}`}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    className="justify-center"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Product Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', descriptions: '', link_image: '', categories_id: '' });
          }}
          title={editingProduct ? t('products.editProduct') : t('products.addNewProduct')}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('products.productName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.description')}
              </label>
              <textarea
                value={formData.descriptions}
                onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200"
                rows={3}
                placeholder={locale === 'vi' ? 'Nhập mô tả sản phẩm...' : 'Enter product description...'}
              />
            </div>

            <Input
              label={locale === 'vi' ? 'Link hình ảnh' : 'Image URL'}
              type="url"
              value={formData.link_image}
              onChange={(e) => setFormData({ ...formData, link_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />

            {formData.link_image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'vi' ? 'Xem trước hình ảnh' : 'Image Preview'}
                </label>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                  <img
                    src={formData.link_image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            <CustomSelect
              label={t('common.category')}
              value={formData.categories_id}
              onChange={(value) => setFormData({ ...formData, categories_id: value })}
              className="rounded-lg"
              placeholder={t('products.selectCategory')}
              options={[
                { value: '', label: t('products.selectCategory') },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name_cat
                }))
              ]}
            />

            <Groups.FormActions
              onCancel={() => setIsModalOpen(false)}
              saveText={editingProduct ? t('common.update') : t('common.save')}
              cancelText={t('common.cancel')}
              saveVariant="primary"
              isSubmit={true}
              loading={saveLoading}
            />
          </form>
        </Modal>

        {/* Confirmation Modal for Delete */}
        <Modal
          isOpen={false} // This is a template for future implementation
          onClose={() => { }}
          title={locale === 'vi' ? "Xác nhận xóa sản phẩm" : "Confirm Product Deletion"}
        >
          <div className="space-y-4">
            <p className={`${beverageColors.text.textSecondary}`}>
              {locale === 'vi'
                ? "Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </p>
            <div className={`${getCardStyles('soft')} p-4 rounded-lg ${beverageColors.shadows.sm}`}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {locale === 'vi' ? 'Tên sản phẩm:' : 'Product Name:'}
                  </span>
                  <span className={`font-semibold ${beverageColors.text.textPrimary}`}>
                    Product Name
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${beverageColors.text.textSecondary}`}>
                    {locale === 'vi' ? 'Danh mục:' : 'Category:'}
                  </span>
                  <span className={`${getBadgeStyles('secondary')} font-medium`}>
                    Category Name
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Groups.FormActions
                onCancel={() => { }}
                onSave={() => { }}
                saveText={t('common.delete')}
                cancelText={t('common.cancel')}
                saveVariant="error"
                loading={false}
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}