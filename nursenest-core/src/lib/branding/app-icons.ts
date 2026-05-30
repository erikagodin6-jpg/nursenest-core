import { BLOSSOM_LEAF_128_WEBP, BLOSSOM_LEAF_LEGACY_CDN_PNG } from "@/lib/branding/blossom-leaf-assets";

/** Canonical NurseNest app icon version. Bump this when favicon assets change. */
export const NURSENEST_APP_ICON_VERSION = "2026-05-22-pink-v3" as const;

function withVersion(url: string): string {
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}v=${NURSENEST_APP_ICON_VERSION}`;
}

/** Brand primary color for app icons. */
export const NURSENEST_LEAF_BRAND_COLOR = "#f72fa8" as const;

export const NURSENEST_PINK_FAVICON_URL =
  withVersion("https://nursenest-images.tor1.cdn.digitaloceanspaces.com/pinkfavicon.png");

export const NURSENEST_PINK_FAVICON_SVG_PATH = withVersion("/favicon-pink-v3.svg");

export const NURSENEST_BLOSSOM_LEAF_LOGO_URL = BLOSSOM_LEAF_128_WEBP;

/** @deprecated Prefer {@link NURSENEST_BLOSSOM_LEAF_LOGO_URL} (optimized same-origin WebP). */
export const NURSENEST_BLOSSOM_LEAF_LEGACY_CDN_URL = BLOSSOM_LEAF_LEGACY_CDN_PNG;

export const NURSENEST_AURORA_PAGE_LOGO_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/00e0dc0f-b614-4e28-9fa9-33cdcf89cf0c.png" as const;

/** Ocean / North Sea theme leaf — blue CDN mark (default `data-theme="ocean"`). */
export const NURSENEST_OCEAN_LEAF_LOGO_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png" as const;

export const NURSENEST_CANONICAL_LEAF_SVG_PATH = NURSENEST_OCEAN_LEAF_LOGO_URL;

/** Header/footer leaf fallback when the active theme raster fails (Ocean default = blue North Sea). */
export const NURSENEST_NAV_LEAF_SVG_PATH = NURSENEST_OCEAN_LEAF_LOGO_URL;

export const nursenestAppIcons = {
  favicon: NURSENEST_PINK_FAVICON_URL,
  svg: NURSENEST_PINK_FAVICON_SVG_PATH,
  navLeafSvg: withVersion(NURSENEST_NAV_LEAF_SVG_PATH),
} as const;
