/**
 * Canonical relational option model for flashcards.
 *
 * Source of truth hierarchy (highest to lowest):
 *   1. FlashcardOption rows in the DB (when any rows exist for a card)
 *   2. Legacy JSON fields: answerOptions + correctAnswer + rationaleIncorrect
 *
 * This module provides:
 *   - Pure validation functions (no DB I/O)
 *   - Legacy JSON → canonical shape normalizers
 *   - Hydration from canonical rows → typed payloads
 *   - DB insert helper (used by admin API, import pipelines, AI generation)
 */

import type { FlashcardItemKind, Prisma } from "@prisma/client";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "./flashcard-exam-style";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal shape of a FlashcardOption row from the DB. */
export type CanonicalOption = {
  optionKey: string;
  content: string;
  isCorrect: boolean;
  rationale: string | null;
  displayOrder: number;
};

export type CanonicalOptionsValidationError =
  | { code: "no_options" }
  | { code: "duplicate_option_keys"; keys: string[] }
  | { code: "mcq_multiple_correct"; correctKeys: string[] }
  | { code: "mcq_no_correct" }
  | { code: "sata_insufficient_correct"; count: number }
  | { code: "sata_too_many_options"; count: number }
  | { code: "option_key_invalid"; key: string }
  | { code: "option_content_empty"; key: string }
  | { code: "option_count_out_of_range"; count: number; min: number; max: number };

const VALID_OPTION_KEY = /^[A-Z]$|^[a-z_]+:[A-Z0-9]+$/;
const STANDARD_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates a set of canonical options against item-kind rules.
 * Pure function — no DB access.
 *
 * MCQ: exactly 1 correct, 3–4 options.
 * SATA: 2–10 correct, up to 10 total options.
 * Other kinds: at least 1 correct, 2–10 options.
 */
export function validateCanonicalOptions(
  kind: FlashcardItemKind,
  options: CanonicalOption[],
): { ok: true } | { ok: false; error: CanonicalOptionsValidationError } {
  if (options.length === 0) {
    return { ok: false, error: { code: "no_options" } };
  }

  const keys = options.map((o) => o.optionKey);
  const uniqueKeys = new Set(keys);
  if (uniqueKeys.size !== keys.length) {
    const seen = new Set<string>();
    const dups = keys.filter((k) => (seen.has(k) ? true : !seen.add(k)));
    return { ok: false, error: { code: "duplicate_option_keys", keys: dups } };
  }

  for (const opt of options) {
    if (!VALID_OPTION_KEY.test(opt.optionKey)) {
      return { ok: false, error: { code: "option_key_invalid", key: opt.optionKey } };
    }
    if (!opt.content.trim()) {
      return { ok: false, error: { code: "option_content_empty", key: opt.optionKey } };
    }
  }

  const correctKeys = options.filter((o) => o.isCorrect).map((o) => o.optionKey);

  if (kind === "SATA") {
    if (options.length > 10) {
      return { ok: false, error: { code: "sata_too_many_options", count: options.length } };
    }
    if (correctKeys.length < 2) {
      return { ok: false, error: { code: "sata_insufficient_correct", count: correctKeys.length } };
    }
    return { ok: true };
  }

  // MCQ kinds: RECALL, CLINICAL, PRIORITY, CONCEPT, MED_SAFETY, ECG_STRIP, LAB_TREND
  if (kind !== "BOWTIE") {
    const min = 3;
    const max = kind === "LAB_TREND" ? 6 : 4;
    if (options.length < min || options.length > max) {
      return { ok: false, error: { code: "option_count_out_of_range", count: options.length, min, max } };
    }
    if (correctKeys.length === 0) {
      return { ok: false, error: { code: "mcq_no_correct" } };
    }
    if (correctKeys.length > 1) {
      return { ok: false, error: { code: "mcq_multiple_correct", correctKeys } };
    }
  }

  return { ok: true };
}

// ─── Legacy normalization ─────────────────────────────────────────────────────

type LegacyCardFields = {
  examItemKind: FlashcardItemKind | null;
  answerOptions: Prisma.JsonValue | null;
  correctAnswer: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: Prisma.JsonValue | null;
};

function parseLetter(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim().toUpperCase();
  return /^[A-F]$/.test(s) ? s : null;
}

function parseJsonArray(raw: Prisma.JsonValue | null): unknown[] | null {
  if (!Array.isArray(raw)) return null;
  return raw;
}

/**
 * Converts legacy JSON fields into canonical CanonicalOption rows.
 * Returns null when the card fields are incomplete or malformed.
 *
 * For MCQ: correctAnswer is a single letter (e.g. "B").
 * For SATA: correctAnswer is comma-separated letters (e.g. "A,C") OR
 *   the first attempt stored in the old single-letter field (treated as 1-correct SATA warning).
 *
 * Used by:
 *   - Migration scripts to backfill FlashcardOption rows
 *   - hydrateFlashcardOptions fallback path (read-only, never persisted)
 */
export function normalizeLegacyAnswerPayload(
  card: LegacyCardFields,
): CanonicalOption[] | null {
  const opts = parseJsonArray(card.answerOptions);
  if (!opts || opts.length < 3) return null;

  const parsed: Array<{ letter: string; text: string }> = [];
  for (const row of opts) {
    if (!row || typeof row !== "object") return null;
    const o = row as Record<string, unknown>;
    const letter = parseLetter(typeof o.letter === "string" ? o.letter : typeof o.id === "string" ? o.id : null);
    const text = typeof o.text === "string" ? o.text.trim() : "";
    if (!letter || text.length < 2) return null;
    parsed.push({ letter, text });
  }

  const correctRaw = (card.correctAnswer ?? "").trim().toUpperCase();
  const correctSet = new Set(
    correctRaw.includes(",")
      ? correctRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : correctRaw ? [correctRaw] : [],
  );

  const incRaw = parseJsonArray(card.rationaleIncorrect) ?? [];
  const incMap = new Map<string, string>();
  for (const row of incRaw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const letter = parseLetter(typeof o.letter === "string" ? o.letter : null);
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : "";
    if (letter && rationale) incMap.set(letter, rationale);
  }

  return parsed.map((opt, idx) => ({
    optionKey: opt.letter,
    content: opt.text,
    isCorrect: correctSet.has(opt.letter),
    rationale: correctSet.has(opt.letter)
      ? (card.rationaleCorrect?.trim() ?? null)
      : (incMap.get(opt.letter) ?? null),
    displayOrder: idx,
  }));
}

// ─── Hydration from canonical rows ───────────────────────────────────────────

/**
 * Builds a typed MCQ payload from canonical option rows.
 * Returns null if the rows don't satisfy MCQ rules (use validateCanonicalOptions first).
 */
export function hydrateCanonicalMcq(
  stem: string,
  kind: FlashcardItemKind,
  options: CanonicalOption[],
  rationaleCorrect: string | null,
): ExamMicroQuestionPayload | null {
  const correct = options.find((o) => o.isCorrect);
  if (!correct) return null;
  if (stem.trim().length < 8) return null;

  const answerOptions = options
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((o) => ({ letter: o.optionKey, text: o.content }));

  const rationaleIncorrect = options
    .filter((o) => !o.isCorrect)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((o) => ({ letter: o.optionKey, rationale: o.rationale ?? "" }));

  return {
    itemKind: kind,
    questionStem: stem.trim(),
    answerOptions,
    correctLetter: correct.optionKey,
    rationaleCorrect: correct.rationale ?? rationaleCorrect?.trim() ?? "",
    rationaleIncorrect,
  };
}

/**
 * Builds a typed SATA payload from canonical option rows.
 * Returns null if fewer than 2 correct options exist.
 */
export function hydrateCanonicalSata(
  stem: string,
  options: CanonicalOption[],
  rationaleCorrect: string | null,
): SataQuestionPayload | null {
  const correctKeys = options.filter((o) => o.isCorrect);
  if (correctKeys.length < 2) return null;
  if (stem.trim().length < 8) return null;

  const sorted = [...options].sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    itemKind: "SATA",
    questionStem: stem.trim(),
    answerOptions: sorted.map((o) => ({ letter: o.optionKey, text: o.content })),
    correctLetters: correctKeys.map((o) => o.optionKey).sort(),
    rationaleCorrect: rationaleCorrect?.trim() ?? "",
    rationaleByLetter: sorted.map((o) => ({
      letter: o.optionKey,
      rationale: o.rationale ?? (o.isCorrect ? (rationaleCorrect?.trim() ?? "") : ""),
      correct: o.isCorrect,
    })),
  };
}

/**
 * Top-level resolver: canonical options → typed payload.
 * Chooses MCQ or SATA based on the count of isCorrect rows.
 * Falls back to null (caller should try legacy JSON path).
 */
export function resolvePayloadFromCanonicalOptions(
  kind: FlashcardItemKind,
  stem: string | null,
  options: CanonicalOption[],
  rationaleCorrect: string | null,
): ExamMicroQuestionPayload | SataQuestionPayload | null {
  if (options.length === 0 || !stem) return null;

  const correctCount = options.filter((o) => o.isCorrect).length;

  if (kind === "SATA" || correctCount >= 2) {
    return hydrateCanonicalSata(stem, options, rationaleCorrect);
  }

  return hydrateCanonicalMcq(stem, kind, options, rationaleCorrect);
}

// ─── Shape builders for insert ────────────────────────────────────────────────

/**
 * Converts a validated MCQ payload into canonical CanonicalOption rows ready for DB insert.
 * The rationaleCorrect string is stored on the correct option row.
 */
export function mcqPayloadToCanonicalOptions(
  payload: ExamMicroQuestionPayload,
): CanonicalOption[] {
  const incMap = new Map(payload.rationaleIncorrect.map((r) => [r.letter, r.rationale]));
  return payload.answerOptions.map((opt, idx) => ({
    optionKey: opt.letter,
    content: opt.text,
    isCorrect: opt.letter === payload.correctLetter,
    rationale: opt.letter === payload.correctLetter
      ? payload.rationaleCorrect
      : (incMap.get(opt.letter) ?? null),
    displayOrder: idx,
  }));
}

/**
 * Converts a validated SATA payload into canonical CanonicalOption rows.
 */
export function sataPayloadToCanonicalOptions(
  payload: SataQuestionPayload,
): CanonicalOption[] {
  const rationaleMap = new Map(payload.rationaleByLetter.map((r) => [r.letter, r.rationale]));
  const correctSet = new Set(payload.correctLetters);
  return payload.answerOptions.map((opt, idx) => ({
    optionKey: opt.letter,
    content: opt.text,
    isCorrect: correctSet.has(opt.letter),
    rationale: rationaleMap.get(opt.letter) ?? null,
    displayOrder: idx,
  }));
}

// ─── Standard letter helpers ──────────────────────────────────────────────────

/**
 * Assigns standard A–D (or A–F) letter keys to options in order.
 * Used when importing content that has numbered or unlabeled options.
 */
export function assignStandardLetters(
  options: Array<{ content: string; isCorrect: boolean; rationale?: string | null }>,
): CanonicalOption[] {
  return options.slice(0, STANDARD_LETTERS.length).map((opt, idx) => ({
    optionKey: STANDARD_LETTERS[idx],
    content: opt.content,
    isCorrect: opt.isCorrect,
    rationale: opt.rationale ?? null,
    displayOrder: idx,
  }));
}
