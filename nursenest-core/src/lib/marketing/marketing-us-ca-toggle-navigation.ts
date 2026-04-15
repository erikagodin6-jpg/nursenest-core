import type { NursenestRegion } from "@/lib/region/use-nursenest-region";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
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
    // Bare `/us` and `/canada` are not guaranteed to resolve to marketing content; land on canonical RN hubs.
    return {
      kind: "replace",
      href: next === "US" ? CANONICAL_PATHWAY_HUB.usRn : CANONICAL_PATHWAY_HUB.caRn,
    };
  }

  return { kind: "refresh" };
}
