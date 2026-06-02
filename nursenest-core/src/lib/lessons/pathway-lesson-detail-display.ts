import type { TierCode } from "@prisma/client";
import {
  pathwayLessonExamFocusHasStructured,
  pathwayLessonResolvedParagraphs,
} from "@/components/lessons/pathway-lesson-body";
import { hasRenderableLessonFigure } from "@/lib/lessons/has-renderable-lesson-image";
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import type {
  PathwayLessonSection,
  PathwayLessonSectionKind,
} from "@/lib/lessons/pathway-lesson-types";

/**
 * Canonical clinical reading order for pathway lesson sections (presentation only).
 * Unknown kinds sort after mapped kinds, preserving stable relative order via index tie-break.
 */
const CLINICAL_SECTION_ORDER_WEIGHT: Partial<Record<PathwayLessonSectionKind, number>> = {
  introduction: 10,
  intro: 11,
  clinical_meaning: 15,
  core_concept: 18,
  core: 20,
  pathophysiology_overview: 25,
  clinical_manifestations: 32,
  signs_symptoms: 35,
  labs_diagnostics: 42,
  exam_focus: 48,
  exam_tips: 50,
  exam_relevance: 52,
  tier_specific_relevance: 54,
  treatment_management: 58,
  nursing_assessment_interventions: 62,
  clinical_application: 64,
  nursing_priorities: 66,
  red_flags: 70,
  complications: 72,
  client_education: 76,
  clinical_pearls: 80,
  clinical_scenario: 85,
  takeaways: 88,
  related_next_steps: 92,
};

const DEFAULT_KIND_WEIGHT = 100;

export function sortPathwayLessonSectionsForClinicalDisplay<T extends PathwayLessonSection>(
  sections: readonly T[],
): T[] {
  return sections
    .map((s, i) => ({ s, i }))
    .sort((a, b) => {
      const wa = CLINICAL_SECTION_ORDER_WEIGHT[a.s.kind] ?? DEFAULT_KIND_WEIGHT;
      const wb = CLINICAL_SECTION_ORDER_WEIGHT[b.s.kind] ?? DEFAULT_KIND_WEIGHT;
      if (wa !== wb) return wa - wb;
      return a.i - b.i;
    })
    .map(({ s }) => s);
}

export type PathwayLessonSectionRenderableContext = {
  section: PathwayLessonSection;
  /** Same string passed to `PathwayLessonSectionContent` `text` for this surface. */
  resolvedBodyText: string;
  viewerTier?: TierCode | null;
  measurementSystem?: MeasurementSystem | null;
  measurementDual?: boolean;
  /** Learner app: `related_next_steps` renders linked-learning cards when pathway is known. */
  linkedNextStepsUsesCardRail?: boolean;
};

/**
 * True when the section would render anything besides an empty-body sparse panel.
 * Keeps nav + article aligned; must mirror PathwayLessonSectionContent + recall/checkpoint rows.
 */
export function pathwayLessonSectionHasRenderableTeachingContent(
  ctx: PathwayLessonSectionRenderableContext,
): boolean {
  const { section, resolvedBodyText, viewerTier, measurementSystem, measurementDual } = ctx;
  if (ctx.linkedNextStepsUsesCardRail && section.kind === "related_next_steps") {
    return true;
  }
  if (section.audioUrl?.trim()) return true;
  if (section.checkpointQuestions?.length) return true;
  if (section.recallPrompts?.length) return true;
  if (section.keyRecallFacts?.length) return true;
  if (section.figures?.some(hasRenderableLessonFigure)) return true;
  if (pathwayLessonExamFocusHasStructured(section.examFocus)) return true;
  const paragraphs = pathwayLessonResolvedParagraphs(resolvedBodyText, {
    viewerTier,
    measurementSystem,
    measurementDual,
    sectionKind: section.kind ?? null,
  });
  return paragraphs.length > 0;
}
