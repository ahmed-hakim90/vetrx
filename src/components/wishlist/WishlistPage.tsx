import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { Product } from '../../types/store';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, clearWishlist, addToCart, products, formatPrice, language, t, goToProducts, navigateToProduct } =
    useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleMoveToCart = (prod: Product) => {
    addToCart(prod, 1, prod.variants?.colors?.[0], prod.variants?.storage?.[0]);
    toggleWishlist(prod.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('wishlistPageTitle')}</h1>
        {wishlistProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            {t('clearWishlist')}
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">{t('emptyWishlistTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t('emptyWishlistDesc')}</p>
          <button
            onClick={goToProducts}
            className="min-h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
          >
            <span>{t('startShopping')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlistProducts.map((prod) => (
              <div key={prod.id} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all shadow-2xs">
                <button
                  type="button"
                  onClick={() => navigateToProduct(prod.id)}
                  className="shrink-0 cursor-pointer"
                  aria-label={prod.title[language]}
                >
                  <img
                    src={prod.images[0]}
                    alt=""
                    className="w-20 h-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                  />
                </button>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => navigateToProduct(prod.id)}
                        className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug hover:text-primary transition-colors text-start cursor-pointer"
                      >
                        {prod.title[language]}
                      </button>
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="min-w-10 min-h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 cursor-pointer transition-colors touch-manipulation active:scale-90 shrink-0"
                        title={t('remove')}
                        aria-label={t('remove')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{prod.brand}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <div>
                      <div className="text-xs font-black text-slate-900">{formatPrice(prod.price)}</div>
                      {!prod.inStock && (
                        <div className="text-[10px] text-rose-500 font-bold">{t('outOfStock')}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleMoveToCart(prod)}
                      disabled={!prod.inStock}
                      className="min-h-10 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer touch-manipulation active:scale-95"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{t('moveToCart')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => wishlistProducts.filter((p) => p.inStock).forEach((p) => handleMoveToCart(p))}
            className="w-full sm:w-auto min-h-11 bg-slate-900 hover:bg-slate-800 active:bg-black text-white py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer touch-manipulation active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('moveAllToCart')} ({wishlistProducts.filter((p) => p.inStock).length})</span>
          </button>
        </>
      )}
    </div>
  );
};
