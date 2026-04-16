/**
 * Theme wordmarks: registered ids resolve to the public Spaces CDN object for the active theme.
 *
 * `THEME_LOGO_SPACE_KEYS` remains the source of truth for theme->asset mapping used by
 * header/footer brand rendering, marketing proxies, and tooling.
 */
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

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
const CDN_LEAF_URLS = {
  "arctic-frost": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/arcticfrost-transparent(1)_leaf.png",
  "berry-bonbon": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/berry-bonbon-leaf-transparent.png",
  berry: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/berrylogo_transparent_leaf.png",
  "blueberry-sherbet": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/blueberry_sherbet_logo(1)_leaf.png",
  bluebird: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/bluebird-leaf-transparent.png",
  "clinical-light": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/clinicallight-transparent(1)_leaf.png",
  coral: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/corallogo_transparent_leaf.png",
  "coral-sunset": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/coralsunsetlogo_transparent_leaf.png",
  "cotton-candy": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/cotton-candy-leaf-transparent.png",
  "dark-clinical": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/darkcllinicallogo_transparent_leaf.png",
  "deep-twilight": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/deeptwilightlogo_transparent_leaf.png",
  "dusty-rose": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/dustyroselogo_transparent_leaf.png",
  "evergreen-steel": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/evergreen-steel-leaf-transparent.png",
  forest: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/forestlogo_transparent_leaf.png",
  "golden-hour": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/goldenhourlogo_transparent_leaf.png",
  "graphite-blue": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/graphite-blue-leaf-transparent.png",
  indigo: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/indigologo_transparent_leaf.png",
  "honey-cream": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/honeycreamlogo_transparent_leaf.png",
  "lavender-dream": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/lavenderdreamlogo_transparent_leaf.png",
  "midnight-ink": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/midnight-ink-leaf-transparent.png",
  "north-sea": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png",
  "pastel-party": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/pastel-party-leaf-transparent.png",
  "petal-pop": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/petal-pop-leaf-transparent.png",
  "pink-skies": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/pink-skies-leaf-transparent.png",
  "plum-mist": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/plum-mist-leaf-transparent.png",
  "rainbow-sherbet": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/rainbow-sherbet-leaf-transparent.png",
  "neutral-sand": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/sandlogo.-transparentpng_leaf.png",
  "sky-kiss": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/sky-kiss-leaf-transparent.png",
  slate: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/slate-leaf_transparent.png",
  "soft-sage": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/soft-sage-leaf_transparent.png",
  "storm-slate": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/storm-slate-leaf-transparent.png",
  "strawberry-cream": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/strawberry-cream-leaf_transparent.png",
  "sunny-lilac": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/sunny-lilac-leaf-transparent.png",
  teal: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/teal-leaf_transparent.png",
  "violet-night": "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/violet-night-leaf-transparent.png",
} as const;

/**
 * Single source of truth for every registered theme id.
 * Values intentionally point only at the approved leaf CDN assets.
 */
export const THEME_LOGO_CDN_BY_THEME_ID: Readonly<Record<string, string>> = {
  "arctic-frost": CDN_LEAF_URLS["arctic-frost"],
  berry: CDN_LEAF_URLS.berry,
  "berry-bonbon": CDN_LEAF_URLS["berry-bonbon"],
  bluebird: CDN_LEAF_URLS.bluebird,
  "blueberry-sherbet": CDN_LEAF_URLS["blueberry-sherbet"],
  blush: CDN_LEAF_URLS["petal-pop"],
  "clinical-light": CDN_LEAF_URLS["clinical-light"],
  coral: CDN_LEAF_URLS.coral,
  "coral-sunset": CDN_LEAF_URLS["coral-sunset"],
  "cotton-candy": CDN_LEAF_URLS["cotton-candy"],
  "dark-academia": CDN_LEAF_URLS["deep-twilight"],
  "dark-clinical": CDN_LEAF_URLS["dark-clinical"],
  "dark-mode": CDN_LEAF_URLS["violet-night"],
  "deep-twilight": CDN_LEAF_URLS["deep-twilight"],
  "dusty-rose": CDN_LEAF_URLS["dusty-rose"],
  "evergreen-steel": CDN_LEAF_URLS["evergreen-steel"],
  forest: CDN_LEAF_URLS.forest,
  "golden-hour": CDN_LEAF_URLS["golden-hour"],
  "graphite-blue": CDN_LEAF_URLS["graphite-blue"],
  "honey-cream": CDN_LEAF_URLS["honey-cream"],
  indigo: CDN_LEAF_URLS.indigo,
  lavender: CDN_LEAF_URLS["sunny-lilac"],
  "lavender-dream": CDN_LEAF_URLS["lavender-dream"],
  midnight: CDN_LEAF_URLS["midnight-ink"],
  "midnight-indigo": CDN_LEAF_URLS["deep-twilight"],
  "midnight-ink": CDN_LEAF_URLS["midnight-ink"],
  mint: CDN_LEAF_URLS.teal,
  "mint-breeze": CDN_LEAF_URLS.teal,
  "multi-pastel": CDN_LEAF_URLS["rainbow-sherbet"],
  "neutral-sand": CDN_LEAF_URLS["neutral-sand"],
  "neutral-slate": CDN_LEAF_URLS["storm-slate"],
  "north-sea": CDN_LEAF_URLS["north-sea"],
  ocean: CDN_LEAF_URLS["north-sea"],
  "ocean-mist": CDN_LEAF_URLS["north-sea"],
  "pastel-blush": CDN_LEAF_URLS["pink-skies"],
  "pastel-lavender": CDN_LEAF_URLS["sunny-lilac"],
  "pastel-lilac": CDN_LEAF_URLS["plum-mist"],
  "pastel-mint": CDN_LEAF_URLS.teal,
  "pastel-party": CDN_LEAF_URLS["pastel-party"],
  "petal-pop": CDN_LEAF_URLS["petal-pop"],
  "pink-skies": CDN_LEAF_URLS["pink-skies"],
  "plum-mist": CDN_LEAF_URLS["plum-mist"],
  "plum-velvet": CDN_LEAF_URLS["plum-mist"],
  "rainbow-sherbet": CDN_LEAF_URLS["rainbow-sherbet"],
  "rose-gold": CDN_LEAF_URLS["dusty-rose"],
  "rose-quartz": CDN_LEAF_URLS["dusty-rose"],
  "sage-garden": CDN_LEAF_URLS["soft-sage"],
  "sky-kiss": CDN_LEAF_URLS["sky-kiss"],
  slate: CDN_LEAF_URLS.slate,
  "soft-sage": CDN_LEAF_URLS["soft-sage"],
  "storm-slate": CDN_LEAF_URLS["storm-slate"],
  strawberry: CDN_LEAF_URLS["strawberry-cream"],
  "strawberry-cream": CDN_LEAF_URLS["strawberry-cream"],
  "sunny-lilac": CDN_LEAF_URLS["sunny-lilac"],
  teal: CDN_LEAF_URLS.teal,
  "violet-night": CDN_LEAF_URLS["violet-night"],
} as const;

/** Single CDN leaf used for small inline marks (errors, empty states) when theme hook is unavailable. */
export const NURSENEST_DEFAULT_LEAF_MARK_URL: string =
  THEME_LOGO_CDN_BY_THEME_ID[NURSENEST_DEFAULT_THEME] ?? "";

function objectKeyFromCdnUrl(url: string): string | null {
  const marker = "/Logos/";
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  const rawKey = url.slice(idx + 1);
  return rawKey.length > 0 ? rawKey : null;
}

export const THEME_LOGO_SPACE_KEYS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(THEME_LOGO_CDN_BY_THEME_ID).flatMap(([themeId, themeUrl]) => {
    const objectKey = objectKeyFromCdnUrl(themeUrl);
    return objectKey ? ([[themeId, objectKey]] as const) : [];
  }),
);

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
  void logoVariant;
  const registered = parseRegisteredThemeId(themeId);
  const requestedThemeId = registered ?? NURSENEST_DEFAULT_THEME;
  const fallbackThemeId = NURSENEST_DEFAULT_THEME;
  const url =
    THEME_LOGO_CDN_BY_THEME_ID[requestedThemeId] ??
    THEME_LOGO_CDN_BY_THEME_ID[fallbackThemeId] ??
    null;
  if (!url) return { url: null, kind: "text-fallback", objectKey: null, assetThemeId: null };
  const objectKey = objectKeyFromCdnUrl(url);
  const resolvedThemeId = THEME_LOGO_CDN_BY_THEME_ID[requestedThemeId] ? requestedThemeId : fallbackThemeId;
  return {
    url,
    kind: "local",
    objectKey,
    assetThemeId: resolvedThemeId,
  };
}
