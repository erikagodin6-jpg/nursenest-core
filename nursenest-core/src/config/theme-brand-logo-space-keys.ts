/**
 * Single source of truth: DigitalOcean Spaces **object keys** for per-theme brand marks (bucket root only).
 * Filenames must match real uploads — no `branding/themes/` prefix, no `logo-{id}.png` pattern.
 *
 * Known bucket-root assets: coral, darkgrey, grey, mint, ocean, rosegold, sage, sand, teal, pink,
 * forest, lavender (+ explicit blush→pink, slate→darkgrey).
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

export type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

/** Explicit theme id → Spaces key (no leading slash). */
export const THEME_BRAND_LOGO_SPACE_KEYS = {
  lavender: "lavenderbrandlogo.png",
  mint: "mintbrandlogo.png",
  blush: "pinkbrandlogo.png",
  slate: "darkgreybrandlogo.png",
  midnight: "darkgreybrandlogo.png",
  ocean: "oceanbrandlogo.png",
  forest: "forestbrandlogo.png",
  "clinical-light": "greybrandlogo.png",
  "pastel-blush": "pinkbrandlogo.png",
  "pastel-lavender": "lavenderbrandlogo.png",
  "pastel-mint": "mintbrandlogo.png",
  "pastel-lilac": "lavenderbrandlogo.png",
  "lavender-dream": "lavenderbrandlogo.png",
  "soft-sage": "sagebrandlogo.png",
  "neutral-sand": "sandbrandlogo.png",
  "neutral-slate": "greybrandlogo.png",
  "rose-gold": "rosegoldbrandlogo.png",
  coral: "coralbrandlogo.png",
  indigo: "tealbrandlogo.png",
  teal: "tealbrandlogo.png",
  berry: "pinkbrandlogo.png",
  "dark-mode": "darkgreybrandlogo.png",
  "dark-clinical": "darkgreybrandlogo.png",
  "dark-academia": "darkgreybrandlogo.png",
} as const satisfies Record<ThemeId, string>;

const KEYS = THEME_BRAND_LOGO_SPACE_KEYS as Readonly<Record<string, string>>;

export function getThemeBrandLogoSpaceKeyForCanonicalId(themeId: string): string {
  const k = KEYS[themeId];
  if (k) return k;
  return KEYS[NURSENEST_DEFAULT_THEME]!;
}
