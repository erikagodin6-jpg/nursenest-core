/**
 * Theme wordmarks: registered ids resolve to the public Spaces CDN object for the active theme.
 *
 * `THEME_LOGO_SPACE_KEYS` remains the source of truth for theme->asset mapping used by
 * header/footer brand rendering, marketing proxies, and tooling.
 */
import { nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";

export type ThemeLogoVariant = "full" | "leaf";

export type ThemeLogoResolutionKind = "local" | "text-fallback";

export type ResolvedThemeLogo = {
  url: string | null;
  kind: ThemeLogoResolutionKind;
  objectKey: string | null;
  /** Registry theme id that owns the resolved asset (same as requested id for local SVGs). */
  assetThemeId: string | null;
};

/**
 * Single map: registered `data-theme` id → Spaces object key (under nursenest-images).
 * Filenames are fixed CDN assets — do not rename or invent paths here.
 */
export const THEME_LOGO_SPACE_KEYS: Readonly<Record<string, string>> = {
  "arctic-frost": "Logos/arcticfrost-transparent.png",
  berry: "Logos/berrylogo_transparent.png",
  "berry-bonbon": "Logos/berry-bonbon-logo-transparent.png",
  bluebird: "Logos/bluebird-leaf-transparent.png",
  "blueberry-sherbet": "Logos/blueberry_sherbet_logo.png",
  blush: "Logos/petal-pop-leaf-transparent.png",
  "clinical-light": "Logos/clinicallight-transparent.png",
  coral: "Logos/corallogo_transparent.png",
  "coral-sunset": "Logos/coralsunsetlogo_transparent.png",
  "cotton-candy": "Logos/pink-skies-leaf-transparent.png",
  "dark-academia": "Logos/deeptwilightlogo_transparent.png",
  "dark-clinical": "Logos/darkcllinicallogo_transparent.png",
  "dark-mode": "Logos/violet-night-leaf-transparent.png",
  "deep-twilight": "Logos/deeptwilightlogo_transparent.png",
  "dusty-rose": "Logos/dustyroselogo_transparent.png",
  "evergreen-steel": "Logos/evergreen-steel-logo-transparent.png",
  forest: "Logos/forestlogo_transparent.png",
  "golden-hour": "Logos/goldenhourlogo_transparent.png",
  "graphite-blue": "Logos/graphite-blue-leaf-transparent.png",
  "honey-cream": "Logos/honeycreamlogo_transparent.png",
  indigo: "Logos/violet-night-leaf-transparent.png",
  lavender: "Logos/sunny-lilac-leaf-transparent.png",
  "lavender-dream": "Logos/lavenderdreamlogo_transparent.png",
  midnight: "Logos/midnight-ink-leaf-transparent.png",
  "midnight-indigo": "Logos/deeptwilightlogo_transparent.png",
  "midnight-ink": "Logos/midnight-ink-leaf-transparent.png",
  mint: "Logos/teal-leaf_transparent.png",
  "mint-breeze": "Logos/teal-leaf_transparent.png",
  "multi-pastel": "Logos/rainbow-sherbet-leaf-transparent.png",
  "neutral-sand": "Logos/sandlogo.-transparentpng.png",
  "neutral-slate": "Logos/storm-slate-leaf-transparent.png",
  "north-sea": "Logos/north-sea-leaf-transparent.png",
  ocean: "Logos/north-sea-leaf-transparent.png",
  "ocean-mist": "Logos/north-sea-leaf-transparent.png",
  "pastel-blush": "Logos/pink-skies-leaf-transparent.png",
  "pastel-lavender": "Logos/sunny-lilac-leaf-transparent.png",
  "pastel-lilac": "Logos/plum-mist-leaf-transparent.png",
  "pastel-mint": "Logos/teal-leaf_transparent.png",
  "pastel-party": "Logos/pastel-party-leaf-transparent.png",
  "petal-pop": "Logos/petal-pop-leaf-transparent.png",
  "pink-skies": "Logos/pink-skies-leaf-transparent.png",
  "plum-mist": "Logos/plum-mist-leaf-transparent.png",
  "plum-velvet": "Logos/plum-mist-leaf-transparent.png",
  "rainbow-sherbet": "Logos/rainbow-sherbet-leaf-transparent.png",
  "rose-gold": "Logos/dustyroselogo_transparent.png",
  "rose-quartz": "Logos/dustyroselogo_transparent.png",
  "sage-garden": "Logos/sagegardenlogo-transparent.png",
  "sky-kiss": "Logos/bluebird-leaf-transparent.png",
  slate: "Logos/slate-leaf_transparent.png",
  "soft-sage": "Logos/sagegardenlogo-transparent.png",
  "storm-slate": "Logos/storm-slate-leaf-transparent.png",
  strawberry: "Logos/strawberry-cream-leaf_transparent.png",
  "strawberry-cream": "Logos/strawberry-cream-leaf_transparent.png",
  "sunny-lilac": "Logos/sunny-lilac-leaf-transparent.png",
  teal: "Logos/teal-leaf_transparent.png",
  "violet-night": "Logos/violet-night-leaf-transparent.png",
} as const;

/**
 * Registered theme id → Spaces object key, or null when neither a direct nor family fallback map applies.
 * `logoVariant` is reserved for future split full/leaf keys; today both use the same mapped raster.
 */
export function themeLogoSpaceKeyForRegisteredTheme(
  themeId: string | null | undefined,
  logoVariant: ThemeLogoVariant = "full",
): string | null {
  void logoVariant;
  if (!themeId) return null;
  return THEME_LOGO_SPACE_KEYS[themeId] ?? null;
}

/**
 * Single entry point for the in-app theme wordmark URL.
 * No filename derivation, no family load-chain, no implicit theme borrowing.
 */
export function resolveThemeLogo(
  themeId: string | null | undefined,
  logoVariant: ThemeLogoVariant = "full",
): ResolvedThemeLogo {
  const registered = parseRegisteredThemeId(themeId);
  if (!registered) {
    return { url: null, kind: "text-fallback", objectKey: null, assetThemeId: null };
  }
  const objectKey = themeLogoSpaceKeyForRegisteredTheme(registered, logoVariant);
  if (!objectKey) {
    return { url: null, kind: "text-fallback", objectKey: null, assetThemeId: null };
  }
  return {
    url: nursenestImagesSpaceObjectUrl(objectKey),
    kind: "local",
    objectKey,
    assetThemeId: registered,
  };
}
