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
 * Fixed header slot: same box for every theme so raster marks with different canvas padding normalize visually.
 * Height drives scale; max-width caps overflow. Image uses {@link HEADER_BRAND_LOGO_IMG_CLASSNAME} inside this slot.
 */
export const HEADER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-header-logo-slot inline-flex flex-none shrink-0 items-center justify-start overflow-visible self-center h-14 max-h-14 w-auto max-w-[min(88vw,15rem)] sm:h-[3.75rem] sm:max-h-[3.75rem] sm:max-w-[min(88vw,16rem)] md:h-16 md:max-h-16 md:max-w-[17rem] lg:h-[4.5rem] lg:max-h-[4.5rem] lg:max-w-[18rem] xl:h-[5rem] xl:max-h-[5rem] xl:max-w-[19rem] 2xl:h-[5.5rem] 2xl:max-h-[5.5rem] 2xl:max-w-[20rem]" as const;

/**
 * Raster mark: fills slot height; width from aspect ratio; `object-contain` keeps sharpness and trims effective padding vs stretching.
 */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block h-full w-auto max-h-full max-w-full shrink-0 object-contain object-left" as const;

/** Extra classes merged onto the slot in `<SiteBrandLogoMark />` (call sites rarely need overrides). */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "" as const;
