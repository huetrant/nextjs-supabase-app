'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Edit, Trash2, Tags, Filter, SortAsc } from 'lucide-react';
import { Category } from '@/types';
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles } from '@/lib/colors';

export default function CategoriesPage() {
  const t = useTranslations();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_cat');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const categoryData = {
        name_cat: formData.name,
        description: formData.description || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(t('error.saveData'));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name_cat,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('categories.deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(t('error.deleteData'));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name_cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen ${beverageColors.gradients.warm} p-6`}>
          <div className={`${getCardStyles('primary')} p-12`}>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className={`p-4 rounded-full ${beverageColors.primary.gradient} ${beverageColors.shadows.lg}`}>
                <Tags className={`h-12 w-12 ${beverageColors.text.textWhite} animate-pulse`} />
              </div>
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${beverageColors.text.textPrimary} mb-2`}>
                  {t('categories.title')}
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
        {/* Header Section */}
        <div className={`${getCardStyles('primary')} p-4 md:p-6 animate-slideIn`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${beverageColors.secondary.gradient} ${beverageColors.shadows.md}`}>
                <Tags className={`h-8 w-8 ${beverageColors.text.textWhite}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                  {t('categories.title')}
                </h1>
                <p className={`${beverageColors.text.textSecondary} mt-1`}>
                  {t('categories.subtitle')}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className={getBadgeStyles('secondary')}>
                    {t('common.total')}: {categories.length}
                  </Badge>
                  <Badge className={getBadgeStyles('accent')}>
                    {t('categories.categoryList')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className={`${getButtonStyles('primary')} px-4 md:px-6 py-2 md:py-3 text-base md:text-lg hover:scale-105 transition-all duration-200`}
            >
              <Plus className="h-4 md:h-5 w-4 md:w-5 mr-2" />
              <span className="hidden sm:inline">{t('categories.addCategory')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </Button>
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

        {/* Search and Filter Section */}
        <div className={`${getCardStyles('soft')} p-4 md:p-6 animate-fadeIn`} style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${beverageColors.highlight.bg}`}>
                <Filter className={`h-5 w-5 ${beverageColors.text.textPrimary}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${beverageColors.text.textPrimary}`}>
                  {t('categories.categoryList')}
                </h3>
                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                  {filteredCategories.length} {t('categories.found')} / {categories.length} {t('common.total')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${beverageColors.text.textMuted}`} />
                <Input
                  placeholder={t('categories.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 w-full md:w-80 ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] transition-all duration-200`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Categories Card */}
        <Card className={`${getCardStyles('primary')} animate-scaleIn`} style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${beverageColors.accent.gradient}`}>
                  <Tags className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                </div>
                <div>
                  <CardTitle className={`text-xl ${beverageColors.text.textPrimary}`}>
                    {t('categories.categoryList')}
                  </CardTitle>
                  <CardDescription className={beverageColors.text.textMuted}>
                    {t('categories.manageCategories')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getBadgeStyles('primary')}>
                  {filteredCategories.length} {t('categories.showing')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <div className={`mx-auto w-24 h-24 ${beverageColors.background.bgMuted} rounded-full flex items-center justify-center mb-4`}>
                  <Tags className={`h-12 w-12 ${beverageColors.text.textMuted}`} />
                </div>
                <h3 className={`text-lg font-medium ${beverageColors.text.textPrimary} mb-2`}>
                  {searchTerm ? t('categories.noResults') : t('categories.noCategories')}
                </h3>
                <p className={`${beverageColors.text.textMuted} mb-6`}>
                  {searchTerm ? t('categories.tryDifferentSearch') : t('categories.createFirstCategory')}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className={getButtonStyles('primary')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('categories.addCategory')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={`${beverageColors.background.bgSecondary} border-b border-[#D2B48C]`}>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                          <div className="flex items-center space-x-2">
                            <Tags className="h-4 w-4" />
                            <span>{t('categories.categoryName')}</span>
                          </div>
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                          {t('common.description')}
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6 text-right`}>
                          {t('common.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category, index) => (
                        <TableRow
                          key={category.id}
                          className={`
                          ${index % 2 === 0 ? beverageColors.background.bgMain : beverageColors.background.bgSecondary}
                          hover:${beverageColors.background.bgMuted} 
                          transition-all duration-300 ease-in-out
                          border-b border-[#EEE5DE]/50
                          hover:shadow-md hover:scale-[1.01]
                          animate-fadeIn
                        `}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg ${beverageColors.primary.gradient} flex items-center justify-center`}>
                                <Tags className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                              </div>
                              <div>
                                <p className={`font-semibold ${beverageColors.text.textPrimary}`}>
                                  {category.name_cat}
                                </p>
                                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                                  ID: {category.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 max-w-md">
                            <div className={`${beverageColors.text.textSecondary}`}>
                              {category.description ? (
                                <p className="line-clamp-2">{category.description}</p>
                              ) : (
                                <span className={`italic ${beverageColors.text.textMuted}`}>
                                  {t('common.noDescription')}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                onClick={() => handleEdit(category)}
                                className={`${getButtonStyles('outline')} p-2 hover:scale-110 transition-all duration-200`}
                                size="sm"
                                title={t('common.edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(category.id)}
                                className={`${beverageColors.states.error.bg} ${beverageColors.text.textWhite} hover:bg-[#B22222] hover:scale-110 p-2 rounded-lg transition-all duration-200 ${beverageColors.shadows.sm} hover:${beverageColors.shadows.md}`}
                                size="sm"
                                title={t('common.delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
          }}
          title={
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${editingCategory ? beverageColors.secondary.gradient : beverageColors.primary.gradient}`}>
                {editingCategory ? (
                  <Edit className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                ) : (
                  <Plus className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${beverageColors.text.textPrimary}`}>
                  {editingCategory ? t('categories.editCategory') : t('categories.addNewCategory')}
                </h3>
                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                  {editingCategory ? t('categories.updateCategoryInfo') : t('categories.fillCategoryInfo')}
                </p>
              </div>
            </div>
          }
        >
          <div className={`${beverageColors.gradients.soft} p-6 rounded-xl`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name Field */}
              <div>
                <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <Tags className="h-4 w-4" />
                    <span>{t('categories.categoryName')}</span>
                    <span className={beverageColors.states.error.text}>*</span>
                  </div>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] rounded-lg`}
                  placeholder={t('categories.enterCategoryName')}
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>{t('common.description')}</span>
                    <span className={`text-xs ${beverageColors.text.textMuted}`}>({t('common.optional')})</span>
                  </div>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-3 border border-[#D2B48C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} transition-all duration-200`}
                  rows={4}
                  placeholder={t('categories.enterDescription')}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-[#EEE5DE]">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`${getButtonStyles('outline')} px-6 py-2`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  className={`${getButtonStyles(editingCategory ? 'secondary' : 'primary')} px-6 py-2`}
                >
                  {editingCategory ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('common.update')}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('common.add')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}