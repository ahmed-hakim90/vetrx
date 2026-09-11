import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { colors, spacing, radius } from '../../styles/design-tokens';

interface PriceRange {
  min: number;
  max: number;
}

interface PLPFilterSidebarProps {
  brands: string[];
  priceRange: PriceRange;
  onPriceChange?: (range: PriceRange) => void;
  onBrandToggle?: (brand: string) => void;
  onStockChange?: (inStockOnly: boolean) => void;
  selectedBrands?: string[];
  inStockOnly?: boolean;
  onClearFilters?: () => void;
}

export const PLPFilterSidebar: React.FC<PLPFilterSidebarProps> = ({
  brands,
  priceRange,
  onPriceChange,
  onBrandToggle,
  onStockChange,
  selectedBrands = [],
  inStockOnly = false,
  onClearFilters,
}) => {
  const { language } = useStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    brands: true,
    stock: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const pricePresets = [
    { label: language === 'ar' ? 'أقل من 50,000' : 'Under 50k', min: 0, max: 50000 },
    { label: language === 'ar' ? '50,000 - 95,000' : '50k - 95k', min: 50000, max: 95000 },
    { label: language === 'ar' ? 'أكثر من 95,000' : 'Over 95k', min: 95000, max: 999999 },
  ];

  return (
    <aside
      style={{
        width: '100%',
        maxWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
      }}
    >
      {/* Clear Filters */}
      {(selectedBrands.length > 0 || inStockOnly) && (
        <button
          onClick={onClearFilters}
          style={{
            backgroundColor: colors.error,
            color: colors['on-error'],
            border: 'none',
            borderRadius: radius.md,
            padding: spacing.sm,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
          }}
        >
          <X size={16} />
          {language === 'ar' ? 'مسح التصفية' : 'Clear Filters'}
        </button>
      )}

      {/* Price Filter */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => toggleSection('price')}
          style={{
            width: '100%',
            padding: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors['surface-container'],
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            color: colors['on-background'],
          }}
        >
          {language === 'ar' ? 'السعر' : 'Price'}
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.price && (
          <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onPriceChange?.({ min: preset.min, max: preset.max })}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: radius.md,
                  border:
                    priceRange.min === preset.min && priceRange.max === preset.max
                      ? `2px solid ${colors.primary}`
                      : `1px solid ${colors.border}`,
                  backgroundColor:
                    priceRange.min === preset.min && priceRange.max === preset.max
                      ? colors['primary-container']
                      : 'transparent',
                  color: colors['on-background'],
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => toggleSection('brands')}
          style={{
            width: '100%',
            padding: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors['surface-container'],
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            color: colors['on-background'],
          }}
        >
          {language === 'ar' ? 'الماركة' : 'Brand'}
          {expandedSections.brands ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.brands && (
          <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {brands.map((brand) => (
              <label
                key={brand}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => onBrandToggle?.(brand)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Stock Filter */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.lg,
          padding: spacing.md,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            cursor: 'pointer',
            fontWeight: 600,
            color: colors['on-background'],
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange?.(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span>{language === 'ar' ? 'المتوفرة فقط' : 'In Stock Only'}</span>
        </label>
      </div>
    </aside>
  );
};
