/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { MobileNav } from './components/common/MobileNav';
import { HomeScreen } from './components/home/HomeScreen';
import { ProductListingScreen } from './components/plp/ProductListingScreen';
import { ProductDetailScreen } from './components/pdp/ProductDetailScreen';
import { CheckoutScreen } from './components/checkout/CheckoutScreen';

const MainContent: React.FC = () => {
  const { activeScreen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Dynamic Screen View */}
      <main className="flex-1">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'plp' && <ProductListingScreen />}
        {activeScreen === 'pdp' && <ProductDetailScreen />}
        {activeScreen === 'checkout' && <CheckoutScreen />}
      </main>

      {/* Global Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Global Wishlist Drawer */}
      <WishlistDrawer />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Global Footer */}
      <Footer />

      {/* Bottom Sticky Navigation on Mobile */}
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

