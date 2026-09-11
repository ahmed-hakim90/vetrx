/**
 * Design System Tokens
 * Voltix Retail System - Bilingual (EN/AR) & Responsive
 * All values from DESIGN.md specification
 */

export const colors = {
  // Primary palette
  primary: '#004ac6',
  'primary-hover': '#003aa0',
  'primary-active': '#002f7a',
  'primary-light': '#2563eb',
  'primary-container': '#dbe1ff',
  'on-primary': '#ffffff',

  // Secondary palette
  secondary: '#565e74',
  'secondary-hover': '#4a5266',
  'secondary-light': '#8892ac',
  'secondary-container': '#dae2fd',
  'on-secondary': '#ffffff',

  // Tertiary (success/green)
  tertiary: '#006243',
  'tertiary-light': '#007d57',
  'tertiary-container': '#85f8c4',
  'on-tertiary': '#ffffff',

  // Error (red)
  error: '#ba1a1a',
  'error-light': '#dc2626',
  'error-container': '#ffdad6',
  'on-error': '#ffffff',

  // Surfaces
  surface: '#ffffff',
  'surface-dim': '#d8dadc',
  'surface-bright': '#f7f9fb',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f2f4f6',
  'surface-container': '#eceef0',
  'surface-container-high': '#e6e8ea',
  'surface-container-highest': '#e0e3e5',
  'on-surface': '#191c1e',
  'on-surface-variant': '#434655',

  // Background
  background: '#f7f9fb',
  'on-background': '#191c1e',

  // Borders & dividers
  border: '#e2e8f0',
  'border-light': '#eceef0',
  'border-dark': '#d8dadc',

  // Inverse colors
  'inverse-surface': '#2d3133',
  'inverse-on-surface': '#eff1f3',
  'inverse-primary': '#b4c5ff',

  // Status colors
  'status-success': '#059669',
  'status-warning': '#d97706',
  'status-info': '#0891b2',

  // Text colors
  'text-primary': '#0f172a',
  'text-secondary': '#475569',
  'text-tertiary': '#64748b',
  'text-muted': '#94a3b8',

  // Deprecated: Use semantic color names above
  outline: '#737686',
  'outline-variant': '#c3c6d7',
  'surface-tint': '#0053db',
} as const;

export const typography = {
  // Display/Hero sizes
  displayHero: {
    fontSize: '48px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '56px',
    letterSpacing: '-0.5px',
  },
  displayHeroMobile: {
    fontSize: '32px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '40px',
    letterSpacing: '-0.25px',
  },

  // Headline sizes
  headlineXl: {
    fontSize: '36px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '44px',
    letterSpacing: '-0.25px',
  },
  headlineXlMobile: {
    fontSize: '26px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '34px',
  },
  headlineLg: {
    fontSize: '28px',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '36px',
  },
  headlineLgMobile: {
    fontSize: '22px',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '30px',
  },
  headlineMd: {
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '28px',
  },
  headlineSm: {
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '24px',
  },

  // Body text
  bodyLg: {
    fontSize: '18px',
    fontWeight: 400,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '28px',
  },
  bodyMd: {
    fontSize: '15px',
    fontWeight: 400,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '24px',
  },
  bodySm: {
    fontSize: '13px',
    fontWeight: 400,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '20px',
  },

  // Price display (tabular numerals)
  priceXl: {
    fontSize: '32px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '36px',
    fontVariantNumeric: 'tabular-nums',
  },
  priceMd: {
    fontSize: '20px',
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    lineHeight: '26px',
    fontVariantNumeric: 'tabular-nums',
  },

  // Labels
  labelMd: {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '20px',
  },
  labelSm: {
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '16px',
  },

  // Code/Specs
  specsCode: {
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '16px',
  },
} as const;

export const spacing = {
  '2xs': '0.25rem',  // 4px
  'xs': '0.5rem',    // 8px
  'sm': '0.75rem',   // 12px
  'md': '1rem',      // 16px
  'lg': '1.5rem',    // 24px
  'xl': '2rem',      // 32px
  '2xl': '3rem',     // 48px
  '3xl': '4rem',     // 64px
} as const;

export const gutters = {
  mobile: '1rem',    // 16px
  tablet: '1.5rem',  // 24px
  desktop: '2rem',   // 32px
} as const;

export const radius = {
  sm: '0.25rem',     // 4px
  default: '0.5rem', // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  full: '9999px',
} as const;

export const container = {
  maxWidth: '1360px',
} as const;

// Responsive breakpoints
export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1280px',
} as const;

// Grid columns per breakpoint
export const gridCols = {
  mobile: 4,   // 4-column grid
  tablet: 8,   // 8-column grid
  desktop: 12, // 12-column grid
} as const;

// Shadows/Elevation
export const elevation = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Animations
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Component-level tokens
export const components = {
  button: {
    padding: {
      sm: `${spacing.xs} ${spacing.md}`,
      md: `${spacing.sm} ${spacing.lg}`,
      lg: `${spacing.md} ${spacing.xl}`,
    },
    radius: radius.md,
    transitionDuration: transitions.fast,
  },
  card: {
    padding: spacing.lg,
    radius: radius.lg,
    borderWidth: '1px',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  badge: {
    padding: `${spacing.xs} ${spacing.sm}`,
    radius: radius.full,
  },
  input: {
    padding: spacing.md,
    radius: radius.md,
    borderWidth: '1px',
    borderColor: colors.border,
    backgroundColor: colors['surface-container-low'],
  },
  productCard: {
    radius: radius.lg,
    gap: spacing.md,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type TypographyToken = keyof typeof typography;
