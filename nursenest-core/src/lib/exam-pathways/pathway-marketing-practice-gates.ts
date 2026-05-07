import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { catReadinessMinCompletePoolRows } from "@/lib/practice-tests/cat-pool";

/** Minimum published hub-scoped items before we advertise linear / mixed practice entry. */
export const MIN_MARKETING_LINEAR_PRACTICE_BANK = 1;

export function marketingLinearPracticeBankUsable(snapshot: PathwayQuestionBankSnapshot): boolean {
  return snapshot.status === "ok" && snapshot.pathwayScopedCount >= MIN_MARKETING_LINEAR_PRACTICE_BANK;
}

/**
 * Same floor as in-app CAT readiness ({@link catReadinessMinCompletePoolRows}) for marketing / hub CTAs.
 * Pass `pathwayId` so Pre-Nursing MV tracks use the smaller pool floor.
 */
export function marketingCatCompletePoolUsable(
  snapshot: PathwayQuestionBankSnapshot,
  pathwayId?: string | null,
): boolean {
  const min = catReadinessMinCompletePoolRows(pathwayId ?? undefined);
  return snapshot.status === "ok" && snapshot.adaptiveEligibleCount >= min;
}
