/**
 * Pure form-state logic for the admin flashcard editor.
 *
 * No DOM, no React, no DB access — functions are fully unit-testable.
 *
 * Responsibilities:
 *   - initialiseEditorState()  — parse GET response into editor form state
 *   - toggleCorrectLetter()    — toggle a letter in the SATA multi-select (immutable)
 *   - buildSavePayload()       — convert form state → POST/PATCH body
 *   - isFormValid()            — structural pre-save check
 */

import type { CanonicalOption } from "@/lib/flashcards/flashcard-option-normalize";

// ── Editor state ──────────────────────────────────────────────────────────────

export type EditorOption = {
  /** "A"–"F" */
  optionKey: string;
  content: string;
  /** For MCQ: true on exactly one option. For SATA: true on ≥ 2. */
  isCorrect: boolean;
  /** Wrong-answer teaching rationale (required for wrong options). */
  rationale: string;
};

export type FlashcardEditorState = {
  flashcardId: string | null;
  examItemKind: string;   // "CLINICAL" | "PRIORITY" | "RECALL" | "CONCEPT" | "SATA" | ...
  questionStem: string;
  rationaleCorrect: string;
  options: EditorOption[];
  /** Mirrors options[].isCorrect — derived field kept in sync for convenience. */
  correctLetters: string[];
  /** Hydration source reported by GET /api/admin/flashcards/[id]. */
  optionsSource: "canonical" | "json_fallback" | "none" | null;
  front: string;
  back: string;
  status: string;
  tier: string;
  country: string;
  categoryId: string;
  lessonId: string | null;
  deckId: string | null;
};

export type AdminFlashcardGetResponse = {
  flashcard: {
    id: string;
    front: string;
    back: string;
    status: string;
    tier: string;
    country: string;
    categoryId: string;
    examItemKind: string | null;
    questionStem: string | null;
    rationaleCorrect: string | null;
    lessonId: string | null;
    deckId: string | null;
  };
  options: CanonicalOption[];
  optionsSource: "canonical" | "json_fallback" | "none";
  correctLetters: string[] | null;
};

// ── Initialisation ────────────────────────────────────────────────────────────

const BLANK_OPTION = (key: string, order: number): EditorOption => ({
  optionKey: key,
  content: "",
  isCorrect: false,
  rationale: "",
});
void BLANK_OPTION; // suppress unused warning — used below

/**
 * Convert a GET /api/admin/flashcards/[id] response into editor form state.
 * When no canonical options exist (new card), returns 3 blank MCQ option rows.
 */
export function initialiseEditorState(response: AdminFlashcardGetResponse): FlashcardEditorState {
  const { flashcard, options, optionsSource, correctLetters } = response;

  const editorOptions: EditorOption[] =
    options.length >= 3
      ? options.map((o) => ({
          optionKey: o.optionKey,
          content: o.content,
          isCorrect: o.isCorrect,
          rationale: o.rationale ?? "",
        }))
      : ["A", "B", "C"].map((k) => ({
          optionKey: k,
          content: "",
          isCorrect: false,
          rationale: "",
        }));

  const resolvedCorrectLetters =
    correctLetters ??
    editorOptions.filter((o) => o.isCorrect).map((o) => o.optionKey);

  return {
    flashcardId: flashcard.id,
    examItemKind: flashcard.examItemKind ?? "CLINICAL",
    questionStem: flashcard.questionStem ?? "",
    rationaleCorrect: flashcard.rationaleCorrect ?? "",
    options: editorOptions,
    correctLetters: resolvedCorrectLetters,
    optionsSource,
    front: flashcard.front,
    back: flashcard.back,
    status: flashcard.status,
    tier: flashcard.tier,
    country: flashcard.country,
    categoryId: flashcard.categoryId,
    lessonId: flashcard.lessonId,
    deckId: flashcard.deckId,
  };
}

/** Empty state for the "create new" path. */
export function blankEditorState(): FlashcardEditorState {
  return {
    flashcardId: null,
    examItemKind: "CLINICAL",
    questionStem: "",
    rationaleCorrect: "",
    options: ["A", "B", "C"].map((k) => ({
      optionKey: k,
      content: "",
      isCorrect: false,
      rationale: "",
    })),
    correctLetters: [],
    optionsSource: null,
    front: "",
    back: "",
    status: "DRAFT",
    tier: "RN",
    country: "US",
    categoryId: "",
    lessonId: null,
    deckId: null,
  };
}

// ── SATA multi-select toggle ──────────────────────────────────────────────────

/**
 * Toggle a letter in the SATA multi-select.
 * Returns a new `options` array and updated `correctLetters` (immutable — does not mutate input).
 *
 * For MCQ (non-SATA), only one letter can be correct at a time: selecting a new
 * letter deselects all others.
 */
export function toggleCorrectLetter(
  current: EditorOption[],
  letter: string,
  isSata: boolean,
): { options: EditorOption[]; correctLetters: string[] } {
  let updated: EditorOption[];

  if (isSata) {
    // Multi-select: toggle the clicked letter
    updated = current.map((o) =>
      o.optionKey === letter ? { ...o, isCorrect: !o.isCorrect } : o,
    );
  } else {
    // Single-select: selecting always sets exactly this letter as correct
    updated = current.map((o) => ({ ...o, isCorrect: o.optionKey === letter }));
  }

  const correctLetters = updated.filter((o) => o.isCorrect).map((o) => o.optionKey);
  return { options: updated, correctLetters };
}

/** Add a new blank option row (MCQ and SATA). Max 6 for SATA, 4 for MCQ. */
export function addOptionRow(options: EditorOption[], isSata: boolean): EditorOption[] {
  const max = isSata ? 6 : 4;
  if (options.length >= max) return options;
  const nextKey = String.fromCharCode("A".charCodeAt(0) + options.length);
  return [...options, { optionKey: nextKey, content: "", isCorrect: false, rationale: "" }];
}

/** Remove an option row by index. Reassigns letters A–F in order. */
export function removeOptionRow(options: EditorOption[], index: number): EditorOption[] {
  const filtered = options.filter((_, i) => i !== index);
  // Reassign option keys so they remain consecutive A/B/C/...
  return filtered.map((o, i) => ({
    ...o,
    optionKey: String.fromCharCode("A".charCodeAt(0) + i),
  }));
}

// ── Payload builder ───────────────────────────────────────────────────────────

export type FlashcardSavePayload = {
  examItemKind: string;
  questionStem: string;
  answerOptions: Array<{ letter: string; text: string }>;
  /** SATA: explicit array. MCQ: absent (use correctAnswer). */
  correctLetters?: string[];
  /** MCQ: single letter. SATA: absent (use correctLetters). */
  correctAnswer?: string;
  rationaleCorrect: string;
  rationaleIncorrect: Array<{ letter: string; rationale: string }>;
  front: string;
  back: string;
  status?: string;
  tier?: string;
  country?: string;
  categoryId?: string;
  lessonId?: string | null;
  deckId?: string | null;
};

/**
 * Build the POST/PATCH body from editor form state.
 *
 * MCQ: uses `correctAnswer` (single letter).
 * SATA: uses `correctLetters` (array). `correctAnswer` is omitted to avoid
 * triggering the conflict warning on the server.
 */
export function buildSavePayload(state: FlashcardEditorState): FlashcardSavePayload {
  const isSata = state.examItemKind === "SATA";

  const answerOptions = state.options.map((o) => ({
    letter: o.optionKey,
    text: o.content.trim(),
  }));

  const rationaleIncorrect = state.options
    .filter((o) => !o.isCorrect)
    .map((o) => ({ letter: o.optionKey, rationale: o.rationale.trim() }));

  const correctLetters = state.options
    .filter((o) => o.isCorrect)
    .map((o) => o.optionKey);

  return {
    examItemKind: state.examItemKind,
    questionStem: state.questionStem.trim(),
    answerOptions,
    ...(isSata
      ? { correctLetters }
      : { correctAnswer: correctLetters[0] ?? "" }),
    rationaleCorrect: state.rationaleCorrect.trim(),
    rationaleIncorrect,
    front: state.questionStem.trim(),
    back: state.rationaleCorrect.trim(),
    status: state.status,
    tier: state.tier,
    country: state.country,
    categoryId: state.categoryId,
    ...(state.lessonId !== undefined ? { lessonId: state.lessonId } : {}),
    ...(state.deckId !== undefined ? { deckId: state.deckId } : {}),
  };
}

// ── Validation ────────────────────────────────────────────────────────────────

export type EditorValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

/**
 * Lightweight pre-save validation for the form UI.
 * Does not duplicate server-side validation — just provides early user feedback.
 */
export function isFormValid(state: FlashcardEditorState): EditorValidationResult {
  const errors: string[] = [];
  const isSata = state.examItemKind === "SATA";

  if (state.questionStem.trim().length < 8) {
    errors.push("Question stem must be at least 8 characters.");
  }
  if (state.rationaleCorrect.trim().length < 8) {
    errors.push("Correct rationale must be at least 8 characters.");
  }
  if (state.options.length < 3) {
    errors.push("At least 3 answer options are required.");
  }
  if (state.options.length > (isSata ? 6 : 4)) {
    errors.push(`${isSata ? "SATA" : "MCQ"} cards allow at most ${isSata ? 6 : 4} options.`);
  }

  const correctCount = state.options.filter((o) => o.isCorrect).length;
  if (correctCount === 0) {
    errors.push("At least one correct answer must be selected.");
  }
  if (isSata && correctCount < 2) {
    errors.push("SATA cards require at least 2 correct answers.");
  }
  if (!isSata && correctCount > 1) {
    errors.push("MCQ cards require exactly 1 correct answer.");
  }

  const wrongOptions = state.options.filter((o) => !o.isCorrect);
  for (const opt of wrongOptions) {
    if (opt.rationale.trim().length < 8) {
      errors.push(`Option ${opt.optionKey} wrong-answer rationale must be at least 8 characters.`);
    }
  }

  if (!state.categoryId.trim()) {
    errors.push("Category ID is required.");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
