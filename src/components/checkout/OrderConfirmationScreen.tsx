import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Printer,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { OrderDetails } from '../../types/store';
import { mockCommerceProvider } from '../../core/commerce/MockCommerceProvider';
import { paymentMethodLabelById } from '../../core/payment/paymentLabels';

// Reached only after a real checkout (via /order/:orderId); the order id
// always comes from the CommerceProvider (see CheckoutScreen), never
// regenerated or guessed here. An unknown/expired order id renders a real
// "not found" state instead of fabricating order data.
export const OrderConfirmationScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { client, t } = useStore();
  const [order, setOrder] = useState<OrderDetails | undefined | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!orderId) {
      setOrder(undefined);
      return;
    }
    mockCommerceProvider.getOrder(client.id, orderId).then((result) => {
      if (!cancelled) setOrder(result ?? undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [client.id, orderId]);

  if (order === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-slate-400">{t('validatingCart')}</p>
      </div>
    );
  }

  if (!order) {
    return <OrderNotFound />;
  }

  return <OrderConfirmationContent order={order} />;
};

const OrderNotFound: React.FC = () => {
  const { t, goHome, goToProducts } = useStore();
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('orderNotFoundTitle')}</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{t('orderNotFoundDesc')}</p>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={goHome}
          className="min-h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer touch-manipulation"
        >
          {t('backToHome')}
        </button>
        <button
          onClick={goToProducts}
          className="min-h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer touch-manipulation"
        >
          {t('startShopping')}
        </button>
      </div>
    </div>
  );
};

const OrderConfirmationContent: React.FC<{ order: OrderDetails }> = ({ order }) => {
  const { setConfirmedOrder, goHome, goToProducts, language, formatPrice, client, t } = useStore();

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(order.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 pb-24">
      <Breadcrumb />

      {/* 2. Order Confirmation Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ar' ? 'تم تأكيد الطلب بنجاح' : 'Order Successfully Registered'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('orderSuccessTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {t('orderSuccessSubtitle')}
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              id="print-invoice-btn"
              className="flex-1 sm:flex-none min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer touch-manipulation active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{t('printInvoice')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-start">
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {t('orderNumber')}
            </span>
            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-base font-black text-primary font-mono tracking-tight">{order.orderId}</p>
              <button
                type="button"
                onClick={handleCopyOrderId}
                id="copy-order-id-btn"
                className="min-h-11 min-w-11 flex items-center justify-center text-slate-500 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors cursor-pointer touch-manipulation"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {language === 'ar' ? 'موعد التسليم المتوقع' : 'Delivery ETA'}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs font-black text-slate-900 line-clamp-2 leading-tight">
                {order.estimatedDelivery || t('etaConfirmedOnShipping')}
              </p>
            </div>
          </div>

          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              {t('orderTotal')}
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <p className="text-base font-black text-slate-900">{formatPrice(order.total)}</p>
              <span className="text-[10px] text-slate-400 font-medium">
                ({language === 'ar' ? `شامل الضريبة ${client.tax.vatPercent}%` : `Incl. ${client.tax.vatPercent}% VAT`})
              </span>
            </div>
          </div>

          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              {t('deliveryTo')}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-xs font-bold text-slate-800 truncate">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 text-start">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('trackingTimeline')}</h3>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {language === 'ar' ? 'قيد التجهيز في مركز التوزيع' : 'In Fulfillment Center'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold">
            <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-5 h-5" />
              </div>
              <div>{t('statusReceived')}</div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {new Date(order.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
              </span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 relative">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto ring-4 ring-blue-100 animate-pulse">
                <Package className="w-5 h-5" />
              </div>
              <div>{t('statusPreparing')}</div>
              <span className="text-[10px] text-blue-600 font-bold block">
                {language === 'ar' ? 'جاري الفحص والتغليف' : 'Quality Check Active'}
              </span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Truck className="w-5 h-5" />
              </div>
              <div>{t('statusShipped')}</div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>{t('statusDelivered')}</div>
              <span className="text-[10px] text-slate-400 font-normal block">
                {order.estimatedDelivery || t('etaConfirmedOnShipping')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {language === 'ar' ? 'تفاصيل المنتجات المطلوبة' : 'Order Items Summary'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {order.items.length} {t('items')}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="py-4 first:pt-1 last:pb-1 flex items-start gap-3.5 group">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title[language]}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0 group-hover:scale-103 transition-transform"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.product.title[language]}
                      </h3>
                      <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{item.product.brand}</div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.selectedColor && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full border border-slate-300" style={{ backgroundColor: item.selectedColor.colorHex }} />
                          <span>{item.selectedColor.name[language]}</span>
                        </span>
                      )}
                      {item.selectedStorage && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                          {item.selectedStorage.name[language]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                    <span>
                      {language === 'ar' ? 'الكمية' : 'Qty'}: <strong className="text-slate-800 font-bold">{item.quantity}</strong>
                    </span>
                    <span className="text-[11px]">
                      {language === 'ar' ? 'سعر الوحدة' : 'Unit price'}: {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {client.policies.warrantyPolicy && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('valueProp2Title')}</span>
              </div>
              <span>{client.policies.warrantyPolicy[language]}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              {language === 'ar' ? 'ملخص الدفع والفاتورة' : 'Payment Summary'}
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>{t('shipping')}</span>
                  <span className="text-[10px] text-slate-400 capitalize">({order.deliveryMethod})</span>
                </span>
                <span className="font-semibold text-slate-900">
                  {order.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">{t('freeShipping')}</span>
                  ) : (
                    formatPrice(order.shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{client.tax.vatLabel[language]}</span>
                <span className="font-semibold text-slate-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">{t('orderTotal')}</span>
                </div>
                <span className="text-xl font-black text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              {language === 'ar' ? 'بيانات المستلم والتوصيل' : 'Delivery & Customer Info'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">{t('fullName')}</span>
                  <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                </div>
              </div>

              {order.shippingAddress.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">{t('emailAddress')}</span>
                    <p className="font-semibold text-slate-800">{order.shippingAddress.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">{t('phoneNumber')}</span>
                  <p className="font-semibold text-slate-800" dir="ltr">{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">{t('deliveryTo')}</span>
                  <p className="font-bold text-slate-900">{order.shippingAddress.addressLine}</p>
                  <p className="text-slate-600">
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.deliveryNotes && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-md mt-1 border border-amber-200">
                      <strong>{language === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> {order.shippingAddress.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">{t('paymentMode')}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900 capitalize">
                      {paymentMethodLabelById(client, order.paymentMethod, language)}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      {language === 'ar' ? 'تم الدفع بنجاح' : 'Authorized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
        <button
          id="order-confirmation-continue-shopping-btn"
          onClick={() => {
            setConfirmedOrder(null);
            goToProducts();
          }}
          className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer touch-manipulation active:scale-95"
        >
          <span>{t('continueShopping')}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>

        <button
          id="order-confirmation-back-home-btn"
          onClick={() => {
            setConfirmedOrder(null);
            goHome();
          }}
          className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95"
        >
          <span>{t('backToHome')}</span>
        </button>
      </div>
    </div>
  );
};
