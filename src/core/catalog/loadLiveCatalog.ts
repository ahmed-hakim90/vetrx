import type { ClientConfig } from '../../config/clients/schema';
import type { Product } from '../../types/store';
import { WooCommerceCatalogProvider } from './WooCommerceCatalogProvider';

export function resolveCatalogUrl(client: ClientConfig, env: Record<string, unknown>): string {
  const key = client.commerce.envVarNames?.baseUrl;
  const value = key ? env[key] : undefined;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing public WordPress URL (${key || 'commerce.envVarNames.baseUrl'})`);
  }
  return value.trim();
}

/**
 * CLAUDE HANDOFF: transitional snapshot for existing local filters/PDP/search.
 * Read every page using server totals, then publish atomically: a partial page
 * must never masquerade as the complete catalog. Future server-side filtering
 * must migrate ALL consumers before replacing this with a single-page fetch.
 * No credentials, hardcoded product totals, localhost fallback or demo recovery.
 */
export async function loadLiveCatalog(
  provider: WooCommerceCatalogProvider,
  clientId: string,
  signal: AbortSignal,
) {
  const products: Product[] = [];
  const first = await provider.queryCatalog(clientId, { page: 1, perPage: 100 }, signal);
  products.push(...first.products);
  for (let page = 2; page <= first.pagination.totalPages; page++) {
    signal.throwIfAborted();
    const next = await provider.queryCatalog(clientId, { page, perPage: 100 }, signal);
    if (next.pagination.total !== first.pagination.total || next.products.length === 0) {
      throw new Error('Catalog changed during loading. Please retry.');
    }
    products.push(...next.products);
  }
  if (new Set(products.map(p => p.id)).size !== first.pagination.total || products.length !== first.pagination.total) {
    throw new Error('Incomplete catalog response. Please retry.');
  }
  const categories = await provider.getCategories(clientId, undefined, signal);
  return { products, categories };
}
