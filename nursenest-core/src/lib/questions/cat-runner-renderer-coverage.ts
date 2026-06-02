/**
 * CAT / practice runner — which `question_type` + payload shapes the client can render
 * (MCQ / SATA / Bowtie) vs safe fallback. Used by coverage reports and pool assertions.
 */
import { tryNormalizeBowtiePayload } from "@/lib/questions/bowtie-adapter";
import { practiceRunnerNeedsUnsupportedFallback } from "@/lib/questions/practice-runner-question-support";

export type CatRunnerMatrixRow = {
  /** Stable id for docs + reports */
  id: string;
  /** Typical `exam_questions.question_type` strings */
  questionTypeExamples: string[];
  runtimeRenderer: "mcq" | "sata" | "bowtie" | "unsupported_fallback";
  positiveE2e: "yes" | "no" | "n/a";
  positiveE2eNote?: string;
  exclusionReason?: string;
};

/**
 * Authoritative matrix: DB may contain many legacy strings; runtime routing is by
 * {@link practiceRunnerNeedsUnsupportedFallback} + Bowtie normalization.
 */
export const CAT_QUESTION_TYPE_RUNTIME_MATRIX: readonly CatRunnerMatrixRow[] = [
  {
    id: "mcq",
    questionTypeExamples: ["MCQ", "MULTIPLE_CHOICE", "multiple_choice"],
    runtimeRenderer: "mcq",
    positiveE2e: "yes",
  },
  {
    id: "sata",
    questionTypeExamples: ["SATA", "SELECT_ALL_THAT_APPLY"],
    runtimeRenderer: "sata",
    positiveE2e: "yes",
  },
  {
    id: "bowtie_trend",
    questionTypeExamples: ["Bowtie", "NGN_BOWTIE", "Trend", "TREND"],
    runtimeRenderer: "bowtie",
    positiveE2e: "yes",
  },
  {
    id: "matrix_grid",
    questionTypeExamples: ["MATRIX", "MATRIX_GRID", "MATRIX_MULTI_SELECT"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "Structured matrix / grid options require a dedicated runner; client shows safe fallback (role=alert) until a matrix renderer ships.",
  },
  {
    id: "cloze_dropdown",
    questionTypeExamples: ["CLOZE", "DROPDOWN", "FILL_IN_BLANK"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "Cloze / dropdown JSON shapes are not flattened to MCQ; runner refuses non-scalar option arrays.",
  },
  {
    id: "ordered_priority",
    questionTypeExamples: ["ORDERED", "PRIORITY", "DELEGATION"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "Ordering / priority interactions are not implemented in the CAT shell; type hint or structured options trigger fallback.",
  },
  {
    id: "exhibit_chart",
    questionTypeExamples: ["EXHIBIT", "CHART", "LAB_TABLE"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "`SPECIALIZED_TYPE_HINTS` treats EXHIBIT/CHART/LAB tokens as specialized even when `options` are MCQ-shaped, so the runner shows the safe fallback until labels are normalized to MCQ/SATA or a dedicated exhibit shell exists.",
  },
  {
    id: "case_unfolding",
    questionTypeExamples: ["NGN_CASE", "CASE_STUDY", "UNFOLDING"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "Case / unfolding multi-part shells are not wired into the licensing CAT runner; specialized type tokens or non-list options use fallback.",
  },
  {
    id: "hotspot_image",
    questionTypeExamples: ["HOTSPOT", "HOT_SPOT", "IMAGE_ITEM"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "no",
    exclusionReason:
      "Image map / hotspot answering is not implemented in CAT exam mode; MCQ-only stem images may still appear as presentational chrome for MCQ items.",
  },
  {
    id: "ecg_video",
    questionTypeExamples: ["ecg_video"],
    runtimeRenderer: "unsupported_fallback",
    positiveE2e: "n/a",
    exclusionReason:
      "`NON_ECG_PRACTICE_EXAM_WHERE` removes ECG video rows from the RN/PN practice + CAT pool; NP/live-strip surfaces are out of scope for this matrix.",
  },
] as const;

export type CatRunnerSupportFields = {
  questionType?: string | null;
  stem?: string | null;
  options: unknown;
};

function parseCanonicalOptionsLen(raw: unknown): number {
  if (!Array.isArray(raw)) return 0;
  return raw.map((x) => String(x)).length;
}

/**
 * Classifies whether the current runner can render this row without the unsupported fallback.
 */
export function catRunnerRowUsesUnsupportedFallback(row: CatRunnerSupportFields): boolean {
  const bowtie = tryNormalizeBowtiePayload(row.questionType, row.stem ?? "", row.options);
  const isBowtie = bowtie != null;
  const len = parseCanonicalOptionsLen(row.options);
  return practiceRunnerNeedsUnsupportedFallback(String(row.questionType ?? ""), row.options, len, isBowtie);
}

/**
 * Dev/CI: a DB row that passes {@link isCompleteCatQuestionRow} must not require the unsupported
 * fallback, or learners would only see the alert during CAT — indicates missing renderer work.
 */
export function assertCatCompleteRowRenderableOrThrow(
  row: CatRunnerSupportFields & { id: string },
  opts?: { questionTypeLabel?: string },
): void {
  if (catRunnerRowUsesUnsupportedFallback(row)) {
    const qt = opts?.questionTypeLabel ?? String(row.questionType ?? "");
    throw new Error(
      `[CAT pool] Complete row is not renderable in the practice/CAT runner (needs renderer or import fix). question_type=${qt} id_prefix=${row.id.slice(0, 12)}`,
    );
  }
}
