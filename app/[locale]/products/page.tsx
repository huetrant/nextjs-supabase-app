'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createProductSlug } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Pagination, usePagination } from '@/components/ui/Pagination';
import { Plus, Search, Edit, Trash2, Package, Eye, Image as ImageIcon, Filter, SortAsc } from 'lucide-react';
import { Product, Category } from '@/types';
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles, getSelectStyles } from '@/lib/colors';

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
    if (!confirm(t('products.deleteConfirm'))) return;

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
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-[#3E2C1C] to-[#8B4513] bg-clip-text text-transparent`}>
              {t('products.title')}
            </h1>
            <p className={`${beverageColors.text.textMuted} mt-1`}>{t('products.subtitle')}</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={`${getButtonStyles('primary')} transform hover:scale-105`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('products.addProduct')}
          </Button>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <Card className={`${getCardStyles('primary')} border-0`}>
          <CardHeader className={`${beverageColors.gradients.primary} ${beverageColors.text.textWhite} rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-white">
                  <Package className="h-6 w-6 mr-3" />
                  {t('products.productList')}
                </CardTitle>
                <CardDescription className={`${beverageColors.text.textLight} mt-1 opacity-90`}>
                  {locale === 'vi' ? 'Hiển thị' : 'Showing'} {startIndex}-{endIndex} {locale === 'vi' ? 'của' : 'of'} {totalItems} {locale === 'vi' ? 'sản phẩm' : 'products'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Filters and Search */}
          <div className={`p-6 border-b border-[#EEE5DE] ${beverageColors.background.bgSecondary}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${beverageColors.text.textMuted}`} />
                  <Input
                    placeholder={t('products.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${beverageColors.background.bgMain} border-[#D2B48C] focus:border-[#A0522D] focus:ring-[#A0522D]`}
                  />
                </div>

                {/* Category Filter */}
                <div className="min-w-[200px]">
                  <CustomSelect
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    variant="primary"
                    icon={<Filter className="h-4 w-4" />}
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
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <SortAsc className={`h-4 w-4 ${beverageColors.text.textMuted}`} />
                <CustomSelect
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field as 'name' | 'category' | 'created_at');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  variant="secondary"
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
          <CardContent className="p-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className={`h-12 w-12 ${beverageColors.text.textMuted} mx-auto mb-4`} />
                <h3 className={`text-lg font-medium ${beverageColors.text.textPrimary} mb-2`}>
                  {locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'No products found'}
                </h3>
                <p className={beverageColors.text.textMuted}>
                  {locale === 'vi' ? 'Thử thay đổi bộ lọc hoặc tìm kiếm khác' : 'Try changing your filters or search terms'}
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">{locale === 'vi' ? 'Hình ảnh' : 'Image'}</TableHead>
                      <TableHead>{t('products.productName')}</TableHead>
                      <TableHead>{t('common.description')}</TableHead>
                      <TableHead>{t('common.category')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <div className={`w-16 h-16 bg-gradient-to-br from-[#F4E1D2] to-[#EEE5DE] rounded-xl overflow-hidden flex items-center justify-center ${beverageColors.shadows.sm} group-hover:${beverageColors.shadows.md} transition-shadow duration-200`}>
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
                            <div className={`flex items-center justify-center ${product.link_image ? 'hidden' : ''}`}>
                              <ImageIcon className={`h-6 w-6 ${beverageColors.text.textMuted}`} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${beverageColors.text.textPrimary} group-hover:${beverageColors.text.textSecondary} transition-colors duration-200`}>
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`max-w-xs truncate ${beverageColors.text.textMuted}`}>
                            {product.descriptions || (
                              <span className={`italic ${beverageColors.text.textLight}`}>
                                {locale === 'vi' ? 'Không có mô tả' : 'No description'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.categories?.name_cat ? (
                            <span className={`${beverageColors.text.textSecondary} font-medium`}>
                              {product.categories.name_cat}
                            </span>
                          ) : (
                            <span className={`${beverageColors.text.textLight} italic`}>
                              {locale === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              title={t('products.viewDetails')}
                              className={`${getButtonStyles('outline')} hover:${beverageColors.primary.bgLight} transition-all duration-200`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              title={t('common.edit')}
                              className={`${getButtonStyles('secondary')} hover:${beverageColors.secondary.bgLight} transition-all duration-200`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              title={t('common.delete')}
                              className={`${getBadgeStyles('error')} hover:${beverageColors.states.error.bg} transition-all duration-200`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className={`px-6 py-4 border-t border-[#EEE5DE] ${beverageColors.background.bgSecondary}`}>
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
              <label className={`block text-sm font-medium ${beverageColors.text.textPrimary} mb-1`}>
                {t('common.description')}
              </label>
              <textarea
                value={formData.descriptions}
                onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                className={`w-full px-3 py-2 border-2 border-[#D2B48C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} transition-all duration-200 placeholder:text-[#A0522D]`}
                rows={3}
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
                <label className={`block text-sm font-medium ${beverageColors.text.textPrimary} mb-1`}>
                  {locale === 'vi' ? 'Xem trước hình ảnh' : 'Image Preview'}
                </label>
                <div className={`w-32 h-32 ${beverageColors.background.bgSecondary} rounded-lg overflow-hidden flex items-center justify-center`}>
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
                    <ImageIcon className={`h-8 w-8 ${beverageColors.text.textMuted}`} />
                  </div>
                </div>
              </div>
            )}

            <CustomSelect
              label={t('common.category')}
              value={formData.categories_id}
              onChange={(value) => setFormData({ ...formData, categories_id: value })}
              variant="accent"
              className="border-2 rounded-lg"
              placeholder={t('products.selectCategory')}
              options={[
                { value: '', label: t('products.selectCategory') },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name_cat
                }))
              ]}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingProduct ? t('common.update') : t('common.save')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}