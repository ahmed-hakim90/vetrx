import React from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/mockData';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    clearWishlist,
    addToCart,
    formatPrice,
    language,
    t,
    navigateToProduct,
    setActiveScreen,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleMoveToCart = (prod: any) => {
    addToCart(
      prod,
      1,
      prod.variants?.colors?.[0],
      prod.variants?.storage?.[0]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-6 rtl:pl-0 rtl:pr-6 sm:pl-10 rtl:sm:pl-0 rtl:sm:pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t('wishlistTitle')}
                </h2>
                <span className="text-xs text-slate-500">
                  {wishlist.length} {t('items')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="min-h-[44px] px-2 flex items-center text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer touch-manipulation active:scale-95"
                >
                  {t('clearWishlist')}
                </button>
              )}
              <button
                id="close-wishlist-drawer-btn"
                onClick={() => setIsWishlistOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer touch-manipulation active:scale-90"
                aria-label={t('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Wishlist items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {t('emptyWishlistTitle')}
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                  {t('emptyWishlistDesc')}
                </p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setActiveScreen('plp');
                  }}
                  className="min-h-[44px] bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation active:scale-95"
                >
                  <span>{t('startShopping')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              wishlistProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-2xs group"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.title[language]}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      navigateToProduct(prod.id);
                    }}
                    className="w-20 h-20 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0 cursor-pointer group-hover:scale-103 transition-transform"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            navigateToProduct(prod.id);
                          }}
                          className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          {prod.title[language]}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors touch-manipulation active:scale-90"
                          title={t('remove')}
                          aria-label={t('remove')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {prod.brand}
                      </div>
                    </div>

                    {/* Price and Add to Cart action */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          {formatPrice(prod.price)}
                        </div>
                        {prod.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatPrice(prod.originalPrice)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleMoveToCart(prod)}
                        className="min-h-[40px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer touch-manipulation active:scale-95"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>{t('moveToCart')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer action */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/80">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => handleMoveToCart(p));
                  setIsWishlistOpen(false);
                }}
                className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 active:bg-black text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move All to Cart ({wishlistProducts.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
