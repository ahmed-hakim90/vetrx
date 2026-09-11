import React, { useState, useEffect } from 'react';
import { Heart, Share2, ShoppingCart, Flame, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';

interface HomeFlashDealsSectionProps {
  products: Product[];
}

export const HomeFlashDealsSection: React.FC<HomeFlashDealsSectionProps> = ({ products }) => {
  const { language, formatPrice, toggleWishlist, isInWishlist, addToCart, navigateToProduct } = useStore();
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

  const flashDeals = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  if (flashDeals.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-lg">
            <Flame size={18} className="text-red-600" />
            <h2 className="text-xl md:text-2xl font-bold text-red-600">
              {language === 'ar' ? 'عروض فلاش يومية' : 'Daily Flash Deals'}
            </h2>
          </div>
          <div className="text-sm font-semibold text-slate-600">
            {language === 'ar' ? 'ينتهي في:' : 'Ends in:'}{' '}
            <span className="text-red-600 font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashDeals.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
          const inWishlist = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Image Container with Badges */}
              <div className="relative bg-slate-100 aspect-square overflow-hidden">
                {/* Discount Badge - Top Left */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded font-bold text-sm z-10">
                    SAVE {discount}%
                  </div>
                )}

                {/* Stock Badge - Top Right */}
                <div className="absolute top-3 right-3 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                  {language === 'ar' ? `متبقي ${product.stockCount || 4}` : `Only ${product.stockCount || 4} left`}
                </div>

                {/* Wishlist Button - Top Right Corner */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-12 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                    inWishlist
                      ? 'bg-white text-red-600'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart
                    size={16}
                    className={inWishlist ? 'fill-red-600' : ''}
                  />
                </button>

                {/* Product Image */}
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Brand & Warranty */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {product.brand || 'Brand'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <Shield size={14} />
                    {language === 'ar' ? '٢ سنة ضمان' : '2-YR WARRANTY'}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                  {language === 'ar' ? product.title.ar : product.title.en}
                </h3>

                {/* Specs Pills */}
                {product.shortSpecs && product.shortSpecs.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {product.shortSpecs.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {language === 'ar' ? spec.ar : spec.en}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Installment Info */}
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-blue-600">
                    {language === 'ar'
                      ? `${Math.round(product.price / 12)} ج.م / شهر`
                      : `${Math.round(product.price / 12)} EGP / mo`}
                  </span>
                  <span className="text-slate-500">
                    {language === 'ar' ? ' (36 م)' : ' (36m)'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                  </button>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10 rounded-lg transition-colors flex items-center justify-center">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
