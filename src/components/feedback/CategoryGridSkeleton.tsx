import React from 'react';
import { Skeleton } from './Skeleton';

export interface CategoryGridSkeletonProps {
  count?: number;
  className?: string;
}

export const CategoryGridSkeleton: React.FC<CategoryGridSkeletonProps> = ({
  count = 6,
  className = '',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <section className={`max-w-7xl mx-auto px-4 ${className}`} aria-label="Loading categories">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1.5">
          <Skeleton variant="text" className="w-36 sm:w-48 h-6 sm:h-7" />
          <Skeleton variant="text" className="w-48 sm:w-64 h-3.5" />
        </div>
        <Skeleton variant="rounded" className="w-24 h-8 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {items.map((key) => (
          <div
            key={key}
            className="min-h-[96px] p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-2xs space-y-2"
          >
            <Skeleton variant="rounded" className="w-12 h-12 rounded-xl" />
            <Skeleton variant="text" className="w-16 h-3" />
            <Skeleton variant="text" className="w-10 h-2.5" />
          </div>
        ))}
      </div>
    </section>
  );
};
