/**
 * Global region override cookie.
 *
 * Parallel to the existing `nn_marketing_region` (US | CA) cookie.
 * This cookie stores a `GlobalRegionSlug` and is read by the proxy
 * for geo-redirect decisions and by server components for region context.
 *
 * The legacy US/CA cookie continues to work for the existing marketing
 * region toggle — this cookie is for the expanded global region system.
 */

import { isGlobalRegionSlug, type GlobalRegionSlug } from "@/lib/i18n/global-regions";

export const GLOBAL_REGION_COOKIE = "nn_global_region";
export const GLOBAL_REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 400; // ~13 months

/**
 * Parse the cookie value into a validated region slug.
 * Returns `undefined` if the value is missing or invalid.
 */
export function parseGlobalRegionCookie(raw: string | null | undefined): GlobalRegionSlug | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim().toLowerCase();
  return isGlobalRegionSlug(trimmed) ? trimmed : undefined;
}

/**
 * Build a `Set-Cookie` header value for the global region cookie.
 * Used in the proxy to persist geo-detection or user override.
 */
export function globalRegionSetCookieValue(region: GlobalRegionSlug): string {
  return `${GLOBAL_REGION_COOKIE}=${region};path=/;max-age=${GLOBAL_REGION_COOKIE_MAX_AGE};SameSite=Lax`;
}
