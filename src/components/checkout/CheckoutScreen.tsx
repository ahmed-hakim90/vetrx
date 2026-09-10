import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Tag,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  Check,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress, OrderDetails } from '../../types/store';
import { Breadcrumb } from '../common/Breadcrumb';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    language,
    currency,
    t,
    setActiveScreen,
    confirmedOrder,
    setConfirmedOrder,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // Checkout Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@example.ae',
    phone: '+971 50 849 2031',
    country: 'United Arab Emirates',
    city: 'Dubai',
    addressLine: 'Building 4, Downtown Boulevard, Apt 1204',
    deliveryNotes: 'Please ring bell upon arrival',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'same-day'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod' | 'tabby'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9021');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardName, setCardName] = useState('Tariq Al-Mansoor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  // Delivery costs
  const deliveryFee =
    deliveryMethod === 'same-day' ? 25 : deliveryMethod === 'express' ? 15 : cartSubtotal > 200 ? 0 : 20;

  // Discount calculation
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxableSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const vatTax = Math.round(taxableSubtotal * 0.05);
  const finalTotal = taxableSubtotal + deliveryFee + vatTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder: OrderDetails = {
        orderId: `VTX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee: deliveryFee,
        tax: vatTax,
        discount: discountAmount,
        total: finalTotal,
        currency,
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        status: 'confirmed',
        estimatedDelivery:
          deliveryMethod === 'same-day'
            ? language === 'ar'
              ? 'اليوم، بحلول الساعة 8:00 مساءً'
              : 'Today, by 8:00 PM'
            : deliveryMethod === 'express'
            ? language === 'ar'
              ? 'غداً، بحلول الساعة 2:00 ظهراً'
              : 'Tomorrow, by 2:00 PM'
            : language === 'ar'
            ? 'خلال 2-3 أيام عمل'
            : 'Within 2-3 Business Days',
      };
      setConfirmedOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setActiveScreen('order-confirmation');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1200);
  };

  // If order has already been confirmed, display Order Confirmation Screen
  if (confirmedOrder) {
    return <OrderConfirmationScreen />;
  }

  // When cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Breadcrumb
          items={[
            { label: t('navHome'), screen: 'home', onClick: () => setActiveScreen('home') },
            { label: t('cart'), active: true },
          ]}
          className="justify-center mb-4"
        />
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('emptyCartTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t('emptyCartDesc')}
        </p>
        <button
          onClick={() => setActiveScreen('plp')}
          className="min-h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
        >
          <span>{t('startShopping')}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: t('navHome'), screen: 'home', onClick: () => setActiveScreen('home') },
          { label: t('cart'), active: true },
        ]}
      />

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('checkoutTitle')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('cartItemsCount', { count: cart.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Review & Checkout Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Basket Items Review */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>{t('shoppingCart')}</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title[language]}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {item.product.title[language]}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-slate-500">
                      {item.selectedColor && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {item.selectedColor.name[language]}
                        </span>
                      )}
                      {item.selectedStorage && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {item.selectedStorage.name[language]}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-black text-slate-900 mt-2">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>

                  {/* Stepper & Delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="min-w-11 min-h-11 flex items-center justify-center hover:bg-white rounded-lg text-slate-600 cursor-pointer touch-manipulation active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
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
          </div>

          {/* 2. Step 1: Shipping Address Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{t('step1Shipping')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t('fullName')}</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t('emailAddress')}</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t('phoneNumber')}</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t('city')}</label>
                <select
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:bg-white cursor-pointer text-xs sm:text-sm"
                >
                  <option value="Dubai">Dubai (دبي)</option>
                  <option value="Abu Dhabi">Abu Dhabi (أبوظبي)</option>
                  <option value="Sharjah">Sharjah (الشارقة)</option>
                  <option value="Riyadh">Riyadh (الرياض)</option>
                  <option value="Jeddah">Jeddah (جدة)</option>
                  <option value="Doha">Doha (الدوحة)</option>
                  <option value="Kuwait City">Kuwait City (مدينة الكويت)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">{t('addressLine')}</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, addressLine: e.target.value }))
                  }
                  placeholder={t('addressPlaceholder')}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. Step 2: Delivery Speed Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>{t('step2Delivery')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', title: t('standardDelivery'), desc: t('standardDeliveryDesc'), fee: cartSubtotal > 200 ? 0 : 20 },
                { id: 'express', title: t('expressDelivery'), desc: t('expressDeliveryDesc'), fee: 15 },
                { id: 'same-day', title: t('sameDayDelivery'), desc: t('sameDayDeliveryDesc'), fee: 25 },
              ].map((del) => {
                const isSelected = deliveryMethod === del.id;
                return (
                  <button
                    key={del.id}
                    onClick={() => setDeliveryMethod(del.id as any)}
                    className={`min-h-[72px] p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-98 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{del.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{del.desc}</p>
                    </div>
                    <div className="mt-3 font-black text-xs text-slate-900">
                      {del.fee === 0 ? t('freeShipping') : formatPrice(del.fee)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Step 3: Payment Method Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>{t('step3Payment')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'card', name: t('paymentCard'), desc: t('paymentCardDesc'), icon: CreditCard },
                { id: 'apple_pay', name: t('paymentApplePay'), desc: t('paymentApplePayDesc'), icon: Lock },
                { id: 'tabby', name: t('paymentTabby'), desc: t('paymentTabbyDesc'), icon: Sparkles },
                { id: 'cod', name: t('paymentCOD'), desc: t('paymentCODDesc'), icon: Truck },
              ].map((pay) => {
                const isSelected = paymentMethod === pay.id;
                const PayIcon = pay.icon;
                return (
                  <button
                    key={pay.id}
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`min-h-[64px] p-4 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 touch-manipulation active:scale-98 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <PayIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{pay.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pay.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Credit Card Input mock fields if 'card' selected */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 pt-4 text-xs animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t('cardNumber')}</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">{t('cardExpiry')}</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">{t('cardCvc')}</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      maxLength={4}
                      className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Placement (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              {t('orderSummary')}
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('promoCodeLabel')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t('enterPromoCode')}
                  className="flex-1 min-h-[44px] bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl uppercase outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="min-h-[44px] bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors touch-manipulation active:scale-95"
                >
                  {t('applyPromo')}
                </button>
              </div>

              {couponFeedback && (
                <div
                  className={`text-xs font-semibold p-2.5 rounded-lg ${
                    couponFeedback.success
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {couponFeedback.message}
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>
                    {t('discount')} ({appliedCoupon.code} - {appliedCoupon.discountPercent}%)
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? t('freeShipping') : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t('vatTax')}</span>
                <span className="font-bold text-slate-900">{formatPrice(vatTax)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>{t('orderTotal')}</span>
                <span className="text-xl text-blue-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              id="checkout-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full min-h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group touch-manipulation active:scale-95"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t('placeOrderBtn')} ({formatPrice(finalTotal)})</span>
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </>
              )}
            </button>

            {/* Security Guarantee Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Guaranteed Official GCC Warranty</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t('secureEncryptionNotice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
