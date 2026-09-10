import { describe, it, expect, beforeEach } from 'vitest';
import { MockCommerceProvider } from './MockCommerceProvider';
import { CommerceError } from './types';
import { SHAMS_PRODUCTS } from '../../data/demo/shams/products';
import { CartItem } from '../../types/store';

// The provider resolves the active client through active-client.ts, which is
// bound to VITE_STORE_ID at module-evaluation time — vitest.config.ts sets it
// to 'shams' for the whole test run.

const provider = new MockCommerceProvider();
const CLIENT = 'shams';

function cartItemFor(productId: string, overrides: Partial<CartItem> = {}): CartItem {
  const product = SHAMS_PRODUCTS.find((p) => p.id === productId)!;
  return {
    id: `${product.id}_default_default`,
    product,
    quantity: 1,
    unitPrice: product.price,
    totalPrice: product.price,
    ...overrides,
  };
}

describe('MockCommerceProvider — catalog', () => {
  it('returns only this client’s own products', async () => {
    const products = await provider.getProducts(CLIENT);
    expect(products.length).toBeGreaterThanOrEqual(12);
    expect(products.every((p) => p.storeId === CLIENT)).toBe(true);
  });

  it('returns undefined for an unknown product slug instead of a fallback product', async () => {
    expect(await provider.getProductBySlug(CLIENT, 'no-such-product')).toBeUndefined();
  });

  it('finds products by title or brand, and nothing for a no-results query', async () => {
    expect((await provider.searchProducts(CLIENT, 'JBL')).length).toBeGreaterThan(0);
    expect(await provider.searchProducts(CLIENT, 'zzzzzzz-no-such-thing')).toEqual([]);
  });

  it('rejects a clientId that is not this deployment’s client', async () => {
    await expect(provider.applyCoupon('some-other-client', 'X', 100)).rejects.toBeInstanceOf(CommerceError);
  });
});

describe('MockCommerceProvider — cart validation (never trusts stored prices)', () => {
  it('corrects a cart line whose stored unit price is stale', async () => {
    const stale = cartItemFor('prod-shams-jbl-tune-510bt', { unitPrice: 1, totalPrice: 1 });
    const result = await provider.validateCart(CLIENT, [stale]);

    expect(result.valid).toBe(false);
    expect(result.issues[0].reason).toBe('price_changed');
    expect(result.items[0].unitPrice).toBe(1299);
    expect(result.items[0].totalPrice).toBe(1299);
  });

  it('drops an out-of-stock line and reports why', async () => {
    const outOfStock = SHAMS_PRODUCTS.find((p) => !p.inStock)!;
    const result = await provider.validateCart(CLIENT, [cartItemFor(outOfStock.id)]);

    expect(result.items).toEqual([]);
    expect(result.issues[0].reason).toBe('out_of_stock');
    expect(result.issues[0].message.ar).toBeTruthy();
  });

  it('caps a quantity that exceeds current stock', async () => {
    const lowStock = SHAMS_PRODUCTS.find((p) => p.inStock && p.stockCount <= 5)!;
    const result = await provider.validateCart(CLIENT, [
      cartItemFor(lowStock.id, { quantity: 99, totalPrice: lowStock.price * 99 }),
    ]);

    expect(result.items[0].quantity).toBe(lowStock.stockCount);
  });

  it('reports a product that no longer exists as removed', async () => {
    const ghost = cartItemFor('prod-shams-jbl-tune-510bt');
    ghost.product = { ...ghost.product, id: 'deleted-product' };
    const result = await provider.validateCart(CLIENT, [ghost]);

    expect(result.items).toEqual([]);
    expect(result.issues[0].reason).toBe('removed');
  });
});

describe('MockCommerceProvider — Egypt shipping, tax and totals', () => {
  it('quotes no fee and no ETA until a governorate is chosen', async () => {
    const result = await provider.calculateShipping(CLIENT, { method: 'standard', subtotal: 500 });
    expect(result.fee).toBe(0);
    expect(result.etaMessage).toBeNull();
  });

  it('charges the configured standard fee below the free-shipping threshold', async () => {
    const result = await provider.calculateShipping(CLIENT, {
      governorateId: 'giza',
      method: 'standard',
      subtotal: 1299,
    });
    expect(result.fee).toBe(60);
  });

  it('waives the fee at or above the free-shipping threshold', async () => {
    const result = await provider.calculateShipping(CLIENT, {
      governorateId: 'cairo',
      method: 'standard',
      subtotal: 2499,
    });
    expect(result.fee).toBe(0);
  });

  it('never promises a delivery window while the client has no confirmed ETA', async () => {
    const result = await provider.calculateShipping(CLIENT, {
      governorateId: 'cairo',
      method: 'standard',
      subtotal: 100,
    });
    expect(result.etaMessage).toBeNull();
  });

  it('refuses express delivery while the feature flag is off', async () => {
    await expect(
      provider.calculateShipping(CLIENT, { governorateId: 'cairo', method: 'express', subtotal: 100 })
    ).rejects.toBeInstanceOf(CommerceError);
  });

  it('applies the configured Egyptian VAT rate', async () => {
    const result = await provider.calculateTaxes(CLIENT, 1000);
    expect(result.amount).toBe(140);
    expect(result.label.en).toContain('14%');
  });

  it('sums totals as subtotal + shipping + tax - discount', async () => {
    const { total } = await provider.calculateTotals(CLIENT, {
      subtotal: 1299,
      shippingFee: 60,
      tax: 182,
      discount: 0,
    });
    expect(total).toBe(1541);
  });

  it('never returns a negative total', async () => {
    const { total } = await provider.calculateTotals(CLIENT, {
      subtotal: 100,
      shippingFee: 0,
      tax: 0,
      discount: 500,
    });
    expect(total).toBe(0);
  });

  it('rejects coupons for a client with coupons disabled', async () => {
    const result = await provider.applyCoupon(CLIENT, 'ANY-CODE', 1000);
    expect(result.success).toBe(false);
  });
});

describe('MockCommerceProvider — order creation', () => {
  const address = {
    fullName: 'Ahmed Mostafa',
    phone: '01012345678',
    country: 'Egypt',
    city: 'Cairo',
    addressLine: 'Makram Ebeid Street, Bldg 12',
    governorateId: 'cairo',
  };

  function orderRequest(items: CartItem[]) {
    return {
      items,
      subtotal: 1299,
      shippingFee: 60,
      tax: 182,
      discount: 0,
      total: 1541,
      currency: 'EGP',
      shippingAddress: address,
      deliveryMethod: 'standard' as const,
      paymentMethod: 'cod' as const,
    };
  }

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('creates an order with a provider-generated id using the client’s prefix', async () => {
    const order = await provider.createOrder(CLIENT, orderRequest([cartItemFor('prod-shams-jbl-tune-510bt')]));

    expect(order.orderId.startsWith('SHM-')).toBe(true);
    expect(order.total).toBe(1541);
    expect(order.status).toBe('confirmed');
    expect(order.shippingAddress.governorateId).toBe('cairo');
  });

  it('can read the order back by id, and returns undefined for an unknown id', async () => {
    const order = await provider.createOrder(CLIENT, orderRequest([cartItemFor('prod-shams-jbl-tune-510bt')]));

    expect((await provider.getOrder(CLIENT, order.orderId))?.orderId).toBe(order.orderId);
    expect(await provider.getOrder(CLIENT, 'SHM-NOPE')).toBeUndefined();
  });

  it('refuses to create an order for an out-of-stock item', async () => {
    const outOfStock = SHAMS_PRODUCTS.find((p) => !p.inStock)!;
    await expect(provider.createOrder(CLIENT, orderRequest([cartItemFor(outOfStock.id)]))).rejects.toBeInstanceOf(
      CommerceError
    );
  });

  it('refuses to create an order for more units than are in stock', async () => {
    const lowStock = SHAMS_PRODUCTS.find((p) => p.inStock && p.stockCount <= 5)!;
    await expect(
      provider.createOrder(CLIENT, orderRequest([cartItemFor(lowStock.id, { quantity: 99 })]))
    ).rejects.toBeInstanceOf(CommerceError);
  });

  it('leaves estimatedDelivery empty while the client has no confirmed courier ETA', async () => {
    const order = await provider.createOrder(CLIENT, orderRequest([cartItemFor('prod-shams-jbl-tune-510bt')]));
    expect(order.estimatedDelivery).toBe('');
  });
});
