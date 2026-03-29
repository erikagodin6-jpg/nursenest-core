/**
 * Typed access to `marketing-cdn.catalog.json` — single mapping for Spaces URLs,
 * legacy marketing origins, and documentation for lesson images.
 */
import catalog from "./marketing-cdn.catalog.json";

export const DIGITALOCEAN_SPACES_NURSENEST_IMAGES = catalog.digitalOceanSpaces.nursenestImages;

/** Same hostname as `MARKETING_CDN_BASE` in `marketing-assets.generated.ts` when discovery uses the default bucket. */
export const NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL =
  DIGITALOCEAN_SPACES_NURSENEST_IMAGES.publicBaseUrl;

export const COMMITTED_MARKETING_ASSET_ORIGIN = catalog.committedMarketingAssets.origin;

export const COMMITTED_MARKETING_SCREENSHOTS_PREFIX =
  catalog.committedMarketingAssets.screenshotsPathPrefix;

export const LOGO_LEGACY_FALLBACK_URL = catalog.logo.legacyFallbackUrl;

type LogoCatalog = Omit<typeof catalog.logo, "primaryBrandMarkObjectKey" | "spacesBlueBrandLogoObjectKey"> & {
  primaryBrandMarkObjectKey?: string | null;
  spacesBlueBrandLogoObjectKey?: string | null;
};

/** Single Spaces key for optional mask-tinted mark (disabled when null). */
export function getPrimaryBrandMarkObjectKey(): string | null {
  const raw = (catalog.logo as LogoCatalog).primaryBrandMarkObjectKey;
  if (raw == null || typeof raw !== "string") return null;
  const k = raw.trim();
  return k || null;
}

/** Documented Spaces key for the blue brand asset (e.g. `bluebrandlogo.jpg`) — tried first in the header load chain when tinting is on. */
export function getSpacesBlueBrandLogoObjectKey(): string | null {
  const raw = (catalog.logo as LogoCatalog).spacesBlueBrandLogoObjectKey;
  if (raw == null || typeof raw !== "string") return null;
  const k = raw.trim();
  return k || null;
}

/** When true, `getHeaderBrandLogoLoadChain` appends mask-tinted blue-brand variants after per-theme rasters. */
export function headerUsesThemeTintedBrandMark(): boolean {
  return Boolean((catalog.logo as LogoCatalog).primaryBrandMarkThemeTinted && getPrimaryBrandMarkObjectKey());
}

export const HOMEPAGE_SCREENSHOT_SLOT_STEMS = catalog.homepageScreenshots.slotToLegacyStem;

/** Build a public URL for an object key in the nursenest-images Space (matches generate-marketing-assets `publicUrl`). */
export function nursenestImagesSpaceObjectUrl(objectKey: string): string {
  const b = NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL.replace(/\/$/, "");
  const enc = objectKey
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${b}/${enc}`;
}

export const LESSON_IMAGES_RESOLUTION = catalog.lessonImages;

/** Documented canonical hero URLs — source of truth: `src/config/home-hero-carousel.ts`. */
export const HOMEPAGE_HERO_CAROUSEL_PUBLIC_URLS = catalog.homepageHeroCarousel.canonicalPublicFallbackUrls;

export type MarketingCdnCatalog = typeof catalog;
