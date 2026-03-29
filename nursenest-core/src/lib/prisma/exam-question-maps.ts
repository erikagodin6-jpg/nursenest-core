import type { ContentStatus, ExamFamily, TierCode } from "@prisma/client";
import { contentStatusToDb } from "@/lib/prisma/content-status";

export function tierCodeToExamDbTier(tier: TierCode): string {
  switch (tier) {
    case "RPN":
      return "rpn";
    case "LVN_LPN":
      return "lvn";
    case "RN":
      return "rn";
    case "NP":
      return "np";
    case "ALLIED":
      return "allied";
    default:
      return "rpn";
  }
}

/** `content_items.tier` uses the same lowercase convention as exam tiers. */
export function tierCodeToContentItemTier(tier: TierCode): string {
  return tierCodeToExamDbTier(tier);
}

export function examFamilyToExamColumn(family: ExamFamily | string | undefined): string {
  if (!family || family === "GENERIC") return "NCLEX_RN";
  return String(family);
}

/** Map admin UI question types to `exam_questions.question_type` strings. */
export function adminQuestionTypeToDb(q: string): string {
  const t = q.toUpperCase();
  if (t === "MCQ") return "multiple_choice";
  if (t === "SATA") return "sata";
  if (t === "NGN_CASE") return "ngn_case";
  if (t === "ORDERING") return "ordered";
  if (t === "FIB_NUMERIC") return "fill-in-blank";
  return q.toLowerCase();
}

export function difficultyBandToInt(
  d: "FOUNDATION" | "INTERMEDIATE" | "ADVANCED" | undefined | null,
): number | undefined {
  if (d === undefined || d === null) return undefined;
  if (d === "FOUNDATION") return 1;
  if (d === "INTERMEDIATE") return 3;
  if (d === "ADVANCED") return 5;
  return undefined;
}

export function contentStatusForExam(status: ContentStatus): string {
  return contentStatusToDb(status);
}
