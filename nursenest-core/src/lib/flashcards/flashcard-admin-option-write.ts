/**
 * Pure helper: converts admin API flashcard payload → canonical CanonicalOption[].
 *
 * No DB access. Used by:
 *   - POST /api/admin/flashcards   (create)
 *   - PATCH /api/admin/flashcards/[id] (update)
 *
 * MCQ rules  (examItemKind ≠ SATA):
 *   - exactly 1 correct answer (correctAnswer single letter OR correctLetters absent/length=1)
 *   - 3–4 total options
 *   - every wrong option has rationale ≥ 4 chars
 *
 * SATA rules (examItemKind = SATA):
 *   - ≥ 2 correct answers: either correctLetters (array) or comma-separated correctAnswer
 *   - 3–6 total options
 *   - every wrong option has rationale ≥ 4 chars
 *   - rejected with code "sata_single_correct" when only 1 correct answer is resolvable
 *
 * Legacy JSON fields (answerOptions / correctAnswer / rationaleIncorrect) are always
 * preserved on the Flashcard row for rollback/backward compatibility. This helper only
 * produces the canonical CanonicalOption[] — callers write both.
 */

import type { FlashcardItemKind } from "@prisma/client";
import type { CanonicalOption } from "@/lib/flashcards/flashcard-option-normalize";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminOptionInput = {
  examItemKind: FlashcardItemKind;
  answerOptions: Array<{ letter: string; text: string }>;
  /** MCQ: single letter e.g. "B". SATA-legacy: comma-separated e.g. "A,C,D". */
  correctAnswer?: string | null;
  /** SATA preferred form: explicit array e.g. ["A","C","D"]. Takes priority over correctAnswer. */
  correctLetters?: string[] | null;
  rationaleIncorrect: Array<{ letter: string; rationale: string }>;
  /** Card-level correct rationale (stored on each correct option row). */
  rationaleCorrect: string;
};

export type AdminOptionWriteResult =
  | { ok: true; options: CanonicalOption[]; isSata: boolean }
  | { ok: false; error: string; code: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_LETTER = /^[A-F]$/;
const MCQ_MAX_OPTIONS = 4;
const MCQ_MIN_OPTIONS = 3;
const SATA_MAX_OPTIONS = 6;
const MIN_RATIONALE = 4;

// ── Helpers ───────────────────────────────────────────────────────────────────

function normLetter(raw: string): string | null {
  const s = raw.trim().toUpperCase();
  return VALID_LETTER.test(s) ? s : null;
}

/**
 * Resolve the set of correct letters from whichever source is present.
 * Priority: explicit correctLetters array > comma-separated correctAnswer > single correctAnswer letter.
 */
function resolveCorrectLetters(
  correctAnswer: string | null | undefined,
  correctLetters: string[] | null | undefined,
): Set<string> {
  // Explicit array wins
  if (correctLetters && correctLetters.length > 0) {
    const letters = correctLetters
      .map((l) => normLetter(l))
      .filter((l): l is string => l !== null);
    return new Set(letters);
  }

  if (!correctAnswer) return new Set();

  const trimmed = correctAnswer.trim();

  // Comma-separated: "A,C,D"
  if (trimmed.includes(",")) {
    const letters = trimmed
      .split(",")
      .map((l) => normLetter(l.trim()))
      .filter((l): l is string => l !== null);
    return new Set(letters);
  }

  // Single letter: "B"
  const single = normLetter(trimmed);
  return single ? new Set([single]) : new Set();
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Build and validate canonical CanonicalOption[] from an admin flashcard payload.
 *
 * Returns { ok: true, options, isSata } on success.
 * Returns { ok: false, error, code } on validation failure — callers should return HTTP 400.
 */
export function buildCanonicalOptionsFromAdminPayload(
  input: AdminOptionInput,
): AdminOptionWriteResult {
  const { examItemKind, answerOptions, correctAnswer, correctLetters, rationaleIncorrect, rationaleCorrect } = input;

  const isSata = examItemKind === "SATA";

  // ── Option count bounds ──────────────────────────────────────────────────
  const minOpts = MCQ_MIN_OPTIONS;
  const maxOpts = isSata ? SATA_MAX_OPTIONS : MCQ_MAX_OPTIONS;

  if (answerOptions.length < minOpts) {
    return {
      ok: false,
      code: "options_too_few",
      error: `Flashcard must have at least ${minOpts} answer options, got ${answerOptions.length}.`,
    };
  }
  if (answerOptions.length > maxOpts) {
    return {
      ok: false,
      code: "options_too_many",
      error: `${isSata ? "SATA" : "MCQ"} flashcard must have at most ${maxOpts} options, got ${answerOptions.length}.`,
    };
  }

  // ── Letter normalisation + duplicate check ────────────────────────────────
  const seenKeys = new Set<string>();
  const normalisedOptions: Array<{ letter: string; text: string }> = [];
  for (const opt of answerOptions) {
    const letter = normLetter(opt.letter);
    if (!letter) {
      return {
        ok: false,
        code: "option_key_invalid",
        error: `Option key "${opt.letter}" is not a valid letter (A–F).`,
      };
    }
    if (seenKeys.has(letter)) {
      return {
        ok: false,
        code: "options_duplicate_keys",
        error: `Duplicate option key "${letter}".`,
      };
    }
    if (opt.text.trim().length < 2) {
      return {
        ok: false,
        code: "option_content_too_short",
        error: `Option ${letter} content is too short (minimum 2 characters).`,
      };
    }
    seenKeys.add(letter);
    normalisedOptions.push({ letter, text: opt.text.trim() });
  }

  // ── Correct-letter resolution ─────────────────────────────────────────────
  const correctSet = resolveCorrectLetters(correctAnswer, correctLetters);

  if (correctSet.size === 0) {
    return {
      ok: false,
      code: "options_no_correct",
      error: "At least one correct answer must be specified (correctAnswer or correctLetters).",
    };
  }

  // Validate that all correct letters are among the option keys
  for (const cl of correctSet) {
    if (!seenKeys.has(cl)) {
      return {
        ok: false,
        code: "correct_letter_not_in_options",
        error: `Correct letter "${cl}" does not match any option key.`,
      };
    }
  }

  // ── MCQ/SATA cross-validation ─────────────────────────────────────────────
  if (isSata && correctSet.size < 2) {
    return {
      ok: false,
      code: "sata_single_correct",
      error:
        "SATA cards require at least 2 correct answers. " +
        "If this card has only one correct answer, set examItemKind to a non-SATA kind (e.g. CLINICAL).",
    };
  }

  if (!isSata && correctSet.size > 1) {
    return {
      ok: false,
      code: "mcq_multiple_correct",
      error:
        `MCQ cards (examItemKind = ${examItemKind}) must have exactly 1 correct answer, ` +
        `but ${correctSet.size} were provided. Use examItemKind = SATA for multiple-correct cards.`,
    };
  }

  // ── Rationale map ─────────────────────────────────────────────────────────
  const rationaleMap = new Map<string, string>();
  for (const r of rationaleIncorrect) {
    const letter = normLetter(r.letter);
    if (letter) rationaleMap.set(letter, r.rationale.trim());
  }

  // All wrong options must have rationale ≥ MIN_RATIONALE chars
  for (const opt of normalisedOptions) {
    if (correctSet.has(opt.letter)) continue;
    const rat = rationaleMap.get(opt.letter) ?? "";
    if (rat.length < MIN_RATIONALE) {
      return {
        ok: false,
        code: "wrong_option_rationale_missing",
        error:
          `Wrong option ${opt.letter} must have a rationale of at least ${MIN_RATIONALE} characters ` +
          `(got ${rat.length}). Provide it in rationaleIncorrect[].`,
      };
    }
  }

  // ── Build canonical rows ──────────────────────────────────────────────────
  const options: CanonicalOption[] = normalisedOptions.map((opt, idx) => ({
    optionKey: opt.letter,
    content: opt.text,
    isCorrect: correctSet.has(opt.letter),
    rationale: correctSet.has(opt.letter)
      ? (rationaleCorrect.trim() || null)
      : (rationaleMap.get(opt.letter) ?? null),
    displayOrder: idx,
  }));

  return { ok: true, options, isSata };
}

// ── SATA back-field builder ───────────────────────────────────────────────────

/**
 * Build a concise `back` field text for a SATA card.
 * Format: "Correct: A, C, D — <rationaleCorrect>"
 * Kept short so the legacy `back` column remains scannable in the admin list.
 */
export function buildSataBackField(
  correctLetters: string[],
  rationaleCorrect: string,
): string {
  const sorted = [...correctLetters].sort().join(", ");
  const rationale = rationaleCorrect.trim();
  return rationale ? `Correct: ${sorted} — ${rationale}` : `Correct: ${sorted}`;
}

// ── Conflict telemetry ────────────────────────────────────────────────────────

export type OptionInputConflict = {
  event: "FLASHCARD_OPTION_INPUT_CONFLICT";
  fields: ["correctLetters", "correctAnswer"];
  resolution: "correctLetters_priority";
  detail: string;
};

/**
 * Detects when both correctLetters and correctAnswer are supplied in the same request.
 * correctLetters always wins; this surfaces a structured warning so callers can log or
 * include it in response metadata without failing the request.
 *
 * Returns null when no conflict exists.
 */
export function detectOptionInputConflict(
  correctLetters: string[] | null | undefined,
  correctAnswer: string | null | undefined,
): OptionInputConflict | null {
  if (!correctLetters?.length || !correctAnswer?.trim()) return null;
  return {
    event: "FLASHCARD_OPTION_INPUT_CONFLICT",
    fields: ["correctLetters", "correctAnswer"],
    resolution: "correctLetters_priority",
    detail:
      `Both correctLetters (${correctLetters.join(",")}) and correctAnswer ("${correctAnswer}") were provided. ` +
      `correctLetters takes priority. Remove correctAnswer to suppress this warning.`,
  };
}
