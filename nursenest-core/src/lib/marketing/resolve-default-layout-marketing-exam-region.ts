import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

/**
 * Canonical US/CA exam-region toggle for pricing labels, tier defaults, and
 * {@link NursenestRegionRoot} — same precedence everywhere:
 *
 * 1. Explicit `nn_marketing_region`
 * 2. `nn_global_region` when `us` | `canada`
 * 3. IP country from `x-vercel-ip-country` / `cf-ipcountry` when `US` | `CA`
 * 4. Canada-first fallback (unprefixed marketing default)
 */
export function resolveMarketingExamRegionToggle(args: {
  marketingRegionCookie: MarketingRegionToggle | undefined;
  globalRegionSlug: GlobalRegionSlug | null;
  /** ISO 3166-1 alpha-2 from edge headers (optional). */
  detectedIpCountry?: string | null;
}): MarketingRegionToggle {
  if (args.marketingRegionCookie) return args.marketingRegionCookie;
  if (args.globalRegionSlug === "us") return "US";
  if (args.globalRegionSlug === "canada") return "CA";
  const cc = (args.detectedIpCountry ?? "").toUpperCase().trim();
  if (cc === "US") return "US";
  if (cc === "CA") return "CA";
  return "CA";
}

/**
 * Unprefixed `(default)` marketing layout: legacy `nn_marketing_region` wins, then
 * `nn_global_region` when it is explicitly `us` | `canada` (matches header global-region
 * behavior in {@link effectiveDefaultPublicGlobalRegion}), else IP-inferred US/CA, else
 * Canada-first fallback.
 */
export function resolveDefaultLayoutMarketingExamRegion(args: {
  marketingRegionCookie: MarketingRegionToggle | undefined;
  globalRegionSlug: GlobalRegionSlug | null;
  detectedIpCountry?: string | null;
}): MarketingRegionToggle {
  return resolveMarketingExamRegionToggle(args);
}
