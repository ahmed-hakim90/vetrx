import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { Breadcrumb } from '../common/Breadcrumb';
import { NotFoundPage } from '../common/NotFoundPage';
import { ProductCard } from '../common/ProductCard';

interface BrandPageProps {
  products: Product[];
}

/**
 * Single brand page with filtered products.
 */
export const BrandPage: React.FC<BrandPageProps> = ({ products }) => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { t, goHome } = useStore();

  const brandName = useMemo(() => {
    const brandProducts = products.filter(
      p => p.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug?.toLowerCase()
    );
    return brandProducts.length > 0 ? brandProducts[0].brand : null;
  }, [products, brandSlug]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        p => p.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug?.toLowerCase()
      ),
    [products, brandSlug]
  );

  if (!brandName || filteredProducts.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: t('navHome'), onClick: goHome },
          { label: t('brands'), onClick: () => window.location.href = '/brands' },
          { label: brandName, active: true },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{brandName}</h1>
        <p className="text-slate-600">
          {filteredProducts.length} {t('products')}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
