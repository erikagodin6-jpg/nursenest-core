import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { canShowPricing } from "@/lib/navigation/market-readiness";
import { collectAuthoritativeCheckoutGlobalRegionSlugs } from "@/lib/region/checkout-global-region-context";

/**
 * When true, `POST /api/subscriptions/checkout` must include `naBillingScopeAcknowledged: true`.
 * Matches pricing-page soft gate: any **canonical** global region in play with {@link canShowPricing}
 * === false triggers the gate.
 *
 * Regions are collected from (union):
 * - `nn_global_region` (marketing / client-readable)
 * - `nn_co_region_ctx` (HttpOnly signed explicit selection — see checkout-global-region-context)
 * - optional checkout JSON `region` slug (validated)
 */
export function naBillingScopeAckRequiredForCheckout(args: {
  globalRegionCookieRaw?: string | null | undefined;
  /** HttpOnly signed stamp from {@link saveContextPreferences} / explicit region saves. */
  checkoutRegionContextCookieRaw?: string | null | undefined;
  checkoutBodyRegionSlug?: GlobalRegionSlug;
}): boolean {
  for (const slug of collectAuthoritativeCheckoutGlobalRegionSlugs(args)) {
    if (!canShowPricing(slug)) return true;
  }
  return false;
}

/** Cookie-only helper — prefer {@link naBillingScopeAckRequiredForCheckout} for POST enforcement. */
export function naBillingScopeAckRequiredForCookieValue(
  rawGlobalRegionCookie: string | null | undefined,
  checkoutRegionContextCookieRaw?: string | null | undefined,
): boolean {
  return naBillingScopeAckRequiredForCheckout({
    globalRegionCookieRaw: rawGlobalRegionCookie,
    checkoutRegionContextCookieRaw,
  });
}
