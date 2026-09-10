=== White Label Commerce Bridge ===
Contributors: storefront-team
Tags: woocommerce, headless, storefront, rest-api
Requires at least: 6.5
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
Requires Plugins: woocommerce

Connect one WooCommerce installation to any branded frontend using the native WooCommerce Store API.

== Installation ==
1. Install and activate WooCommerce on staging first.
2. Upload the plugin ZIP using Plugins > Add New > Upload Plugin.
3. Activate White Label Commerce Bridge.
4. Open WooCommerce > Commerce Bridge as an administrator.
5. Enable the bridge and enter exact HTTPS frontend origins, one per line.
6. Fetch /wp-json/wlcb/v1/config from the frontend.
7. Use the returned Store API URL and Cart-Token for cart and checkout.

== Scope ==
The plugin exposes public store configuration and controls browser origins for wlcb/v1 and wc/store/v1. Catalog, cart, coupons, shipping, stock, order creation and payment handling use WooCommerce's own Store API. It does not implement a second commerce engine or expose the administrative wc/v3 API.

No secrets are configured in the frontend. Cart-Token is a sensitive session bearer token; do not log it or put it in URLs. CORS is not authentication or bot protection.

Gateways must support Store API checkout. This must be tested with each site's installed payment/shipping extensions. No gateway compatibility is implied by activating this plugin. WooCommerce's own order-key authorization remains in force. No unauthenticated order-by-ID endpoint is added.

Disabling the bridge restores WordPress's original REST CORS behavior; it does not disable WooCommerce's native Store API. Existing same-origin WooCommerce pages continue to use their native cookie/nonce sessions. Cross-origin frontend clients should use credentials: omit with Cart-Token.

Exclude cart, checkout and order API routes from CDN caching. Configure HTTPS, checkout rate limiting and payment-provider anti-fraud controls at deployment. The plugin does not claim to provide those controls.

== Uninstall ==
Deleting the plugin deletes only wlcb_settings for the current site. WooCommerce business data is retained. Network activation/uninstall is not supported in this release; install per site.
