import React from 'react';
import { Product } from '../../types/store';
import { colors, spacing, container } from '../../styles/design-tokens';
import { ProductCard } from './ProductCard';

interface PLPGridProps {
  products: Product[];
  loading?: boolean;
}

export const PLPGrid: React.FC<PLPGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: colors['surface-container'],
              borderRadius: '12px',
              height: '300px',
              animation: 'pulse 2s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: spacing.xl,
          color: colors['on-surface-variant'],
        }}
      >
        <p style={{ fontSize: '16px', margin: 0 }}>No products found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: spacing.lg,
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
