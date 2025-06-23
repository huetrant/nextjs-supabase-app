'use client';

import { Variant } from '@/types';

/**
 * Utility functions for variant formatting - can be reused across the app
 */

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatVariantDropdownLabel = (variant: Variant) => {
  const beverage = variant.Beverage_Option || 'Standard';
  const price = variant.price ? formatCurrency(variant.price) : '';

  // Add key nutritional info for quick preview
  const nutritionInfo = [];
  if (variant.calories) nutritionInfo.push(`${variant.calories} cal`);
  if (variant.protein_g) nutritionInfo.push(`${variant.protein_g}g protein`);
  if (variant.caffeine_mg) nutritionInfo.push(`${variant.caffeine_mg}mg caffeine`);

  const nutritionText = nutritionInfo.length > 0 ? ` (${nutritionInfo.join(', ')})` : '';

  return `${beverage} - ${price}${nutritionText}`;
};

/**
 * Component for displaying variant nutrition badges
 */
interface VariantNutritionBadgesProps {
  variant: Variant;
}

export const VariantNutritionBadges: React.FC<VariantNutritionBadgesProps> = ({ variant }) => {
  return (
    <div className="text-xs text-gray-500 space-y-0.5">
      <div className="flex items-center gap-2">
        {variant.calories && (
          <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs">
            🔥 {variant.calories} cal
          </span>
        )}
        {variant.protein_g && (
          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">
            💪 {variant.protein_g}g
          </span>
        )}
      </div>
      {variant.caffeine_mg && (
        <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs">
          ☕ {variant.caffeine_mg}mg caffeine
        </span>
      )}
    </div>
  );
};

/**
 * Component for displaying variant in table cell
 */
interface VariantTableCellProps {
  variant?: Variant;
}

export const VariantTableCell: React.FC<VariantTableCellProps> = ({ variant }) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">
        {variant?.Beverage_Option || 'Standard'}
      </div>
      {variant && <VariantNutritionBadges variant={variant} />}
    </div>
  );
};