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

/** Inner `<img>` — responsive height only via Tailwind; no fixed pixel props on the element. */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "block h-14 w-auto min-h-[3.5rem] sm:h-16 md:h-[4.25rem] lg:h-[4.5rem] max-h-none object-contain object-left" as const;

/**
 * Wrapper for `<SiteBrandLogoMark />` — do not set h-/max-w- here; sizing lives on {@link HEADER_BRAND_LOGO_IMG_CLASSNAME}.
 */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "object-left" as const;
