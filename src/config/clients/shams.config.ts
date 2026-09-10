import { ClientConfig } from './schema';

// Shams Stores — professional photography, video and audio equipment, Egypt.
//
// Everything in this file is either (a) data confirmed by the business, or
// (b) explicitly marked as not yet confirmed. Nothing is invented. In
// particular, as of this revision the business has NOT confirmed:
//   - shipping fees, served governorates, courier, or delivery times
//   - VAT registration status (so no VAT is charged or displayed)
//   - that Cash on Delivery is currently accepted (it was historically)
//   - a card payment integration (terms mention cards; nothing is wired)
//   - the registered legal name, commercial register / tax numbers
//   - the support email is on record but has not been re-verified
//   - the two branch addresses have not been re-confirmed by the owner
// See docs/SHAMS-LAUNCH-CHECKLIST.md. `getProductionReadinessIssues()`
// reports each of these as a launch blocker.
export const shamsConfig: ClientConfig = {
  id: 'shams',
  slug: 'shams',
  // Trading name. The registered legal name is still to be supplied — it is
  // needed for invoices and the Organization schema before launch.
  legalName: 'Shams Stores',
  displayName: { en: 'Shams Stores', ar: 'شمس ستورز' },
  tagline: {
    en: 'Professional Photo, Video & Audio Equipment',
    ar: 'معدات التصوير والفيديو والصوت الاحترافية',
  },
  // Placeholder mark until the real logo/favicon files are supplied.
  logo: '/assets/clients/shams/logo.svg',
  favicon: '/assets/clients/shams/logo.svg',
  theme: {
    colorPrimary: '#F59E0B',
    colorPrimaryHover: '#D97706',
    colorPrimaryForeground: '#111827',
    colorSecondary: '#0F172A',
    colorAccent: '#F97316',
    colorBackground: '#F8FAFC',
    colorSurface: '#FFFFFF',
    colorText: '#0F172A',
    colorMuted: '#64748B',
    colorBorder: '#E2E8F0',
    colorSuccess: '#059669',
    colorError: '#DC2626',
    radiusCard: '1rem',
    radiusButton: '0.75rem',
    fontSans: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  contact: {
    supportPhone: '+20223901870',
    supportPhoneDisplay: '02 2390 1870',
    additionalPhones: [
      { tel: '+20223901860', display: '02 2390 1860' },
      {
        tel: '+201011331666',
        display: '010 1133 1666',
        label: { en: 'Mobile', ar: 'موبايل' },
      },
    ],
    supportEmail: 'info@shams-stores.com',
    // On record, not re-verified with the owner yet.
    supportEmailStatus: 'needs-confirmation',
  },
  addresses: [
    {
      label: { en: 'Downtown Branch', ar: 'فرع وسط البلد' },
      line: '5 Sherif Street, Downtown',
      city: 'Cairo',
      country: 'Egypt',
      regionId: 'cairo',
      phones: [
        { tel: '+20223901870', display: '02 2390 1870' },
        { tel: '+20223901860', display: '02 2390 1860' },
        { tel: '+201011331666', display: '010 1133 1666' },
      ],
      status: 'needs-confirmation',
    },
    {
      label: { en: 'Heliopolis Branch', ar: 'فرع مصر الجديدة' },
      line: '24 Omar Ibn El-Khattab Street, Ismailia Square, Heliopolis',
      city: 'Cairo',
      country: 'Egypt',
      regionId: 'cairo',
      phones: [
        { tel: '+20226337800', display: '02 2633 7800' },
        { tel: '+201023399966', display: '010 2339 9966' },
      ],
      status: 'needs-confirmation',
    },
  ],
  socialLinks: {
    facebook: 'https://www.facebook.com/ShamsStores',
    instagram: 'https://www.instagram.com/shamsstores',
  },
  supportedLocales: ['en', 'ar'],
  defaultLocale: 'en',
  currencies: [{ code: 'EGP', symbol: { en: 'EGP', ar: 'ج.م' }, rate: 1.0 }],
  defaultCurrency: 'EGP',
  countriesServed: ['Egypt'],
  timezone: 'Africa/Cairo',
  market: 'egypt',
  tax: {
    // Egypt's statutory rate, kept for reference/labels only.
    vatPercent: 14,
    vatLabel: { en: 'VAT (14%)', ar: 'ضريبة القيمة المضافة (14%)' },
    // Not confirmed whether the business is VAT-registered — so no VAT line
    // is added to any total and none is displayed. Flip to true (and set
    // pricesIncludeTax correctly) only once the tax status is confirmed.
    vatApplied: false,
    pricesIncludeTax: false,
  },
  shipping: {
    // No courier contract, no fee table, no served-governorate list, and no
    // delivery-time commitment confirmed yet. Every one of these is left
    // unset on purpose: checkout then says shipping is not published rather
    // than quoting a number nobody agreed to.
    zones: [],
    etaConfirmed: false,
    pickupEnabled: false,
  },
  paymentMethods: [
    {
      id: 'cod',
      // Offered by the running (Demo Mode) storefront so the order flow is
      // testable end to end...
      enabled: true,
      // ...but the business has not confirmed it currently accepts COD (it
      // did historically), so this stays a launch blocker.
      confirmed: false,
    },
    {
      id: 'card',
      // Referenced in the terms, but no gateway is integrated — nothing is
      // offered in the UI until one is, through a hosted/tokenized flow.
      enabled: false,
      confirmed: false,
    },
  ],
  // No confirmed return/warranty policy text yet — omitted rather than
  // invented. Sections referencing these hide themselves automatically.
  policies: {},
  content: {
    about: {
      // Supplied by the business.
      status: 'confirmed',
      body: {
        en: 'Shams Stores specializes in professional photography, video production and audio equipment in Egypt.',
        ar: 'تتخصص شمس ستورز في معدات التصوير الاحترافي وإنتاج الفيديو والصوتيات في مصر.',
      },
    },
    faq: [
      {
        question: { en: 'Where are your branches?', ar: 'فين فروعكم؟' },
        answer: {
          en: 'Shams Stores has branches in Downtown Cairo and Heliopolis. Addresses and phone numbers are on the Contact page.',
          ar: 'شمس ستورز ليها فروع في وسط البلد ومصر الجديدة. العناوين وأرقام التليفونات موجودة في صفحة "تواصل معنا".',
        },
      },
      {
        question: { en: 'What equipment do you carry?', ar: 'إيه المعدات المتوفرة عندكم؟' },
        answer: {
          en: 'Cameras, lenses, video production gear, lighting, professional audio, microphones, tripods and stabilizers, bags, memory cards, accessories, darkroom equipment and photographic film.',
          ar: 'كاميرات، عدسات، معدات إنتاج فيديو، إضاءة، صوتيات احترافية، ميكروفونات، حوامل ومثبتات، حقائب، بطاقات ذاكرة، إكسسوارات، معدات غرف تحميض، وأفلام تصوير.',
        },
      },
      {
        question: { en: 'Can I order online?', ar: 'أقدر أطلب أونلاين؟' },
        answer: {
          en: 'Online ordering is still being set up. For availability and prices right now, please contact a branch by phone or email.',
          ar: 'الطلب أونلاين لسه بيتجهّز. للاستفسار عن التوفر والأسعار حاليًا، تواصل مع أي فرع بالتليفون أو الإيميل.',
        },
      },
      {
        question: { en: 'How much is delivery?', ar: 'الشحن بكام؟' },
        answer: {
          en: 'Delivery fees are not published yet. Please ask a branch when you order.',
          ar: 'رسوم الشحن لسه مش معلنة. اسأل الفرع عند الطلب من فضلك.',
        },
      },
    ],
    // The five documents below are placeholder drafts, clearly marked so in
    // the UI. Replace the body text and flip status to 'confirmed' only
    // after a real (and, for privacy/terms, legal) review.
    shippingInfo: {
      status: 'draft',
      body: {
        en: 'Delivery fees, served governorates and delivery times are not published yet — no courier arrangement has been confirmed. Please contact a branch for delivery options when you order.',
        ar: 'رسوم الشحن والمحافظات المخدومة ومدة التوصيل لسه مش معلنة، ولسه مفيش تعاقد مؤكد مع شركة شحن. تواصل مع الفرع للاستفسار عن التوصيل عند الطلب.',
      },
    },
    returnsInfo: {
      status: 'draft',
      body: {
        en: 'The return and exchange policy is being finalized. This page will show the confirmed policy — including the return window, conditions, and who pays return shipping — once it is approved.',
        ar: 'سياسة الاستبدال والاسترجاع لسه بتتراجع. هنعرض هنا السياسة النهائية بالتفصيل، بما فيها مدة الاسترجاع وشروطه ومين بيتحمّل مصاريف الإرجاع، بعد اعتمادها.',
      },
    },
    warrantyInfo: {
      status: 'draft',
      body: {
        en: 'Warranty terms depend on the manufacturer or local distributor of each item and are being confirmed. Ask a branch about the warranty on a specific product.',
        ar: 'شروط الضمان بتختلف حسب الشركة المصنّعة أو الموزّع المحلي لكل منتج ولسه بنراجعها. اسأل الفرع عن ضمان أي منتج معيّن.',
      },
    },
    privacyPolicy: {
      status: 'draft',
      body: {
        en: 'This is a placeholder privacy policy for review purposes only. It does not yet reflect Shams Stores’ actual data practices and must be replaced with a version reviewed by qualified legal counsel before any real customer data is collected.',
        ar: 'ده نص مبدئي لسياسة الخصوصية لأغراض المراجعة فقط، ومش بيعكس ممارسات شمس ستورز الفعلية في التعامل مع البيانات. لازم يتغير بنسخة راجعها محامي مختص قبل جمع أي بيانات حقيقية من العملاء.',
      },
    },
    termsOfService: {
      status: 'draft',
      body: {
        en: 'This is a placeholder terms of service document for review purposes only. It must be replaced with terms reviewed by qualified legal counsel before launch.',
        ar: 'دي نسخة مبدئية من الشروط والأحكام لأغراض المراجعة فقط. لازم تتغير بنسخة راجعها محامي مختص قبل الإطلاق.',
      },
    },
  },
  seo: {
    siteUrl: 'https://www.shams-stores.com',
    titleSuffix: { en: 'Shams Stores', ar: 'شمس ستورز' },
    defaultDescription: {
      en: 'Professional photography, video production and audio equipment in Egypt — cameras, lenses, lighting, microphones and accessories from Shams Stores.',
      ar: 'معدات التصوير الفوتوغرافي وإنتاج الفيديو والصوتيات الاحترافية في مصر — كاميرات وعدسات وإضاءة وميكروفونات وإكسسوارات من شمس ستورز.',
    },
    ogImage: '/assets/clients/shams/photo-placeholder.svg',
    organizationLogo: '/assets/clients/shams/logo.svg',
  },
  home: {
    heroBadge: { en: 'SHAMS STORES', ar: 'شمس ستورز' },
    heroTitle: {
      en: 'Create Without Limits',
      ar: 'ابدع من غير حدود',
    },
    heroSubtitle: {
      en: 'Explore cameras, lenses, lighting and professional audio equipment for photographers, filmmakers and content creators.',
      ar: 'اكتشف الكاميرات والعدسات والإضاءة ومعدات الصوت الاحترافية للمصورين وصناع الأفلام والمحتوى.',
    },
    heroImage: '/assets/clients/shams/photo-placeholder.svg',
    heroImageAlt: { en: 'Shams Stores equipment', ar: 'معدات شمس ستورز' },
    heroPrimaryCtaCategorySlug: 'all',
    heroSecondaryCtaCategorySlug: 'offers',
    heroPrimaryCtaLabel: { en: 'Shop Equipment', ar: 'تسوّق المعدات' },
    heroSecondaryCtaLabel: { en: 'View Current Offers', ar: 'شاهد العروض الحالية' },
    heroStats: [
      { value: { en: '2', ar: '٢' }, label: { en: 'Cairo Branches', ar: 'فرعين بالقاهرة' } },
      { value: { en: 'Photo', ar: 'تصوير' }, label: { en: 'Video & Audio', ar: 'فيديو وصوت' } },
      { value: { en: 'Pro', ar: 'احترافي' }, label: { en: 'Equipment', ar: 'معدات' } },
    ],
    bentoBanners: [],
  },
  navigationCategories: [
    { id: 'cameras', label: { en: 'Cameras', ar: 'الكاميرات' }, icon: 'Camera' },
    { id: 'lenses', label: { en: 'Lenses', ar: 'العدسات' }, icon: 'Aperture' },
    { id: 'video-production', label: { en: 'Video Production', ar: 'معدات إنتاج الفيديو' }, icon: 'Video' },
    { id: 'lighting', label: { en: 'Lighting', ar: 'الإضاءة' }, icon: 'Lightbulb' },
    { id: 'audio', label: { en: 'Professional Audio', ar: 'الصوتيات الاحترافية' }, icon: 'Headphones' },
    { id: 'offers', label: { en: 'Current Offers', ar: 'العروض الحالية' }, icon: 'Tag' },
  ],
  featureFlags: {
    wishlistEnabled: true,
    quickViewEnabled: true,
    couponsEnabled: false,
    reviewsEnabled: true,
    expressDeliveryEnabled: false,
  },
  commerce: {
    provider: 'woocommerce',
    envVarNames: {
      baseUrl: 'VITE_WORDPRESS_URL',
    },
  },
  demoCouponCodes: [],
  orderNumberPrefix: 'SHAMS',
};
