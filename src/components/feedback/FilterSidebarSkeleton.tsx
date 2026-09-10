import React from 'react';
import { Skeleton } from './Skeleton';

export interface FilterSidebarSkeletonProps {
  className?: string;
}

export const FilterSidebarSkeleton: React.FC<FilterSidebarSkeletonProps> = ({
  className = '',
}) => {
  return (
    <aside
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6 ${className}`}
      aria-label="Loading filters sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <Skeleton variant="text" className="w-16 h-4" />
        <Skeleton variant="text" className="w-12 h-3" />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-28 h-3 uppercase" />
        <div className="space-y-1.5 pt-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rounded" className="w-full h-8 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-20 h-3" />
          <Skeleton variant="text" className="w-16 h-3.5" />
        </div>
        <Skeleton variant="rounded" className="w-full h-2.5 rounded-full" />
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-12 h-2.5" />
          <Skeleton variant="text" className="w-12 h-2.5" />
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <Skeleton variant="text" className="w-20 h-3 uppercase" />
        <div className="space-y-2 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton variant="rounded" className="w-4 h-4 rounded" />
              <Skeleton variant="text" className="w-24 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* In Stock Only Switch */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Skeleton variant="text" className="w-20 h-3.5" />
        <Skeleton variant="rounded" className="w-5 h-5 rounded" />
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <Skeleton variant="text" className="w-28 h-3 uppercase" />
        <div className="space-y-2 pt-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" className="w-full h-6 rounded-md" />
          ))}
        </div>
      </div>
    </aside>
  );
};
