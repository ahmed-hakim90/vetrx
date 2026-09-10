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
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { getCategoryIcon } from '../../core/catalog/categoryIcons';
import { activatableCardProps } from '../../core/a11y/activatableCard';
import { paymentMethodLabel } from '../../core/payment/paymentLabels';
import {
  HeroBannerSkeleton,
  CategoryGridSkeleton,
  FlashDealSkeleton,
  ProductGridSkeleton,
} from '../feedback';

export const HomeScreen: React.FC = () => {
  const {
    language,
    client,
    products,
    categories,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProductId,
    navigateToProduct,
    navigateToCategory,
  } = useStore();

  const [isHydrating, setIsHydrating] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'new' | 'sale'>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Initial state hydration simulation to demonstrate improved perceived performance
  useEffect(() => {
    setIsHydrating(true);
    const timer = setTimeout(() => {
      setIsHydrating(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

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

  const displayedProducts = products.filter((p) => {
    if (activeTab === 'bestseller') return p.rating >= 4.8;
    if (activeTab === 'new') return p.badge?.type === 'new' || p.isFeatured;
    if (activeTab === 'sale') return Boolean(p.originalPrice && p.originalPrice > p.price);
    return true;
  });

  const flashDealProduct = products.find((p) => p.isFlashDeal);

  // Category cards shown on the homepage are restricted to this client's own
  // navigation categories; supplementary display data (image, count) comes
  // from the shared demo catalog when available.
  const homeCategories = client.navigationCategories.map((navCat) => ({
    ...navCat,
    image: categories.find((c) => c.id === navCat.id)?.image,
    count: products.filter((p) => p.category === navCat.id).length,
  }));

  // Brand list is derived from this client's own catalog, never a shared list.
  const clientBrands = Array.from(new Set(products.map((p) => p.brand)));

  const citiesServed = Array.from(new Set(client.shipping.zones.flatMap((z) => z.cities)));
  const enabledPaymentLabels = client.paymentMethods
    .filter((p) => p.enabled)
    .map((p) => paymentMethodLabel(p, language));

  // The secondary hero CTA points at either one product or one category
  // (the config schema enforces exactly one).
  const goToHeroSecondaryTarget = () => {
    const { heroSecondaryCtaProductSlug, heroSecondaryCtaCategorySlug } = client.home;
    if (heroSecondaryCtaProductSlug) {
      navigateToProduct(heroSecondaryCtaProductSlug);
    } else if (heroSecondaryCtaCategorySlug) {
      navigateToCategory(heroSecondaryCtaCategorySlug);
    }
  };

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

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Showcase Banner */}
      {isHydrating ? (
        <HeroBannerSkeleton />
      ) : (
        <section className="relative overflow-hidden bg-slate-950 text-white rounded-2xl mx-4 lg:mx-auto max-w-7xl mt-4 border border-slate-800 shadow-xl">
          {/* Glow background elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none bg-primary" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none bg-accent" />

          <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{client.home.heroBadge[language]}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                {client.home.heroTitle[language]}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
                {client.home.heroSubtitle[language]}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                {client.home.heroStats.map((stat, i) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                    <div className="text-base sm:text-lg font-black text-white">{stat.value[language]}</div>
                    <div className="text-[11px] text-slate-400">{stat.label[language]}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-cta-shop-now"
                  onClick={() => navigateToCategory(client.home.heroPrimaryCtaCategorySlug)}
                  className="min-h-[44px] bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer group touch-manipulation active:scale-95"
                >
                  <span>{client.home.heroPrimaryCtaLabel?.[language] ?? t('heroCtaPrimary')}</span>
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </button>

                <button
                  id="hero-cta-explore-specs"
                  onClick={goToHeroSecondaryTarget}
                  className="min-h-[44px] bg-slate-900/90 hover:bg-slate-800 active:bg-slate-950 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center touch-manipulation active:scale-95"
                >
                  {client.home.heroSecondaryCtaLabel?.[language] ?? t('heroCtaSecondary')}
                </button>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 flex justify-center relative">
              <button
                type="button"
                className="relative group cursor-pointer text-start"
                onClick={goToHeroSecondaryTarget}
              >
                <img
                  src={client.home.heroImage}
                  alt={client.home.heroImageAlt[language]}
                  className="w-full max-w-sm rounded-2xl shadow-2xl object-cover border border-slate-700/60 transform transition-transform group-hover:scale-103 duration-300"
                />
                <div className="absolute -bottom-4 -left-4 rtl:-left-auto rtl:-right-4 bg-white/95 backdrop-blur-md text-slate-950 p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">
                      {client.displayName[language]}
                    </div>
                    <div className="text-xs font-black text-slate-900 truncate">
                      {client.home.heroImageAlt[language]}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Value Proposition Strip — each card reflects this client's own
          confirmed data; a card is hidden entirely rather than show a
          generic claim (warranty/returns) this client hasn't confirmed. */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-primary transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('valueProp1Title')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {citiesServed.length > 0
                  ? (language === 'ar'
                      ? `توصيل سريع إلى ${citiesServed.join('، ')}`
                      : `Express delivery to ${citiesServed.join(', ')}`)
                  : t('valueProp1Desc')}
              </p>
            </div>
          </div>

          {client.policies.warrantyPolicy && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('valueProp2Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {client.policies.warrantyPolicy[language]}
                </p>
              </div>
            </div>
          )}

          {client.policies.returnPolicy && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('valueProp3Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {client.policies.returnPolicy[language]}
                </p>
              </div>
            </div>
          )}

          {enabledPaymentLabels.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('valueProp4Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{enabledPaymentLabels.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Flash Deal of the Day */}
      {isHydrating ? (
        <FlashDealSkeleton />
      ) : (
        flashDealProduct && (
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
                    className="w-full min-h-[44px] bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-95"
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
        )
      )}

      {/* 4. Shop by Category Grid */}
      {isHydrating ? (
        <CategoryGridSkeleton />
      ) : (
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
              className="min-h-[44px] px-3 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer touch-manipulation"
            >
              <span>{t('viewAllCategories')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {homeCategories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.id)}
                  className="group min-h-[96px] p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary hover:shadow-md active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs touch-manipulation"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-primary/10 text-slate-700 group-hover:text-primary flex items-center justify-center mb-2.5 transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {cat.label[language]}
                  </h4>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {cat.count} {t('items')}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Featured Electronics with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('featuredTitle')}
            </h3>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`min-h-[40px] sm:min-h-[34px] px-3.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex-1 sm:flex-none text-center ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabAll')}
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`min-h-[40px] sm:min-h-[34px] px-3.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex-1 sm:flex-none text-center ${
                activeTab === 'bestseller'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabBestSellers')}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`min-h-[40px] sm:min-h-[34px] px-3.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex-1 sm:flex-none text-center ${
                activeTab === 'new'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabNewArrivals')}
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`min-h-[40px] sm:min-h-[34px] px-3.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 flex-1 sm:flex-none text-center ${
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
        {isHydrating ? (
          <ProductGridSkeleton count={4} columns={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayedProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  {...activatableCardProps(() => navigateToProduct(product.id))}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xs"
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

                    {/* Action buttons (Wishlist & Quick View - min 44px touch targets) */}
                    <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex flex-col gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`min-w-[44px] min-h-[44px] rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-xs flex items-center justify-center touch-manipulation active:scale-90 ${
                          inWish
                            ? 'bg-rose-50 text-rose-500'
                            : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                        }`}
                        title={t('addToWishlist')}
                        aria-label={t('addToWishlist')}
                      >
                        <Heart
                          className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProductId(product.id);
                        }}
                        className="min-w-[44px] min-h-[44px] rounded-full bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white backdrop-blur-xs transition-all cursor-pointer shadow-xs flex items-center justify-center touch-manipulation active:scale-90"
                        title={t('quickView')}
                        aria-label={t('quickView')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
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

                    {/* Price & Action (min 44px touch target) */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
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
                        className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white transition-all shadow-xs cursor-pointer flex items-center justify-center touch-manipulation active:scale-95"
                        title={t('addToCart')}
                        aria-label={t('addToCart')}
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
        )}

        {/* View All Button */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigateToCategory('all')}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer touch-manipulation active:scale-95"
          >
            <span>{t('viewMore')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Feature Banners (count and content come from the client config) */}
      {client.home.bentoBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {client.home.bentoBanners.map((banner, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-8 border border-slate-800 flex flex-col justify-between min-h-[260px] shadow-md group"
            >
              <div className="relative z-10 space-y-3 max-w-sm">
                <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  {banner.badge[language]}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {banner.title[language]}
                </h3>
                <p className="text-xs text-slate-300">{banner.description[language]}</p>
                <button
                  onClick={() => navigateToCategory(banner.categorySlug)}
                  className="mt-2 text-xs font-bold text-primary hover:opacity-80 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{banner.ctaLabel[language]}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              <img
                src={banner.image}
                alt={banner.title[language]}
                className="absolute right-0 bottom-0 rtl:right-auto rtl:left-0 w-64 h-64 object-contain opacity-40 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              />
            </div>
          ))}
        </section>
      )}

      {/* 7. Brands carried by this store (derived from its own catalog) */}
      {clientBrands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
              {t('authorizedBrands')}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {clientBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => navigateToCategory('all')}
                  className="text-sm sm:text-base font-black text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
