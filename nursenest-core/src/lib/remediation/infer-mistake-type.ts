import type { RemediationMistakeType } from "@prisma/client";

type TagLike = string | null | undefined;

function norm(s: TagLike): string {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Best-effort mistake taxonomy from bank metadata (no duplicate CAT / grading logic).
 */
export function inferRemediationMistakeType(args: {
  tags: string[];
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
  questionType?: string | null;
}): RemediationMistakeType {
  const hay = [
    ...args.tags.map(norm),
    norm(args.nclexClientNeedsCategory),
    norm(args.nclexClientNeedsSubcategory),
    norm(args.questionType),
  ].join(" ");

  const has = (re: RegExp) => re.test(hay);

  if (has(/\b(priorit|triage|urgency|first\s*action|order\s*of)\b/) || hay.includes("safe and effective")) {
    return "prioritization";
  }
  if (has(/\b(delegat|supervis|assign|nurse\s*to\s*task)\b/)) return "delegation";
  if (has(/\b(pharm|medication|drug|dose|contraindicat|interaction|adverse)\b/)) return "pharmacology";
  if (has(/\b(safety|infection|fall|restraint|error|risk|precaution)\b/)) return "safety";
  if (has(/\b(select\s*all|sata|multiple\s*response|exhibit|image)\b/) || hay.includes("multiple")) {
    return "misread_question";
  }
  return "knowledge_gap";
}
