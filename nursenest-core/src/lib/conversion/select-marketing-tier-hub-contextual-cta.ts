import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";
export type MarketingTierHubContextualCtaVariant = "anonymous_start_track_practice" | "unlock_pathway_premium";

export type MarketingTierHubContextualCta = {
  variant: MarketingTierHubContextualCtaVariant;
  dedupeKey: string;
  headline: string;
  supportingLine: string;
  primaryHref: string;
  primaryLabel: string;
};

export type MarketingTierHubContextualCtaInput = {
  pathway: ExamPathwayDefinition;
  /** User has a session cookie (may or may not have pathway lesson access). */
  viewerSignedIn: boolean;
  /** Same gate as pathway lesson resume: entitlement + learner pathway alignment. */
  viewerHasPathwayLessonAccess: boolean;
  /** Public marketing href for the pathway question bank (from hub content card). */
  practiceQuestionsHref: string;
};

/**
 * Single contextual CTA for the marketing tier hub — complements the four study tiles without duplicating them.
 * - Anonymous learners: pathway-aligned “start practice” → public question hub.
 * - Signed-in without pathway lesson access: pricing on this track (no tier mismatch vs URL pathway).
 */
export function selectMarketingTierHubContextualCta(
  input: MarketingTierHubContextualCtaInput,
): MarketingTierHubContextualCta | null {
  const { pathway, viewerSignedIn, viewerHasPathwayLessonAccess, practiceQuestionsHref } = input;

  if (pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist") return null;
  if (isFreeStripeBillingNursingTier(pathway.stripeTier)) return null;

  if (viewerSignedIn && !viewerHasPathwayLessonAccess) {
    const primaryHref = buildExamPathwayPath(pathway, "pricing");
    return {
      variant: "unlock_pathway_premium",
      dedupeKey: `tier_hub:unlock_premium:${pathway.id}`,
      headline: `Unlock full ${pathway.shortName} questions`,
      supportingLine: "Your account is signed in, but this track needs an active plan to open the full lesson bank and premium question rationales.",
      primaryHref,
      primaryLabel: "View plans for this track",
    };
  }

  if (!viewerSignedIn) {
    return {
      variant: "anonymous_start_track_practice",
      dedupeKey: `tier_hub:start_practice:${pathway.id}`,
      headline: `Start ${pathway.shortName} practice`,
      supportingLine: "Try exam-style questions on this exam track—same scope as the Question Bank card above.",
      primaryHref: practiceQuestionsHref,
      primaryLabel: "Open question bank",
    };
  }

  return null;
}
