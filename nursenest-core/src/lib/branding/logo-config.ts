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
/** Header mark: fixed slot height scales the raster consistently across themes/breakpoints. */
export const HEADER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-header-logo-slot inline-flex flex-none shrink-0 items-center justify-start overflow-visible self-center h-[4.25rem] max-h-[4.25rem] w-auto max-w-[min(92vw,18rem)] sm:h-[4.75rem] sm:max-h-[4.75rem] sm:max-w-[min(92vw,19rem)] md:h-[5.25rem] md:max-h-[5.25rem] md:max-w-[20rem] lg:h-[5.75rem] lg:max-h-[5.75rem] lg:max-w-[21rem] xl:h-[6.25rem] xl:max-h-[6.25rem] xl:max-w-[22rem] 2xl:h-[6.75rem] 2xl:max-h-[6.75rem] 2xl:max-w-[23rem]" as const;

/** Homepage: stronger visual weight while keeping the same image pipeline (`object-contain` inside slot). */
export const HOME_BRAND_LOGO_MARK_CLASSNAME =
  "!h-[4.85rem] !max-h-[4.85rem] sm:!h-[5.35rem] sm:!max-h-[5.35rem] md:!h-[5.85rem] md:!max-h-[5.85rem] lg:!h-[6.35rem] lg:!max-h-[6.35rem] xl:!h-[6.85rem] xl:!max-h-[6.85rem] 2xl:!h-[7.25rem] 2xl:!max-h-[7.25rem] !max-w-[min(92vw,18.5rem)] sm:!max-w-[min(92vw,20rem)] md:!max-w-[21rem] lg:!max-w-[22rem] xl:!max-w-[23rem] 2xl:!max-w-[24rem]" as const;

/**
 * Raster mark: fills slot height; width from aspect ratio; `object-contain` keeps sharpness and trims effective padding vs stretching.
 */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block h-full w-auto max-h-full max-w-full shrink-0 object-contain object-left" as const;

/** Extra classes merged onto the slot in `<SiteBrandLogoMark />` (call sites rarely need overrides). */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "" as const;
