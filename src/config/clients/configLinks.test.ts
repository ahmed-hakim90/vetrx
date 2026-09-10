import { describe, it, expect } from 'vitest';
import { clientRegistry } from './registry';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { SHAMS_PRODUCTS } from '../../data/demo/shams/products';
import { SHAMS_CATEGORIES } from '../../data/demo/shams/categories';
import { Category, Product } from '../../types/store';

// Config values that reference catalog ids are a classic source of drift: a
// product gets renamed or removed and a hero CTA silently starts landing on
// "Product Not Found". These assert every such link still resolves.
function catalogFor(clientId: string): { products: Product[]; categories: Category[] } {
  if (clientId === 'shams') return { products: SHAMS_PRODUCTS, categories: SHAMS_CATEGORIES };
  return { products: PRODUCTS.filter((p) => p.storeId === clientId), categories: CATEGORIES };
}

describe.each(Object.keys(clientRegistry))('%s config ↔ catalog links', (clientId) => {
  const client = clientRegistry[clientId];
  const { products, categories } = catalogFor(clientId);

  it('hero secondary CTA points at a product or category this client actually has', () => {
    const productSlug = client.home.heroSecondaryCtaProductSlug;
    const categorySlug = client.home.heroSecondaryCtaCategorySlug;

    // The schema guarantees exactly one of the two is set.
    expect([productSlug, categorySlug].filter(Boolean)).toHaveLength(1);

    if (productSlug) {
      expect(products.some((p) => p.id === productSlug), `${clientId}: unknown product "${productSlug}"`).toBe(true);
    } else {
      expect(
        categories.some((c) => c.id === categorySlug),
        `${clientId}: unknown category "${categorySlug}"`
      ).toBe(true);
      expect(
        products.some((p) => p.category === categorySlug),
        `${clientId}: category "${categorySlug}" is empty`
      ).toBe(true);
    }
  });

  it('hero primary CTA points at "all" or a real category', () => {
    const slug = client.home.heroPrimaryCtaCategorySlug;
    if (slug === 'all') return;
    expect(categories.some((c) => c.id === slug), `${clientId}: unknown category "${slug}"`).toBe(true);
  });

  it('every navigation category exists in this client’s catalog', () => {
    for (const navCat of client.navigationCategories) {
      expect(categories.some((c) => c.id === navCat.id), `${clientId}: unknown category "${navCat.id}"`).toBe(true);
    }
  });

  it('every navigation category actually has products', () => {
    for (const navCat of client.navigationCategories) {
      expect(
        products.some((p) => p.category === navCat.id),
        `${clientId}: category "${navCat.id}" is empty`
      ).toBe(true);
    }
  });

  it('bento banners link to a real category', () => {
    for (const banner of client.home.bentoBanners) {
      const slug = banner.categorySlug;
      if (slug === 'all') continue;
      expect(categories.some((c) => c.id === slug), `${clientId}: unknown category "${slug}"`).toBe(true);
    }
  });

  it('defaultCurrency is one of this client’s own currencies', () => {
    expect(client.currencies.some((c) => c.code === client.defaultCurrency)).toBe(true);
  });

  it('defaultLocale is one of its supported locales', () => {
    expect(client.supportedLocales).toContain(client.defaultLocale);
  });

  it('has at least one enabled payment method', () => {
    expect(client.paymentMethods.some((m) => m.enabled)).toBe(true);
  });

  it('gives every provider-branded payment method a display label', () => {
    for (const method of client.paymentMethods.filter((m) => m.enabled)) {
      if (method.id === 'tabby' || method.id === 'tamara') {
        expect(method.label, `${clientId}: ${method.id} needs a label in the client config`).toBeTruthy();
      }
    }
  });
});
