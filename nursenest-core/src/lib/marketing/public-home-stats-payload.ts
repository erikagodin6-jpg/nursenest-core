import { recordPaywallProofNeutral } from "@/lib/observability/production-signal-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { ECG_CLINICAL_REASONING_UNITS } from "@/lib/ecg-module/ecg-clinical-reasoning-index";
import { countLabsInventoryForTrack } from "@/lib/labs/labs-engine";
import { countMedCalcInventoryForTrack } from "@/lib/med-calculations/med-calculations-engine";

export function publicHomeStaticPlatformInventoryCounts() {
  const medMath = countMedCalcInventoryForTrack("rn");
  const labs = countLabsInventoryForTrack("rn");
  return {
    clinicalSkillCount: listClinicalSkills().length,
    medicationMathProblemCount: medMath.questionCount,
    ecgCaseCount: ECG_CLINICAL_REASONING_UNITS.length,
    labCaseCount: labs.questionCount,
  };
}

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
  clinicalSkillCount: number;
  medicationMathProblemCount: number;
  ecgCaseCount: number;
  labCaseCount: number;
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
  const staticCounts = publicHomeStaticPlatformInventoryCounts();
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
    clinicalSkillCount: staticCounts.clinicalSkillCount,
    medicationMathProblemCount: staticCounts.medicationMathProblemCount,
    ecgCaseCount: staticCounts.ecgCaseCount,
    labCaseCount: staticCounts.labCaseCount,
    questionsByTier: {},
    scenarioCount: 0,
    topicCategoryCount: 0,
    degraded: true,
    proofDisplay: "neutral",
  };
}
