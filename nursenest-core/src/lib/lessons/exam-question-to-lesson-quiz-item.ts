import type { Prisma } from "@prisma/client";
import { normalizeCorrect } from "@/lib/questions/grade-answer-match";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

export type LessonBankQuizItem = PathwayLessonQuizItem & { examQuestionId: string };

function parseOptionsArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "text" in x && typeof (x as { text?: unknown }).text === "string") {
      return (x as { text: string }).text;
    }
    return String(x);
  });
}

function isSataType(questionType: string): boolean {
  const t = questionType.toUpperCase();
  return t.includes("SATA") || t.includes("SELECT_ALL") || t.includes("SELECT ALL");
}

/**
 * Resolve zero-based correct option index for a single-best style MCQ.
 * Returns null if not safely convertible (SATA, missing key, etc.).
 */
export function resolveMcqCorrectIndex(
  options: unknown,
  correctAnswer: Prisma.JsonValue | null | undefined,
  questionType: string,
): number | null {
  if (isSataType(questionType)) return null;
  const opts = parseOptionsArray(options);
  if (opts.length < 2 || opts.length > 8) return null;
  const keys = normalizeCorrect(correctAnswer);
  if (keys.length !== 1) return null;
  const k = keys[0].trim();
  if (!k) return null;
  const ku = k.toUpperCase();
  if (/^[A-H]$/.test(ku)) {
    const idx = ku.charCodeAt(0) - 65;
    if (idx >= 0 && idx < opts.length) return idx;
  }
  if (/^\d+$/.test(k)) {
    const idx = parseInt(k, 10);
    if (idx >= 0 && idx < opts.length) return idx;
  }
  const stripped = (s: string) => s.replace(/^[A-Z]\.\s*/i, "").trim();
  const idxText = opts.findIndex((o) => stripped(o) === k || o.trim() === k);
  if (idxText >= 0) return idxText;
  return null;
}

export function examRowToLessonBankItem(row: {
  id: string;
  stem: string;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  questionType: string;
  rationale: string | null;
}): LessonBankQuizItem | null {
  const options = parseOptionsArray(row.options);
  const correct = resolveMcqCorrectIndex(row.options, row.correctAnswer, row.questionType);
  if (correct == null) return null;
  return {
    examQuestionId: row.id,
    question: row.stem.trim(),
    options,
    correct,
    rationale: row.rationale?.trim() || undefined,
  };
}
