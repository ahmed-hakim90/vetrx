/* eslint-disable react-refresh/only-export-components -- useStore is the
   required companion hook to StoreProvider; splitting it into a separate
   file would only add indirection for a template of this size. */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Language,
  Currency,
  Category,
  Product,
  CartItem,
  ProductVariant,
  OrderDetails,
} from '../types/store';
import { translations } from '../data/translations';
import { activeClient } from '../config/active-client';
import { ClientConfig } from '../config/clients/schema';
import { readClientStorage, writeClientStorage } from '../core/storage/clientStorage';
import { getDemoProductsForClient, getDemoCategoriesForClient } from '../core/commerce/demoCatalog';
import { WooCommerceCatalogProvider } from '../core/catalog/WooCommerceCatalogProvider';
import { loadLiveCatalog, resolveCatalogUrl } from '../core/catalog/loadLiveCatalog';

export type TranslationKey = keyof typeof translations.en;

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  client: ClientConfig;
  products: Product[];
  categories: Category[];
  catalogLoading: boolean;
  catalogError: string | null;
  retryCatalog: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductVariant,
    selectedStorage?: ProductVariant
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  formatPrice: (amount: number) => string;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
  confirmedOrder: OrderDetails | null;
  setConfirmedOrder: (order: OrderDetails | null) => void;
  // Semantic navigation helpers backed by react-router — components never
  // call `navigate(...)` with a raw path themselves, so the URL scheme for
  // a given action lives in exactly one place.
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (categoryId: string) => void;
  goHome: () => void;
  goToProducts: () => void;
  goToCart: () => void;
  goToWishlist: () => void;
  goToCheckout: () => void;
  goToOrder: (orderId: string) => void;
}

const LANGUAGE_STORAGE_KEY = 'preferences:language';

function resolveInitialLanguage(): Language {
  const saved = readClientStorage<Language | null>(activeClient.id, LANGUAGE_STORAGE_KEY, null);
  if (saved && activeClient.supportedLocales.includes(saved)) {
    return saved;
  }
  // No saved preference: use the client's own default, never the browser's
  // language — a first-time visitor always sees the client's chosen default
  // locale/direction, not one guessed from their browser/OS settings.
  return activeClient.defaultLocale;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(resolveInitialLanguage);
  const [currency, setCurrencyState] = useState<Currency>(() =>
    readClientStorage<Currency>(activeClient.id, 'preferences:currency', activeClient.defaultCurrency)
  );
  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    writeClientStorage(activeClient.id, 'preferences:currency', curr);
  };

  // Cart and wishlist are namespaced per client id in localStorage, so no
  // data from another client's deployment can ever surface in this one.
  const [cart, setCart] = useState<CartItem[]>(() =>
    readClientStorage<CartItem[]>(activeClient.id, 'cart', [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readClientStorage<string[]>(activeClient.id, 'wishlist', [])
  );

  useEffect(() => {
    writeClientStorage(activeClient.id, 'cart', cart);
  }, [cart]);

  useEffect(() => {
    writeClientStorage(activeClient.id, 'wishlist', wishlist);
  }, [wishlist]);

  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeClientStorage(activeClient.id, LANGUAGE_STORAGE_KEY, lang);
  };

  // Sync HTML dir/lang attributes whenever the language changes.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const isLive = activeClient.commerce.provider !== 'mock';
  const [clientProducts, setClientProducts] = useState<Product[]>(() =>
    isLive ? [] : getDemoProductsForClient(activeClient.id)
  );
  const [clientCategories, setClientCategories] = useState<Category[]>(() =>
    isLive ? [] : getDemoCategoriesForClient(activeClient.id)
  );
  const [catalogLoading, setCatalogLoading] = useState(isLive);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogAttempt, setCatalogAttempt] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    const controller = new AbortController();
    setCatalogLoading(true);
    setCatalogError(null);
    // CLAUDE HANDOFF: Vite browser values come from import.meta.env, not process.env.
    // Live failures remain visible; NEVER retain demo products as a fallback.
    const load = async () => {
      try {
        if (activeClient.commerce.provider !== 'woocommerce') throw new Error('Unsupported live catalog provider');
        const url = resolveCatalogUrl(activeClient, import.meta.env);
        const minorUnit = new Intl.NumberFormat('en', { style: 'currency', currency: activeClient.defaultCurrency }).resolvedOptions().maximumFractionDigits;
        const provider = new WooCommerceCatalogProvider(url, activeClient.defaultCurrency, minorUnit);
        const result = await loadLiveCatalog(provider, activeClient.id, controller.signal);
        if (controller.signal.aborted) return;
        setClientProducts(result.products);
        setClientCategories(result.categories);
      } catch (error) {
        if (controller.signal.aborted) return;
        setClientProducts([]);
        setClientCategories([]);
        setCatalogError(error instanceof Error ? error.message : 'Catalog unavailable');
      } finally {
        if (!controller.signal.aborted) setCatalogLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [isLive, catalogAttempt]);

  // A product "slug" is just its id today (see README — real slugs would
  // come from a real CommerceProvider). No fallback to another product: an
  // unknown slug means "not found", and callers must render a real 404.
  const getProductBySlug = (slug: string): Product | undefined =>
    clientProducts.find((p) => p.id === slug);

  // Translation helper
  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let text = (dict as Record<string, string>)[key] || translations.en[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return text;
  };

  // Price formatting. `amount` is always in the active client's own default
  // currency (each client's catalog is priced directly in that currency) —
  // the `rate` only matters for a client that genuinely offers more than one.
  const formatPrice = (amount: number): string => {
    const cfg =
      activeClient.currencies.find((c) => c.code === currency) ??
      activeClient.currencies.find((c) => c.code === activeClient.defaultCurrency)!;
    const converted = amount * cfg.rate;
    const symbol = cfg.symbol[language];
    const formattedNumber = Math.round(converted).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    // A symbol that's already a prefix glyph (e.g. "$") reads wrong with a
    // space in either direction.
    if (symbol.length === 1) {
      return `${symbol}${formattedNumber}`;
    }
    return language === 'ar' ? `${formattedNumber} ${symbol}` : `${symbol} ${formattedNumber}`;
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: ProductVariant,
    selectedStorage?: ProductVariant
  ) => {
    const priceAdjustment =
      (selectedColor?.priceAdjustment || 0) + (selectedStorage?.priceAdjustment || 0);
    const unitPrice = product.price + priceAdjustment;
    const variantKey = `${product.id}_${selectedColor?.id || 'default'}_${selectedStorage?.id || 'default'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === variantKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: variantKey,
            product,
            quantity,
            selectedColor,
            selectedStorage,
            unitPrice,
            totalPrice: quantity * unitPrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Coupon handling — demo codes come from the active client's config, not
  // a hardcoded brand-specific list.
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const match = activeClient.demoCouponCodes.find((c) => c.code.toUpperCase() === cleanCode);
    if (match) {
      setAppliedCoupon({ code: match.code, discountPercent: match.discountPercent });
      return { success: true, message: t('couponSuccess', { discount: match.discountPercent }) };
    }
    return { success: false, message: t('couponInvalid') };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Navigation — the only place in the app that knows the URL scheme.
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/product/${encodeURIComponent(productId)}`);
    scrollToTop();
  };

  const navigateToCategory = (categoryId: string) => {
    navigate(categoryId === 'all' ? '/products' : `/category/${encodeURIComponent(categoryId)}`);
    scrollToTop();
  };

  const goHome = () => {
    navigate('/');
    scrollToTop();
  };

  const goToProducts = () => {
    navigate('/products');
    scrollToTop();
  };

  const goToCart = () => {
    navigate('/cart');
    scrollToTop();
  };

  const goToWishlist = () => {
    navigate('/wishlist');
    scrollToTop();
  };

  const goToCheckout = () => {
    navigate('/checkout');
    scrollToTop();
  };

  const goToOrder = (orderId: string) => {
    navigate(`/order/${encodeURIComponent(orderId)}`);
    scrollToTop();
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        client: activeClient,
        products: clientProducts,
        categories: clientCategories,
        catalogLoading,
        catalogError,
        retryCatalog: () => setCatalogAttempt(attempt => attempt + 1),
        getProductBySlug,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        quickViewProductId,
        setQuickViewProductId,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        formatPrice,
        t,
        confirmedOrder,
        setConfirmedOrder,
        navigateToProduct,
        navigateToCategory,
        goHome,
        goToProducts,
        goToCart,
        goToWishlist,
        goToCheckout,
        goToOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
