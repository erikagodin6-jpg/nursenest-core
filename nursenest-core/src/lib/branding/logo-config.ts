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
 * Fixed header slot: height + max-width are the single authority for rendered logo size.
 * The img uses {@link HEADER_BRAND_LOGO_IMG_CLASSNAME} (`h-full`, `object-contain`) inside this slot.
 * Previous `max-w ~18–24rem` caps were the main limiter on visible wordmark width.
 */
export const HEADER_BRAND_LOGO_SLOT_CLASSNAME =
  "nn-brand-header-logo-slot inline-flex flex-none shrink-0 items-center justify-start overflow-visible self-center bg-transparent h-[5.5rem] max-h-[5.5rem] w-auto max-w-[min(96vw,26rem)] sm:h-[6rem] sm:max-h-[6rem] sm:max-w-[28rem] md:h-[6.75rem] md:max-h-[6.75rem] md:max-w-[30rem] lg:h-[7.25rem] lg:max-h-[7.25rem] lg:max-w-[31rem] xl:h-[7.75rem] xl:max-h-[7.75rem] xl:max-w-[32rem] 2xl:h-[8.25rem] 2xl:max-h-[8.25rem] 2xl:max-w-[34rem]" as const;

/** Homepage header: one step larger than default slot (still same img pipeline). */
export const HOME_BRAND_LOGO_MARK_CLASSNAME =
  "!h-[6.35rem] !max-h-[6.35rem] sm:!h-[6.85rem] sm:!max-h-[6.85rem] md:!h-[7.5rem] md:!max-h-[7.5rem] lg:!h-[8rem] lg:!max-h-[8rem] xl:!h-[8.5rem] xl:!max-h-[8.5rem] 2xl:!h-[9rem] 2xl:!max-h-[9rem] !max-w-[min(96vw,28rem)] sm:!max-w-[30rem] md:!max-w-[32rem] lg:!max-w-[34rem] xl:!max-w-[36rem] 2xl:!max-w-[38rem]" as const;

/**
 * Raster mark: fills slot height; width from aspect ratio; `object-contain` keeps sharpness and trims effective padding vs stretching.
 */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block h-full w-auto max-h-full max-w-full shrink-0 bg-transparent object-contain object-left" as const;

/** Extra classes merged onto the slot in `<SiteBrandLogoMark />` (call sites rarely need overrides). */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME = "" as const;
