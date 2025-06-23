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
import { Pagination, usePagination } from '@/components/ui/Pagination';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  User,
  UserCircle,
  Calendar,
  Filter,
  Download,
  Eye,
  Star,
  TrendingUp,
  Heart,
  Sparkles,
  Crown,
  Coffee,
  Zap,
  UserCheck,
  X
} from 'lucide-react';
import { IoMale, IoFemale } from 'react-icons/io5';
import { Customer } from '@/types';
import { beverageColors, getCardStyles, getBadgeStyles, getButtonStyles, getSelectStyles } from '@/lib/colors';

// Avatar component to handle image errors gracefully
const CustomerAvatar = ({ src, name, size = 'md' }: { src?: string | null, name: string, size?: 'sm' | 'md' | 'lg' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const shouldShowImage = src && !imageError && src.startsWith('http');

  return (
    <div className={`${sizeClasses[size]} rounded-full ${beverageColors.primary.gradient} flex items-center justify-center text-white font-semibold overflow-hidden relative`}>
      {shouldShowImage ? (
        <>
          <img
            src={src}
            alt={name}
            className={`${sizeClasses[size]} rounded-full object-cover absolute inset-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && (
            <div className="animate-pulse bg-gray-300 rounded-full w-full h-full absolute inset-0" />
          )}
        </>
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default function CustomersPage() {
  const t = useTranslations();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState('');
  const [filterSex, setFilterSex] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    sex: '',
    age: '',
    location: '',
    picture: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(t('error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const customerData = {
        name: formData.name,
        username: formData.username || null,
        sex: formData.sex || null,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
        picture: formData.picture || null,
      };

      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editingCustomer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([customerData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({ name: '', username: '', sex: '', age: '', location: '', picture: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      setError(t('error.saveData'));
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      username: customer.username || '',
      sex: customer.sex || '',
      age: customer.age?.toString() || '',
      location: customer.location || '',
      picture: customer.picture || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('customers.deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError(t('error.deleteData'));
    }
  };

  // Filter customers based on search and filter criteria
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterSex === '' || customer.sex?.toLowerCase() === filterSex.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Use pagination hook
  const {
    currentData: paginatedCustomers,
    currentPage,
    totalPages,
    goToPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(filteredCustomers, 8); // 8 items per page

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSexColor = (sex: string | null) => {
    switch (sex?.toLowerCase()) {
      case 'male': return 'text-blue-600';
      case 'female': return 'text-pink-600';
      default: return beverageColors.text.textMuted;
    }
  };

  const getAgeGroup = (age: number | null | undefined) => {
    if (!age) return t('customers.unknown');
    if (age < 18) return t('customers.teen');
    if (age < 30) return t('customers.youngAdult');
    if (age < 50) return t('customers.adult');
    return t('customers.senior');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className={`${getCardStyles('primary')} p-8`}>
            <LoadingSpinner size="lg" />
            <p className={`mt-4 ${beverageColors.text.textMuted}`}>{t('customers.loadingCustomers')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section with Gradient */}
        <div className={`${getCardStyles('primary')} p-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${beverageColors.secondary.gradient}`}>
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                  {t('customers.title')}
                </h1>
                <p className={`${beverageColors.text.textMuted} text-lg`}>
                  {t('customers.description')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className={`${getButtonStyles('outline')} flex items-center space-x-2 hover:scale-105 transition-transform duration-200`}
              >
                <Download className="h-4 w-4" />
                <span>{t('customers.export')}</span>
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className={`${getButtonStyles('primary')} flex items-center space-x-2 hover:scale-105 transition-transform duration-200`}
              >
                <Plus className="h-5 w-5" />
                <span>{t('customers.addCustomer')}</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${getCardStyles('primary')} hover:scale-105 transition-transform duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${beverageColors.primary.gradient} flex items-center justify-center`}>
                  <span className="text-xs leading-none">👥</span>
                </div>
                <CardTitle className={`text-sm font-medium ${beverageColors.text.textMuted}`}>
                  {t('customers.totalCustomers')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                {customers.length}
              </div>
              <p className={`text-xs ${beverageColors.text.textMuted} flex items-center mt-1`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% {t('customers.fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${getCardStyles('secondary')} hover:scale-105 transition-transform duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${beverageColors.secondary.gradient} flex items-center justify-center`}>
                  <span className="text-xs leading-none">👨</span>
                </div>
                <CardTitle className={`text-sm font-medium ${beverageColors.text.textMuted}`}>
                  {t('customers.maleCustomers')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                {customers.filter(c => c.sex?.toLowerCase() === 'male').length}
              </div>
              <p className={`text-xs ${beverageColors.text.textMuted}`}>
                {customers.length > 0 ? Math.round((customers.filter(c => c.sex?.toLowerCase() === 'male').length / customers.length) * 100) : 0}% {t('customers.ofTotal')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${getCardStyles('accent')} hover:scale-105 transition-transform duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${beverageColors.accent.gradient} flex items-center justify-center`}>
                  <span className="text-xs leading-none">👩</span>
                </div>
                <CardTitle className={`text-sm font-medium ${beverageColors.text.textMuted}`}>
                  {t('customers.femaleCustomers')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                {customers.filter(c => c.sex?.toLowerCase() === 'female').length}
              </div>
              <p className={`text-xs ${beverageColors.text.textMuted}`}>
                {customers.length > 0 ? Math.round((customers.filter(c => c.sex?.toLowerCase() === 'female').length / customers.length) * 100) : 0}% {t('customers.ofTotal')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${getCardStyles('soft')} hover:scale-105 transition-transform duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${beverageColors.highlight.gradient} flex items-center justify-center`}>
                  <span className="text-xs leading-none">🎂</span>
                </div>
                <CardTitle className={`text-sm font-medium ${beverageColors.text.textMuted}`}>
                  {t('customers.averageAge')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${beverageColors.text.textPrimary}`}>
                {customers.filter(c => c.age).length > 0
                  ? Math.round(customers.filter(c => c.age).reduce((sum, c) => sum + (c.age || 0), 0) / customers.filter(c => c.age).length)
                  : 0
                }
              </div>
              <p className={`text-xs ${beverageColors.text.textMuted}`}>
                {t('customers.yearsOld')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className={getCardStyles('primary')}>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className={`flex items-center ${beverageColors.text.textPrimary}`}>
                  <Users className="h-5 w-5 mr-2" />
                  {t('customers.customerList')}
                </CardTitle>
                <CardDescription className={beverageColors.text.textMuted}>
                  {t('customers.showingResults', { start: startIndex, end: endIndex, total: totalItems })}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${beverageColors.text.textMuted}`} />
                  <Input
                    placeholder={t('customers.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <CustomSelect
                  value={filterSex}
                  onChange={setFilterSex}
                  options={[
                    { value: '', label: t('customers.allGenders') },
                    { value: 'Male', label: t('customers.male') },
                    { value: 'Female', label: t('customers.female') },
                    { value: 'Other', label: t('customers.other') }
                  ]}
                  placeholder={t('customers.filterByGender')}
                  icon={<Filter className="h-4 w-4" />}
                  className="w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={`border-b border-[#D2B48C]/30`}>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold`}>
                      <div className="flex items-center space-x-2">
                        <UserCircle className="h-4 w-4" />
                        <span>{t('customers.customer')}</span>
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🧾</span>
                        <span>{t('customers.username')}</span>
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold`}>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex items-center justify-center w-4 h-4">
                          <div className="absolute">
                            <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-600">
                              {/* Circle base */}
                              <circle cx="8" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                              {/* Arrow pointing up (male) */}
                              <line x1="8" y1="7" x2="8" y2="2" stroke="currentColor" strokeWidth="1.5" />
                              <polyline points="6,4 8,2 10,4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                              {/* Arrow pointing down-right (female) */}
                              <line x1="11" y1="13" x2="13" y2="15" stroke="currentColor" strokeWidth="1.5" />
                              <polyline points="11,15 13,15 13,13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                        <span>{t('customers.gender')}</span>
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold`}>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{t('customers.ageGroup')}</span>
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold`}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{t('customers.location')}</span>
                      </div>
                    </TableHead>
                    <TableHead className={`${beverageColors.text.textPrimary} font-semibold text-right`}>
                      <div className="flex items-center justify-end space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>{t('customers.actions')}</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer, index) => (
                    <TableRow
                      key={customer.id}
                      className={`border-b border-[#D2B48C]/20 hover:${beverageColors.background.bgSecondary} transition-colors duration-200`}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <CustomerAvatar
                            src={customer.picture}
                            name={customer.name}
                            size="md"
                          />
                          <div>
                            <div className={`font-semibold ${beverageColors.text.textPrimary}`}>
                              {customer.name}
                            </div>
                            <div className={`text-sm ${beverageColors.text.textMuted}`}>
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {customer.username ? (
                            <span className={`${beverageColors.text.textPrimary} font-medium`}>
                              @{customer.username}
                            </span>
                          ) : (
                            <span className={beverageColors.text.textMuted}>{t('customers.noUsername')}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getSexColor(customer.sex ?? null)}`}>
                          {customer.sex || 'Not specified'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={beverageColors.text.textPrimary}>
                            {getAgeGroup(customer.age)}
                          </span>
                          {customer.age && (
                            <span className={`text-sm ${beverageColors.text.textMuted}`}>
                              ({customer.age})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.location ? (
                          <span className={beverageColors.text.textPrimary}>
                            {customer.location}
                          </span>
                        ) : (
                          <span className={beverageColors.text.textMuted}>{t('customers.noLocation')}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                            className={`${getButtonStyles('secondary')} p-2 hover:scale-105 transition-transform duration-200`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.id)}
                            className={`border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 hover:text-red-700 p-2 rounded-lg transition-all duration-200 hover:scale-105`}
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
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  className="w-full"
                />
              </div>
            )}

            {paginatedCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className={`h-12 w-12 mx-auto ${beverageColors.text.textMuted} mb-4`} />
                <h3 className={`text-lg font-semibold ${beverageColors.text.textPrimary} mb-2`}>
                  {t('customers.noCustomersFound')}
                </h3>
                <p className={beverageColors.text.textMuted}>
                  {searchTerm || filterSex
                    ? t('customers.adjustSearchFilter')
                    : t('customers.addFirstCustomer')
                  }
                </p>
                {!searchTerm && !filterSex && (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className={`${getButtonStyles('primary')} mt-4`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Customer
                  </Button>
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
            setEditingCustomer(null);
            setFormData({ name: '', username: '', sex: '', age: '', location: '', picture: '' });
          }}
          size="lg"
          title={
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${editingCustomer ? beverageColors.secondary.gradient : beverageColors.primary.gradient} shadow-lg`}>
                {editingCustomer ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${beverageColors.text.textPrimary}`}>
                  {editingCustomer ? t('customers.editCustomer') : t('customers.addNewCustomer')}
                </h3>
                <p className={`text-sm ${beverageColors.text.textMuted}`}>
                  {editingCustomer ? t('customers.editCustomerDesc') : t('customers.addCustomerDesc')}
                </p>
              </div>
            </div>
          }
        >
          <div className={`${beverageColors.background.bgSecondary} rounded-lg p-6 -m-6 mb-6`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name - Full Width */}
              <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${beverageColors.text.textPrimary}`}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{t('customers.customerName')}</span>
                    </div>
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder={t('customers.enterFullName')}
                    className="flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                  <div className="space-y-1">
                    <label className={`block text-sm font-medium ${beverageColors.text.textPrimary}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🧾</span>
                        <span>{t('customers.username')}</span>
                      </div>
                    </label>
                    <input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder={t('customers.enterUsername')}
                      className="flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                  <div className="space-y-1">
                    <CustomSelect
                      label={t('customers.gender')}
                      value={formData.sex}
                      onChange={(value) => setFormData({ ...formData, sex: value })}
                      options={[
                        { value: '', label: t('customers.selectGender') },
                        { value: 'Male', label: t('customers.male') },
                        { value: 'Female', label: t('customers.female') },
                        { value: 'Other', label: t('customers.other') }
                      ]}
                      placeholder={t('customers.selectGender')}
                      icon={<Users className="h-4 w-4" />}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Age and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                  <div className="space-y-1">
                    <label className={`block text-sm font-medium ${beverageColors.text.textPrimary}`}>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{t('customers.age')}</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      min="1"
                      max="120"
                      placeholder={t('customers.enterAge')}
                      className="flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                  <div className="space-y-1">
                    <label className={`block text-sm font-medium ${beverageColors.text.textPrimary}`}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{t('customers.location')}</span>
                      </div>
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={t('customers.enterLocation')}
                      className="flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div className={`${beverageColors.background.bgMain} rounded-lg p-4 border border-[#D2B48C]/30`}>
                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${beverageColors.text.textPrimary}`}>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{t('customers.picture')}</span>
                    </div>
                  </label>
                  <input
                    value={formData.picture}
                    onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                    placeholder={t('customers.enterPictureUrl')}
                    className="flex h-11 w-full rounded-lg border-2 px-4 py-2 text-sm border-[#D2B48C] bg-[#FFF8F0] text-[#3E2C1C] focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] placeholder:text-[#A0522D]/60 transition-all duration-200"
                  />
                  {formData.picture && (
                    <div className="mt-3 flex items-center space-x-3">
                      <CustomerAvatar
                        src={formData.picture}
                        name={formData.name || 'Preview'}
                        size="lg"
                      />
                      <div>
                        <span className={`text-sm ${beverageColors.text.textMuted} font-medium`}>{t('customers.preview')}</span>
                        <p className={`text-xs ${beverageColors.text.textMuted} opacity-75`}>
                          {formData.picture.length > 40 ? `${formData.picture.substring(0, 40)}...` : formData.picture}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex justify-end space-x-3 pt-6 border-t-2 border-[#D2B48C]/30`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className={`${getButtonStyles('outline')} hover:scale-105 transition-all duration-200 px-6 py-2`}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  className={`${getButtonStyles(editingCustomer ? 'secondary' : 'primary')} hover:scale-105 transition-all duration-200 px-6 py-2 shadow-lg`}
                >
                  {editingCustomer ? (
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