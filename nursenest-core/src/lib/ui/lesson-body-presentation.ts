import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

/** Matches {@link KIND_TO_BODY_TOKEN.core_concept} — safe default when a runtime kind string is not in the map. */
const DEFAULT_BODY_TOKEN = "concept";

/**
 * Stable BEM tokens for `.nn-lesson-body--*` on lesson prose roots.
 * Pairs with `data-lsc-kind` on pathway lesson section cards for section-scoped CSS.
 */
const KIND_TO_BODY_TOKEN = {
  introduction: "intro",
  pathophysiology_overview: "mechanism",
  signs_symptoms: "presentation",
  red_flags: "trap",
  labs_diagnostics: "labs",
  nursing_assessment_interventions: "intervention",
  clinical_pearls: "pearl",
  client_education: "education",
  tier_specific_relevance: "tier",
  country_specific_notes: "regional",
  related_next_steps: "next",
  clinical_meaning: "mechanism",
  exam_relevance: "exam",
  core_concept: "concept",
  clinical_scenario: "scenario",
  takeaways: "takeaway",
  intro: "intro",
  core: "concept",
  clinical_application: "application",
  exam_tips: "exam",
  exam_focus: "exam",
  clinical_manifestations: "presentation",
  treatment_management: "meds",
  nursing_priorities: "action",
  complications: "trap",
} as const satisfies Record<PathwayLessonSectionKind, string>;

/**
 * Returns a single extra class for the lesson body root (e.g. `nn-lesson-body--tier`), or null.
 */
export function lessonBodyPresentationClass(
  kind: PathwayLessonSectionKind | null | undefined,
): string | null {
  if (kind == null) return null;
  const token = KIND_TO_BODY_TOKEN[kind] ?? DEFAULT_BODY_TOKEN;
  return token ? `nn-lesson-body--${token}` : null;
}
