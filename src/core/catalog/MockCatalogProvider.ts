import { Category, Brand, CatalogQuery, CatalogQueryResult, Product } from '../../types/store';
import { CatalogProvider } from './CatalogProvider';
import { getDemoProductsForClient, getDemoCategoriesForClient } from '../commerce/demoCatalog';

/**
 * Mock implementation for local development.
 * Uses static Demo data and filters/searches in-memory.
 */
export class MockCatalogProvider implements CatalogProvider {
  async getCategories(clientId: string, parentId?: string): Promise<Category[]> {
    const categories = getDemoCategoriesForClient(clientId);
    if (parentId === undefined) {
      // Return only root categories
      return categories.filter(c => !c.parentId);
    }
    // Return children of specific parent
    return categories.filter(c => c.parentId === parentId);
  }

  async getCategoryBySlug(clientId: string, slug: string): Promise<Category | undefined> {
    const categories = getDemoCategoriesForClient(clientId);
    return categories.find(c => c.slug === slug);
  }

  async getBrands(clientId: string): Promise<Brand[]> {
    const products = getDemoProductsForClient(clientId);
    const brandNames = Array.from(new Set(products.map(p => p.brand)));
    return brandNames.map((name, idx) => ({
      id: `brand-${idx}`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count: products.filter(p => p.brand === name).length,
    }));
  }

  async getBrandBySlug(clientId: string, slug: string): Promise<Brand | undefined> {
    const brands = await this.getBrands(clientId);
    return brands.find(b => b.slug === slug);
  }

  async queryCatalog(clientId: string, query: CatalogQuery): Promise<CatalogQueryResult> {
    let products = getDemoProductsForClient(clientId);

    // Filter by category
    if (query.categorySlug && query.categorySlug !== 'all') {
      const category = await this.getCategoryBySlug(clientId, query.categorySlug);
      if (!category) {
        return { products: [], facets: [], pagination: { page: 1, perPage: 12, total: 0, totalPages: 0 } };
      }
      // Include products in this category and all descendants
      const categoryIds = await this.getCategoryAndDescendants(clientId, category.id);
      products = products.filter(p => categoryIds.includes(p.category));
    }

    // Filter by brand
    if (query.brandSlugs && query.brandSlugs.length > 0) {
      const brands = await Promise.all(query.brandSlugs.map(slug => this.getBrandBySlug(clientId, slug)));
      const brandNames = brands.filter((b): b is Brand => !!b).map(b => b.name);
      products = products.filter(p => brandNames.includes(p.brand));
    }

    // Search
    if (query.searchQuery) {
      const q = query.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.title.en.toLowerCase().includes(q) ||
        p.title.ar.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q)
      );
    }

    // Price range
    if (query.minPrice !== undefined) {
      products = products.filter(p => p.price >= query.minPrice!);
    }
    if (query.maxPrice !== undefined) {
      products = products.filter(p => p.price <= query.maxPrice!);
    }

    // In stock only
    if (query.inStockOnly) {
      products = products.filter(p => p.inStock && p.stockCount > 0);
    }

    // Sort
    const sorted = this.sortProducts(products, query.sortBy || 'featured');

    // Pagination
    const page = query.page || 1;
    const perPage = query.perPage || 12;
    const total = sorted.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paginatedProducts = sorted.slice(start, start + perPage);

    // Build facets
    const facets = this.buildFacets(clientId, products, query);

    return {
      products: paginatedProducts,
      facets,
      pagination: { page, perPage, total, totalPages },
      currentCategory: query.categorySlug ? await this.getCategoryBySlug(clientId, query.categorySlug) : undefined,
      currentBrand: query.brandSlugs?.[0] ? await this.getBrandBySlug(clientId, query.brandSlugs[0]) : undefined,
    };
  }

  async getProductsByCategory(clientId: string, categorySlug: string, page = 1, perPage = 12): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { categorySlug, page, perPage });
  }

  async getProductsByBrand(clientId: string, brandSlug: string, page = 1, perPage = 12): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { brandSlugs: [brandSlug], page, perPage });
  }

  async searchProducts(clientId: string, query: string, page = 1, perPage = 12): Promise<CatalogQueryResult> {
    return this.queryCatalog(clientId, { searchQuery: query, page, perPage });
  }

  private async getCategoryAndDescendants(clientId: string, categoryId: string): Promise<string[]> {
    const categories = getDemoCategoriesForClient(clientId);
    const result = [categoryId];
    const children = categories.filter(c => c.parentId === categoryId);
    for (const child of children) {
      const descendants = await this.getCategoryAndDescendants(clientId, child.id);
      result.push(...descendants);
    }
    return result;
  }

  private sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        // Demo data doesn't have dates; use reviews as proxy
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }
  }

  private buildFacets(clientId: string, products: Product[], query: CatalogQuery) {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    const priceValues = products.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    return [
      {
        id: 'brand',
        name: { en: 'Brand', ar: 'العلامة التجارية' },
        type: 'checkbox' as const,
        options: uniqueBrands.map(brand => ({
          value: brand,
          label: brand,
          count: products.filter(p => p.brand === brand).length,
        })),
        activeValues: query.brandSlugs || [],
      },
      {
        id: 'price',
        name: { en: 'Price', ar: 'السعر' },
        type: 'price-range' as const,
        options: [
          { value: 'min', label: minPrice.toString(), count: products.length },
          { value: 'max', label: maxPrice.toString(), count: products.length },
        ],
      },
      {
        id: 'availability',
        name: { en: 'Availability', ar: 'التوفر' },
        type: 'checkbox' as const,
        options: [
          { value: 'in-stock', label: { en: 'In Stock', ar: 'متوفر' }, count: products.filter(p => p.inStock).length },
        ],
        activeValues: query.inStockOnly ? ['in-stock'] : [],
      },
    ];
  }
}

export const mockCatalogProvider = new MockCatalogProvider();
