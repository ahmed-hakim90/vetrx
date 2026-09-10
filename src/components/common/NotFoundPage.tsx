import React from 'react';
import { useStore } from '../../context/StoreContext';

export const NotFoundPage: React.FC = () => {
  const { t, goHome } = useStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-6xl font-black text-slate-200" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('pageNotFoundTitle')}</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{t('pageNotFoundDesc')}</p>
      <button
        onClick={goHome}
        className="min-h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
      >
        {t('backToHome')}
      </button>
    </div>
  );
};

// A category id in the /category/:slug route that doesn't exist in this
// client's own catalog — never silently falls back to showing every product.
export const CategoryNotFound: React.FC = () => {
  const { t, goToProducts } = useStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('categoryNotFoundTitle')}</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{t('categoryNotFoundDesc')}</p>
      <button
        onClick={goToProducts}
        className="min-h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 touch-manipulation"
      >
        {t('backToProducts')}
      </button>
    </div>
  );
};
