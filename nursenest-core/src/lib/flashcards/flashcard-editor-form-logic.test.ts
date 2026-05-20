/**
 * Unit tests for flashcard-editor-form-logic.ts
 *
 * Coverage:
 *   initialiseEditorState  — GET response → form state
 *   blankEditorState       — new-card starting state
 *   toggleCorrectLetter    — MCQ single-select / SATA multi-select
 *   addOptionRow           — option count bounds
 *   removeOptionRow        — letter reassignment after removal
 *   buildSavePayload       — MCQ uses correctAnswer, SATA uses correctLetters
 *   isFormValid            — structural validation without server round-trip
 *
 * Scenarios verified:
 *   - create MCQ card: exactly one correct, correctAnswer set
 *   - create SATA card: multiple correct, correctLetters set, no correctAnswer
 *   - edit SATA card: change A,C correct → B,D correct, verify old selection gone
 *   - reload: initialiseEditorState mirrors response.correctLetters
 *   - removing an option reassigns letters (D disappears after removing option D)
 *   - MCQ: selecting a new correct letter deselects the previous one
 *   - SATA: toggling an already-correct letter deselects it
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  initialiseEditorState,
  blankEditorState,
  toggleCorrectLetter,
  addOptionRow,
  removeOptionRow,
  buildSavePayload,
  isFormValid,
  type AdminFlashcardGetResponse,
  type FlashcardEditorState,
} from "@/lib/flashcards/flashcard-editor-form-logic";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function mcqResponse(): AdminFlashcardGetResponse {
  return {
    flashcard: {
      id: "card-mcq-1",
      front: "Which action is priority?",
      back: "Stop the infusion — Correct: B",
      status: "DRAFT",
      tier: "RN",
      country: "US",
      categoryId: "cat-1",
      examItemKind: "CLINICAL",
      questionStem: "Which nursing action is the highest priority?",
      rationaleCorrect: "Stopping the infusion is the immediate safety action.",
      lessonId: null,
      deckId: null,
    },
    options: [
      { optionKey: "A", content: "Slow the rate", isCorrect: false, rationale: "Slowing delays removal.", displayOrder: 0 },
      { optionKey: "B", content: "Stop the infusion", isCorrect: true, rationale: null, displayOrder: 1 },
      { optionKey: "C", content: "Apply warm compress", isCorrect: false, rationale: "Masking injury risk.", displayOrder: 2 },
    ],
    optionsSource: "canonical",
    correctLetters: ["B"],
  };
}

function sataResponse(): AdminFlashcardGetResponse {
  return {
    flashcard: {
      id: "card-sata-1",
      front: "Select all appropriate nursing actions.",
      back: "Correct: A, C, D",
      status: "DRAFT",
      tier: "RN",
      country: "US",
      categoryId: "cat-2",
      examItemKind: "SATA",
      questionStem: "Select all appropriate nursing actions for a client in respiratory distress.",
      rationaleCorrect: "A, C, and D address oxygenation and positioning.",
      lessonId: null,
      deckId: null,
    },
    options: [
      { optionKey: "A", content: "Elevate HOB", isCorrect: true, rationale: null, displayOrder: 0 },
      { optionKey: "B", content: "Increase IV rate", isCorrect: false, rationale: "Worsens fluid overload.", displayOrder: 1 },
      { optionKey: "C", content: "Administer O2", isCorrect: true, rationale: null, displayOrder: 2 },
      { optionKey: "D", content: "Decrease IV rate", isCorrect: true, rationale: null, displayOrder: 3 },
      { optionKey: "E", content: "Monitor BPs", isCorrect: false, rationale: "Monitoring alone is insufficient here.", displayOrder: 4 },
    ],
    optionsSource: "canonical",
    correctLetters: ["A", "C", "D"],
  };
}

// ── initialiseEditorState ─────────────────────────────────────────────────────

test("initialise: MCQ response → state has examItemKind=CLINICAL, 3 options, correctLetters=[B]", () => {
  const state = initialiseEditorState(mcqResponse());
  assert.equal(state.examItemKind, "CLINICAL");
  assert.equal(state.options.length, 3);
  assert.deepEqual(state.correctLetters, ["B"]);
  assert.equal(state.options.find((o) => o.optionKey === "B")?.isCorrect, true);
  assert.equal(state.options.find((o) => o.optionKey === "A")?.isCorrect, false);
});

test("initialise: MCQ response → optionsSource=canonical", () => {
  const state = initialiseEditorState(mcqResponse());
  assert.equal(state.optionsSource, "canonical");
});

test("initialise: SATA response → correctLetters=[A,C,D], 3 of 5 options isCorrect", () => {
  const state = initialiseEditorState(sataResponse());
  assert.deepEqual(state.correctLetters.sort(), ["A", "C", "D"]);
  assert.equal(state.options.filter((o) => o.isCorrect).length, 3);
});

test("initialise: SATA response → examItemKind=SATA", () => {
  const state = initialiseEditorState(sataResponse());
  assert.equal(state.examItemKind, "SATA");
});

test("initialise: response with no canonical options → 3 blank options", () => {
  const empty: AdminFlashcardGetResponse = {
    ...mcqResponse(),
    options: [],
    correctLetters: null,
  };
  const state = initialiseEditorState(empty);
  assert.equal(state.options.length, 3);
  assert.ok(state.options.every((o) => !o.isCorrect));
});

test("initialise: correctLetters=null falls back to isCorrect from options array", () => {
  const resp = mcqResponse();
  resp.correctLetters = null;
  const state = initialiseEditorState(resp);
  assert.deepEqual(state.correctLetters, ["B"]);
});

// ── blankEditorState ──────────────────────────────────────────────────────────

test("blank: starts with 3 options, none correct, CLINICAL kind, DRAFT status", () => {
  const state = blankEditorState();
  assert.equal(state.options.length, 3);
  assert.ok(state.options.every((o) => !o.isCorrect));
  assert.equal(state.examItemKind, "CLINICAL");
  assert.equal(state.status, "DRAFT");
  assert.deepEqual(state.correctLetters, []);
});

// ── toggleCorrectLetter — MCQ ─────────────────────────────────────────────────

test("MCQ toggle: selecting B sets only B as correct", () => {
  const state = initialiseEditorState(mcqResponse()); // B is correct
  // Toggle A — should make only A correct (single-select)
  const { options, correctLetters } = toggleCorrectLetter(state.options, "A", false);
  assert.deepEqual(correctLetters, ["A"]);
  assert.equal(options.find((o) => o.optionKey === "A")?.isCorrect, true);
  assert.equal(options.find((o) => o.optionKey === "B")?.isCorrect, false);
  assert.equal(options.find((o) => o.optionKey === "C")?.isCorrect, false);
});

test("MCQ toggle: re-selecting B keeps only B correct (idempotent)", () => {
  const state = initialiseEditorState(mcqResponse());
  const { correctLetters } = toggleCorrectLetter(state.options, "B", false);
  assert.deepEqual(correctLetters, ["B"]);
});

test("MCQ toggle: does not mutate original options array", () => {
  const state = initialiseEditorState(mcqResponse());
  const original = [...state.options];
  toggleCorrectLetter(state.options, "A", false);
  assert.deepEqual(state.options, original);
});

// ── toggleCorrectLetter — SATA ────────────────────────────────────────────────

test("SATA toggle: deselecting A leaves C and D correct", () => {
  const state = initialiseEditorState(sataResponse()); // A, C, D correct
  const { options, correctLetters } = toggleCorrectLetter(state.options, "A", true);
  assert.deepEqual(correctLetters.sort(), ["C", "D"]);
  assert.equal(options.find((o) => o.optionKey === "A")?.isCorrect, false);
});

test("SATA toggle: selecting B adds B to correct set", () => {
  const state = initialiseEditorState(sataResponse()); // A, C, D correct
  const { correctLetters } = toggleCorrectLetter(state.options, "B", true);
  assert.deepEqual(correctLetters.sort(), ["A", "B", "C", "D"]);
});

test("SATA edit: change from A,C correct to B,D correct (two-step toggle)", () => {
  const state = initialiseEditorState(sataResponse()); // A, C, D correct
  // Step 1: deselect A, C, D
  let { options } = toggleCorrectLetter(state.options, "A", true);
  ({ options } = toggleCorrectLetter(options, "C", true));
  ({ options } = toggleCorrectLetter(options, "D", true));
  // Step 2: select B, D
  ({ options } = toggleCorrectLetter(options, "B", true));
  const { options: final, correctLetters } = toggleCorrectLetter(options, "D", true);

  assert.deepEqual(correctLetters.sort(), ["B", "D"]);
  assert.equal(final.find((o) => o.optionKey === "A")?.isCorrect, false);
  assert.equal(final.find((o) => o.optionKey === "C")?.isCorrect, false);
});

// ── addOptionRow ──────────────────────────────────────────────────────────────

test("addOptionRow: MCQ max 4 — adding when at 4 is no-op", () => {
  let opts = blankEditorState().options;
  opts = addOptionRow(opts, false);
  opts = addOptionRow(opts, false); // now 4
  const before = opts.length;
  opts = addOptionRow(opts, false); // attempt 5th
  assert.equal(opts.length, before, "must not exceed 4 for MCQ");
});

test("addOptionRow: SATA max 6 — can add to 6, then no-op", () => {
  let opts = blankEditorState().options; // 3
  for (let i = 0; i < 3; i++) opts = addOptionRow(opts, true); // → 6
  assert.equal(opts.length, 6);
  opts = addOptionRow(opts, true); // attempt 7th
  assert.equal(opts.length, 6, "must not exceed 6 for SATA");
});

test("addOptionRow: new option has sequential key (3 options → D added)", () => {
  const opts = addOptionRow(blankEditorState().options, false);
  assert.equal(opts.length, 4);
  assert.equal(opts[3]!.optionKey, "D");
});

// ── removeOptionRow ───────────────────────────────────────────────────────────

test("removeOptionRow: removes option and reassigns keys A/B/C", () => {
  let opts = blankEditorState().options; // A, B, C
  opts = addOptionRow(opts, false); // A, B, C, D
  opts = removeOptionRow(opts, 2); // remove C (index 2)
  assert.equal(opts.length, 3);
  const keys = opts.map((o) => o.optionKey);
  assert.deepEqual(keys, ["A", "B", "C"]); // D becomes C
});

test("removeOptionRow: removing first option reassigns all keys", () => {
  let opts = blankEditorState().options;
  opts = addOptionRow(opts, false); // A, B, C, D
  opts = removeOptionRow(opts, 0); // remove A
  assert.deepEqual(opts.map((o) => o.optionKey), ["A", "B", "C"]);
});

// ── buildSavePayload ──────────────────────────────────────────────────────────

test("buildSavePayload: MCQ → has correctAnswer, no correctLetters", () => {
  const state = initialiseEditorState(mcqResponse());
  const payload = buildSavePayload(state);
  assert.equal(payload.correctAnswer, "B");
  assert.equal("correctLetters" in payload, false);
});

test("buildSavePayload: SATA → has correctLetters, no correctAnswer", () => {
  const state = initialiseEditorState(sataResponse());
  const payload = buildSavePayload(state);
  assert.ok(Array.isArray(payload.correctLetters));
  assert.deepEqual(payload.correctLetters!.sort(), ["A", "C", "D"]);
  assert.equal("correctAnswer" in payload, false);
});

test("buildSavePayload: rationaleIncorrect contains only wrong options", () => {
  const state = initialiseEditorState(mcqResponse());
  const payload = buildSavePayload(state);
  const letters = payload.rationaleIncorrect.map((r) => r.letter);
  assert.ok(!letters.includes("B"), "B is correct — must not be in rationaleIncorrect");
  assert.ok(letters.includes("A") && letters.includes("C"));
});

test("buildSavePayload: answerOptions preserves all letters", () => {
  const state = initialiseEditorState(mcqResponse());
  const payload = buildSavePayload(state);
  assert.deepEqual(payload.answerOptions.map((o) => o.letter), ["A", "B", "C"]);
});

// ── isFormValid ───────────────────────────────────────────────────────────────

function validMcqState(): FlashcardEditorState {
  return initialiseEditorState(mcqResponse());
}

test("isFormValid: well-formed MCQ state → ok=true", () => {
  const state = { ...validMcqState(), categoryId: "cat-1" };
  const result = isFormValid(state);
  assert.equal(result.ok, true);
});

test("isFormValid: short questionStem → error", () => {
  const state = { ...validMcqState(), questionStem: "Short", categoryId: "cat-1" };
  const result = isFormValid(state);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /stem/i.test(e)));
});

test("isFormValid: MCQ with 0 correct → error", () => {
  const state = validMcqState();
  const options = state.options.map((o) => ({ ...o, isCorrect: false }));
  const result = isFormValid({ ...state, options, correctLetters: [], categoryId: "cat-1" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /correct/i.test(e)));
});

test("isFormValid: MCQ with 2 correct → error (mcq requires exactly 1)", () => {
  const state = validMcqState();
  const options = state.options.map((o) => ({ ...o, isCorrect: o.optionKey === "A" || o.optionKey === "B" }));
  const result = isFormValid({ ...state, options, correctLetters: ["A", "B"], categoryId: "cat-1" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /exactly 1/i.test(e)));
});

test("isFormValid: SATA with 1 correct → error", () => {
  const state = initialiseEditorState(sataResponse());
  const options = state.options.map((o) => ({ ...o, isCorrect: o.optionKey === "A" }));
  const result = isFormValid({ ...state, options, correctLetters: ["A"], categoryId: "cat-2" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /at least 2/i.test(e)));
});

test("isFormValid: missing categoryId → error", () => {
  const state = { ...validMcqState(), categoryId: "" };
  const result = isFormValid(state);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /category/i.test(e)));
});

test("isFormValid: wrong option with empty rationale → error", () => {
  const state = validMcqState();
  const options = state.options.map((o) =>
    o.optionKey === "A" ? { ...o, rationale: "" } : o,
  );
  const result = isFormValid({ ...state, options, categoryId: "cat-1" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.some((e) => /rationale/i.test(e)));
});

// ── Reload / persistence round-trip ──────────────────────────────────────────

test("reload: initialiseEditorState is idempotent — re-loading same response gives same state", () => {
  const resp = sataResponse();
  const s1 = initialiseEditorState(resp);
  const s2 = initialiseEditorState(resp);
  assert.deepEqual(s1.correctLetters.sort(), s2.correctLetters.sort());
  assert.deepEqual(
    s1.options.map((o) => o.optionKey),
    s2.options.map((o) => o.optionKey),
  );
  assert.deepEqual(
    s1.options.map((o) => o.isCorrect),
    s2.options.map((o) => o.isCorrect),
  );
});

test("reload: SATA card after PATCH — reload response with new correctLetters B,D replaces old A,C,D", () => {
  const originalResp = sataResponse();
  // Simulate server returning new correctLetters after PATCH
  const updatedResp: AdminFlashcardGetResponse = {
    ...originalResp,
    options: originalResp.options.map((o) => ({
      ...o,
      isCorrect: o.optionKey === "B" || o.optionKey === "D",
    })),
    correctLetters: ["B", "D"],
  };
  const state = initialiseEditorState(updatedResp);
  assert.deepEqual(state.correctLetters.sort(), ["B", "D"]);
  assert.equal(state.options.find((o) => o.optionKey === "A")?.isCorrect, false);
  assert.equal(state.options.find((o) => o.optionKey === "C")?.isCorrect, false);
  assert.equal(state.options.find((o) => o.optionKey === "B")?.isCorrect, true);
  assert.equal(state.options.find((o) => o.optionKey === "D")?.isCorrect, true);
});

// ── GET response shape contract ───────────────────────────────────────────────
// Validates the fields that the editor depends on exist in the GET response type.

test("contract: AdminFlashcardGetResponse has options, optionsSource, correctLetters", () => {
  const resp = mcqResponse();
  assert.ok(Array.isArray(resp.options));
  assert.ok(["canonical", "json_fallback", "none"].includes(resp.optionsSource));
  // correctLetters: array or null
  assert.ok(resp.correctLetters === null || Array.isArray(resp.correctLetters));
});

test("contract: options shape has optionKey, content, isCorrect, rationale, displayOrder", () => {
  const resp = mcqResponse();
  for (const opt of resp.options) {
    assert.ok("optionKey" in opt);
    assert.ok("content" in opt);
    assert.ok("isCorrect" in opt);
    assert.ok("rationale" in opt);
    assert.ok("displayOrder" in opt);
  }
});

test("contract: SATA response correctLetters length matches isCorrect count in options", () => {
  const resp = sataResponse();
  const fromOptions = resp.options.filter((o) => o.isCorrect).length;
  assert.equal(resp.correctLetters!.length, fromOptions);
});
