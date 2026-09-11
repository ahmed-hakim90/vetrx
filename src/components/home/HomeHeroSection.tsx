import React from 'react';
import { ArrowRight, ArrowLeft, Flame, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';

interface HomeHeroSectionProps {
  featuredProduct: Product | undefined;
  promoProduct: Product | undefined;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  featuredProduct,
  promoProduct,
}) => {
  const { language, t, formatPrice, navigateToProduct } = useStore();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-8">
      {/* Ticker Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-2 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            OFFICIAL PARTNER
          </span>
          <span className="text-sm text-slate-600">
            {language === 'ar'
              ? 'توصيل في نفس اليوم متاح على الطلبات المُسجلة قبل الساعة 2:00 ظهراً'
              : 'Cairo & Giza Same-Day Delivery available on orders placed before 2:00 PM'}
          </span>
        </div>
      </div>

      {/* Main Grid: 8 Cols Left + 4 Cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Primary Featured Banner (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-96">
          {/* Decorative glow */}
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-12 bottom-4 w-72 h-72 bg-amber-100/30 rounded-full blur-2xl pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  PRO COMPUTING
                </span>
                <span className="text-xs text-slate-600">
                  {language === 'ar'
                    ? 'M3 Max و Core Ultra 9 الرائدة'
                    : 'M3 Max & Core Ultra 9 Flagships'}
                </span>
              </div>
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Flame size={14} />
                {language === 'ar'
                  ? 'وفر حتى ٨,٠٠٠ ج.م'
                  : 'Save up to 8,000 EGP'}
              </div>
            </div>

            {/* Heading & Description */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="md:col-span-3 space-y-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {language === 'ar' ? 'مصممة للعمل الثقيل' : 'Engineered for Extreme Workloads'}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                  {featuredProduct?.title[language] || (language === 'ar'
                    ? 'Apple MacBook Pro M3 Max و Dell XPS 16'
                    : 'Apple MacBook Pro M3 Max & Dell XPS 16')}
                </h1>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {featuredProduct?.description[language] || (language === 'ar'
                    ? 'كثافة حاسوبية لا مثيل لها، شاشات XDR بلورية، وكفاءة بطارية طوال اليوم. مُجهزة بالكامل بتخطيطات لوحة مفاتيح محلية ثنائية اللغة وضمان مصري رسمي لمدة سنتين.'
                    : 'Unrivaled computing density, liquid crystal XDR displays, and all-day battery efficiency. Fully configured with local bilingual keyboard layouts and official 2-year warranty.')}
                </p>

                {/* Installment Info */}
                <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-sm mt-2">
                  <Zap size={16} className="text-blue-600" />
                  <span>
                    {language === 'ar'
                      ? 'من ١,٢٥٠ ج.م / شهر بدون فائدة عبر Paymob و valU'
                      : 'From 1,250 EGP / mo with 0% interest via Paymob & valU'}
                  </span>
                </div>
              </div>

              {/* Product Image */}
              {featuredProduct?.images?.[0] && (
                <div className="md:col-span-2 flex items-center justify-center">
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.title.en}
                    className="w-full max-h-48 object-contain hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateToProduct(featuredProduct?.id || '')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>{language === 'ar' ? 'تسوق الآن' : 'Shop Now'}</span>
                <ArrowIcon size={16} />
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Zap size={16} className="text-blue-600" />
                <span>{language === 'ar' ? 'احسب التقسيط' : 'Calculate Installment'}</span>
              </button>
              <div className="ml-auto hidden xl:flex items-center gap-2 text-xs text-slate-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {language === 'ar' ? 'متوفر في مخزن القاهرة' : 'In Stock at Cairo Hub'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Promos (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Promo 1: PS5 Slim */}
          {promoProduct && (
            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                  {language === 'ar' ? 'حصري الألعاب' : 'GAMING EXCLUSIVE'}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">{promoProduct.title.en}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{promoProduct.description.en}</p>
              </div>

              <div className="my-3 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(promoProduct.price)}
                  </div>
                  {promoProduct.originalPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      {formatPrice(promoProduct.originalPrice)}
                    </div>
                  )}
                  <div className="text-xs text-green-600 font-semibold mt-0.5">
                    {language === 'ar'
                      ? 'اقسط من 937 ج.م / شهر'
                      : 'Pay 937 EGP / mo (36 mos)'}
                  </div>
                </div>
                {promoProduct.images?.[0] && (
                  <img
                    src={promoProduct.images[0]}
                    alt={promoProduct.title.en}
                    className="w-24 h-24 object-contain"
                  />
                )}
              </div>

              <button
                onClick={() => navigateToProduct(promoProduct.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm w-full py-2 rounded-lg transition-colors"
              >
                {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Promo 2: Placeholder */}
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-sm p-4 flex flex-col justify-center items-center text-center">
            <Zap size={32} className="text-purple-600 mb-2" />
            <h3 className="font-bold text-slate-900">
              {language === 'ar' ? 'عرض آخر قادم' : 'More Offers Coming'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {language === 'ar' ? 'تحقق قريباً من المزيد من العروض المذهلة' : 'Check back soon for amazing deals'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
