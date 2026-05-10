import type { CSSProperties } from "react";
import { getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

export type NavChromeTheme = {
  chrome: string;
  foreground: string;
  border: string;
  hoverBg: string;
  hoverFg: string;
  panel: string;
};

export const NAV_CHROME_BY_THEME: Record<string, NavChromeTheme> = {
  /* ── Clinical / Default ── */
  ocean: {
    chrome: "#0EA5E9",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  "clinical-light": {
    chrome: "#2563EB",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },

  /* ── Mint / Teal family ── */
  mint: {
    chrome: "#1DA2D8",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  "mint-breeze": {
    chrome: "#1DA2D8",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  "pastel-mint": {
    chrome: "#059669",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  teal: {
    chrome: "#0F766E",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  forest: {
    chrome: "#059669",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "soft-sage": {
    chrome: "#059669",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "sage-garden": {
    chrome: "#166534",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "evergreen-steel": {
    chrome: "#065F46",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "ocean-mist": {
    chrome: "#0E7490",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.15)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.11)",
  },
  "arctic-frost": {
    chrome: "#2D6A9F",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.15)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.11)",
  },
  "north-sea": {
    chrome: "#155E75",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.15)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.11)",
  },

  /* ── Premium clinical palettes ── */
  aurora: {
    /* Fallback when semantic tokens absent — pastel wash + ink (matches theme-palettes Aurora). */
    chrome: "color-mix(in srgb, #9b72ff 8%, color-mix(in srgb, #fce8f3 20%, color-mix(in srgb, #e6f2ff 18%, #fffdfa)))",
    foreground: "#1a202c",
    border: "color-mix(in srgb, #1a202c 12%, #e8dff0)",
    hoverBg: "color-mix(in srgb, #1a202c 7%, transparent)",
    hoverFg: "#1a202c",
    panel: "color-mix(in srgb, #1a202c 6%, transparent)",
  },
  meadow: {
    chrome: "#3D9A72",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.15)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.11)",
  },
  "ocean-air": {
    chrome: "#2563EB",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  sunset: {
    chrome: "color-mix(in srgb, #e07862 7%, color-mix(in srgb, #ffd8c4 18%, color-mix(in srgb, #dbeafe 14%, #fffaf6)))",
    foreground: "#1a2438",
    border: "color-mix(in srgb, #1a2438 10%, #edd8cc)",
    hoverBg: "color-mix(in srgb, #1a2438 6%, transparent)",
    hoverFg: "#1a2438",
    panel: "color-mix(in srgb, #1a2438 5%, transparent)",
  },

  /* ── Pink family ── */
  blush: {
    chrome: "#DB2777",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "pastel-blush": {
    chrome: "#DB2777",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "rose-gold": {
    chrome: "#BE185D",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "rose-quartz": {
    chrome: "#BE185D",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  coral: {
    chrome: "#EA580C",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "coral-sunset": {
    chrome: "#C2410C",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  strawberry: {
    chrome: "#E11D48",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "strawberry-cream": {
    chrome: "#C2314D",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "dusty-rose": {
    chrome: "#9F1239",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "petal-pop": {
    chrome: "#C73E7C",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "cotton-candy": {
    chrome: "#D977A8",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "pink-skies": {
    chrome: "#C73E7C",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "berry-bonbon": {
    chrome: "#BE185D",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },

  /* ── Lavender / Purple family ── */
  lavender: {
    chrome: "#7C3AED",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "lavender-dream": {
    chrome: "#7C3AED",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "pastel-lavender": {
    chrome: "#8B5CF6",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "pastel-lilac": {
    chrome: "#8B5CF6",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  berry: {
    chrome: "#9D174D",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  indigo: {
    chrome: "#4338CA",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "blueberry-sherbet": {
    chrome: "#3B4DC8",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  bluebird: {
    chrome: "#2563EB",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  "sky-kiss": {
    chrome: "#0284C7",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.22)",
    hoverBg: "rgba(255,255,255,0.16)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.12)",
  },
  "plum-velvet": {
    chrome: "#6D28D9",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "plum-mist": {
    chrome: "#7C3AED",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "sunny-lilac": {
    chrome: "#7C3AED",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "violet-night": {
    chrome: "#5B21B6",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "pastel-party": {
    chrome: "#4F46E5",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "rainbow-sherbet": {
    chrome: "#4F46E5",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "multi-pastel": {
    chrome: "#4F46E5",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.20)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },

  /* ── Neutral / Warm ── */
  slate: {
    chrome: "#334155",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.16)",
    hoverBg: "rgba(255,255,255,0.12)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "neutral-slate": {
    chrome: "#475569",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.16)",
    hoverBg: "rgba(255,255,255,0.12)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "neutral-sand": {
    chrome: "#78716C",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.12)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "graphite-blue": {
    chrome: "#364B6A",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.16)",
    hoverBg: "rgba(255,255,255,0.12)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "storm-slate": {
    chrome: "#3B516E",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.16)",
    hoverBg: "rgba(255,255,255,0.12)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "golden-hour": {
    chrome: "#92400E",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "honey-cream": {
    chrome: "#78350F",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },

  /* ── Dark themes ── */
  midnight: {
    chrome: "#1E293B",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
  "midnight-indigo": {
    chrome: "#1E3A8A",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
  "midnight-ink": {
    chrome: "#1E3A5F",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
  "deep-twilight": {
    chrome: "#4C1D95",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
  "dark-mode": {
    chrome: "#1E293B",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
  "dark-clinical": {
    chrome: "#0E7490",
    foreground: "#FFFFFF",
    border: "rgba(255,255,255,0.18)",
    hoverBg: "rgba(255,255,255,0.14)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.10)",
  },
  "dark-academia": {
    chrome: "#3F3F46",
    foreground: "#F8FAFC",
    border: "rgba(255,255,255,0.14)",
    hoverBg: "rgba(255,255,255,0.10)",
    hoverFg: "#FFFFFF",
    panel: "rgba(255,255,255,0.08)",
  },
};

const FALLBACK: NavChromeTheme = {
  chrome: "#334155",
  foreground: "#FFFFFF",
  border: "rgba(255,255,255,0.16)",
  hoverBg: "rgba(255,255,255,0.12)",
  hoverFg: "#FFFFFF",
  panel: "rgba(255,255,255,0.10)",
};

/** Prefer canonical surface tokens whenever they exist (palette-derived or overrides). */
function navChromeFromSemantic(themeId: string): NavChromeTheme | null {
  const semantic = getThemeSurfaceContrastTokens(themeId);
  if (!semantic) return null;
  const fg = semantic.navForeground;
  return {
    chrome: semantic.navBackground,
    foreground: fg,
    border: semantic.navBorder,
    hoverBg: semantic.navHover,
    hoverFg: fg,
    panel: `color-mix(in srgb, ${fg} 12%, transparent)`,
  };
}

export function getNavChrome(themeId?: string | null): NavChromeTheme {
  const key = String(themeId ?? "")
    .trim()
    .toLowerCase();
  const resolvedId = key || NURSENEST_DEFAULT_THEME;
  const fromSemantic = navChromeFromSemantic(resolvedId);
  if (fromSemantic) return fromSemantic;
  return (
    NAV_CHROME_BY_THEME[resolvedId] ??
    NAV_CHROME_BY_THEME[NURSENEST_DEFAULT_THEME] ??
    FALLBACK
  );
}

/** CSS custom properties only — no direct backgroundColor/color. Use on wrapper elements that
 *  need to propagate chrome vars to siblings/children without overriding their own backgrounds.
 *  Marketing SiteHeader: light themes use this alone on the sticky wrapper; **dark** themes also
 *  use it plus explicit `color` / `borderColor` from {@link getNavChrome} so `.nn-header-dark-surface`
 *  (globals + premium CSS) owns `background` / glass without fighting inline `backgroundColor`. */
export function getNavChromeVars(themeId?: string | null): CSSProperties {
  const t = getNavChrome(themeId);
  return {
    ["--nn-nav-bg" as string]: t.chrome,
    ["--nn-nav-fg" as string]: t.foreground,
    ["--nn-nav-border" as string]: t.border,
    ["--nn-nav-hover-bg" as string]: t.hoverBg,
    ["--nn-nav-hover-fg" as string]: t.hoverFg,
    ["--nn-nav-panel" as string]: t.panel,
  };
}

/** Full chrome style — includes direct backgroundColor, color, borderColor. Use on the actual
 *  chrome surface elements (header, footer, sub-nav). */
export function getNavChromeStyle(themeId?: string | null): CSSProperties {
  const t = getNavChrome(themeId);
  return {
    ["--nn-nav-bg" as string]: t.chrome,
    ["--nn-nav-fg" as string]: t.foreground,
    ["--nn-nav-border" as string]: t.border,
    ["--nn-nav-hover-bg" as string]: t.hoverBg,
    ["--nn-nav-hover-fg" as string]: t.hoverFg,
    ["--nn-nav-panel" as string]: t.panel,
    backgroundColor: "var(--nn-nav-bg)",
    color: "var(--nn-nav-fg)",
    borderColor: "var(--nn-nav-border)",
  };
}
