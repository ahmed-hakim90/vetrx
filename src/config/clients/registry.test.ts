import { describe, it, expect } from 'vitest';
import { clientRegistry, availableClientIds } from './registry';

describe('client registry', () => {
  it('has all four example clients registered', () => {
    expect(availableClientIds).toEqual(expect.arrayContaining(['voltix', 'apex', 'lumina', 'shams']));
  });

  it('keys the registry by each client config\'s own id', () => {
    for (const [key, config] of Object.entries(clientRegistry)) {
      expect(config.id).toBe(key);
    }
  });

  it('gives every registered client at least one enabled payment method', () => {
    for (const config of Object.values(clientRegistry)) {
      expect(config.paymentMethods.some((p) => p.enabled)).toBe(true);
    }
  });
});

describe('cross-client content isolation', () => {
  const ids = Object.keys(clientRegistry);

  it('never mentions another client\'s display name in its own config content', () => {
    for (const ownId of ids) {
      const own = clientRegistry[ownId];
      const ownText = JSON.stringify(own);
      for (const otherId of ids) {
        if (otherId === ownId) continue;
        const other = clientRegistry[otherId];
        expect(ownText).not.toContain(other.displayName.en);
        expect(ownText).not.toContain(other.legalName);
      }
    }
  });
});
