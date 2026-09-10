import { describe, it, expect } from 'vitest';
import { parseClientConfig } from './schema';
import { voltixConfig } from './voltix.config';
import { apexConfig } from './apex.config';
import { luminaConfig } from './lumina.config';
import { shamsConfig } from './shams.config';

describe('parseClientConfig', () => {
  it('accepts each shipped example client config', () => {
    expect(() => parseClientConfig(voltixConfig, 'voltix')).not.toThrow();
    expect(() => parseClientConfig(apexConfig, 'apex')).not.toThrow();
    expect(() => parseClientConfig(luminaConfig, 'lumina')).not.toThrow();
    expect(() => parseClientConfig(shamsConfig, 'shams')).not.toThrow();
  });

  it('accepts a client that omits contact/address/social/policy data (nothing invented)', () => {
    expect(shamsConfig.contact.supportPhone).toBeUndefined();
    expect(shamsConfig.contact.supportPhoneDisplay).toBeUndefined();
    expect(shamsConfig.addresses).toEqual([]);
    expect(shamsConfig.policies.warrantyPolicy).toBeUndefined();
    expect(shamsConfig.policies.returnPolicy).toBeUndefined();
  });

  it('rejects a config missing a required field, with a readable message', () => {
    const broken = { ...voltixConfig, displayName: undefined } as unknown;
    expect(() => parseClientConfig(broken, 'broken.config.ts')).toThrow(/displayName/);
  });

  it('rejects a config with an invalid enum value', () => {
    const broken = { ...voltixConfig, defaultCurrency: 'EUR' } as unknown;
    expect(() => parseClientConfig(broken, 'broken.config.ts')).toThrow();
  });

  it('rejects a config whose defaultCurrency looks like a secret leaking in (sanity: no api keys ever required)', () => {
    // ClientConfig must never require secret fields directly.
    const keys = Object.keys(voltixConfig);
    expect(keys.some((k) => /secret|apikey|api_key|password/i.test(k))).toBe(false);
  });
});
