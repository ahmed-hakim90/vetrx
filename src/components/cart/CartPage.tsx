import React, { useEffect, useState } from 'react';
import { Plus, Minus, Trash2, ShieldCheck, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockCommerceProvider } from '../../core/commerce/MockCommerceProvider';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    language,
    t,
    goHome,
    goToProducts,
    goToCheckout,
    client,
    appliedCoupon,
  } = useStore();

  const [isValidating, setIsValidating] = useState(true);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  // A store with no published free-shipping threshold gets no progress bar —
  // rather than a bar measured against a number nobody set.
  const freeShippingThreshold = client.shipping.freeShippingThreshold;
  const amountNeeded = freeShippingThreshold === undefined ? 0 : Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent =
    freeShippingThreshold === undefined ? 0 : Math.min(100, (cartSubtotal / Math.max(1, freeShippingThreshold)) * 100);

  // The stored cart price is never trusted as final — re-check current
  // price/stock through the commerce provider whenever the cart is opened.
  useEffect(() => {
    let cancelled = false;
    setIsValidating(true);
    mockCommerceProvider.validateCart(client.id, cart).then((result) => {
      if (cancelled) return;
      setValidationIssues(result.issues.map((i) => i.message[language]));
      setIsValidating(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id, cart.length]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      <Breadcrumb
        items={[
          { label: t('navHome'), onClick: goHome },
          { label: t('cartPageTitle'), active: true },
        ]}
      />
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('cartPageTitle')}</h1>

      {cart.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">{t('emptyCartTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t('emptyCartDesc')}</p>
          <button
            onClick={goToProducts}
            className="min-h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
          >
            <span>{t('startShopping')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            {isValidating && (
              <div role="status" className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
                {t('validatingCart')}
              </div>
            )}
            {!isValidating && validationIssues.length > 0 && (
              <div role="alert" className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                <p className="font-bold">{t('cartValidationFailed')}</p>
                {validationIssues.map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title[language]}
                    className="w-20 h-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{item.product.title[language]}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-slate-500">
                      {item.selectedColor && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{item.selectedColor.name[language]}</span>
                      )}
                      {item.selectedStorage && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{item.selectedStorage.name[language]}</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-2">{formatPrice(item.totalPrice)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="min-w-11 min-h-11 flex items-center justify-center hover:bg-white rounded-lg text-slate-600 cursor-pointer touch-manipulation active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 min-w-[24px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="min-w-11 min-h-11 flex items-center justify-center hover:bg-white rounded-lg text-slate-600 cursor-pointer touch-manipulation active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-rose-600 cursor-pointer transition-colors touch-manipulation active:scale-90"
                      title={t('remove')}
                      aria-label={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToProducts}
              className="text-xs font-bold text-primary hover:opacity-80 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('continueShopping')}</span>
            </button>
          </div>

          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                {t('orderSummary')}
              </h3>

              {freeShippingThreshold !== undefined && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span>
                      {amountNeeded > 0
                        ? t('freeShippingThresholdNotice', { amount: formatPrice(amountNeeded) })
                        : t('freeShippingUnlocked')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t('discount')} ({appliedCoupon.discountPercent}%)</span>
                    <span>-{formatPrice((cartSubtotal * appliedCoupon.discountPercent) / 100)}</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 pt-1">{t('etaPendingAddress')}</p>
              </div>

              <button
                onClick={goToCheckout}
                disabled={isValidating}
                className="w-full min-h-[48px] bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer group touch-manipulation active:scale-95"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{client.commerce.provider === 'mock' ? t('demoModeNotice') : t('secureEncryptionNotice')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
