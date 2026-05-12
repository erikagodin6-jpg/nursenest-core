/**
 * Canonical answer-option normalization and validation.
 *
 * This module provides:
 *   - normalizeLegacyAnswerPayload()  — JSON → CanonicalOption[]
 *   - validateCanonicalOptions()      — MCQ (exactly 1 correct) / SATA (≥ 1 correct)
 *   - buildMcqPayloadFromCanonical()  — canonical → ExamMicroQuestionPayload
 *   - buildSataPayloadFromCanonical() — canonical → SataQuestionPayload
 *
 * Design: purely functional (no DB calls). Used by both server hydration and client validation.
 */

import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import type { Prisma } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Canonical in-memory representation of a single answer option. */
export type CanonicalOption = {
  /** Option key: "A"–"D" for MCQ/SATA; namespaced for future types ("action:A", "row:1:col:A"). */
  optionKey: string;
  content: string;
  isCorrect: boolean;
  /** Teaching rationale. Required for wrong-answer options; optional for correct options. */
  rationale: string | null;
  displayOrder: number;
};

/** Shape returned from `prisma.flashcard.findMany` with canonical options selected. */
export type FlashcardOptionRow = {
  id: string;
  optionKey: string;
  content: string;
  isCorrect: boolean;
  rationale: string | null;
  displayOrder: number;
  selectCount: number;
  correctSelectCount: number;
};

/** Validation result. */
export type OptionValidationResult =
  | { ok: true; cardKind: "MCQ" | "SATA" }
  | { ok: false; code: string; error: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const LETTER_RE = /^[A-D]$/;
const MCQ_OPTION_BOUNDS = { min: 3, max: 4 } as const;
const SATA_CORRECT_BOUNDS = { min: 1, max: 5 } as const;
const MIN_RATIONALE_LENGTH = 16;

// ── Normalization: JSON → canonical ──────────────────────────────────────────

/**
 * Convert legacy JSON answer-option fields into canonical `CanonicalOption[]`.
 * Returns null when the JSON is malformed or insufficient for canonical storage.
 *
 * Handles the two JSON layouts in use:
 *   answerOptions: [{letter, text}] — option content (both MCQ and SATA)
 *   correctAnswer: "B"             — single correct letter (MCQ)
 *   rationaleIncorrect: [{letter, rationale}] — per-distractor text
 *   rationaleCorrect: "Because…"   — card-level (threaded through separately)
 *
 * For SATA (correctLetters is an array), `correctAnswer` must be a
 * JSON-stringified string[] or comma-delimited string.
 */
export function normalizeLegacyAnswerPayload(input: {
  answerOptions: Prisma.JsonValue | null | undefined;
  correctAnswer: string | null | undefined;
  rationaleIncorrect: Prisma.JsonValue | null | undefined;
}): CanonicalOption[] | null {
  const rawOptions = parseOptionsJson(input.answerOptions);
  if (!rawOptions || rawOptions.length < MCQ_OPTION_BOUNDS.min) return null;

  const correctLetters = parseCorrectLetters(input.correctAnswer);
  if (correctLetters.size === 0) return null;

  const rationaleMap = parseRationaleJson(input.rationaleIncorrect);

  return rawOptions.map((opt, idx): CanonicalOption => ({
    optionKey: opt.letter,
    content: opt.text,
    isCorrect: correctLetters.has(opt.letter),
    rationale: rationaleMap.get(opt.letter) ?? null,
    displayOrder: idx,
  }));
}

function parseOptionsJson(
  raw: Prisma.JsonValue | null | undefined,
): Array<{ letter: string; text: string }> | null {
  if (!Array.isArray(raw)) return null;
  const out: Array<{ letter: string; text: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const o = item as Record<string, unknown>;
    const letter =
      typeof o.letter === "string"
        ? o.letter.trim().toUpperCase()
        : typeof o.id === "string"
          ? o.id.trim().toUpperCase()
          : null;
    const text = typeof o.text === "string" ? o.text.trim() : "";
    if (!letter || !LETTER_RE.test(letter) || text.length < 2) return null;
    out.push({ letter, text });
  }
  return out.length >= MCQ_OPTION_BOUNDS.min ? out : null;
}

function parseCorrectLetters(raw: string | null | undefined): Set<string> {
  if (!raw) return new Set();
  const s = raw.trim();

  // JSON array: '["A","C"]'
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s) as unknown;
      if (Array.isArray(parsed)) {
        const letters = (parsed as unknown[])
          .map((l) => (typeof l === "string" ? l.trim().toUpperCase() : ""))
          .filter((l) => LETTER_RE.test(l));
        return new Set(letters);
      }
    } catch {
      // fall through
    }
  }

  // Comma-delimited: "A,C"
  if (s.includes(",")) {
    const letters = s
      .split(",")
      .map((l) => l.trim().toUpperCase())
      .filter((l) => LETTER_RE.test(l));
    return new Set(letters);
  }

  // Single letter: "A"
  const single = s.toUpperCase();
  return LETTER_RE.test(single) ? new Set([single]) : new Set();
}

function parseRationaleJson(
  raw: Prisma.JsonValue | null | undefined,
): Map<string, string> {
  const map = new Map<string, string>();
  if (!Array.isArray(raw)) return map;
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const letter = typeof o.letter === "string" ? o.letter.trim().toUpperCase() : null;
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : null;
    if (letter && LETTER_RE.test(letter) && rationale && rationale.length >= 4) {
      map.set(letter, rationale);
    }
  }
  return map;
}

// ── Canonical ↔ DB row conversions ───────────────────────────────────────────

/** Convert DB rows (from Prisma select) to in-memory canonical options (sorted by displayOrder). */
export function fromDbRows(rows: FlashcardOptionRow[]): CanonicalOption[] {
  return [...rows]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((r) => ({
      optionKey: r.optionKey,
      content: r.content,
      isCorrect: r.isCorrect,
      rationale: r.rationale,
      displayOrder: r.displayOrder,
    }));
}

/** Convert canonical options to Prisma create-many data (for dual-write on new cards). */
export function toCreateManyData(
  flashcardId: string,
  options: CanonicalOption[],
): Array<{
  flashcardId: string;
  optionKey: string;
  content: string;
  isCorrect: boolean;
  rationale: string | null;
  displayOrder: number;
}> {
  return options.map((opt) => ({
    flashcardId,
    optionKey: opt.optionKey,
    content: opt.content,
    isCorrect: opt.isCorrect,
    rationale: opt.rationale,
    displayOrder: opt.displayOrder,
  }));
}

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Validate a set of canonical options for structural correctness.
 *
 * MCQ rules:
 *   - 3–4 total options
 *   - exactly 1 isCorrect = true
 *   - each wrong option has rationale ≥ MIN_RATIONALE_LENGTH chars
 *   - no duplicate optionKeys
 *
 * SATA rules:
 *   - 3–6 total options
 *   - 1–5 correct options (not all correct, not zero correct)
 *   - each wrong option has rationale ≥ MIN_RATIONALE_LENGTH chars
 *   - no duplicate optionKeys
 *   - option keys must be valid (A–D format for standard SATA)
 */
export function validateCanonicalOptions(options: CanonicalOption[]): OptionValidationResult {
  if (options.length < MCQ_OPTION_BOUNDS.min) {
    return {
      ok: false,
      code: "options_too_few",
      error: `Flashcard must have at least ${MCQ_OPTION_BOUNDS.min} answer options, got ${options.length}.`,
    };
  }
  if (options.length > 6) {
    return {
      ok: false,
      code: "options_too_many",
      error: `Flashcard must have at most 6 answer options, got ${options.length}.`,
    };
  }

  // Duplicate key check
  const keys = options.map((o) => o.optionKey);
  const unique = new Set(keys);
  if (unique.size !== keys.length) {
    return {
      ok: false,
      code: "options_duplicate_keys",
      error: `Duplicate option keys detected: ${keys.join(", ")}.`,
    };
  }

  // Content length check
  for (const opt of options) {
    if (opt.content.trim().length < 2) {
      return {
        ok: false,
        code: "option_content_too_short",
        error: `Option ${opt.optionKey} content is too short (minimum 2 characters).`,
      };
    }
  }

  const correctCount = options.filter((o) => o.isCorrect).length;

  if (correctCount === 0) {
    return {
      ok: false,
      code: "options_no_correct",
      error: "At least one option must be marked as correct.",
    };
  }

  if (correctCount > SATA_CORRECT_BOUNDS.max) {
    return {
      ok: false,
      code: "options_too_many_correct",
      error: `Too many correct options (${correctCount}); maximum is ${SATA_CORRECT_BOUNDS.max}.`,
    };
  }

  // Wrong-option rationale check
  const wrongOptions = options.filter((o) => !o.isCorrect);
  for (const wrong of wrongOptions) {
    const rat = wrong.rationale?.trim() ?? "";
    if (rat.length < MIN_RATIONALE_LENGTH) {
      return {
        ok: false,
        code: "option_wrong_rationale_too_short",
        error: `Wrong option ${wrong.optionKey} rationale is too short (minimum ${MIN_RATIONALE_LENGTH} chars, got ${rat.length}).`,
      };
    }
  }

  const cardKind: "MCQ" | "SATA" = correctCount === 1 ? "MCQ" : "SATA";

  // MCQ-specific: must be within 3–4 options
  if (cardKind === "MCQ" && options.length > MCQ_OPTION_BOUNDS.max) {
    return {
      ok: false,
      code: "mcq_options_too_many",
      error: `MCQ cards (exactly 1 correct) must have 3–4 options, got ${options.length}.`,
    };
  }

  return { ok: true, cardKind };
}

// ── Payload builders ──────────────────────────────────────────────────────────

/**
 * Build an `ExamMicroQuestionPayload` from canonical options (MCQ path).
 * Returns null when options don't satisfy MCQ rules.
 *
 * @param questionStem - stem from Flashcard.questionStem
 * @param rationaleCorrect - from Flashcard.rationaleCorrect
 * @param options - canonical options (must have exactly 1 correct)
 * @param itemKind - from Flashcard.examItemKind
 */
export function buildMcqPayloadFromCanonical(
  questionStem: string,
  rationaleCorrect: string,
  options: CanonicalOption[],
  itemKind: import("@prisma/client").FlashcardItemKind,
): ExamMicroQuestionPayload | null {
  const correctOptions = options.filter((o) => o.isCorrect);
  if (correctOptions.length !== 1) return null;
  if (questionStem.trim().length < 8) return null;
  if (rationaleCorrect.trim().length < 8) return null;

  const sorted = [...options].sort((a, b) => a.displayOrder - b.displayOrder);
  const answerOptions = sorted.map((o) => ({ letter: o.optionKey, text: o.content }));
  const correctLetter = correctOptions[0]!.optionKey;
  const wrongOptions = sorted.filter((o) => !o.isCorrect);
  const rationaleIncorrect = wrongOptions
    .map((o) => ({ letter: o.optionKey, rationale: o.rationale ?? "" }))
    .filter((r) => r.rationale.trim().length >= 4);

  if (wrongOptions.length !== rationaleIncorrect.length) return null;

  return {
    itemKind,
    questionStem: questionStem.trim(),
    answerOptions,
    correctLetter,
    rationaleCorrect: rationaleCorrect.trim(),
    rationaleIncorrect,
  };
}

/**
 * Build a `SataQuestionPayload` from canonical options (SATA path).
 * Returns null when options don't satisfy SATA rules (< 1 correct or not multi-correct).
 *
 * @param questionStem - stem from Flashcard.questionStem
 * @param rationaleCorrect - summary rationale from Flashcard.rationaleCorrect
 * @param options - canonical options (≥ 1 correct, must be SATA shape)
 */
export function buildSataPayloadFromCanonical(
  questionStem: string,
  rationaleCorrect: string,
  options: CanonicalOption[],
): SataQuestionPayload | null {
  const correctOptions = options.filter((o) => o.isCorrect);
  if (correctOptions.length < 1) return null;
  if (questionStem.trim().length < 8) return null;

  const sorted = [...options].sort((a, b) => a.displayOrder - b.displayOrder);
  const answerOptions = sorted.map((o) => ({ letter: o.optionKey, text: o.content }));
  const correctLetters = sorted.filter((o) => o.isCorrect).map((o) => o.optionKey);
  const rationaleByLetter = sorted.map((o) => ({
    letter: o.optionKey,
    rationale: o.rationale ?? (o.isCorrect ? rationaleCorrect.trim() : ""),
    correct: o.isCorrect,
  }));

  return {
    itemKind: "SATA",
    questionStem: questionStem.trim(),
    answerOptions,
    correctLetters,
    rationaleCorrect: rationaleCorrect.trim(),
    rationaleByLetter,
  };
}

/**
 * Auto-detect card kind from canonical options and build the appropriate payload.
 * Returns an MCQ payload for single-correct, SATA for multi-correct.
 */
export function buildPayloadFromCanonical(
  questionStem: string,
  rationaleCorrect: string,
  options: CanonicalOption[],
  itemKind: import("@prisma/client").FlashcardItemKind,
): ExamMicroQuestionPayload | SataQuestionPayload | null {
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (correctCount === 0) return null;
  if (correctCount === 1) {
    return buildMcqPayloadFromCanonical(questionStem, rationaleCorrect, options, itemKind);
  }
  return buildSataPayloadFromCanonical(questionStem, rationaleCorrect, options);
}
