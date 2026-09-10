# Shams Stores — pre-launch checklist

**Business**: Shams Stores (شمس ستورز) — professional photography, video and
audio equipment, Egypt.
**Domain**: https://www.shams-stores.com
**Config**: `src/config/clients/shams.config.ts`

✅ = confirmed by the business and in the config · ⚠️ = on record but not
re-confirmed · ⬜ = still missing / not decided.

Check status at any time:

```bash
npm run verify:shams   # build + assert no other client's or market's terms leaked in
```

`getProductionReadinessIssues()` (src/core/launch/productionReadiness.ts)
reports every ⚠️/⬜ item below as a launch blocker and logs them in the
browser console on start-up.

---

## 1. Identity and brand

| Item | Status |
| --- | --- |
| Trading name, bilingual display name | ✅ Shams Stores / شمس ستورز |
| Business category | ✅ photo, video & audio equipment |
| Production domain (`seo.siteUrl`) | ✅ www.shams-stores.com |
| Tagline, hero copy, About text | ✅ supplied by the business |
| Facebook / Instagram | ✅ linked |
| **Registered legal name** (as on the commercial register) — needed for invoices and Organization schema | ⬜ `legalName` currently holds the trading name |
| Commercial registration number (السجل التجاري) | ⬜ not provided |
| Tax registration number (البطاقة الضريبية) | ⬜ not provided |
| Final logo / favicon files | ⬜ placeholder SVG in `public/assets/clients/shams/` |
| Hero and OG share image | ⬜ placeholder |

## 2. Contact and branches

| Item | Status |
| --- | --- |
| Landline 02 2390 1870 / 02 2390 1860, mobile 010 1133 1666 | ✅ shown on /contact, dialable |
| Support email info@shams-stores.com | ⚠️ on record, **not re-verified** — confirm it is monitored |
| Downtown branch — 5 Sherif Street, Downtown, Cairo | ⚠️ address & numbers not re-confirmed by the owner |
| Heliopolis branch — 24 Omar Ibn El-Khattab St, Ismailia Square | ⚠️ same |
| Opening hours | ⬜ not provided (not displayed anywhere) |
| WhatsApp number for support | ⬜ not provided (no WhatsApp UI is shown) |
| Do the branches accept **in-store pickup** of online orders? | ⬜ `shipping.pickupEnabled: false` — pickup is not offered at checkout |

## 3. Delivery — nothing is published yet

The storefront currently says delivery fees are **not published**, quotes no
fee, and promises no delivery date. This is deliberate; it needs real answers:

| Item | Status |
| --- | --- |
| Which governorates do you deliver to? (`shipping.zones`, ids from `src/data/egyptGovernorates.ts`) | ⬜ empty |
| Fee per governorate / weight / method (`shipping.standardFee` or a real rate table) | ⬜ unset — checkout shows "—" |
| Free-shipping threshold, if any | ⬜ unset — no progress bar shown |
| Order processing and delivery times (`shipping.etaConfirmed`) | ⬜ false — no ETA anywhere |
| Express delivery: offered? at what price? | ⬜ `expressDeliveryEnabled: false` |
| Courier / shipping company | ⬜ none |
| Who pays return shipping (`returnShippingPaidBy`) | ⬜ not decided |
| Handling of fragile/high-value equipment in transit | ⬜ not decided |

## 4. Tax

| Item | Status |
| --- | --- |
| Egypt statutory VAT rate (reference only) | ✅ 14% recorded |
| **Is the business VAT-registered and charging VAT?** (`tax.vatApplied`) | ⬜ unknown — **no VAT is charged or displayed** until confirmed |
| Are catalog prices VAT-inclusive or exclusive? (`pricesIncludeTax`) | ⬜ unknown |
| Does e-invoicing (الفاتورة الإلكترونية) apply? | ⬜ unknown |
| Does e-receipt (الإيصال الإلكتروني) apply? | ⬜ unknown |

## 5. Payments

| Item | Status |
| --- | --- |
| Cash on Delivery — historically accepted | ⚠️ `confirmed: false`: offered in Demo Mode only, **not confirmed as currently accepted** |
| COD fee, cash-handling limits, courier settlement | ⬜ not provided |
| Card payment — referenced in the terms | ⬜ `enabled: false`, no gateway integrated, not offered in the UI |
| Payment gateway contract + merchant account (Egypt) | ⬜ none |
| Hosted checkout / tokenized card fields (raw card fields must never be used in production) | ⬜ not implemented |
| Wallets / InstaPay / installments | ⬜ not offered, not wired |
| Order-number prefix `SHAMS-` acceptable? | ⚠️ assumed from the provided config |
| Refund process and who may issue refunds | ⬜ not defined |

## 6. Catalog

The 13 categories supplied by the business are in place. The **products are
placeholder demo data**: representative equipment names with **made-up prices
and stock**, marked `isDemo: true`, no reviews, stock photography.

| Item | Status |
| --- | --- |
| Category tree (cameras, lenses, video production, lighting, audio, tripods & stabilizers, microphones, bags & cases, memory cards, accessories, darkroom, film, offers) | ✅ |
| Real product list, prices in EGP, stock levels | ⬜ demo data — replace before launch |
| Product photography with usage rights | ⬜ Unsplash placeholders |
| Who maintains stock/prices, and where | ⬜ not decided |
| What "Current Offers" contains, and how it is kept current | ⬜ demo bundles |
| Per-product warranty backing (manufacturer vs local distributor) | ⬜ generic note only |
| Will customer reviews be collected? | ⬜ none shipped (`reviews: []` everywhere) |

## 7. Policies (legal review required)

`content.about` is confirmed. The rest render as **clearly-labelled drafts**
with a visible notice; replace the text and flip `status: 'draft'` →
`'confirmed'`.

| Document | Status |
| --- | --- |
| About | ✅ confirmed |
| FAQ | ⚠️ answers written conservatively from confirmed facts only — have the business approve them |
| Shipping & delivery info | ⬜ draft |
| Returns & exchange policy (window, conditions, who pays) | ⬜ draft |
| Warranty policy | ⬜ draft |
| Privacy policy — **must** be lawyer-reviewed before collecting customer data | ⬜ draft |
| Terms of service — **must** be lawyer-reviewed | ⬜ draft |

## 8. Backend and integration

| Item | Status |
| --- | --- |
| WooCommerce (or other) store + admin access | ⬜ none |
| Backend service holding API credentials (never in `VITE_*`) | ⬜ not built |
| `WooCommerceProvider` implementing `CommerceProvider` | ⬜ contract documented only |
| Where orders land, and who is notified | ⬜ orders currently live in the browser session only |

## 9. Operations and messaging

| Item | Status |
| --- | --- |
| Order confirmation email / SMS / WhatsApp copy (AR + EN) | ⬜ not written |
| Who monitors orders, and the response-time commitment | ⬜ not defined |
| Out-of-stock / partial-fulfilment handling | ⬜ not defined |
| Complaint escalation path | ⬜ not defined |

## 10. Analytics, consent, security

| Item | Status |
| --- | --- |
| Analytics tool and what may lawfully be tracked | ⬜ none installed |
| Cookie/consent banner requirement decision | ⬜ not decided |
| Content-Security-Policy headers at the hosting layer | ⬜ documented, not deployed |
| HTTPS + HSTS | ⬜ hosting-dependent |
| No secret in any `VITE_*` variable | ✅ enforced by review + docs |

---

## Launch gate

Do not launch while any of these is still true:

- [ ] `tax.vatApplied` is false (tax status unknown)
- [ ] `shipping.standardFee` is unset or `shipping.zones` is empty
- [ ] `shipping.etaConfirmed` is false
- [ ] any offered payment method has `confirmed: false`
- [ ] `content.privacyPolicy` or `content.termsOfService` is `status: 'draft'`
- [ ] `commerce.provider` is still `'mock'` (demo catalog, browser-only orders)
- [ ] the support email or either branch address is still `needs-confirmation`
- [ ] product prices, stock or images are still placeholders
- [ ] `legalName` still holds the trading name rather than the registered name
