import type { Brand, CatalogQuery, CatalogQueryResult, Category, Product, StoreId } from '../../types/store';
import type { CatalogProvider } from './CatalogProvider';

interface Term {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
  parent?: number;
  image?: { src: string } | null;
}
interface StoreProduct {
  id: number;
  name: string;
  description: string;
  prices: {
    price: string;
    regular_price: string;
    currency_minor_unit: number;
    currency_code: string;
  };
  on_sale: boolean;
  is_in_stock: boolean;
  low_stock_remaining: number | null;
  average_rating: string;
  review_count: number;
  images: { src: string }[];
  categories: Term[];
  brands?: Term[];
  attributes?: { name: string; terms: { name: string }[] }[];
}
interface Page<T> {
  items: T[];
  total: number;
  totalPages: number;
}

const localized = (text: string) => ({ en: text, ar: text });
const plainText = (html = '') => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

/**
 * CLAUDE HANDOFF: browser catalog requests MUST use the public Store API.
 * Do not restore wc/v3, consumer secrets, or a mock fallback on live failures.
 * Store API returns an array, pagination in headers, and prices in minor units.
 */
export class WooCommerceCatalogProvider implements CatalogProvider {
  private readonly api: string;
  constructor(wordpressUrl: string, private readonly currencyCode?: string, private readonly minorUnit = 2) {
    const url = new URL(wordpressUrl);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('Invalid public WordPress URL');
    }
    this.api = url.href.replace(/\/$/, '') + '/wp-json/wc/store/v1';
  }

  private async page<T>(path: string, params: URLSearchParams, signal?: AbortSignal): Promise<Page<T>> {
    const response = await fetch(this.api + '/' + path + '?' + params, {
      credentials: 'omit',
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000),
      headers: { Accept: 'application/json' },
    });
    const body: unknown = await response.json();
    if (!response.ok) {
      const message = body && typeof body === 'object' && 'message' in body ? String(body.message) : 'HTTP ' + response.status;
      throw new Error(message);
    }
    if (!Array.isArray(body)) throw new Error('Invalid Store API collection response');
    const totalHeader = response.headers.get('X-WP-Total');
    const pagesHeader = response.headers.get('X-WP-TotalPages');
    // Missing CORS-exposed totals must not silently truncate the catalog to one page.
    if (totalHeader === null || pagesHeader === null) {
      throw new Error('Missing pagination headers: expose X-WP-Total and X-WP-TotalPages in the bridge');
    }
    const total = Number(totalHeader);
    const totalPages = Number(pagesHeader);
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(totalPages) || totalPages < 0) {
      throw new Error('Invalid Store API pagination headers');
    }
    return { items: body as T[], total, totalPages };
  }

  private async terms(path: string, signal?: AbortSignal): Promise<Term[]> {
    const result: Term[] = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const data = await this.page<Term>(path, new URLSearchParams({
        per_page: '100', page: String(page), orderby: 'slug', order: 'asc',
      }), signal);
      if (page < data.totalPages && data.items.length === 0) throw new Error('Incomplete taxonomy response');
      pages = data.totalPages;
      result.push(...data.items);
    }
    return result;
  }

  async getCategories(_clientId: string, parentId?: string, signal?: AbortSignal): Promise<Category[]> {
    const terms = await this.terms('products/categories', signal);
    return terms.filter(t => parentId === undefined || String(t.parent || 0) === parentId).map(t => ({
      id: String(t.id), slug: t.slug, name: localized(t.name),
      description: t.description ? localized(plainText(t.description)) : undefined,
      image: t.image?.src, parentId: t.parent ? String(t.parent) : undefined, count: t.count,
    }));
  }

  async getCategoryBySlug(clientId: string, slug: string, signal?: AbortSignal) {
    return (await this.getCategories(clientId, undefined, signal)).find(t => t.slug === slug);
  }

  async getBrands(_clientId: string, signal?: AbortSignal): Promise<Brand[]> {
    // Native product_brand taxonomy; never reinterpret pa_brand as the same taxonomy.
    return (await this.terms('products/brands', signal)).map(t => ({
      id: String(t.id), slug: t.slug, name: t.name, count: t.count, logo: t.image?.src,
      description: t.description ? localized(plainText(t.description)) : undefined,
    }));
  }

  async getBrandBySlug(clientId: string, slug: string, signal?: AbortSignal) {
    return (await this.getBrands(clientId, signal)).find(t => t.slug === slug);
  }

  async queryCatalog(clientId: string, query: CatalogQuery, signal?: AbortSignal): Promise<CatalogQueryResult> {
    const page = Math.max(1, Math.trunc(query.page || 1));
    // WooCommerce rejects per_page=1000 with HTTP 400; maximum is 100.
    const perPage = Math.min(100, Math.max(1, Math.trunc(query.perPage || 12)));
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage), orderby: 'id', order: 'asc', catalog_visibility: 'catalog' });
    if (query.searchQuery) {
      params.set('search', query.searchQuery);
      params.set('catalog_visibility', 'search');
    }
    if (query.categorySlug) params.set('category', query.categorySlug);
    if (query.brandSlugs?.length) params.set('brand', query.brandSlugs.join(','));
    if (query.inStockOnly) params.set('stock_status[0]', 'instock');
    const sorts = {
      featured: ['menu_order', 'asc'], 'price-asc': ['price', 'asc'],
      'price-desc': ['price', 'desc'], rating: ['rating', 'desc'], newest: ['date', 'desc'],
    };
    if (query.sortBy) {
      const [orderby, order] = sorts[query.sortBy];
      params.set('orderby', orderby);
      params.set('order', order);
    }
    for (const [key, value] of [['min_price', query.minPrice], ['max_price', query.maxPrice]] as const) {
      if (value !== undefined) params.set(key, String(Math.round(value * 10 ** this.minorUnit)));
    }
    Object.entries(query.facets || {}).filter(([, values]) => values.length).forEach(([taxonomy, values], i) => {
      params.set('attributes[' + i + '][attribute]', taxonomy);
      params.set('attributes[' + i + '][slug]', values.join(','));
      params.set('attributes[' + i + '][operator]', 'in');
    });
    if (query.facets) params.set('attribute_relation', 'and');
    const result = await this.page<StoreProduct>('products', params, signal);
    return {
      products: result.items.map(p => this.product(p, clientId)),
      // No fabricated counts from the loaded page. Collection-data integration is separate.
      facets: [],
      pagination: { page, perPage, total: result.total, totalPages: result.totalPages },
    };
  }

  private product(p: StoreProduct, clientId: string): Product {
    const prices = p.prices;
    if (!prices || !Number.isInteger(prices.currency_minor_unit) || prices.currency_minor_unit < 0 ||
      !/^\d+$/.test(prices.price) || !/^\d+$/.test(prices.regular_price)) {
      throw new Error('Invalid Store API product prices');
    }
    if (this.currencyCode && prices.currency_code !== this.currencyCode) {
      throw new Error('WooCommerce currency does not match the client configuration');
    }
    const divisor = 10 ** prices.currency_minor_unit;
    const price = Number(prices.price) / divisor;
    const regular = Number(prices.regular_price) / divisor;
    const attributes = (p.attributes || []).map(a => ({
      label: localized(a.name), value: localized(a.terms.map(t => t.name).join(', ')),
    }));
    return {
      id: String(p.id), storeId: clientId as StoreId, title: localized(p.name),
      brand: p.brands?.[0]?.name || '', category: p.categories[0]?.slug || '',
      price, originalPrice: p.on_sale && regular > price ? regular : undefined,
      rating: Number(p.average_rating || 0), reviewCount: p.review_count || 0,
      images: p.images.map(i => i.src), description: localized(plainText(p.description)),
      shortSpecs: attributes.slice(0, 3).map(a => a.value), inStock: p.is_in_stock,
      // Null means WooCommerce did not disclose an exact quantity, NOT zero stock.
      stockCount: p.low_stock_remaining ?? 0,
      stockQuantityKnown: p.low_stock_remaining !== null && p.low_stock_remaining !== undefined,
      specs: attributes.length ? [{ group: localized('Specifications'), items: attributes }] : [],
      reviews: [], warranty: localized(''), isDemo: false,
    };
  }

  getProductsByCategory(clientId: string, categorySlug: string, page = 1, perPage = 12, signal?: AbortSignal) {
    return this.queryCatalog(clientId, { categorySlug, page, perPage }, signal);
  }
  getProductsByBrand(clientId: string, brandSlug: string, page = 1, perPage = 12, signal?: AbortSignal) {
    return this.queryCatalog(clientId, { brandSlugs: [brandSlug], page, perPage }, signal);
  }
  searchProducts(clientId: string, searchQuery: string, page = 1, perPage = 12, signal?: AbortSignal) {
    return this.queryCatalog(clientId, { searchQuery, page, perPage }, signal);
  }
}

export async function createCatalogProvider(wordpressUrl?: string) {
  if (wordpressUrl !== undefined) return new WooCommerceCatalogProvider(wordpressUrl);
  const { MockCatalogProvider } = await import('./MockCatalogProvider');
  return new MockCatalogProvider();
}
