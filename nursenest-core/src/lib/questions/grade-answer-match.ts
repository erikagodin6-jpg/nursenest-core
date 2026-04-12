import type { Prisma } from "@prisma/client";

export function normalizeCorrect(correctAnswer: Prisma.JsonValue | null | undefined): string[] {
  if (correctAnswer == null) return [];
  if (Array.isArray(correctAnswer)) return correctAnswer.map((x) => String(x));
  if (typeof correctAnswer === "string") return [correctAnswer];
  return [String(correctAnswer)];
}

export function gradeMatches(questionType: string, correct: string[], userAnswer: unknown): boolean {
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") {
    const u = Array.isArray(userAnswer) ? userAnswer.map((x) => String(x)).sort() : [];
    const c = [...correct].map(String).sort();
    if (u.length !== c.length) return false;
    return u.every((v, i) => v === c[i]);
  }
  const u = userAnswer == null ? "" : String(userAnswer);
  return correct.length > 0 && u === String(correct[0]);
}
