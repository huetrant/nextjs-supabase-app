'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations, useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Pagination, usePagination } from '@/components/ui/Pagination';
import { Plus, Search, Edit, Trash2, Store, MapPin, Phone, Clock, Building2, Filter, SortAsc } from 'lucide-react';
import { StoreData } from '@/types';
import { beverageColors, getCardStyles, getButtonStyles, getBadgeStyles } from '@/lib/colors';
import { Badge } from '@/components/ui/Badge';

export default function StoresPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name_store' | 'address' | 'phone'>('name_store');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreData | null>(null);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    open_close: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('store')
        .select('*')
        .order('name_store');

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const storeData = {
        name_store: formData.name,
        address: formData.address || null,
        phone: formData.phone || null,
        open_close: formData.open_close || null,
      };

      if (editingStore) {
        const { error } = await supabase
          .from('store')
          .update(storeData)
          .eq('id', editingStore.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store')
          .insert([storeData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingStore(null);
      setFormData({ name: '', address: '', phone: '', open_close: '' });
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      setError(t('error.saveData'));
    }
  };

  const handleEdit = (store: StoreData) => {
    setEditingStore(store);
    setFormData({
      name: store.name_store,
      address: store.address || '',
      phone: store.phone || '',
      open_close: store.open_close || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('stores.deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('store')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      setError(t('error.deleteData'));
    }
  };

  // Filter and sort stores
  const filteredAndSortedStores = stores
    .filter(store =>
      store.name_store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.open_close?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortBy) {
        case 'name_store':
          aValue = a.name_store.toLowerCase();
          bValue = b.name_store.toLowerCase();
          break;
        case 'address':
          aValue = (a.address || '').toLowerCase();
          bValue = (b.address || '').toLowerCase();
          break;
        case 'phone':
          aValue = (a.phone || '').toLowerCase();
          bValue = (b.phone || '').toLowerCase();
          break;
        default:
          aValue = a.name_store.toLowerCase();
          bValue = b.name_store.toLowerCase();
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
    currentData: paginatedStores,
    goToPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(filteredAndSortedStores, 10);

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen ${beverageColors.gradients.warm} p-6`}>
          <div className={`${getCardStyles('primary')} p-12`}>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className={`p-4 rounded-full ${beverageColors.primary.gradient} ${beverageColors.shadows.lg}`}>
                <Building2 className={`h-12 w-12 ${beverageColors.text.textWhite} animate-pulse`} />
              </div>
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${beverageColors.text.textPrimary} mb-2`}>
                  {t('stores.title')}
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
                <Building2 className={`h-8 w-8 ${beverageColors.text.textWhite}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                  {t('stores.title')}
                </h1>
                <p className={`${beverageColors.text.textSecondary} mt-1`}>
                  {t('stores.subtitle')}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className={getBadgeStyles('secondary')}>
                    {t('common.total')}: {stores.length}
                  </Badge>
                  <Badge className={getBadgeStyles('accent')}>
                    {t('stores.storeList')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className={`${getButtonStyles('primary')} px-4 md:px-6 py-2 md:py-3 text-base md:text-lg hover:scale-105 transition-all duration-200`}
            >
              <Plus className="h-4 md:h-5 w-4 md:w-5 mr-2" />
              <span className="hidden sm:inline">{t('stores.addStore')}</span>
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
                  {t('common.searchAndFilter')}
                </h3>
                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                  {filteredAndSortedStores.length} {t('stores.found')} / {stores.length} {t('common.total')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${beverageColors.text.textMuted}`} />
                <Input
                  placeholder={t('stores.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 w-full md:w-80 ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] transition-all duration-200`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <SortAsc className={`h-4 w-4 ${beverageColors.text.textMuted}`} />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as 'name_store' | 'address' | 'phone');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className={`beverage-select text-sm min-w-[140px] px-3 py-2 border border-[#D2B48C] rounded-md ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} focus:border-[#A0522D] focus:ring-[#A0522D] transition-all duration-200`}
                >
                  <option value="name_store-asc">{locale === 'vi' ? 'Tên A-Z' : 'Name A-Z'}</option>
                  <option value="name_store-desc">{locale === 'vi' ? 'Tên Z-A' : 'Name Z-A'}</option>
                  <option value="address-asc">{locale === 'vi' ? 'Địa chỉ A-Z' : 'Address A-Z'}</option>
                  <option value="address-desc">{locale === 'vi' ? 'Địa chỉ Z-A' : 'Address Z-A'}</option>
                  <option value="phone-asc">{locale === 'vi' ? 'SĐT A-Z' : 'Phone A-Z'}</option>
                  <option value="phone-desc">{locale === 'vi' ? 'SĐT Z-A' : 'Phone Z-A'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stores Card */}
        <Card className={`${getCardStyles('primary')} animate-scaleIn`} style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${beverageColors.accent.gradient}`}>
                  <Building2 className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                </div>
                <div>
                  <CardTitle className={`text-xl ${beverageColors.text.textPrimary}`}>
                    {t('stores.allStores')}
                  </CardTitle>
                  <CardDescription className={beverageColors.text.textMuted}>
                    {locale === 'vi' ? 'Xem và chỉnh sửa thông tin' : 'View and edit information'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getBadgeStyles('primary')}>
                  {paginatedStores.length} {t('stores.showing')}
                </Badge>
                <Badge className={getBadgeStyles('secondary')}>
                  {locale === 'vi' ? 'Trang' : 'Page'} {currentPage}/{totalPages}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {paginatedStores.length === 0 ? (
              <div className="text-center py-12">
                <div className={`mx-auto w-24 h-24 ${beverageColors.background.bgMuted} rounded-full flex items-center justify-center mb-4`}>
                  <Building2 className={`h-12 w-12 ${beverageColors.text.textMuted}`} />
                </div>
                <h3 className={`text-lg font-medium ${beverageColors.text.textPrimary} mb-2`}>
                  {searchTerm ? t('stores.noResults') : t('stores.noStores')}
                </h3>
                <p className={`${beverageColors.text.textMuted} mb-6`}>
                  {searchTerm ? t('stores.tryDifferentSearch') : t('stores.createFirstStore')}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className={getButtonStyles('primary')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('stores.addStore')}
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
                            <Store className="h-4 w-4" />
                            <span>{t('stores.storeName')}</span>
                          </div>
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{t('common.address')}</span>
                          </div>
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{t('common.phone')}</span>
                          </div>
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6`}>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{locale === 'vi' ? 'Giờ mở cửa' : 'Open Hours'}</span>
                          </div>
                        </TableHead>
                        <TableHead className={`${beverageColors.text.textPrimary} font-semibold py-4 px-6 text-right`}>
                          {t('common.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStores.map((store, index) => (
                        <TableRow
                          key={store.id}
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
                                <Store className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                              </div>
                              <div>
                                <p className={`font-semibold ${beverageColors.text.textPrimary}`}>
                                  {store.name_store}
                                </p>
                                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                                  ID: {store.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 max-w-md">
                            <div className={`${beverageColors.text.textSecondary}`}>
                              {store.address ? (
                                <p className="line-clamp-2">{store.address}</p>
                              ) : (
                                <span className={`italic ${beverageColors.text.textMuted}`}>
                                  {t('common.noAddress')}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className={`${beverageColors.text.textSecondary}`}>
                              {store.phone ? (
                                <span>{store.phone}</span>
                              ) : (
                                <span className={`italic ${beverageColors.text.textMuted}`}>
                                  {t('common.noPhone')}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className={`${beverageColors.text.textSecondary}`}>
                              {store.open_close ? (
                                <span className="text-sm">{store.open_close}</span>
                              ) : (
                                <span className={`italic ${beverageColors.text.textMuted}`}>
                                  {t('common.noSchedule')}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                onClick={() => handleEdit(store)}
                                className={`${getButtonStyles('outline')} p-2 hover:scale-110 transition-all duration-200`}
                                size="sm"
                                title={t('common.edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(store.id)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={`px-6 py-4 border-t border-[#EEE5DE] ${beverageColors.background.bgSecondary}`}>
                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${beverageColors.text.textMuted}`}>
                        {locale === 'vi'
                          ? `Hiển thị ${startIndex}-${endIndex} trong tổng số ${totalItems} cửa hàng`
                          : `Showing ${startIndex}-${endIndex} of ${totalItems} stores`
                        }
                      </div>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        showPageNumbers={true}
                        maxVisiblePages={5}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStore(null);
            setFormData({ name: '', address: '', phone: '', open_close: '' });
          }}
          title={
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${editingStore ? beverageColors.secondary.gradient : beverageColors.primary.gradient}`}>
                {editingStore ? (
                  <Edit className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                ) : (
                  <Plus className={`h-5 w-5 ${beverageColors.text.textWhite}`} />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${beverageColors.text.textPrimary}`}>
                  {editingStore ? t('stores.editStore') : t('stores.addNewStore')}
                </h3>
                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                  {editingStore ? t('stores.updateStoreInfo') : t('stores.fillStoreInfo')}
                </p>
              </div>
            </div>
          }
        >
          <div className={`${beverageColors.gradients.soft} p-6 rounded-xl`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Name Field */}
              <div>
                <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <Store className="h-4 w-4" />
                    <span>{t('stores.storeName')}</span>
                    <span className={beverageColors.states.error.text}>*</span>
                  </div>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] rounded-lg`}
                  placeholder={t('stores.enterStoreName')}
                  required
                />
              </div>

              {/* Address Field */}
              <div>
                <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{t('common.address')}</span>
                    <span className={`text-xs ${beverageColors.text.textMuted}`}>({t('common.optional')})</span>
                  </div>
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] rounded-lg`}
                  placeholder={t('stores.enterAddress')}
                />
              </div>

              {/* Phone and Hours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{t('common.phone')}</span>
                      <span className={`text-xs ${beverageColors.text.textMuted}`}>({t('common.optional')})</span>
                    </div>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] rounded-lg`}
                    placeholder={t('stores.enterPhone')}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{locale === 'vi' ? 'Giờ mở cửa' : 'Open Hours'}</span>
                      <span className={`text-xs ${beverageColors.text.textMuted}`}>({t('common.optional')})</span>
                    </div>
                  </label>
                  <Input
                    value={formData.open_close}
                    onChange={(e) => setFormData({ ...formData, open_close: e.target.value })}
                    className={`${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} border-[#D2B48C] focus:ring-[#A0522D] focus:border-[#A0522D] rounded-lg`}
                    placeholder={locale === 'vi' ? 'VD: 9:00 - 22:00' : 'e.g., 9:00 AM - 10:00 PM'}
                  />
                </div>
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
                  className={`${getButtonStyles(editingStore ? 'secondary' : 'primary')} px-6 py-2`}
                >
                  {editingStore ? (
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