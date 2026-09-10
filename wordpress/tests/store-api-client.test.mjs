import test from 'node:test';
import assert from 'node:assert/strict';
import { StoreApiClient } from '../integration/store-api-client.mjs';

const response = (data, token, status = 200) => new Response(JSON.stringify(data), { status, headers: token ? { 'Cart-Token': token } : {} });

test('obtains and rotates cart tokens; never sends browser cookies or prices on add', async () => {
  const calls = [];
  const replies = [response({ api: { store_api: 'https://store.test/wp-json/wc/store/v1/' } }), response({}, 'first'), response({}, 'second'), response({})];
  const client = new StoreApiClient('https://store.test', async (url, options) => { calls.push({ url, options }); return replies.shift(); });
  await client.connect();
  await client.addItem(7, 2);
  await client.updateItem('key', 3);
  assert.equal(calls[2].options.headers['Cart-Token'], 'first');
  assert.equal(calls[3].options.headers['Cart-Token'], 'second');
  assert.deepEqual(JSON.parse(calls[2].options.body), { id: 7, quantity: 2, variation: [] });
  assert.ok(calls.every(call => call.options.credentials === 'omit'));
});

test('fails closed if CORS hides token; does not post checkout', async () => {
  let posts = 0;
  const client = new StoreApiClient('https://store.test', async (url, options) => {
    if (options.method === 'POST') posts++;
    return response(url.endsWith('/config') ? { api: { store_api: 'https://store.test/wp-json/wc/store/v1/' } } : {});
  });
  await client.connect();
  await assert.rejects(client.checkout({ payment_method: 'cod' }), /Missing Cart-Token/);
  assert.equal(posts, 0);
});

test('rejects foreign discovery origin', async () => {
  const client = new StoreApiClient('https://store.test', async () => response({ api: { store_api: 'https://other.test/' } }));
  await assert.rejects(client.connect(), /Unexpected Store API origin/);
});

test('surfaces validation errors without automatic retry', async () => {
  let posts = 0;
  const client = new StoreApiClient('https://store.test', async (url, options) => {
    if (url.endsWith('/config')) return response({ api: { store_api: 'https://store.test/wp-json/wc/store/v1/' } });
    if (options.method === 'POST') { posts++; return response({ code: 'invalid_coupon', message: 'Invalid coupon' }, null, 400); }
    return response({}, 'token');
  });
  await client.connect();
  await assert.rejects(client.applyCoupon('bad'), error => error.code === 'invalid_coupon' && error.status === 400);
  assert.equal(posts, 1);
});
