import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { Breadcrumb } from '../common/Breadcrumb';
import { Search } from 'lucide-react';

interface BrandsPageProps {
  products: Product[];
}

/**
 * Browse all brands with product counts and search.
 */
export const BrandsPage: React.FC<BrandsPageProps> = ({ products }) => {
  const { t, goHome } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    return uniqueBrands
      .map(brand => ({
        name: brand,
        slug: brand.toLowerCase().replace(/\s+/g, '-'),
        count: products.filter(p => p.brand === brand).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const filteredBrands = useMemo(
    () =>
      searchQuery.trim()
        ? brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : brands,
    [brands, searchQuery]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: t('navHome'), onClick: goHome },
          { label: t('brands'), active: true },
        ]}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t('shopByBrand')}</h1>
          <p className="text-slate-600 max-w-2xl">{t('brandsDescription')}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchBrands')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">{t('noBrandsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map(brand => (
            <Link
              key={brand.slug}
              to={`/brand/${brand.slug}`}
              className="block p-6 bg-slate-50 rounded-lg hover:bg-slate-100 hover:shadow-md transition-all duration-300 group"
            >
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{brand.count} {t('products')}</p>
            </Link>
          ))}
        </div>
      )}

      {filteredBrands.length > 0 && (
        <p className="text-sm text-slate-500 text-center">
          {t('showingBrands', { count: filteredBrands.length, total: brands.length })}
        </p>
      )}
    </div>
  );
};
