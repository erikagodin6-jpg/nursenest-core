/**
 * Theme-to-logo path mapping — generated from `src/app/theme-palettes.css`.
 *
 * Each entry maps a theme ID to its recolored brandlogo PNG at
 * `/public/logos/{theme}-brandlogo.png`, plus the CSS-extracted palette colors.
 *
 * Logo assets are produced by `scripts/generate-theme-brandlogos.ts` which
 * recolors the base SVG (`public/branding/nursenest-mark.svg`).
 *
 * `logoColor` is the exact hex used for the leaf strokes + wordmark fill in
 * that theme's PNG (heading color for light themes, #FFFFFF for dark themes).
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
    logoPath: "/logos/mint-brandlogo.png",
  },
  blush: {
    primary: "#e899b0",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/blush-brandlogo.png",
  },
  slate: {
    primary: "#64748b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/slate-brandlogo.png",
  },
  midnight: {
    primary: "#1e293b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/midnight-brandlogo.png",
  },
  ocean: {
    primary: "#1da2d8",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/ocean-brandlogo.png",
  },
  forest: {
    primary: "#10b981",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/forest-brandlogo.png",
  },
  "clinical-light": {
    primary: "#3b82f6",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/clinical-light-brandlogo.png",
  },
  "dark-clinical": {
    primary: "#06b6d4",
    heading: "#f1f5f9",
    background: "#1e293b",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-clinical-brandlogo.png",
  },
  "pastel-blush": {
    primary: "#f5838e",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-blush-brandlogo.png",
  },
  "pastel-lavender": {
    primary: "#a78bda",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-lavender-brandlogo.png",
  },
  "pastel-mint": {
    primary: "#4fd1a5",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-mint-brandlogo.png",
  },
  "neutral-sand": {
    primary: "#a08060",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/neutral-sand-brandlogo.png",
  },
  "neutral-slate": {
    primary: "#708090",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/neutral-slate-brandlogo.png",
  },
  "dark-academia": {
    primary: "#8b7355",
    heading: "#faf5ef",
    background: "#2c2418",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-academia-brandlogo.png",
  },
  "rose-gold": {
    primary: "#b76e79",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/rose-gold-brandlogo.png",
  },
  coral: {
    primary: "#ff6b6b",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/coral-brandlogo.png",
  },
  indigo: {
    primary: "#6366f1",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/indigo-brandlogo.png",
  },
  teal: {
    primary: "#14b8a6",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/teal-brandlogo.png",
  },
  berry: {
    primary: "#a855f7",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/berry-brandlogo.png",
  },
  "pastel-lilac": {
    primary: "#b48ed2",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/pastel-lilac-brandlogo.png",
  },
  "soft-sage": {
    primary: "#7da87d",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/soft-sage-brandlogo.png",
  },
  "dark-mode": {
    primary: "#4a6fa5",
    heading: "#e8eef7",
    background: "#2e3b4e",
    logoColor: "#FFFFFF",
    logoPath: "/logos/dark-mode-brandlogo.png",
  },
  strawberry: {
    primary: "#fd9cb3",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/strawberry-brandlogo.png",
  },
  "multi-pastel": {
    primary: "#90b4d4",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/multi-pastel-brandlogo.png",
  },
  "deep-twilight": {
    primary: "#2A1E4A",
    heading: "#F0EAF8",
    background: "#1E1838",
    logoColor: "#FFFFFF",
    logoPath: "/logos/deep-twilight-brandlogo.png",
  },
  "midnight-indigo": {
    primary: "#021A54",
    heading: "#F5F7FF",
    background: "#14204F",
    logoColor: "#FFFFFF",
    logoPath: "/logos/midnight-indigo-brandlogo.png",
  },
  lavender: {
    primary: "#9d82dd",
    heading: "#111827",
    background: "#ffffff",
    logoColor: "#111827",
    logoPath: "/logos/lavender-brandlogo.png",
  },
  "lavender-dream": {
    primary: "#BDA6CE",
    heading: "#3E2F5B",
    background: "#ffffff",
    logoColor: "#3E2F5B",
    logoPath: "/logos/lavender-dream-brandlogo.png",
  },
  "blueberry-sherbet": {
    primary: "#3852B4",
    heading: "#1F2A44",
    background: "#ffffff",
    logoColor: "#1F2A44",
    logoPath: "/logos/blueberry-sherbet-brandlogo.png",
  },
  "strawberry-cream": {
    primary: "#EA7B7B",
    heading: "#5A2A2A",
    background: "#ffffff",
    logoColor: "#5A2A2A",
    logoPath: "/logos/strawberry-cream-brandlogo.png",
  },
  "ocean-mist": {
    primary: "#1D546D",
    heading: "#0F2E3A",
    background: "#ffffff",
    logoColor: "#0F2E3A",
    logoPath: "/logos/ocean-mist-brandlogo.png",
  },
  "mint-breeze": {
    primary: "#3A9E8F",
    heading: "#1A3A34",
    background: "#ffffff",
    logoColor: "#1A3A34",
    logoPath: "/logos/mint-breeze-brandlogo.png",
  },
  "rose-quartz": {
    primary: "#C4788A",
    heading: "#4A2230",
    background: "#ffffff",
    logoColor: "#4A2230",
    logoPath: "/logos/rose-quartz-brandlogo.png",
  },
  "golden-hour": {
    primary: "#B8860B",
    heading: "#3D2E0A",
    background: "#ffffff",
    logoColor: "#3D2E0A",
    logoPath: "/logos/golden-hour-brandlogo.png",
  },
  "sage-garden": {
    primary: "#6B8E6B",
    heading: "#2A3C28",
    background: "#ffffff",
    logoColor: "#2A3C28",
    logoPath: "/logos/sage-garden-brandlogo.png",
  },
  "coral-sunset": {
    primary: "#E07050",
    heading: "#4A1E14",
    background: "#ffffff",
    logoColor: "#4A1E14",
    logoPath: "/logos/coral-sunset-brandlogo.png",
  },
  "arctic-frost": {
    primary: "#4A7A9B",
    heading: "#1A2E40",
    background: "#ffffff",
    logoColor: "#1A2E40",
    logoPath: "/logos/arctic-frost-brandlogo.png",
  },
  "plum-velvet": {
    primary: "#7A4A8A",
    heading: "#30183A",
    background: "#ffffff",
    logoColor: "#30183A",
    logoPath: "/logos/plum-velvet-brandlogo.png",
  },
  "honey-cream": {
    primary: "#A07840",
    heading: "#3A2A10",
    background: "#ffffff",
    logoColor: "#3A2A10",
    logoPath: "/logos/honey-cream-brandlogo.png",
  },
  "dusty-rose": {
    primary: "#B07080",
    heading: "#3E1E24",
    background: "#ffffff",
    logoColor: "#3E1E24",
    logoPath: "/logos/dusty-rose-brandlogo.png",
  },
};

export function getThemeLogoPath(themeId: string): string | null {
  return THEME_LOGO_CONFIG[themeId]?.logoPath ?? null;
}

export function getThemeColors(themeId: string): ThemeColors | null {
  const entry = THEME_LOGO_CONFIG[themeId];
  if (!entry) return null;
  return { primary: entry.primary, heading: entry.heading, background: entry.background };
}
