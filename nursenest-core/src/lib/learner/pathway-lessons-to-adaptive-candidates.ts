import type { LessonRecommendationCandidate } from "@/lib/adaptive-learning/adaptive-learning-types";
import { computePathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import type { PathwayLessonDashboardRow } from "@/lib/learner/load-learner-dashboard";
import type {
  PathwayLessonQuizItem,
  PathwayLessonRecord,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

function dashboardRowAsLessonRecord(row: PathwayLessonDashboardRow): PathwayLessonRecord {
  return {
    slug: row.slug,
    title: row.title,
    topic: row.topic,
    topicSlug: row.topicSlug ?? "",
    bodySystem: row.bodySystem,
    previewSectionCount: 0,
    seoTitle: row.title,
    seoDescription: "",
    sections: [] as PathwayLessonSection[],
    preTestQuestionIds: [] as string[],
    postTestQuestionIds: [] as string[],
    preTest: [] as PathwayLessonQuizItem[],
    postTest: [] as PathwayLessonQuizItem[],
  };
}

/**
 * Maps capped pathway lesson inventory rows to adaptive engine candidates (metadata only — no bodies).
 */
export function pathwayLessonRowsToAdaptiveCandidates(
  pathwayId: string,
  rows: PathwayLessonDashboardRow[] | null | undefined,
  max = 120,
): LessonRecommendationCandidate[] {
  if (!pathwayId?.trim() || !rows?.length) return [];
  const pid = pathwayId.trim();
  const slice = rows.slice(0, max);
  const out: LessonRecommendationCandidate[] = [];
  for (const r of slice) {
    const slug = r.slug?.trim();
    if (!slug) continue;
    const lesson = dashboardRowAsLessonRecord(r);
    out.push({
      slug,
      title: r.title?.trim() || slug,
      topicSlug: r.topicSlug?.trim() || undefined,
      bodySystem: r.bodySystem?.trim() || undefined,
      linkedLearningSignals: computePathwayLessonLinkedLearningSignals(pid, lesson),
    });
  }
  return out;
}
