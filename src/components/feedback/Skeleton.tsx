import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'rounded' | 'circle' | 'text';
  animation?: 'pulse' | 'shimmer' | 'none';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  animation = 'shimmer',
  width,
  height,
  className = '',
  style,
  children,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded-none';
      case 'text':
        return 'rounded-md h-3.5 my-1';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse bg-slate-200/80';
      case 'none':
        return 'bg-slate-200/80';
      case 'shimmer':
      default:
        return 'relative overflow-hidden bg-slate-200/70 after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent';
    }
  };

  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading content"
      className={`select-none pointer-events-none ${getVariantClass()} ${getAnimationClass()} ${className}`}
      style={inlineStyles}
      {...props}
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
