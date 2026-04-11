/**
 * Theme-to-logo path mapping — generated from `src/app/theme-palettes.css`.
 *
 * Each entry maps a theme ID to its expected logo asset at `/public/logos/{theme}-logo.png`.
 * Color values are extracted directly from the CSS (per-theme blocks + `:is()` catch-all
 * defaults for partial light themes).
 *
 * NOTE: The existing brand logo system uses `/branding/theme-logos/` with a different naming
 * convention (`{themeId}brandlogo_transparent.png`). This config is a standalone mapping for
 * the `/public/logos/` directory structure.
 */

export interface ThemeColors {
  primary: string;
  heading: string;
  background: string;
}

export interface ThemeLogoEntry extends ThemeColors {
  logoPath: string;
}

export const THEME_LOGO_CONFIG: Record<string, ThemeLogoEntry> = {
  mint: {
    primary: "#66b2b2",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/mint-logo.png",
  },
  blush: {
    primary: "#e899b0",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/blush-logo.png",
  },
  slate: {
    primary: "#64748b",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/slate-logo.png",
  },
  midnight: {
    primary: "#1e293b",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/midnight-logo.png",
  },
  ocean: {
    primary: "#1da2d8",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/ocean-logo.png",
  },
  forest: {
    primary: "#10b981",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/forest-logo.png",
  },
  "clinical-light": {
    primary: "#3b82f6",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/clinical-light-logo.png",
  },
  "dark-clinical": {
    primary: "#06b6d4",
    heading: "#f1f5f9",
    background: "#1e293b",
    logoPath: "/logos/dark-clinical-logo.png",
  },
  "pastel-blush": {
    primary: "#f5838e",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/pastel-blush-logo.png",
  },
  "pastel-lavender": {
    primary: "#a78bda",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/pastel-lavender-logo.png",
  },
  "pastel-mint": {
    primary: "#4fd1a5",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/pastel-mint-logo.png",
  },
  "neutral-sand": {
    primary: "#a08060",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/neutral-sand-logo.png",
  },
  "neutral-slate": {
    primary: "#708090",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/neutral-slate-logo.png",
  },
  "dark-academia": {
    primary: "#8b7355",
    heading: "#faf5ef",
    background: "#2c2418",
    logoPath: "/logos/dark-academia-logo.png",
  },
  "rose-gold": {
    primary: "#b76e79",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/rose-gold-logo.png",
  },
  coral: {
    primary: "#ff6b6b",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/coral-logo.png",
  },
  indigo: {
    primary: "#6366f1",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/indigo-logo.png",
  },
  teal: {
    primary: "#14b8a6",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/teal-logo.png",
  },
  berry: {
    primary: "#a855f7",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/berry-logo.png",
  },
  "pastel-lilac": {
    primary: "#b48ed2",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/pastel-lilac-logo.png",
  },
  "soft-sage": {
    primary: "#7da87d",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/soft-sage-logo.png",
  },
  "dark-mode": {
    primary: "#4a6fa5",
    heading: "#e8eef7",
    background: "#2e3b4e",
    logoPath: "/logos/dark-mode-logo.png",
  },
  strawberry: {
    primary: "#fd9cb3",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/strawberry-logo.png",
  },
  "multi-pastel": {
    primary: "#90b4d4",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/multi-pastel-logo.png",
  },
  "deep-twilight": {
    primary: "#2A1E4A",
    heading: "#F0EAF8",
    background: "#1E1838",
    logoPath: "/logos/deep-twilight-logo.png",
  },
  "midnight-indigo": {
    primary: "#021A54",
    heading: "#F5F7FF",
    background: "#14204F",
    logoPath: "/logos/midnight-indigo-logo.png",
  },
  lavender: {
    primary: "#9d82dd",
    heading: "#111827",
    background: "#ffffff",
    logoPath: "/logos/lavender-logo.png",
  },
  "lavender-dream": {
    primary: "#BDA6CE",
    heading: "#3E2F5B",
    background: "#ffffff",
    logoPath: "/logos/lavender-dream-logo.png",
  },
  "blueberry-sherbet": {
    primary: "#3852B4",
    heading: "#1F2A44",
    background: "#ffffff",
    logoPath: "/logos/blueberry-sherbet-logo.png",
  },
  "strawberry-cream": {
    primary: "#EA7B7B",
    heading: "#5A2A2A",
    background: "#ffffff",
    logoPath: "/logos/strawberry-cream-logo.png",
  },
  "ocean-mist": {
    primary: "#1D546D",
    heading: "#0F2E3A",
    background: "#ffffff",
    logoPath: "/logos/ocean-mist-logo.png",
  },
  "mint-breeze": {
    primary: "#3A9E8F",
    heading: "#1A3A34",
    background: "#ffffff",
    logoPath: "/logos/mint-breeze-logo.png",
  },
  "rose-quartz": {
    primary: "#C4788A",
    heading: "#4A2230",
    background: "#ffffff",
    logoPath: "/logos/rose-quartz-logo.png",
  },
  "golden-hour": {
    primary: "#B8860B",
    heading: "#3D2E0A",
    background: "#ffffff",
    logoPath: "/logos/golden-hour-logo.png",
  },
  "sage-garden": {
    primary: "#6B8E6B",
    heading: "#2A3C28",
    background: "#ffffff",
    logoPath: "/logos/sage-garden-logo.png",
  },
  "coral-sunset": {
    primary: "#E07050",
    heading: "#4A1E14",
    background: "#ffffff",
    logoPath: "/logos/coral-sunset-logo.png",
  },
  "arctic-frost": {
    primary: "#4A7A9B",
    heading: "#1A2E40",
    background: "#ffffff",
    logoPath: "/logos/arctic-frost-logo.png",
  },
  "plum-velvet": {
    primary: "#7A4A8A",
    heading: "#30183A",
    background: "#ffffff",
    logoPath: "/logos/plum-velvet-logo.png",
  },
  "honey-cream": {
    primary: "#A07840",
    heading: "#3A2A10",
    background: "#ffffff",
    logoPath: "/logos/honey-cream-logo.png",
  },
  "dusty-rose": {
    primary: "#B07080",
    heading: "#3E1E24",
    background: "#ffffff",
    logoPath: "/logos/dusty-rose-logo.png",
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
