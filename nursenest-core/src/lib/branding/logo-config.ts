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
 * Inner `<img>` — `!h-*` / `!max-w-none` beat Tailwind preflight `img { max-width: 100%; height: auto }`, which
 * otherwise caps the mark to the link column and ignores intended header height.
 */
export const HEADER_BRAND_LOGO_IMG_CLASSNAME =
  "nn-brand-header-logo block !h-[3.25rem] !w-auto !min-w-0 !max-w-none !shrink-0 !object-contain !object-left sm:!h-16 md:!h-[5.25rem] lg:!h-24 xl:!h-[6.75rem] 2xl:!h-32" as const;

/**
 * Wrapper for `<SiteBrandLogoMark />` — flex-safe brand slot; raster sizing lives on {@link HEADER_BRAND_LOGO_IMG_CLASSNAME}.
 */
export const DEFAULT_BRAND_LOGO_MARK_CLASSNAME =
  "flex flex-none max-w-none items-center justify-start self-center overflow-visible" as const;
