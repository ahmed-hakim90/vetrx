import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { colors, spacing, radius, container, typography } from '../../styles/design-tokens';

interface PLPHeaderProps {
  categoryName: string;
  productCount: number;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export const PLPHeader: React.FC<PLPHeaderProps> = ({
  categoryName,
  productCount,
  sortBy = 'relevance',
  onSortChange,
}) => {
  const { language, navigateToCategory } = useStore();

  const sortOptions = [
    { value: 'relevance', label: language === 'ar' ? 'الأكثر تطابقاً' : 'Relevance' },
    { value: 'price-low', label: language === 'ar' ? 'السعر: الأقل أولاً' : 'Price: Low to High' },
    { value: 'price-high', label: language === 'ar' ? 'السعر: الأعلى أولاً' : 'Price: High to Low' },
    { value: 'rating', label: language === 'ar' ? 'التقييم: الأعلى' : 'Rating: Highest' },
  ];

  return (
    <div style={{ backgroundColor: colors['surface-container-low'], padding: `${spacing.lg} 0` }}>
      <div
        style={{
          maxWidth: container.maxWidth,
          margin: '0 auto',
          padding: `0 1rem`,
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.lg,
            fontSize: '14px',
          }}
        >
          <button
            onClick={() => navigateToCategory('all')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              cursor: 'pointer',
              padding: 0,
              fontSize: '14px',
            }}
          >
            {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
          </button>
          <ChevronRight size={16} style={{ color: colors['on-surface-variant'] }} />
          <span style={{ color: colors['on-surface-variant'], fontWeight: 600 }}>
            {categoryName}
          </span>
        </div>

        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: spacing.md,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: colors['on-background'],
                margin: 0,
                marginBottom: spacing.sm,
              }}
            >
              {categoryName}
            </h1>
            <p style={{ color: colors['on-surface-variant'], margin: 0, fontSize: '14px' }}>
              {productCount} {language === 'ar' ? 'منتج' : 'products'}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label
              style={{
                fontSize: '12px',
                color: colors['on-surface-variant'],
                display: 'block',
                marginBottom: spacing.xs,
                fontWeight: 600,
              }}
            >
              {language === 'ar' ? 'ترتيب حسب' : 'Sort by'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: radius.md,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: colors['on-background'],
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
