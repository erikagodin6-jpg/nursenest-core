/**
 * Local same-origin mark used when remote theme rasters fail.
 * CDN URLs are built from `theme-brand-logo-space-keys.ts` via `getThemeLogoUrl` in `theme-brand-logo-cdn.ts`.
 */
import { LOCAL_BRAND_MARK_PATH } from "@/lib/branding/logo-config";

/** @deprecated All variants resolve to the committed local SVG; kept for older imports. */
export const THEME_LOGO_MAP: Record<string, string> = {
  default: LOCAL_BRAND_MARK_PATH,
  blue: LOCAL_BRAND_MARK_PATH,
  berry: LOCAL_BRAND_MARK_PATH,
  dark: LOCAL_BRAND_MARK_PATH,
};
