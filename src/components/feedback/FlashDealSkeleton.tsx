import React from 'react';
import { Skeleton } from './Skeleton';

export interface FlashDealSkeletonProps {
  className?: string;
}

export const FlashDealSkeleton: React.FC<FlashDealSkeletonProps> = ({ className = '' }) => {
  return (
    <section
      className={`max-w-7xl mx-auto px-4 ${className}`}
      aria-label="Loading flash deal"
    >
      <div className="bg-gradient-to-r from-rose-950 via-slate-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-rose-900/60 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info & timer */}
          <div className="space-y-4 max-w-xl w-full text-center md:text-start">
            <Skeleton
              variant="rounded"
              className="w-32 h-6 rounded-full bg-rose-900/60 after:via-white/10 mx-auto md:mx-0"
            />

            <div className="space-y-2">
              <Skeleton
                variant="rounded"
                className="w-3/4 h-8 bg-slate-800/80 after:via-white/10 mx-auto md:mx-0"
              />
              <Skeleton
                variant="text"
                className="w-full h-3.5 bg-slate-800/80 after:via-white/10"
              />
              <Skeleton
                variant="text"
                className="w-4/5 h-3.5 bg-slate-800/80 after:via-white/10"
              />
            </div>

            {/* Countdown timers placeholder */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <Skeleton
                variant="rounded"
                className="w-14 h-12 rounded-lg bg-slate-900 border border-rose-900/40 after:via-white/10"
              />
              <span className="text-rose-500 font-bold">:</span>
              <Skeleton
                variant="rounded"
                className="w-14 h-12 rounded-lg bg-slate-900 border border-rose-900/40 after:via-white/10"
              />
              <span className="text-rose-500 font-bold">:</span>
              <Skeleton
                variant="rounded"
                className="w-14 h-12 rounded-lg bg-slate-900 border border-rose-900/40 after:via-white/10"
              />
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 max-w-sm pt-1 mx-auto md:mx-0">
              <div className="flex justify-between">
                <Skeleton variant="text" className="w-20 h-3 bg-slate-800" />
                <Skeleton variant="text" className="w-24 h-3 bg-slate-800" />
              </div>
              <Skeleton
                variant="rounded"
                className="w-full h-2.5 rounded-full bg-slate-900 border border-rose-950"
              />
            </div>
          </div>

          {/* Right Product Spotlight card */}
          <div className="bg-white rounded-xl p-5 shadow-2xl max-w-xs w-full text-center space-y-3 shrink-0">
            <Skeleton variant="rounded" className="w-48 h-48 mx-auto rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="w-28 h-6 mx-auto" />
              <Skeleton variant="text" className="w-20 h-3 mx-auto" />
            </div>
            <Skeleton variant="rounded" className="w-full min-h-[44px] rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
