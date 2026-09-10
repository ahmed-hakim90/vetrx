/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SEOManager } from './components/common/SEOManager';
import { MobileNav } from './components/common/MobileNav';
import { ScrollToTop } from './components/common/ScrollToTop';
import { NotFoundPage } from './components/common/NotFoundPage';

const HomeScreen = lazy(() => import('./components/home/HomeScreen').then((m) => ({ default: m.HomeScreen })));
const ProductListingScreen = lazy(() =>
  import('./components/plp/ProductListingScreen').then((m) => ({ default: m.ProductListingScreen }))
);
const ProductDetailScreen = lazy(() =>
  import('./components/pdp/ProductDetailScreen').then((m) => ({ default: m.ProductDetailScreen }))
);
const CartPage = lazy(() => import('./components/cart/CartPage').then((m) => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('./components/wishlist/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const CheckoutScreen = lazy(() =>
  import('./components/checkout/CheckoutScreen').then((m) => ({ default: m.CheckoutScreen }))
);
const OrderConfirmationScreen = lazy(() =>
  import('./components/checkout/OrderConfirmationScreen').then((m) => ({ default: m.OrderConfirmationScreen }))
);
const ContactPage = lazy(() => import('./components/info/ContactPage').then((m) => ({ default: m.ContactPage })));
const CategoriesPage = lazy(() => import('./components/catalog/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const CategoryPage = lazy(() => import('./components/catalog/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const BrandsPage = lazy(() => import('./components/catalog/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const BrandPage = lazy(() => import('./components/catalog/BrandPage').then((m) => ({ default: m.BrandPage })));

const About = lazy(() => import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="about" titleKey="navAbout" /> })));
const Faq = lazy(() => import('./components/info/InfoPage').then((m) => ({ default: m.FaqPage })));
const ShippingInfoPage = lazy(() =>
  import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="shippingInfo" titleKey="navShippingInfo" /> }))
);
const ReturnsInfoPage = lazy(() =>
  import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="returnsInfo" titleKey="navReturnsInfo" /> }))
);
const WarrantyInfoPage = lazy(() =>
  import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="warrantyInfo" titleKey="navWarrantyInfo" /> }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="privacyPolicy" titleKey="navPrivacyPolicy" /> }))
);
const TermsPage = lazy(() =>
  import('./components/info/InfoPage').then((m) => ({ default: () => <m.InfoPage docKey="termsOfService" titleKey="navTermsOfService" /> }))
);

function PageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

// Dev-only: this build's catalog, prices and stock are placeholder data, and
// the store now carries a real brand identity — so say so while developing
// and reviewing. Never rendered in a production build (see README: a
// production deployment must not carry a "demo" banner; it must carry real
// data instead).
const DemoCatalogNotice: React.FC = () => {
  const { client, t } = useStore();
  if (!import.meta.env.DEV || client.commerce.provider !== 'mock') return null;

  return (
    <div role="status" className="bg-amber-100 text-amber-950 text-xs font-semibold px-4 py-2 text-center">
      {t('demoCatalogNotice')}
    </div>
  );
};

// Wrappers to pass store data to new pages
const CategoriesPageWrapper: React.FC = () => {
  const { categories } = useStore();
  return <CategoriesPage categories={categories} />;
};

const CategoryPageWrapper: React.FC = () => {
  const { categories, products } = useStore();
  return <CategoryPage categories={categories} products={products} />;
};

const BrandsPageWrapper: React.FC = () => {
  const { products } = useStore();
  return <BrandsPage products={products} />;
};

const BrandPageWrapper: React.FC = () => {
  const { products } = useStore();
  return <BrandPage products={products} />;
};

const MainContent: React.FC = () => {
  const { t } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        {t('skipToContent')}
      </a>

      <SEOManager />
      <ScrollToTop />
      <DemoCatalogNotice />
      <Header />

      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/products" element={<ProductListingScreen />} />
            <Route path="/categories" element={<CategoriesPageWrapper />} />
            <Route path="/category/:categorySlug" element={<CategoryPageWrapper />} />
            <Route path="/brands" element={<BrandsPageWrapper />} />
            <Route path="/brand/:brandSlug" element={<BrandPageWrapper />} />
            <Route path="/search" element={<ProductListingScreen />} />
            <Route path="/product/:productSlug" element={<ProductDetailScreen />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/order/:orderId" element={<OrderConfirmationScreen />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/shipping" element={<ShippingInfoPage />} />
            <Route path="/returns" element={<ReturnsInfoPage />} />
            <Route path="/warranty" element={<WarrantyInfoPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <QuickViewModal />
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
