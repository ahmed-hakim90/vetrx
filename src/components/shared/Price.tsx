import React from 'react';
import { colors } from '../../styles/design-tokens';

interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  currency?: 'EGP' | 'SAR' | 'AED';
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'error';
  currencySymbol?: { en: string; ar: string };
  language?: 'en' | 'ar';
  showDiscount?: boolean;
}

const currencySymbols = {
  EGP: { en: 'EGP', ar: 'ج.م' },
  SAR: { en: 'SAR', ar: 'ر.س' },
  AED: { en: 'AED', ar: 'د.إ' },
} as const;

const sizeStyles = {
  sm: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  md: {
    fontSize: '20px',
    lineHeight: '26px',
    fontWeight: 700,
  },
  lg: {
    fontSize: '32px',
    lineHeight: '36px',
    fontWeight: 700,
  },
} as const;

const variantColors = {
  primary: colors.primary,
  success: colors['status-success'],
  error: colors.error,
} as const;

export const Price = React.forwardRef<HTMLDivElement, PriceProps>(
  (
    {
      amount,
      currency = 'EGP',
      originalAmount,
      size = 'md',
      variant = 'primary',
      currencySymbol: customSymbol,
      language = 'en',
      showDiscount = !!originalAmount,
      className = '',
      ...props
    },
    ref
  ) => {
    const symbol = customSymbol || currencySymbols[currency];
    const sizeStyle = sizeStyles[size];
    const discount = originalAmount
      ? Math.round(((originalAmount - amount) / originalAmount) * 100)
      : 0;

    const baseStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontVariantNumeric: 'tabular-nums',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    };

    const priceContainerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px',
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
    };

    const priceValueStyles: React.CSSProperties = {
      fontSize: sizeStyle.fontSize,
      lineHeight: sizeStyle.lineHeight,
      fontWeight: sizeStyle.fontSize === '14px' ? 500 : 700,
      color: variantColors[variant],
      fontVariantNumeric: 'tabular-nums',
    };

    const currencyStyles: React.CSSProperties = {
      fontSize: `${parseInt(sizeStyle.fontSize) * 0.75}px`,
      color: colors['on-surface-variant'],
      fontWeight: 500,
    };

    const originalPriceStyles: React.CSSProperties = {
      fontSize: `${parseInt(sizeStyle.fontSize) * 0.8}px`,
      color: colors['on-surface-variant'],
      textDecoration: 'line-through',
      textDecorationColor: colors.error,
      textDecorationThickness: '2px',
      textUnderlineOffset: '2px',
      fontVariantNumeric: 'tabular-nums',
    };

    const discountBadgeStyles: React.CSSProperties = {
      fontSize: '11px',
      fontWeight: 600,
      color: colors['on-error'],
      backgroundColor: colors.error,
      padding: '2px 6px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
    };

    const formatPrice = (num: number) => {
      return Math.round(num).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    };

    return (
      <div ref={ref} style={baseStyles} className={`price price-${size} ${className}`} {...props}>
        <div style={priceContainerStyles}>
          <div>
            <span style={priceValueStyles}>{formatPrice(amount)}</span>
            <span style={currencyStyles}>{symbol[language]}</span>
          </div>
          {showDiscount && discount > 0 && <div style={discountBadgeStyles}>SAVE {discount}%</div>}
        </div>

        {originalAmount && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={originalPriceStyles}>
              {formatPrice(originalAmount)} {symbol[language]}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Price.displayName = 'Price';
