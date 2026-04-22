import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

/**
 * Unprefixed `(default)` marketing layout: legacy `nn_marketing_region` wins, then
 * `nn_global_region` when it is explicitly `us` | `canada` (matches header global-region
 * behavior in {@link effectiveDefaultPublicGlobalRegion}), else Canada-first fallback.
 */
export function resolveDefaultLayoutMarketingExamRegion(args: {
  marketingRegionCookie: MarketingRegionToggle | undefined;
  globalRegionSlug: GlobalRegionSlug | null;
}): MarketingRegionToggle {
  if (args.marketingRegionCookie) return args.marketingRegionCookie;
  if (args.globalRegionSlug === "us") return "US";
  if (args.globalRegionSlug === "canada") return "CA";
  return "CA";
}
