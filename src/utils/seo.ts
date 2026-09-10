import { Product, Category, StoreConfig, Language, Currency } from '../types/store';
import { PageSEO } from '../types/seo';

const DEFAULT_ORIGIN = 'https://voltix-electronics.store';

function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return DEFAULT_ORIGIN;
}

export function buildHomeSEO(
  store: StoreConfig,
  language: Language
): PageSEO {
  const baseUrl = getBaseUrl();
  const isArabic = language === 'ar';
  const storeName = store.name[language];

  const title = isArabic
    ? `${storeName} | المتجر الرسمي المعتمد للإلكترونيات والأجهزة الذكية في الشرق الأوسط`
    : `${storeName} | Official Authorized Consumer Electronics & Smart Devices Store`;

  const description = isArabic
    ? `تسوق أحدث الهواتف الذكية، أجهزة الكمبيوتر المحمولة، السماعات، منصات الألعاب والأجهزة المنزلية الذكية من ${storeName}. ضمان إقليمي معتمد، شحن سريع لجميع دول الخليج والدفع عند الاستلام وتقسيط تابي وتمارا.`
    : `Shop the latest flagship smartphones, laptops, audio gear, gaming rigs, and smart home gadgets at ${storeName}. 100% genuine GCC official distributor warranty, express next-day GCC shipping, Tabby & Tamara installments.`;

  const canonicalUrl = `${baseUrl}/?lang=${language}`;
  const alternateLocales = [
    { lang: 'en', href: `${baseUrl}/?lang=en` },
    { lang: 'ar', href: `${baseUrl}/?lang=ar` },
    { lang: 'x-default', href: `${baseUrl}/` },
  ];

  const keywords = isArabic
    ? [storeName, 'إلكترونيات', 'هواتف ذكية', 'لابتوبات', 'سماعات', 'ألعاب', 'متجر إلكترونيات الخليج', 'عروض تقنية', 'تابي', 'تمارا']
    : [storeName, 'electronics', 'smartphones', 'laptops', 'gaming', 'headphones', 'GCC electronics store', 'tech deals', 'Tabby', 'Tamara'];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: storeName,
        description,
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: ['en-AE', 'ar-AE', 'en-SA', 'ar-SA'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/?screen=plp&search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: storeName,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
          width: '600',
          height: '600',
        },
        sameAs: [
          'https://twitter.com/VoltixStore',
          'https://instagram.com/VoltixStore',
          'https://facebook.com/VoltixStore',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+971-4-800-8658',
            contactType: 'customer support',
            areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
            availableLanguage: ['Arabic', 'English'],
          },
        ],
      },
    ],
  };

  return {
    title,
    description,
    canonicalUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80',
    ogImageAlt: storeName,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80',
    keywords,
    alternateLocales,
    structuredData,
  };
}

export function buildCategorySEO(
  category: Category | undefined,
  store: StoreConfig,
  language: Language,
  productCount: number,
  searchQuery?: string
): PageSEO {
  const baseUrl = getBaseUrl();
  const isArabic = language === 'ar';
  const storeName = store.name[language];
  const catName = category ? category.name[language] : (isArabic ? 'جميع المنتجات' : 'All Products');
  const catId = category ? category.id : 'all';

  let title = '';
  let description = '';

  if (searchQuery && searchQuery.trim()) {
    title = isArabic
      ? `نتائج البحث عن "${searchQuery}" | ${storeName}`
      : `Search results for "${searchQuery}" | ${storeName}`;
    description = isArabic
      ? `تصفح نتائج البحث عن "${searchQuery}" في ${storeName}. عروض حصرية، أفضل الأسعار وشحن سريع.`
      : `Browse search results for "${searchQuery}" at ${storeName}. Exclusive prices, verified stock, and fast express delivery.`;
  } else if (category) {
    title = isArabic
      ? `${catName} - تسوق أفضل العروض والأسعار (${productCount} جهاز) | ${storeName}`
      : `${catName} - Shop Top Deals & Latest Models (${productCount} items) | ${storeName}`;
    description = isArabic
      ? `اكتشف تشكيلة واسعة من ${catName} لدى ${storeName}. متوفر مع أحدث المواصفات، ضمان الوكيل المعتمد، وإمكانية الدفع بالتقسيط بدون فوائد.`
      : `Explore our premium collection of ${catName} at ${storeName}. Featuring top international brands, genuine manufacturer warranty, and interest-free installment plans.`;
  } else {
    title = isArabic
      ? `كتالوج الإلكترونيات الشامل (${productCount} منتج) | ${storeName}`
      : `Complete Electronics Catalog (${productCount} Products) | ${storeName}`;
    description = isArabic
      ? `تصفح كامل منتجات ${storeName} من هواتف، لابتوبات، شاشات، وملحقات تقنية معتمدة بأسعار منافسة في دول الخليج.`
      : `Browse all high-performance electronics at ${storeName}. Genuine distributor-backed laptops, smartphones, consoles and gadgets.`;
  }

  const queryParams = new URLSearchParams();
  queryParams.set('screen', 'plp');
  if (catId !== 'all') queryParams.set('category', catId);
  if (searchQuery) queryParams.set('search', searchQuery);

  const canonicalUrl = `${baseUrl}/?${queryParams.toString()}&lang=${language}`;

  const alternateLocales = [
    { lang: 'en', href: `${baseUrl}/?${queryParams.toString()}&lang=en` },
    { lang: 'ar', href: `${baseUrl}/?${queryParams.toString()}&lang=ar` },
    { lang: 'x-default', href: `${baseUrl}/?${queryParams.toString()}` },
  ];

  const ogImage = category?.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80';

  const keywords = isArabic
    ? [catName, storeName, 'شراء ' + catName, 'أسعار ' + catName, 'عروض ' + catName, 'إلكترونيات دبي', 'إلكترونيات الرياض']
    : [catName, storeName, 'buy ' + catName, 'best ' + catName, catName + ' price GCC', 'electronics sale'];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: language === 'ar' ? 'ar' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: storeName,
      url: baseUrl,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isArabic ? 'الرئيسية' : 'Home',
          item: `${baseUrl}/?lang=${language}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: catName,
          item: canonicalUrl,
        },
      ],
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogImageAlt: catName,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    keywords,
    alternateLocales,
    structuredData,
  };
}

export function buildProductSEO(
  product: Product,
  store: StoreConfig,
  language: Language,
  currency: Currency
): PageSEO {
  const baseUrl = getBaseUrl();
  const isArabic = language === 'ar';
  const storeName = store.name[language];
  const prodTitle = product.title[language];
  const prodDesc = product.description[language];

  const title = isArabic
    ? `${prodTitle} | ${product.brand} - متوفر الآن لدى ${storeName}`
    : `${prodTitle} | ${product.brand} - Available Now at ${storeName}`;

  const description = isArabic
    ? `اشتري ${prodTitle} من ${product.brand} بسعر ${product.price} ${currency}. ${prodDesc.slice(0, 140)}... شحن سريع، ضمان معتمد، والدفع بالتقسيط.`
    : `Buy ${prodTitle} by ${product.brand} for ${product.price} ${currency}. ${prodDesc.slice(0, 140)}... Express GCC shipping, official brand warranty & easy installments.`;

  const canonicalUrl = `${baseUrl}/?screen=pdp&product=${product.id}&lang=${language}`;

  const alternateLocales = [
    { lang: 'en', href: `${baseUrl}/?screen=pdp&product=${product.id}&lang=en` },
    { lang: 'ar', href: `${baseUrl}/?screen=pdp&product=${product.id}&lang=ar` },
    { lang: 'x-default', href: `${baseUrl}/?screen=pdp&product=${product.id}` },
  ];

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80';

  const keywords = isArabic
    ? [
        product.brand,
        prodTitle,
        `سعر ${prodTitle}`,
        `مواصفات ${prodTitle}`,
        storeName,
        'إلكترونيات أصلية',
        'ضمان وكيل',
      ]
    : [
        product.brand,
        prodTitle,
        `${prodTitle} price`,
        `${prodTitle} specs`,
        `${prodTitle} review`,
        storeName,
        'buy tech online GCC',
      ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: prodTitle,
    image: product.images,
    description: prodDesc,
    sku: product.id,
    mpn: `VTX-${product.id.toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: currency,
      price: product.price,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: storeName,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    review: product.reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author,
      },
      datePublished: r.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      headline: r.title[language],
      reviewBody: r.comment[language],
    })),
  };

  return {
    title,
    description,
    canonicalUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
    ogType: 'product',
    ogTitle: title,
    ogDescription: description,
    ogImage: primaryImage,
    ogImageAlt: prodTitle,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: primaryImage,
    keywords,
    alternateLocales,
    productMeta: {
      priceAmount: String(product.price),
      priceCurrency: currency,
      availability: product.inStock ? 'instock' : 'oos',
      brand: product.brand,
      condition: 'new',
      category: product.category,
      sku: product.id,
    },
    structuredData,
  };
}

export function buildCheckoutSEO(
  store: StoreConfig,
  language: Language
): PageSEO {
  const baseUrl = getBaseUrl();
  const isArabic = language === 'ar';
  const storeName = store.name[language];

  const title = isArabic
    ? `إتمام الطلب وسلة التسوق الآمنة | ${storeName}`
    : `Secure Checkout & Order Review | ${storeName}`;

  const description = isArabic
    ? `صفحة إتمام الطلب الآمنة والدفع المشفر عبر ${storeName}.`
    : `Secure 256-bit encrypted checkout and order confirmation on ${storeName}.`;

  const canonicalUrl = `${baseUrl}/?screen=checkout&lang=${language}`;

  return {
    title,
    description,
    canonicalUrl,
    robots: 'noindex, nofollow, noarchive', // Standard checkout protection
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80',
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=630&fit=crop&q=80',
    keywords: ['checkout', 'secure payment'],
    alternateLocales: [],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CheckoutPage',
      name: title,
      url: canonicalUrl,
    },
  };
}
