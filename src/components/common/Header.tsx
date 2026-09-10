import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  X,
  Menu,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Currency } from '../../types/store';
import { getCategoryIcon } from '../../core/catalog/categoryIcons';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    client,
    products,
    cartCount,
    cartSubtotal,
    wishlist,
    t,
    formatPrice,
    navigateToProduct,
    navigateToCategory,
    goHome,
    goToProducts,
    goToCart,
    goToWishlist,
  } = useStore();

  const location = useLocation();
  const params = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = headerQuery.trim()
    ? products
        .filter((p) => {
          const query = headerQuery.toLowerCase();
          return (
            p.title.en.toLowerCase().includes(query) ||
            p.title.ar.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
          );
        })
        .slice(0, 5)
    : [];

  const handleSelectProduct = (productId: string) => {
    setHeaderQuery('');
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    navigateToProduct(productId);
  };

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const navCategories = client.navigationCategories.map((cat) => ({
    id: cat.id,
    name: cat.label[language],
    icon: getCategoryIcon(cat.icon),
  }));

  const isHomeActive = location.pathname === '/';
  const isCategoryActive = (id: string) => location.pathname === `/category/${id}` || (location.pathname === '/products' && params.categorySlug === id);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-300">
      {client.home.announcementBar && (
        <div
          className={`bg-slate-900 text-slate-200 text-xs px-4 border-slate-800 transition-all duration-300 ease-in-out ${
            isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden border-b-0' : 'max-h-16 py-1.5 sm:py-2 border-b opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2 font-medium tracking-tight text-[11px] sm:text-xs min-w-0 w-full sm:w-auto">
              <span className="inline-flex items-center justify-center p-1 rounded-full bg-amber-400/20 text-amber-300 shrink-0">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </span>
              <span className="truncate min-w-0">{client.home.announcementBar[language]}</span>
            </div>
            {(client.policies.warrantyPolicy || client.contact.supportPhoneDisplay) && (
              <div className="flex items-center gap-4 text-slate-300 text-[11px] sm:text-xs min-w-0 shrink-0">
                {client.policies.warrantyPolicy && (
                  <span className="hidden md:inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {client.policies.warrantyPolicy[language]}
                  </span>
                )}
                {client.policies.warrantyPolicy && client.contact.supportPhoneDisplay && (
                  <span className="hidden lg:inline text-slate-500">|</span>
                )}
                {client.contact.supportPhoneDisplay && (
                  <span className="font-semibold text-slate-200" dir="ltr">
                    {client.contact.supportPhoneDisplay}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-200 ${
          isScrolled ? 'py-2' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center cursor-pointer touch-manipulation transition-transform active:scale-95 shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={goHome}
            className="flex items-center gap-2 sm:gap-2.5 text-start cursor-pointer group min-h-[44px] touch-manipulation min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-primary-foreground bg-primary font-black text-lg sm:text-xl shadow-md transition-transform group-hover:scale-105 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-tight truncate">
                  {client.displayName[language]}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1 max-w-[140px] sm:max-w-[220px]">
                {client.tagline[language]}
              </p>
            </div>
          </button>
        </div>

        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              id="main-store-search-input"
              value={headerQuery}
              onChange={(e) => {
                setHeaderQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(headerQuery);
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-sm pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {headerQuery && (
              <button
                onClick={() => setHeaderQuery('')}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center absolute right-1.5 rtl:right-auto rtl:left-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchOpen && (
            <div className="absolute top-full mt-2 inset-x-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {searchResults.length > 0 ? (
                <div>
                  <div className="text-xs font-semibold text-slate-400 px-2 mb-2 uppercase tracking-wider">{t('results')}</div>
                  <div className="space-y-1">
                    {searchResults.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.id)}
                        className="w-full min-h-[44px] flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-start cursor-pointer touch-manipulation"
                      >
                        <img src={prod.images[0]} alt={prod.title[language]} className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{prod.title[language]}</p>
                          <p className="text-xs text-slate-500">{prod.brand}</p>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{formatPrice(prod.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : headerQuery ? (
                <div className="p-4 text-center text-sm text-slate-500">{t('noProductsFound')}</div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            id="mobile-search-toggle-btn"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer touch-manipulation active:scale-95 ${
              mobileSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Search catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              id="lang-btn-en"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[36px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer touch-manipulation flex items-center justify-center ${
                language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-ar"
              onClick={() => setLanguage('ar')}
              aria-pressed={language === 'ar'}
              className={`min-h-[36px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer touch-manipulation flex items-center justify-center font-['Cairo'] ${
                language === 'ar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              العربية
            </button>
          </div>

          {client.currencies.length > 1 && (
            <div className="relative hidden sm:block">
              <select
                id="currency-selector"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label={t('currency')}
                className="min-h-[40px] sm:min-h-[36px] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-primary touch-manipulation"
              >
                {client.currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol[language]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {client.featureFlags.wishlistEnabled && (
            <button
              id="header-wishlist-btn"
              onClick={goToWishlist}
              className="hidden sm:flex min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all cursor-pointer items-center justify-center relative touch-manipulation active:scale-95"
              title={t('wishlist')}
              aria-label={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs pointer-events-none">
                  {wishlist.length}
                </span>
              )}
            </button>
          )}

          <button
            id="header-cart-btn"
            onClick={goToCart}
            className="min-h-[44px] min-w-[44px] sm:min-w-0 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white px-3 sm:px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer touch-manipulation active:scale-95"
            aria-label={t('cart')}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-start">
              <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">{t('cart')}</div>
              <div className="text-xs font-bold leading-tight">{formatPrice(cartSubtotal)}</div>
            </div>
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(headerQuery);
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100 text-slate-900 text-sm pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-2.5 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {headerQuery && (
              <button
                onClick={() => setHeaderQuery('')}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center absolute right-1 rtl:right-auto rtl:left-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {headerQuery.trim() && searchResults.length > 0 && (
            <div className="mt-2 bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1 max-h-60 overflow-y-auto">
              {searchResults.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod.id)}
                  className="w-full min-h-[44px] flex items-center gap-2.5 p-2 rounded-lg hover:bg-white text-start transition-colors cursor-pointer touch-manipulation"
                >
                  <img src={prod.images[0]} alt={prod.title[language]} className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{prod.title[language]}</p>
                    <p className="text-[11px] text-blue-600 font-semibold">{formatPrice(prod.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 py-1">
            <button
              onClick={goToProducts}
              className="min-h-[38px] flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-4 h-4 text-blue-600" />
              <span>{t('categoriesMega')}</span>
            </button>

            <button
              onClick={goHome}
              className={`min-h-[38px] px-3 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                isHomeActive ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('navHome')}
            </button>

            {navCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.id)}
                  className={`min-h-[38px] flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                    isCategoryActive(cat.id) ? 'text-blue-600 bg-blue-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToProducts}
              className="min-h-[36px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('navFlashDeals')}</span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(headerQuery);
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-100 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600"
              />
              {headerQuery && (
                <button
                  onClick={() => setHeaderQuery('')}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center absolute right-1 rtl:right-auto rtl:left-1 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {headerQuery.trim() && searchResults.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1 max-h-56 overflow-y-auto">
                {searchResults.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className="w-full min-h-[44px] flex items-center gap-2.5 p-2 rounded-lg hover:bg-white text-start transition-colors cursor-pointer touch-manipulation"
                  >
                    <img src={prod.images[0]} alt={prod.title[language]} className="w-8 h-8 rounded object-contain bg-white border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{prod.title[language]}</p>
                      <p className="text-[10px] text-blue-600 font-semibold">{formatPrice(prod.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('shopByCategory')}</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navCategories.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigateToCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="min-h-[44px] p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 text-start flex items-center gap-2 touch-manipulation"
                  >
                    <IconComp className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
