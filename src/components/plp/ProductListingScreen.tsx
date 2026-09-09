import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  Check,
  X,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { Product } from '../../types/store';

export const ProductListingScreen: React.FC = () => {
  const {
    language,
    activeStore,
    filterState,
    setFilterState,
    resetFilters,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
    setActiveScreen,
  } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Available brands in the catalog
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(PRODUCTS.map((p) => p.brand));
    return Array.from(brandsSet);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Store filtering
      if (activeStore !== 'voltix' && product.storeId !== activeStore) {
        return false;
      }
      // 2. Category filtering
      if (filterState.category !== 'all' && product.category !== filterState.category) {
        return false;
      }
      // 3. Brand filtering
      if (filterState.brands.length > 0 && !filterState.brands.includes(product.brand)) {
        return false;
      }
      // 4. Price filtering
      if (product.price < filterState.minPrice || product.price > filterState.maxPrice) {
        return false;
      }
      // 5. In-stock filtering
      if (filterState.inStockOnly && !product.inStock) {
        return false;
      }
      // 6. Rating filtering
      if (product.rating < filterState.minRating) {
        return false;
      }
      // 7. Search query filtering
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const titleMatch =
          product.title.en.toLowerCase().includes(q) ||
          product.title.ar.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q);
        if (!titleMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.badge?.type === 'new' ? 1 : 0) - (a.badge?.type === 'new' ? 1 : 0);
      return b.reviewCount - a.reviewCount; // 'featured'
    });
  }, [PRODUCTS, activeStore, filterState]);

  const handleBrandToggle = (brand: string) => {
    setFilterState((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
      };
    });
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.variants?.colors?.[0],
      product.variants?.storage?.[0]
    );
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === filterState.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-20">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => setActiveScreen('home')}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          {t('navHome')}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">
          {activeCategoryObj ? activeCategoryObj.name[language] : t('allProductsTitle')}
        </span>
      </nav>

      {/* 2. Top Title & Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name[language] : t('allProductsTitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('showingResults')} <span className="font-bold text-slate-800">{filteredProducts.length}</span> {t('of')} <span className="font-bold text-slate-800">{PRODUCTS.length}</span> {t('results')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Drawer Button */}
            <button
              id="mobile-filter-trigger-btn"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t('filters')}</span>
              {(filterState.brands.length > 0 || filterState.category !== 'all' || filterState.inStockOnly) && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">{t('sortBy')}</span>
              <select
                id="plp-sort-selector"
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                aria-label={t('sortBy')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 outline-none cursor-pointer"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{t('sortRating')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="plp-grid-view-btn"
                onClick={() => setFilterState((prev) => ({ ...prev, viewMode: 'grid' }))}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterState.viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={t('gridView')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="plp-list-view-btn"
                onClick={() => setFilterState((prev) => ({ ...prev, viewMode: 'list' }))}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterState.viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={t('listView')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filterState.category !== 'all' ||
          filterState.brands.length > 0 ||
          filterState.inStockOnly ||
          filterState.minRating > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-semibold">{t('filters')}:</span>

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                <span>{activeCategoryObj?.name[language]}</span>
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, category: 'all' }))}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterState.brands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                <span>{b}</span>
                <button
                  onClick={() => handleBrandToggle(b)}
                  className="hover:text-slate-950 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filterState.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <span>{t('inStockOnly')}</span>
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, inStockOnly: false }))}
                  className="hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto cursor-pointer"
            >
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Grid Layout: Filters Sidebar (Desktop) + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>{t('filterBy')}</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              {t('clearAll')}
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('categoriesMega')}
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, category: 'all' }))}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-start transition-colors cursor-pointer ${
                  filterState.category === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('tabAll')}</span>
                <span className="text-[11px] text-slate-400">{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = filterState.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterState((prev) => ({ ...prev, category: cat.id }))}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-start transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name[language]}</span>
                    <span className="text-[11px] text-slate-400">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('priceRange')}
              </h4>
              <span className="text-xs font-bold text-blue-600">
                {formatPrice(filterState.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="250"
              value={filterState.maxPrice}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(15000)}</span>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('brands')}
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => {
                const checked = filterState.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* In Stock Only Switch */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{t('inStockOnly')}</span>
            <input
              type="checkbox"
              checked={filterState.inStockOnly}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, inStockOnly: e.target.checked }))
              }
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('customerRating')}
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4.8, 4.5, 4.0].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      minRating: prev.minRating === ratingVal ? 0 : ratingVal,
                    }))
                  }
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-start cursor-pointer ${
                    filterState.minRating === ratingVal
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span>
                    {ratingVal} {t('andAbove')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Stream */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('noProductsFound')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your price filters, selecting other brands, or searching for broader terms.
              </p>
              <button
                onClick={resetFilters}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : filterState.viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => navigateToProduct(product.id)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xs"
                  >
                    <div className="relative bg-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title[language]}
                        className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Badges */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                          {product.badge.text[language]}
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs ${
                          inWish
                            ? 'bg-rose-50 text-rose-500'
                            : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
                        }`}
                        title={t('addToWishlist')}
                      >
                        <Heart
                          className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400">({product.reviewCount})</span>
                          </div>
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
                          <div className="text-base font-black text-slate-900">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-[11px] text-slate-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          {addedId === product.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t('addedToCart')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{t('addToCart')}</span>
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
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => navigateToProduct(product.id)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-5 items-center cursor-pointer shadow-2xs"
                  >
                    <div className="relative w-full sm:w-44 h-44 bg-slate-50 rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.title[language]}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 rtl:left-auto rtl:right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
                          {product.badge.text[language]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wider">{product.brand}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {product.title[language]}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {product.description[language]}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.shortSpecs.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {spec[language]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full sm:w-48 pt-4 sm:pt-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-slate-100 sm:pl-5 rtl:sm:pl-0 rtl:sm:pr-5 flex flex-col justify-between gap-3 text-start">
                      <div>
                        <div className="text-xl font-black text-slate-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('inStock')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{addedId === product.id ? t('addedToCart') : t('addToCart')}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`p-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
                            inWish ? 'bg-rose-50 text-rose-500 border-rose-200' : 'text-slate-500 hover:bg-slate-50'
                          }`}
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

      {/* Mobile Filter Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
            <div className="w-screen max-w-xs bg-white p-5 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 uppercase">
                    {t('filters')}
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">{t('brands')}</h4>
                  <div className="space-y-1.5">
                    {availableBrands.map((b) => (
                      <label key={b} className="flex items-center gap-2 text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={filterState.brands.includes(b)}
                          onChange={() => handleBrandToggle(b)}
                          className="rounded text-blue-600"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800">{t('inStockOnly')}</span>
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) =>
                      setFilterState((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                    className="rounded text-blue-600 w-4 h-4"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold"
                >
                  {t('clearAll')}
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  {t('applyPromo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
