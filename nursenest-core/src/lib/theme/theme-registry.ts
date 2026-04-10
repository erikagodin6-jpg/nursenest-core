/**
 * **Source of truth for theme ids** used across the app: CSS `[data-theme="…"]` palettes, the theme picker,
 * and **per-theme brand logo filenames** (`{id}brandlogo_transparent.png` from `THEME_OPTIONS[].id`).
 * Favicon generation tints to the default theme primary; wordmark PNGs are produced
 * by `scripts/generate-theme-logos-from-registry.ts`. Legacy shared logo filenames are not used for theme marks.
 *
 * Canonical NurseNest brand default. Must stay aligned with `data-theme="ocean"` in theme-palettes.css.
 */
export const NURSENEST_DEFAULT_THEME = "ocean" as const;

export type ThemeGroup = "light" | "dark";

/**
 * Logo variant key for each theme — maps to branded logo asset filenames.
 * Variants: "blue" | "mint" | "blush" | "rose" | "strawberry" | "multi" | "dark"
 * Use with theme-logo-resolve.ts when generating per-theme logo variants.
 */
export type ThemeLogoVariant =
  | "blue"
  | "mint"
  | "blush"
  | "rose"
  | "strawberry"
  | "multi"
  | "dark"
  | "neutral";

export type ThemeOption = {
  id: string;
  label: string;
  /** Swatch color shown in the theme picker (matches --theme-primary). */
  color: string;
  group: ThemeGroup;
  /** Logo variant for this theme — used to select branded logo asset. */
  logoVariant: ThemeLogoVariant;
};

/** Theme list — clinical blue (ocean) is the default, pink themes are grouped for discoverability. */
export const THEME_OPTIONS: ThemeOption[] = [
  /* ── Clinical / Default ── */
  { id: "ocean", label: "Clinical Blue", color: "#1da2d8", group: "light", logoVariant: "blue" },
  { id: "clinical-light", label: "Clinical Light", color: "#3b82f6", group: "light", logoVariant: "blue" },

  /* ── Pink family ── */
  { id: "blush", label: "Soft Blush", color: "#e899b0", group: "light", logoVariant: "blush" },
  { id: "pastel-blush", label: "Rose", color: "#f5838e", group: "light", logoVariant: "rose" },
  { id: "strawberry", label: "Strawberry", color: "#fd9cb3", group: "light", logoVariant: "strawberry" },
  { id: "rose-gold", label: "Rose Gold", color: "#b76e79", group: "light", logoVariant: "rose" },
  { id: "coral", label: "Coral", color: "#ff6b6b", group: "light", logoVariant: "rose" },

  /* ── Mint / Teal family ── */
  { id: "mint", label: "Mint Calm", color: "#66b2b2", group: "light", logoVariant: "mint" },
  { id: "pastel-mint", label: "Pastel Mint", color: "#4fd1a5", group: "light", logoVariant: "mint" },
  { id: "teal", label: "Teal", color: "#14b8a6", group: "light", logoVariant: "mint" },
  { id: "forest", label: "Forest", color: "#10b981", group: "light", logoVariant: "mint" },
  { id: "soft-sage", label: "Soft Sage", color: "#7da87d", group: "light", logoVariant: "mint" },

  /* ── Multi-pastel ── */
  { id: "multi-pastel", label: "Multi-Pastel", color: "#90b4d4", group: "light", logoVariant: "multi" },

  /* ── Lavender / Purple family ── */
  { id: "lavender", label: "Lavender", color: "#9d82dd", group: "light", logoVariant: "neutral" },
  { id: "pastel-lavender", label: "Pastel Lavender", color: "#a78bda", group: "light", logoVariant: "neutral" },
  { id: "pastel-lilac", label: "Pastel Lilac", color: "#b48ed2", group: "light", logoVariant: "neutral" },
  { id: "lavender-dream", label: "Lavender Dream", color: "#8e7cc3", group: "light", logoVariant: "neutral" },
  { id: "berry", label: "Berry", color: "#a855f7", group: "light", logoVariant: "neutral" },
  { id: "indigo", label: "Indigo", color: "#6366f1", group: "light", logoVariant: "blue" },

  /* ── Neutral ── */
  { id: "slate", label: "Slate", color: "#64748b", group: "light", logoVariant: "neutral" },
  { id: "midnight", label: "Midnight", color: "#1e293b", group: "light", logoVariant: "neutral" },
  { id: "neutral-sand", label: "Sand", color: "#a08060", group: "light", logoVariant: "neutral" },
  { id: "neutral-slate", label: "Cool Slate", color: "#708090", group: "light", logoVariant: "neutral" },

  /* ── Dark ── */
  { id: "dark-mode", label: "Dark Pastel", color: "#4a6fa5", group: "dark", logoVariant: "dark" },
  { id: "dark-clinical", label: "Dark Clinical", color: "#06b6d4", group: "dark", logoVariant: "dark" },
  { id: "dark-academia", label: "Dark Academia", color: "#8b7355", group: "dark", logoVariant: "dark" },
];

export const THEME_STORAGE_KEY = "nursenest-theme";

/**
 * Map from theme id to logo variant — convenience lookup for logo resolution.
 * Populated lazily from THEME_OPTIONS at runtime; do not import THEME_OPTIONS directly in hot paths.
 */
export function getThemeLogoVariant(themeId: string): ThemeLogoVariant {
  return (
    THEME_OPTIONS.find((t) => t.id === themeId)?.logoVariant ?? "blue"
  );
}
