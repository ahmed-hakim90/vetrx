import { describe, it, expect } from 'vitest';
import { translations } from './translations';

describe('translations', () => {
  it('has exactly the same keys in every locale', () => {
    const en = Object.keys(translations.en).sort();
    const ar = Object.keys(translations.ar).sort();
    expect(ar).toEqual(en);
  });

  it('has no empty strings', () => {
    for (const [locale, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value, `${locale}.${key}`).toBeTruthy();
      }
    }
  });

  // The shared dictionary is used by every client, so it must not hardcode
  // one market's currency, cities, fees or payment providers — those belong
  // in each client's own config (see ClientConfig.currencies / paymentMethods
  // / shipping) so a build never carries another market's terminology.
  it('carries no market-specific currency, city or provider names', () => {
    const marketTerms = [
      'AED',
      'SAR',
      'EGP',
      'GCC',
      'Mada',
      'Tabby',
      'Tamara',
      'Dubai',
      'Riyadh',
      'Abu Dhabi',
      'Jeddah',
      'درهم',
      'ريال',
      'دبي',
      'الرياض',
      'الخليج',
      'تابي',
      'مدى',
    ];
    const serialized = JSON.stringify(translations);
    for (const term of marketTerms) {
      expect(serialized, `shared translations must not mention "${term}"`).not.toContain(term);
    }
  });
});
