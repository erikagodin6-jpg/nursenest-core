import type { FlashcardItemKind, Prisma } from "@prisma/client";

/** Client + API shape for NCLEX-style micro-questions on flashcards. */
export type ExamMicroQuestionPayload = {
  itemKind: FlashcardItemKind;
  questionStem: string;
  answerOptions: Array<{ letter: string; text: string }>;
  correctLetter: string;
  rationaleCorrect: string;
  rationaleIncorrect: Array<{ letter: string; rationale: string }>;
};

const LETTER_RE = /^[A-D]$/;

/**
 * Definition / acronym trivia (not mini NCLEX-style judgment items).
 * Used on write validation and when parsing DB rows so trivial items do not use the exam stack.
 */
export function isTrivialDefinitionOnlyStem(stem: string): boolean {
  const t = stem.trim();
  if (t.length < 6) return true;
  const trivialPatterns: RegExp[] = [
    /\bwhat\s+does\s+[A-Z0-9]{1,12}\s+stand\s+for\b/i,
    /\bwhat\s+is\s+the\s+(meaning|definition|abbreviation)\s+of\s+[A-Z0-9]{1,12}\b/i,
    /\bdefine\s+(the\s+)?[A-Z]{2,12}\b/i,
    /\bwhat\s+is\s+[A-Z]{2,12}\s*\??\s*$/i,
    /\bspell\s+out\s+[A-Z]{2,12}\b/i,
    /\bfull\s+form\s+of\s+[A-Z]{2,12}\b/i,
  ];
  return trivialPatterns.some((p) => p.test(t));
}

function normLetter(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const s = String(raw).trim().toUpperCase();
  return LETTER_RE.test(s) ? s : null;
}

function parseOptionsJson(raw: Prisma.JsonValue | null | undefined): Array<{ letter: string; text: string }> | null {
  if (raw == null || !Array.isArray(raw)) return null;
  const out: Array<{ letter: string; text: string }> = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const o = row as Record<string, unknown>;
    const letter = normLetter(typeof o.letter === "string" ? o.letter : typeof o.id === "string" ? o.id : null);
    const text = typeof o.text === "string" ? o.text.trim() : "";
    if (!letter || text.length < 2) return null;
    out.push({ letter, text });
  }
  if (out.length < 3 || out.length > 4) return null;
  const letters = new Set(out.map((x) => x.letter));
  if (letters.size !== out.length) return null;
  return out;
}

function parseIncorrectJson(
  raw: Prisma.JsonValue | null | undefined,
): Array<{ letter: string; rationale: string }> | null {
  if (raw == null || !Array.isArray(raw)) return null;
  const out: Array<{ letter: string; rationale: string }> = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const o = row as Record<string, unknown>;
    const letter = normLetter(typeof o.letter === "string" ? o.letter : null);
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : "";
    if (!letter || rationale.length < 4) return null;
    out.push({ letter, rationale });
  }
  return out;
}

/**
 * Returns a complete exam micro-question payload when DB fields satisfy NCLEX-style rules;
 * otherwise null (legacy front/back card).
 */
export function parseExamMicroQuestionFromDbFields(card: {
  examItemKind: FlashcardItemKind | null;
  questionStem: string | null;
  answerOptions: Prisma.JsonValue | null;
  correctAnswer: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: Prisma.JsonValue | null;
}): ExamMicroQuestionPayload | null {
  if (!card.examItemKind) return null;
  const stem = card.questionStem?.trim() ?? "";
  if (stem.length < 8) return null;
  const options = parseOptionsJson(card.answerOptions);
  if (!options) return null;
  const correctLetter = normLetter(card.correctAnswer);
  if (!correctLetter || !options.some((o) => o.letter === correctLetter)) return null;
  const rationaleCorrect = card.rationaleCorrect?.trim() ?? "";
  if (rationaleCorrect.length < 8) return null;
  const incorrect = parseIncorrectJson(card.rationaleIncorrect);
  if (!incorrect) return null;
  const optionLetters = new Set(options.map((o) => o.letter));
  const wrongLetters = [...optionLetters].filter((l) => l !== correctLetter).sort();
  if (wrongLetters.length !== options.length - 1) return null;
  const incMap = new Map(incorrect.map((r) => [r.letter, r.rationale]));
  if (incMap.size !== incorrect.length) return null;
  for (const w of wrongLetters) {
    const r = incMap.get(w);
    if (!r || r.trim().length < 4) return null;
  }
  return {
    itemKind: card.examItemKind,
    questionStem: stem,
    answerOptions: options,
    correctLetter,
    rationaleCorrect,
    rationaleIncorrect: wrongLetters.map((letter) => ({
      letter,
      rationale: incMap.get(letter)!,
    })),
  };
}

export function correctAnswerLine(exam: ExamMicroQuestionPayload): string {
  const hit = exam.answerOptions.find((o) => o.letter === exam.correctLetter);
  const label = hit ? `${exam.correctLetter}) ${hit.text}` : exam.correctLetter;
  return `Correct: ${label}`;
}

/** Zod/admin: validate raw JSON + strings before persist. */
export function validateExamMicroQuestionInput(input: {
  examItemKind: FlashcardItemKind;
  questionStem: string;
  answerOptions: unknown;
  correctAnswer: string;
  rationaleCorrect: string;
  rationaleIncorrect: unknown;
}): { ok: true; payload: ExamMicroQuestionPayload } | { ok: false; error: string } {
  const parsed = parseExamMicroQuestionFromDbFields({
    examItemKind: input.examItemKind,
    questionStem: input.questionStem,
    answerOptions: input.answerOptions as Prisma.JsonValue,
    correctAnswer: input.correctAnswer,
    rationaleCorrect: input.rationaleCorrect,
    rationaleIncorrect: input.rationaleIncorrect as Prisma.JsonValue,
  });
  if (!parsed) {
    return {
      ok: false,
      error:
        "Exam-style cards require: questionStem (≥8 chars), 3–4 answerOptions {letter,text}, correctAnswer A–D matching an option, rationaleCorrect (≥8 chars), and rationaleIncorrect entries for every distractor letter with rationale (≥4 chars each).",
    };
  }
  if (isTrivialDefinitionOnlyStem(input.questionStem)) {
    return {
      ok: false,
      error:
        "Exam-style stems must be clinical judgment items (priority, assessment, intervention), not acronym or definition trivia (e.g. “What does X stand for?”).",
    };
  }
  return { ok: true, payload: parsed };
}
