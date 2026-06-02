/**
 * NurseNest Advanced Question Type Registry
 *
 * Re-exports all specialized clinical reasoning question layouts.
 * Import from here rather than individual files.
 *
 * Usage:
 *   import { MatrixQuestionLayout, BowTieQuestionLayout } from
 *     "@/components/questions/advanced-question-type-registry";
 */

export { MatrixQuestionLayout } from "./matrix-question-layout";
export type { MatrixQuestionProps, MatrixColumn, MatrixRow } from "./matrix-question-layout";

export { BowTieQuestionLayout } from "./bowtie-question-layout";
export type { BowTieQuestionProps, BowTieColumn, BowTieOption } from "./bowtie-question-layout";

export { PrioritizationQuestionLayout } from "./prioritization-question-layout";
export type { PrioritizationQuestionProps, PriorityItem } from "./prioritization-question-layout";

export { AbgInterpretationLayout } from "./abg-interpretation-layout";
export type { AbgQuestionProps, AbgValue, AbgStep } from "./abg-interpretation-layout";

export { TimelineDeteriorationLayout } from "./timeline-deterioration-layout";
export type {
  TimelineDeterioration,
  TimelinePoint,
  TimelineQuestion,
  TimelineVital,
} from "./timeline-deterioration-layout";

/* ── Question type identifiers ────────────────────────────────────────────────
   Extend NclexQuestionType with the advanced types for use in renderers.
   ────────────────────────────────────────────────────────────────────────── */

export const ADVANCED_QUESTION_TYPES = [
  "matrix_mcq",
  "matrix_mr",
  "bowtie",
  "prioritization",
  "abg_interpretation",
  "timeline_deterioration",
  "hotspot",
  "audio_interpretation",
  "documentation_handoff",
] as const;

export type AdvancedQuestionType = (typeof ADVANCED_QUESTION_TYPES)[number];

export function isAdvancedQuestionType(format: string | null | undefined): boolean {
  if (!format) return false;
  const f = format.toLowerCase();
  return ADVANCED_QUESTION_TYPES.some((t) => f.includes(t.replace(/_/g, "")));
}

/**
 * Maps a raw question format string to the advanced question type key.
 * Returns null for standard MCQ / SATA.
 */
export function resolveAdvancedQuestionType(format: string | null | undefined): AdvancedQuestionType | null {
  if (!format) return null;
  const f = format.toLowerCase();
  if (f.includes("bowtie"))                 return "bowtie";
  if (f.includes("matrix_mr") || f.includes("matrixmr")) return "matrix_mr";
  if (f.includes("matrix"))                 return "matrix_mcq";
  if (f.includes("prioritization") || f.includes("rank")) return "prioritization";
  if (f.includes("abg"))                    return "abg_interpretation";
  if (f.includes("timeline") || f.includes("deterioration")) return "timeline_deterioration";
  if (f.includes("hotspot"))                return "hotspot";
  if (f.includes("audio"))                  return "audio_interpretation";
  if (f.includes("documentation") || f.includes("handoff") || f.includes("sbar")) return "documentation_handoff";
  return null;
}
