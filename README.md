# White-Label Ecommerce Starter

A bilingual (English/Arabic, LTR/RTL) ecommerce storefront template. This is a
**white-label starter**, not a multi-tenant platform: the codebase is shared,
but **every deployment serves exactly one company**. There is no store
switcher and no way for a shopper to see another client's branding, products,
or content.

```
Shared Ecommerce Core
        ↓
Client Configuration (src/config/clients/*)
        ↓
Theme + Content + Commerce Provider
        ↓
One Branded Store Deployment
```

Four example clients ship with the template — `voltix` (consumer
electronics), `apex` (gaming gear), `lumina` (smart home), `shams` (a general
lifestyle store, Arabic-first) — to prove the white-label mechanism works and
to serve as references for onboarding a real company.

## Quick start

```bash
npm install
cp .env.voltix.example .env.voltix
npm run dev:voltix
```

Open http://localhost:3000. Try `dev:apex` / `dev:lumina` / `dev:shams` in
another terminal (on a different port, or after stopping the first) to see a
completely different brand from the same code.

```bash
cp .env.shams.example .env.shams
npm run dev:shams     # runs Shams Store, English/LTR by default (VITE_STORE_ID=shams)
npm run build:shams   # production build for Shams Store
```

## How the active client is selected

Every deployment reads **one** environment variable, `VITE_STORE_ID`, at
build/run time:

```bash
VITE_STORE_ID=voltix npm run dev
```

- There is **no default and no silent fallback**. If `VITE_STORE_ID` is
  missing or doesn't match a registered client, both `vite dev` and
  `vite build` fail immediately with a clear error listing the valid ids.
- The active client cannot be changed by a URL parameter, cookie, or any
  in-app control. It is fixed for the lifetime of the deployment.
- Registered clients live in `src/config/clients/registry.ts`. Each one is
  validated against a Zod schema (`src/config/clients/schema.ts`) at import
  time, so a broken config file fails fast instead of shipping silently.

Convenience scripts are provided per example client:

```bash
npm run dev:voltix   npm run build:voltix
npm run dev:apex     npm run build:apex
npm run dev:lumina   npm run build:lumina
```

These pass `--mode <client>` to Vite, which loads `.env.<client>` (see
`.env.voltix.example`, `.env.apex.example`, `.env.lumina.example` — copy the
one you need to `.env.<client>`, without the `.example` suffix; never commit
`.env*` files, they're gitignored).

## Onboarding a new company

None of the steps below touch a shared component (`Header`, `Footer`,
`HomeScreen`, `Checkout`, etc.). Everything a new client needs lives in its
own config, content, and asset files.

1. **Add a config file** — copy `src/config/clients/voltix.config.ts` to
   `src/config/clients/<id>.config.ts` and fill in every field. The Zod
   schema in `schema.ts` will reject the file at import time if anything
   required is missing or malformed.
2. **Register it** — add one line to `src/config/clients/registry.ts`.
3. **Logo & favicon** — drop SVG/PNG files under
   `public/assets/clients/<id>/` and point `logo` / `favicon` at them in the
   config. The three example clients currently ship placeholder SVGs
   (clearly labeled "Demo placeholder image") — replace them with the real
   brand assets before launch.
4. **Colors & fonts** — set the `theme` block in the config (`colorPrimary`,
   `colorSurface`, `radiusButton`, `fontSans`, …). These become CSS custom
   properties at runtime (`src/core/theme/applyTheme.ts`) that Tailwind's
   semantic utilities read (`bg-primary`, `text-primary`, `bg-surface`,
   `rounded-card`, …) — no component hardcodes a brand color.
5. **Content & policies** — hero copy, bento banners, warranty/return
   policy text, contact info, and social links all live in the config's
   `home`, `policies`, `contact`, and `socialLinks` fields (all bilingual:
   `{ en, ar }`).
6. **Products** — see "Connecting a product source" below.
7. **Payment & shipping** — set `paymentMethods` (only the ones this client
   actually offers), `shipping` (zones, fees, free-shipping threshold), and
   `tax` (VAT rate and label) in the config.
8. **Environment file** — create `.env.<id>` with `VITE_STORE_ID=<id>`, and
   commit a matching `.env.<id>.example` (no secrets) for the next person.
9. **Build & deploy** — `vite build --mode <id>` (or add an npm script like
   the existing `build:voltix`). Each deployment gets its own build; nothing
   at runtime lets it become another client.

### Example: adding a fourth client ("nova")

```bash
cp src/config/clients/voltix.config.ts src/config/clients/nova.config.ts
# edit nova.config.ts: id/slug 'nova', displayName, theme colors, contact,
# shipping zones, payment methods, policies, home hero content, nav categories
```
```ts
// src/config/clients/registry.ts
import { novaConfig } from './nova.config';
const rawRegistry: Record<string, unknown> = {
  voltix: voltixConfig,
  apex: apexConfig,
  lumina: luminaConfig,
  nova: novaConfig, // add this line
};
```
```bash
mkdir -p public/assets/clients/nova   # add logo.svg, photo-placeholder.svg (real photos)
echo "VITE_STORE_ID=nova" > .env.nova
npm run dev -- --mode nova            # or add a "dev:nova" script
```

`shams` (below) is this exact pattern already carried out for a real fourth
client, not a hypothetical — read it for a concrete reference.

## Shams Store — the Egypt-market reference client

`shams` is the first client taken past "example config" into a full
storefront: real routing, a full page set, an Egyptian checkout, and a
provider-driven commerce layer. It is still in **Demo Mode** — see
[docs/SHAMS-LAUNCH-CHECKLIST.md](docs/SHAMS-LAUNCH-CHECKLIST.md) for exactly
what the business owner still has to supply.

```bash
npm run dev:shams      # dev server (English/LTR by default)
npm run build:shams    # production build
npm run verify:shams   # build + assert no other client's/market's terms leaked in
```

**Market setup** (`src/config/clients/shams.config.ts`):

| Setting | Value |
| --- | --- |
| `market` | `'egypt'` — switches the shared checkout to the governorate address form and Egyptian phone validation |
| `defaultLocale` / `supportedLocales` | `'en'` / `['en', 'ar']` — English + LTR on a first visit, Arabic + RTL fully supported |
| `currencies` / `defaultCurrency` | a single `EGP` entry / `'EGP'` |
| `timezone` | `'Africa/Cairo'` |
| `tax` | 14% VAT, prices tax-exclusive |
| `shipping` | 60 EGP standard, free over 1500 EGP, `etaConfirmed: false` |
| `featureFlags` | wishlist + quick view on, coupons off, express delivery off |
| `paymentMethods` | `card` and `cod` only |

**Language behaviour**: a first-time visitor always gets the client's
`defaultLocale` (English for Shams) — the browser's language is deliberately
never used to pick it. The choice is then stored per client
(`ecommerce:shams:preferences:language`) and survives reloads; a fresh browser
returns to English. Switching language changes nothing else (client, currency,
route).

**Nothing invented**: `contact`, `addresses`, `socialLinks` are empty and
`policies.returnPolicy`/`warrantyPolicy` are unset, so the header contact row,
footer policy block, PDP guarantee badges, `/contact` page and the SEO
`contactPoint`/`sameAs` entries all hide themselves rather than display a made
-up phone number or warranty claim. The seven info pages render **clearly
labelled drafts** (`status: 'draft'` + a visible notice) instead of pretending
to be approved policy.

**Its own data**: Shams's catalog lives in `src/data/demo/shams/` (12 products,
5 categories) and is wired in by a build-time virtual module, so
`src/data/mockData.ts` — the shared voltix/apex/lumina catalog, full of Gulf
-market copy — is never part of a Shams build at all. Every Shams product has
`isDemo: true`, `rating: 0` and `reviews: []`.

**Client isolation is verified, not assumed**: `npm run verify:shams` greps the
built bundle for `Voltix, Apex, Lumina, GCC, AED, SAR, Mada, Tabby, Tamara,
Riyadh, Dubai` and exits non-zero on a hit. Two build-time plugins make that
possible (`vite-plugins/activeClientConfig.ts`): only the selected client's
config file and only its own demo catalog ever enter the module graph.

## Routes

Real path-based routes (react-router), all deep-linkable, with route-level
code splitting and scroll restoration:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/products` | Full catalog |
| `/category/:categorySlug` | Category listing (unknown slug → "Category Not Found") |
| `/search?q=` | Search results (`noindex`) |
| `/product/:productSlug` | Product detail (unknown slug → "Product Not Found") |
| `/cart` | Cart page (`noindex`) |
| `/wishlist` | Wishlist page (`noindex`) |
| `/checkout` | Checkout (`noindex`) |
| `/order/:orderId` | Order confirmation (`noindex`, unknown id → "Order Not Found") |
| `/about` `/contact` `/faq` `/shipping` `/returns` `/warranty` `/privacy` `/terms` | Info pages, content-driven |
| anything else | 404 page |

Components never build URLs by hand: `StoreContext` exposes `goHome`,
`goToProducts`, `goToCart`, `goToWishlist`, `goToCheckout`, `goToOrder(id)`,
`navigateToProduct(id)` and `navigateToCategory(id)`, so the URL scheme lives
in exactly one file. PLP filters (brand, price, stock, rating, sort, view) live
in the query string, so a filtered listing is shareable.

## Editing Egypt-market data

- **Governorates**: `src/data/egyptGovernorates.ts` — all 27, bilingual. This
  is public reference data shared by any Egypt-market client; the checkout
  dropdown is generated from it.
- **Which governorates you actually serve**: `shipping.zones` in the client
  config.
- **Shipping fees**: never hardcoded in a component. `calculateShipping` on the
  commerce provider computes them from governorate + method + subtotal; the fee
  and any ETA come back from there. Change the rules in the provider (or the
  real backend), not in the UI.
- **Tax**: `tax.vatPercent` / `tax.pricesIncludeTax`, applied by
  `calculateTaxes`.
- **Delivery methods**: standard is always offered; express appears only when
  `featureFlags.expressDeliveryEnabled` is true; pickup appears only when
  `addresses[]` has a confirmed branch. With `etaConfirmed: false` the UI shows
  "shipping is calculated once you choose your governorate" and never a
  promised date.

## Editing content and policies

Each info page reads from `content` in the client config:

```ts
content: {
  about:          { status: 'draft' | 'confirmed', body: { en, ar } },
  faq:            [{ question: { en, ar }, answer: { en, ar } }],
  shippingInfo:   { status, body },
  returnsInfo:    { status, body },
  warrantyInfo:   { status, body },
  privacyPolicy:  { status, body },
  termsOfService: { status, body },
}
```

- Omit a document entirely → its page shows an honest "not published yet"
  state (and it stays out of the footer's link list only if you remove it
  there too).
- `status: 'draft'` → the page renders with a visible draft notice, and
  `getProductionReadinessIssues()` flags it.
- `status: 'confirmed'` → treated as real, published policy. Only set this
  after the text has actually been reviewed.

## Adding products

Demo data (per client) lives in `src/data/demo/<client>/products.ts` — or, for
the three Gulf example clients, in the shared `src/data/mockData.ts` keyed by
`storeId`. Required fields are on `Product` in `src/types/store.ts`. Rules the
template holds itself to:

- price in the client's own currency (no invented FX conversion),
- `isDemo: true` on anything that isn't a real, sellable listing,
- `reviews: []` and `rating: 0` unless the reviews are genuinely collected —
  demo reviews are never emitted into JSON-LD,
- placeholder images labelled as placeholders.

A real catalog should come from a provider instead (next section), at which
point these files are only fixtures for tests and local development.

## The commerce layer (CommerceProvider)

Components never touch product data directly — everything goes through
`CommerceProvider` (`src/core/commerce/types.ts`):

```ts
getProducts(clientId, signal?)          getProductBySlug(clientId, slug, signal?)
getCategories(clientId, signal?)        searchProducts(clientId, query, signal?)
validateCart(clientId, items)           getInventory(clientId, productId)
applyCoupon(clientId, code, subtotal)   removeCoupon()   // client-side today
calculateShipping(clientId, request)    calculateTaxes(clientId, subtotal)
calculateTotals(clientId, request)      createOrder(clientId, request)
getOrder(clientId, orderId)
```

Requests and responses are typed, errors are a typed `CommerceError` with a
`code` (`NOT_FOUND`, `OUT_OF_STOCK`, `INVALID_COUPON`, `INVALID_REQUEST`,
`PROVIDER_UNAVAILABLE`), and read methods accept an `AbortSignal`.

**Only `MockCommerceProvider` is implemented** — it is backed by the per-client
demo catalog and (for orders) `sessionStorage`. It deliberately enforces the
rules a real backend must also enforce:

- `validateCart` recomputes every line against the current catalog, so a
  stale price or quantity sitting in the browser's cart is corrected, not
  trusted. The cart page and checkout both call it on open.
- `createOrder` re-checks stock and **generates the order id itself** (using
  `orderNumberPrefix`); the UI can never mint or guess an order number.
- `calculateShipping`/`calculateTaxes`/`calculateTotals` are the only source
  of fees, tax and totals — recomputed before the order is created.

### Connecting WooCommerce (or any real backend)

Not implemented on purpose: a real integration needs credentials and auth
decisions that don't exist yet, and faking it would be worse than leaving it
out. The contract to implement:

1. **Put a backend between the storefront and WooCommerce.** WooCommerce's
   consumer key/secret must live on a server you control. Anything in a
   `VITE_*` variable is compiled into the JavaScript bundle and is public —
   never put a secret there.
2. Implement `class WooCommerceProvider implements CommerceProvider` in
   `src/core/commerce/`, calling your backend (not WooCommerce directly), and
   map its responses onto `Product` / `Category` / `OrderDetails`.
3. Swap the singleton import (`mockCommerceProvider`) for a factory that picks
   the provider from `client.commerce.provider`, and set that client's
   `commerce.provider` to `'woocommerce'`.
4. Keep the invariants above server-side: prices, stock, discounts, shipping
   and totals sent from the browser are untrusted input and must be
   recomputed before an order is accepted.
5. Support an idempotency key on order creation so a double-submit (or a
   retried request) cannot create two orders.

### Connecting a payment gateway

`PaymentProvider` (`src/core/payment/types.ts`) has the same shape of contract,
with only `MockPaymentProvider` implemented.

- In Demo Mode, Cash on Delivery is the default method and the demo card form
  is dev-only.
- For a real integration, use the gateway's **hosted checkout page or
  tokenized/iframe card fields**. Do not collect raw card numbers or CVC in
  this React form in production — the demo card inputs exist only so the mock
  flow is visible, and no card data is ever transmitted or stored.
- Name a gateway in the UI only once it is actually integrated; until then
  the storefront claims nothing about who processes payments.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_STORE_ID` | Yes | Selects the active client. No default. |
| `VITE_WOOCOMMERCE_BASE_URL` | Only if `commerce.provider` is `woocommerce`/`rest` | Store API base URL |
| `VITE_WOOCOMMERCE_CONSUMER_KEY_VAR` / `..._SECRET_VAR` | Same | **Names** of the env vars holding the real key/secret, supplied by your host at deploy time |

See `.env.example` for the full template.

## Commands

```bash
npm run dev            # dev server, requires VITE_STORE_ID set
npm run dev:voltix      # dev server pinned to the voltix example client
npm run dev:apex        # ...pinned to apex
npm run dev:lumina      # ...pinned to lumina
npm run dev:shams       # ...pinned to shams
npm run build           # production build, requires VITE_STORE_ID set
npm run build:voltix    # production build for voltix
npm run build:apex      # ...for apex
npm run build:lumina    # ...for lumina
npm run build:shams     # ...for shams
npm run verify:shams    # build shams, then assert no foreign brand/market terms leaked in
npm run verify:voltix   # same check for voltix
npm run preview:shams   # serve the built shams bundle
npm run typecheck       # tsc --noEmit
npm run lint            # eslint .
npm run test            # vitest run (VITE_STORE_ID defaults to shams)
npm run test:watch      # vitest, watch mode
```

`VITE_STORE_ID=voltix npx vitest run` runs the suite against another client.

## Demo Mode vs. a real launch

This template ships in **Demo Mode** by every client's config
(`commerce.provider: 'mock'`). In this mode:

- Checkout uses `MockPaymentProvider` (`src/core/payment/MockPaymentProvider.ts`):
  no card data is transmitted anywhere, no real charge occurs, and a clear
  "Demo mode" notice is shown on the checkout page instead of a false
  encryption/security claim.
- Products come from the shared demo catalog (`src/data/mockData.ts`), not a
  live backend.
- Coupon codes are illustrative (`demoCouponCodes` in each client config).

**Before a real launch**, at minimum:

- [ ] Replace demo logo/favicon/hero/banner assets with real brand assets
- [ ] Connect a real `CommerceProvider` (WooCommerce/REST) instead of the demo catalog
- [ ] Implement and wire a real `PaymentProvider` (Stripe, PayTabs, Tap, …) behind the same interface as `MockPaymentProvider`
- [ ] Review `client.seo.siteUrl` and set it to the real production domain
- [ ] Confirm `paymentMethods`, `shipping`, and `tax` reflect real, contractually accurate terms
- [ ] Have legal review the `policies` copy (returns, warranty)
- [ ] Set up real analytics/monitoring (none is bundled by default)

**Shams Store specifically**: see
[docs/SHAMS-LAUNCH-CHECKLIST.md](docs/SHAMS-LAUNCH-CHECKLIST.md) for the full
list of what the business owner still has to supply (legal identity, contact
details, served governorates, shipping fee table, approved policies, real
catalog, backend, payment gateway, support/social accounts).

### Production-readiness check

`src/core/launch/productionReadiness.ts` encodes the launch gate:
`getProductionReadinessIssues(client)` returns everything still missing — no
contact details, no address, missing return/warranty policy, a
`status: 'draft'` privacy policy or terms, or a `commerce.provider` still set
to `'mock'`. `logProductionReadiness()` prints them as a console warning in the
browser on start-up.

It is intentionally **non-blocking** for `npm run build:<client>`, so a client
that isn't launch-ready can still be built and staged for review. Wire
`getProductionReadinessIssues` into your release pipeline (fail the job when
the array is non-empty) to make it a hard gate for production deploys.

### Security notes

- **No secret belongs in a `VITE_*` variable** — those are inlined into the
  public bundle. WooCommerce consumer secrets and payment-gateway credentials
  live in a backend only.
- The checkout form is never persisted: cart lines are stored locally, but
  address/phone/card fields are not written to `localStorage` or logged.
- No personal or payment data is written to the console.
- Order submission is disabled while a submission is in flight, so a
  double-click can't create two orders; a real backend should additionally
  accept an idempotency key.
- Prices, stock, discounts, shipping and totals coming from the browser are
  untrusted — the provider recomputes them (`validateCart`, `calculate*`,
  `createOrder`), and a real backend must do the same.
- Set a Content-Security-Policy at the hosting layer; the app itself adds no
  inline scripts and uses no `dangerouslySetInnerHTML`.
- `npm audit` is worth running for awareness, but don't take major-version
  bumps just to silence it — check whether the advisory actually applies.

## What's still demo/incomplete in this template

This is a white-label **starter**. Known gaps, tracked here rather than hidden:

- `MockCommerceProvider` is the only commerce implementation; the
  WooCommerce/REST providers are a documented contract, not code.
- `MockPaymentProvider` is the only payment implementation. No gateway is
  integrated, and no real charge can occur.
- Orders live in `sessionStorage` (Demo Mode only) — there is no order history,
  account area, or order lookup by email/phone.
- Coupon validation runs client-side against `demoCouponCodes`; a real
  implementation must validate server-side.
- No end-to-end (Playwright/Cypress) suite is bundled — the automated coverage
  is Vitest unit/integration tests plus the build-output verification script.
  The Egyptian purchase flow (home → product → cart → checkout → COD order →
  confirmation, plus deep links, 404 states, Arabic RTL and 390px mobile) has
  been verified manually in a browser.
- Accessibility has been built for (semantic landmarks, one `h1` per page,
  skip link, 44px targets, labelled inputs, `aria-live` on cart-add and form
  errors, keyboard-operable cards, no color-only signalling) and checked with
  `eslint-plugin-jsx-a11y`, but **no full manual WCAG audit or screen-reader
  pass has been done** — treat automated checks as a hint, not a compliance
  claim.
- No analytics, consent banner, or sitemap generator is bundled.

## Architecture map

```
vite-plugins/
  activeClientConfig.ts  Build-time virtual modules: only the selected client's
                         config + its own demo catalog enter the bundle
scripts/
  verify-client-build.mjs  Fails if a build contains another client's/market's terms
docs/
  SHAMS-LAUNCH-CHECKLIST.md  What Shams still needs before a real launch
src/
  config/clients/       ClientConfig schema (Zod), registry, client ids, per-client configs
  config/active-client  Resolves the one active client from VITE_STORE_ID (no fallback)
  core/
    commerce/            CommerceProvider interface + MockCommerceProvider + per-client catalog
    payment/             PaymentProvider interface + MockPaymentProvider + payment labels
    theme/               Runtime CSS-variable injection from ClientConfig.theme
    launch/              Production-readiness gate
    storage/             Client-namespaced localStorage (cart/wishlist/preferences)
    catalog/, a11y/      Category icons, keyboard-operable card helper
  context/               StoreContext: locale/currency/cart/wishlist + navigation helpers
  components/
    common/              Header, Footer, MobileNav, Breadcrumb, SEOManager, ScrollToTop, 404s
    home/ plp/ pdp/      Home, listing/search, product detail
    cart/ wishlist/      Cart page, wishlist page
    checkout/            Market-aware checkout (Gulf + Egypt) and order confirmation
    info/                Content-driven info pages (About/FAQ/policies) + Contact
  data/
    mockData.ts          Shared voltix/apex/lumina demo catalog
    demo/shams/          Shams's own separate demo catalog
    egyptGovernorates.ts Egypt's 27 governorates (shared reference data)
    translations.ts      Bilingual UI copy (market-neutral by test)
  types/                 Shared TypeScript types
```
