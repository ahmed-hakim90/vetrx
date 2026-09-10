import { Category, Product, CartItem, OrderDetails, ShippingAddress } from '../../types/store';

// Typed error so callers can branch on `code` instead of parsing a message.
export class CommerceError extends Error {
  constructor(
    public readonly code:
      | 'NOT_FOUND'
      | 'OUT_OF_STOCK'
      | 'INVALID_COUPON'
      | 'INVALID_REQUEST'
      | 'PROVIDER_UNAVAILABLE',
    message: string
  ) {
    super(message);
    this.name = 'CommerceError';
  }
}

export interface CartValidationIssueItem {
  cartItemId: string;
  reason: 'price_changed' | 'out_of_stock' | 'removed';
  message: { en: string; ar: string };
}

export interface CartValidationResult {
  // The cart, corrected against the current source of truth (price/stock).
  // The UI should use these items, not the ones it sent in.
  items: CartItem[];
  issues: CartValidationIssueItem[];
  valid: boolean;
}

export interface InventoryInfo {
  productId: string;
  inStock: boolean;
  stockCount: number;
}

export interface CouponResult {
  success: boolean;
  code?: string;
  discountPercent?: number;
  message: string;
}

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export interface ShippingRequest {
  governorateId?: string;
  method: DeliveryMethod;
  subtotal: number;
}

export interface ShippingResult {
  fee: number;
  // False when the store has no published fee for this request yet (no
  // courier rate agreed, or no address given). The UI must then show that
  // shipping is not quoted — never "0" or "FREE".
  feeQuoted: boolean;
  etaMessage: { en: string; ar: string } | null;
}

export interface TaxResult {
  amount: number;
  label: { en: string; ar: string };
  // False when this business is not (confirmed to be) charging tax, in which
  // case no tax line should be displayed at all.
  applied: boolean;
}

export interface TotalsRequest {
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
}

export interface TotalsResult {
  total: number;
}

export interface CreateOrderRequest {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: OrderDetails['paymentMethod'];
}

// The interface every product/order data source implements — the demo
// catalog today (MockCommerceProvider), a real WooCommerce/REST backend
// tomorrow. Components never import demo data directly; they only ever
// call through this interface (see StoreContext / CartPage / CheckoutScreen).
export interface CommerceProvider {
  getProducts(clientId: string, signal?: AbortSignal): Promise<Product[]>;
  getProductBySlug(clientId: string, slug: string, signal?: AbortSignal): Promise<Product | undefined>;
  getCategories(clientId: string, signal?: AbortSignal): Promise<Category[]>;
  searchProducts(clientId: string, query: string, signal?: AbortSignal): Promise<Product[]>;
  validateCart(clientId: string, items: CartItem[]): Promise<CartValidationResult>;
  getInventory(clientId: string, productId: string): Promise<InventoryInfo>;
  applyCoupon(clientId: string, code: string, subtotal: number): Promise<CouponResult>;
  calculateShipping(clientId: string, request: ShippingRequest): Promise<ShippingResult>;
  calculateTaxes(clientId: string, subtotal: number): Promise<TaxResult>;
  calculateTotals(clientId: string, request: TotalsRequest): Promise<TotalsResult>;
  createOrder(clientId: string, request: CreateOrderRequest): Promise<OrderDetails>;
  getOrder(clientId: string, orderId: string): Promise<OrderDetails | undefined>;
}
