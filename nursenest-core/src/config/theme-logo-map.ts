/**
 * Theme logo CDN URLs: {@link THEME_BRAND_LOGO_CDN_BY_ID} in `theme-brand-logo-cdn`.
 * Canonical Spaces keys: {@link THEME_LOGO_SPACE_KEYS} in `src/lib/branding/resolve-theme-logo.ts`.
 */
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";
import { MARKETING_CDN_PUBLIC_BASE, THEME_BRAND_LOGO_CDN_BY_ID } from "@/config/theme-brand-logo-cdn";

/** @deprecated Prefer `THEME_BRAND_LOGO_CDN_BY_ID` — values are full CDN URLs. */
export const THEME_LOGO_OBJECT_KEYS = THEME_BRAND_LOGO_CDN_BY_ID;

export const NURSENEST_SPACES_PUBLIC_ORIGIN = MARKETING_CDN_PUBLIC_BASE;

export const THEME_LOGO_DEFAULT_FALLBACK_ID = NURSENEST_DEFAULT_THEME;
