export type Language = 'en' | 'ar';
export type Currency = 'AED' | 'SAR' | 'USD';
export type Screen = 'home' | 'plp' | 'pdp' | 'checkout' | 'order-confirmation';
export type StoreId = 'voltix' | 'apex' | 'lumina';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface StoreConfig {
  id: StoreId;
  name: LocalizedString;
  tagline: LocalizedString;
  badge: LocalizedString;
  primaryColor: string;
  accentColor: string;
  chipClass: string;
  bannerGradient: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  icon: string;
  count: number;
  image: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: LocalizedString;
  colorHex?: string;
  priceAdjustment: number;
  sku: string;
  stock: number;
}

export interface ProductSpec {
  label: LocalizedString;
  value: LocalizedString;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: LocalizedString;
  comment: LocalizedString;
  verified: boolean;
}

export interface Product {
  id: string;
  storeId: StoreId;
  title: LocalizedString;
  brand: string;
  category: string;
  price: number; // Base price in AED
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: LocalizedString;
  shortSpecs: LocalizedString[];
  badge?: {
    text: LocalizedString;
    type: 'sale' | 'hot' | 'new' | 'deal';
  };
  inStock: boolean;
  stockCount: number;
  variants?: {
    colors?: ProductVariant[];
    storage?: ProductVariant[];
  };
  specs: {
    group: LocalizedString;
    items: ProductSpec[];
  }[];
  reviews: ProductReview[];
  warranty: LocalizedString;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealSoldPercentage?: number;
}

export interface CartItem {
  id: string; // Unique combination of product id + variant ids
  product: Product;
  quantity: number;
  selectedColor?: ProductVariant;
  selectedStorage?: ProductVariant;
  unitPrice: number;
  totalPrice: number;
}

export interface FilterState {
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  viewMode: 'grid' | 'list';
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  addressLine: string;
  deliveryNotes?: string;
}

export interface OrderDetails {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: Currency;
  shippingAddress: ShippingAddress;
  deliveryMethod: 'standard' | 'express' | 'same-day';
  paymentMethod: 'card' | 'apple_pay' | 'cod' | 'tabby';
  status: 'confirmed' | 'processing' | 'shipped';
  estimatedDelivery: string;
}
