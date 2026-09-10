import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export interface ProductGridSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 6,
  viewMode = 'grid',
  columns = 4,
  className = '',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'list') {
    return (
      <div className={`space-y-4 ${className}`} aria-label="Loading products list">
        {items.map((key) => (
          <ProductCardSkeleton key={key} viewMode="list" />
        ))}
      </div>
    );
  }

  const gridColsClass =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div
      className={`grid ${gridColsClass} gap-4 sm:gap-5 ${className}`}
      aria-label="Loading products grid"
    >
      {items.map((key) => (
        <ProductCardSkeleton key={key} viewMode="grid" />
      ))}
    </div>
  );
};
