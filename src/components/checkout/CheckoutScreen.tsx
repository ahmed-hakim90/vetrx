import React, { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Lock,
  Tag,
  Truck,
  MapPin,
  AlertCircle,
  Store,
} from 'lucide-react';
import { useStore, TranslationKey } from '../../context/StoreContext';
import { ClientConfig } from '../../config/clients/schema';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  checkoutFormSchemaGulf,
  checkoutFormSchemaEgypt,
  CheckoutFormValuesGulf,
  CheckoutFormValuesEgypt,
} from './checkoutSchema';
import { mockPaymentProvider } from '../../core/payment/MockPaymentProvider';
import { mockCommerceProvider } from '../../core/commerce/MockCommerceProvider';
import { EGYPT_GOVERNORATES } from '../../data/egyptGovernorates';
import { DeliveryMethod } from '../../core/commerce/types';

const PAYMENT_ICONS = {
  card: CreditCard,
  apple_pay: Lock,
  tabby: Tag,
  tamara: Tag,
  cod: Truck,
} as const;

// Shared copy for the generic payment types only. A provider-branded method
// supplies its own label/description in the client config that enables it.
const GENERIC_PAYMENT_NAME_KEYS: Record<string, TranslationKey> = {
  card: 'paymentCard',
  apple_pay: 'paymentApplePay',
  cod: 'paymentCOD',
};

const GENERIC_PAYMENT_DESC_KEYS: Record<string, TranslationKey> = {
  card: 'paymentCardDesc',
  apple_pay: 'paymentApplePayDesc',
  cod: 'paymentCODDesc',
};

// Card details must never be typed into this form against a real gateway —
// a production integration uses a hosted/tokenized payment page instead
// (see README). While the commerce provider is still the mock one, default
// to Cash on Delivery so the demo never opens with a card-number field.
function defaultPaymentMethodId(
  enabled: ClientConfig['paymentMethods'],
  client: ClientConfig
): string {
  if (client.commerce.provider === 'mock') {
    const cod = enabled.find((m) => m.id === 'cod');
    if (cod) return cod.id;
  }
  return enabled[0]?.id ?? 'cod';
}

export const CheckoutScreen: React.FC = () =>
  useStore().client.market === 'egypt' ? <EgyptCheckoutForm /> : <GulfCheckoutForm />;

function useCartValidation() {
  const { client, cart, removeFromCart, updateCartQuantity } = useStore();
  const [validating, setValidating] = useState(true);
  const [issues, setIssues] = useState<{ cartItemId: string; message: { en: string; ar: string } }[]>([]);

  useEffect(() => {
    let cancelled = false;
    setValidating(true);
    mockCommerceProvider.validateCart(client.id, cart).then((result) => {
      if (cancelled) return;
      setIssues(result.issues.map((i) => ({ cartItemId: i.cartItemId, message: i.message })));
      // Reconcile the local cart with the provider's source of truth: never
      // let a stale browser-stored price or an out-of-stock quantity reach
      // the order total.
      for (const issue of result.issues) {
        if (issue.reason === 'removed' || issue.reason === 'out_of_stock') {
          removeFromCart(issue.cartItemId);
        }
      }
      for (const validItem of result.items) {
        const original = cart.find((c) => c.id === validItem.id);
        if (original && (original.unitPrice !== validItem.unitPrice || original.quantity !== validItem.quantity)) {
          updateCartQuantity(validItem.id, validItem.quantity);
        }
      }
      setValidating(false);
    });
    return () => {
      cancelled = true;
    };
    // Only re-validate when the cart identity changes on mount, not on every
    // reconciliation write triggered by this same effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  return { validating, issues };
}

function EmptyCart() {
  const { t, goToProducts, language } = useStore();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
      <Breadcrumb />
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('emptyCartTitle')}</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{t('emptyCartDesc')}</p>
      <button
        onClick={goToProducts}
        className="min-h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
      >
        <span>{t('startShopping')}</span>
        <ArrowIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

function CartReviewList() {
  const { cart, removeFromCart, updateCartQuantity, language, formatPrice, t } = useStore();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-primary" />
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
              <div className="text-xs font-black text-slate-900 mt-2">{formatPrice(item.totalPrice)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                <button
                  type="button"
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
                  type="button"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="min-w-11 min-h-11 flex items-center justify-center hover:bg-white rounded-lg text-slate-600 cursor-pointer touch-manipulation active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
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
  );
}

// ---------------------------------------------------------------------------
// Gulf-market checkout (voltix / apex / lumina) — country/city/free-text
// address form, unchanged behavior from the original template.
// ---------------------------------------------------------------------------
function GulfCheckoutForm() {
  const {
    cart,
    cartSubtotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    formatPrice,
    language,
    currency,
    client,
    t,
    goToOrder,
  } = useStore();

  const { validating, issues } = useCartValidation();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const cities = Array.from(new Set(client.shipping.zones.flatMap((z) => z.cities)));
  const enabledPaymentMethods = client.paymentMethods.filter((p) => p.enabled);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValuesGulf>({
    resolver: zodResolver(checkoutFormSchemaGulf),
    defaultValues: {
      market: 'gulf',
      fullName: '',
      email: '',
      phone: '',
      city: cities[0] ?? '',
      addressLine: '',
      deliveryNotes: '',
      deliveryMethod: 'express',
      paymentMethod: defaultPaymentMethodId(enabledPaymentMethods, client) as CheckoutFormValuesGulf['paymentMethod'],
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardName: '',
    },
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const tError = (message?: string) => (message ? t(message as TranslationKey) : '');

  const deliveryOptions = [
    {
      id: 'standard' as const,
      title: t('standardDelivery'),
      desc: t('standardDeliveryDesc'),
      fee:
        client.shipping.freeShippingThreshold !== undefined &&
        cartSubtotal > client.shipping.freeShippingThreshold
          ? 0
          : client.shipping.standardFee ?? 0,
    },
    { id: 'express' as const, title: t('expressDelivery'), desc: t('expressDeliveryDesc'), fee: client.shipping.expressFee ?? 0 },
    ...(client.shipping.sameDayFee !== undefined
      ? [{ id: 'same-day' as const, title: t('sameDayDelivery'), desc: t('sameDayDeliveryDesc'), fee: client.shipping.sameDayFee }]
      : []),
  ];

  const deliveryFee = deliveryOptions.find((d) => d.id === deliveryMethod)?.fee ?? 0;
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxableSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const vatTax = client.tax.vatApplied ? Math.round((taxableSubtotal * client.tax.vatPercent) / 100) : 0;
  const finalTotal = taxableSubtotal + deliveryFee + vatTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponFeedback(applyCoupon(couponInput));
  };

  const onSubmit = async (values: CheckoutFormValuesGulf) => {
    setSubmitState('submitting');
    setPaymentError(null);

    const result = await mockPaymentProvider.charge({
      amount: finalTotal,
      currency,
      method: values.paymentMethod,
      card:
        values.paymentMethod === 'card'
          ? {
              cardNumber: values.cardNumber ?? '',
              expiry: values.cardExpiry ?? '',
              cvc: values.cardCvc ?? '',
              cardholderName: values.cardName ?? '',
            }
          : undefined,
    });

    if (result.status === 'failed') {
      setSubmitState('failed');
      setPaymentError(result.message);
      return;
    }

    try {
      const order = await mockCommerceProvider.createOrder(client.id, {
        items: cart,
        subtotal: cartSubtotal,
        shippingFee: deliveryFee,
        tax: vatTax,
        discount: discountAmount,
        total: finalTotal,
        currency,
        shippingAddress: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          country: client.countriesServed[0] ?? '',
          city: values.city,
          addressLine: values.addressLine,
          deliveryNotes: values.deliveryNotes,
        },
        deliveryMethod: values.deliveryMethod as DeliveryMethod,
        paymentMethod: values.paymentMethod === 'tamara' ? 'tabby' : values.paymentMethod,
      });
      clearCart();
      goToOrder(order.orderId);
    } catch (err) {
      setSubmitState('failed');
      setPaymentError(err instanceof Error ? err.message : 'Order could not be placed.');
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <form className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Breadcrumb />
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('checkoutTitle')}</h1>
        <p className="text-xs text-slate-500 mt-1">{t('cartItemsCount', { count: cart.length })}</p>
      </div>

      {validating && (
        <div role="status" className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
          {t('validatingCart')}
        </div>
      )}
      {!validating && issues.length > 0 && (
        <div role="alert" className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="font-bold">{t('cartValidationFailed')}</p>
          {issues.map((i, idx) => (
            <p key={idx}>{i.message[language]}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <CartReviewList />

          <fieldset className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <legend className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 px-0">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{t('step1Shipping')}</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="checkout-fullName" className="font-bold text-slate-700">{t('fullName')}</label>
                <input
                  id="checkout-fullName"
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'checkout-fullName-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p id="checkout-fullName-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.fullName.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-email" className="font-bold text-slate-700">{t('emailAddress')}</label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('email')}
                />
                {errors.email && (
                  <p id="checkout-email-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.email.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-phone" className="font-bold text-slate-700">{t('phoneNumber')}</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p id="checkout-phone-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.phone.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-city" className="font-bold text-slate-700">{t('city')}</label>
                <select
                  id="checkout-city"
                  aria-invalid={!!errors.city}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white cursor-pointer text-xs sm:text-sm"
                  {...register('city')}
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="checkout-addressLine" className="font-bold text-slate-700">{t('addressLine')}</label>
                <input
                  id="checkout-addressLine"
                  type="text"
                  placeholder={t('addressPlaceholder')}
                  aria-invalid={!!errors.addressLine}
                  aria-describedby={errors.addressLine ? 'checkout-addressLine-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('addressLine')}
                />
                {errors.addressLine && (
                  <p id="checkout-addressLine-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.addressLine.message)}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="checkout-deliveryNotes" className="font-bold text-slate-700">{t('deliveryNotes')}</label>
                <input
                  id="checkout-deliveryNotes"
                  type="text"
                  placeholder={t('deliveryNotesPlaceholder')}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('deliveryNotes')}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <legend className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 px-0">
              <Truck className="w-4 h-4 text-primary" />
              <span>{t('step2Delivery')}</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {deliveryOptions.map((del) => {
                const isSelected = deliveryMethod === del.id;
                return (
                  <label
                    key={del.id}
                    className={`min-h-[72px] p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between touch-manipulation ${
                      isSelected ? 'border-primary bg-primary/5 shadow-2xs ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" value={del.id} className="sr-only" {...register('deliveryMethod')} />
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{del.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{del.desc}</p>
                    </div>
                    <div className="mt-3 font-black text-xs text-slate-900">
                      {del.fee === 0 ? t('freeShipping') : formatPrice(del.fee)}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <PaymentMethodFieldset
            enabledPaymentMethods={enabledPaymentMethods}
            paymentMethod={paymentMethod}
            register={register as unknown as UseFormRegister<CardFields>}
            errors={errors as FieldErrors<CardFields>}
            tError={tError}
          />
        </div>

        <OrderSummaryPanel
          couponInput={couponInput}
          setCouponInput={setCouponInput}
          couponFeedback={couponFeedback}
          onApplyCoupon={handleApplyCoupon}
          cartSubtotal={cartSubtotal}
          discountAmount={discountAmount}
          appliedCoupon={appliedCoupon}
          deliveryFee={deliveryFee}
          shippingFeeQuoted
          etaMessage={null}
          tax={client.tax.vatApplied ? vatTax : null}
          taxLabel={client.tax.vatLabel[language]}
          finalTotal={finalTotal}
          submitState={submitState}
          paymentError={paymentError}
          disabled={validating}
        />
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Egypt-market checkout (Shams) — governorate + granular address, Egyptian
// phone validation, shipping/tax/ETA all computed via CommerceProvider.
// ---------------------------------------------------------------------------
function EgyptCheckoutForm() {
  const {
    cart,
    cartSubtotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    formatPrice,
    language,
    currency,
    client,
    t,
    goToOrder,
  } = useStore();

  const { validating, issues } = useCartValidation();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<{
    fee: number;
    feeQuoted: boolean;
    etaMessage: { en: string; ar: string } | null;
    loading: boolean;
  }>({ fee: 0, feeQuoted: false, etaMessage: null, loading: false });
  const [tax, setTax] = useState<{ amount: number; applied: boolean }>({ amount: 0, applied: false });

  const enabledPaymentMethods = client.paymentMethods.filter((p) => p.enabled);
  const hasPickupBranches = client.addresses.length > 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValuesEgypt>({
    resolver: zodResolver(checkoutFormSchemaEgypt),
    defaultValues: {
      market: 'egypt',
      fullName: '',
      email: '',
      phone: '',
      governorateId: '',
      areaOrCity: '',
      streetName: '',
      buildingNumber: '',
      floorApartment: '',
      landmark: '',
      deliveryNotes: '',
      deliveryMethod: 'standard',
      paymentMethod: defaultPaymentMethodId(enabledPaymentMethods, client) as CheckoutFormValuesEgypt['paymentMethod'],
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardName: '',
    },
  });

  const governorateId = watch('governorateId');
  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const tError = (message?: string) => (message ? t(message as TranslationKey) : '');

  const deliveryOptions = useMemo(() => {
    const opts: { id: 'standard' | 'express' | 'pickup'; title: string; desc: string }[] = [
      { id: 'standard', title: t('standardDelivery'), desc: t('standardDeliveryDesc') },
    ];
    if (client.featureFlags.expressDeliveryEnabled) {
      opts.push({ id: 'express', title: t('expressDelivery'), desc: t('expressDeliveryDesc') });
    }
    if (hasPickupBranches) {
      opts.push({ id: 'pickup', title: t('pickupFromBranch'), desc: '' });
    }
    return opts;
  }, [client.featureFlags.expressDeliveryEnabled, hasPickupBranches, t]);

  // Shipping fee/ETA are recomputed via the provider whenever the governorate
  // or delivery method changes — never a value guessed on the client.
  useEffect(() => {
    let cancelled = false;
    setShipping((s) => ({ ...s, loading: true }));
    mockCommerceProvider
      .calculateShipping(client.id, {
        governorateId: governorateId || undefined,
        method: deliveryMethod as DeliveryMethod,
        subtotal: cartSubtotal,
      })
      .then((result) => {
        if (!cancelled) {
          setShipping({ fee: result.fee, feeQuoted: result.feeQuoted, etaMessage: result.etaMessage, loading: false });
        }
      })
      .catch(() => {
        if (!cancelled) setShipping({ fee: 0, feeQuoted: false, etaMessage: null, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [client.id, governorateId, deliveryMethod, cartSubtotal]);

  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxableSubtotal = Math.max(0, cartSubtotal - discountAmount);

  useEffect(() => {
    let cancelled = false;
    mockCommerceProvider.calculateTaxes(client.id, taxableSubtotal).then((result) => {
      if (!cancelled) setTax({ amount: result.amount, applied: result.applied });
    });
    return () => {
      cancelled = true;
    };
  }, [client.id, taxableSubtotal]);

  const finalTotal = taxableSubtotal + shipping.fee + tax.amount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponFeedback(applyCoupon(couponInput));
  };

  const onSubmit = async (values: CheckoutFormValuesEgypt) => {
    setSubmitState('submitting');
    setPaymentError(null);

    const result = await mockPaymentProvider.charge({
      amount: finalTotal,
      currency,
      method: values.paymentMethod,
      card:
        values.paymentMethod === 'card'
          ? {
              cardNumber: values.cardNumber ?? '',
              expiry: values.cardExpiry ?? '',
              cvc: values.cardCvc ?? '',
              cardholderName: values.cardName ?? '',
            }
          : undefined,
    });

    if (result.status === 'failed') {
      setSubmitState('failed');
      setPaymentError(result.message);
      return;
    }

    const governorate = EGYPT_GOVERNORATES.find((g) => g.id === values.governorateId);
    const addressLine = [values.streetName, values.buildingNumber && `Bldg ${values.buildingNumber}`, values.floorApartment]
      .filter(Boolean)
      .join(', ');

    try {
      const order = await mockCommerceProvider.createOrder(client.id, {
        items: cart,
        subtotal: cartSubtotal,
        shippingFee: shipping.fee,
        tax: tax.amount,
        discount: discountAmount,
        total: finalTotal,
        currency,
        shippingAddress: {
          fullName: values.fullName,
          email: values.email || undefined,
          phone: values.phone,
          country: 'Egypt',
          city: governorate ? governorate.name[language] : values.areaOrCity,
          addressLine,
          deliveryNotes: values.deliveryNotes,
          governorateId: values.governorateId,
          areaOrCity: values.areaOrCity,
          streetName: values.streetName,
          buildingNumber: values.buildingNumber,
          floorApartment: values.floorApartment,
          landmark: values.landmark,
        },
        deliveryMethod: values.deliveryMethod as DeliveryMethod,
        paymentMethod: values.paymentMethod === 'tamara' ? 'tabby' : values.paymentMethod,
      });
      clearCart();
      goToOrder(order.orderId);
    } catch (err) {
      setSubmitState('failed');
      setPaymentError(err instanceof Error ? err.message : 'Order could not be placed.');
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <form className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Breadcrumb />
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('checkoutTitle')}</h1>
        <p className="text-xs text-slate-500 mt-1">{t('cartItemsCount', { count: cart.length })}</p>
      </div>

      {validating && (
        <div role="status" className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
          {t('validatingCart')}
        </div>
      )}
      {!validating && issues.length > 0 && (
        <div role="alert" className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="font-bold">{t('cartValidationFailed')}</p>
          {issues.map((i, idx) => (
            <p key={idx}>{i.message[language]}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <CartReviewList />

          <fieldset className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <legend className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 px-0">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{t('step1Shipping')}</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="checkout-fullName" className="font-bold text-slate-700">{t('fullName')}</label>
                <input
                  id="checkout-fullName"
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'checkout-fullName-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p id="checkout-fullName-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.fullName.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-phone" className="font-bold text-slate-700">{t('phoneNumber')}</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p id="checkout-phone-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.phone.message)}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="checkout-email" className="font-bold text-slate-700">
                  {t('emailAddress')} <span className="font-normal text-slate-400">({t('optionalLabel')})</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('email')}
                />
                {errors.email && (
                  <p id="checkout-email-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.email.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-governorate" className="font-bold text-slate-700">{t('governorate')}</label>
                <select
                  id="checkout-governorate"
                  aria-invalid={!!errors.governorateId}
                  aria-describedby={errors.governorateId ? 'checkout-governorate-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white cursor-pointer text-xs sm:text-sm"
                  {...register('governorateId')}
                >
                  <option value="">—</option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.id}>{g.name[language]}</option>
                  ))}
                </select>
                {errors.governorateId && (
                  <p id="checkout-governorate-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.governorateId.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-areaOrCity" className="font-bold text-slate-700">{t('cityOrArea')}</label>
                <input
                  id="checkout-areaOrCity"
                  type="text"
                  aria-invalid={!!errors.areaOrCity}
                  aria-describedby={errors.areaOrCity ? 'checkout-areaOrCity-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('areaOrCity')}
                />
                {errors.areaOrCity && (
                  <p id="checkout-areaOrCity-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.areaOrCity.message)}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="checkout-streetName" className="font-bold text-slate-700">{t('streetName')}</label>
                <input
                  id="checkout-streetName"
                  type="text"
                  aria-invalid={!!errors.streetName}
                  aria-describedby={errors.streetName ? 'checkout-streetName-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('streetName')}
                />
                {errors.streetName && (
                  <p id="checkout-streetName-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.streetName.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-buildingNumber" className="font-bold text-slate-700">{t('buildingNumber')}</label>
                <input
                  id="checkout-buildingNumber"
                  type="text"
                  aria-invalid={!!errors.buildingNumber}
                  aria-describedby={errors.buildingNumber ? 'checkout-buildingNumber-error' : undefined}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('buildingNumber')}
                />
                {errors.buildingNumber && (
                  <p id="checkout-buildingNumber-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {tError(errors.buildingNumber.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-floorApartment" className="font-bold text-slate-700">{t('floorApartment')}</label>
                <input
                  id="checkout-floorApartment"
                  type="text"
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('floorApartment')}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-landmark" className="font-bold text-slate-700">{t('landmark')}</label>
                <input
                  id="checkout-landmark"
                  type="text"
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('landmark')}
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="checkout-deliveryNotes" className="font-bold text-slate-700">{t('deliveryNotes')}</label>
                <input
                  id="checkout-deliveryNotes"
                  type="text"
                  placeholder={t('deliveryNotesPlaceholder')}
                  className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white text-xs sm:text-sm"
                  {...register('deliveryNotes')}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <legend className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 px-0">
              <Truck className="w-4 h-4 text-primary" />
              <span>{t('step2Delivery')}</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {deliveryOptions.map((del) => {
                const isSelected = deliveryMethod === del.id;
                const feeForOption = del.id === deliveryMethod ? shipping.fee : undefined;
                return (
                  <label
                    key={del.id}
                    className={`min-h-[72px] p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between touch-manipulation ${
                      isSelected ? 'border-primary bg-primary/5 shadow-2xs ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" value={del.id} className="sr-only" {...register('deliveryMethod')} />
                    <div className="flex items-center gap-1.5">
                      {del.id === 'pickup' && <Store className="w-3.5 h-3.5 text-primary" />}
                      <span className="font-bold text-xs text-slate-900">{del.title}</span>
                    </div>
                    {del.desc && <p className="text-[11px] text-slate-500">{del.desc}</p>}
                    <div className="mt-3 font-black text-xs text-slate-900">
                      {isSelected && shipping.loading
                        ? '…'
                        : !isSelected
                        ? ''
                        : !shipping.feeQuoted
                        ? '—'
                        : feeForOption === 0
                        ? t('freeShipping')
                        : formatPrice(feeForOption ?? 0)}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              {!governorateId
                ? t('etaPendingAddress')
                : shipping.etaMessage
                ? shipping.etaMessage[language]
                : t('etaNotPublished')}
            </p>
          </fieldset>

          <PaymentMethodFieldset
            enabledPaymentMethods={enabledPaymentMethods}
            paymentMethod={paymentMethod}
            register={register as unknown as UseFormRegister<CardFields>}
            errors={errors as FieldErrors<CardFields>}
            tError={tError}
          />
        </div>

        <OrderSummaryPanel
          couponInput={couponInput}
          setCouponInput={setCouponInput}
          couponFeedback={couponFeedback}
          onApplyCoupon={handleApplyCoupon}
          cartSubtotal={cartSubtotal}
          discountAmount={discountAmount}
          appliedCoupon={appliedCoupon}
          deliveryFee={shipping.fee}
          shippingPending={!governorateId}
          shippingFeeQuoted={shipping.feeQuoted}
          etaMessage={shipping.etaMessage ? shipping.etaMessage[language] : null}
          tax={tax.applied ? tax.amount : null}
          taxLabel={client.tax.vatLabel[language]}
          finalTotal={finalTotal}
          submitState={submitState}
          paymentError={paymentError}
          disabled={validating || shipping.loading}
        />
      </div>
    </form>
  );
}

interface CardFields {
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
}

function PaymentMethodFieldset({
  enabledPaymentMethods,
  paymentMethod,
  register,
  errors,
  tError,
}: {
  enabledPaymentMethods: ClientConfig['paymentMethods'];
  paymentMethod: string;
  register: UseFormRegister<CardFields>;
  errors: FieldErrors<CardFields>;
  tError: (m?: string) => string;
}) {
  const { t, language } = useStore();
  return (
    <fieldset className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <legend className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 px-0">
        <CreditCard className="w-4 h-4 text-primary" />
        <span>{t('step3Payment')}</span>
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {enabledPaymentMethods.map((pm) => {
          const isSelected = paymentMethod === pm.id;
          const PayIcon = PAYMENT_ICONS[pm.id];
          // Provider-branded methods carry their own label/description in the
          // client config; the generic types fall back to shared copy.
          const name = pm.label ? pm.label[language] : t(GENERIC_PAYMENT_NAME_KEYS[pm.id] ?? 'paymentCard');
          const description = pm.description
            ? pm.description[language]
            : GENERIC_PAYMENT_DESC_KEYS[pm.id]
            ? t(GENERIC_PAYMENT_DESC_KEYS[pm.id])
            : '';
          return (
            <label
              key={pm.id}
              className={`min-h-[64px] p-4 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 touch-manipulation ${
                isSelected ? 'border-primary bg-primary/5 shadow-2xs ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input type="radio" value={pm.id} className="sr-only" {...register('paymentMethod')} />
              <PayIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-slate-900">{name}</h4>
                {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
              </div>
            </label>
          );
        })}
      </div>

      {paymentMethod === 'card' && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 pt-4 text-xs animate-in fade-in duration-200">
          <div className="space-y-1">
            <label htmlFor="checkout-cardNumber" className="font-bold text-slate-700">{t('cardNumber')}</label>
            <input
              id="checkout-cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? 'checkout-cardNumber-error' : undefined}
              className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
              {...register('cardNumber')}
            />
            {errors.cardNumber && (
              <p id="checkout-cardNumber-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {tError(errors.cardNumber.message)}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="checkout-cardName" className="font-bold text-slate-700">{t('cardName')}</label>
            <input
              id="checkout-cardName"
              type="text"
              autoComplete="cc-name"
              aria-invalid={!!errors.cardName}
              aria-describedby={errors.cardName ? 'checkout-cardName-error' : undefined}
              className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none text-xs sm:text-sm"
              {...register('cardName')}
            />
            {errors.cardName && (
              <p id="checkout-cardName-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {tError(errors.cardName.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="checkout-cardExpiry" className="font-bold text-slate-700">{t('cardExpiry')}</label>
              <input
                id="checkout-cardExpiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                aria-invalid={!!errors.cardExpiry}
                aria-describedby={errors.cardExpiry ? 'checkout-cardExpiry-error' : undefined}
                className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
                {...register('cardExpiry')}
              />
              {errors.cardExpiry && (
                <p id="checkout-cardExpiry-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {tError(errors.cardExpiry.message)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="checkout-cardCvc" className="font-bold text-slate-700">{t('cardCvc')}</label>
              <input
                id="checkout-cardCvc"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                aria-invalid={!!errors.cardCvc}
                aria-describedby={errors.cardCvc ? 'checkout-cardCvc-error' : undefined}
                className="w-full min-h-[44px] bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-mono text-xs sm:text-sm"
                {...register('cardCvc')}
              />
              {errors.cardCvc && (
                <p id="checkout-cardCvc-error" role="alert" className="text-rose-600 text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {tError(errors.cardCvc.message)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}

function OrderSummaryPanel({
  couponInput,
  setCouponInput,
  couponFeedback,
  onApplyCoupon,
  cartSubtotal,
  discountAmount,
  appliedCoupon,
  deliveryFee,
  shippingPending = false,
  shippingFeeQuoted = true,
  etaMessage,
  tax,
  taxLabel,
  finalTotal,
  submitState,
  paymentError,
  disabled,
}: {
  couponInput: string;
  setCouponInput: (v: string) => void;
  couponFeedback: { success: boolean; message: string } | null;
  onApplyCoupon: (e: React.FormEvent) => void;
  cartSubtotal: number;
  discountAmount: number;
  appliedCoupon: { code: string; discountPercent: number } | null;
  deliveryFee: number;
  // Egypt market: no shipping fee can be quoted before a governorate is
  // chosen, and "0" must not be shown as if delivery were free.
  shippingPending?: boolean;
  // False when the store has no published courier rate at all.
  shippingFeeQuoted?: boolean;
  etaMessage: string | null;
  // null when this business is not charging tax — the row is then hidden
  // rather than showing a 0 that implies a tax was calculated.
  tax: number | null;
  taxLabel: string;
  finalTotal: number;
  submitState: 'idle' | 'submitting' | 'failed';
  paymentError: string | null;
  disabled: boolean;
}) {
  const { t, formatPrice, client, language } = useStore();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
          {t('orderSummary')}
        </h3>

        {client.featureFlags.couponsEnabled && (
          <div className="space-y-2">
            <label htmlFor="checkout-coupon" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>{t('promoCodeLabel')}</span>
            </label>
            <div className="flex gap-2">
              <input
                id="checkout-coupon"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder={t('enterPromoCode')}
                className="flex-1 min-h-[44px] bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl uppercase outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                className="min-h-[44px] bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors touch-manipulation active:scale-95"
              >
                {t('applyPromo')}
              </button>
            </div>
            {couponFeedback && (
              <div
                role="status"
                className={`text-xs font-semibold p-2.5 rounded-lg ${couponFeedback.success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
              >
                {couponFeedback.message}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>{t('discount')} ({appliedCoupon.code} - {appliedCoupon.discountPercent}%)</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t('shipping')}</span>
            <span className="font-bold text-slate-900">
              {shippingPending || !shippingFeeQuoted
                ? '—'
                : deliveryFee === 0
                ? t('freeShipping')
                : formatPrice(deliveryFee)}
            </span>
          </div>
          {shippingPending ? (
            <p className="text-[11px] text-slate-500">{t('shippingPendingAddress')}</p>
          ) : !shippingFeeQuoted ? (
            <p className="text-[11px] text-slate-500">{t('shippingNotPublished')}</p>
          ) : null}
          {etaMessage && <p className="text-[11px] text-slate-500">{etaMessage}</p>}
          {tax !== null && (
            <div className="flex justify-between">
              <span>{taxLabel}</span>
              <span className="font-bold text-slate-900">{formatPrice(tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
            <span>{t('orderTotal')}</span>
            <span className="text-xl text-primary">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {submitState === 'failed' && paymentError && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>{t('orderFailedTitle')}</span>
            </div>
            <p className="text-[11px] text-rose-600">{paymentError}</p>
          </div>
        )}

        <button
          id="checkout-place-order-btn"
          type="submit"
          disabled={submitState === 'submitting' || disabled}
          className="w-full min-h-[48px] bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group touch-manipulation active:scale-95"
        >
          {submitState === 'submitting' ? (
            <span>{t('processingOrder')}</span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                {submitState === 'failed' ? t('tryAgain') : t('placeOrderBtn')} ({formatPrice(finalTotal)})
              </span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </>
          )}
        </button>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
          {client.policies.warrantyPolicy && (
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{client.policies.warrantyPolicy[language]}</span>
            </div>
          )}
          {client.commerce.provider === 'mock' && process.env.NODE_ENV !== 'production' && (
            <p className="text-[11px] text-slate-400">{t('demoModeNotice')}</p>
          )}
          {client.commerce.provider !== 'mock' && (
            <p className="text-[11px] text-slate-400">{t('secureEncryptionNotice')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
