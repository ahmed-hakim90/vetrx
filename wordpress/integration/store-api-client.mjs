/** Standalone browser client. All amounts remain WooCommerce minor-unit strings. */
export class StoreApiClient {
  constructor(wordpressUrl, fetchImpl = globalThis.fetch) {
    this.wordpressUrl = wordpressUrl.replace(/\/$/, '');
    this.fetch = fetchImpl;
    this.token = null;
    this.api = null;
    this.pending = Promise.resolve();
  }

  async connect() {
    const response = await this.fetch(`${this.wordpressUrl}/wp-json/wlcb/v1/config`, { credentials: 'omit' });
    if (!response.ok) throw new Error(`Bridge unavailable (${response.status})`);
    const config = await response.json();
    const api = new URL(config.api.store_api);
    if (api.origin !== new URL(this.wordpressUrl).origin) throw new Error('Unexpected Store API origin');
    this.api = api.href.replace(/\/$/, '');
    return config;
  }

  async request(path, method = 'GET', body) {
    if (!this.api) throw new Error('Call connect() first');
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Cart-Token'] = this.token;
    const response = await this.fetch(`${this.api}/${path}`, {
      method, headers, credentials: 'omit', cache: 'no-store',
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const token = response.headers.get('Cart-Token');
    if (token) this.token = token;
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || `Store API error (${response.status})`);
      error.code = data.code;
      error.status = response.status;
      throw error;
    }
    return data;
  }

  // Serialize writes: a response must update the token/cart before the next write.
  mutate(path, body) {
    const operation = this.pending.then(async () => {
      if (!this.token) await this.cart();
      if (!this.token) throw new Error('Missing Cart-Token: check exposed CORS headers');
      return this.request(path, 'POST', body);
    });
    this.pending = operation.catch(() => {});
    return operation;
  }

  products(params = {}) { return this.request(`products?${new URLSearchParams(params)}`); }
  categories(params = {}) { return this.request(`products/categories?${new URLSearchParams(params)}`); }
  cart() { return this.request('cart'); }
  addItem(id, quantity = 1, variation = []) { return this.mutate('cart/add-item', { id, quantity, variation }); }
  updateItem(key, quantity) { return this.mutate('cart/update-item', { key, quantity }); }
  removeItem(key) { return this.mutate('cart/remove-item', { key }); }
  applyCoupon(code) { return this.mutate('cart/apply-coupon', { code }); }
  removeCoupon(code) { return this.mutate('cart/remove-coupon', { code }); }
  updateCustomer(billing_address, shipping_address) { return this.mutate('cart/update-customer', { billing_address, shipping_address }); }
  selectShipping(package_id, rate_id) { return this.mutate('cart/select-shipping-rate', { package_id, rate_id }); }
  checkout(data) {
    // Never retry checkout automatically after timeouts: reconcile the order first.
    return this.mutate('checkout', data);
  }
}
