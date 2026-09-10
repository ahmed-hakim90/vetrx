# Vetrx — Shared project rules

## Working agreement

- Reply concisely in Egyptian Arabic unless requested otherwise. Keep code and identifiers in English.
- Inspect before proposing or changing. A review or diagnosis does not authorize implementation; implementation does not authorize production deployment.
- Prefer the smallest complete root-cause fix. Reuse existing engines, components, contracts, and dependencies; do not introduce a parallel system merely because the existing integration is unfinished.
- Do not invent business facts or claim completion from screenshots, file names, comments, or a previous agent's report. Distinguish implemented, wired, locally tested, staging-tested, and production-verified.
- Ask a focused question only when missing information changes business meaning, scope, security, or an irreversible action. Otherwise proceed with safe, stated assumptions.

## Before editing

1. Read relevant instructions, implementation, consumers, tests, and documentation. Check `git status` and the relevant diff.
2. Search with `rg` for all affected owners, imports, configuration keys, routes, and data contracts. Identify the canonical source before adding anything.
3. Preserve uncommitted and concurrent work. Re-read a file immediately before editing if another agent may be changing it. If edits overlap materially, coordinate with the owner rather than overwrite them.
4. Trace the actual user journey and integration boundary. A new provider file is not an integration until its consumers use it.
5. Search narrowly; avoid dumping entire repositories, dependencies, logs, archives, or secrets. Keep plans and progress proportional to the task.

## Product invariants

- This is ONE reusable storefront foundation with separate client configurations, not a Shams-only app and not a customer-facing store switcher.
- Preserve Voltix, Apex, Lumina, and Shams. Shams is the fourth client, not a replacement or a reason to rename shared code.
- `VITE_STORE_ID` selects one client at build time. Invalid or missing identity must fail clearly. Do not introduce silent fallback or runtime URL/UI identity switching.
- Client branding, content, URLs, locale defaults, provider settings, and capabilities belong in validated client configuration, not conditionals scattered through shared components.
- Shams defaults to English, supports Arabic/RTL, and uses EGP. Do not impose Shams-specific language, geography, policies, or currency on other clients.
- Isolate client catalog data, storage keys, caches, and assets. Test isolation after shared changes.
- Unsupported capabilities must have an honest unavailable/hidden state; never fill them with another client's data or undisclosed demo content.

## Architecture and ownership

- Extend the existing config schema, catalog/commerce contracts, and provider selection. Shared UI consumes normalized contracts, not WordPress-specific metadata or direct imports of mock providers.
- Keep backend-specific translation in adapters. Reuse Shams engines through a Shams adapter where appropriate; do not copy Shams plugin UI, hardcoded identifiers, or business rules into the shared foundation.
- The separate Shams Stores repository is reference material unless explicitly placed in change scope. Its local files do not prove a plugin is installed or active remotely.
- Keep one owner for navigation, cart, checkout, catalog querying, themes, and feature capabilities. Avoid duplicate drawers, event handlers, providers, and competing state stores.
- Every advertised environment variable must have a real code consumer, validation, documentation, and a test where practical. Do not tell the owner to add speculative variables.
- Do not silently downgrade dependencies, weaken compiler/lint rules, disable tests, add broad `any`, or suppress errors to produce a green result. Explain and seek approval for material toolchain changes.

## Live commerce and payment safety

- Demo and live modes must be explicit. Never silently fall back to mock products, successful orders, prices, or payment results when live requests fail.
- WooCommerce/server cart is authoritative for price, stock, variations, coupons, shipping, tax, add-on charges, and order totals. Client calculations are display estimates only.
- Validate selected add-ons and accessory product/variation IDs server-side. A curated recommendation is not automatically a bundle with inventory or discounts.
- Verify installed plugin APIs and official documentation before assuming endpoint availability or Headless compatibility. Do not invent a Paymob plans API or infer payment support from a visual checkout enhancement.
- Keep WooCommerce consumer secrets, Paymob secret keys, webhook secrets, and privileged credentials server-side. `VITE_*` values are public browser configuration, even when hidden in a dashboard.
- Scope cross-origin access to approved exact origins. Preserve the supported cart-session mechanism; protect privileged writes with appropriate authentication, authorization, and CSRF controls.
- Payment success requires authoritative backend verification, not a redirect query or client state. Verify webhook authenticity and handle replay/idempotency. Do not blindly retry order/payment creation after ambiguous failures.
- A frontend `sandbox` flag cannot guarantee the backend gateway is in test mode. Verify both sides before authorized payment testing.
- Never place real orders, charge/refund payments, change stock, activate plugins, migrate remote data, or alter production settings without explicit target-specific authorization.

## UI and feature completeness

- Preserve existing design tokens and semantic theme utilities. No broad redesign or one-off styling for unrelated screens.
- Cover loading, empty, error, unavailable, stale, guest/authenticated, and success states at the changed boundary.
- Navigation, menus, drawers, filters, and dialogs must support keyboard, visible focus, Escape, sensible focus restoration, touch, and screen-reader semantics. Verify mobile and desktop plus English/LTR and Arabic/RTL.
- Catalog filtering, facet counts, pagination, and sorting must reflect the full backend result set, not just the loaded page. Preserve shareable query state where supported.
- Verify direct route loading and refresh as well as in-app navigation. Do not treat a rewrite alone as proof that routing works.
- Do not fabricate reviews, compatibility, installment rates, fees, warranties, delivery promises, branch stock, or legal text. Use approved data or mark it unavailable.

## Verification and handoff

- Run focused regression checks first. For shared runtime changes, run `npm run typecheck`, `npm run lint`, and `npm test`; build affected clients, and all four clients when shared config/theme/provider/build logic changes.
- Use the existing `verify:shams` and `verify:voltix` checks when relevant to build isolation. Read scripts before relying on what they verify.
- UI changes require rendered browser verification of affected journeys and viewport/direction states, including console and failed network requests. Compilation is not visual QA.
- Integration changes require checking real request/response contracts in an authorized environment, including errors and session continuity. If access is missing, report live verification as blocked rather than complete.
- For WordPress changes, run relevant Node tests and PHP lint when available. Edit canonical source, not release ZIPs; regenerate and inspect a versioned artifact only when release packaging is in scope.
- Compare failures against the pre-change baseline where practical. Do not fix unrelated problems without need, or describe existing failures as passing.
- Review the final diff for accidental changes, leaked secrets, dead code, mock dependencies in live paths, and documentation drift.
- Final handoff: what changed, checks actually run and their results, and remaining blockers. Never label the whole store production-ready based solely on build success or a narrow test.
- Documentation-only changes need targeted content/diff checks, not unnecessary full builds.

## Repository and production safety

- Do not reset, discard, delete, or overwrite owner work. Avoid destructive cleanup and generated-file edits.
- Do not commit, push, deploy, install/activate remote plugins, publish, or change Vercel/WordPress settings unless explicitly authorized.
- Before an authorized material remote change, establish the exact environment, backup/rollback path, and baseline. Keep staging and production evidence separate.
- Update these rules only when the owner requests it; do not weaken them to make an implementation easier.
