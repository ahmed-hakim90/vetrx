import { Category, Brand, CatalogQuery, CatalogQueryResult, Product } from '../../types/store';
import { CatalogProvider } from './CatalogProvider';
import { StoreApiClient } from '../../../wordpress/integration/store-api-client.mjs';

/**
 * WooCommerce Live implementation via Store API.
 *
 * Contract expectations:
 * - Categories are returned as WooCommerce product_cat taxonomy terms
 * - Brands can be a custom taxonomy (pa_brand) or attribute
 * - Products endpoint supports: search, categories, attributes, sort, pagination
 * - Facets are derived from product attributes (pa_*)
 *
 * Adapter responsibilities:
 * - Map WooCommerce taxonomy structure to Category interface
 * - Handle currency and minor units
 * - Cache category hierarchies (optional)
 * - Validate Store API availability before queries
 */
export class WooCommerceCatalogProvider implements CatalogProvider {
  constructor(private storeApiClient: StoreApiClient) {}

  async getCategories(_clientId: string, _parentId?: string, _signal?: AbortSignal): Promise<Category[]> {
    try {
      // WooCommerce Store API doesn't provide categories directly;
      // use REST API for hierarchical category data.
      // This requires /wp-json/wc/v3/products/categories endpoint (may need admin scope).
      // For now, return empty array and note this is a gap.
      console.warn('getCategories: WooCommerce Store API does not expose category hierarchy. Use /wp-json/wc/v3/products/categories with REST authentication.');
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryBySlug(_clientId: string, slug: string, signal?: AbortSignal): Promise<Category | undefined> {
    try {
      const categories = await this.getCategories(clientId, undefined, signal);
      return categories.find(c => c.slug === slug);
    } catch {
      return undefined;
    }
  }

  async getBrands(_clientId: string, _signal?: AbortSignal): Promise<Brand[]> {
    try {
      // Brands in WooCommerce: custom attribute 'pa_brand' (or similar).
      // Store API exposes product attributes; fetch one product to inspect available attributes.
      // This is a limitation: facet endpoints require custom implementation.
      console.warn('getBrands: WooCommerce Store API does not expose available attribute values. Use /wp-json/wc/v3/products/attributes or custom endpoint.');
      return [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  async getBrandBySlug(clientId: string, slug: string, signal?: AbortSignal): Promise<Brand | undefined> {
    try {
      const brands = await this.getBrands(clientId, signal);
      return brands.find(b => b.slug === slug);
    } catch {
      return undefined;
    }
  }

  async queryCatalog(clientId: string, query: CatalogQuery, signal?: AbortSignal): Promise<CatalogQueryResult> {
    try {
      const searchParams = new URLSearchParams();

      // Pagination
      searchParams.set('page', String(query.page || 1));
      searchParams.set('per_page', String(query.perPage || 12));

      // Search
      if (query.searchQuery) {
        searchParams.set('search', query.searchQuery);
      }

      // Sort
      if (query.sortBy) {
        const orderMap: Record<string, string> = {
          'price-asc': 'price',
          'price-desc': 'price',
          'rating': 'rating',
          'newest': 'date',
          'featured': 'popularity',
        };
        const order = query.sortBy.includes('desc') ? 'desc' : 'asc';
        if (orderMap[query.sortBy]) {
          searchParams.set('orderby', orderMap[query.sortBy]);
          searchParams.set('order', order);
        }
      }

      // Note: filtering by category and attributes requires custom REST endpoints
      // Store API does not support category or attribute filtering directly.
      // This is documented in Commerce Bridge as a gap.
      if (query.categorySlug) {
        console.warn(`queryCatalog: Category filtering (${query.categorySlug}) requires custom /wp-json endpoint.`);
      }
      if (query.brandSlugs?.length) {
        console.warn(`queryCatalog: Brand filtering requires custom /wp-json endpoint.`);
      }

      // Attempt Store API query (will only work for search/sort/pagination)
      const result = await this.storeApiClient.request(`products?${searchParams}`);

      // Map WooCommerce response to CatalogQueryResult
      return {
        products: this.mapWooCommerceProducts(result.products || []),
        facets: [], // Would require custom endpoint or attribute inspection
        pagination: {
          page: query.page || 1,
          perPage: query.perPage || 12,
          total: result.total || 0,
          totalPages: result.pages || 0,
        },
      };
    } catch (error) {
      console.error('Error querying catalog:', error);
      throw error;
    }
  }

  async getProductsByCategory(clientId: string, categorySlug: string, page = 1, perPage = 12, signal?: AbortSignal): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { categorySlug, page, perPage }, signal);
  }

  async getProductsByBrand(clientId: string, brandSlug: string, page = 1, perPage = 12, signal?: AbortSignal): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { brandSlugs: [brandSlug], page, perPage }, signal);
  }

  async searchProducts(clientId: string, query: string, page = 1, perPage = 12, signal?: AbortSignal): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { searchQuery: query, page, perPage }, signal);
  }

  private mapWooCommerceProducts(wooProducts: Record<string, unknown>[]): Product[] {
    // Map WooCommerce product format to our Product type
    // This is a placeholder; actual mapping depends on WooCommerce response structure
    return wooProducts.map((p) => ({
      id: String(p.id),
      storeId: 'shams' as const, // Would come from clientId parameter
      title: { en: String(p.name || ''), ar: String(p.name || '') }, // WC response doesn't have Arabic; would need extra field
      brand: String((p.attributes as Array<{name: string; options: string[]}>)?.find((a) => a.name === 'Brand')?.options?.[0] || 'Unknown'),
      category: String((p.categories as Array<{slug: string}>)?.[0]?.slug || 'uncategorized'),
      price: parseInt(String(p.price || 0)),
      originalPrice: p.regular_price ? parseInt(String(p.regular_price)) : undefined,
      rating: parseFloat(String(p.average_rating || 0)),
      reviewCount: parseInt(String(p.review_count || 0)),
      images: ((p.images as Array<{src: string}>) || []).map((img) => String(img.src)),
      description: { en: String(p.description || ''), ar: '' },
      shortSpecs: [],
      inStock: p.stock_status === 'instock',
      stockCount: parseInt(String(p.stock_quantity || 0)),
      specs: [],
      reviews: [],
      warranty: { en: '', ar: '' },
    }));
  }
}

// Factory function to create provider based on config
export async function createCatalogProvider(storeApiUrl?: string) {
  if (storeApiUrl) {
    const client = new StoreApiClient(storeApiUrl);
    return new WooCommerceCatalogProvider(client);
  }
  // Return mock if no store API configured
  const { MockCatalogProvider } = await import('./MockCatalogProvider');
  return new MockCatalogProvider();
}
