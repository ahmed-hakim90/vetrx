import { CartItem, Category, OrderDetails, Product } from '../../types/store';
import { activeClient } from '../../config/active-client';
import { getDemoProductsForClient, getDemoCategoriesForClient } from './demoCatalog';
import {
  CommerceError,
  CommerceProvider,
  CartValidationResult,
  InventoryInfo,
  CouponResult,
  ShippingRequest,
  ShippingResult,
  TaxResult,
  TotalsRequest,
  TotalsResult,
  CreateOrderRequest,
} from './types';

const ORDER_STORAGE_PREFIX = 'commerce:orders:';

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new CommerceError('INVALID_REQUEST', 'Request was cancelled.');
  }
}

// This deployment serves exactly one client, so the only valid clientId is
// the active one — looking it up in a registry of every client would pull
// every other client's config (and brand names) into this bundle.
function getClient(clientId: string) {
  if (clientId !== activeClient.id) {
    throw new CommerceError('NOT_FOUND', `Unknown client id: ${clientId}`);
  }
  return activeClient;
}

function readOrders(clientId: string): Record<string, OrderDetails> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_PREFIX + clientId);
    return raw ? (JSON.parse(raw) as Record<string, OrderDetails>) : {};
  } catch {
    return {};
  }
}

function writeOrders(clientId: string, orders: Record<string, OrderDetails>): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(ORDER_STORAGE_PREFIX + clientId, JSON.stringify(orders));
  } catch {
    // Storage full/disabled — non-fatal in Demo Mode.
  }
}

// A demo-only, single-tenant implementation of CommerceProvider backed by
// the static per-client catalog (src/data/mockData.ts for the Gulf example
// clients, src/data/demo/shams/ for Shams) and sessionStorage for orders.
// A real deployment swaps this for a provider backed by WooCommerce/REST —
// see docs/SHAMS-LAUNCH-CHECKLIST.md — without any component changes, since
// components only ever call through the CommerceProvider interface.
export class MockCommerceProvider implements CommerceProvider {
  async getProducts(clientId: string, signal?: AbortSignal): Promise<Product[]> {
    throwIfAborted(signal);
    return getDemoProductsForClient(clientId);
  }

  async getProductBySlug(clientId: string, slug: string, signal?: AbortSignal): Promise<Product | undefined> {
    throwIfAborted(signal);
    return getDemoProductsForClient(clientId).find((p) => p.id === slug);
  }

  async getCategories(clientId: string, signal?: AbortSignal): Promise<Category[]> {
    throwIfAborted(signal);
    return getDemoCategoriesForClient(clientId);
  }

  async searchProducts(clientId: string, query: string, signal?: AbortSignal): Promise<Product[]> {
    throwIfAborted(signal);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getDemoProductsForClient(clientId).filter((p) => {
      const haystack = `${p.title.en} ${p.title.ar} ${p.brand} ${p.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  async validateCart(clientId: string, items: CartItem[]): Promise<CartValidationResult> {
    // Re-derives every cart line against the current catalog — never trusts
    // the price/stock numbers already sitting in the browser-stored cart.
    const catalog = getDemoProductsForClient(clientId);
    const issues: CartValidationResult['issues'] = [];
    const validItems: CartItem[] = [];

    for (const item of items) {
      const current = catalog.find((p) => p.id === item.product.id);
      if (!current) {
        issues.push({
          cartItemId: item.id,
          reason: 'removed',
          message: {
            en: `"${item.product.title.en}" is no longer available and was removed from your cart.`,
            ar: `"${item.product.title.ar}" لم يعد متوفراً وتم إزالته من سلتك.`,
          },
        });
        continue;
      }

      if (!current.inStock || current.stockCount <= 0) {
        issues.push({
          cartItemId: item.id,
          reason: 'out_of_stock',
          message: {
            en: `"${current.title.en}" is currently out of stock and was removed from your cart.`,
            ar: `"${current.title.ar}" غير متوفر حالياً وتم إزالته من سلتك.`,
          },
        });
        continue;
      }

      const priceAdjustment =
        (item.selectedColor?.priceAdjustment || 0) + (item.selectedStorage?.priceAdjustment || 0);
      const currentUnitPrice = current.price + priceAdjustment;
      const quantity = Math.min(item.quantity, current.stockCount);

      if (currentUnitPrice !== item.unitPrice) {
        issues.push({
          cartItemId: item.id,
          reason: 'price_changed',
          message: {
            en: `The price of "${current.title.en}" has changed.`,
            ar: `تغير سعر "${current.title.ar}".`,
          },
        });
      }

      validItems.push({
        ...item,
        product: current,
        quantity,
        unitPrice: currentUnitPrice,
        totalPrice: currentUnitPrice * quantity,
      });
    }

    return { items: validItems, issues, valid: issues.length === 0 };
  }

  async getInventory(clientId: string, productId: string): Promise<InventoryInfo> {
    const product = getDemoProductsForClient(clientId).find((p) => p.id === productId);
    if (!product) {
      throw new CommerceError('NOT_FOUND', `Product ${productId} not found.`);
    }
    return { productId, inStock: product.inStock, stockCount: product.stockCount };
  }

  async applyCoupon(clientId: string, code: string, subtotal: number): Promise<CouponResult> {
    const client = getClient(clientId);
    if (!client.featureFlags.couponsEnabled) {
      return { success: false, message: 'Coupons are not available for this store.' };
    }
    const cleanCode = code.trim().toUpperCase();
    const match = client.demoCouponCodes.find((c) => c.code.toUpperCase() === cleanCode);
    if (!match) {
      return { success: false, message: 'This coupon code is invalid.' };
    }
    if (subtotal <= 0) {
      return { success: false, message: 'Your cart is empty.' };
    }
    return { success: true, code: match.code, discountPercent: match.discountPercent, message: 'Coupon applied.' };
  }

  async calculateShipping(clientId: string, request: ShippingRequest): Promise<ShippingResult> {
    const client = getClient(clientId);
    const { shipping, featureFlags } = client;

    if (client.market === 'egypt' && !request.governorateId) {
      // No address entered yet — never guess a fee or a delivery promise.
      return { fee: 0, feeQuoted: false, etaMessage: null };
    }

    if (request.method === 'express' && !featureFlags.expressDeliveryEnabled) {
      throw new CommerceError('INVALID_REQUEST', 'Express delivery is not available for this store.');
    }
    if (request.method === 'pickup') {
      return {
        fee: 0,
        feeQuoted: true,
        etaMessage: shipping.etaConfirmed
          ? { en: 'Ready for pickup within 1-2 business days.', ar: 'جاهز للاستلام خلال 1-2 يوم عمل.' }
          : null,
      };
    }

    // A store with no agreed courier rate cannot quote a fee at all. Saying
    // "0" here would read as free delivery, which nobody promised.
    const baseFee = request.method === 'express' ? shipping.expressFee : shipping.standardFee;
    if (baseFee === undefined) {
      return { fee: 0, feeQuoted: false, etaMessage: null };
    }

    const freeShipping =
      shipping.freeShippingThreshold !== undefined && request.subtotal >= shipping.freeShippingThreshold;
    const fee = freeShipping ? 0 : baseFee;

    if (!shipping.etaConfirmed) {
      // No confirmed courier commitment yet — surface a neutral message
      // instead of inventing a delivery-time promise (see Shams config).
      return { fee, feeQuoted: true, etaMessage: null };
    }

    const etaMessage =
      request.method === 'express'
        ? { en: 'Estimated delivery: 1-2 business days.', ar: 'التوصيل المتوقع: 1-2 يوم عمل.' }
        : { en: 'Estimated delivery: 3-5 business days.', ar: 'التوصيل المتوقع: 3-5 أيام عمل.' };

    return { fee, feeQuoted: true, etaMessage };
  }

  async calculateTaxes(clientId: string, subtotal: number): Promise<TaxResult> {
    const client = getClient(clientId);
    const { tax } = client;
    // Not confirmed to be VAT-registered → charge and display nothing. A
    // statutory rate is not the same fact as "this business collects it".
    if (!tax.vatApplied) {
      return { amount: 0, label: tax.vatLabel, applied: false };
    }
    if (tax.pricesIncludeTax) {
      return { amount: 0, label: tax.vatLabel, applied: true };
    }
    const amount = Math.round(subtotal * (tax.vatPercent / 100));
    return { amount, label: tax.vatLabel, applied: true };
  }

  async calculateTotals(_clientId: string, request: TotalsRequest): Promise<TotalsResult> {
    const total = Math.max(0, request.subtotal + request.shippingFee + request.tax - request.discount);
    return { total };
  }

  async createOrder(clientId: string, request: CreateOrderRequest): Promise<OrderDetails> {
    const client = getClient(clientId);

    // Re-validate stock one last time at the point of order creation so a
    // stale cart can never produce an order for something no longer available.
    const catalog = getDemoProductsForClient(clientId);
    for (const item of request.items) {
      const current = catalog.find((p) => p.id === item.product.id);
      if (!current || !current.inStock || current.stockCount < item.quantity) {
        throw new CommerceError(
          'OUT_OF_STOCK',
          `"${item.product.title.en}" is no longer available in the requested quantity.`
        );
      }
    }

    const orderId = `${client.orderNumberPrefix}-${Date.now().toString(36).toUpperCase()}`;
    const estimatedDelivery = client.shipping.etaConfirmed
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      : '';

    const order: OrderDetails = {
      orderId,
      date: new Date().toISOString(),
      items: request.items,
      subtotal: request.subtotal,
      shippingFee: request.shippingFee,
      tax: request.tax,
      discount: request.discount,
      total: request.total,
      currency: request.currency as OrderDetails['currency'],
      shippingAddress: request.shippingAddress,
      deliveryMethod: request.deliveryMethod,
      paymentMethod: request.paymentMethod,
      status: 'confirmed',
      estimatedDelivery,
    };

    const orders = readOrders(clientId);
    orders[orderId] = order;
    writeOrders(clientId, orders);

    return order;
  }

  async getOrder(clientId: string, orderId: string): Promise<OrderDetails | undefined> {
    const orders = readOrders(clientId);
    return orders[orderId];
  }
}

export const mockCommerceProvider = new MockCommerceProvider();
