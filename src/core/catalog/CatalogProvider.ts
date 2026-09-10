import { Category, Brand, CatalogQuery, CatalogQueryResult } from '../../types/store';

/**
 * CatalogProvider is the single source of truth for catalog discovery:
 * categories, brands, products, facets, and filtering.
 *
 * Implementations:
 * - MockCatalogProvider: Demo data (used during development)
 * - WooCommerceCatalogProvider: Live WooCommerce via Store API + REST
 */
export interface CatalogProvider {
  /**
   * Get all categories for this store, optionally filtered by parent.
   */
  getCategories(clientId: string, parentId?: string, signal?: AbortSignal): Promise<Category[]>;

  /**
   * Get a single category by slug.
   */
  getCategoryBySlug(clientId: string, slug: string, signal?: AbortSignal): Promise<Category | undefined>;

  /**
   * Get all brands (or filtered by product availability).
   */
  getBrands(clientId: string, signal?: AbortSignal): Promise<Brand[]>;

  /**
   * Get a single brand by slug.
   */
  getBrandBySlug(clientId: string, slug: string, signal?: AbortSignal): Promise<Brand | undefined>;

  /**
   * Query the catalog with filters, search, sorting, and pagination.
   * Returns products + available facets + pagination info.
   */
  queryCatalog(clientId: string, query: CatalogQuery, signal?: AbortSignal): Promise<CatalogQueryResult>;

  /**
   * Get products in a specific category (including subcategories).
   */
  getProductsByCategory(clientId: string, categorySlug: string, page?: number, perPage?: number, signal?: AbortSignal): Promise<CatalogQueryResult>;

  /**
   * Get products by brand.
   */
  getProductsByBrand(clientId: string, brandSlug: string, page?: number, perPage?: number, signal?: AbortSignal): Promise<CatalogQueryResult>;

  /**
   * Search products by query.
   */
  searchProducts(clientId: string, query: string, page?: number, perPage?: number, signal?: AbortSignal): Promise<CatalogQueryResult>;
}
