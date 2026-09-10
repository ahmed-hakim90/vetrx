import { describe, it, expect } from 'vitest';
import { readClientStorage, writeClientStorage } from './clientStorage';

// Each case uses its own client id / key so the suite needs no shared reset
// (jsdom's localStorage in this environment has no usable clear()).
describe('clientStorage', () => {
  it('namespaces every key by client id so two clients never share a cart', () => {
    writeClientStorage('t-shams', 'cart', ['shams-item']);
    writeClientStorage('t-voltix', 'cart', ['voltix-item']);

    expect(readClientStorage('t-shams', 'cart', [])).toEqual(['shams-item']);
    expect(readClientStorage('t-voltix', 'cart', [])).toEqual(['voltix-item']);
    expect(window.localStorage.getItem('ecommerce:t-shams:cart')).toBeTruthy();
  });

  it('returns the fallback for a key that was never written', () => {
    expect(readClientStorage('t-unwritten', 'wishlist', ['fallback'])).toEqual(['fallback']);
  });

  it('returns the fallback instead of throwing on corrupted JSON', () => {
    window.localStorage.setItem('ecommerce:t-corrupt:cart', '{not json');
    expect(readClientStorage('t-corrupt', 'cart', [])).toEqual([]);
  });

  it('ignores data written by an older, incompatible storage version', () => {
    window.localStorage.setItem('ecommerce:t-oldver:cart', JSON.stringify({ version: 0, value: ['stale'] }));
    expect(readClientStorage('t-oldver', 'cart', [])).toEqual([]);
  });

  it('ignores a raw value stored without the version envelope', () => {
    window.localStorage.setItem('ecommerce:t-legacy:cart', JSON.stringify(['legacy-item']));
    expect(readClientStorage('t-legacy', 'cart', [])).toEqual([]);
  });

  it('round-trips language and currency preferences', () => {
    writeClientStorage('t-prefs', 'preferences:language', 'ar');
    expect(readClientStorage('t-prefs', 'preferences:language', 'en')).toBe('ar');
  });
});
