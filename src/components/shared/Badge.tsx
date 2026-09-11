import React from 'react';
import { colors, components, radius } from '../../styles/design-tokens';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  filled?: boolean;
}

const statusStyles = {
  success: {
    bg: colors['tertiary-container'],
    text: colors.tertiary,
    border: colors.tertiary,
  },
  warning: {
    bg: '#fef3c7',
    text: colors['status-warning'],
    border: colors['status-warning'],
  },
  error: {
    bg: colors['error-container'],
    text: colors.error,
    border: colors.error,
  },
  info: {
    bg: '#cffafe',
    text: colors['status-info'],
    border: colors['status-info'],
  },
  neutral: {
    bg: colors['surface-container'],
    text: colors['on-surface-variant'],
    border: colors.border,
  },
} as const;

const sizeStyles = {
  sm: {
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 500,
  },
  md: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
  },
  lg: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
  },
} as const;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      status = 'neutral',
      size = 'md',
      filled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const statusStyle = statusStyles[status];
    const sizeStyle = sizeStyles[size];

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      fontWeight: sizeStyle.fontWeight,
      fontSize: sizeStyle.fontSize,
      padding: sizeStyle.padding,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      backgroundColor: filled ? statusStyle.bg : 'transparent',
      color: statusStyle.text,
      border: `1px solid ${statusStyle.border}`,
    };

    return (
      <span
        ref={ref}
        style={baseStyles}
        className={`badge badge-${status} badge-${size} ${filled ? 'badge-filled' : 'badge-outlined'} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
