# Catalog integration — handoff to Claude

## Corrected locally

- Public catalog uses `/wp-json/wc/store/v1`, never browser-side administrative `wc/v3` credentials.
- `VITE_WORDPRESS_URL` is read via `import.meta.env` using the client's configured `envVarNames.baseUrl`. Missing/invalid live configuration displays an error, not localhost or demo data.
- Store API returns an array; totals are `X-WP-Total` and `X-WP-TotalPages`. The bridge must expose both headers to the frontend origin.
- `per_page` is capped at 100. Products and category collections follow pagination; duplicate/incomplete product snapshots fail visibly.
- Prices use `prices.currency_minor_unit`; an undisclosed stock quantity is not zero stock. Product brands come from the native brands taxonomy.
- Loading/error/retry UI prevents a partial catalog from being presented as complete.
- Live checkout and order confirmation are guarded because their existing implementation still uses mock commerce. This is a catalog repair, NOT completed payment integration.

## Deliberate transitional limitation

Existing home/search/PLP/category/brand/PDP consumers use the shared full product array. `loadLiveCatalog` currently loads a complete paginated snapshot before publishing it, preserving those consumers. This is more expensive than server-driven discovery. Do not replace it with one page without migrating all consumers, direct PDP loading, facets, and pagination together. Accurate server facet counts must come from collection-data, not page-local counts. The adapter currently returns no facet counts rather than fabricating them.

## Next work (not completed here)

1. Migrate discovery consumers to query-level server pagination, cancellation, caching, and collection-data facets.
2. Resolve multi-category membership and dedicated brand entities throughout the existing UI rather than deriving everything from a product's primary category/brand.
3. Replace the local cart, mock validation/totals/order creation and payment consumers with the WooCommerce cart session and authorized checkout integration. Then remove the explicit live checkout guard after end-to-end verification.
4. Integrate Shams compatibility/add-on engines through adapters, without imposing them on other clients.

## Configuration

Shams: `VITE_STORE_ID=shams`, `VITE_WORDPRESS_URL=https://www.shams-stores.com`. Other clients retain their own provider settings. No WooCommerce consumer secret belongs in `VITE_*`. `VITE_PAYMENT_MODE` does not configure the backend gateway and is not consumed by this repair.

Read-only live inspection on 2026-09-10 observed 1413 public products (not a permanent expected count); `per_page=1000` returned 400 and unauthenticated `wc/v3/products` returned 401. Neither response implies other products need browser credentials. Compare publication/visibility/settings before reconciling admin totals.

No WordPress activation, production settings change, order creation, payment, commit, push or deployment is authorized by this handoff.
