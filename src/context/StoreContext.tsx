import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Language,
  Currency,
  Screen,
  StoreId,
  StoreConfig,
  Product,
  CartItem,
  FilterState,
  ProductVariant,
  OrderDetails,
} from '../types/store';
import { STORES, PRODUCTS, CURRENCY_CONFIG } from '../data/mockData';
import { translations } from '../data/translations';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  activeStore: StoreId;
  setActiveStore: (storeId: StoreId) => void;
  currentStoreConfig: StoreConfig;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedProduct: Product | undefined;
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
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  formatPrice: (amountInAED: number) => string;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
  confirmedOrder: OrderDetails | null;
  setConfirmedOrder: (order: OrderDetails | null) => void;
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (categoryId: string) => void;
}

const initialFilterState: FilterState = {
  category: 'all',
  brands: [],
  minPrice: 0,
  maxPrice: 15000,
  inStockOnly: false,
  minRating: 0,
  searchQuery: '',
  sortBy: 'featured',
  viewMode: 'grid',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('AED');
  const [activeStore, setActiveStore] = useState<StoreId>('voltix');
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-iphone-16-pro-max');
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'prod-iphone-16-pro-max_c-nat_s-512',
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: PRODUCTS[0].variants?.colors?.[0],
      selectedStorage: PRODUCTS[0].variants?.storage?.[1],
      unitPrice: PRODUCTS[0].price,
      totalPrice: PRODUCTS[0].price,
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-sony-wh1000xm5']);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  // Sync HTML dir and lang attributes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentStoreConfig = useMemo(() => {
    return STORES.find((s) => s.id === activeStore) || STORES[0];
  }, [activeStore]);

  const selectedProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  }, [selectedProductId]);

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

  // Price formatting
  const formatPrice = (amountInAED: number): string => {
    const cfg = CURRENCY_CONFIG[currency];
    const converted = amountInAED * cfg.rate;
    const symbol = cfg.symbol[language];
    const formattedNumber = Math.round(converted).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    if (currency === 'USD') {
      return `$${formattedNumber}`;
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

    setIsCartOpen(true);
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

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VOLTIX10') {
      setAppliedCoupon({ code: 'VOLTIX10', discountPercent: 10 });
      return { success: true, message: t('couponSuccess', { discount: 10 }) };
    }
    if (cleanCode === 'WELCOME50') {
      setAppliedCoupon({ code: 'WELCOME50', discountPercent: 15 });
      return { success: true, message: t('couponSuccess', { discount: 15 }) };
    }
    return { success: false, message: t('couponInvalid') };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  // Navigators
  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveScreen('pdp');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCategory = (categoryId: string) => {
    setFilterState((prev) => ({
      ...prev,
      category: categoryId,
    }));
    setActiveScreen('plp');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        activeStore,
        setActiveStore,
        currentStoreConfig,
        activeScreen,
        setActiveScreen,
        selectedProductId,
        setSelectedProductId,
        selectedProduct,
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
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProductId,
        setQuickViewProductId,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        filterState,
        setFilterState,
        resetFilters,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        formatPrice,
        t,
        confirmedOrder,
        setConfirmedOrder,
        navigateToProduct,
        navigateToCategory,
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
