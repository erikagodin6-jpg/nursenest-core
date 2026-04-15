import type { NursenestRegion } from "@/lib/region/use-nursenest-region";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";

export type UsCaToggleNavigation =
  | { kind: "replace"; href: string }
  | { kind: "refresh" };

/**
 * After switching the legacy US/CA marketing toggle, decide whether to replace the URL,
 * refresh RSC, or both. Expansion exam hubs (`/exams/philippines`, etc.) are not under
 * `/us` or `/canada`, so {@link equivalentExamHubUrlAfterRegionToggle} returns null — we
 * must navigate to a valid primary hub instead of `router.refresh()` alone (dead URL).
 */
export function navigationAfterUsCaMarketingToggle(
  strippedPathname: string,
  next: NursenestRegion,
): UsCaToggleNavigation {
  const bare = (strippedPathname.split("?")[0] ?? strippedPathname).split("#")[0] ?? strippedPathname;
  const eq = equivalentExamHubUrlAfterRegionToggle(bare, next);
  if (eq) return { kind: "replace", href: eq };

  const onUsCaHub =
    bare === "/us" ||
    bare.startsWith("/us/") ||
    bare === "/canada" ||
    bare.startsWith("/canada/");
  if (onUsCaHub) return { kind: "refresh" };

  if (bare.startsWith("/exams/")) {
    return { kind: "replace", href: next === "US" ? "/us" : "/canada" };
  }

  return { kind: "refresh" };
}
