/**
 * Canonical theme → Spaces object key for the pre-colored transparent brand raster.
 * Exact registered theme ids only — no computed keys, no alias substitution, no local fallbacks.
 */
import { nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import { marketingImageUsesProxy, marketingProxyPathForKey } from "@/lib/marketing-resolve-image-url";

export type ThemeLogoVariant = "full" | "leaf";

export type ThemeLogoResolutionKind = "cdn" | "text-fallback";

export type ResolvedThemeLogo = {
  url: string | null;
  kind: ThemeLogoResolutionKind;
  objectKey: string | null;
};

/**
 * Single map: registered `data-theme` id → Spaces object key (under nursenest-images).
 * Filenames are fixed CDN assets — do not rename or invent paths here.
 */
export const THEME_LOGO_SPACE_KEYS: Readonly<Record<string, string>> = {
  "arctic-frost": "Logos/arcticfrost-transparent.png",
  berry: "Logos/berrylogo_transparent.png",
  "clinical-light": "Logos/clinicallight-transparent.png",
  coral: "Logos/corallogo_transparent.png",
  "coral-sunset": "Logos/coralsunsetlogo_transparent.png",
  "dark-clinical": "Logos/darkcllinicallogo_transparent.png",
  "deep-twilight": "Logos/deeptwilightlogo_transparent.png",
  "dusty-rose": "Logos/dustyroselogo_transparent.png",
  forest: "Logos/forestlogo_transparent.png",
  "golden-hour": "Logos/goldenhourlogo_transparent.png",
  "honey-cream": "Logos/honeycreamlogo_transparent.png",
  "lavender-dream": "Logos/lavenderdreamlogo_transparent.png",
  "sage-garden": "Logos/sagegardenlogo-transparent.png",
  slate: "Logos/slate-leaf_transparent.png",
  "strawberry-cream": "Logos/strawberry-cream-leaf_transparent.png",
  teal: "Logos/teal-leaf_transparent.png",
  "blueberry-sherbet": "Logos/blueberry_sherbet_logo.png",
  midnight: "Logos/midnight-ink-leaf-transparent.png",
  ocean: "Logos/north-sea-leaf-transparent.png",
  "pastel-lavender": "Logos/pastel-party-leaf-transparent.png",
  "pastel-party": "Logos/pastel-party-leaf-transparent.png",
  blush: "Logos/petal-pop-leaf-transparent.png",
  "petal-pop": "Logos/petal-pop-leaf-transparent.png",
  "pink-skies": "Logos/pink-skies-leaf-transparent.png",
  "cotton-candy": "Logos/pink-skies-leaf-transparent.png",
  "berry-bonbon": "Logos/pink-skies-leaf-transparent.png",
  "pastel-blush": "Logos/pink-skies-leaf-transparent.png",
  strawberry: "Logos/pink-skies-leaf-transparent.png",
  "rose-gold": "Logos/pink-skies-leaf-transparent.png",
  "plum-mist": "Logos/plum-mist-leaf-transparent.png",
  "pastel-lilac": "Logos/plum-mist-leaf-transparent.png",
  "multi-pastel": "Logos/rainbow-sherbet-leaf-transparent.png",
  "rainbow-sherbet": "Logos/rainbow-sherbet-leaf-transparent.png",
  "neutral-slate": "Logos/storm-slate-leaf-transparent.png",
  "storm-slate": "Logos/storm-slate-leaf-transparent.png",
  lavender: "Logos/sunny-lilac-leaf-transparent.png",
  "sunny-lilac": "Logos/sunny-lilac-leaf-transparent.png",
  indigo: "Logos/violet-night-leaf-transparent.png",
  "violet-night": "Logos/violet-night-leaf-transparent.png",
  "dark-mode": "Logos/violet-night-leaf-transparent.png",
  "north-sea": "Logos/north-sea-leaf-transparent.png",
  "midnight-ink": "Logos/midnight-ink-leaf-transparent.png",
} as const;

function urlForObjectKey(objectKey: string): string {
  if (marketingImageUsesProxy()) return marketingProxyPathForKey(objectKey);
  return nursenestImagesSpaceObjectUrl(objectKey);
}

/**
 * Registered theme id → Spaces object key, or null when the theme has no mapped CDN asset.
 * `logoVariant` is reserved for future split full/leaf keys; today both use the same mapped raster.
 */
export function themeLogoSpaceKeyForRegisteredTheme(
  themeId: string | null | undefined,
  _logoVariant: ThemeLogoVariant = "full",
): string | null {
  if (!themeId) return null;
  return THEME_LOGO_SPACE_KEYS[themeId] ?? null;
}

/**
 * Single entry point for theme brand raster URLs. Unmapped themes return text-fallback only (no substitution).
 */
export function resolveThemeLogo(
  themeId: string | null | undefined,
  logoVariant: ThemeLogoVariant = "full",
): ResolvedThemeLogo {
  const id = themeId && themeId.length > 0 ? themeId : null;
  const objectKey = themeLogoSpaceKeyForRegisteredTheme(id, logoVariant);
  if (!id || !objectKey) {
    return { url: null, kind: "text-fallback", objectKey: null };
  }
  const url = urlForObjectKey(objectKey);
  return { url, kind: "cdn", objectKey };
}
