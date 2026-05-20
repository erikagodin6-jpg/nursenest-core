/**
 * Re-exports theme logo resolution from `@/lib/branding/theme-brand-logo-cdn` (single implementation).
 */
export {
  MARKETING_CDN_PUBLIC_BASE,
  THEME_BRAND_LOGO_CDN_BY_ID,
  THEME_BRAND_LOGO_PREFIX,
  THEME_LOGO_FALLBACK_ID,
  getThemeBrandLogoCdnUrlForCanonicalId,
  getThemeLogo,
  getThemeLogoObjectKeyFromNormalizedId,
  getThemeLogoPublicPath,
  getThemeLogoUrl,
  themeBrandLogoObjectKey,
} from "@/lib/branding/theme-brand-logo-cdn";
