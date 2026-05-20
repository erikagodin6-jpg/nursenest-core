import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";

/** Structured “what to study next” — feeds UI and analytics; exam-scoped. */
export type StudyRecommendationTopic = {
  rank: 1 | 2 | 3;
  title: string;
  reason: string;
  /** Hrefs already pathway-aware from coach */
  lessonHref?: string;
  flashcardHref?: string;
  drillHref?: string;
};

export type StudyRecommendationBundle = {
  examContext: GlobalExamContext;
  topics: StudyRecommendationTopic[];
  keyRisk: string | null;
  passOutlookPercent: number;
};

/**
 * Map CAT coach snapshot → top study steps (no generic “study more” lines).
 */
export function buildStudyRecommendationsFromCatCoach(
  ctx: GlobalExamContext,
  coach: CatResultsCoachSnapshot,
): StudyRecommendationBundle {
  const topics: StudyRecommendationTopic[] = coach.studyNext.slice(0, 3).map((s, i) => ({
    rank: (i + 1) as 1 | 2 | 3,
    title: s.title,
    reason: s.reason,
    lessonHref: s.links.find((l) => l.kind === "lesson")?.href,
    flashcardHref: s.links.find((l) => l.kind === "flashcards")?.href,
    drillHref: s.links.find((l) => l.kind === "drill")?.href,
  }));

  return {
    examContext: ctx,
    topics,
    keyRisk: coach.keyRiskFactor,
    passOutlookPercent: coach.passOutlookPercent,
  };
}
