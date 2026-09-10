import { z } from 'zod';

// A string translated for every UI locale we ship (currently en/ar).
const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

const themeSchema = z.object({
  colorPrimary: z.string().min(1),
  colorPrimaryHover: z.string().min(1),
  colorPrimaryForeground: z.string().min(1),
  colorSecondary: z.string().min(1),
  colorAccent: z.string().min(1),
  colorBackground: z.string().min(1),
  colorSurface: z.string().min(1),
  colorText: z.string().min(1),
  colorMuted: z.string().min(1),
  colorBorder: z.string().min(1),
  // Optional: not every existing client sets these, and no shared component
  // currently reads them — they're injected as CSS variables for future use
  // (e.g. form/status feedback) without requiring every client to define them.
  colorSuccess: z.string().min(1).optional(),
  colorError: z.string().min(1).optional(),
  radiusCard: z.string().min(1),
  radiusButton: z.string().min(1),
  fontSans: z.string().min(1),
  fontHeading: z.string().min(1),
});

// Support contact details are optional: a client that hasn't confirmed a
// real support phone/email yet should omit them rather than have one
// invented. Components that display these must guard for absence and hide
// the corresponding UI, never fabricate a placeholder that looks real.
const contactSchema = z.object({
  supportPhone: z.string().min(1).optional(),
  supportPhoneDisplay: z.string().min(1).optional(),
  // Additional confirmed numbers (second landline, mobile, ...). Each needs a
  // display form because local formatting ("02 2390 1870") is not derivable
  // from the E.164 form.
  additionalPhones: z
    .array(
      z.object({
        tel: z.string().min(1),
        display: z.string().min(1),
        label: localizedStringSchema.optional(),
      })
    )
    .default([]),
  supportEmail: z.string().email().optional(),
  // 'confirmed' = verified as monitored. 'needs-confirmation' = on record but
  // not re-verified with the owner; it is still shown (it is the business's
  // own address) but the launch checklist keeps it flagged.
  supportEmailStatus: z.enum(['confirmed', 'needs-confirmation']).default('confirmed'),
  whatsapp: z.string().optional(),
});

const addressSchema = z.object({
  label: localizedStringSchema,
  line: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  // Optional id of the governorate/region this branch sits in (see
  // src/data/egyptGovernorates.ts for Egypt).
  regionId: z.string().min(1).optional(),
  phones: z
    .array(
      z.object({
        tel: z.string().min(1),
        display: z.string().min(1),
      })
    )
    .default([]),
  // A branch that the owner has not re-confirmed is never used to promise a
  // service (in-store pickup is gated on `shipping.pickupEnabled`, not on
  // this list being non-empty).
  status: z.enum(['confirmed', 'needs-confirmation']).default('confirmed'),
});

const socialLinksSchema = z.object({
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  youtube: z.string().url().optional(),
});

const shippingZoneSchema = z.object({
  id: z.string().min(1),
  label: localizedStringSchema,
  cities: z.array(z.string().min(1)),
});

const shippingSettingsSchema = z.object({
  // All fees are optional: a client whose courier rates are not agreed yet
  // must be able to say "not published" instead of shipping an invented
  // number. When `standardFee` is undefined the provider refuses to quote a
  // fee at all and the UI shows that, rather than "FREE".
  freeShippingThreshold: z.number().nonnegative().optional(),
  standardFee: z.number().nonnegative().optional(),
  expressFee: z.number().nonnegative().optional(),
  sameDayFee: z.number().nonnegative().optional(),
  // May be empty while the served governorates/cities are still being
  // confirmed.
  zones: z.array(shippingZoneSchema).default([]),
  // In-store pickup is offered only when this is explicitly true AND at
  // least one address is on record — having branches does not by itself mean
  // the business accepts pickup orders.
  pickupEnabled: z.boolean().default(false),
  returnShippingPaidBy: z.enum(['customer', 'store']).optional(),
  courierName: z.string().min(1).optional(),
  // Whether this client has a confirmed, real delivery-time commitment.
  // When false, checkout/order-confirmation show a generic "ETA appears
  // after you pick an address" message instead of a specific promise
  // ("tomorrow by 2pm") that hasn't actually been confirmed with a carrier.
  etaConfirmed: z.boolean().default(true),
});

const taxSettingsSchema = z.object({
  // The country's statutory rate, for reference/display only.
  vatPercent: z.number().min(0).max(100),
  vatLabel: localizedStringSchema,
  // Whether this business is actually VAT-registered and charges VAT. Until
  // that is confirmed, no VAT line is added to any total — charging (or
  // even displaying) a tax the business may not collect would be inventing a
  // tax status.
  vatApplied: z.boolean().default(false),
  // Only meaningful when vatApplied is true.
  pricesIncludeTax: z.boolean().default(false),
  electronicInvoiceApplicable: z.boolean().optional(),
});

const paymentMethodSchema = z.object({
  id: z.enum(['card', 'apple_pay', 'cod', 'tabby', 'tamara']),
  enabled: z.boolean(),
  // Whether the business has confirmed it currently accepts this method.
  // `enabled` only controls whether the method is offered by the running
  // storefront (useful while in Demo Mode); `confirmed: false` keeps it on
  // the launch checklist and blocks production-readiness.
  confirmed: z.boolean().default(true),
  // Display name/description for methods whose branding belongs to a
  // specific provider (e.g. a buy-now-pay-later partner). Declared here, per
  // client, so no provider's brand name lives in shared UI code or in the
  // shared translation dictionary — a client that doesn't offer that method
  // never ships its name at all.
  label: localizedStringSchema.optional(),
  description: localizedStringSchema.optional(),
});

// A currency this client actually prices in. `rate` is the multiplier from
// the price numbers stored in this client's own catalog into this currency:
// always 1 for the currency the catalog is authored in, and only anything
// else for a genuinely multi-currency client with a real, maintained rate.
const currencySchema = z.object({
  code: z.string().min(1),
  symbol: localizedStringSchema,
  rate: z.number().positive(),
});

const navigationCategorySchema = z.object({
  id: z.string().min(1),
  label: localizedStringSchema,
  icon: z.string().min(1),
});

const homeContentSchema = z.object({
  announcementBar: localizedStringSchema.optional(),
  heroBadge: localizedStringSchema,
  heroTitle: localizedStringSchema,
  heroSubtitle: localizedStringSchema,
  heroImage: z.string().min(1),
  heroImageAlt: localizedStringSchema,
  heroPrimaryCtaCategorySlug: z.string().min(1),
  // The secondary CTA points at either one product or one category — exactly
  // one of these must be set (checked below).
  heroSecondaryCtaProductSlug: z.string().min(1).optional(),
  heroSecondaryCtaCategorySlug: z.string().min(1).optional(),
  // Optional per-client override for the two hero CTA button labels. When
  // omitted, the shared generic UI translation (heroCtaPrimary/
  // heroCtaSecondary) is used, exactly as before this field existed.
  heroPrimaryCtaLabel: localizedStringSchema.optional(),
  heroSecondaryCtaLabel: localizedStringSchema.optional(),
  heroStats: z
    .array(
      z.object({
        value: localizedStringSchema,
        label: localizedStringSchema,
      })
    )
    .length(3),
  bentoBanners: z
    .array(
      z.object({
        badge: localizedStringSchema,
        title: localizedStringSchema,
        description: localizedStringSchema,
        ctaLabel: localizedStringSchema,
        categorySlug: z.string().min(1),
        image: z.string().min(1),
      })
    )
    .min(0),
});

// Return/warranty policy text is optional: a client without confirmed real
// policy terms yet should omit them so the UI hides the section, rather than
// display an invented warranty/return promise.
const policiesSchema = z.object({
  returnPolicy: localizedStringSchema.optional(),
  returnWindowDays: z.number().int().positive().optional(),
  warrantyPolicy: localizedStringSchema.optional(),
  privacyPolicyUrl: z.string().optional(),
  termsUrl: z.string().optional(),
});

// A long-form info-page document (About, FAQ body copy, Privacy Policy...).
// `status: 'draft'` means this is placeholder copy that must be reviewed
// (legal, in the case of privacy/terms) before a real launch — the page
// still renders so the route/layout can be reviewed, but is marked and
// surfaced by the production-readiness check.
const legalDocSchema = z.object({
  body: localizedStringSchema,
  status: z.enum(['draft', 'confirmed']),
});

const faqItemSchema = z.object({
  question: localizedStringSchema,
  answer: localizedStringSchema,
});

// All optional: an info page for a document a client hasn't provided is
// simply not linked from Header/Footer, rather than rendering fabricated
// legal or business copy.
const contentSchema = z.object({
  about: legalDocSchema.optional(),
  faq: z.array(faqItemSchema).default([]),
  shippingInfo: legalDocSchema.optional(),
  returnsInfo: legalDocSchema.optional(),
  warrantyInfo: legalDocSchema.optional(),
  privacyPolicy: legalDocSchema.optional(),
  termsOfService: legalDocSchema.optional(),
});

const seoDefaultsSchema = z.object({
  siteUrl: z.string().url(),
  titleSuffix: localizedStringSchema,
  defaultDescription: localizedStringSchema,
  ogImage: z.string().min(1),
  organizationLogo: z.string().min(1),
});

const featureFlagsSchema = z.object({
  wishlistEnabled: z.boolean().default(true),
  quickViewEnabled: z.boolean().default(true),
  couponsEnabled: z.boolean().default(true),
  reviewsEnabled: z.boolean().default(true),
  // Off by default for a new client until a real courier partner and
  // express commitment are confirmed; the other example clients set this
  // explicitly to keep their current behavior.
  expressDeliveryEnabled: z.boolean().default(false),
});

const commerceIntegrationSchema = z.object({
  provider: z.enum(['mock', 'woocommerce', 'rest']),
  // Only the *names* of environment variables that hold connection details —
  // never the secret values themselves. Resolved at runtime by the provider.
  envVarNames: z
    .object({
      baseUrl: z.string().min(1).optional(),
      consumerKeyVar: z.string().min(1).optional(),
      consumerSecretVar: z.string().min(1).optional(),
    })
    .optional(),
});

export const clientConfigSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  legalName: z.string().min(1),
  displayName: localizedStringSchema,
  tagline: localizedStringSchema,
  logo: z.string().min(1),
  favicon: z.string().min(1),
  theme: themeSchema,
  contact: contactSchema,
  // A client with no confirmed physical address yet ships with an empty
  // list rather than an invented one — nothing currently renders it, but it
  // must never be fabricated if something starts reading it later.
  addresses: z.array(addressSchema).default([]),
  socialLinks: socialLinksSchema,
  supportedLocales: z.array(z.enum(['en', 'ar'])).min(1),
  defaultLocale: z.enum(['en', 'ar']),
  // Each client declares only the currencies it actually prices in, so one
  // client's build never carries another market's currency codes.
  currencies: z.array(currencySchema).min(1),
  defaultCurrency: z.string().min(1),
  countriesServed: z.array(z.string().min(1)).min(1),
  // IANA timezone, e.g. 'Africa/Cairo'. Optional — only used for
  // display/formatting decisions that need a client-local "now".
  timezone: z.string().min(1).optional(),
  // Drives which checkout address form CheckoutScreen renders (shared
  // component, not duplicated per client): 'gulf' keeps today's
  // country/city/street form; 'egypt' switches to governorate + Egyptian
  // mobile number validation. Defaults to 'gulf' so the three existing
  // clients are unaffected.
  market: z.enum(['gulf', 'egypt']).default('gulf'),
  tax: taxSettingsSchema,
  shipping: shippingSettingsSchema,
  paymentMethods: z.array(paymentMethodSchema).min(1),
  policies: policiesSchema,
  content: contentSchema.default({ faq: [] }),
  seo: seoDefaultsSchema,
  home: homeContentSchema,
  navigationCategories: z.array(navigationCategorySchema).min(1),
  featureFlags: featureFlagsSchema,
  commerce: commerceIntegrationSchema,
  demoCouponCodes: z
    .array(
      z.object({
        code: z.string().min(1),
        discountPercent: z.number().min(0).max(100),
      })
    )
    .default([]),
  orderNumberPrefix: z.string().min(1),
}).superRefine((config, ctx) => {
  const secondaryCtaTargets = [
    config.home.heroSecondaryCtaProductSlug,
    config.home.heroSecondaryCtaCategorySlug,
  ].filter(Boolean);
  if (secondaryCtaTargets.length !== 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['home', 'heroSecondaryCtaProductSlug'],
      message: 'set exactly one of heroSecondaryCtaProductSlug / heroSecondaryCtaCategorySlug',
    });
  }
  if (config.shipping.pickupEnabled && config.addresses.length === 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['shipping', 'pickupEnabled'],
      message: 'cannot offer in-store pickup with no address on record',
    });
  }
  if (!config.currencies.some((c) => c.code === config.defaultCurrency)) {
    ctx.addIssue({
      code: 'custom',
      path: ['defaultCurrency'],
      message: `must be one of this client's own currencies (${config.currencies.map((c) => c.code).join(', ')})`,
    });
  }
  if (!config.supportedLocales.includes(config.defaultLocale)) {
    ctx.addIssue({
      code: 'custom',
      path: ['defaultLocale'],
      message: `must be one of supportedLocales (${config.supportedLocales.join(', ')})`,
    });
  }
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type LocalizedString = z.infer<typeof localizedStringSchema>;

export function parseClientConfig(raw: unknown, sourceLabel: string): ClientConfig {
  const result = clientConfigSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Invalid client configuration in "${sourceLabel}":\n${issues}\n\n` +
        `Fix the config file before building or running the storefront.`
    );
  }
  return result.data;
}
