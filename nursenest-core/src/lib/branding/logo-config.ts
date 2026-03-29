/**
 * Global site logo fallbacks (header uses `SiteBrandLogoMark` → `getHeaderBrandLogoLoadChain`:
 * per-theme PNG via `/api/marketing-assets/...` + CDN, then `PRIMARY_LOGO_URL`, then local SVG).
 */
export const PRIMARY_LOGO_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/bluebrandlogo.png" as const;

/** Same-origin SVG when the CDN mark fails — `public/marketing/hero-fallback.svg`. */
export const SITE_LOGO_FALLBACK_PATH = "/marketing/hero-fallback.svg" as const;

/**
 * @deprecated Alias for legacy `theme-logo-url` chains; same as `SITE_LOGO_FALLBACK_PATH`.
 */
export const FALLBACK_LOGO_PATH = SITE_LOGO_FALLBACK_PATH;

export const BRAND_NAME = "NurseNest" as const;
