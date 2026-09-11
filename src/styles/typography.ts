/**
 * Typography Utilities
 * Bilingual (EN/AR) support with responsive scaling
 */

import { typography } from './design-tokens';

export const fontFamilies = {
  heading: {
    en: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    ar: "'IBM Plex Sans Arabic', 'Plus Jakarta Sans', system-ui, sans-serif",
  },
  body: {
    en: "Inter, system-ui, -apple-system, sans-serif",
    ar: "'IBM Plex Sans Arabic', Inter, system-ui, sans-serif",
  },
  mono: {
    en: "'Courier New', monospace",
    ar: "'IBM Plex Mono', monospace",
  },
} as const;

// CSS class utilities for typography
export const typographyClasses = {
  // Display/Hero
  'display-hero': `
    font-size: 48px;
    font-weight: 700;
    line-height: 56px;
    letter-spacing: -0.5px;
  `,
  'display-hero-mobile': `
    font-size: 32px;
    font-weight: 700;
    line-height: 40px;
  `,

  // Headlines
  'headline-xl': `
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: -0.25px;
  `,
  'headline-xl-mobile': `
    font-size: 26px;
    font-weight: 700;
    line-height: 34px;
  `,
  'headline-lg': `
    font-size: 28px;
    font-weight: 600;
    line-height: 36px;
  `,
  'headline-lg-mobile': `
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
  `,
  'headline-md': `
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  `,
  'headline-sm': `
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  `,

  // Body
  'body-lg': `
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
  `,
  'body-md': `
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
  `,
  'body-sm': `
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  `,

  // Price (with tabular numerals)
  'price-xl': `
    font-size: 32px;
    font-weight: 700;
    line-height: 36px;
    font-variant-numeric: tabular-nums;
  `,
  'price-md': `
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    font-variant-numeric: tabular-nums;
  `,

  // Labels
  'label-md': `
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  `,
  'label-sm': `
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  `,

  // Code/Specs
  'specs-code': `
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
} as const;

/**
 * Generate responsive typography styles for a component
 * Scales from mobile to desktop automatically
 */
export function responsiveTypography(
  mobileStyle: keyof typeof typographyClasses,
  desktopStyle: keyof typeof typographyClasses = mobileStyle
) {
  const mobile = typographyClasses[mobileStyle];
  const desktop = typographyClasses[desktopStyle];

  return `
    ${mobile}

    @media (min-width: 768px) {
      ${desktop}
    }
  `;
}

/**
 * Mixin for bilingual font family with increased line-height for Arabic
 * Use in Tailwind or CSS-in-JS: fontFamily={getFont(language)}
 */
export function getFontFamily(language: 'en' | 'ar') {
  return language === 'ar' ? fontFamilies.heading.ar : fontFamilies.heading.en;
}

export function getBodyFontFamily(language: 'en' | 'ar') {
  return language === 'ar' ? fontFamilies.body.ar : fontFamilies.body.en;
}

/**
 * Adjust line-height for Arabic text
 * Arabic requires +10-15% line-height for tashkeel marks
 */
export function getLineHeightAdjustment(language: 'en' | 'ar', baseLineHeight: number) {
  return language === 'ar' ? baseLineHeight * 1.15 : baseLineHeight;
}

/**
 * Export typography scale as object for Tailwind fontSize config
 */
export const fontSizes = {
  xs: '12px',
  sm: '13px',
  base: '15px',
  lg: '18px',
  xl: '20px',
  '2xl': '28px',
  '3xl': '32px',
  '4xl': '36px',
  '5xl': '48px',
  'price-sm': '20px',
  'price-lg': '32px',
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.75,
  arabic: 1.65, // +15% for Arabic
} as const;

/**
 * Create a typography preset for use in styled components
 * Example: ${getTypographyPreset('headlineMd', 'en')}
 */
export function getTypographyPreset(
  preset: keyof typeof typography,
  language: 'en' | 'ar' = 'en'
) {
  const style = typography[preset];
  const fontFamily = preset.includes('price')
    ? fontFamilies.heading[language]
    : preset.includes('body') || preset.includes('label')
      ? fontFamilies.body[language]
      : fontFamilies.heading[language];

  const letterSpacing = (style as any).letterSpacing;
  const fontVariantNumeric = (style as any).fontVariantNumeric;

  return `
    font-family: ${fontFamily};
    font-size: ${style.fontSize};
    font-weight: ${style.fontWeight};
    line-height: ${getLineHeightAdjustment(language, parseFloat(style.lineHeight))};
    ${letterSpacing ? `letter-spacing: ${letterSpacing};` : ''}
    ${fontVariantNumeric ? `font-variant-numeric: ${fontVariantNumeric};` : ''}
  `;
}
