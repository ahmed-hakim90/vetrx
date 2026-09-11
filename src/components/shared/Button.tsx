import React from 'react';
import { colors, components, radius, transitions } from '../../styles/design-tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles = {
  primary: `
    background-color: ${colors.primary};
    color: ${colors['on-primary']};
    border: 1px solid ${colors.primary};

    &:hover:not(:disabled) {
      background-color: ${colors['primary-hover']};
      border-color: ${colors['primary-hover']};
    }

    &:active:not(:disabled) {
      background-color: ${colors['primary-active']};
      border-color: ${colors['primary-active']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  secondary: `
    background-color: ${colors['secondary-container']};
    color: ${colors.secondary};
    border: 1px solid ${colors['surface-container-high']};

    &:hover:not(:disabled) {
      background-color: ${colors['surface-container-high']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  tertiary: `
    background-color: ${colors['tertiary-container']};
    color: ${colors['on-tertiary']};
    border: 1px solid ${colors.tertiary};

    &:hover:not(:disabled) {
      background-color: ${colors['tertiary-light']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  destructive: `
    background-color: ${colors.error};
    color: ${colors['on-error']};
    border: 1px solid ${colors.error};

    &:hover:not(:disabled) {
      background-color: ${colors['error-light']};
      border-color: ${colors['error-light']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  ghost: `
    background-color: transparent;
    color: ${colors.primary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${colors['surface-container']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
} as const;

const sizeStyles = {
  sm: {
    padding: `${components.button.padding.sm}`,
    fontSize: '12px',
    fontWeight: 500,
    minHeight: '32px',
  },
  md: {
    padding: `${components.button.padding.md}`,
    fontSize: '14px',
    fontWeight: 500,
    minHeight: '40px',
  },
  lg: {
    padding: `${components.button.padding.lg}`,
    fontSize: '16px',
    fontWeight: 600,
    minHeight: '48px',
  },
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];

    const baseStyles: React.CSSProperties = {
      display: fullWidth ? 'flex' : 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
      gap: icon && children ? '8px' : undefined,
      borderRadius: components.button.radius,
      transitionDuration: components.button.transitionDuration,
      transitionProperty: 'background-color, border-color, color',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'inherit',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      ...sizeConfig,
    };

    const variantClass = variant;

    return (
      <button
        ref={ref}
        style={baseStyles}
        className={`button button-${variant} button-${size} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
        // Apply variant styles via className for styled-components or Tailwind
        data-variant={variant}
        data-size={size}
      >
        {loading && (
          <span
            style={{
              display: 'inline-flex',
              animation: 'spin 1s linear infinite',
            }}
          >
            ⏳
          </span>
        )}
        {icon && iconPosition === 'left' && !loading && icon}
        {children}
        {icon && iconPosition === 'right' && !loading && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';
