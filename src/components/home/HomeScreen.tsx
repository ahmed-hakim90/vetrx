import React, { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Clock,
  Sparkles,
  Flame,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Home as HomeIcon,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES, BRAND_LOGOS } from '../../data/mockData';
import { Product } from '../../types/store';

export const HomeScreen: React.FC = () => {
  const {
    language,
    currentStoreConfig,
    activeStore,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
    navigateToCategory,
    setActiveScreen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'new' | 'sale'>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Live countdown timer for Deal of the Day (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  // Filter products for the current store and active tab
  const storeProducts = PRODUCTS.filter(
    (p) => activeStore === 'voltix' || p.storeId === activeStore
  );

  const displayedProducts = storeProducts.filter((p) => {
    if (activeTab === 'bestseller') return p.rating >= 4.8;
    if (activeTab === 'new') return p.badge?.type === 'new' || p.isFeatured;
    if (activeTab === 'sale') return Boolean(p.originalPrice && p.originalPrice > p.price);
    return true;
  });

  const flashDealProduct = PRODUCTS.find((p) => p.isFlashDeal && (activeStore === 'voltix' || p.storeId === activeStore)) || PRODUCTS[3];

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.variants?.colors?.[0],
      product.variants?.storage?.[0]
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1600);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Laptop': return Laptop;
      case 'Headphones': return Headphones;
      case 'Gamepad2': return Gamepad2;
      case 'Watch': return Watch;
      case 'Home': return HomeIcon;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-2xl mx-4 lg:mx-auto max-w-7xl mt-4 border border-slate-800 shadow-xl">
        {/* Glow background elements */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: currentStoreConfig.primaryColor }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentStoreConfig.accentColor }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {t('heroTitle')}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              {t('heroSubtitle')}
            </p>

            {/* Quick Tech Specs Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                <div className="text-base sm:text-lg font-black text-white">{t('heroStat1')}</div>
                <div className="text-[11px] text-slate-400">{t('heroStat1Label')}</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                <div className="text-base sm:text-lg font-black text-blue-400">{t('heroStat2')}</div>
                <div className="text-[11px] text-slate-400">{t('heroStat2Label')}</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                <div className="text-base sm:text-lg font-black text-amber-400">{t('heroStat3')}</div>
                <div className="text-[11px] text-slate-400">{t('heroStat3Label')}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-shop-now"
                onClick={() => navigateToCategory('all')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>{t('heroCtaPrimary')}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              <button
                id="hero-cta-explore-specs"
                onClick={() => navigateToProduct('prod-iphone-16-pro-max')}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                {t('heroCtaSecondary')}
              </button>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group cursor-pointer" onClick={() => navigateToProduct('prod-iphone-16-pro-max')}>
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=85"
                alt="Voltix Flagship Phone"
                className="w-full max-w-sm rounded-2xl shadow-2xl object-cover border border-slate-700/60 transform transition-transform group-hover:scale-103 duration-300"
              />
              <div className="absolute -bottom-4 -left-4 rtl:-left-auto rtl:-right-4 bg-white/95 backdrop-blur-md text-slate-950 p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Official GCC Stock</div>
                  <div className="text-xs font-black text-slate-900">Apple iPhone 16 Pro Max</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('valueProp1Title')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('valueProp1Desc')}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('valueProp2Title')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('valueProp2Desc')}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('valueProp3Title')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('valueProp3Desc')}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('valueProp4Title')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('valueProp4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Flash Deal of the Day */}
      {flashDealProduct && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-rose-800/60 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Countdown & Info */}
              <div className="space-y-4 max-w-xl text-center md:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30">
                  <Flame className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
                  <span>{t('flashDealsTitle')}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {flashDealProduct.title[language]}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                  {flashDealProduct.description[language]}
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                  <span className="text-xs text-rose-200 font-semibold flex items-center gap-1.5 mr-2">
                    <Clock className="w-4 h-4 text-rose-300" />
                    {t('endsIn')}:
                  </span>
                  <div className="bg-slate-900/90 border border-rose-500/30 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-base font-black text-rose-300">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] block text-slate-400">{t('hours')}</span>
                  </div>
                  <span className="text-rose-400 font-bold">:</span>
                  <div className="bg-slate-900/90 border border-rose-500/30 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-base font-black text-rose-300">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] block text-slate-400">{t('minutes')}</span>
                  </div>
                  <span className="text-rose-400 font-bold">:</span>
                  <div className="bg-slate-900/90 border border-rose-500/30 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-base font-black text-rose-300">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] block text-slate-400">{t('seconds')}</span>
                  </div>
                </div>

                {/* Sold percentage bar */}
                <div className="space-y-1.5 max-w-sm pt-1">
                  <div className="flex justify-between text-[11px] text-rose-200">
                    <span>
                      {flashDealProduct.flashDealSoldPercentage || 78}% {t('sold')}
                    </span>
                    <span>
                      {t('hurryOnly')} {flashDealProduct.stockCount} {t('itemsLeft')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-rose-800/60">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${flashDealProduct.flashDealSoldPercentage || 78}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Product Spotlight & Quick Buy */}
              <div className="bg-white text-slate-900 rounded-xl p-5 shadow-2xl max-w-xs w-full text-center space-y-3">
                <img
                  src={flashDealProduct.images[0]}
                  alt={flashDealProduct.title[language]}
                  className="w-48 h-48 mx-auto rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {formatPrice(flashDealProduct.price)}
                    </span>
                    {flashDealProduct.originalPrice && (
                      <span className="text-sm line-through text-slate-400 font-medium">
                        {formatPrice(flashDealProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-rose-600 mt-0.5">
                    {flashDealProduct.badge?.text[language]}
                  </div>
                </div>

                <button
                  id="flash-deal-claim-btn"
                  onClick={(e) => handleQuickAdd(flashDealProduct, e)}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {addedProductId === flashDealProduct.id
                      ? t('addedToCart')
                      : t('addToCart')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Shop by Category Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('shopByCategory')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('exploreCategorySubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigateToCategory('all')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllCategories')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = getCategoryIcon(cat.icon);
            return (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.id)}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center flex flex-col items-center cursor-pointer shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center mb-3 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name[language]}
                </h4>
                <span className="text-[10px] text-slate-500 mt-1">
                  {cat.count} {t('items')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Electronics with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('featuredTitle')}
            </h3>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabAll')}
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'bestseller'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabBestSellers')}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabNewArrivals')}
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sale'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabOnSale')}
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedProducts.map((product) => {
            const inWish = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                onClick={() => navigateToProduct(product.id)}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Image Container with Badges & Wishlist */}
                <div className="relative bg-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title[language]}
                    className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                      {product.badge.text[language]}
                    </span>
                  )}

                  {/* Wishlist button */}
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

                {/* Content */}
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

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {product.title[language]}
                    </h4>

                    {/* Short specs pill */}
                    {product.shortSpecs?.[0] && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {product.shortSpecs[0][language]}
                      </p>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
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
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center"
                      title={t('addToCart')}
                    >
                      {addedProductId === product.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigateToCategory('all')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <span>{t('viewMore')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Dual Bento Feature Banners */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Audio */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-8 border border-slate-800 flex flex-col justify-between min-h-[260px] shadow-md group">
          <div className="relative z-10 space-y-3 max-w-sm">
            <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              {t('bento1Badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {t('bento1Title')}
            </h3>
            <p className="text-xs text-slate-300">{t('bento1Desc')}</p>
            <button
              onClick={() => navigateToCategory('audio')}
              className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('bento1Cta')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
            alt="Audio"
            className="absolute right-0 bottom-0 rtl:right-auto rtl:left-0 w-64 h-64 object-contain opacity-40 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          />
        </div>

        {/* Banner 2: Gaming */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white p-8 border border-zinc-800 flex flex-col justify-between min-h-[260px] shadow-md group">
          <div className="relative z-10 space-y-3 max-w-sm">
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {t('bento2Badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {t('bento2Title')}
            </h3>
            <p className="text-xs text-slate-300">{t('bento2Desc')}</p>
            <button
              onClick={() => navigateToCategory('gaming')}
              className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('bento2Cta')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80"
            alt="Gaming"
            className="absolute right-0 bottom-0 rtl:right-auto rtl:left-0 w-64 h-64 object-contain opacity-40 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          />
        </div>
      </section>

      {/* 7. Official Authorized Brand Logos */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            {t('authorizedBrands')}
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {BRAND_LOGOS.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  navigateToCategory('all');
                }}
                className="text-sm sm:text-base font-black text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
