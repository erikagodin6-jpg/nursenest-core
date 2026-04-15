import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { NursenestRegion } from "@/lib/region/use-nursenest-region";

/**
 * Resolves which global region the marketing header country control should show.
 *
 * Rules:
 * - **Philippines (and other expansion regions) are never implicit defaults.** They appear only
 *   when `nn_global_region` is set after the user picks that country in the dropdown.
 * - **Without a global cookie:** use the signed-in user's US/CA profile country when present,
 *   otherwise the site marketing exam region (US vs Canada toggle).
 * - **With a cookie:** honor it (including explicit `philippines`, `us`, `canada`, etc.).
 */
export function effectiveMarketingHeaderGlobalRegion(args: {
  globalRegionCookie: GlobalRegionSlug | null;
  marketingExamRegion: NursenestRegion;
  /** From session `user.country` when `"US"` | `"CA"` */
  sessionCountryUsCa: "US" | "CA" | undefined;
}): GlobalRegionSlug {
  const { globalRegionCookie, marketingExamRegion, sessionCountryUsCa } = args;
  if (globalRegionCookie) return globalRegionCookie;

  if (sessionCountryUsCa === "CA") return "canada";
  if (sessionCountryUsCa === "US") return "us";

  return marketingExamRegion === "CA" ? "canada" : "us";
}
