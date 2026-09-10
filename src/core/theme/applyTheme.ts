import { ClientConfig } from '../../config/clients/schema';

const CSS_VAR_BY_TOKEN: Record<keyof ClientConfig['theme'], string> = {
  colorPrimary: '--color-primary',
  colorPrimaryHover: '--color-primary-hover',
  colorPrimaryForeground: '--color-primary-foreground',
  colorSecondary: '--color-secondary',
  colorAccent: '--color-accent',
  colorBackground: '--color-background',
  colorSurface: '--color-surface',
  colorText: '--color-text',
  colorMuted: '--color-muted',
  colorBorder: '--color-border',
  colorSuccess: '--color-success',
  colorError: '--color-error',
  radiusCard: '--radius-card',
  radiusButton: '--radius-button',
  fontSans: '--font-sans',
  fontHeading: '--font-heading',
};

// Injects the active client's design tokens as CSS custom properties on the
// root element. Tailwind's semantic utilities (bg-primary, text-surface,
// rounded-card, ...) read these variables, so no component ever hardcodes a
// brand color or radius directly. Tokens a client omits (e.g. colorSuccess)
// are simply left at the default defined in index.css.
export function applyTheme(config: ClientConfig): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [token, cssVar] of Object.entries(CSS_VAR_BY_TOKEN) as [
    keyof ClientConfig['theme'],
    string,
  ][]) {
    const value = config.theme[token];
    if (value) root.style.setProperty(cssVar, value);
  }
}
