import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';
import { Breadcrumb } from '../common/Breadcrumb';

interface CategoriesPageProps {
  categories: Category[];
}

/**
 * Browse all root categories with images and product counts.
 */
export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories }) => {
  const { language, t, goHome } = useStore();

  const rootCategories = useMemo(
    () => categories.filter(c => !c.parentId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [categories]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: t('navHome'), onClick: goHome },
          { label: t('categories'), active: true },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t('browseByCategory')}</h1>
        <p className="text-slate-600 max-w-2xl">{t('categoriesDescription')}</p>
      </div>

      {rootCategories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">{t('noCategoriesAvailable')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rootCategories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image */}
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name[language]}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-xl font-bold text-white mb-1">{category.name[language]}</h2>
                <p className="text-sm text-gray-200">{category.count} {t('products')}</p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
