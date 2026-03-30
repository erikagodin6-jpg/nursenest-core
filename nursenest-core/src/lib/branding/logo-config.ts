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

/**
 * Default classes for `<SiteBrandLogoMark />` — use on marketing, app shell, and footer for consistent header height and responsive scaling.
 * Reserved vertical space reduces layout shift when the raster loads.
 */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME =
  "h-10 w-auto max-w-[min(100%,14rem)] object-contain object-left md:h-14" as const;
