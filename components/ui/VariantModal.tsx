'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Variant } from '@/types';

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: Partial<Variant>) => void;
  variant?: Variant | null;
  locale: string;
  showPrice?: boolean; // New prop to control price field visibility
}

export function VariantModal({ isOpen, onClose, onSave, variant, locale, showPrice = true }: VariantModalProps) {
  const [formData, setFormData] = useState<Partial<Variant>>({
    Beverage_Option: '',
    price: 0,
    calories: 0,
    dietary_fibre_g: 0,
    sugars_g: 0,
    protein_g: 0,
    'vitamin_a_%': 0,
    'vitamin_c_%': 0,
    caffeine_mg: 0,
    sales_rank: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variant) {
      setFormData(variant);
    } else {
      setFormData({
        Beverage_Option: '',
        price: 0,
        calories: 0,
        dietary_fibre_g: 0,
        sugars_g: 0,
        protein_g: 0,
        'vitamin_a_%': 0,
        'vitamin_c_%': 0,
        caffeine_mg: 0,
        sales_rank: 0,
      });
    }
  }, [variant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Variant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={variant
        ? (locale === 'vi' ? 'Sửa Variant' : 'Edit Variant')
        : (locale === 'vi' ? 'Thêm Variant Mới' : 'Add New Variant')
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beverage Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Loại đồ uống' : 'Beverage Option'}
            </label>
            <Input
              type="text"
              value={formData.Beverage_Option || ''}
              onChange={(e) => handleInputChange('Beverage_Option', e.target.value)}
              placeholder={locale === 'vi' ? 'Nhập loại đồ uống' : 'Enter beverage option'}
            />
          </div>

          {/* Price */}
          {showPrice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'vi' ? 'Giá (VND)' : 'Price (VND)'}
              </label>
              <Input
                type="number"
                value={formData.price || 0}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          )}

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Calories (cal)' : 'Calories (cal)'}
            </label>
            <Input
              type="number"
              value={formData.calories || 0}
              onChange={(e) => handleInputChange('calories', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          {/* Dietary Fiber */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Chất xơ (g)' : 'Fiber (g)'}
            </label>
            <Input
              type="number"
              value={formData.dietary_fibre_g || 0}
              onChange={(e) => handleInputChange('dietary_fibre_g', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          {/* Sugar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Đường (g)' : 'Sugar (g)'}
            </label>
            <Input
              type="number"
              value={formData.sugars_g || 0}
              onChange={(e) => handleInputChange('sugars_g', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          {/* Protein */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Protein (g)' : 'Protein (g)'}
            </label>
            <Input
              type="number"
              value={formData.protein_g || 0}
              onChange={(e) => handleInputChange('protein_g', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          {/* Vitamin A */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'ViT A (%)' : 'ViT A (%)'}
            </label>
            <Input
              type="number"
              value={formData['vitamin_a_%'] || 0}
              onChange={(e) => handleInputChange('vitamin_a_%', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          {/* Vitamin C */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'ViT C (%)' : 'ViT C (%)'}
            </label>
            <Input
              type="number"
              value={formData['vitamin_c_%'] || 0}
              onChange={(e) => handleInputChange('vitamin_c_%', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          {/* Caffeine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Caffeine (mg)' : 'Caffeine (mg)'}
            </label>
            <Input
              type="number"
              value={formData.caffeine_mg || 0}
              onChange={(e) => handleInputChange('caffeine_mg', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          {/* Sales Rank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Xếp hạng' : 'Sales Rank'}
            </label>
            <Input
              type="number"
              value={formData.sales_rank || 0}
              onChange={(e) => handleInputChange('sales_rank', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {locale === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {variant
              ? (locale === 'vi' ? 'Cập nhật' : 'Update')
              : (locale === 'vi' ? 'Thêm' : 'Add')
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
}