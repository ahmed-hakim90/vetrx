import React from 'react';
import { Skeleton } from './Skeleton';

export interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  viewMode = 'grid',
  className = '',
}) => {
  if (viewMode === 'list') {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-5 items-center shadow-2xs ${className}`}
      >
        {/* Thumbnail skeleton */}
        <div className="relative w-full sm:w-44 h-44 bg-slate-50 rounded-xl p-3 shrink-0 flex items-center justify-center">
          <Skeleton variant="rounded" className="w-32 h-32 rounded-xl" />
          <Skeleton
            variant="rounded"
            className="absolute top-2 left-2 rtl:left-auto rtl:right-2 w-14 h-4 rounded"
          />
        </div>

        {/* Middle Details skeleton */}
        <div className="flex-1 min-w-0 w-full space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="w-20 h-3" />
            <Skeleton variant="rounded" className="w-16 h-3 rounded" />
          </div>

          <Skeleton variant="text" className="w-3/4 h-5" />
          <Skeleton variant="text" className="w-full h-3" />
          <Skeleton variant="text" className="w-4/5 h-3" />

          <div className="flex flex-wrap gap-1.5 pt-1">
            <Skeleton variant="rounded" className="w-16 h-5 rounded" />
            <Skeleton variant="rounded" className="w-20 h-5 rounded" />
            <Skeleton variant="rounded" className="w-14 h-5 rounded" />
          </div>
        </div>

        {/* Right Pricing & Actions skeleton */}
        <div className="w-full sm:w-48 pt-4 sm:pt-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-slate-100 sm:pl-5 rtl:sm:pl-0 rtl:sm:pr-5 flex flex-col justify-between gap-4 text-start">
          <div className="space-y-1.5">
            <Skeleton variant="text" className="w-24 h-6" />
            <Skeleton variant="text" className="w-16 h-3" />
            <Skeleton variant="text" className="w-14 h-3" />
          </div>

          <div className="flex items-center gap-1.5">
            <Skeleton variant="rounded" className="flex-1 min-h-[44px] rounded-xl" />
            <Skeleton variant="rounded" className="w-11 h-11 rounded-xl" />
            <Skeleton variant="rounded" className="w-11 h-11 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Grid View
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 flex flex-col justify-between overflow-hidden shadow-2xs ${className}`}
    >
      {/* Image Skeleton with Badges */}
      <div className="relative bg-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden">
        <Skeleton variant="rounded" className="w-3/4 h-3/4 rounded-xl" />

        {/* Top-left badge placeholder */}
        <Skeleton
          variant="rounded"
          className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-14 h-4 rounded"
        />

        {/* Top-right floating action buttons placeholder */}
        <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex flex-col gap-1.5">
          <Skeleton variant="circle" className="w-10 h-10" />
          <Skeleton variant="circle" className="w-10 h-10" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Brand + Rating row */}
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="w-16 h-3" />
            <Skeleton variant="rounded" className="w-14 h-3.5 rounded" />
          </div>

          {/* Product Title lines */}
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-2/3 h-4" />

          {/* Spec badge */}
          <Skeleton variant="rounded" className="w-28 h-4 rounded mt-1" />
        </div>

        {/* Footer: Price + Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton variant="text" className="w-20 h-5" />
            <Skeleton variant="text" className="w-12 h-3" />
          </div>
          <Skeleton variant="rounded" className="w-28 min-h-[44px] rounded-xl" />
        </div>
      </div>
    </div>
  );
};
