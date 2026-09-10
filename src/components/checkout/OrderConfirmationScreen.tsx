import React, { useState } from 'react';
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
  RefreshCw,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { PRODUCTS } from '../../data/mockData';
import { OrderDetails } from '../../types/store';

export const OrderConfirmationScreen: React.FC = () => {
  const {
    confirmedOrder,
    setConfirmedOrder,
    setActiveScreen,
    language,
    formatPrice,
    currency,
    t,
  } = useStore();

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Dynamic ETA calculation helpers
  const calculateDynamicEta = (deliveryType: 'standard' | 'express' | 'same-day' = 'express') => {
    const now = new Date();
    if (deliveryType === 'same-day') {
      const todayHour = 20; // 8:00 PM
      return language === 'ar'
        ? `اليوم، بحلول الساعة ${todayHour % 12}:00 مساءً`
        : `Today, by 8:00 PM`;
    } else if (deliveryType === 'express') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return language === 'ar'
        ? `غداً (${dateStr}) بحلول الساعة 2:00 ظهراً`
        : `Tomorrow (${dateStr}) by 2:00 PM`;
    } else {
      const standardDate = new Date(now);
      standardDate.setDate(standardDate.getDate() + 3);
      const dateStr = standardDate.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return language === 'ar'
        ? `في غضون 2-3 أيام عمل (${dateStr})`
        : `Within 2-3 Business Days (${dateStr})`;
    }
  };

  // Build fallback order with dynamic content placeholders if user navigates directly to this route
  const activeOrder: OrderDetails = React.useMemo(() => {
    if (confirmedOrder) {
      return confirmedOrder;
    }

    const defaultItems = [
      {
        id: 'sample-p1',
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: PRODUCTS[0].variants?.colors?.[0],
        selectedStorage: PRODUCTS[0].variants?.storage?.[1],
        unitPrice: PRODUCTS[0].price,
        totalPrice: PRODUCTS[0].price,
      },
      {
        id: 'sample-p2',
        product: PRODUCTS[1],
        quantity: 1,
        selectedColor: PRODUCTS[1].variants?.colors?.[0],
        unitPrice: PRODUCTS[1].price,
        totalPrice: PRODUCTS[1].price,
      },
    ];

    const sub = PRODUCTS[0].price + PRODUCTS[1].price;
    const tax = Math.round(sub * 0.05);
    const ship = 15;

    return {
      orderId: `VTX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: defaultItems,
      subtotal: sub,
      shippingFee: ship,
      tax: tax,
      discount: 0,
      total: sub + tax + ship,
      currency: currency,
      shippingAddress: {
        fullName: 'Tariq Al-Mansoor',
        email: 'tariq.mansoor@example.ae',
        phone: '+971 50 849 2031',
        country: 'United Arab Emirates',
        city: 'Dubai',
        addressLine: 'Downtown Boulevard, Sky Tower, Apt 1402',
        deliveryNotes: 'Leave with front desk concierge if not answered',
      },
      deliveryMethod: 'express',
      paymentMethod: 'card',
      status: 'confirmed',
      estimatedDelivery: calculateDynamicEta('express'),
    };
  }, [confirmedOrder, currency, language]);

  // Dynamic placeholders state for testing & demonstration
  const [currentOrderId, setCurrentOrderId] = useState(activeOrder.orderId);
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState<'standard' | 'express' | 'same-day'>(
    activeOrder.deliveryMethod || 'express'
  );
  const [dynamicEta, setDynamicEta] = useState(
    activeOrder.estimatedDelivery || calculateDynamicEta('express')
  );

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(currentOrderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleRegenerateDynamicPlaceholders = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const newId = `VTX-${Math.floor(100000 + Math.random() * 900000)}`;
      setCurrentOrderId(newId);
      setDynamicEta(calculateDynamicEta(selectedDeliverySpeed));
      setIsRegenerating(false);
    }, 400);
  };

  const handleDeliverySpeedChange = (speed: 'standard' | 'express' | 'same-day') => {
    setSelectedDeliverySpeed(speed);
    setDynamicEta(calculateDynamicEta(speed));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 pb-24">
      {/* 1. Breadcrumb navigation */}
      <Breadcrumb
        items={[
          { label: t('navHome'), screen: 'home', onClick: () => setActiveScreen('home') },
          { label: t('cart'), screen: 'checkout', onClick: () => setActiveScreen('checkout') },
          { label: t('orderSuccessTitle').split('!')[0], active: true },
        ]}
      />

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

          {/* Print & Action Buttons */}
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

        {/* 3. Key Order Dynamic Credentials Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-start">
          {/* Dynamic Placeholder: Order ID */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {t('orderNumber')}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {language === 'ar' ? 'ديناميكي' : 'Dynamic ID'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <p
                id="dynamic-order-id-placeholder"
                className="text-base font-black text-blue-600 font-mono tracking-tight"
              >
                {currentOrderId}
              </p>
              <button
                onClick={handleCopyOrderId}
                id="copy-order-id-btn"
                className="min-h-11 min-w-11 flex items-center justify-center text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer touch-manipulation"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copiedOrderId ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Placeholder: Delivery ETA */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {language === 'ar' ? 'موعد التسليم المتوقع' : 'Delivery ETA'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {language === 'ar' ? 'تقديري' : 'Live ETA'}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <p
                id="dynamic-delivery-eta-placeholder"
                className="text-xs font-black text-slate-900 line-clamp-2 leading-tight"
              >
                {dynamicEta}
              </p>
            </div>
          </div>

          {/* Order Total */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              {t('orderTotal')}
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <p className="text-base font-black text-slate-900">
                {formatPrice(activeOrder.total)}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">
                ({language === 'ar' ? 'شامل الضريبة 5%' : 'Incl. 5% GCC VAT'})
              </span>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              {t('deliveryTo')}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-xs font-bold text-slate-800 truncate">
                {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Placeholder Control Toolbar (for testing dynamic content variations) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {language === 'ar' ? 'محاكي المعاينة الديناميكية للطلب' : 'Dynamic ETA & Order Placeholder Simulator'}
              </span>
              <p className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'قم بتبديل سرعة الشحن أو إعادة توليد المعرف لاختبار الحقول الديناميكية'
                  : 'Toggle shipping tier or re-generate reference to preview dynamic content reactivity'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
              {(['standard', 'express', 'same-day'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleDeliverySpeedChange(tier)}
                  className={`min-h-11 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer touch-manipulation flex items-center ${
                    selectedDeliverySpeed === tier
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tier === 'standard' && (language === 'ar' ? 'عادي (2-3 أيام)' : 'Standard (2-3 Days)')}
                  {tier === 'express' && (language === 'ar' ? 'سريع (غداً)' : 'Express (Tomorrow)')}
                  {tier === 'same-day' && (language === 'ar' ? 'نفس اليوم VIP' : 'Same-Day VIP')}
                </button>
              ))}
            </div>

            <button
              onClick={handleRegenerateDynamicPlaceholders}
              disabled={isRegenerating}
              className="min-h-11 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer touch-manipulation active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{language === 'ar' ? 'تحديث المعرف' : 'Regenerate ID'}</span>
            </button>
          </div>
        </div>

        {/* 4. Tracking Status Progress Bar */}
        <div className="space-y-4 pt-2 text-start">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('trackingTimeline')}
            </h3>
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
                {activeOrder.date}
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
              <span className="text-[10px] text-slate-400 font-normal block">
                {language === 'ar' ? 'مع مندوب التوصيل' : 'Courier Assigned'}
              </span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>{t('statusDelivered')}</div>
              <span className="text-[10px] text-slate-400 font-normal block">
                {dynamicEta}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detailed Two-Column Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Purchased Items List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {language === 'ar' ? 'تفاصيل المنتجات المطلوبة' : 'Order Items Summary'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {activeOrder.items.length} {t('items')}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activeOrder.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="py-4 first:pt-1 last:pb-1 flex items-start gap-3.5 group"
              >
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

                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.product.brand}
                    </div>

                    {/* Variant specs */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.selectedColor && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor.colorHex }}
                          />
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
                      {language === 'ar' ? 'الكمية' : 'Qty'}:{' '}
                      <strong className="text-slate-800 font-bold">{item.quantity}</strong>
                    </span>
                    <span className="text-[11px]">
                      {language === 'ar' ? 'سعر الوحدة' : 'Unit price'}: {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('valueProp2Title')}</span>
            </div>
            <span>{language === 'ar' ? 'ضمان رسمي معتمد' : '100% Authorized GCC Warranty'}</span>
          </div>
        </div>

        {/* Right: Financial Breakdown & Shipping/Payment details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Price Calculation Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              {language === 'ar' ? 'ملخص الدفع والفاتورة' : 'Payment Summary'}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-slate-900">{formatPrice(activeOrder.subtotal)}</span>
              </div>

              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(activeOrder.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>{t('shipping')}</span>
                  <span className="text-[10px] text-slate-400">
                    ({selectedDeliverySpeed === 'same-day' ? 'VIP Same-Day' : selectedDeliverySpeed === 'express' ? 'Express' : 'Standard'})
                  </span>
                </span>
                <span className="font-semibold text-slate-900">
                  {activeOrder.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">{t('freeShipping')}</span>
                  ) : (
                    formatPrice(activeOrder.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{language === 'ar' ? 'ضريبة القيمة المضافة (5%)' : 'GCC VAT (5%)'}</span>
                <span className="font-semibold text-slate-900">{formatPrice(activeOrder.tax)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">{t('orderTotal')}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'ar' ? 'الدفعة المسددة بالكامل' : 'Paid in full via secure gateway'}
                  </span>
                </div>
                <span className="text-xl font-black text-blue-600">
                  {formatPrice(activeOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              {language === 'ar' ? 'بيانات المستلم والتوصيل' : 'Delivery & Customer Info'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">
                    {t('fullName')}
                  </span>
                  <p className="font-bold text-slate-900">{activeOrder.shippingAddress.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">
                    {t('emailAddress')}
                  </span>
                  <p className="font-semibold text-slate-800">{activeOrder.shippingAddress.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">
                    {t('phoneNumber')}
                  </span>
                  <p className="font-semibold text-slate-800" dir="ltr">
                    {activeOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">
                    {t('deliveryTo')}
                  </span>
                  <p className="font-bold text-slate-900">
                    {activeOrder.shippingAddress.addressLine}
                  </p>
                  <p className="text-slate-600">
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country}
                  </p>
                  {activeOrder.shippingAddress.deliveryNotes && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-md mt-1 border border-amber-200">
                      <strong>{language === 'ar' ? 'ملاحظة:' : 'Note:'}</strong>{' '}
                      {activeOrder.shippingAddress.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">
                    {t('paymentMode')}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900 capitalize">
                      {activeOrder.paymentMethod === 'card'
                        ? t('paymentCard')
                        : activeOrder.paymentMethod === 'apple_pay'
                        ? t('paymentApplePay')
                        : activeOrder.paymentMethod === 'tabby'
                        ? t('paymentTabby')
                        : t('paymentCOD')}
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

      {/* 6. Navigation Actions across Mobile Viewports (min-h-11 44px sizing) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
        <button
          id="order-confirmation-continue-shopping-btn"
          onClick={() => {
            setConfirmedOrder(null);
            setActiveScreen('plp');
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
            setActiveScreen('home');
          }}
          className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95"
        >
          <span>{t('backToHome')}</span>
        </button>
      </div>
    </div>
  );
};
