import { recordPaywallProofNeutral } from "@/lib/observability/production-signal-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Full payload returned by `GET /api/public/home-stats` — shared with marketing and paywall surfaces. */
export type PublicHomeStatsPayload = {
  totalLessons: number;
  pathwayLessonsPublished: number;
  contentItemsLessonCount: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  storeProductCount: number;
  registeredLearners: number;
  questionsByTier: Record<string, number>;
  scenarioCount: number;
  topicCategoryCount: number;
  degraded?: boolean;
  runtimeSafeMode?: boolean;
  proofDisplay?: "full" | "neutral";
};

/** Safe structured fallback when DB throws or routes need a 200 — never crashes callers. */
export function getDegradedPublicHomeStatsFallback(
  reason: string,
  opts?: { silent?: boolean },
): PublicHomeStatsPayload {
  if (!opts?.silent) {
    safeServerLog("marketing", "public_home_stats_degraded", { reason: reason.slice(0, 120) });
    recordPaywallProofNeutral("fallback");
  }
  return {
    totalLessons: 0,
    pathwayLessonsPublished: 0,
    contentItemsLessonCount: 0,
    questionCount: 0,
    totalFlashcards: 0,
    totalDecks: 0,
    storeProductCount: 0,
    registeredLearners: 0,
    questionsByTier: {},
    scenarioCount: 0,
    topicCategoryCount: 0,
    degraded: true,
    proofDisplay: "neutral",
  };
}
