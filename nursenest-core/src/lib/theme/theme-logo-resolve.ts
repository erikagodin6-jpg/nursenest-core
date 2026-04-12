/**
 * Theme id parsing for registered palette ids (`THEME_OPTIONS`).
 *
 * **Logo URLs:** use {@link parseRegisteredThemeId} + {@link resolveThemeLogo} — exact registry match
 * only; unmapped themes must not receive another theme’s raster.
 *
 * **normalizeThemeIdForLogo:** legacy alias + default resolution for non-logo callers (theme tokens, etc.).
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

const CANONICAL_IDS = new Set(THEME_OPTIONS.map((t) => t.id));

function slugifyThemeRaw(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");
}

/**
 * Returns a registered theme id, or null when the string is not an exact registry id (after slugify).
 * Used for CDN logo resolution — no default-theme substitution.
 */
export function parseRegisteredThemeId(raw: string | undefined | null): string | null {
  if (raw == null || raw === "") return null;
  const slug = slugifyThemeRaw(raw);
  return CANONICAL_IDS.has(slug) ? slug : null;
}

/**
 * Human-friendly and legacy aliases → canonical theme id.
 * Used only by {@link normalizeThemeIdForLogo} — not for logo URL mapping.
 */
export const THEME_LOGO_ALIASES: Readonly<Record<string, string>> = {
  black: "midnight",
  sea: "ocean",
  aquatic: "ocean",
  turquoise: "ocean",
  cyan: "ocean",
  pink: "blush",
  blue: "clinical-light",
  grey: "slate",
  gray: "slate",
  sage: "soft-sage",
  sand: "neutral-sand",
  rosegold: "rose-gold",
  "rose-gold": "rose-gold",
  "dark-grey": "midnight",
  "dark-gray": "midnight",
  "bright-blue": "clinical-light",
  brightblue: "clinical-light",
};

export type KnownThemeId = (typeof THEME_OPTIONS)[number]["id"];

/**
 * Returns a canonical theme id for palette/UI, or the app default (includes legacy aliases).
 */
export function normalizeThemeIdForLogo(raw: string | undefined | null): string {
  if (raw == null || raw === "") return NURSENEST_DEFAULT_THEME;
  const slug = slugifyThemeRaw(raw);
  const viaAlias = THEME_LOGO_ALIASES[slug];
  const candidate = viaAlias ?? slug;
  if (CANONICAL_IDS.has(candidate)) return candidate;
  return NURSENEST_DEFAULT_THEME;
}
