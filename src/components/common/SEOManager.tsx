import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Globe,
  CheckCircle2,
  Code,
  Share2,
  X,
  ExternalLink,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  PackageCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';
import {
  buildHomeSEO,
  buildCategorySEO,
  buildProductSEO,
  buildCheckoutSEO,
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

function setJsonLdScript(data: Record<string, any>) {
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

export const SEOManager: React.FC = () => {
  const {
    activeScreen,
    selectedProduct,
    filterState,
    language,
    currency,
    currentStoreConfig,
    activeStore,
  } = useStore();

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'social' | 'schema' | 'tags'>('serp');

  // Compute Current SEO Meta dynamically based on active route and store context
  const currentSEO: PageSEO = useMemo(() => {
    switch (activeScreen) {
      case 'home':
        return buildHomeSEO(currentStoreConfig, language);

      case 'plp': {
        const cat = CATEGORIES.find((c) => c.id === filterState.category);
        const matchingProducts = PRODUCTS.filter((p) => {
          if (activeStore !== 'voltix' && p.storeId !== activeStore) return false;
          if (filterState.category !== 'all' && p.category !== filterState.category) return false;
          return true;
        });
        return buildCategorySEO(
          cat,
          currentStoreConfig,
          language,
          matchingProducts.length,
          filterState.searchQuery
        );
      }

      case 'pdp': {
        const prod = selectedProduct || PRODUCTS[0];
        return buildProductSEO(prod, currentStoreConfig, language, currency);
      }

      case 'checkout':
        return buildCheckoutSEO(currentStoreConfig, language);

      default:
        return buildHomeSEO(currentStoreConfig, language);
    }
  }, [
    activeScreen,
    selectedProduct,
    filterState.category,
    filterState.searchQuery,
    language,
    currency,
    currentStoreConfig,
    activeStore,
  ]);

  // Synchronize document <head> with the computed SEO object
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Title
    document.title = currentSEO.title;

    // 2. Standard Meta
    setMetaTag('description', currentSEO.description, 'name');
    setMetaTag('keywords', currentSEO.keywords.join(', '), 'name');
    setMetaTag('robots', currentSEO.robots, 'name');

    // 3. Canonical Link
    setLinkTag('canonical', currentSEO.canonicalUrl);

    // 4. Alternate Hreflang Links
    currentSEO.alternateLocales.forEach((alt) => {
      setLinkTag('alternate', alt.href, { hreflang: alt.lang });
    });

    // 5. Open Graph Meta Tags
    setMetaTag('og:title', currentSEO.ogTitle, 'property');
    setMetaTag('og:description', currentSEO.ogDescription, 'property');
    setMetaTag('og:url', currentSEO.canonicalUrl, 'property');
    setMetaTag('og:type', currentSEO.ogType, 'property');
    setMetaTag('og:image', currentSEO.ogImage, 'property');
    if (currentSEO.ogImageAlt) {
      setMetaTag('og:image:alt', currentSEO.ogImageAlt, 'property');
    }
    setMetaTag('og:site_name', currentStoreConfig.name[language], 'property');
    setMetaTag('og:locale', language === 'ar' ? 'ar_AE' : 'en_US', 'property');

    // 6. Product-specific Open Graph Meta
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

    // 7. Twitter Card Meta Tags
    setMetaTag('twitter:card', currentSEO.twitterCard, 'name');
    setMetaTag('twitter:title', currentSEO.twitterTitle, 'name');
    setMetaTag('twitter:description', currentSEO.twitterDescription, 'name');
    setMetaTag('twitter:image', currentSEO.twitterImage, 'name');

    // 8. Structured Data JSON-LD
    setJsonLdScript(currentSEO.structuredData);

    // 9. Document Lang & Dir
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [currentSEO, currentStoreConfig, language]);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(currentSEO.structuredData, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <>
      {/* Floating SEO Status Indicator & Inspector Trigger */}
      <aside
        aria-label="SEO Status Tools"
        className="fixed bottom-20 sm:bottom-6 left-4 rtl:left-auto rtl:right-4 z-40"
      >
        <button
          id="seo-inspector-toggle-btn"
          onClick={() => setIsInspectorOpen(true)}
          className="min-h-[44px] flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md text-xs font-semibold cursor-pointer transition-all hover:scale-105 touch-manipulation active:scale-95 group"
          title="Inspect Dynamic SEO Metadata & Rich Schemas"
          aria-label="Inspect Dynamic SEO Metadata"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">SEO:</span>
          <span className="text-slate-300 font-mono text-[11px] uppercase">
            {activeScreen}
          </span>
        </button>
      </aside>

      {/* SEO Inspector Modal */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Dynamic SEO & Indexing Inspector</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live metadata for route: <span className="font-mono font-bold text-blue-600">/{activeScreen}</span> ({language.toUpperCase()})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInspectorOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer touch-manipulation active:scale-90"
                title="Close Inspector"
                aria-label="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('serp')}
                className={`min-h-[44px] py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 touch-manipulation ${
                  activeTab === 'serp'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google SERP Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`min-h-[44px] py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 touch-manipulation ${
                  activeTab === 'social'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Social Card (OG/Twitter)</span>
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`min-h-[44px] py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 touch-manipulation ${
                  activeTab === 'schema'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>JSON-LD Schema</span>
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`min-h-[44px] py-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 touch-manipulation ${
                  activeTab === 'tags'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Meta Tags Table</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* 1. Google SERP Preview */}
              {activeTab === 'serp' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                      Google Search Result Snippet Preview
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-sans">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                          V
                        </div>
                        <span className="font-medium">{currentSEO.canonicalUrl}</span>
                      </div>
                      <h5 className="text-base text-blue-700 hover:underline font-medium cursor-pointer leading-snug">
                        {currentSEO.title}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {currentSEO.description}
                      </p>

                      {/* Product snippet enhancements if on PDP */}
                      {currentSEO.productMeta && (
                        <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 border-t border-slate-200 mt-2">
                          <span className="font-bold text-emerald-700">
                            ★ 4.9 (128 reviews)
                          </span>
                          <span>•</span>
                          <span className="font-bold text-slate-900">
                            {currentSEO.productMeta.priceAmount} {currentSEO.productMeta.priceCurrency}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">
                            {currentSEO.productMeta.availability === 'instock' ? 'In stock' : 'Out of stock'}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            Brand: {currentSEO.productMeta.brand}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indexing Status Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-blue-900">Robots Directive</div>
                      <div className="font-mono text-blue-700 font-semibold">{currentSEO.robots}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">Canonical Target</div>
                      <div className="font-mono text-slate-600 truncate">{currentSEO.canonicalUrl}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Social Media Preview */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Open Graph / Twitter Card Preview
                  </h4>
                  <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                    <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                      <img
                        src={currentSEO.ogImage}
                        alt={currentSEO.ogImageAlt || currentSEO.ogTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] uppercase font-bold tracking-wider text-slate-200">
                        {currentSEO.ogType}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        voltix-electronics.store
                      </span>
                      <h5 className="font-bold text-sm text-white line-clamp-1">
                        {currentSEO.ogTitle}
                      </h5>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {currentSEO.ogDescription}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. JSON-LD Schema */}
              {activeTab === 'schema' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                        Structured Data (schema.org)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Injected as <code className="text-blue-600">&lt;script type=&quot;application/ld+json&quot;&gt;</code>
                      </p>
                    </div>
                    <button
                      onClick={handleCopySchema}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
                    >
                      {copiedSchema ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
                    {JSON.stringify(currentSEO.structuredData, null, 2)}
                  </pre>
                </div>
              )}

              {/* 4. Meta Tags Table */}
              {activeTab === 'tags' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Rendered DOM Head Tags
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 font-mono text-[11px]">
                    <div className="p-2.5 bg-slate-50 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">&lt;title&gt;</span>
                      <span className="text-slate-800 text-end font-sans">{currentSEO.title}</span>
                    </div>
                    <div className="p-2.5 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">meta[name=&quot;description&quot;]</span>
                      <span className="text-slate-600 text-end font-sans">{currentSEO.description}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">link[rel=&quot;canonical&quot;]</span>
                      <span className="text-slate-800 text-end truncate">{currentSEO.canonicalUrl}</span>
                    </div>
                    <div className="p-2.5 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">meta[name=&quot;robots&quot;]</span>
                      <span className="text-slate-800 text-end">{currentSEO.robots}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">meta[property=&quot;og:type&quot;]</span>
                      <span className="text-slate-800 text-end">{currentSEO.ogType}</span>
                    </div>
                    <div className="p-2.5 flex items-start justify-between gap-4">
                      <span className="font-bold text-blue-700 shrink-0">meta[name=&quot;keywords&quot;]</span>
                      <span className="text-slate-600 text-end font-sans">{currentSEO.keywords.join(', ')}</span>
                    </div>
                    {currentSEO.productMeta && (
                      <div className="p-2.5 bg-slate-50 flex items-start justify-between gap-4">
                        <span className="font-bold text-emerald-700 shrink-0">product:price</span>
                        <span className="text-slate-800 text-end">
                          {currentSEO.productMeta.priceAmount} {currentSEO.productMeta.priceCurrency} ({currentSEO.productMeta.availability})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All tags synced dynamically to document head</span>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
