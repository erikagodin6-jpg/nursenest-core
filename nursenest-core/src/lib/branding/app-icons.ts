/** Canonical externally hosted NurseNest app icon/logo URLs. */
export const NURSENEST_APP_ICON_VERSION = "2026-05-21-cdn-pink" as const;

/** Brand primary color for app icons. */
export const NURSENEST_LEAF_BRAND_COLOR = "#f72fa8" as const;

export const NURSENEST_PINK_FAVICON_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/pinkfavicon.png" as const;

export const NURSENEST_BLOSSOM_LEAF_LOGO_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/hotpinkblossomleaflogo.png" as const;

export const NURSENEST_AURORA_PAGE_LOGO_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/00e0dc0f-b614-4e28-9fa9-33cdcf89cf0c.png" as const;

export const NURSENEST_CANONICAL_LEAF_SVG_PATH = NURSENEST_BLOSSOM_LEAF_LOGO_URL;

/** Header/footer leaf fallback. Uses the approved Blossom leaf, not a generated local mark. */
export const NURSENEST_NAV_LEAF_SVG_PATH = NURSENEST_BLOSSOM_LEAF_LOGO_URL;

function withVersion(path: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}v=${NURSENEST_APP_ICON_VERSION}`;
}

export const nursenestAppIcons = {
  favicon: withVersion(NURSENEST_PINK_FAVICON_URL),
  svg: withVersion(NURSENEST_PINK_FAVICON_URL),
  navLeafSvg: withVersion(NURSENEST_NAV_LEAF_SVG_PATH),
  ico: withVersion(NURSENEST_PINK_FAVICON_URL),
  apple: withVersion(NURSENEST_PINK_FAVICON_URL),
  png192: withVersion(NURSENEST_PINK_FAVICON_URL),
  png512: withVersion(NURSENEST_PINK_FAVICON_URL),
  mask: withVersion(NURSENEST_PINK_FAVICON_URL),
} as const;
