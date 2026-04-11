/**
 * Normalizes arbitrary theme strings (URL segments, legacy labels, aliases) to a canonical
 * theme id registered in `THEME_OPTIONS`.
 *
 * Logo filenames are always `{canonicalId}brandlogo_transparent.png` (see `THEME_BRAND_LOGO_SPACE_KEYS`).
 * Similar **labels** (e.g. pastel lilac vs lavender) are still **distinct ids** with distinct files.
 * **indigo** and **berry** are separate themes (different purples) — do not merge their object keys.
 * Aliases below only remap **legacy nicknames** (e.g. `black` → `midnight`); they do not imply shared assets.
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

const CANONICAL_IDS = new Set(THEME_OPTIONS.map((t) => t.id));

/**
 * Human-friendly and legacy aliases → canonical theme id.
 * Extend here when adding nicknames; logo paths stay in `theme-logo-map.ts` only.
 */
export const THEME_LOGO_ALIASES: Readonly<Record<string, string>> = {
  black: "midnight",
  /** Ocean theme: common labels so CDN `oceanbrandlogo_transparent.png` loads correctly */
  sea: "ocean",
  aquatic: "ocean",
  turquoise: "ocean",
  cyan: "ocean",
  /** Common spoken labels */
  pink: "blush",
  blue: "clinical-light",
  grey: "slate",
  gray: "slate",
  sage: "soft-sage",
  sand: "neutral-sand",
  rosegold: "rose-gold",
  /** Hyphen variants */
  "rose-gold": "rose-gold",
  "dark-grey": "midnight",
  "dark-gray": "midnight",
  "bright-blue": "clinical-light",
  brightblue: "clinical-light",
};

export type KnownThemeId = (typeof THEME_OPTIONS)[number]["id"];

/**
 * Returns a canonical theme id that has a pre-colored logo asset, or the app default.
 */
export function normalizeThemeIdForLogo(raw: string | undefined | null): string {
  if (raw == null || raw === "") return NURSENEST_DEFAULT_THEME;
  const slug = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

  const viaAlias = THEME_LOGO_ALIASES[slug];
  const candidate = viaAlias ?? slug;

  if (CANONICAL_IDS.has(candidate)) return candidate;

  return NURSENEST_DEFAULT_THEME;
}
