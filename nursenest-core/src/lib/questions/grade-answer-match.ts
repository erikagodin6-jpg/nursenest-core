import type { Prisma } from "@prisma/client";
import {
  BOWTIE_SLOT_KEYS,
  bowtieCorrectIdsList,
  isBowtieQuestionType,
  parseBowtieCorrectMapping,
  parseBowtieUserMapping,
} from "@/lib/questions/bowtie-adapter";

export function normalizeCorrect(correctAnswer: Prisma.JsonValue | null | undefined): string[] {
  if (correctAnswer == null) return [];
  if (typeof correctAnswer === "object" && !Array.isArray(correctAnswer)) {
    /* Bowtie / structured keys are not flattened to strings — use {@link correctAnswerIsConfigured} / {@link gradeMatches}. */
    const o = correctAnswer as Record<string, unknown>;
    if (o.correctMapping && typeof o.correctMapping === "object") return [];
  }
  if (Array.isArray(correctAnswer)) return correctAnswer.map((x) => String(x));
  if (typeof correctAnswer === "string") return [correctAnswer];
  return [String(correctAnswer)];
}

/** True when the bank row has a usable MCQ/SATA/bowtie answer key. */
export function correctAnswerIsConfigured(
  questionType: string,
  correctAnswer: Prisma.JsonValue | null | undefined,
): boolean {
  if (isBowtieQuestionType(questionType)) {
    return parseBowtieCorrectMapping(correctAnswer) != null;
  }
  return normalizeCorrect(correctAnswer).length > 0;
}

/** Canonical keys for API feedback / highlighting — bowtie returns three option ids. */
export function canonicalCorrectKeysForGrade(
  questionType: string,
  correctAnswer: Prisma.JsonValue | null | undefined,
): string[] {
  if (isBowtieQuestionType(questionType)) {
    return bowtieCorrectIdsList(correctAnswer);
  }
  return normalizeCorrect(correctAnswer);
}

export function gradeMatches(
  questionType: string,
  correctAnswer: Prisma.JsonValue | null | undefined,
  userAnswer: unknown,
): boolean {
  if (isBowtieQuestionType(questionType)) {
    const c = parseBowtieCorrectMapping(correctAnswer);
    const u = parseBowtieUserMapping(userAnswer);
    if (!c || !u) return false;
    return BOWTIE_SLOT_KEYS.every((k) => c[k] === u[k]);
  }

  const expected = normalizeCorrect(correctAnswer);
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") {
    const ua = Array.isArray(userAnswer) ? userAnswer.map((x) => String(x)).sort() : [];
    const ec = [...expected].map(String).sort();
    if (ua.length !== ec.length) return false;
    return ua.every((v, i) => v === ec[i]);
  }
  const u = userAnswer == null ? "" : String(userAnswer);
  return expected.length > 0 && u === String(expected[0]);
}
