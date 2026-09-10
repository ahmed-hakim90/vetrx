import { describe, it, expect } from 'vitest';
import { PRODUCTS } from './mockData';
import { SHAMS_PRODUCTS } from './demo/shams/products';
import { SHAMS_CATEGORIES } from './demo/shams/categories';
import { clientRegistry } from '../config/clients/registry';

// These assert invariants of the demo *datasets* themselves rather than of
// `getDemoProductsForClient`, which is deliberately bound at build time to a
// single client's catalog (see vite-plugins/activeClientConfig.ts) and so
// can't be exercised for all four clients inside one process.
describe('demo catalog / client isolation', () => {
  const gulfClientIds = Object.keys(clientRegistry).filter((id) => id !== 'shams');

  it('gives every Gulf example client at least one product of its own', () => {
    for (const clientId of gulfClientIds) {
      expect(PRODUCTS.filter((p) => p.storeId === clientId).length).toBeGreaterThan(0);
    }
  });

  it('never puts shams products in the shared Gulf-clients catalog', () => {
    expect(PRODUCTS.some((p) => p.storeId === 'shams')).toBe(false);
  });

  it("tags every product in Shams's own dataset as belonging to shams", () => {
    expect(SHAMS_PRODUCTS.length).toBeGreaterThanOrEqual(12);
    expect(SHAMS_PRODUCTS.every((p) => p.storeId === 'shams')).toBe(true);
  });

  it('shares no product ids between the Shams dataset and the shared catalog', () => {
    const sharedIds = new Set(PRODUCTS.map((p) => p.id));
    expect(SHAMS_PRODUCTS.some((p) => sharedIds.has(p.id))).toBe(false);
  });

  it('gives shams products no invented reviews or ratings, and marks them as demo data', () => {
    for (const product of SHAMS_PRODUCTS) {
      expect(product.reviews).toEqual([]);
      expect(product.reviewCount).toBe(0);
      expect(product.rating).toBe(0);
      expect(product.isDemo).toBe(true);
    }
  });

  it('covers the demo states the Shams catalog is meant to exercise', () => {
    expect(SHAMS_PRODUCTS.some((p) => !p.inStock)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => p.inStock && p.stockCount > 0 && p.stockCount <= 5)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => p.originalPrice && p.originalPrice > p.price)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => !p.originalPrice)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => p.variants?.colors && p.variants.colors.length > 1)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => p.variants?.storage && p.variants.storage.length > 1)).toBe(true);
    expect(SHAMS_PRODUCTS.some((p) => p.images.length > 1)).toBe(true);
  });

  it('only uses categories that exist in the Shams category list', () => {
    const categoryIds = new Set(SHAMS_CATEGORIES.map((c) => c.id));
    for (const product of SHAMS_PRODUCTS) {
      expect(categoryIds.has(product.category)).toBe(true);
    }
  });
});
