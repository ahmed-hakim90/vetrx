import React from 'react';
import { ArrowRight, ArrowLeft, Flame, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { colors, spacing, radius, container } from '../../styles/design-tokens';

interface HomeHeroSectionProps {
  featuredProduct: Product | undefined;
  promoProduct: Product | undefined;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  featuredProduct,
  promoProduct,
}) => {
  const { language, formatPrice, navigateToProduct } = useStore();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      style={{
        maxWidth: container.maxWidth,
        margin: '0 auto',
        padding: `${spacing.lg} 1rem`,
      }}
    >
      {/* Ticker Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          backgroundColor: colors['surface-container-low'],
          padding: `${spacing.sm} 1rem`,
          borderRadius: radius.md,
          marginBottom: spacing.lg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: `0.25rem 0.5rem`,
              borderRadius: radius.full,
              backgroundColor: colors['tertiary-container'],
              color: colors.tertiary,
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            OFFICIAL PARTNER
          </span>
          <span style={{ fontSize: '14px', color: colors['on-surface-variant'] }}>
            {language === 'ar'
              ? 'توصيل في نفس اليوم متاح على الطلبات المُسجلة قبل الساعة 2:00 ظهراً'
              : 'Cairo & Giza Same-Day Delivery available on orders placed before 2:00 PM'}
          </span>
        </div>
      </div>

      {/* Main Grid: 8 Cols Left + 4 Cols Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {/* Primary Featured Banner (8 Cols / 2/3 width) */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: spacing.xl,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '384px',
            gridColumn: 'span 2',
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: 'absolute',
              right: '-64px',
              top: '-64px',
              width: '384px',
              height: '384px',
              backgroundColor: 'rgba(0, 74, 198, 0.1)',
              borderRadius: '50%',
              filter: 'blur(64px)',
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <span
                  style={{
                    backgroundColor: colors.primary,
                    color: colors['on-primary'],
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: `0.25rem 0.5rem`,
                    borderRadius: radius.sm,
                  }}
                >
                  PRO COMPUTING
                </span>
                <span style={{ fontSize: '12px', color: colors['on-surface-variant'] }}>
                  {language === 'ar' ? 'M3 Max و Core Ultra 9 الرائدة' : 'M3 Max & Core Ultra 9 Flagships'}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  color: colors.error,
                  padding: `0.25rem 0.75rem`,
                  borderRadius: radius.full,
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Flame size={14} />
                {language === 'ar' ? 'وفر حتى ٨,٠٠٠ ج.م' : 'Save up to 8,000 EGP'}
              </div>
            </div>

            {/* Heading & Description */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {language === 'ar' ? 'مصممة للعمل الثقيل' : 'Engineered for Extreme Workloads'}
                </p>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: colors['on-background'],
                    lineHeight: '1.2',
                  }}
                >
                  {featuredProduct?.title[language] ||
                    (language === 'ar' ? 'Apple MacBook Pro M3 Max و Dell XPS 16' : 'Apple MacBook Pro M3 Max & Dell XPS 16')}
                </h1>
                <p style={{ fontSize: '14px', color: colors['on-surface-variant'], lineHeight: '1.5' }}>
                  {featuredProduct?.shortSpecs?.[0]?.[language] ||
                    (language === 'ar'
                      ? 'كثافة حاسوبية لا مثيل لها مع ضمان رسمي'
                      : 'Unrivaled computing density with official warranty')}
                </p>

                {/* Installment Info */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors['surface-container-low'],
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: radius.md,
                    fontSize: '14px',
                    marginTop: spacing.sm,
                    width: 'fit-content',
                  }}
                >
                  <Zap size={16} style={{ color: colors.primary }} />
                  <span>
                    {language === 'ar' ? 'من 1,250 ج.م / شهر' : 'From 1,250 EGP / mo with 0% interest'}
                  </span>
                </div>
              </div>

              {/* Product Image */}
              {featuredProduct?.images?.[0] && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.title.en}
                    style={{
                      width: '100%',
                      maxHeight: '192px',
                      objectFit: 'contain',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}>
              <button
                onClick={() => navigateToProduct(featuredProduct?.id || '')}
                style={{
                  backgroundColor: colors.primary,
                  color: colors['on-primary'],
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: radius.md,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors['primary-hover'])}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                <span>{language === 'ar' ? 'تسوق الآن' : 'Shop Now'}</span>
                <ArrowIcon size={16} />
              </button>
              <button
                style={{
                  backgroundColor: colors['surface-container'],
                  color: colors['on-surface'],
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: radius.md,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors['surface-container-high'])}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors['surface-container'])}
              >
                <Zap size={16} style={{ color: colors.primary }} />
                <span>{language === 'ar' ? 'احسب التقسيط' : 'Calculate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Stacked Promos (4 Cols / 1/3 width) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
            gridColumn: 'span 1',
          }}
        >
          {/* Promo 1 */}
          {promoProduct && (
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 74, 198, 0.1)',
                    color: colors.primary,
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: `0.25rem 0.5rem`,
                    borderRadius: radius.sm,
                    display: 'inline-block',
                    textTransform: 'uppercase',
                  }}
                >
                  {language === 'ar' ? 'حصري الألعاب' : 'GAMING'}
                </span>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: colors['on-background'], marginTop: spacing.sm }}>
                  {promoProduct.title[language]}
                </h3>
                <p style={{ fontSize: '12px', color: colors['on-surface-variant'], marginTop: spacing.xs, lineHeight: '1.4' }}>
                  {promoProduct.shortSpecs?.[0]?.[language] || promoProduct.title[language]}
                </p>
              </div>

              <div style={{ margin: `${spacing.md} 0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: colors.primary, fontVariantNumeric: 'tabular-nums' }}>
                    {formatPrice(promoProduct.price)}
                  </div>
                  {promoProduct.originalPrice && (
                    <div style={{ fontSize: '12px', color: colors['on-surface-variant'], textDecoration: 'line-through' }}>
                      {formatPrice(promoProduct.originalPrice)}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: colors['status-success'], fontWeight: 600, marginTop: '0.25rem' }}>
                    {language === 'ar' ? 'اقسط من 937 ج.م / شهر' : '937 EGP/mo (36mos)'}
                  </div>
                </div>
                {promoProduct.images?.[0] && (
                  <img src={promoProduct.images[0]} alt={promoProduct.title.en} style={{ width: '96px', height: '96px', objectFit: 'contain' }} />
                )}
              </div>

              <button
                onClick={() => navigateToProduct(promoProduct.id)}
                style={{
                  backgroundColor: colors.primary,
                  color: colors['on-primary'],
                  fontWeight: 600,
                  fontSize: '14px',
                  width: '100%',
                  padding: spacing.sm,
                  borderRadius: radius.md,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors['primary-hover'])}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Promo 2 */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(135deg, rgba(0, 74, 198, 0.05) 0%, rgba(0, 74, 198, 0.02) 100%)`,
              borderRadius: radius.lg,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: spacing.md,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Zap size={32} style={{ color: colors.primary, marginBottom: spacing.sm }} />
            <h3 style={{ fontWeight: 700, color: colors['on-background'] }}>
              {language === 'ar' ? 'عرض آخر قادم' : 'More Offers Coming'}
            </h3>
            <p style={{ fontSize: '12px', color: colors['on-surface-variant'], marginTop: spacing.xs }}>
              {language === 'ar' ? 'تحقق قريباً من المزيد' : 'Check back soon'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
