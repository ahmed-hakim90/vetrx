import { Product, Category, Language, Currency } from '../types/store';
import { ClientConfig } from '../config/clients/schema';
import { PageSEO, AlternateLocale } from '../types/seo';

function getBaseUrl(client: ClientConfig): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return client.seo.siteUrl;
}

export function buildHomeSEO(client: ClientConfig, language: Language): PageSEO {
  const baseUrl = getBaseUrl(client);
  const isArabic = language === 'ar';
  const storeName = client.displayName[language];

  const title = `${storeName} | ${client.tagline[language]}`;
  const description = client.seo.defaultDescription[language];

  const canonicalUrl = `${baseUrl}/`;
  // The UI language is a client-side, persisted preference rather than a
  // separate URL per locale, so every hreflang alternate points back at the
  // same canonical page — accurate for this architecture, not a guess at a
  // routing scheme the app doesn't have.
  const alternateLocales: AlternateLocale[] = client.supportedLocales.map((lang) => ({
    lang,
    href: canonicalUrl,
  }));
  alternateLocales.push({ lang: 'x-default', href: canonicalUrl });

  const keywords = [storeName, ...(isArabic ? ['إلكترونيات', 'تسوق أونلاين'] : ['electronics', 'online shopping'])];

  // Never publish a contactPoint or sameAs entry that wasn't actually
  // confirmed for this client — an absent phone number or social link is
  // omitted from structured data rather than left empty/fabricated.
  const sameAs = Object.values(client.socialLinks).filter((v): v is string => Boolean(v));

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: client.legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: client.seo.organizationLogo,
    },
  };
  if (sameAs.length > 0) organization.sameAs = sameAs;
  if (client.contact.supportPhone) {
    organization.contactPoint = [
      {
        '@type': 'ContactPoint',
        telephone: client.contact.supportPhone,
        contactType: 'customer support',
        areaServed: client.countriesServed,
        availableLanguage: client.supportedLocales,
      },
    ];
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: storeName,
        description,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: client.supportedLocales,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      organization,
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
    ogImage: client.seo.ogImage,
    ogImageAlt: storeName,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: client.seo.ogImage,
    keywords,
    alternateLocales,
    structuredData,
  };
}

export function buildCategorySEO(
  category: Category | undefined,
  client: ClientConfig,
  language: Language,
  productCount: number,
  searchQuery: string | undefined,
  path: string
): PageSEO {
  const baseUrl = getBaseUrl(client);
  const isArabic = language === 'ar';
  const storeName = client.displayName[language];
  const catName = category ? category.name[language] : (isArabic ? 'جميع المنتجات' : 'All Products');

  let title = '';
  let description = '';

  if (searchQuery && searchQuery.trim()) {
    title = isArabic
      ? `نتائج البحث عن "${searchQuery}" | ${storeName}`
      : `Search results for "${searchQuery}" | ${storeName}`;
    description = isArabic
      ? `تصفح نتائج البحث عن "${searchQuery}" في ${storeName}.`
      : `Browse search results for "${searchQuery}" at ${storeName}.`;
  } else if (category) {
    title = isArabic
      ? `${catName} - تسوق أفضل العروض (${productCount} منتج) | ${storeName}`
      : `${catName} - Shop Top Deals (${productCount} items) | ${storeName}`;
    description = isArabic
      ? `اكتشف تشكيلة واسعة من ${catName} لدى ${storeName}.`
      : `Explore our collection of ${catName} at ${storeName}.`;
  } else {
    title = isArabic
      ? `الكتالوج الكامل (${productCount} منتج) | ${storeName}`
      : `Complete Catalog (${productCount} Products) | ${storeName}`;
    description = isArabic
      ? `تصفح كامل منتجات ${storeName}.`
      : `Browse all products at ${storeName}.`;
  }

  const canonicalUrl = `${baseUrl}${path}`;
  const alternateLocales: AlternateLocale[] = client.supportedLocales.map((lang) => ({
    lang,
    href: canonicalUrl,
  }));
  alternateLocales.push({ lang: 'x-default', href: canonicalUrl });
  // Search results reflect a transient query, not stable indexable content.
  const robotsDirective = searchQuery && searchQuery.trim()
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1';

  const ogImage = category?.image || client.seo.ogImage;
  const keywords = [catName, storeName];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: language,
    isPartOf: { '@type': 'WebSite', name: storeName, url: baseUrl },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isArabic ? 'الرئيسية' : 'Home', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: catName, item: canonicalUrl },
      ],
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    robots: robotsDirective,
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
  client: ClientConfig,
  language: Language,
  currency: Currency
): PageSEO {
  const baseUrl = getBaseUrl(client);
  const isArabic = language === 'ar';
  const storeName = client.displayName[language];
  const prodTitle = product.title[language];
  const prodDesc = product.description[language];

  const title = isArabic
    ? `${prodTitle} | ${product.brand} - متوفر لدى ${storeName}`
    : `${prodTitle} | ${product.brand} - Available at ${storeName}`;

  const description = isArabic
    ? `اشتري ${prodTitle} من ${product.brand} بسعر ${product.price} ${currency}. ${prodDesc.slice(0, 140)}...`
    : `Buy ${prodTitle} by ${product.brand} for ${product.price} ${currency}. ${prodDesc.slice(0, 140)}...`;

  const canonicalUrl = `${baseUrl}/product/${product.id}`;
  const alternateLocales: AlternateLocale[] = client.supportedLocales.map((lang) => ({
    lang,
    href: canonicalUrl,
  }));
  alternateLocales.push({ lang: 'x-default', href: canonicalUrl });

  const primaryImage = product.images[0] || client.seo.ogImage;
  const keywords = [product.brand, prodTitle, storeName];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: prodTitle,
    image: product.images,
    description: prodDesc,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: currency,
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: client.legalName },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    // Never publish demo/placeholder reviews as if they were real.
    review:
      product.reviews.length > 0
        ? product.reviews.slice(0, 5).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            datePublished: r.date,
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
            headline: r.title[language],
            reviewBody: r.comment[language],
          }))
        : undefined,
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

// Shared builder for every page that must never be indexed: checkout,
// cart, wishlist, and order confirmation. Each just supplies its own
// title/description/path.
export function buildNoIndexSEO(
  client: ClientConfig,
  language: Language,
  title: string,
  description: string,
  path: string
): PageSEO {
  const baseUrl = getBaseUrl(client);
  const canonicalUrl = `${baseUrl}${path}`;

  return {
    title,
    description,
    canonicalUrl,
    robots: 'noindex, nofollow, noarchive',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: client.seo.ogImage,
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: client.seo.ogImage,
    keywords: [],
    alternateLocales: [],
    structuredData: {},
  };
}

// Indexable informational pages (About, FAQ, Shipping, Returns, Warranty,
// Privacy, Terms, Contact) — real content, so unlike checkout/cart/order
// these are meant to be crawled.
export function buildInfoPageSEO(client: ClientConfig, language: Language, title: string, path: string): PageSEO {
  const baseUrl = getBaseUrl(client);
  const canonicalUrl = `${baseUrl}${path}`;
  const description = client.seo.defaultDescription[language];
  const alternateLocales: AlternateLocale[] = client.supportedLocales.map((lang) => ({ lang, href: canonicalUrl }));
  alternateLocales.push({ lang: 'x-default', href: canonicalUrl });

  return {
    title,
    description,
    canonicalUrl,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: client.seo.ogImage,
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: client.seo.ogImage,
    keywords: [client.displayName[language]],
    alternateLocales,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: canonicalUrl,
    },
  };
}

export function buildCheckoutSEO(client: ClientConfig, language: Language): PageSEO {
  const isArabic = language === 'ar';
  const storeName = client.displayName[language];
  const title = isArabic ? `إتمام الطلب | ${storeName}` : `Checkout | ${storeName}`;
  const description = isArabic ? `صفحة إتمام الطلب لدى ${storeName}.` : `Checkout and order review at ${storeName}.`;
  return buildNoIndexSEO(client, language, title, description, '/checkout');
}

export function buildNotFoundSEO(client: ClientConfig, language: Language): PageSEO {
  const baseUrl = getBaseUrl(client);
  const isArabic = language === 'ar';
  const storeName = client.displayName[language];
  const title = isArabic ? `الصفحة غير موجودة | ${storeName}` : `Page Not Found | ${storeName}`;
  const description = isArabic
    ? 'الصفحة أو المنتج الذي تبحث عنه غير موجود.'
    : 'The page or product you are looking for could not be found.';

  return {
    title,
    description,
    canonicalUrl: `${baseUrl}/`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: client.seo.ogImage,
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: client.seo.ogImage,
    keywords: [],
    alternateLocales: [],
    structuredData: {},
  };
}
