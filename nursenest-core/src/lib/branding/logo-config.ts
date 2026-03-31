import { NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL } from "@/config/marketing-cdn.catalog";

/**
 * Global site logo fallbacks (header uses `SiteBrandLogoMark` → `getHeaderBrandLogoLoadChain`:
 * per-theme PNG via `/api/marketing-assets/...` + CDN, then `PRIMARY_LOGO_URL`, then local SVG).
 * Base URL matches `digitalOceanSpaces.nursenestImages.publicBaseUrl` in `marketing-cdn.catalog.json`.
 */
export const PRIMARY_LOGO_URL = `${NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL.replace(/\/$/, "")}/bluebrandlogo.png` as const;

/**
 * Committed same-origin wordmark — always available when CDN/proxy/theme objects fail.
 * Bump `v` after visual updates to bust caches.
 */
export const LOCAL_BRAND_MARK_PATH = "/branding/nursenest-mark.svg?v=1" as const;

/** Same-origin SVG when remote theme marks fail (not the hero gradient placeholder). */
export const SITE_LOGO_FALLBACK_PATH = LOCAL_BRAND_MARK_PATH;

/**
 * @deprecated Alias for legacy `theme-logo-url` chains; same as `SITE_LOGO_FALLBACK_PATH`.
 */
export const FALLBACK_LOGO_PATH = SITE_LOGO_FALLBACK_PATH;

export const BRAND_NAME = "NurseNest" as const;

/** Inner `<img>` — height-driven scale; width follows aspect ratio (`w-auto`, no intrinsic Next/Image caps). */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block h-20 w-auto max-h-none max-w-none shrink-0 object-contain object-left sm:h-24 md:h-28 lg:h-36 xl:h-40" as const;

/**
 * Wrapper for `<SiteBrandLogoMark />` — no height/width clamps here; sizing lives on {@link HEADER_BRAND_LOGO_IMG_CLASSNAME}.
 */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "max-w-none overflow-visible" as const;
