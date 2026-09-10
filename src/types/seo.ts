export interface AlternateLocale {
  lang: string;
  href: string;
}

export interface ProductSEOMeta {
  priceAmount: string;
  priceCurrency: string;
  availability: 'instock' | 'oos' | 'pending';
  brand: string;
  condition?: string;
  category?: string;
  sku?: string;
}

export interface PageSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'product' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt?: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords: string[];
  alternateLocales: AlternateLocale[];
  productMeta?: ProductSEOMeta;
  structuredData: Record<string, any>;
}
