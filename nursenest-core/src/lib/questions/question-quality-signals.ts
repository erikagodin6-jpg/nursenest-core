import { stripToPlainText } from "@/lib/content-quality/plain-text";

export type QuestionQualitySignals = {
  /** Machine-detectable editorial flags (no LLM). */
  flags: string[];
  hasHighYieldTakeaway: boolean;
  rationaleCompleteness: "full" | "partial" | "thin";
};

type Row = {
  stem?: string | null;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  distractorRationales?: unknown;
};

function wordCount(s: string | null | undefined): number {
  const t = stripToPlainText(s);
  if (t.length < 2) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

/**
 * Heuristic quality signals for editorial queues — does not judge clinical truth.
 */
export function analyzeQuestionQualitySignals(row: Row): QuestionQualitySignals {
  const flags: string[] = [];

  const stemW = wordCount(row.stem);
  if (stemW > 0 && stemW < 12) flags.push("stem_short");
  if (stemW > 220) flags.push("stem_long");

  const expl = stripToPlainText(row.correctAnswerExplanation);
  const rat = stripToPlainText(row.rationale);
  if (expl.length > 20 && rat.length > 20 && expl.slice(0, 80) === rat.slice(0, 80)) {
    flags.push("possible_duplicate_explanation_rationale");
  }

  const hasCorrect = wordCount(row.correctAnswerExplanation) >= 8;
  const hasRat = wordCount(row.rationale) >= 8;
  const hasClinical = wordCount(row.clinicalReasoning) >= 8;
  const hasDistractors =
    row.distractorRationales != null &&
    stripToPlainText(
      typeof row.distractorRationales === "string"
        ? row.distractorRationales
        : JSON.stringify(row.distractorRationales),
    ).length > 15;

  const hasTakeaway = wordCount(row.keyTakeaway) >= 4;
  if (!hasTakeaway) flags.push("missing_high_yield_takeaway");

  let rationaleCompleteness: QuestionQualitySignals["rationaleCompleteness"] = "thin";
  const coreCount = [hasCorrect, hasRat, hasClinical].filter(Boolean).length;
  if (coreCount >= 2 && (hasDistractors || hasClinical)) rationaleCompleteness = "full";
  else if (coreCount >= 1) rationaleCompleteness = "partial";

  if (!hasCorrect && !hasRat) flags.push("no_core_rationale");

  return {
    flags: [...new Set(flags)],
    hasHighYieldTakeaway: hasTakeaway,
    rationaleCompleteness,
  };
}
