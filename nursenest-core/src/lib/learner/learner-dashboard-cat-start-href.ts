import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";

/** Shared CAT entry resolver for dashboard tiles (study modes + quick launch). */
export function catStartHrefFromPremiumSnapshot(snapshot: PremiumDashboardSnapshot): string {
  const ids = snapshot.pathways.map((p) => p.pathwayId);
  return resolveStudyLoopCatDestination({
    authState: "signed_in",
    pathwayId: snapshot.learnerPath,
    availablePathwayIds: ids,
    intent: "start",
  }).href;
}
