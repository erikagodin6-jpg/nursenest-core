import { stripToPlainText } from "@/lib/content-quality/plain-text";
import { isGenericRationaleText } from "@/lib/questions/rationale-quality";

export type FlashcardQualityInput = {
  id: string;
  prompt?: string | null;
  correctRationale?: string | null;
  distractorRationales?: Array<{ letter: string; rationale?: string | null }> | null;
  correctRate?: number | null;
  averageResponseMs?: number | null;
  againRate?: number | null;
  hardRate?: number | null;
  abandonmentRate?: number | null;
  confidenceWrongRate?: number | null;
};

export type FlashcardQualityFlag =
  | "thin_correct_rationale"
  | "generic_correct_rationale"
  | "missing_distractor_rationales"
  | "thin_distractor_rationale"
  | "possible_broken_key"
  | "possible_ambiguous_wording"
  | "high_abandonment"
  | "confidence_accuracy_mismatch";

export type FlashcardQualityReview = {
  id: string;
  score: number;
  severity: "healthy" | "needs_review" | "critical";
  flags: FlashcardQualityFlag[];
};

function wordCount(value: string | null | undefined): number {
  const clean = stripToPlainText(value);
  return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
}

export function evaluateFlashcardQuality(input: FlashcardQualityInput): FlashcardQualityReview {
  const flags: FlashcardQualityFlag[] = [];
  const correctWords = wordCount(input.correctRationale);
  if (correctWords < 18) flags.push("thin_correct_rationale");
  if (isGenericRationaleText(input.correctRationale)) flags.push("generic_correct_rationale");

  const distractors = input.distractorRationales ?? [];
  if (distractors.length === 0) {
    flags.push("missing_distractor_rationales");
  } else if (distractors.some((row) => wordCount(row.rationale) < 10 || isGenericRationaleText(row.rationale))) {
    flags.push("thin_distractor_rationale");
  }

  if (typeof input.correctRate === "number" && input.correctRate < 0.18) flags.push("possible_broken_key");
  if (typeof input.correctRate === "number" && input.correctRate > 0.92 && (input.againRate ?? 0) > 0.25) {
    flags.push("possible_ambiguous_wording");
  }
  if ((input.abandonmentRate ?? 0) >= 0.25) flags.push("high_abandonment");
  if ((input.confidenceWrongRate ?? 0) >= 0.2) flags.push("confidence_accuracy_mismatch");

  const penalty = flags.reduce((sum, flag) => {
    if (flag === "possible_broken_key" || flag === "generic_correct_rationale") return sum + 30;
    if (flag === "missing_distractor_rationales" || flag === "confidence_accuracy_mismatch") return sum + 20;
    return sum + 12;
  }, 0);
  const score = Math.max(0, 100 - penalty);
  const severity = flags.includes("possible_broken_key") || flags.includes("generic_correct_rationale")
    ? "critical"
    : score < 75
      ? "needs_review"
      : "healthy";
  return { id: input.id, score, severity, flags: [...new Set(flags)] };
}

export function buildFlashcardQualityReviewQueue(inputs: FlashcardQualityInput[]): FlashcardQualityReview[] {
  return inputs
    .map(evaluateFlashcardQuality)
    .filter((review) => review.severity !== "healthy")
    .sort((a, b) => a.score - b.score || b.flags.length - a.flags.length);
}

