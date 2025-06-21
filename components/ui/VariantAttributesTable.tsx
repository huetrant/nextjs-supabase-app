'use client';

import { useState } from 'react';
import { Badge } from './Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { Button } from './Button';
import { Variant } from '@/types';
import {
  Coffee,
  DollarSign,
  Flame,
  Wheat,
  Candy,
  Dumbbell,
  Carrot,
  Citrus,
  Zap,
  Trophy,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface VariantAttributesTableProps {
  variants: Variant[];
  locale: string;
  onAddVariant?: () => void;
  onEditVariant?: (variant: Variant) => void;
  onDeleteVariant?: (variantId: string) => void;
}

// Color scheme constants
const COLOR_SCHEME = {
  good: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-500', icon: 'text-yellow-500' },
  poor: { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'text-gray-600' }
};

// Helper functions to determine color based on value ranges
const getCaloriesColor = (calories: number) => {
  if (calories <= 100) return COLOR_SCHEME.good;
  if (calories <= 200) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getFiberColor = (fiber: number) => {
  if (fiber >= 5) return COLOR_SCHEME.good;
  if (fiber >= 2) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getSugarColor = (sugar: number) => {
  if (sugar <= 10) return COLOR_SCHEME.good;
  if (sugar <= 25) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getProteinColor = (protein: number) => {
  if (protein >= 10) return COLOR_SCHEME.good;
  if (protein >= 5) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getCaffeineColor = (caffeine: number) => {
  if (caffeine <= 50) return COLOR_SCHEME.good;
  if (caffeine <= 100) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getPriceColor = (price: number) => {
  if (price <= 50000) return COLOR_SCHEME.good;
  if (price <= 100000) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

const getRankColor = (rank: number) => {
  if (rank <= 3) return COLOR_SCHEME.good;    // Top 3: Excellent ranking
  if (rank <= 7) return COLOR_SCHEME.medium;  // 4-7: Good ranking
  return COLOR_SCHEME.poor;                   // 8-10: Lower ranking
};

const getVitaminColor = (vitamin: number) => {
  if (vitamin >= 50) return COLOR_SCHEME.good;
  if (vitamin >= 20) return COLOR_SCHEME.medium;
  return COLOR_SCHEME.poor;
};

type SortField = keyof Variant | 'none';
type SortDirection = 'asc' | 'desc';

export function VariantAttributesTable({ variants, locale, onAddVariant, onEditVariant, onDeleteVariant }: VariantAttributesTableProps) {
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400 flex-shrink-0" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3 w-3 text-blue-600 flex-shrink-0" />
      : <ArrowDown className="h-3 w-3 text-blue-600 flex-shrink-0" />;
  };

  const sortedVariants = [...variants].sort((a, b) => {
    if (sortField === 'none') return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

    // Sort based on data type
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? result : -result;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const result = aValue - bValue;
      return sortDirection === 'asc' ? result : -result;
    }

    return 0;
  });
  return (
    <div className="space-y-4">
      {/* Add Variant Button */}
      {onAddVariant && (
        <div className="flex justify-end">
          <Button onClick={onAddVariant} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {locale === 'vi' ? 'Thêm Variant' : 'Add Variant'}
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('Beverage_Option')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Coffee className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Loại đồ uống' : 'Beverage Option'}</span>
                {getSortIcon('Beverage_Option')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('price')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Giá (VND)' : 'Price (VND)'}</span>
                {getSortIcon('price')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('calories')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Flame className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Calories (cal)' : 'Calories (cal)'}</span>
                {getSortIcon('calories')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('dietary_fibre_g')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Wheat className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Chất xơ (g)' : 'Fiber (g)'}</span>
                {getSortIcon('dietary_fibre_g')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('sugars_g')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Candy className="h-4 w-4 text-pink-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Đường (g)' : 'Sugar (g)'}</span>
                {getSortIcon('sugars_g')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('protein_g')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Dumbbell className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Protein (g)' : 'Protein (g)'}</span>
                {getSortIcon('protein_g')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('vitamin_a_%')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Carrot className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'ViT A (%)' : 'ViT A (%)'}</span>
                {getSortIcon('vitamin_a_%')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('vitamin_c_%')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Citrus className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'ViT C (%)' : 'ViT C (%)'}</span>
                {getSortIcon('vitamin_c_%')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('caffeine_mg')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Zap className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Caffeine (mg)' : 'Caffeine (mg)'}</span>
                {getSortIcon('caffeine_mg')}
              </button>
            </TableHead>
            <TableHead className="px-2">
              <button
                onClick={() => handleSort('sales_rank')}
                className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors text-left w-full justify-start"
              >
                <Trophy className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <span className="whitespace-nowrap">{locale === 'vi' ? 'Xếp hạng' : 'Sales Rank'}</span>
                {getSortIcon('sales_rank')}
              </button>
            </TableHead>
            {(onEditVariant || onDeleteVariant) && (
              <TableHead>{locale === 'vi' ? 'Thao tác' : 'Actions'}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVariants.map((variant) => (
            <TableRow key={variant.id}>
              {/* Beverage Option */}
              <TableCell className="font-medium px-2">
                {variant.Beverage_Option || '-'}
              </TableCell>

              {/* Price */}
              <TableCell className="px-2">
                {variant.price ? (
                  <span className="font-medium">
                    {variant.price.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Calories */}
              <TableCell className="px-2">
                {variant.calories ? (
                  <span className={`font-medium ${getCaloriesColor(variant.calories).text}`}>
                    {variant.calories}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Dietary Fiber */}
              <TableCell className="px-2">
                {variant.dietary_fibre_g ? (
                  <span className={`font-medium ${getFiberColor(variant.dietary_fibre_g).text}`}>
                    {variant.dietary_fibre_g}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Sugar */}
              <TableCell className="px-2">
                {variant.sugars_g ? (
                  <span className={`font-medium ${getSugarColor(variant.sugars_g).text}`}>
                    {variant.sugars_g}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Protein */}
              <TableCell className="px-2">
                {variant.protein_g ? (
                  <span className={`font-medium ${getProteinColor(variant.protein_g).text}`}>
                    {variant.protein_g}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Vitamin A */}
              <TableCell className="px-2">
                {variant['vitamin_a_%'] ? (
                  <span className={`font-medium ${getVitaminColor(variant['vitamin_a_%']).text}`}>
                    {variant['vitamin_a_%']}%
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Vitamin C */}
              <TableCell className="px-2">
                {variant['vitamin_c_%'] ? (
                  <span className={`font-medium ${getVitaminColor(variant['vitamin_c_%']).text}`}>
                    {variant['vitamin_c_%']}%
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Caffeine */}
              <TableCell className="px-2">
                {variant.caffeine_mg ? (
                  <span className={`font-medium ${getCaffeineColor(variant.caffeine_mg).text}`}>
                    {variant.caffeine_mg}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Sales Rank */}
              <TableCell className="px-2">
                {variant.sales_rank ? (
                  <span className={`font-medium ${getRankColor(variant.sales_rank).text}`}>
                    {variant.sales_rank}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>

              {/* Actions */}
              {(onEditVariant || onDeleteVariant) && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onEditVariant && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditVariant(variant)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteVariant && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteVariant(variant.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}