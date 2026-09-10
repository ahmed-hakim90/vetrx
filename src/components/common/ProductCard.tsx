import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { activatableCardProps } from '../../core/a11y/activatableCard';

interface ProductCardProps {
  product: Product;
}

/**
 * Reusable product card for displaying products in grids.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, navigateToProduct, toggleWishlist, isInWishlist, setQuickViewProductId } = useStore();

  const inWish = isInWishlist(product.id);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProductId(product.id);
  };

  return (
    <div
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
      {...activatableCardProps(() => navigateToProduct(product.id))}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        <img
          src={product.images[0]}
          alt={product.title[language]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {product.badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg">
            {product.badge.text[language]}
          </div>
        )}

        {product.isFlashDeal && product.flashDealSoldPercentage !== undefined && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg">
            {Math.round(product.flashDealSoldPercentage)}% {language === 'ar' ? 'مباع' : 'sold'}
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center gap-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleQuickView}
            className="bg-white text-slate-900 hover:text-blue-600 p-2.5 rounded-lg transition-colors"
            title={language === 'ar' ? 'عرض سريع' : 'Quick View'}
            aria-label="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToWishlist}
            className={`p-2.5 rounded-lg transition-colors ${
              inWish ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-600 hover:text-rose-600'
            }`}
            title={language === 'ar' ? 'أضف للمفضلة' : 'Add to Wishlist'}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 ${inWish ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        {/* Brand */}
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{product.brand}</span>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.title[language]}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs line-through text-slate-500">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        {/* Status */}
        {!product.inStock ? (
          <div className="text-xs font-semibold text-rose-600">
            {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
          </div>
        ) : product.stockCount < 5 ? (
          <div className="text-xs font-semibold text-amber-600">
            {language === 'ar' ? `${product.stockCount} متبقي فقط` : `Only ${product.stockCount} left`}
          </div>
        ) : (
          <div className="text-xs font-semibold text-emerald-600">
            {language === 'ar' ? 'متوفر' : 'In Stock'}
          </div>
        )}
      </div>
    </div>
  );
};
