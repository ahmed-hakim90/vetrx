import React from 'react';
import { Skeleton } from './Skeleton';

export interface HeroBannerSkeletonProps {
  className?: string;
}

export const HeroBannerSkeleton: React.FC<HeroBannerSkeletonProps> = ({ className = '' }) => {
  return (
    <section
      className={`relative overflow-hidden bg-slate-950 text-white rounded-2xl mx-4 lg:mx-auto max-w-7xl mt-4 border border-slate-800 shadow-xl ${className}`}
      aria-label="Loading hero banner"
    >
      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text & Spec Skeletons */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow badge */}
          <Skeleton
            variant="rounded"
            className="w-40 h-6 rounded-full bg-slate-800/80 after:via-white/10"
          />

          {/* Headline */}
          <div className="space-y-2.5">
            <Skeleton
              variant="rounded"
              className="w-full sm:w-4/5 h-9 sm:h-12 bg-slate-800/80 after:via-white/10"
            />
            <Skeleton
              variant="rounded"
              className="w-3/4 sm:w-3/5 h-9 sm:h-12 bg-slate-800/80 after:via-white/10"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5 max-w-xl">
            <Skeleton
              variant="text"
              className="w-full h-4 bg-slate-800/80 after:via-white/10"
            />
            <Skeleton
              variant="text"
              className="w-4/5 h-4 bg-slate-800/80 after:via-white/10"
            />
          </div>

          {/* Quick Tech Specs Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center space-y-1.5"
              >
                <Skeleton
                  variant="text"
                  className="w-12 h-5 mx-auto bg-slate-800 after:via-white/10"
                />
                <Skeleton
                  variant="text"
                  className="w-16 h-3 mx-auto bg-slate-800/60 after:via-white/10"
                />
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Skeleton
              variant="rounded"
              className="w-36 min-h-[44px] rounded-xl bg-blue-900/60 after:via-white/20"
            />
            <Skeleton
              variant="rounded"
              className="w-32 min-h-[44px] rounded-xl bg-slate-800/80 after:via-white/10"
            />
          </div>
        </div>

        {/* Right Showcase Image Skeleton */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-full max-w-sm">
            <Skeleton
              variant="rounded"
              className="w-full aspect-[4/5] sm:aspect-square rounded-2xl bg-slate-900 border border-slate-800 after:via-white/10"
            />
            <div className="absolute -bottom-4 -left-4 rtl:-left-auto rtl:-right-4 bg-slate-900/95 border border-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3 w-56">
              <Skeleton
                variant="rounded"
                className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 after:via-white/10"
              />
              <div className="space-y-1.5 flex-1">
                <Skeleton
                  variant="text"
                  className="w-20 h-2.5 bg-slate-800 after:via-white/10"
                />
                <Skeleton
                  variant="text"
                  className="w-32 h-3.5 bg-slate-700 after:via-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
