import { ClientConfig } from './schema';

export const apexConfig: ClientConfig = {
  id: 'apex',
  slug: 'apex',
  legalName: 'Apex Gaming Gear FZE',
  displayName: { en: 'Apex Gaming Gear', ar: 'أبيكس لمعدات الألعاب' },
  tagline: {
    en: 'Elite esports peripherals, rigs & displays',
    ar: 'عتاد ومعدات الرياضات الإلكترونية والشاشات فائقة السرعة',
  },
  logo: '/assets/clients/apex/logo.svg',
  favicon: '/assets/clients/apex/logo.svg',
  theme: {
    colorPrimary: '#06B6D4',
    colorPrimaryHover: '#0891B2',
    colorPrimaryForeground: '#08131A',
    colorSecondary: '#18181B',
    colorAccent: '#EF4444',
    colorBackground: '#F4F4F5',
    colorSurface: '#FFFFFF',
    colorText: '#18181B',
    colorMuted: '#71717A',
    colorBorder: '#E4E4E7',
    radiusCard: '1rem',
    radiusButton: '0.5rem',
    fontSans: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  contact: {
    supportPhone: '+97144005550',
    supportPhoneDisplay: '800-APEX-GG (2739 44)',
    supportEmail: 'support@apex-gaming.example',
    supportEmailStatus: 'confirmed',
    additionalPhones: [],
  },
  addresses: [
    {
      label: { en: 'Dubai Gaming Hub', ar: 'مقر أبيكس في دبي' },
      line: 'Silicon Oasis, Building 9',
      city: 'Dubai',
      country: 'United Arab Emirates',
      phones: [],
      status: 'confirmed',
    },
  ],
  socialLinks: {
    twitter: 'https://twitter.com/ApexGamingGear',
    instagram: 'https://instagram.com/ApexGamingGear',
  },
  supportedLocales: ['en', 'ar'],
  defaultLocale: 'en',
  currencies: [
    { code: 'AED', symbol: { en: 'AED', ar: 'د.إ' }, rate: 1.0 },
    { code: 'SAR', symbol: { en: 'SAR', ar: 'ر.س' }, rate: 1.02 },
    { code: 'USD', symbol: { en: '$', ar: '$' }, rate: 0.272 },
  ],
  defaultCurrency: 'AED',
  countriesServed: ['United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar'],
  market: 'gulf',
  tax: {
    vatPercent: 5,
    vatLabel: { en: 'Estimated VAT (5%)', ar: 'ضريبة القيمة المضافة المقدرة (5%)' },
    vatApplied: true,
    pricesIncludeTax: false,
  },
  shipping: {
    freeShippingThreshold: 300,
    standardFee: 20,
    expressFee: 20,
    sameDayFee: 30,
    etaConfirmed: true,
    pickupEnabled: false,
    zones: [
      {
        id: 'gcc',
        label: { en: 'GCC Express Zone', ar: 'منطقة التوصيل السريع الخليجية' },
        cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Jeddah', 'Doha'],
      },
    ],
  },
  paymentMethods: [
    { id: 'card', enabled: true, confirmed: true },
    {
      id: 'tabby',
      enabled: true,
      confirmed: true,
      label: { en: 'Tabby — Split in 4 Payments', ar: 'تابي - قسّم فاتورتك على 4 دفعات' },
      description: { en: 'No interest, no hidden fees. First payment today.', ar: 'بدون فوائد أو رسوم خفية. الدفعة الأولى اليوم.' },
    },
    { id: 'cod', enabled: true, confirmed: true },
  ],
  content: { faq: [] },
  policies: {
    returnPolicy: {
      en: '7-Day Free Returns on unopened gaming gear',
      ar: 'سياسة إرجاع مجانية خلال 7 أيام للمنتجات غير المفتوحة',
    },
    returnWindowDays: 7,
    warrantyPolicy: {
      en: '2-Year Manufacturer Warranty on all gaming hardware',
      ar: 'ضمان الشركة المصنعة لمدة عامين على كافة معدات الألعاب',
    },
  },
  seo: {
    siteUrl: 'https://apex-gaming.example',
    titleSuffix: { en: 'Apex Gaming Gear', ar: 'أبيكس لمعدات الألعاب' },
    defaultDescription: {
      en: 'Shop elite gaming laptops, headsets, and peripherals engineered for competitive esports at Apex Gaming Gear.',
      ar: 'تسوق أقوى أجهزة الألعاب والسماعات والملحقات الاحترافية المصممة للرياضات الإلكترونية من أبيكس.',
    },
    ogImage: '/assets/clients/apex/photo-placeholder.svg',
    organizationLogo: '/assets/clients/apex/logo.svg',
  },
  home: {
    announcementBar: {
      en: 'Championship Season Sale: Up to 30% OFF Pro Gaming Gear',
      ar: 'تخفيضات موسم البطولات: خصومات تصل إلى 30% على معدات الألعاب الاحترافية',
    },
    heroBadge: { en: 'PRO ESPORTS SEASON', ar: 'موسم الرياضات الاحترافية' },
    heroTitle: {
      en: 'Built for the Kill. Tuned for Victory.',
      ar: 'مصمم للفوز. مضبوط للانتصار.',
    },
    heroSubtitle: {
      en: 'Zero-latency peripherals and 240Hz OLED displays trusted by championship teams.',
      ar: 'ملحقات بلا أي تأخير وشاشات أوليد 240 هرتز تثق بها الفرق البطولية.',
    },
    heroImage: '/assets/clients/apex/photo-placeholder.svg',
    heroImageAlt: { en: 'Apex gaming laptop', ar: 'لابتوب ألعاب أبيكس' },
    heroPrimaryCtaCategorySlug: 'all',
    heroSecondaryCtaProductSlug: 'prod-rog-zephyrus-g16',
    heroStats: [
      { value: { en: '240Hz', ar: '240 هرتز' }, label: { en: 'Display Refresh', ar: 'معدل تحديث الشاشة' } },
      { value: { en: '0.2ms', ar: '0.2 مللي ثانية' }, label: { en: 'Response Time', ar: 'زمن الاستجابة' } },
      { value: { en: 'RTX', ar: 'RTX' }, label: { en: 'Ray Tracing GPU', ar: 'معالج رسومي RTX' } },
    ],
    bentoBanners: [
      {
        badge: { en: 'Competitive Audio', ar: 'صوت تنافسي' },
        title: { en: 'Pro Wireless Gaming Headsets', ar: 'سماعات ألعاب لاسلكية احترافية' },
        description: {
          en: 'Hear every footstep with graphene drivers built for esports.',
          ar: 'اسمع كل خطوة بمحركات جرافين مصممة للرياضات الإلكترونية.',
        },
        ctaLabel: { en: 'Gear Up', ar: 'جهّز نفسك' },
        categorySlug: 'gaming',
        image: '/assets/clients/apex/photo-placeholder.svg',
      },
    ],
  },
  navigationCategories: [
    { id: 'gaming', label: { en: 'Gaming Laptops', ar: 'أجهزة كمبيوتر الألعاب' }, icon: 'Laptop' },
  ],
  featureFlags: {
    wishlistEnabled: true,
    quickViewEnabled: true,
    couponsEnabled: true,
    reviewsEnabled: true,
    expressDeliveryEnabled: true,
  },
  commerce: {
    provider: 'mock',
  },
  demoCouponCodes: [{ code: 'APEXWELCOME', discountPercent: 10 }],
  orderNumberPrefix: 'APX',
};
