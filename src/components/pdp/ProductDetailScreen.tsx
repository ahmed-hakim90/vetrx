import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Check,
  CreditCard,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/mockData';
import { ProductVariant } from '../../types/store';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    language,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveScreen,
    navigateToProduct,
  } = useStore();

  const product = selectedProduct || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductVariant | undefined>(
    product.variants?.colors?.[0]
  );
  const [selectedStorage, setSelectedStorage] = useState<ProductVariant | undefined>(
    product.variants?.storage?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'shipping'>('overview');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Calculate adjusted price based on chosen variant
  const priceAdjustment =
    (selectedColor?.priceAdjustment || 0) + (selectedStorage?.priceAdjustment || 0);
  const currentPrice = product.price + priceAdjustment;
  const originalPrice = product.originalPrice ? product.originalPrice + priceAdjustment : undefined;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const installment4 = Math.round(currentPrice / 4);

  const inWish = isInWishlist(product.id);
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
    setActiveScreen('checkout');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Recommended related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10 pb-20">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => setActiveScreen('home')}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          {t('navHome')}
        </button>
        <span>/</span>
        <button
          onClick={() => setActiveScreen('plp')}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          {product.brand}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold line-clamp-1 max-w-xs sm:max-w-md">
          {product.title[language]}
        </span>
      </nav>

      {/* 2. Main Product Hero (Gallery + Purchasing Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Media Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Photo View */}
          <div className="relative bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center aspect-square shadow-xs overflow-hidden group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title[language]}
              className="w-full h-full object-contain max-h-[440px] transform transition-transform duration-300 group-hover:scale-105"
            />

            {product.badge && (
              <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-500 text-white shadow-md">
                {product.badge.text[language]}
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
                inWish
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/90 text-slate-600 hover:text-rose-500'
              }`}
              title={t('addToWishlist')}
            >
              <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-xl bg-white border-2 p-1.5 shrink-0 transition-all cursor-pointer overflow-hidden ${
                  activeImageIndex === idx
                    ? 'border-blue-600 shadow-sm scale-102'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Guarantee Badges Under Gallery */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-[11px]">
                <div className="font-bold text-slate-900">{t('authorizedGCCWarranty')}</div>
                <div className="text-slate-500">Authorized Service Centers</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-[11px]">
                <div className="font-bold text-slate-900">{t('hassleFreeReturns')}</div>
                <div className="text-slate-500">Free Doorstep Pickup</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Purchasing & Configuration (7 cols) */}
        <div className="lg:col-span-6 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Header Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-400">
                {t('sku')}: {selectedStorage?.sku || product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title[language]}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-500">
                  ({product.reviewCount} {t('verifiedBuyer')})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {product.inStock
                    ? `${t('inStock')} (${product.stockCount} left)`
                    : t('outOfStock')}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {savings > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                  {t('save')} {formatPrice(savings)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{t('vatIncluded')}</p>

            {/* GCC BNPL Installments Banner (Tabby & Tamara) */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-950 font-medium">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {t('installmentText', { amount: formatPrice(installment4) })}
                </span>
              </div>
              <div className="flex items-center gap-1 font-black">
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                  Tabby
                </span>
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px]">
                  Tamara
                </span>
              </div>
            </div>
          </div>

          {/* Variants: Colors */}
          {product.variants?.colors && (
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900">{t('selectColor')}:</span>
                <span className="text-slate-600 font-medium">
                  {selectedColor?.name[language]}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.variants.colors.map((color) => {
                  const isSelected = selectedColor?.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      <span>{color.name[language]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variants: Storage / Specs */}
          {product.variants?.storage && (
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900">{t('selectStorage')}:</span>
                <span className="text-slate-600 font-medium">
                  {selectedStorage?.name[language]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.variants.storage.map((storage) => {
                  const isSelected = selectedStorage?.id === storage.id;
                  return (
                    <button
                      key={storage.id}
                      onClick={() => setSelectedStorage(storage)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div>{storage.name[language]}</div>
                      {storage.priceAdjustment !== 0 && (
                        <div
                          className={`text-[10px] mt-0.5 font-normal ${
                            isSelected ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {storage.priceAdjustment > 0 ? '+' : ''}
                          {formatPrice(storage.priceAdjustment)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-700 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-700 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-500">
                <span>{t('totalPrice')}: </span>
                <span className="text-sm font-black text-slate-900">
                  {formatPrice(currentPrice * quantity)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t('addedToCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t('buyNow')}</span>
              </button>
            </div>
          </div>

          {/* Delivery Promise Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">{t('estimatedDeliveryTitle')}</div>
              <p className="text-slate-600 mt-0.5">{t('deliveryEstimate')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Specification & Reviews Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabOverview')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabSpecs')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabReviews', { count: product.reviewCount })}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'shipping'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabShipping')}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 text-slate-700 text-sm">
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-base text-slate-700 leading-relaxed max-w-4xl">
                {product.description[language]}
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  {t('keyFeatures')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.shortSpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {spec[language]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Full Technical Specs Table */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {product.specs.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-lg">
                    {group.group[language]}
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {group.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs gap-2 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-bold text-slate-500">
                          {item.label[language]}
                        </span>
                        <span className="sm:col-span-2 text-slate-900 font-medium">
                          {item.value[language]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Verified Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-slate-200 pr-4 rtl:pr-0 rtl:pl-4">
                  <div className="text-5xl font-black text-slate-900">{product.rating}</div>
                  <div className="flex justify-center text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('basedOnReviews', { count: product.reviewCount })}
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5 text-xs">
                  {[
                    { stars: '5 Stars', pct: 88 },
                    { stars: '4 Stars', pct: 9 },
                    { stars: '3 Stars', pct: 2 },
                    { stars: '2 Stars', pct: 1 },
                    { stars: '1 Star', pct: 0 },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-14 text-slate-500">{row.stars}</span>
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-slate-500 text-end">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {t('verifiedBuyer')}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs">
                      {rev.title[language]}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Shipping and GCC Warranty Info */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-xs leading-relaxed text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">
                  {product.warranty[language]}
                </h5>
                <p>
                  All devices sold on Voltix are 100% genuine GCC/Middle East specifications with direct authorized distributor warranty. Repair and service centers available in all major cities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">
                  {t('valueProp1Title')}
                </h5>
                <p>
                  Orders over 200 AED qualify for free next-day express delivery in Dubai, Abu Dhabi, Sharjah, Riyadh, and Jeddah. Real-time courier SMS updates provided with live tracking link.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Products Strip */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {t('recommendedTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedProducts.map((relProd) => (
            <div
              key={relProd.id}
              onClick={() => navigateToProduct(relProd.id)}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
            >
              <img
                src={relProd.images[0]}
                alt={relProd.title[language]}
                className="w-18 h-18 rounded-lg object-contain bg-slate-50 p-1 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {relProd.title[language]}
                </h4>
                <div className="text-sm font-black text-slate-900 mt-1">
                  {formatPrice(relProd.price)}
                </div>
                <span className="text-[11px] text-blue-600 font-bold inline-flex items-center gap-1 mt-1">
                  <span>{t('quickView')}</span>
                  <ArrowIcon className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
