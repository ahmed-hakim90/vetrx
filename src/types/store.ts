export type Language = 'en' | 'ar';
// A currency code declared by the active client (see ClientConfig.currencies).
// Deliberately not a fixed union: hardcoding every market's currency codes
// here would ship them all in every client's bundle.
export type Currency = string;
export type Screen = 'home' | 'plp' | 'pdp' | 'checkout' | 'order-confirmation';
// Identifies which example client a demo product belongs to in the shared
// demo catalog (src/data/mockData.ts) — not a live, user-facing store switch.
export type StoreId = 'voltix' | 'apex' | 'lumina' | 'shams';

export interface LocalizedString {
  en: string;
  ar: string;
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
  // Marks this as demo/placeholder catalog data (not a real, sellable
  // listing) — set on every product shipped with this template.
  isDemo?: boolean;
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
  // Optional: some markets (see ClientConfig.market === 'egypt') don't
  // require an email address for delivery.
  email?: string;
  phone: string;
  country: string;
  // Generic display fields, always populated regardless of market so
  // existing order-summary rendering works unchanged either way. For the
  // Egypt market, `city` holds the governorate display name and
  // `addressLine` is composed from the granular fields below.
  city: string;
  addressLine: string;
  deliveryNotes?: string;
  // Egypt-market granular address fields (present when market === 'egypt').
  governorateId?: string;
  areaOrCity?: string;
  streetName?: string;
  buildingNumber?: string;
  floorApartment?: string;
  landmark?: string;
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
  deliveryMethod: 'standard' | 'express' | 'same-day' | 'pickup';
  paymentMethod: 'card' | 'apple_pay' | 'cod' | 'tabby';
  status: 'confirmed' | 'processing' | 'shipped';
  estimatedDelivery: string;
}
