import React from 'react';
import { Heart, Share2, ShoppingCart, ChevronRight, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';

interface HomeBestSellingSectionProps {
  products: Product[];
}

export const HomeBestSellingSection: React.FC<HomeBestSellingSectionProps> = ({ products }) => {
  const { language, formatPrice, toggleWishlist, isInWishlist, addToCart } = useStore();

  const bestSelling = products
    .filter(p => p.rating >= 4.5 && p.reviewCount > 10)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  if (bestSelling.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {language === 'ar' ? 'الإلكترونيات الأكثر مبيعاً' : 'Best Selling Electronics'}
        </h2>
        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
          {language === 'ar' ? 'اعرض الكل' : 'View All'}
          <ChevronRight size={16} />
        </a>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bestSelling.map((product) => {
          const inWishlist = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Image Container with Badges */}
              <div className="relative bg-slate-100 aspect-square overflow-hidden">
                {/* Stock Badge - Top Right */}
                <div className="absolute top-3 right-3 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                  {language === 'ar' ? `متبقي ${product.stockCount || 5}` : `${product.stockCount || 5} in stock`}
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

                {/* Rating & Installment */}
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1 text-slate-600">
                      {product.rating.toFixed(1)} ({product.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})
                    </span>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {language === 'ar'
                      ? `${Math.round(product.price / 12)} ج.م / شهر`
                      : `${Math.round(product.price / 12)} EGP / mo`}
                  </div>
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
