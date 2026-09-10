import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';
import { Screen } from '../../types/store';

export interface BreadcrumbItem {
  label: string;
  screen?: Screen;
  categoryId?: string;
  productId?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHomeIcon = true,
}) => {
  const {
    activeScreen,
    setActiveScreen,
    filterState,
    setFilterState,
    selectedProductId,
    navigateToCategory,
    navigateToProduct,
    language,
    t,
  } = useStore();

  // Find active product and active category for automatic breadcrumb computation
  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId);
  const activeCategory = CATEGORIES.find(
    (c) =>
      c.id === filterState.category ||
      (activeScreen === 'pdp' && activeProduct && c.id === activeProduct.category)
  );

  // If explicit items provided, use them; otherwise auto-compute from current route & category
  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    const list: BreadcrumbItem[] = [
      {
        label: t('navHome'),
        screen: 'home',
        onClick: () => setActiveScreen('home'),
      },
    ];

    if (activeScreen === 'plp') {
      list.push({
        label: activeCategory ? activeCategory.name[language] : t('categoriesMega'),
        active: true,
      });
    } else if (activeScreen === 'pdp') {
      if (activeCategory) {
        list.push({
          label: activeCategory.name[language],
          screen: 'plp',
          categoryId: activeCategory.id,
          onClick: () => {
            setFilterState((prev) => ({ ...prev, category: activeCategory.id }));
            setActiveScreen('plp');
          },
        });
      }

      if (activeProduct) {
        list.push({
          label: activeProduct.title[language],
          active: true,
        });
      }
    } else if (activeScreen === 'checkout') {
      list.push({
        label: t('cart'),
        active: true,
      });
    } else if (activeScreen === 'order-confirmation') {
      list.push({
        label: t('cart'),
        screen: 'checkout',
        onClick: () => setActiveScreen('checkout'),
      });
      list.push({
        label: t('orderSuccessTitle').split('!')[0],
        active: true,
      });
    }

    return list;
  }, [
    items,
    activeScreen,
    activeCategory,
    activeProduct,
    language,
    t,
    setActiveScreen,
    setFilterState,
  ]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-xs text-slate-500 py-1.5 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`bc-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-slate-400 shrink-0 rtl:rotate-180"
                  aria-hidden="true"
                />
              )}

              {item.active || isLast ? (
                <span
                  className="font-bold text-slate-900 line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md cursor-default min-h-[36px] sm:min-h-0 flex items-center"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.categoryId) {
                      navigateToCategory(item.categoryId);
                    } else if (item.productId) {
                      navigateToProduct(item.productId);
                    } else if (item.screen) {
                      setActiveScreen(item.screen);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 active:text-blue-600 transition-colors cursor-pointer min-h-11 sm:min-h-0 py-1 px-1 rounded-md touch-manipulation hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {isFirst && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  )}
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
