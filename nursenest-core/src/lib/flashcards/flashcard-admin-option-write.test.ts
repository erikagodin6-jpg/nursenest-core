/**
 * Unit tests for flashcard-admin-option-write.ts
 *
 * Coverage:
 *   buildCanonicalOptionsFromAdminPayload —
 *     MCQ create: exactly one correct, option_key stability A/B/C/D
 *     MCQ update (replace): options rebuilt correctly, orphaned keys absent
 *     SATA create: multiple correct options
 *     Invalid SATA (1 correct letter): rejected with sata_single_correct
 *     MCQ with multiple correctLetters: rejected with mcq_multiple_correct
 *     Wrong option missing rationale: rejected with wrong_option_rationale_missing
 *     Option count bounds: too few / too many
 *     correctLetters takes priority over correctAnswer
 *   detectOptionInputConflict — conflict telemetry
 *   PATCH replace semantics — delete orphaned options, correct displayOrder, isCorrect
 *   Transaction safety — buildCanonicalOptionsFromAdminPayload is pure; tx rollback
 *     is covered by the DB layer (replaceCanonicalOptions uses deleteMany + createMany
 *     inside the caller's transaction). We verify the pure helper never partially succeeds.
 *   buildSataBackField — back-field formatting
 *
 * Legacy JSON fallback (hydrateFlashcardOptions json_fallback path) is already
 * covered by flashcard-option-normalize.test.ts and flashcard-option-hydrate tests.
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCanonicalOptionsFromAdminPayload,
  buildSataBackField,
  detectOptionInputConflict,
  type AdminOptionInput,
} from "./flashcard-admin-option-write";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MCQ_BASE: AdminOptionInput = {
  examItemKind: "CLINICAL",
  answerOptions: [
    { letter: "A", text: "Slow the infusion rate" },
    { letter: "B", text: "Stop the infusion and assess the site" },
    { letter: "C", text: "Apply a warm compress" },
    { letter: "D", text: "Flush with normal saline" },
  ],
  correctAnswer: "B",
  rationaleIncorrect: [
    { letter: "A", rationale: "Slowing the rate delays removal of the irritant." },
    { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
    { letter: "D", rationale: "Flushing can worsen tissue injury on infiltration." },
  ],
  rationaleCorrect: "Stopping the infusion is the immediate safety priority before any assessment.",
};

const SATA_BASE: AdminOptionInput = {
  examItemKind: "SATA",
  answerOptions: [
    { letter: "A", text: "Elevate the head of the bed to high-Fowler position" },
    { letter: "B", text: "Increase the IV fluid rate" },
    { letter: "C", text: "Administer supplemental oxygen" },
    { letter: "D", text: "Decrease the IV infusion rate" },
    { letter: "E", text: "Monitor breath sounds every 2 hours" },
  ],
  correctLetters: ["A", "C", "D", "E"],
  rationaleIncorrect: [
    { letter: "B", rationale: "Increasing the IV rate worsens fluid overload in pulmonary edema." },
  ],
  rationaleCorrect: "These interventions address hypoxia and reduce fluid overload.",
};

// ── MCQ: admin create → CanonicalOption[] ─────────────────────────────────────

test("MCQ create: returns ok=true with 4 canonical options", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.options.length, 4);
  assert.equal(result.isSata, false);
});

test("MCQ create: exactly one option is isCorrect=true", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.filter((o) => o.isCorrect);
  assert.equal(correct.length, 1);
  assert.equal(correct[0]!.optionKey, "B");
});

test("MCQ create: option keys remain A/B/C/D (stable)", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const keys = result.options.map((o) => o.optionKey);
  assert.deepEqual(keys, ["A", "B", "C", "D"]);
});

test("MCQ create: correct option carries rationaleCorrect on rationale field", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.find((o) => o.optionKey === "B");
  assert.equal(correct?.rationale, MCQ_BASE.rationaleCorrect);
});

test("MCQ create: wrong options carry per-option rationale", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const optA = result.options.find((o) => o.optionKey === "A");
  assert.equal(optA?.rationale, "Slowing the rate delays removal of the irritant.");
  const optC = result.options.find((o) => o.optionKey === "C");
  assert.equal(optC?.rationale, "Heat may mask worsening infiltration damage.");
});

test("MCQ create: displayOrder follows answerOptions array order", () => {
  const result = buildCanonicalOptionsFromAdminPayload(MCQ_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  result.options.forEach((opt, idx) => assert.equal(opt.displayOrder, idx));
});

test("MCQ update (replace): rebuilt options match new correctAnswer", () => {
  const updated: AdminOptionInput = {
    ...MCQ_BASE,
    correctAnswer: "A",
    rationaleIncorrect: [
      { letter: "B", rationale: "Stopping has higher priority than slowing." },
      { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
      { letter: "D", rationale: "Flushing can worsen tissue injury." },
    ],
    rationaleCorrect: "Slowing is appropriate for minor reactions before a full stop.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(updated);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.filter((o) => o.isCorrect);
  assert.equal(correct.length, 1);
  assert.equal(correct[0]!.optionKey, "A");
  const wrongB = result.options.find((o) => o.optionKey === "B");
  assert.equal(wrongB?.isCorrect, false);
  assert.equal(wrongB?.rationale, "Stopping has higher priority than slowing.");
});

test("MCQ 3-option: valid minimum bound accepted", () => {
  const threeOpt: AdminOptionInput = {
    examItemKind: "RECALL",
    answerOptions: [
      { letter: "A", text: "Tachycardia" },
      { letter: "B", text: "Bradycardia" },
      { letter: "C", text: "Hypotension" },
    ],
    correctAnswer: "A",
    rationaleIncorrect: [
      { letter: "B", rationale: "Bradycardia is not the expected beta-agonist response." },
      { letter: "C", rationale: "Beta-agonists typically raise, not lower, heart rate." },
    ],
    rationaleCorrect: "Beta-agonists stimulate the SA node, causing tachycardia.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(threeOpt);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.options.length, 3);
});

// ── SATA: admin create → multiple correct options ─────────────────────────────

test("SATA create: returns ok=true with isSata=true", () => {
  const result = buildCanonicalOptionsFromAdminPayload(SATA_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.isSata, true);
});

test("SATA create: 4 of 5 options are isCorrect=true", () => {
  const result = buildCanonicalOptionsFromAdminPayload(SATA_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  assert.deepEqual(correct, ["A", "C", "D", "E"]);
});

test("SATA create: wrong option B carries its rationale", () => {
  const result = buildCanonicalOptionsFromAdminPayload(SATA_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const optB = result.options.find((o) => o.optionKey === "B");
  assert.equal(optB?.isCorrect, false);
  assert.equal(optB?.rationale, "Increasing the IV rate worsens fluid overload in pulmonary edema.");
});

test("SATA create: option key stability — A/B/C/D/E preserved", () => {
  const result = buildCanonicalOptionsFromAdminPayload(SATA_BASE);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const keys = result.options.map((o) => o.optionKey);
  assert.deepEqual(keys, ["A", "B", "C", "D", "E"]);
});

test("SATA create via comma-separated correctAnswer (legacy form)", () => {
  const legacyForm: AdminOptionInput = {
    ...SATA_BASE,
    correctLetters: undefined,
    correctAnswer: "A,C,D,E",
  };
  const result = buildCanonicalOptionsFromAdminPayload(legacyForm);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  assert.deepEqual(correct, ["A", "C", "D", "E"]);
});

test("SATA create: correctLetters takes priority over correctAnswer when both provided", () => {
  const both: AdminOptionInput = {
    ...SATA_BASE,
    correctLetters: ["A", "C"],
    correctAnswer: "A,C,D,E",
    // When only A+C are correct, B/D/E are wrong and all need rationale
    rationaleIncorrect: [
      { letter: "B", rationale: "Increasing the IV rate worsens fluid overload in pulmonary edema." },
      { letter: "D", rationale: "Decreasing IV rate is beneficial but not in scope here." },
      { letter: "E", rationale: "Monitoring alone is insufficient as a primary intervention." },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(both);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correct = result.options.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  // correctLetters wins → only A and C are correct
  assert.deepEqual(correct, ["A", "C"]);
});

// ── Rejection: invalid SATA (1 correct) ──────────────────────────────────────

test("invalid SATA: single correctLetter → rejected with sata_single_correct", () => {
  const oneLetter: AdminOptionInput = {
    ...SATA_BASE,
    correctLetters: ["A"],
    correctAnswer: undefined,
  };
  const result = buildCanonicalOptionsFromAdminPayload(oneLetter);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "sata_single_correct");
});

test("invalid SATA: single letter in comma correctAnswer → rejected with sata_single_correct", () => {
  const singleLegacy: AdminOptionInput = {
    ...SATA_BASE,
    correctLetters: undefined,
    correctAnswer: "B",
  };
  const result = buildCanonicalOptionsFromAdminPayload(singleLegacy);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "sata_single_correct");
});

test("invalid SATA: no correctAnswer or correctLetters → rejected with options_no_correct", () => {
  const noCorrect: AdminOptionInput = {
    ...SATA_BASE,
    correctLetters: undefined,
    correctAnswer: undefined,
  };
  const result = buildCanonicalOptionsFromAdminPayload(noCorrect);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "options_no_correct");
});

// ── Rejection: MCQ with multiple correct ─────────────────────────────────────

test("MCQ with correctLetters array >1 → rejected with mcq_multiple_correct", () => {
  const multiCorrect: AdminOptionInput = {
    ...MCQ_BASE,
    correctLetters: ["A", "B"],
    correctAnswer: undefined,
  };
  const result = buildCanonicalOptionsFromAdminPayload(multiCorrect);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "mcq_multiple_correct");
});

test("MCQ with comma-separated correctAnswer resolves as mcq_multiple_correct when kind is not SATA", () => {
  const multiViaComma: AdminOptionInput = {
    ...MCQ_BASE,
    correctAnswer: "A,B",
    correctLetters: undefined,
  };
  const result = buildCanonicalOptionsFromAdminPayload(multiViaComma);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "mcq_multiple_correct");
});

// ── Rejection: wrong option missing rationale ─────────────────────────────────

test("wrong option rationale missing → rejected with wrong_option_rationale_missing", () => {
  const noRationale: AdminOptionInput = {
    ...MCQ_BASE,
    rationaleIncorrect: [
      { letter: "A", rationale: "ok rationale here" },
      // C and D are missing
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(noRationale);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "wrong_option_rationale_missing");
});

test("wrong option rationale too short → rejected with wrong_option_rationale_missing", () => {
  const shortRationale: AdminOptionInput = {
    ...MCQ_BASE,
    rationaleIncorrect: [
      { letter: "A", rationale: "ok" }, // < 4 chars
      { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
      { letter: "D", rationale: "Flushing can worsen tissue injury." },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(shortRationale);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "wrong_option_rationale_missing");
});

// ── Rejection: option count bounds ────────────────────────────────────────────

test("too few options (2) → rejected with options_too_few", () => {
  const twoOpts: AdminOptionInput = {
    ...MCQ_BASE,
    answerOptions: [
      { letter: "A", text: "Option A" },
      { letter: "B", text: "Option B" },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(twoOpts);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "options_too_few");
});

test("MCQ with 5 options (>4) → rejected with options_too_many", () => {
  const fiveOpts: AdminOptionInput = {
    ...MCQ_BASE,
    answerOptions: [
      { letter: "A", text: "Option A" },
      { letter: "B", text: "Option B" },
      { letter: "C", text: "Option C" },
      { letter: "D", text: "Option D" },
      { letter: "E", text: "Option E" },
    ],
    rationaleIncorrect: [
      { letter: "A", rationale: "A is wrong because the correct answer is B." },
      { letter: "C", rationale: "C is not the highest priority." },
      { letter: "D", rationale: "D is not appropriate in this context." },
      { letter: "E", rationale: "E is not clinically indicated here." },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(fiveOpts);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "options_too_many");
});

test("SATA with 6 options (max) → accepted", () => {
  const sixOpts: AdminOptionInput = {
    examItemKind: "SATA",
    answerOptions: [
      { letter: "A", text: "Elevate head of bed" },
      { letter: "B", text: "Increase IV rate" },
      { letter: "C", text: "Administer oxygen" },
      { letter: "D", text: "Decrease IV rate" },
      { letter: "E", text: "Monitor breath sounds" },
      { letter: "F", text: "Restrict oral fluids" },
    ],
    correctLetters: ["A", "C", "D", "E", "F"],
    rationaleIncorrect: [
      { letter: "B", rationale: "Increasing the IV rate worsens pulmonary edema significantly." },
    ],
    rationaleCorrect: "These interventions address oxygenation and fluid balance.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(sixOpts);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.options.length, 6);
});

test("SATA with 7 options (>6) → rejected with options_too_many", () => {
  const sevenOpts: AdminOptionInput = {
    examItemKind: "SATA",
    answerOptions: Array.from({ length: 7 }, (_, i) => ({
      letter: String.fromCharCode(65 + i),
      text: `Option ${i + 1} with enough text`,
    })),
    correctLetters: ["A", "B"],
    rationaleIncorrect: Array.from({ length: 5 }, (_, i) => ({
      letter: String.fromCharCode(67 + i),
      rationale: "This option is incorrect because it does not address the primary concern.",
    })),
    rationaleCorrect: "A and B are correct.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(sevenOpts);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "options_too_many");
});

// ── Rejection: option key validation ─────────────────────────────────────────

test("invalid option key (number) → rejected with option_key_invalid", () => {
  const badKey: AdminOptionInput = {
    ...MCQ_BASE,
    answerOptions: [
      { letter: "1", text: "Option one" },
      { letter: "B", text: "Option B" },
      { letter: "C", text: "Option C" },
      { letter: "D", text: "Option D" },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(badKey);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "option_key_invalid");
});

test("duplicate option keys → rejected with options_duplicate_keys", () => {
  const dupKeys: AdminOptionInput = {
    ...MCQ_BASE,
    answerOptions: [
      { letter: "A", text: "Option A first" },
      { letter: "A", text: "Option A second" },
      { letter: "C", text: "Option C" },
      { letter: "D", text: "Option D" },
    ],
  };
  const result = buildCanonicalOptionsFromAdminPayload(dupKeys);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "options_duplicate_keys");
});

test("correct letter not in answerOptions → rejected with correct_letter_not_in_options", () => {
  const mismatch: AdminOptionInput = {
    ...MCQ_BASE,
    correctAnswer: "E", // E is not in answerOptions
  };
  const result = buildCanonicalOptionsFromAdminPayload(mismatch);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "correct_letter_not_in_options");
});

// ── Legacy JSON fallback: CanonicalOption[] absent → JSON still readable ──────
// The fallback path is handled by hydrateFlashcardOptions in flashcard-option-hydrate.server.ts.
// We verify the normalizer can reconstruct options from JSON when no canonical rows are present.

test("legacy fallback: normalizeLegacyAnswerPayload round-trips MCQ JSON", async () => {
  const { normalizeLegacyAnswerPayload } = await import("./flashcard-option-normalize");
  const result = normalizeLegacyAnswerPayload({
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress" },
    ],
    correctAnswer: "B",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing delays removal." },
      { letter: "C", rationale: "Heat may mask injury." },
    ],
  });
  assert.ok(result, "normalizeLegacyAnswerPayload should return options for valid JSON");
  assert.equal(result!.length, 3);
  const correct = result!.find((o) => o.optionKey === "B");
  assert.equal(correct?.isCorrect, true);
});

test("legacy fallback: normalizeLegacyAnswerPayload handles SATA comma-separated correctAnswer", async () => {
  const { normalizeLegacyAnswerPayload } = await import("./flashcard-option-normalize");
  const result = normalizeLegacyAnswerPayload({
    answerOptions: [
      { letter: "A", text: "High-Fowler position" },
      { letter: "B", text: "Increase oral fluids" },
      { letter: "C", text: "Administer O2" },
      { letter: "D", text: "Decrease IV rate" },
    ],
    correctAnswer: "A,C,D",
    rationaleIncorrect: [
      { letter: "B", rationale: "Oral fluids are contraindicated in fluid overload." },
    ],
  });
  assert.ok(result);
  const correctKeys = result!.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  assert.deepEqual(correctKeys, ["A", "C", "D"]);
});

test("legacy fallback: returns null for null answerOptions (no options → source=none)", async () => {
  const { normalizeLegacyAnswerPayload } = await import("./flashcard-option-normalize");
  const result = normalizeLegacyAnswerPayload({
    answerOptions: null,
    correctAnswer: "A",
    rationaleIncorrect: null,
  });
  assert.equal(result, null);
});

// ── buildSataBackField ────────────────────────────────────────────────────────

test("buildSataBackField: formats correct letters and rationale", () => {
  const back = buildSataBackField(["C", "A", "D"], "These address oxygenation and fluid balance.");
  assert.equal(back, "Correct: A, C, D — These address oxygenation and fluid balance.");
});

test("buildSataBackField: sorts letters before joining", () => {
  const back = buildSataBackField(["E", "B", "A"], "Multiple interventions needed.");
  assert.ok(back.startsWith("Correct: A, B, E"));
});

test("buildSataBackField: empty rationale omits the dash separator", () => {
  const back = buildSataBackField(["A", "C"], "");
  assert.equal(back, "Correct: A, C");
});

// ── PATCH replace semantics ───────────────────────────────────────────────────
// These tests verify that buildCanonicalOptionsFromAdminPayload produces the
// correct set of canonical options for a PATCH payload, covering the properties
// that replaceCanonicalOptions (deleteMany + createMany) relies on.

test("PATCH replace: rebuilding with fewer options removes orphaned keys", () => {
  // Card was originally A/B/C/D; PATCH sends only A/B/C
  const threeCurrent: AdminOptionInput = {
    examItemKind: "CLINICAL",
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress" },
    ],
    correctAnswer: "B",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of the irritant." },
      { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
    ],
    rationaleCorrect: "Stopping is the immediate safety priority.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(threeCurrent);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  // D must not appear — only A/B/C
  const keys = result.options.map((o) => o.optionKey);
  assert.deepEqual(keys, ["A", "B", "C"]);
  assert.equal(result.options.some((o) => o.optionKey === "D"), false);
});

test("PATCH replace: isCorrect flips when correctAnswer changes", () => {
  // Card was correct=B; PATCH changes to correct=A
  const flipped: AdminOptionInput = {
    ...MCQ_BASE,
    correctAnswer: "A",
    rationaleIncorrect: [
      { letter: "B", rationale: "Stopping has higher priority than slowing." },
      { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
      { letter: "D", rationale: "Flushing can worsen tissue injury." },
    ],
    rationaleCorrect: "Slowing first is appropriate for minor extravasation.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(flipped);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const optA = result.options.find((o) => o.optionKey === "A");
  const optB = result.options.find((o) => o.optionKey === "B");
  assert.equal(optA?.isCorrect, true);
  assert.equal(optB?.isCorrect, false);
});

test("PATCH replace: displayOrder follows new answerOptions array order", () => {
  // Reorder: B first, then A, C, D
  const reordered: AdminOptionInput = {
    examItemKind: "CLINICAL",
    answerOptions: [
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "C", text: "Apply a warm compress" },
      { letter: "D", text: "Flush with normal saline" },
    ],
    correctAnswer: "B",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of the irritant." },
      { letter: "C", rationale: "Heat may mask worsening infiltration damage." },
      { letter: "D", rationale: "Flushing can worsen tissue injury on infiltration." },
    ],
    rationaleCorrect: "Stopping is the immediate safety priority.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(reordered);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  // B is now at position 0
  assert.equal(result.options[0]!.optionKey, "B");
  assert.equal(result.options[0]!.displayOrder, 0);
  assert.equal(result.options[1]!.optionKey, "A");
  assert.equal(result.options[1]!.displayOrder, 1);
});

test("PATCH replace: SATA correct letters updated when correctLetters changes", () => {
  // Was A/C/D/E correct; PATCH changes to A/C only
  const narrowed: AdminOptionInput = {
    examItemKind: "SATA",
    answerOptions: SATA_BASE.answerOptions,
    correctLetters: ["A", "C"],
    rationaleIncorrect: [
      { letter: "B", rationale: "Increasing IV rate worsens fluid overload." },
      { letter: "D", rationale: "Decreasing IV rate benefits oxygenation but is not the priority here." },
      { letter: "E", rationale: "Monitoring alone is insufficient without active intervention." },
    ],
    rationaleCorrect: "A and C are the highest-priority interventions.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(narrowed);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const correctKeys = result.options.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  assert.deepEqual(correctKeys, ["A", "C"]);
  // D and E must now be wrong
  const optD = result.options.find((o) => o.optionKey === "D");
  assert.equal(optD?.isCorrect, false);
});

test("PATCH replace: no orphaned FlashcardOption rows — output contains exactly the new keys", () => {
  // All 4 options present, but after replacing only 3 will exist
  const threeOut: AdminOptionInput = {
    examItemKind: "RECALL",
    answerOptions: [
      { letter: "A", text: "Tachycardia" },
      { letter: "B", text: "Bradycardia" },
      { letter: "C", text: "Hypotension" },
    ],
    correctAnswer: "A",
    rationaleIncorrect: [
      { letter: "B", rationale: "Bradycardia is not the expected beta-agonist response." },
      { letter: "C", rationale: "Beta-agonists raise, not lower, blood pressure." },
    ],
    rationaleCorrect: "Beta-agonists stimulate the SA node, producing tachycardia.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(threeOut);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  // replaceCanonicalOptions will deleteMany first, so output must not contain D
  assert.equal(result.options.length, 3);
  const keys = result.options.map((o) => o.optionKey).sort();
  assert.deepEqual(keys, ["A", "B", "C"]);
});

// ── Transaction safety (pure-helper guarantee) ─────────────────────────────────
// buildCanonicalOptionsFromAdminPayload is a pure synchronous function — it either
// returns { ok: true, options } or { ok: false, error }. There is no partial success:
// callers that receive { ok: false } must never call writeCanonicalOptions or
// replaceCanonicalOptions, so no DB rows are ever written on validation failure.
// The transaction atomicity guarantee therefore rests entirely on the DB layer
// (replaceCanonicalOptions wraps deleteMany + createMany in the caller's tx).

test("transaction safety: invalid payload returns ok=false without side effects", () => {
  // Simulate a bad SATA payload — only 1 correct answer
  const badPayload: AdminOptionInput = {
    examItemKind: "SATA",
    answerOptions: SATA_BASE.answerOptions,
    correctLetters: ["A"], // Only 1 → should be rejected before any DB call
    rationaleIncorrect: [
      { letter: "B", rationale: "Increasing IV rate worsens fluid overload." },
      { letter: "C", rationale: "O2 is correct." },
      { letter: "D", rationale: "Decreasing IV rate is correct." },
      { letter: "E", rationale: "Monitoring is correct." },
    ],
    rationaleCorrect: "A is the only correct one.",
  };
  const result = buildCanonicalOptionsFromAdminPayload(badPayload);
  // Must fail before returning canonical options — caller must not write anything
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "sata_single_correct");
  // Confirm no options property on the failure result (type narrowing)
  assert.equal("options" in result, false);
});

test("transaction safety: MCQ multiple-correct fails before producing options", () => {
  const multiCorrect: AdminOptionInput = {
    ...MCQ_BASE,
    correctLetters: ["A", "B"],
  };
  const result = buildCanonicalOptionsFromAdminPayload(multiCorrect);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "mcq_multiple_correct");
  assert.equal("options" in result, false);
});

// ── detectOptionInputConflict ─────────────────────────────────────────────────

test("conflict: both correctLetters and correctAnswer present → returns conflict object", () => {
  const conflict = detectOptionInputConflict(["A", "C"], "A,C,D");
  assert.ok(conflict, "Should detect a conflict");
  assert.equal(conflict!.event, "FLASHCARD_OPTION_INPUT_CONFLICT");
  assert.deepEqual(conflict!.fields, ["correctLetters", "correctAnswer"]);
  assert.equal(conflict!.resolution, "correctLetters_priority");
  assert.ok(conflict!.detail.includes("correctLetters"));
});

test("conflict: only correctLetters present → no conflict", () => {
  const conflict = detectOptionInputConflict(["A", "C"], null);
  assert.equal(conflict, null);
});

test("conflict: only correctAnswer present → no conflict", () => {
  const conflict = detectOptionInputConflict(null, "B");
  assert.equal(conflict, null);
});

test("conflict: both absent → no conflict", () => {
  const conflict = detectOptionInputConflict(null, null);
  assert.equal(conflict, null);
});

test("conflict: empty correctLetters array → no conflict (empty array is treated as absent)", () => {
  const conflict = detectOptionInputConflict([], "B");
  assert.equal(conflict, null);
});
