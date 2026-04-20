/**
 * Prevents full-page navigation to Auth.js JSON endpoints (`/api/auth/*`), which render as raw JSON
 * in the browser when used as SPA `router.replace` / `href` targets.
 */

export function isUserFacingAuthApiPath(href: string): boolean {
  if (!href?.trim()) return false;
  try {
    const pathOnly = href.startsWith("http") ? new URL(href).pathname : href.split("?")[0]?.split("#")[0] ?? "";
    const p = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
    return p === "/api/auth" || p.startsWith("/api/auth/");
  } catch {
    return true;
  }
}

/** Replace auth API paths with a safe in-app page (defaults to marketing login). */
export function sanitizeClientNavigationHref(href: string, safeFallback = "/login"): string {
  if (!href?.trim()) return safeFallback;
  return isUserFacingAuthApiPath(href) ? safeFallback : href;
}
