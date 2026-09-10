import { useEffect, useMemo, type FC } from 'react';
import { useLocation, useSearchParams, matchPath } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  buildHomeSEO,
  buildCategorySEO,
  buildProductSEO,
  buildCheckoutSEO,
  buildNoIndexSEO,
  buildInfoPageSEO,
  buildNotFoundSEO,
} from '../../utils/seo';
import { PageSEO } from '../../types/seo';

function setMetaTag(key: string, value: string, attribute: 'name' | 'property' = 'name') {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

function removeMetaTag(key: string, attribute: 'name' | 'property' = 'name') {
  if (typeof document === 'undefined') return;
  const element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function setLinkTag(rel: string, href: string, extraAttrs: Record<string, string> = {}) {
  if (typeof document === 'undefined') return;

  let selector = `link[rel="${rel}"]`;
  if (extraAttrs.hreflang) {
    selector += `[hreflang="${extraAttrs.hreflang}"]`;
  }

  let element = document.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    Object.entries(extraAttrs).forEach(([k, v]) => element?.setAttribute(k, v));
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function setJsonLdScript(data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  const scriptId = 'dynamic-store-json-ld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

// Headless: syncs <head> metadata (title, canonical, hreflang, OG, Twitter,
// JSON-LD) to the current *route* — a persistent sibling of <Routes>, so it
// derives the page type from useLocation()/useParams() rather than from
// legacy `activeScreen` state. Renders nothing.
export const SEOManager: FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { language, currency, client, products, categories, getProductBySlug } = useStore();

  const currentSEO: PageSEO = useMemo(() => {
    const path = location.pathname;
    // This component is a persistent sibling of <Routes>, not a route
    // element, so `useParams()` would always be empty here — route params
    // have to be matched off the pathname explicitly.
    const params = {
      categorySlug: matchPath('/category/:categorySlug', path)?.params.categorySlug,
      productSlug: matchPath('/product/:productSlug', path)?.params.productSlug,
    };

    if (path === '/') return buildHomeSEO(client, language);

    if (path === '/products') {
      return buildCategorySEO(undefined, client, language, products.length, undefined, '/products');
    }

    if (path.startsWith('/category/')) {
      const category = categories.find((c) => c.id === params.categorySlug);
      // An unknown category renders a "not found" page, so its metadata must
      // say so too rather than describing a catalog that isn't there.
      if (!category) return buildNotFoundSEO(client, language);
      const count = products.filter((p) => p.category === params.categorySlug).length;
      return buildCategorySEO(category, client, language, count, undefined, path);
    }

    if (path === '/search') {
      const q = searchParams.get('q') ?? '';
      const count = q
        ? products.filter((p) => `${p.title.en} ${p.title.ar} ${p.brand}`.toLowerCase().includes(q.toLowerCase())).length
        : 0;
      return buildCategorySEO(undefined, client, language, count, q, `/search?q=${encodeURIComponent(q)}`);
    }

    if (path.startsWith('/product/')) {
      const product = params.productSlug ? getProductBySlug(params.productSlug) : undefined;
      if (!product) return buildNotFoundSEO(client, language);
      return buildProductSEO(product, client, language, currency);
    }

    if (path === '/checkout') return buildCheckoutSEO(client, language);

    if (path === '/cart') {
      return buildNoIndexSEO(client, language, `${client.displayName[language]} | Cart`, 'Your shopping cart.', '/cart');
    }

    if (path === '/wishlist') {
      return buildNoIndexSEO(client, language, `${client.displayName[language]} | Wishlist`, 'Your saved items.', '/wishlist');
    }

    if (path.startsWith('/order/')) {
      return buildNoIndexSEO(client, language, `${client.displayName[language]} | Order`, 'Order confirmation.', path);
    }

    const infoPageTitles: Record<string, string> = {
      '/about': language === 'ar' ? 'من نحن' : 'About Us',
      '/contact': language === 'ar' ? 'تواصل معنا' : 'Contact Us',
      '/faq': language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
      '/shipping': language === 'ar' ? 'الشحن والتوصيل' : 'Shipping Info',
      '/returns': language === 'ar' ? 'الاسترجاع والاستبدال' : 'Returns',
      '/warranty': language === 'ar' ? 'الضمان' : 'Warranty',
      '/privacy': language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
      '/terms': language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service',
    };
    if (path in infoPageTitles) {
      const title = `${infoPageTitles[path]} | ${client.displayName[language]}`;
      return buildInfoPageSEO(client, language, title, path);
    }

    return buildNotFoundSEO(client, language);
  }, [location.pathname, searchParams, language, currency, client, products, categories, getProductBySlug]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = currentSEO.title;

    setMetaTag('description', currentSEO.description, 'name');
    setMetaTag('keywords', currentSEO.keywords.join(', '), 'name');
    setMetaTag('robots', currentSEO.robots, 'name');

    setLinkTag('canonical', currentSEO.canonicalUrl);

    currentSEO.alternateLocales.forEach((alt) => {
      setLinkTag('alternate', alt.href, { hreflang: alt.lang });
    });

    setMetaTag('og:title', currentSEO.ogTitle, 'property');
    setMetaTag('og:description', currentSEO.ogDescription, 'property');
    setMetaTag('og:url', currentSEO.canonicalUrl, 'property');
    setMetaTag('og:type', currentSEO.ogType, 'property');
    setMetaTag('og:image', currentSEO.ogImage, 'property');
    if (currentSEO.ogImageAlt) {
      setMetaTag('og:image:alt', currentSEO.ogImageAlt, 'property');
    }
    setMetaTag('og:site_name', client.displayName[language], 'property');
    setMetaTag('og:locale', language === 'ar' ? 'ar_EG' : 'en_US', 'property');

    if (currentSEO.productMeta) {
      setMetaTag('product:price:amount', currentSEO.productMeta.priceAmount, 'property');
      setMetaTag('product:price:currency', currentSEO.productMeta.priceCurrency, 'property');
      setMetaTag('product:availability', currentSEO.productMeta.availability, 'property');
      setMetaTag('product:brand', currentSEO.productMeta.brand, 'property');
    } else {
      removeMetaTag('product:price:amount', 'property');
      removeMetaTag('product:price:currency', 'property');
      removeMetaTag('product:availability', 'property');
      removeMetaTag('product:brand', 'property');
    }

    setMetaTag('twitter:card', currentSEO.twitterCard, 'name');
    setMetaTag('twitter:title', currentSEO.twitterTitle, 'name');
    setMetaTag('twitter:description', currentSEO.twitterDescription, 'name');
    setMetaTag('twitter:image', currentSEO.twitterImage, 'name');

    setJsonLdScript(currentSEO.structuredData);

    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [currentSEO, client, language]);

  return null;
};
