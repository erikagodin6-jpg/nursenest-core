/**
 * Canonical hrefs for nursing tier hub study tiles (Lessons, Flashcards, Practice, Exams/CAT).
 * Always derived from the resolved {@link ExamPathwayDefinition} — do not trust CMS/config `href`
 * overrides for these surfaces (avoids `#`, fragments, or cross-tier URLs).
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

export const MARKETING_TIER_HUB_STUDY_ACTION_IDS = ["lessons", "flashcards", "practice_questions", "exams"] as const;

export type MarketingTierHubStudyActionId = (typeof MARKETING_TIER_HUB_STUDY_ACTION_IDS)[number];

export function isMarketingTierHubStudyActionId(id: string): id is MarketingTierHubStudyActionId {
  return (MARKETING_TIER_HUB_STUDY_ACTION_IDS as readonly string[]).includes(id);
}

/**
 * Single resolver for tier hub study-card destinations (marketing + tests).
 */
export function marketingTierHubStudyActionHref(pathway: ExamPathwayDefinition, actionId: MarketingTierHubStudyActionId): string {
  switch (actionId) {
    case "lessons":
      return marketingPathwayLessonsIndexPath(pathway);
    case "flashcards":
      return `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`;
    case "practice_questions":
      return buildExamPathwayPath(pathway, "questions");
    case "exams":
      return buildExamPathwayPath(pathway, "cat");
    default: {
      const _never: never = actionId;
      return _never;
    }
  }
}
