import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

/**
 * Section kinds that read well in a side-by-side pair on tablet/desktop (compact clinical blocks).
 * Long-form narrative sections stay full width — see {@link pathwayLessonSectionPrefersWideColumn}.
 */
const GRID_TWO_COLUMN_KINDS = new Set<PathwayLessonSectionKind>([
  "signs_symptoms",
  "red_flags",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "related_next_steps",
]);

/**
 * Hide redundant pathway-scoped “country” copy from the lesson UI (data remains in catalog/DB).
 */
export function shouldRenderPathwayLessonSection(kind: PathwayLessonSectionKind | undefined | null): boolean {
  return kind !== "country_specific_notes";
}

/**
 * When true, the section should span the full article grid on md+ (single column of reading).
 * Checkpoint-heavy sections stay wide so questions and rationale are not squeezed.
 */
export function pathwayLessonSectionPrefersWideColumn(
  kind: PathwayLessonSectionKind | undefined | null,
  opts?: { hasCheckpointQuestions?: boolean },
): boolean {
  if (opts?.hasCheckpointQuestions) return true;
  if (kind == null) return true;
  return !GRID_TWO_COLUMN_KINDS.has(kind);
}
