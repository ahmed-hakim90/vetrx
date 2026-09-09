import React from 'react';
import { Home, Grid, Heart, ShoppingBag, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    isWishlistOpen,
    isCartOpen,
    t,
  } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 pb-safe pt-1.5 px-3 flex items-center justify-around shadow-lg">
      <button
        id="mobile-nav-home"
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl transition-colors cursor-pointer ${
          activeScreen === 'home' && !isWishlistOpen && !isCartOpen
            ? 'text-blue-600 font-black'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navHome')}</span>
      </button>

      <button
        id="mobile-nav-plp"
        onClick={() => setActiveScreen('plp')}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl transition-colors cursor-pointer ${
          activeScreen === 'plp' && !isWishlistOpen && !isCartOpen
            ? 'text-blue-600 font-black'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navProducts')}</span>
      </button>

      <button
        id="mobile-nav-wishlist"
        onClick={() => setIsWishlistOpen(true)}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
          isWishlistOpen
            ? 'text-rose-600 font-black'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1.5 rtl:-right-auto rtl:-left-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">{t('wishlist')}</span>
      </button>

      <button
        id="mobile-nav-cart"
        onClick={() => setIsCartOpen(true)}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
          isCartOpen
            ? 'text-blue-600 font-black'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1.5 rtl:-right-auto rtl:-left-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-2xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">{t('cart')}</span>
      </button>

      <button
        id="mobile-nav-checkout"
        onClick={() => setActiveScreen('checkout')}
        className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl transition-colors cursor-pointer ${
          activeScreen === 'checkout'
            ? 'text-blue-600 font-black'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <CreditCard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('checkoutTitle').split(' ')[0]}</span>
      </button>
    </div>
  );
};

