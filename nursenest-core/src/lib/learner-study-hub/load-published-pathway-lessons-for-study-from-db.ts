import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  getCatalogPathwayLessonsSync,
  normalizeLesson,
  pathwayLessonRowToInput,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const STUDY_SELECT = {
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  sections: true,
  locale: true,
  exams: true,
  countries: true,
  priority: true,
  examMeta: true,
} as const;

/**
 * Published `PathwayLesson` rows for learner study hubs (flashcards + inline practice).
 * Excludes drafts via `status: PUBLISHED` and applies structural completeness when the column exists.
 */
export async function loadPublishedPathwayLessonsForStudyFromDb(
  pathwayId: string,
  opts?: { take?: number },
): Promise<PathwayLessonRecord[]> {
  const pid = pathwayId?.trim();
  if (!pid) return [];

  const take = Math.min(PATHWAY_CATALOG_LIST_HARD_CAP, Math.max(1, opts?.take ?? 800));

  try {
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId: pid,
        status: ContentStatus.PUBLISHED,
        locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
        structuralPublicComplete: true,
      },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      take,
      select: STUDY_SELECT,
    });

    const out: PathwayLessonRecord[] = [];
    for (const row of rows) {
      const normalized = normalizeLesson(pathwayLessonRowToInput(row), pid);
      if (pathwayLessonEligibleForLearnerStudyInventory(normalized)) {
        out.push(normalized);
      }
    }
    return out;
  } catch (err) {
    safeServerLog("study_delivery", "self_healing_fallback", {
      surface: "lesson_study_hub",
      from_tier: "primary",
      to_tier: "secondary",
      pathway_id: pid,
      reason: "db_error",
      cards_served: 0,
      source: "catalog_virtual",
      error: err instanceof Error ? err.message.slice(0, 200) : "unknown",
    });
    const catalogLessons = getCatalogPathwayLessonsSync(pid);
    return catalogLessons.filter(pathwayLessonEligibleForLearnerStudyInventory).slice(0, take);
  }
}
