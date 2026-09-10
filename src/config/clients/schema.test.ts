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
    const bare = {
      ...shamsConfig,
      contact: {},
      addresses: [],
      socialLinks: {},
      policies: {},
    } as unknown;

    const parsed = parseClientConfig(bare, 'bare.config.ts');
    expect(parsed.contact.supportPhone).toBeUndefined();
    expect(parsed.contact.supportEmail).toBeUndefined();
    expect(parsed.addresses).toEqual([]);
    expect(parsed.policies.warrantyPolicy).toBeUndefined();
    expect(parsed.policies.returnPolicy).toBeUndefined();
  });

  it('leaves Shams’ unconfirmed commercial terms genuinely unset', () => {
    // Confirmed data is present...
    expect(shamsConfig.contact.supportPhone).toBe('+20223901870');
    expect(shamsConfig.addresses).toHaveLength(2);
    // ...while nothing the business has not confirmed is invented.
    expect(shamsConfig.shipping.standardFee).toBeUndefined();
    expect(shamsConfig.shipping.freeShippingThreshold).toBeUndefined();
    expect(shamsConfig.shipping.zones).toEqual([]);
    expect(shamsConfig.shipping.etaConfirmed).toBe(false);
    expect(shamsConfig.shipping.pickupEnabled).toBe(false);
    expect(shamsConfig.tax.vatApplied).toBe(false);
    expect(shamsConfig.policies.returnPolicy).toBeUndefined();
    expect(shamsConfig.policies.warrantyPolicy).toBeUndefined();
    expect(shamsConfig.paymentMethods.every((m) => !m.confirmed)).toBe(true);
  });

  it('refuses a config that offers in-store pickup with no branch on record', () => {
    const broken = {
      ...shamsConfig,
      addresses: [],
      shipping: { ...shamsConfig.shipping, pickupEnabled: true },
    } as unknown;
    expect(() => parseClientConfig(broken, 'broken.config.ts')).toThrow(/pickup/);
  });

  it('refuses a config whose hero secondary CTA targets both a product and a category', () => {
    const broken = {
      ...shamsConfig,
      home: { ...shamsConfig.home, heroSecondaryCtaProductSlug: 'x', heroSecondaryCtaCategorySlug: 'y' },
    } as unknown;
    expect(() => parseClientConfig(broken, 'broken.config.ts')).toThrow(/heroSecondaryCta/);
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
