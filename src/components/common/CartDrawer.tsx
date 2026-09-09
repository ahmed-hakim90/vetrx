import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    formatPrice,
    language,
    t,
    setActiveScreen,
    appliedCoupon,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 200; // in AED
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveScreen('checkout');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                {t('shoppingCart')} ({cartCount})
              </h2>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/60 border-b border-amber-100/80 p-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-slate-700 font-semibold">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>
                {amountNeeded > 0
                  ? t('freeShippingThresholdNotice', { amount: formatPrice(amountNeeded) })
                  : t('freeShippingUnlocked')}
              </span>
            </div>
            <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {t('emptyCartTitle')}
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                  {t('emptyCartDesc')}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveScreen('plp');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-2xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title[language]}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.product.title[language]}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                          title={t('remove')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant details */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.selectedColor && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {item.selectedColor.name[language]}
                          </span>
                        )}
                        {item.selectedStorage && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {item.selectedStorage.name[language]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="text-xs font-black text-slate-900">
                        {formatPrice(item.totalPrice)}
                      </div>
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-l rtl:rounded-l-none rtl:rounded-r text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-r rtl:rounded-r-none rtl:rounded-l text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>
                      {t('discount')} ({appliedCoupon.discountPercent}%)
                    </span>
                    <span>
                      -{formatPrice((cartSubtotal * appliedCoupon.discountPercent) / 100)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold text-emerald-600">
                    {amountNeeded === 0 ? t('freeShipping') : formatPrice(15)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('orderTotal')}</span>
                  <span className="text-base text-blue-600">
                    {formatPrice(
                      appliedCoupon
                        ? cartSubtotal * (1 - appliedCoupon.discountPercent / 100) +
                            (amountNeeded === 0 ? 0 : 15)
                        : cartSubtotal + (amountNeeded === 0 ? 0 : 15)
                    )}
                  </span>
                </div>
              </div>

              <button
                id="cart-drawer-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('secureEncryptionNotice')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
