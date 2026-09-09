import React from 'react';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const { activeScreen, setActiveScreen, cartCount, wishlist, setIsCartOpen, t } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 py-1.5 px-4 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
          activeScreen === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">{t('navHome')}</span>
      </button>

      <button
        onClick={() => setActiveScreen('plp')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
          activeScreen === 'plp' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">{t('navProducts')}</span>
      </button>

      <button
        onClick={() => setActiveScreen('plp')}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-slate-500 relative cursor-pointer"
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px]">{t('wishlist')}</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-slate-900 relative cursor-pointer font-bold"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">{t('cart')}</span>
      </button>
    </div>
  );
};
