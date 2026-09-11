import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { colors, spacing, radius, elevation } from '../../styles/design-tokens';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, addToCart, toggleWishlist, isInWishlist, navigateToProduct } = useStore();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        boxShadow: elevation.sm,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = elevation.lg;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = elevation.sm;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: colors['surface-container-low'],
          aspectRatio: '1',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: spacing.md,
              left: spacing.md,
              backgroundColor: colors.error,
              color: colors['on-error'],
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: radius.sm,
              fontSize: '12px',
              fontWeight: 700,
              zIndex: 10,
            }}
          >
            SAVE {discount}%
          </div>
        )}

        {/* Stock Badge */}
        <div
          style={{
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            backgroundColor: product.stockCount > 5 ? colors['status-success'] : colors['status-warning'],
            color: 'white',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: radius.full,
            fontSize: '12px',
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          {language === 'ar'
            ? `متبقي ${product.stockCount || 0}`
            : `${product.stockCount || 0} in stock`}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            bottom: spacing.md,
            right: spacing.md,
            backgroundColor: inWishlist ? colors.primary : 'rgba(255, 255, 255, 0.9)',
            color: inWishlist ? 'white' : colors['on-background'],
            border: 'none',
            borderRadius: radius.full,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            zIndex: 10,
          }}
        >
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Product Image */}
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title.en}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: spacing.md,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: spacing.md,
          gap: spacing.sm,
        }}
      >
        {/* Brand */}
        {product.brand && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: colors['on-surface-variant'],
              textTransform: 'uppercase',
            }}
          >
            {product.brand}
          </span>
        )}

        {/* Title */}
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: colors['on-background'],
            margin: 0,
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {language === 'ar' ? product.title.ar : product.title.en}
        </h3>

        {/* Specs */}
        {product.shortSpecs?.[0] && (
          <span
            style={{
              fontSize: '12px',
              color: colors['on-surface-variant'],
              lineHeight: '1.3',
            }}
          >
            {language === 'ar' ? product.shortSpecs[0].ar : product.shortSpecs[0].en}
          </span>
        )}

        {/* Rating */}
        {product.rating > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              fontSize: '12px',
            }}
          >
            <span style={{ color: colors['status-warning'] }}>★ {product.rating.toFixed(1)}</span>
            <span style={{ color: colors['on-surface-variant'] }}>({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: spacing.xs,
            marginTop: 'auto',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: colors.primary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span
              style={{
                fontSize: '12px',
                color: colors['on-surface-variant'],
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Installment */}
        <div
          style={{
            fontSize: '12px',
            color: colors.primary,
            fontWeight: 600,
          }}
        >
          {language === 'ar'
            ? `من ${Math.round(product.price / 12)} ج.م / شهر`
            : `From ${Math.round(product.price / 12)} EGP / mo`}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          style={{
            backgroundColor: colors.primary,
            color: colors['on-primary'],
            border: 'none',
            borderRadius: radius.md,
            padding: spacing.sm,
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            transition: 'background-color 150ms ease',
            marginTop: spacing.sm,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors['primary-hover'])}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
          <ShoppingCart size={16} />
          {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
