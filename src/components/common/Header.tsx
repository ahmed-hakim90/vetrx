import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Globe,
  Store,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Home as HomeIcon,
  X,
  Menu,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORES, PRODUCTS } from '../../data/mockData';
import { StoreId, Screen, Language, Currency } from '../../types/store';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    activeStore,
    setActiveStore,
    currentStoreConfig,
    activeScreen,
    setActiveScreen,
    cartCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    t,
    formatPrice,
    navigateToProduct,
    navigateToCategory,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search popover when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered live search suggestions
  const searchResults = headerQuery.trim()
    ? PRODUCTS.filter((p) => {
        const query = headerQuery.toLowerCase();
        return (
          p.title.en.toLowerCase().includes(query) ||
          p.title.ar.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }).slice(0, 5)
    : [];

  const handleSelectProduct = (productId: string) => {
    setHeaderQuery('');
    setSearchOpen(false);
    navigateToProduct(productId);
  };

  const navCategories = [
    { id: 'smartphones', name: t('navPhones'), icon: Smartphone },
    { id: 'laptops', name: t('navLaptops'), icon: Laptop },
    { id: 'audio', name: t('navAudio'), icon: Headphones },
    { id: 'gaming', name: t('navGaming'), icon: Gamepad2 },
    { id: 'smarthome', name: t('navSmartHome'), icon: HomeIcon },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-tight">
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-amber-400/20 text-amber-300">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
            <span>{t('topAnnouncement')}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t('authorizedGCCWarranty')}
            </span>
            <span className="hidden lg:inline text-slate-500">|</span>
            <span className="font-semibold text-slate-200">{t('supportHotline')}</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Store & Brand Switcher Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-slate-600 hidden sm:inline">{t('selectStore')}:</span>
            <div className="flex items-center gap-1.5">
              {STORES.map((s) => {
                const isActive = s.id === activeStore;
                return (
                  <button
                    key={s.id}
                    id={`store-switcher-${s.id}`}
                    onClick={() => setActiveStore(s.id)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.primaryColor }}
                    />
                    <span>{s.name[language]}</span>
                    {isActive && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full hidden md:inline">
                        {s.badge[language]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Screen Switcher for review ease */}
          <div className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
            {(['home', 'plp', 'pdp', 'checkout'] as Screen[]).map((scr) => (
              <button
                key={scr}
                id={`screen-nav-${scr}`}
                onClick={() => setActiveScreen(scr)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  activeScreen === scr
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {scr === 'home' && '1. Homepage'}
                {scr === 'plp' && '2. PLP (Catalog)'}
                {scr === 'pdp' && '3. PDP (Details)'}
                {scr === 'checkout' && '4. Cart & Checkout'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Store Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2.5 text-start cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md transition-transform group-hover:scale-105"
              style={{
                backgroundColor: currentStoreConfig.primaryColor,
              }}
            >
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {currentStoreConfig.name[language]}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  GCC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-[220px]">
                {currentStoreConfig.tagline[language]}
              </p>
            </div>
          </button>
        </div>

        {/* Live Search Input with Suggestions */}
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
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-sm pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {headerQuery && (
              <button
                onClick={() => setHeaderQuery('')}
                className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Popover */}
          {searchOpen && (
            <div className="absolute top-full mt-2 inset-x-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {searchResults.length > 0 ? (
                <div>
                  <div className="text-xs font-semibold text-slate-400 px-2 mb-2 uppercase tracking-wider">
                    {t('results')}
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-start cursor-pointer"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.title[language]}
                          className="w-10 h-10 rounded-md object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {prod.title[language]}
                          </p>
                          <p className="text-xs text-slate-500">{prod.brand}</p>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {formatPrice(prod.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : headerQuery ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  {t('noProductsFound')}
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-slate-400 px-2 mb-2 uppercase tracking-wider">
                    {t('searchSuggestions')}
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {['iPhone 16 Pro', 'RTX 4080', 'Sony WH-1000XM5', 'Roborock S8', 'MacBook M4'].map(
                      (sug) => (
                        <button
                          key={sug}
                          onClick={() => {
                            setHeaderQuery(sug);
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                        >
                          {sug}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Language, Currency, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              id="lang-btn-en"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-ar"
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 rounded transition-all cursor-pointer font-['Cairo'] ${
                language === 'ar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <select
              id="currency-selector"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label={t('currency')}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="AED">AED (د.إ)</option>
              <option value="SAR">SAR (ر.س)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* Wishlist Button */}
          <button
            id="header-wishlist-btn"
            onClick={() => setActiveScreen('plp')}
            className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={t('wishlist')}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-start">
              <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">
                {t('cart')}
              </div>
              <div className="text-xs font-bold leading-tight">{formatPrice(cartSubtotal)}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Category Navigation Bar (Desktop) */}
      <div className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 py-1">
            <button
              onClick={() => setActiveScreen('plp')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-4 h-4 text-blue-600" />
              <span>{t('categoriesMega')}</span>
            </button>

            <button
              onClick={() => setActiveScreen('home')}
              className={`px-3 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                activeScreen === 'home'
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigateToCategory('all');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('navFlashDeals')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setActiveScreen('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-50 font-semibold text-slate-800 text-start"
            >
              {t('navHome')}
            </button>
            <button
              onClick={() => {
                setActiveScreen('plp');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-50 font-semibold text-slate-800 text-start"
            >
              {t('navProducts')}
            </button>
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  navigateToCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 font-medium text-slate-700 text-start"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('selectStore')}</span>
            <div className="flex gap-1">
              {STORES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStore(s.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded font-semibold ${
                    activeStore === s.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {s.name[language]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
