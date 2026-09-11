import React from 'react';
import { colors, components, elevation } from '../../styles/design-tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'outlined',
      interactive = false,
      clickable = false,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      borderRadius: components.card.radius,
      padding: components.card.padding,
      backgroundColor: components.card.backgroundColor,
      border: `${components.card.borderWidth} solid ${components.card.borderColor}`,
      transitionProperty: 'box-shadow, background-color, border-color',
      transitionDuration: '200ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: clickable ? 'pointer' : 'default',
    };

    // Variant-specific styles
    if (variant === 'elevated') {
      baseStyles.boxShadow = elevation.md;
      baseStyles.border = 'none';
    } else if (variant === 'filled') {
      baseStyles.backgroundColor = colors['surface-container-low'];
      baseStyles.border = 'none';
    }

    // Interactive hover effect
    if (interactive || clickable) {
      baseStyles.cursor = clickable ? 'pointer' : 'auto';
    }

    return (
      <div
        ref={ref}
        style={baseStyles}
        className={`card card-${variant} ${interactive ? 'card-interactive' : ''} ${clickable ? 'card-clickable' : ''} ${className}`}
        onClick={onClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
