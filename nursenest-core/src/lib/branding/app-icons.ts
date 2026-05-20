/**
 * Canonical NurseNest app icon URLs — single source for layout metadata, manifest, and tests.
 * Raster assets are generated from `src/assets/brand/leaf-logo-favicon.svg` via `npm run icons:generate`.
 * Vector mark matches nav/header: same geometry as `SiteBrandLogoMark` arctic-frost leaf (`/logos/arctic-frost-leaf.svg`).
 */
export const NURSENEST_APP_ICON_VERSION = "2026-05-20-pink" as const;

/** Brand primary color for app icons. */
export const NURSENEST_LEAF_BRAND_COLOR = "#f72fa8" as const;

export const NURSENEST_CANONICAL_LEAF_SVG_PATH = "/brand/leaf-logo.svg" as const;

/** Legacy public path kept in sync with canonical mark (header/footer resolveThemeLogo). */
export const NURSENEST_NAV_LEAF_SVG_PATH = "/logos/arctic-frost-leaf.svg" as const;

function withVersion(path: string): string {
  return `${path}?v=${NURSENEST_APP_ICON_VERSION}`;
}

export const nursenestAppIcons = {
  svg: withVersion(NURSENEST_CANONICAL_LEAF_SVG_PATH),
  navLeafSvg: withVersion(NURSENEST_NAV_LEAF_SVG_PATH),
  ico: withVersion("/favicon.ico"),
  apple: withVersion("/apple-touch-icon.png"),
  png192: withVersion("/icon-192.png"),
  png512: withVersion("/icon-512.png"),
  mask: withVersion("/mask-icon.svg"),
} as const;
