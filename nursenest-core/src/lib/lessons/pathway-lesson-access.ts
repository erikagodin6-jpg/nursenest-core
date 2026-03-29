import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Full lesson body requires tier+country match + NP specialty match when learnerPath is set.
 * Prevents NP-FNP language from "unlocking" while studying under PMHNP pathway (and vice versa).
 */
export function canViewFullPathwayLesson(
  scope: AccessScope,
  pathway: ExamPathwayDefinition,
  learnerPath: string | null | undefined,
): boolean {
  if (!subscriptionCoversPathwayBase(scope, pathway)) return false;
  if (pathway.roleTrack !== "np") return true;
  const lp = learnerPath?.trim();
  if (!lp) return true;
  return lp === pathway.id;
}

export function visibleSectionsForLesson(
  lesson: PathwayLessonRecord,
  fullAccess: boolean,
): PathwayLessonRecord["sections"] {
  if (fullAccess) return lesson.sections;
  const n = lesson.previewSectionCount;
  return lesson.sections.slice(0, n);
}
