import { ClientConfig } from './schema';

export const luminaConfig: ClientConfig = {
  id: 'lumina',
  slug: 'lumina',
  legalName: 'Lumina Smart Living LLC',
  displayName: { en: 'Lumina Smart Living', ar: 'لومينا للحياة الذكية' },
  tagline: {
    en: 'Modern connected home automation & acoustics',
    ar: 'أحدث حلول أتمتة المنازل الذكية والأنظمة الصوتية',
  },
  logo: '/assets/clients/lumina/logo.svg',
  favicon: '/assets/clients/lumina/logo.svg',
  theme: {
    colorPrimary: '#059669',
    colorPrimaryHover: '#047857',
    colorPrimaryForeground: '#FFFFFF',
    colorSecondary: '#064E3B',
    colorAccent: '#F59E0B',
    colorBackground: '#F8FAFC',
    colorSurface: '#FFFFFF',
    colorText: '#0F172A',
    colorMuted: '#64748B',
    colorBorder: '#E2E8F0',
    radiusCard: '1.25rem',
    radiusButton: '0.75rem',
    fontSans: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  contact: {
    supportPhone: '+97142255010',
    supportPhoneDisplay: '800-LUMINA (586462)',
    supportEmail: 'care@lumina-smart.example',
    supportEmailStatus: 'confirmed',
    additionalPhones: [],
  },
  addresses: [
    {
      label: { en: 'Lumina Experience Center', ar: 'مركز تجربة لومينا' },
      line: 'Al Wasl Road, Villa 12',
      city: 'Dubai',
      country: 'United Arab Emirates',
      phones: [],
      status: 'confirmed',
    },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/LuminaSmartLiving',
  },
  supportedLocales: ['en', 'ar'],
  defaultLocale: 'en',
  currencies: [
    { code: 'AED', symbol: { en: 'AED', ar: 'د.إ' }, rate: 1.0 },
    { code: 'SAR', symbol: { en: 'SAR', ar: 'ر.س' }, rate: 1.02 },
  ],
  defaultCurrency: 'AED',
  countriesServed: ['United Arab Emirates', 'Saudi Arabia'],
  market: 'gulf',
  tax: {
    vatPercent: 5,
    vatLabel: { en: 'Estimated VAT (5%)', ar: 'ضريبة القيمة المضافة المقدرة (5%)' },
    vatApplied: true,
    pricesIncludeTax: false,
  },
  shipping: {
    freeShippingThreshold: 250,
    standardFee: 25,
    expressFee: 20,
    etaConfirmed: true,
    pickupEnabled: false,
    zones: [
      {
        id: 'gcc',
        label: { en: 'GCC Home Delivery Zone', ar: 'منطقة التوصيل المنزلي الخليجية' },
        cities: ['Dubai', 'Abu Dhabi', 'Riyadh'],
      },
    ],
  },
  paymentMethods: [
    { id: 'card', enabled: true, confirmed: true },
    { id: 'apple_pay', enabled: true, confirmed: true },
    { id: 'cod', enabled: true, confirmed: true },
  ],
  content: { faq: [] },
  policies: {
    returnPolicy: {
      en: '14-Day Free Returns with home pickup',
      ar: 'سياسة إرجاع مجانية خلال 14 يوماً مع استلام من المنزل',
    },
    returnWindowDays: 14,
    warrantyPolicy: {
      en: '2-Year Official Agency Warranty with Home Service',
      ar: 'ضمان رسمي سنتين مع خدمة الصيانة المنزلية',
    },
  },
  seo: {
    siteUrl: 'https://lumina-smart.example',
    titleSuffix: { en: 'Lumina Smart Living', ar: 'لومينا للحياة الذكية' },
    defaultDescription: {
      en: 'Shop smart home automation, robot vacuums, and connected lighting at Lumina Smart Living.',
      ar: 'تسوق أجهزة أتمتة المنزل الذكي والمكانس الروبوتية والإضاءة الذكية من لومينا.',
    },
    ogImage: '/assets/clients/lumina/photo-placeholder.svg',
    organizationLogo: '/assets/clients/lumina/logo.svg',
  },
  home: {
    announcementBar: {
      en: 'New Season Launch: Free installation on all smart lighting kits',
      ar: 'إطلاق الموسم الجديد: تركيب مجاني لجميع أطقم الإضاءة الذكية',
    },
    heroBadge: { en: 'SMART HOME 2025', ar: 'المنزل الذكي 2025' },
    heroTitle: {
      en: 'Your Home. Effortlessly Intelligent.',
      ar: 'منزلك. ذكاء بلا مجهود.',
    },
    heroSubtitle: {
      en: 'Automated cleaning, adaptive lighting, and connected living — all from one app.',
      ar: 'تنظيف تلقائي وإضاءة متكيفة وحياة متصلة، كل ذلك من تطبيق واحد.',
    },
    heroImage: '/assets/clients/lumina/photo-placeholder.svg',
    heroImageAlt: { en: 'Lumina smart home devices', ar: 'أجهزة لومينا للمنزل الذكي' },
    heroPrimaryCtaCategorySlug: 'all',
    heroSecondaryCtaProductSlug: 'prod-roborock-s8-pro-ultra',
    heroStats: [
      { value: { en: '7 Weeks', ar: '7 أسابيع' }, label: { en: 'Auto-Empty Dust Bin', ar: 'تفريغ ذاتي للغبار' } },
      { value: { en: '16M', ar: '16 مليون' }, label: { en: 'Light Colors', ar: 'لون إضاءة' } },
      { value: { en: 'Zigbee', ar: 'زيجبي' }, label: { en: 'Smart Protocol', ar: 'بروتوكول ذكي' } },
    ],
    bentoBanners: [
      {
        badge: { en: 'Ambient Lighting', ar: 'إضاءة محيطية' },
        title: { en: 'Smart Lighting Starter Kits', ar: 'أطقم الإضاءة الذكية' },
        description: {
          en: 'Sync your lights with music, movies, and mood.',
          ar: 'زامن إضاءتك مع الموسيقى والأفلام والأجواء.',
        },
        ctaLabel: { en: 'Light It Up', ar: 'أضئ منزلك' },
        categorySlug: 'smarthome',
        image: '/assets/clients/lumina/photo-placeholder.svg',
      },
    ],
  },
  navigationCategories: [
    { id: 'smarthome', label: { en: 'Smart Living & IoT', ar: 'المنزل الذكي وإنترنت الأشياء' }, icon: 'Home' },
  ],
  featureFlags: {
    wishlistEnabled: true,
    quickViewEnabled: true,
    couponsEnabled: false,
    reviewsEnabled: true,
    expressDeliveryEnabled: true,
  },
  commerce: {
    provider: 'mock',
  },
  demoCouponCodes: [],
  orderNumberPrefix: 'LUM',
};
