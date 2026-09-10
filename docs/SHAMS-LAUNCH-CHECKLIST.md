# Shams Store — pre-launch checklist

Everything below has to be **real and confirmed by the business owner** before
`shams` can serve actual customers. Until then the storefront runs in Demo
Mode: the catalog is placeholder data, orders are stored in the browser only,
and no payment is ever taken.

Verify current status at any time:

```bash
npm run verify:shams
```

That builds the Shams bundle and fails if it contains another client's brand
names or another market's terminology. The runtime check
(`getProductionReadinessIssues`, logged to the console in the browser) lists
which items on this checklist are still outstanding.

---

## 1. Brand and domain

| Item | Where it goes | Status |
| --- | --- | --- |
| Final logo (SVG preferred) | `public/assets/clients/shams/logo.svg` | ⬜ placeholder |
| Favicon / app icon | `public/assets/clients/shams/` + `favicon` in the config | ⬜ placeholder |
| Product photography (replaces Unsplash placeholders) | `src/data/demo/shams/products.ts` → real catalog source | ⬜ placeholder |
| Open Graph share image | `seo.ogImage` | ⬜ placeholder |
| Production domain | `VITE_SITE_URL` + `seo.siteUrl` | ⬜ `shams-store.example` |

## 2. Legal identity

| Item | Where it goes | Status |
| --- | --- | --- |
| Registered legal name (as on the commercial register) | `legalName` | ⬜ `"Shams Store"` (working name) |
| Commercial registration number (السجل التجاري) | invoice/footer copy once confirmed | ⬜ not provided |
| Tax registration number (البطاقة الضريبية) | invoice/footer copy once confirmed | ⬜ not provided |
| Whether e-invoicing (الفاتورة الإلكترونية) applies | backend integration | ⬜ undecided |
| VAT treatment: is 14% correct, and are prices tax-inclusive? | `tax.vatPercent`, `tax.pricesIncludeTax` | ⬜ assumed 14%, prices exclusive |

## 3. Contact details

Nothing here is currently published — the header, footer and `/contact` page
hide these sections rather than show invented values.

| Item | Where it goes | Status |
| --- | --- | --- |
| Support phone (+ display format) | `contact.supportPhone`, `contact.supportPhoneDisplay` | ⬜ not provided |
| Support email | `contact.supportEmail` | ⬜ not provided |
| WhatsApp number (if used for support) | `contact.whatsapp` | ⬜ not provided |
| Physical address(es) / branches | `addresses[]` | ⬜ empty |
| Support hours | contact page copy | ⬜ not provided |

> Pickup-from-branch at checkout only appears once `addresses[]` contains at
> least one confirmed branch.

## 4. Delivery

| Item | Where it goes | Status |
| --- | --- | --- |
| Which governorates are actually served | `shipping.zones` (use ids from `src/data/egyptGovernorates.ts`) | ⬜ Cairo/Giza/Alexandria assumed |
| Shipping fee table (per governorate / weight / method) | `MockCommerceProvider.calculateShipping` → real provider | ⬜ flat 60 EGP assumed |
| Free-shipping threshold | `shipping.freeShippingThreshold` | ⬜ 1500 EGP assumed |
| Order processing / lead times | `shipping.etaConfirmed` + provider ETA | ⬜ `etaConfirmed: false` (no ETA shown) |
| Express delivery: offered? at what price? | `featureFlags.expressDeliveryEnabled`, `shipping.expressFee` | ⬜ disabled |
| Shipping company / courier contract | backend integration | ⬜ not signed |
| Who pays return shipping | returns policy copy | ⬜ not decided |

Until a courier commitment exists, checkout deliberately shows
"Shipping is calculated once you choose your governorate" and never a promised
delivery date.

## 5. Policies (legal review required)

All five documents currently exist as **clearly-labelled drafts** and render a
visible "draft content" notice. Replace the body text and flip
`status: 'draft'` → `'confirmed'` in `src/config/clients/shams.config.ts`.

| Document | Config path | Status |
| --- | --- | --- |
| About / company story | `content.about` | ⬜ draft |
| Shipping & delivery info | `content.shippingInfo` | ⬜ draft |
| Returns & exchange policy (window, conditions, who pays) | `content.returnsInfo` + `policies.returnPolicy` | ⬜ draft |
| Warranty policy | `content.warrantyInfo` + `policies.warrantyPolicy` | ⬜ draft |
| Privacy policy (**must** be lawyer-reviewed before collecting customer data) | `content.privacyPolicy` | ⬜ draft |
| Terms of service (**must** be lawyer-reviewed) | `content.termsOfService` | ⬜ draft |
| FAQ answers confirmed by the business | `content.faq` | ⬜ hedged placeholders |

## 6. Catalog and inventory

| Item | Where it goes | Status |
| --- | --- | --- |
| Real product list (names, descriptions, specs) | commerce provider | ⬜ 12 demo products |
| Real prices in EGP | commerce provider | ⬜ demo prices |
| Real stock levels, and who updates them | commerce provider | ⬜ demo values |
| Product images with usage rights | product data | ⬜ Unsplash placeholders |
| Whether warranty claims per product are backed by a supplier | `product.warranty` | ⬜ generic text |
| Whether customer reviews will be collected (and from where) | `featureFlags.reviewsEnabled` | ⬜ no reviews shipped |

Every demo product carries `isDemo: true` and empty `reviews` — no invented
customer feedback is shipped, and no demo review is ever emitted into
structured data.

## 7. Backend and payments

| Item | Where it goes | Status |
| --- | --- | --- |
| WooCommerce (or other) store + admin access | backend service | ⬜ none |
| Backend service to hold API credentials (never in `VITE_*`) | new service | ⬜ not built |
| `WooCommerceProvider` implementing `CommerceProvider` | `src/core/commerce/` | ⬜ contract documented only |
| Payment gateway contract (Egypt) and merchant account | gateway + backend | ⬜ none |
| Hosted checkout / tokenized card fields (never raw card fields in this form) | `PaymentProvider` implementation | ⬜ mock only |
| Cash on Delivery: fee, cash-handling rules, courier settlement | provider + policy copy | ⬜ COD shown without a fee |
| Wallets / InstaPay / installments — offered at all? | `paymentMethods` + real integration | ⬜ not offered, not wired |
| Order-number scheme (is `SHM-…` acceptable?) | `orderNumberPrefix` | ⬜ assumed |
| Refund process and who can issue refunds | backend + policy | ⬜ not decided |

No payment provider is named anywhere in the storefront until it is actually
integrated.

## 8. Operations and messaging

| Item | Status |
| --- | --- |
| Order confirmation email / SMS / WhatsApp copy (AR + EN) | ⬜ not written |
| Who monitors orders, and the response-time commitment | ⬜ not defined |
| Out-of-stock / partial-fulfilment handling | ⬜ not defined |
| Complaint escalation path | ⬜ not defined |

## 9. Analytics, consent and security

| Item | Status |
| --- | --- |
| Analytics tool, and what may legally be tracked | ⬜ none installed |
| Cookie/consent banner requirement decision | ⬜ not decided |
| Content-Security-Policy headers for the hosting platform | ⬜ documented, not deployed |
| HTTPS + HSTS at the hosting layer | ⬜ hosting-dependent |
| Confirmation that no secret ever lands in a `VITE_*` variable | ✅ enforced by review + docs |

## 10. Social accounts

| Item | Where it goes | Status |
| --- | --- | --- |
| Facebook / Instagram / TikTok / X / YouTube URLs | `socialLinks` | ⬜ empty (omitted from UI and from Organization schema) |

---

## Launch gate

Do not launch while any of the following is still true:

- [ ] `content.privacyPolicy` or `content.termsOfService` is `status: 'draft'`
- [ ] `commerce.provider` is still `'mock'`
- [ ] `contact` has neither a phone nor an email
- [ ] prices, stock or shipping fees are still demo values
- [ ] product images are still placeholders
- [ ] no payment gateway is integrated through a backend

`getProductionReadinessIssues()` (src/core/launch/productionReadiness.ts)
checks exactly these and is safe to wire into a release pipeline as a hard
gate — it is intentionally non-blocking for local builds so staging a
not-yet-ready client stays possible.
