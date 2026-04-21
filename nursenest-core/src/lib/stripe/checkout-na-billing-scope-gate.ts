import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { canShowPricing } from "@/lib/navigation/market-readiness";
import { parseGlobalRegionCookie } from "@/lib/region/global-region-cookie";

/**
 * When true, `POST /api/subscriptions/checkout` must include `naBillingScopeAcknowledged: true`.
 * Matches pricing-page soft gate: any **canonical** global region in play (cookie and/or checkout
 * body slug) with {@link canShowPricing} === false triggers the gate.
 *
 * Cookie mirrors the marketing country selector; body slug covers direct API entry paths that
 * omit or clear the cookie but still request a partial/marketing regional price.
 */
export function naBillingScopeAckRequiredForCheckout(args: {
  globalRegionCookieRaw: string | null | undefined;
  checkoutBodyRegionSlug?: GlobalRegionSlug;
}): boolean {
  const slugs = new Set<GlobalRegionSlug>();
  const fromCookie = parseGlobalRegionCookie(args.globalRegionCookieRaw);
  if (fromCookie) slugs.add(fromCookie);
  if (args.checkoutBodyRegionSlug) slugs.add(args.checkoutBodyRegionSlug);
  for (const slug of slugs) {
    if (!canShowPricing(slug)) return true;
  }
  return false;
}

/** Cookie-only helper — see {@link naBillingScopeAckRequiredForCheckout} for full policy. */
export function naBillingScopeAckRequiredForCookieValue(
  rawGlobalRegionCookie: string | null | undefined,
): boolean {
  return naBillingScopeAckRequiredForCheckout({
    globalRegionCookieRaw: rawGlobalRegionCookie,
    checkoutBodyRegionSlug: undefined,
  });
}
