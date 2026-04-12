/**
 * Single source of truth: DigitalOcean Spaces **object keys** for per-theme brand marks (bucket root only).
 *
 * One file per theme id: `{themeId}brandlogo_transparent.png` — colors match `THEME_OPTIONS[].color`
 * in `src/lib/theme/theme-registry.ts`. Regenerate: `npx tsx scripts/generate-theme-logos-from-registry.ts`.
 * Committed copies load first from `public/branding/theme-logos/` (see `getThemeLogoLoadChain`).
 *
 * **Maintainers:** keys are 1:1 with `THEME_OPTIONS[].id`. Grouped or similar hues (e.g. indigo vs berry,
 * lavender vs lavender-dream) still get **separate** files — only `normalizeThemeIdForLogo` aliases merge *names*,
 * not asset paths. Run `npm run verify:theme-logos` before release to confirm local PNG parity.
 * Historical shared non-theme-specific logo filenames are not used for these keys.
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

export type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

/**
 * Explicit Spaces object-key overrides for themes with dedicated uploaded logo files.
 * Keep keys canonical (theme ids from THEME_OPTIONS).
 */
const THEME_BRAND_LOGO_OBJECT_KEY_OVERRIDES: Readonly<Partial<Record<ThemeId, string>>> = {
  "pastel-lavender": "pastellavenderlogo.png",
  "pastel-lilac": "pastellilaclogo.png",
  "pastel-mint": "pastelmintlogo.png",
  "rose-gold": "rosegoldlogo.png",
  "rose-quartz": "rosequartzlogo.png",
  "neutral-sand": "sandlogo.png",
  "neutral-slate": "slatelogo.png",
  "soft-sage": "softsagelogo.png",
  "strawberry-cream": "strawberrycreamlogo.png",
  strawberry: "strawberrylogo.png",
  teal: "teallogo.png",
};

/** Explicit theme id → Spaces key (no leading slash). */
export const THEME_BRAND_LOGO_SPACE_KEYS = Object.fromEntries(
  THEME_OPTIONS.map((o) => [o.id, THEME_BRAND_LOGO_OBJECT_KEY_OVERRIDES[o.id] ?? `${o.id}brandlogo_transparent.png`]),
) as Record<ThemeId, string>;

const KEYS = THEME_BRAND_LOGO_SPACE_KEYS as Readonly<Record<string, string>>;

export function getThemeBrandLogoSpaceKeyForCanonicalId(themeId: string): string {
  const k = KEYS[themeId];
  if (k) return k;
  return KEYS[NURSENEST_DEFAULT_THEME]!;
}
