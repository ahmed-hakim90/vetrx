import { afterEach, describe, expect, it, vi } from 'vitest';
import { WooCommerceCatalogProvider, createCatalogProvider } from './WooCommerceCatalogProvider';
import { loadLiveCatalog, resolveCatalogUrl } from './loadLiveCatalog';
import { activeClient } from '../../config/active-client';

const item = (id = 1) => ({
  id, name: 'Camera', description: '<p>Camera description</p>',
  prices: { price: '125050', regular_price: '150000', currency_minor_unit: 2, currency_code: 'EGP' },
  on_sale: true, is_in_stock: true, low_stock_remaining: null,
  average_rating: '4.5', review_count: 3, images: [{ src: 'https://example.com/camera.jpg' }],
  categories: [{ id: 10, slug: 'cameras', name: 'Cameras' }],
  brands: [{ id: 11, slug: 'canon', name: 'Canon' }], attributes: [],
});
const response = (data: unknown[], total = data.length, pages = 1) => new Response(JSON.stringify(data), {
  headers: { 'X-WP-Total': String(total), 'X-WP-TotalPages': String(pages) },
});
afterEach(() => vi.unstubAllGlobals());

describe('public WooCommerce catalog', () => {
  it('uses Store API, caps page size, reads headers and preserves price decimals', async () => {
    const fetcher = vi.fn().mockResolvedValue(response([item()], 1413, 15));
    vi.stubGlobal('fetch', fetcher);
    const result = await new WooCommerceCatalogProvider('https://example.com/', 'EGP').queryCatalog('shams', { perPage: 1000, page: 2 });
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toContain('/wc/store/v1/products?');
    expect(new URL(url).searchParams.get('per_page')).toBe('100');
    expect(new URL(url).searchParams.get('page')).toBe('2');
    expect(options.credentials).toBe('omit');
    expect(options.headers).not.toHaveProperty('Authorization');
    expect(result.pagination).toEqual({ page: 2, perPage: 100, total: 1413, totalPages: 15 });
    expect(result.products[0]).toMatchObject({ price: 1250.5, originalPrice: 1500, brand: 'Canon', inStock: true, stockQuantityKnown: false, isDemo: false });
  });

  it('sends price, brand, category and attribute filters to the server', async () => {
    const fetcher = vi.fn().mockResolvedValue(response([]));
    vi.stubGlobal('fetch', fetcher);
    await new WooCommerceCatalogProvider('https://example.com').queryCatalog('shams', {
      minPrice: 12.5, maxPrice: 20, brandSlugs: ['canon'], categorySlug: 'cameras',
      inStockOnly: true, facets: { pa_color: ['black'] }, sortBy: 'price-desc',
    });
    const params = new URL(fetcher.mock.calls[0][0]).searchParams;
    expect(params.get('min_price')).toBe('1250');
    expect(params.get('max_price')).toBe('2000');
    expect(params.get('brand')).toBe('canon');
    expect(params.get('category')).toBe('cameras');
    expect(params.get('stock_status[0]')).toBe('instock');
    expect(params.get('attributes[0][attribute]')).toBe('pa_color');
    expect(params.get('attributes[0][slug]')).toBe('black');
    expect(params.get('orderby')).toBe('price');
  });

  it('fails visibly for API errors and missing CORS totals', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Unavailable' }), { status: 503 })));
    const provider = new WooCommerceCatalogProvider('https://example.com');
    await expect(provider.queryCatalog('shams', {})).rejects.toThrow('Unavailable');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]')));
    await expect(provider.queryCatalog('shams', {})).rejects.toThrow('Missing pagination headers');
    await expect(createCatalogProvider('')).rejects.toThrow();
  });

  it('rejects mismatched currency rather than relabelling the amount', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([item()])));
    await expect(new WooCommerceCatalogProvider('https://example.com', 'USD').queryCatalog('voltix', {})).rejects.toThrow('currency');
  });

  it('loads all category pages and uses native brands', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response([{ id: 1, name: 'Parent', slug: 'parent', parent: 0, count: 2 }], 2, 2))
      .mockResolvedValueOnce(response([{ id: 2, name: 'Child', slug: 'child', parent: 1, count: 1 }], 2, 2))
      .mockResolvedValueOnce(response([{ id: 3, name: 'Canon', slug: 'canon', count: 1 }]));
    vi.stubGlobal('fetch', fetcher);
    const provider = new WooCommerceCatalogProvider('https://example.com');
    expect(await provider.getCategories('shams')).toEqual(expect.arrayContaining([expect.objectContaining({ parentId: '1' })]));
    expect(await provider.getBrands('shams')).toHaveLength(1);
    expect(fetcher.mock.calls[2][0]).toContain('/products/brands?');
  });

  it('loads the last product page using totals, not a guessed 1000-item boundary', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response([item(1)], 2, 2))
      .mockResolvedValueOnce(response([item(2)], 2, 2)).mockResolvedValueOnce(response([]));
    vi.stubGlobal('fetch', fetcher);
    const result = await loadLiveCatalog(new WooCommerceCatalogProvider('https://example.com'), 'shams', new AbortController().signal);
    expect(result.products.map(p => p.id)).toEqual(['1', '2']);
    expect(fetcher.mock.calls[1][0]).toContain('page=2');
  });

  it('rejects duplicate/incomplete pages instead of exposing a partial catalog', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => response([item(1)], 2, 2)));
    await expect(loadLiveCatalog(new WooCommerceCatalogProvider('https://example.com'), 'shams', new AbortController().signal)).rejects.toThrow('Incomplete');
  });

  it('has no localhost or credentials fallback for missing configuration', () => {
    const client = { ...activeClient, commerce: { provider: 'woocommerce' as const, envVarNames: { baseUrl: 'VITE_WORDPRESS_URL' } } };
    expect(() => resolveCatalogUrl(client, {})).toThrow('Missing');
    expect(resolveCatalogUrl(client, { VITE_WORDPRESS_URL: 'https://example.com' })).toBe('https://example.com');
  });
});
