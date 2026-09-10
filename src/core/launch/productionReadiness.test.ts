import { describe, it, expect } from 'vitest';
import { getProductionReadinessIssues } from './productionReadiness';
import { clientRegistry } from '../../config/clients/registry';
import { ClientConfig } from '../../config/clients/schema';

const shams = clientRegistry.shams;

describe('getProductionReadinessIssues', () => {
  it('blocks Shams on everything the business has not confirmed yet', () => {
    const issues = getProductionReadinessIssues(shams);

    // Contact / branches are on record but unverified.
    expect(issues.some((i) => i.includes('supportEmail') && i.includes('re-confirmed'))).toBe(true);
    expect(issues.some((i) => i.includes('Downtown Branch'))).toBe(true);
    expect(issues.some((i) => i.includes('Heliopolis Branch'))).toBe(true);

    // Delivery terms.
    expect(issues.some((i) => i.includes('standard shipping fee'))).toBe(true);
    expect(issues.some((i) => i.includes('delivery zones'))).toBe(true);
    expect(issues.some((i) => i.includes('delivery-time commitment'))).toBe(true);

    // Tax status and payment acceptance.
    expect(issues.some((i) => i.includes('vatApplied'))).toBe(true);
    expect(issues.some((i) => i.includes('"cod"') && i.includes('not confirmed'))).toBe(true);

    // Legal documents and backend.
    expect(issues.some((i) => i.includes('privacyPolicy') && i.includes('draft'))).toBe(true);
    expect(issues.some((i) => i.includes('termsOfService') && i.includes('draft'))).toBe(true);
    expect(issues.some((i) => i.includes('mock'))).toBe(true);
  });

  it('does not flag the About page, which the business has confirmed', () => {
    const issues = getProductionReadinessIssues(shams);
    expect(issues.some((i) => i.includes('content.about'))).toBe(false);
  });

  it('still flags mandatory legal pages that are missing entirely', () => {
    const noContent: ClientConfig = {
      ...shams,
      content: { ...shams.content, privacyPolicy: undefined, termsOfService: undefined },
    };
    const issues = getProductionReadinessIssues(noContent);

    expect(issues).toContain('content.privacyPolicy is not set at all.');
    expect(issues).toContain('content.termsOfService is not set at all.');
  });

  it('reports nothing once every launch requirement is genuinely satisfied', () => {
    const ready: ClientConfig = {
      ...shams,
      contact: {
        supportPhone: '+20223901870',
        supportPhoneDisplay: '02 2390 1870',
        additionalPhones: [],
        supportEmail: 'info@example.com',
        supportEmailStatus: 'confirmed',
      },
      addresses: [
        {
          label: { en: 'HQ', ar: 'المقر' },
          line: '1 Example Street',
          city: 'Cairo',
          country: 'Egypt',
          phones: [],
          status: 'confirmed',
        },
      ],
      shipping: {
        ...shams.shipping,
        standardFee: 60,
        zones: [{ id: 'cairo', label: { en: 'Cairo', ar: 'القاهرة' }, cities: ['Cairo'] }],
        etaConfirmed: true,
      },
      tax: { ...shams.tax, vatApplied: true },
      paymentMethods: [{ id: 'cod', enabled: true, confirmed: true }],
      policies: {
        ...shams.policies,
        returnPolicy: { en: 'Returns within 14 days', ar: 'الاسترجاع خلال 14 يوم' },
        warrantyPolicy: { en: 'Manufacturer warranty', ar: 'ضمان الشركة المصنعة' },
      },
      content: {
        ...shams.content,
        privacyPolicy: { status: 'confirmed', body: { en: 'Reviewed policy', ar: 'سياسة معتمدة' } },
        termsOfService: { status: 'confirmed', body: { en: 'Reviewed terms', ar: 'شروط معتمدة' } },
      },
      commerce: { provider: 'woocommerce' },
    };

    expect(getProductionReadinessIssues(ready)).toEqual([]);
  });
});
