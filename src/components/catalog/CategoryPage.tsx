import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Category, Product } from '../../types/store';
import { Breadcrumb } from '../common/Breadcrumb';
import { CategoryNotFound } from '../common/NotFoundPage';
import { ProductCard } from '../common/ProductCard';

interface CategoryPageProps {
  categories: Category[];
  products: Product[];
}

/**
 * Single category page with subcategories and filtered products.
 */
export const CategoryPage: React.FC<CategoryPageProps> = ({ categories, products }) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { language, t, goHome, navigateToCategory } = useStore();

  const currentCategory = useMemo(
    () => categories.find(c => c.slug === categorySlug),
    [categories, categorySlug]
  );

  const breadcrumbItems = useMemo(() => {
    if (!currentCategory) return [];
    const items: Array<{ label: string; onClick?: (() => void) | React.MouseEventHandler<HTMLButtonElement>; active?: boolean }> = [
      { label: t('navHome'), onClick: goHome },
    ];

    // Build breadcrumb trail from root to current
    let cat: Category | undefined = currentCategory;
    const trail: Category[] = [];
    while (cat) {
      trail.unshift(cat);
      if (cat.parentId) {
        cat = categories.find(c => c.id === cat!.parentId);
      } else {
        cat = undefined;
      }
    }

    trail.forEach((c, idx) => {
      const isActive = idx === trail.length - 1;
      if (isActive) {
        items.push({ label: c.name[language], active: true });
      } else {
        items.push({
          label: c.name[language],
          onClick: () => navigateToCategory(c.slug),
        });
      }
    });

    return items;
  }, [currentCategory, categories, language, t, goHome, navigateToCategory]);

  const subcategories = useMemo(
    () =>
      currentCategory
        ? categories
            .filter(c => c.parentId === currentCategory.id)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        : [],
    [currentCategory, categories]
  );

  // Get all category IDs including subcategories (for product filtering)
  const categoryIds = useMemo(() => {
    if (!currentCategory) return [];
    const ids = [currentCategory.id];
    const stack = [...subcategories];
    while (stack.length > 0) {
      const cat = stack.pop();
      if (cat) {
        ids.push(cat.id);
        stack.push(...categories.filter(c => c.parentId === cat.id));
      }
    }
    return ids;
  }, [currentCategory, subcategories, categories]);

  const filteredProducts = useMemo(
    () =>
      products.filter(p => {
        if (!currentCategory) return false;
        // Match by category slug or category name
        return (
          p.category === currentCategory.slug ||
          p.category === currentCategory.id ||
          categoryIds.includes(p.category)
        );
      }),
    [products, currentCategory, categoryIds]
  );

  if (!currentCategory) {
    return <CategoryNotFound />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {currentCategory.name[language]}
        </h1>
        {currentCategory.description && (
          <p className="text-slate-600 max-w-2xl">{currentCategory.description[language]}</p>
        )}
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{t('shopBySubcategory')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map(subcat => (
              <Link
                key={subcat.id}
                to={`/category/${subcat.slug}`}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center group"
              >
                <div className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                  {subcat.name[language]}
                </div>
                <div className="text-xs text-slate-600 mt-1">{subcat.count} {t('products')}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {t('products')} ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500">{t('noProductsInCategory')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
