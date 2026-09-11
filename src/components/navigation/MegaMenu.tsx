import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface MegaMenuProps {
  category: Category;
  subcategories: Category[];
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ category, subcategories }) => {
  const { language, navigateToCategory, t } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button
        onClick={() => navigateToCategory(category.slug)}
        className="min-h-[38px] flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      >
        <span>{category.name[language]}</span>
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && subcategories.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-slate-200 rounded-lg shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-150 min-w-[400px]">
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Column 1: Direct subcategories */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">
                {language === 'ar' ? 'الفئات الفرعية' : 'Subcategories'}
              </h3>
              <div className="space-y-2">
                {subcategories.slice(0, 5).map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => {
                      navigateToCategory(subcat.slug);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    {language === 'ar' ? (
                      <span className="flex items-center justify-between">
                        <ChevronLeft className="w-4 h-4" />
                        {subcat.name[language]}
                      </span>
                    ) : (
                      <span className="flex items-center justify-between">
                        {subcat.name[language]}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Featured category image or description */}
            <div className="border-l border-slate-200 pl-6">
              <div className="flex flex-col gap-3">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name[language]}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {category.name[language]}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {category.description?.[language] || `${category.count} ${t('products')}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigateToCategory(category.slug);
                    setIsOpen(false);
                  }}
                  className="mt-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-colors text-sm"
                >
                  {language === 'ar' ? 'عرض الكل' : 'View All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
