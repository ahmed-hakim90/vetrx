import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

/**
 * Mobile navigation drawer with multi-level category support.
 * Supports back/forward navigation with scroll restoration.
 */
export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose, categories }) => {
  const { language, setLanguage, navigateToCategory, goToProducts, goToCart, goToWishlist, client, t } = useStore();
  const [navigationStack, setNavigationStack] = useState<Category[][]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [scrollPositions, setScrollPositions] = useState<Record<number, number>>({});

  // Initialize with root categories
  useEffect(() => {
    if (isOpen) {
      const rootCategories = categories.filter(c => !c.parentId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setNavigationStack([rootCategories]);
      setCurrentLevel(0);
      setScrollPositions({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, categories]);

  const getCurrentCategories = () => navigationStack[currentLevel] || [];

  const handleCategoryClick = (category: Category) => {
    const children = categories
      .filter(c => c.parentId === category.id)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (children.length > 0) {
      // Save scroll position
      const drawer = document.getElementById('menu-drawer-content');
      if (drawer) {
        setScrollPositions(prev => ({ ...prev, [currentLevel]: drawer.scrollTop }));
      }
      // Navigate to children
      setNavigationStack(prev => [...prev, children]);
      setCurrentLevel(currentLevel + 1);
      // Reset scroll
      setTimeout(() => {
        const drawer = document.getElementById('menu-drawer-content');
        if (drawer) drawer.scrollTop = 0;
      }, 0);
    } else {
      // Leaf category - navigate to products
      navigateToCategory(category.slug);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentLevel > 0) {
      const drawer = document.getElementById('menu-drawer-content');
      if (drawer) {
        setScrollPositions(prev => ({ ...prev, [currentLevel]: drawer.scrollTop }));
      }
      setCurrentLevel(currentLevel - 1);
      setTimeout(() => {
        const drawer = document.getElementById('menu-drawer-content');
        if (drawer) {
          drawer.scrollTop = scrollPositions[currentLevel - 1] || 0;
        }
      }, 0);
    }
  };

  const handleNavigateToProducts = () => {
    goToProducts();
    onClose();
  };

  const currentCategories = getCurrentCategories();
  const isRoot = currentLevel === 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 transform transition-transform duration-300 overflow-hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('navigation')}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          {!isRoot ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-slate-800 rounded transition-colors"
              aria-label={t('back')}
            >
              {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          ) : (
            <span className="font-bold text-sm">{client.displayName[language]}</span>
          )}
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-slate-800 rounded transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          id="menu-drawer-content"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        >
          {isRoot && (
            <>
              <button
                onClick={handleNavigateToProducts}
                className="w-full text-left px-4 py-3 text-slate-900 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t('shopAll')}
              </button>
              <hr className="my-2" />
            </>
          )}

          {currentCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left px-4 py-3 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between group"
            >
              <span className="font-medium">{category.name[language]}</span>
              {categories.some(c => c.parentId === category.id) && (
                language === 'ar' ? <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              )}
            </button>
          ))}

          {isRoot && (
            <>
              <hr className="my-2" />
              <button
                onClick={goToWishlist}
                className="w-full text-left px-4 py-3 text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t('favorites')}
              </button>
              <button
                onClick={goToCart}
                className="w-full text-left px-4 py-3 text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t('cart')}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{t('language')}:</span>
            <div className="flex gap-2">
              {(['en', 'ar'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
