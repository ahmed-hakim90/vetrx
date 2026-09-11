import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';
import { getCategoryIcon } from '../../core/catalog/categoryIcons';
import { colors, spacing, radius, container, typography } from '../../styles/design-tokens';

interface HomeCategoriesSectionProps {
  categories: Category[];
}

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({ categories }) => {
  const { language, navigateToCategory } = useStore();

  if (categories.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: container.maxWidth,
        margin: '0 auto',
        padding: `${spacing.xl} 1rem`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: colors['on-background'],
          }}
        >
          {language === 'ar' ? 'استكشف الفئات الرئيسية' : 'Explore Core Tech Categories'}
        </h2>
        <a
          href="#"
          style={{
            color: colors.primary,
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            textDecoration: 'none',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors['primary-hover'])}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
        >
          {language === 'ar' ? 'اعرض الكل' : 'View All'}
          <ChevronRight size={16} />
        </a>
      </div>

      {/* Categories Grid - 6 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: spacing.md,
        }}
      >
        {categories.slice(0, 6).map((category) => {
          const IconComponent = getCategoryIcon(category.id);
          return (
            <button
              key={category.id}
              onClick={() => navigateToCategory(category.slug)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: radius.lg,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors['surface-container-low'];
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: radius.md,
                  backgroundColor: colors['surface-container'],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 150ms ease',
                }}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name.en}
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  IconComponent && <IconComponent size={24} style={{ color: colors['on-surface-variant'] }} />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: colors['on-background'],
                    lineClamp: '2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {language === 'ar' ? category.name.ar : category.name.en}
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: colors['on-surface-variant'],
                    marginTop: spacing.xs,
                  }}
                >
                  {category.count || 0} {language === 'ar' ? 'منتج' : 'products'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
