/**
 * Theme-to-logo path mapping.
 *
 * Each entry maps a theme ID to its recolored brandlogo SVG at
 * `/public/logos/{theme}-brandlogo.svg`, plus CSS-extracted palette colors.
 *
 * SVG assets are produced by `scripts/generate-theme-svg-logos.ts` which
 * outlines the wordmark text (DM Sans ExtraBold) and recolors the leaf
 * fill + wordmark fill to the specified `logoColor`.
 *
 * `logoColor` is the exact hex used for the leaf and wordmark in that
 * theme's SVG (heading color for light themes, #FFFFFF for dark themes).
 */

export interface ThemeColors {
  primary: string;
  heading: string;
  background: string;
}

export interface ThemeLogoEntry extends ThemeColors {
  logoPath: string;
  logoColor: string;
}

export const THEME_LOGO_CONFIG: Record<string, ThemeLogoEntry> = {
  mint: {
    primary: "#66b2b2",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/mint-brandlogo.svg",
  },
  blush: {
    primary: "#e899b0",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/blush-brandlogo.svg",
  },
  slate: {
    primary: "#64748b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/slate-brandlogo.svg",
  },
  midnight: {
    primary: "#1e293b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/midnight-brandlogo.svg",
  },
  ocean: {
    primary: "#1da2d8",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/ocean-brandlogo.svg",
  },
  forest: {
    primary: "#10b981",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/forest-brandlogo.svg",
  },
  "clinical-light": {
    primary: "#3b82f6",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/clinical-light-brandlogo.svg",
  },
  "dark-clinical": {
    primary: "#06b6d4",
    heading: "#f1f5f9",
    background: "#1e293b",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-clinical-brandlogo.svg",
  },
  "pastel-blush": {
    primary: "#f5838e",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-blush-brandlogo.svg",
  },
  "pastel-lavender": {
    primary: "#a78bda",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-lavender-brandlogo.svg",
  },
  "pastel-mint": {
    primary: "#4fd1a5",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-mint-brandlogo.svg",
  },
  "neutral-sand": {
    primary: "#a08060",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/neutral-sand-brandlogo.svg",
  },
  "neutral-slate": {
    primary: "#708090",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/neutral-slate-brandlogo.svg",
  },
  "dark-academia": {
    primary: "#8b7355",
    heading: "#faf5ef",
    background: "#2c2418",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-academia-brandlogo.svg",
  },
  "rose-gold": {
    primary: "#b76e79",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/rose-gold-brandlogo.svg",
  },
  coral: {
    primary: "#ff6b6b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/coral-brandlogo.svg",
  },
  indigo: {
    primary: "#6366f1",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/indigo-brandlogo.svg",
  },
  teal: {
    primary: "#14b8a6",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/teal-brandlogo.svg",
  },
  berry: {
    primary: "#a855f7",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/berry-brandlogo.svg",
  },
  "pastel-lilac": {
    primary: "#b48ed2",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-lilac-brandlogo.svg",
  },
  "soft-sage": {
    primary: "#7da87d",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/soft-sage-brandlogo.svg",
  },
  "dark-mode": {
    primary: "#4a6fa5",
    heading: "#e8eef7",
    background: "#2e3b4e",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-mode-brandlogo.svg",
  },
  strawberry: {
    primary: "#fd9cb3",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/strawberry-brandlogo.svg",
  },
  "multi-pastel": {
    primary: "#90b4d4",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/multi-pastel-brandlogo.svg",
  },
  "deep-twilight": {
    primary: "#2A1E4A",
    heading: "#F0EAF8",
    background: "#1E1838",
    logoColor: "#FFFFFF",
    logoPath: "/logos/deep-twilight-brandlogo.svg",
  },
  "midnight-indigo": {
    primary: "#021A54",
    heading: "#F5F7FF",
    background: "#14204F",
    logoColor: "#FFFFFF",
    logoPath: "/logos/midnight-indigo-brandlogo.svg",
  },
  lavender: {
    primary: "#9d82dd",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/lavender-brandlogo.svg",
  },
  "lavender-dream": {
    primary: "#BDA6CE",
    heading: "#3E2F5B",
    background: "#ffffff",
    logoColor: "#3E2F5B",
    logoPath: "/logos/lavender-dream-brandlogo.svg",
  },
  "blueberry-sherbet": {
    primary: "#3852B4",
    heading: "#1F2A44",
    background: "#ffffff",
    logoColor: "#1F2A44",
    logoPath: "/logos/blueberry-sherbet-brandlogo.svg",
  },
  "strawberry-cream": {
    primary: "#EA7B7B",
    heading: "#5A2A2A",
    background: "#ffffff",
    logoColor: "#5A2A2A",
    logoPath: "/logos/strawberry-cream-brandlogo.svg",
  },
  "ocean-mist": {
    primary: "#1D546D",
    heading: "#0F2E3A",
    background: "#ffffff",
    logoColor: "#0F2E3A",
    logoPath: "/logos/ocean-mist-brandlogo.svg",
  },
  "mint-breeze": {
    primary: "#3A9E8F",
    heading: "#1A3A34",
    background: "#ffffff",
    logoColor: "#1A3A34",
    logoPath: "/logos/mint-breeze-brandlogo.svg",
  },
  "rose-quartz": {
    primary: "#C4788A",
    heading: "#4A2230",
    background: "#ffffff",
    logoColor: "#4A2230",
    logoPath: "/logos/rose-quartz-brandlogo.svg",
  },
  "golden-hour": {
    primary: "#B8860B",
    heading: "#3D2E0A",
    background: "#ffffff",
    logoColor: "#3D2E0A",
    logoPath: "/logos/golden-hour-brandlogo.svg",
  },
  "sage-garden": {
    primary: "#6B8E6B",
    heading: "#2A3C28",
    background: "#ffffff",
    logoColor: "#2A3C28",
    logoPath: "/logos/sage-garden-brandlogo.svg",
  },
  "coral-sunset": {
    primary: "#E07050",
    heading: "#4A1E14",
    background: "#ffffff",
    logoColor: "#4A1E14",
    logoPath: "/logos/coral-sunset-brandlogo.svg",
  },
  "arctic-frost": {
    primary: "#4A7A9B",
    heading: "#1A2E40",
    background: "#ffffff",
    logoColor: "#1A2E40",
    logoPath: "/logos/arctic-frost-brandlogo.svg",
  },
  "plum-velvet": {
    primary: "#7A4A8A",
    heading: "#30183A",
    background: "#ffffff",
    logoColor: "#30183A",
    logoPath: "/logos/plum-velvet-brandlogo.svg",
  },
  "honey-cream": {
    primary: "#A07840",
    heading: "#3A2A10",
    background: "#ffffff",
    logoColor: "#3A2A10",
    logoPath: "/logos/honey-cream-brandlogo.svg",
  },
  "dusty-rose": {
    primary: "#B07080",
    heading: "#3E1E24",
    background: "#ffffff",
    logoColor: "#3E1E24",
    logoPath: "/logos/dusty-rose-brandlogo.svg",
  },
};

/** Convenience re-export as THEME_LOGOS for simpler lookup. */
export const THEME_LOGOS: Record<string, string> = Object.fromEntries(
  Object.entries(THEME_LOGO_CONFIG).map(([k, v]) => [k, v.logoPath]),
);

export function getThemeLogoPath(themeId: string): string | null {
  return THEME_LOGO_CONFIG[themeId]?.logoPath ?? null;
}

export function getThemeColors(themeId: string): ThemeColors | null {
  const entry = THEME_LOGO_CONFIG[themeId];
  if (!entry) return null;
  return { primary: entry.primary, heading: entry.heading, background: entry.background };
}
