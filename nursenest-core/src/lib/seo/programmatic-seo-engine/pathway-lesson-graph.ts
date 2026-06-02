import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import {
  marketingLessonsTopicClusterPath,
  marketingPathwayLessonsIndexPath,
} from "@/lib/lessons/lesson-routes";
import type { PathwayLessonSeoGraph } from "@/lib/seo/programmatic-seo-engine/types";

/**
 * Deterministic URL graph for a pathway lesson (no DB). Used for metadata keywords,
 * internal-link hints, and audits.
 */
export function buildPathwayLessonSeoGraph(
  pathway: ExamPathwayDefinition,
  topicSlug: string | null | undefined,
): PathwayLessonSeoGraph {
  const examHubHref = buildExamPathwayPath(pathway);
  const lessonsIndexHref = marketingPathwayLessonsIndexPath(pathway);
  const questionsHubHref = buildExamPathwayPath(pathway, "questions");
  const catHubHref = pathwayAllowsCatAdaptiveStart(pathway) ? buildExamPathwayPath(pathway, "cat") : null;
  const ts = (topicSlug ?? "").trim();
  const topicLessonsHref = ts ? marketingLessonsTopicClusterPath(lessonsIndexHref, ts) : null;
  return {
    pathwayId: pathway.id,
    examHubHref,
    lessonsIndexHref,
    questionsHubHref,
    catHubHref,
    flashcardsHubHref: HUB.flashcards,
    topicLessonsHref,
  };
}
