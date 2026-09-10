import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export interface BreadcrumbItem {
  label: string;
  onClick?: (() => void) | React.MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

// When no explicit `items` are given, the trail is derived from the current
// route — real URLs, not `activeScreen` state — so it always matches what
// the address bar and back/forward history show.
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '', showHomeIcon = true }) => {
  const location = useLocation();
  const params = useParams();
  const { categories, getProductBySlug, language, t, goHome, goToCheckout, navigateToCategory } = useStore();

  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) return items;

    const path = location.pathname;
    const list: BreadcrumbItem[] = [{ label: t('navHome'), onClick: goHome }];

    if (path === '/products') {
      list.push({ label: t('allProductsTitle'), active: true });
    } else if (path.startsWith('/category/')) {
      const category = categories.find((c) => c.id === params.categorySlug);
      list.push({
        label: category ? category.name[language] : t('categoriesMega'),
        active: true,
      });
    } else if (path.startsWith('/search')) {
      list.push({ label: t('categoriesMega'), active: true });
    } else if (path.startsWith('/product/')) {
      const product = params.productSlug ? getProductBySlug(params.productSlug) : undefined;
      if (product) {
        const category = categories.find((c) => c.id === product.category);
        if (category) {
          list.push({ label: category.name[language], onClick: () => navigateToCategory(category.id) });
        }
        list.push({ label: product.title[language], active: true });
      } else {
        list.push({ label: t('productNotFoundTitle'), active: true });
      }
    } else if (path === '/cart') {
      list.push({ label: t('cartPageTitle'), active: true });
    } else if (path === '/wishlist') {
      list.push({ label: t('wishlistPageTitle'), active: true });
    } else if (path === '/checkout') {
      list.push({ label: t('cart'), active: true });
    } else if (path.startsWith('/order/')) {
      list.push({ label: t('cart'), onClick: goToCheckout });
      list.push({ label: t('orderSuccessTitle').split('!')[0], active: true });
    }

    return list;
  }, [items, location.pathname, params, categories, language, t, goHome, goToCheckout, navigateToCategory, getProductBySlug]);

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
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 rtl:rotate-180" aria-hidden="true" />
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
                  onClick={item.onClick}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 active:text-blue-600 transition-colors cursor-pointer min-h-11 sm:min-h-0 py-1 px-1 rounded-md touch-manipulation hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {isFirst && showHomeIcon && <Home className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
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
