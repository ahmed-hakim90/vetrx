import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/mockData';
import { ProductVariant } from '../../types/store';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProductId,
    setQuickViewProductId,
    addToCart,
    formatPrice,
    language,
    t,
    navigateToProduct,
  } = useStore();

  if (!quickViewProductId) return null;

  const product = PRODUCTS.find((p) => p.id === quickViewProductId);
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductVariant | undefined>(
    product.variants?.colors?.[0]
  );
  const [selectedStorage, setSelectedStorage] = useState<ProductVariant | undefined>(
    product.variants?.storage?.[0]
  );
  const [added, setAdded] = useState(false);

  const priceAdjustment =
    (selectedColor?.priceAdjustment || 0) + (selectedStorage?.priceAdjustment || 0);
  const currentPrice = product.price + priceAdjustment;
  const originalPrice = product.originalPrice ? product.originalPrice + priceAdjustment : undefined;
  const installment4 = Math.round(currentPrice / 4);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedColor, selectedStorage);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProductId(null);
    }, 900);
  };

  const handleViewFullDetails = () => {
    setQuickViewProductId(null);
    navigateToProduct(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProductId(null)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card (Bottom-sheet on small mobile, rounded dialog on tablet/desktop) */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-quick-view-btn"
          onClick={() => setQuickViewProductId(null)}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Left: Product Image */}
          <div className="relative bg-slate-50 rounded-2xl p-4 flex items-center justify-center aspect-square border border-slate-200">
            <img
              src={product.images[0]}
              alt={product.title[language]}
              className="w-full h-full object-contain max-h-56 sm:max-h-64"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                {product.badge.text[language]}
              </span>
            )}
          </div>

          {/* Right: Details & Configurator */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-blue-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-2">
                {product.title[language]}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(currentPrice)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {/* Installment preview */}
              <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg inline-block font-semibold">
                {t('installmentText', { amount: formatPrice(installment4) })} <strong>Tabby</strong>
              </div>
            </div>

            {/* Colors */}
            {product.variants?.colors && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800">
                  {t('selectColor')}: {selectedColor?.name[language]}
                </span>
                <div className="flex items-center gap-2">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        selectedColor?.id === c.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      <span className="text-[11px]">{c.name[language]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {product.variants?.storage && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800">
                  {t('selectStorage')}
                </span>
                <div className="flex items-center gap-2">
                  {product.variants.storage.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStorage(s)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                        selectedStorage?.id === s.id
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {s.name[language]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t('addedToCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleViewFullDetails}
                className="w-full text-xs font-bold text-blue-600 hover:text-blue-800 py-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t('viewFullDetails')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
