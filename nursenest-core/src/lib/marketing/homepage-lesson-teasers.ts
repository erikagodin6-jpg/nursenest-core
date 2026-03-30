import { buildExamPathwayPath, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";

export type HomepageLessonTeaser = {
  id: string;
  title: string;
  shortLabel: string;
  lessonsHref: string;
};

/** Order: RN → PN/RPN → NP (US) → allied → remainder (stable, not registry order). */
function pathwaySortKey(p: ExamPathwayDefinition): number {
  if (p.roleTrack === "rn" && p.examCode === "nclex-rn") return 0;
  if (p.roleTrack === "lpn" || p.roleTrack === "rpn") return 1;
  if (p.roleTrack === "np") return 2;
  if (p.roleTrack === "allied") return 3;
  return 9;
}

/**
 * Home marketing strip: active pathways that have at least one catalog lesson (avoids 404 lesson hubs).
 */
export function getHomepageLessonTeasers(): HomepageLessonTeaser[] {
  const lessonIds = new Set(listPathwayIdsWithLessons());
  return listPublicExamPathways()
    .filter((p) => p.status === "active" && lessonIds.has(p.id))
    .sort((a, b) => {
      const d = pathwaySortKey(a) - pathwaySortKey(b);
      if (d !== 0) return d;
      return a.displayName.localeCompare(b.displayName);
    })
    .map((p) => ({
      id: p.id,
      title: p.displayName,
      shortLabel: p.shortName,
      lessonsHref: buildExamPathwayPath(p, "lessons"),
    }));
}
