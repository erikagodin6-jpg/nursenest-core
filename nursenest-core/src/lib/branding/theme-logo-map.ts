/**
 * Single source of truth: theme-variant → public path (served from `/public` or Spaces under the same key).
 * Cache buster avoids stale browser/CDN assets after logo updates.
 */
export const THEME_LOGO_MAP: Record<string, string> = {
  default: "/branding/themes/logo-default.png?v=2",
  blue: "/branding/themes/logo-blue.png?v=2",
  berry: "/branding/themes/logo-berry.png?v=2",
  dark: "/branding/themes/logo-dark.png?v=2",
};
