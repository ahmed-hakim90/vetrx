import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Check,
  X,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { activatableCardProps } from '../../core/a11y/activatableCard';
import { Skeleton, ProductGridSkeleton, FilterSidebarSkeleton } from '../feedback';
import { Breadcrumb } from '../common/Breadcrumb';
import { CategoryNotFound } from '../common/NotFoundPage';

type SortBy = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export const ProductListingScreen: React.FC = () => {
  const location = useLocation();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    language,
    products,
    categories,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProductId,
    navigateToProduct,
  } = useStore();

  const isSearchRoute = location.pathname === '/search';
  const category = isSearchRoute ? 'all' : categorySlug ?? 'all';
  const searchQuery = isSearchRoute ? searchParams.get('q') ?? '' : '';

  // /category/:slug with an id that doesn't exist in this client's own
  // catalog renders a real "not found" state instead of silently showing
  // every product.
  const categoryExists = category === 'all' || categories.some((c) => c.id === category);

  const brands = useMemo(() => searchParams.getAll('brand'), [searchParams]);
  const minPrice = Number(searchParams.get('minPrice') ?? 0);
  const maxPrice = Number(searchParams.get('maxPrice') ?? 15000);
  const inStockOnly = searchParams.get('inStock') === '1';
  const minRating = Number(searchParams.get('minRating') ?? 0);
  const sortBy = (searchParams.get('sort') as SortBy) || 'featured';
  const viewMode = (searchParams.get('view') as ViewMode) || 'grid';

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  const [isHydrating, setIsHydrating] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrating(true);
    const timer = setTimeout(() => setIsHydrating(false), 500);
    return () => clearTimeout(timer);
  }, [category, searchQuery]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (category !== 'all' && product.category !== category) return false;
        if (brands.length > 0 && !brands.includes(product.brand)) return false;
        if (product.price < minPrice || product.price > maxPrice) return false;
        if (inStockOnly && !product.inStock) return false;
        if (product.rating < minRating) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch =
            product.title.en.toLowerCase().includes(q) ||
            product.title.ar.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q);
          if (!titleMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.badge?.type === 'new' ? 1 : 0) - (a.badge?.type === 'new' ? 1 : 0);
        return b.reviewCount - a.reviewCount;
      });
  }, [products, category, brands, minPrice, maxPrice, inStockOnly, minRating, searchQuery, sortBy]);

  const handleBrandToggle = (brand: string) => {
    updateParams((p) => {
      const current = p.getAll('brand');
      p.delete('brand');
      const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
      next.forEach((b) => p.append('brand', b));
    });
  };

  const resetFilters = () => {
    updateParams((p) => {
      p.delete('brand');
      p.delete('minPrice');
      p.delete('maxPrice');
      p.delete('inStock');
      p.delete('minRating');
    });
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.colors?.[0], product.variants?.storage?.[0]);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (!categoryExists) {
    return <CategoryNotFound />;
  }

  const activeCategoryObj = categories.find((c) => c.id === category);
  const hasActiveFilters = brands.length > 0 || category !== 'all' || inStockOnly || minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-20">
      <Breadcrumb />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSearchRoute
                ? t('searchResultsFor', { query: searchQuery })
                : activeCategoryObj
                ? activeCategoryObj.name[language]
                : t('allProductsTitle')}
            </h1>
            <div className="text-xs text-slate-500 mt-0.5 min-h-[20px] flex items-center gap-1.5">
              {isHydrating ? (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span>{t('showingResults')}</span>
                  <Skeleton variant="text" className="w-10 h-3.5 inline-block" />
                  <span>{t('of')}</span>
                  <Skeleton variant="text" className="w-10 h-3.5 inline-block" />
                  <span>{t('results')}</span>
                </span>
              ) : (
                <>
                  {t('showingResults')} <span className="font-bold text-slate-800">{filteredProducts.length}</span>{' '}
                  {t('of')} <span className="font-bold text-slate-800">{products.length}</span> {t('results')}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <button
              id="mobile-filter-trigger-btn"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden min-h-[44px] flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer touch-manipulation active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t('filters')}</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">{t('sortBy')}</span>
              <select
                id="plp-sort-selector"
                value={sortBy}
                onChange={(e) => updateParams((p) => p.set('sort', e.target.value))}
                aria-label={t('sortBy')}
                className="min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 outline-none cursor-pointer touch-manipulation"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{t('sortRating')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="plp-grid-view-btn"
                onClick={() => updateParams((p) => p.set('view', 'grid'))}
                className={`min-w-11 min-h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer touch-manipulation ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title={t('gridView')}
                aria-label={t('gridView')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="plp-list-view-btn"
                onClick={() => updateParams((p) => p.set('view', 'list'))}
                className={`min-w-11 min-h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer touch-manipulation ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title={t('listView')}
                aria-label={t('listView')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-semibold">{t('filters')}:</span>
            {brands.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                <span>{b}</span>
                <button onClick={() => handleBrandToggle(b)} className="hover:text-slate-950 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <span>{t('inStockOnly')}</span>
                <button onClick={() => updateParams((p) => p.delete('inStock'))} className="hover:text-emerald-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto cursor-pointer">
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {isHydrating ? (
          <FilterSidebarSkeleton className="hidden lg:block sticky top-24" />
        ) : (
          <aside className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>{t('filterBy')}</span>
              </h3>
              <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer">
                {t('clearAll')}
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('priceRange')}</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="250"
                value={maxPrice}
                onChange={(e) => updateParams((p) => p.set('maxPrice', e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(15000)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('brands')}</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t('inStockOnly')}</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParams((p) => (e.target.checked ? p.set('inStock', '1') : p.delete('inStock')))}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('customerRating')}</h4>
              <div className="space-y-1.5 text-xs">
                {[4.8, 4.5, 4.0].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => updateParams((p) => (minRating === ratingVal ? p.delete('minRating') : p.set('minRating', String(ratingVal))))}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-start cursor-pointer ${
                      minRating === ratingVal ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ratingVal} {t('andAbove')}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        <div className="lg:col-span-3">
          {isHydrating ? (
            <ProductGridSkeleton count={6} viewMode={viewMode} columns={3} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('noProductsFound')}</h3>
              <button
                onClick={resetFilters}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    {...activatableCardProps(() => navigateToProduct(product.id))}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xs"
                  >
                    <div className="relative bg-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title[language]}
                        className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                          {product.badge.text[language]}
                        </span>
                      )}
                      <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex flex-col gap-1.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs touch-manipulation active:scale-90 ${
                            inWish ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                          }`}
                          title={t('addToWishlist')}
                          aria-label={t('addToWishlist')}
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProductId(product.id);
                          }}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white backdrop-blur-xs transition-all cursor-pointer shadow-xs touch-manipulation active:scale-90"
                          title={t('quickView')}
                          aria-label={t('quickView')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                          {product.reviewCount > 0 && (
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{product.rating}</span>
                              <span className="text-slate-400">({product.reviewCount})</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {product.title[language]}
                        </h3>
                        {product.shortSpecs?.[0] && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {product.shortSpecs[0][language]}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-base font-black text-slate-900">{formatPrice(product.price)}</div>
                          {product.originalPrice && (
                            <div className="text-[11px] text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={!product.inStock}
                          className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 touch-manipulation active:scale-95"
                          title={product.inStock ? t('addToCart') : t('outOfStock')}
                          aria-label={product.inStock ? t('addToCart') : t('outOfStock')}
                        >
                          {addedId === product.id ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span>{t('addedToCart')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>{product.inStock ? t('addToCart') : t('outOfStock')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    {...activatableCardProps(() => navigateToProduct(product.id))}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-5 items-center cursor-pointer shadow-2xs"
                  >
                    <div className="relative w-full sm:w-44 h-44 bg-slate-50 rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <img src={product.images[0]} alt={product.title[language]} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                      {product.badge && (
                        <span className="absolute top-2 left-2 rtl:left-auto rtl:right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
                          {product.badge.text[language]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                        {product.reviewCount > 0 && (
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400">({product.reviewCount})</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{product.title[language]}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description[language]}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.shortSpecs.map((spec, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {spec[language]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full sm:w-48 pt-4 sm:pt-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-slate-100 sm:pl-5 rtl:sm:pl-0 rtl:sm:pr-5 flex flex-col justify-between gap-3 text-start">
                      <div>
                        <div className="text-xl font-black text-slate-900">{formatPrice(product.price)}</div>
                        {product.originalPrice && <div className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>}
                        <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${product.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {product.inStock ? t('inStock') : t('outOfStock')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={!product.inStock}
                          className="flex-1 min-h-[44px] bg-slate-900 hover:bg-slate-800 active:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                          title={t('addToCart')}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{addedId === product.id ? t('addedToCart') : t('addToCart')}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProductId(product.id);
                          }}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer touch-manipulation active:scale-90"
                          title={t('quickView')}
                          aria-label={t('quickView')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-slate-200 transition-colors cursor-pointer touch-manipulation active:scale-90 ${
                            inWish ? 'bg-rose-50 text-rose-500 border-rose-200' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                          title={t('addToWishlist')}
                          aria-label={t('addToWishlist')}
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label={t('close')}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-default"
          />
          <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-0 sm:pl-10 rtl:pr-0 rtl:sm:pr-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-white p-5 flex flex-col justify-between shadow-2xl">
              <div className="space-y-5 overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    <h3 className="font-black text-sm text-slate-900 uppercase">{t('filters')}</h3>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 transition-colors touch-manipulation"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t('brands')}</h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {availableBrands.map((b) => (
                      <label key={b} className="min-h-11 flex items-center gap-3 text-xs text-slate-700 cursor-pointer hover:text-slate-950 px-1 touch-manipulation">
                        <input
                          type="checkbox"
                          checked={brands.includes(b)}
                          onChange={() => handleBrandToggle(b)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="font-medium">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="min-h-[44px] flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800">{t('inStockOnly')}</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateParams((p) => (e.target.checked ? p.set('inStock', '1') : p.delete('inStock')))}
                    className="rounded text-blue-600 w-5 h-5 cursor-pointer touch-manipulation"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 min-h-[44px] py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer touch-manipulation"
                >
                  {t('clearAll')}
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 min-h-[44px] py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer touch-manipulation"
                >
                  {t('showingResults')} ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
