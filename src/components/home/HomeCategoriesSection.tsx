import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';
import { getCategoryIcon } from '../../core/catalog/categoryIcons';

interface HomeCategoriesSectionProps {
  categories: Category[];
}

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({ categories }) => {
  const { language, navigateToCategory } = useStore();

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {language === 'ar' ? 'استكشف الفئات الرئيسية' : 'Explore Core Tech Categories'}
        </h2>
        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
          {language === 'ar' ? 'اعرض الكل' : 'View All'}
          <ChevronRight size={16} />
        </a>
      </div>

      {/* Categories Grid - 6 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((category) => {
          const IconComponent = getCategoryIcon(category.id);
          return (
            <button
              key={category.id}
              onClick={() => navigateToCategory(category.slug)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name.en}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  IconComponent && <IconComponent size={24} className="text-slate-600 group-hover:text-blue-600" />
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                  {language === 'ar' ? category.name.ar : category.name.en}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {category.count || 0} {language === 'ar' ? 'منتج' : 'products'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
