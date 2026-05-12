/**
 * Tests for canonical answer-option normalization and validation.
 *
 * Coverage:
 *   normalizeLegacyAnswerPayload — JSON → CanonicalOption[]
 *   validateCanonicalOptions     — MCQ / SATA structural rules
 *   buildMcqPayloadFromCanonical — MCQ payload builder
 *   buildSataPayloadFromCanonical — SATA payload builder
 *   buildPayloadFromCanonical    — auto-detect MCQ vs SATA
 *   fromDbRows                   — DB row → sorted CanonicalOption[]
 *   toCreateManyData             — canonical → Prisma create-many input
 *   backward compatibility       — legacy cards with JSON only still resolve
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeLegacyAnswerPayload,
  validateCanonicalOptions,
  buildMcqPayloadFromCanonical,
  buildSataPayloadFromCanonical,
  buildPayloadFromCanonical,
  fromDbRows,
  toCreateManyData,
  type CanonicalOption,
  type FlashcardOptionRow,
} from "@/lib/flashcards/flashcard-option-normalize";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const MCQ_OPTIONS_JSON = [
  { letter: "A", text: "Assess airway first" },
  { letter: "B", text: "Administer oxygen" },
  { letter: "C", text: "Call the physician" },
];

const MCQ_RATIONALE_JSON = [
  { letter: "B", rationale: "Oxygen is secondary to airway assessment." },
  { letter: "C", rationale: "Calling physician is lower priority than direct assessment." },
];

const SATA_OPTIONS_JSON = [
  { letter: "A", text: "Assess airway patency" },
  { letter: "B", text: "Administer oxygen as ordered" },
  { letter: "C", text: "Ignore the monitor alarm" },
  { letter: "D", text: "Position client upright" },
];

const SATA_RATIONALE_JSON = [
  { letter: "C", rationale: "Ignoring an alarm is unsafe and a safety violation." },
];

function makeOption(overrides: Partial<CanonicalOption> & { optionKey: string; content: string }): CanonicalOption {
  return {
    isCorrect: false,
    rationale: null,
    displayOrder: 0,
    ...overrides,
  };
}

// ── normalizeLegacyAnswerPayload ──────────────────────────────────────────────

test("normalize: valid MCQ JSON → 3 canonical options", () => {
  const result = normalizeLegacyAnswerPayload({
    answerOptions: MCQ_OPTIONS_JSON,
    correctAnswer: "A",
    rationaleIncorrect: MCQ_RATIONALE_JSON,
  });
  assert.ok(result, "should return options array");
  assert.equal(result!.length, 3);
  assert.ok(result!.find((o) => o.optionKey === "A")?.isCorrect);
  assert.ok(!result!.find((o) => o.optionKey === "B")?.isCorrect);
  assert.equal(result!.find((o) => o.optionKey === "B")?.rationale, "Oxygen is secondary to airway assessment.");
});

test("normalize: null answerOptions → null", () => {
  assert.equal(normalizeLegacyAnswerPayload({ answerOptions: null, correctAnswer: "A", rationaleIncorrect: null }), null);
});

test("normalize: empty array → null", () => {
  assert.equal(normalizeLegacyAnswerPayload({ answerOptions: [], correctAnswer: "A", rationaleIncorrect: null }), null);
});

test("normalize: fewer than 3 options → null", () => {
  assert.equal(
    normalizeLegacyAnswerPayload({
      answerOptions: [{ letter: "A", text: "Option A" }, { letter: "B", text: "Option B" }],
      correctAnswer: "A",
      rationaleIncorrect: null,
    }),
    null,
  );
});

test("normalize: correctAnswer as comma-delimited SATA string → multiple correct", () => {
  const result = normalizeLegacyAnswerPayload({
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,B,D",
    rationaleIncorrect: SATA_RATIONALE_JSON,
  });
  assert.ok(result);
  const correctKeys = result!.filter((o) => o.isCorrect).map((o) => o.optionKey);
  assert.deepEqual(correctKeys.sort(), ["A", "B", "D"]);
  assert.ok(!result!.find((o) => o.optionKey === "C")?.isCorrect);
});

test("normalize: correctAnswer as JSON array string → multiple correct", () => {
  const result = normalizeLegacyAnswerPayload({
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: '["A","D"]',
    rationaleIncorrect: SATA_RATIONALE_JSON,
  });
  assert.ok(result);
  const correctKeys = result!.filter((o) => o.isCorrect).map((o) => o.optionKey);
  assert.deepEqual(correctKeys.sort(), ["A", "D"]);
});

test("normalize: missing correctAnswer → null", () => {
  assert.equal(
    normalizeLegacyAnswerPayload({
      answerOptions: MCQ_OPTIONS_JSON,
      correctAnswer: null,
      rationaleIncorrect: null,
    }),
    null,
  );
});

test("normalize: displayOrder is set by option position in JSON array", () => {
  const result = normalizeLegacyAnswerPayload({
    answerOptions: MCQ_OPTIONS_JSON,
    correctAnswer: "A",
    rationaleIncorrect: null,
  });
  assert.ok(result);
  assert.equal(result!.find((o) => o.optionKey === "A")?.displayOrder, 0);
  assert.equal(result!.find((o) => o.optionKey === "B")?.displayOrder, 1);
  assert.equal(result!.find((o) => o.optionKey === "C")?.displayOrder, 2);
});

// ── validateCanonicalOptions ──────────────────────────────────────────────────

test("validate: valid MCQ (3 options, 1 correct) → ok=true, cardKind=MCQ", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "First action", isCorrect: true }),
    makeOption({ optionKey: "B", content: "Second action", rationale: "Not the highest priority because stable." }),
    makeOption({ optionKey: "C", content: "Third action", rationale: "Lower urgency than the primary concern." }),
  ];
  const result = validateCanonicalOptions(options);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.cardKind, "MCQ");
});

test("validate: valid SATA (4 options, 2 correct) → ok=true, cardKind=SATA", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Assess airway", isCorrect: true }),
    makeOption({ optionKey: "B", content: "Position upright", isCorrect: true }),
    makeOption({ optionKey: "C", content: "Ignore alarm", rationale: "Ignoring alarms is unsafe and violates safety protocol." }),
    makeOption({ optionKey: "D", content: "Wait and see", rationale: "Delayed intervention risks patient deterioration." }),
  ];
  const result = validateCanonicalOptions(options);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.cardKind, "SATA");
});

test("validate: fewer than 3 options → error options_too_few", () => {
  const result = validateCanonicalOptions([
    makeOption({ optionKey: "A", content: "Option A", isCorrect: true }),
    makeOption({ optionKey: "B", content: "Option B", rationale: "Not correct because it misses key criteria." }),
  ]);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.code, /too_few/);
});

test("validate: zero correct options → error options_no_correct", () => {
  const result = validateCanonicalOptions([
    makeOption({ optionKey: "A", content: "Option A", rationale: "Wrong because it lacks supporting evidence." }),
    makeOption({ optionKey: "B", content: "Option B", rationale: "Wrong because it contradicts clinical guidelines." }),
    makeOption({ optionKey: "C", content: "Option C", rationale: "Wrong because it is unsafe in this context." }),
  ]);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.code, /no_correct/);
});

test("validate: duplicate option keys → error duplicate_keys", () => {
  const result = validateCanonicalOptions([
    makeOption({ optionKey: "A", content: "A", isCorrect: true }),
    makeOption({ optionKey: "A", content: "A duplicate", rationale: "Not correct because repeated option key." }),
    makeOption({ optionKey: "B", content: "B", rationale: "Not correct because lower priority." }),
  ]);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.code, /duplicate/);
});

test("validate: wrong option with short rationale → error", () => {
  const result = validateCanonicalOptions([
    makeOption({ optionKey: "A", content: "Option A", isCorrect: true }),
    makeOption({ optionKey: "B", content: "Option B", rationale: "Wrong" }), // rationale too short
    makeOption({ optionKey: "C", content: "Option C", rationale: "Incorrect because it contradicts standard of care guidelines." }),
  ]);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.code, /rationale_too_short/);
});

test("validate: MCQ with 5 options (>4) → mcq_options_too_many", () => {
  const options: CanonicalOption[] = ["A", "B", "C", "D", "E"].map((k) =>
    makeOption({
      optionKey: k,
      content: `Option ${k}`,
      isCorrect: k === "A",
      rationale: k !== "A" ? "Not the best choice because lower priority and less safe." : null,
    }),
  );
  const result = validateCanonicalOptions(options);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.code, /too_many/);
});

// ── buildMcqPayloadFromCanonical ─────────────────────────────────────────────

test("buildMcqPayload: valid MCQ options → ExamMicroQuestionPayload with correct letter", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Assess airway", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "Call physician", isCorrect: false, rationale: "Lower priority than direct assessment.", displayOrder: 1 }),
    makeOption({ optionKey: "C", content: "Administer oxygen", isCorrect: false, rationale: "Secondary to airway patency verification.", displayOrder: 2 }),
  ];
  const result = buildMcqPayloadFromCanonical(
    "Which action should the nurse take first for a client in respiratory distress?",
    "Airway assessment is the nursing priority because oxygenation depends on patency.",
    options,
    "CLINICAL",
  );
  assert.ok(result, "should return payload");
  assert.equal(result!.correctLetter, "A");
  assert.equal(result!.rationaleIncorrect.length, 2);
  assert.equal(result!.itemKind, "CLINICAL");
});

test("buildMcqPayload: multiple correct → null (not MCQ)", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "A", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "B", isCorrect: true, displayOrder: 1 }),
    makeOption({ optionKey: "C", content: "C", isCorrect: false, rationale: "Not relevant to the priority action.", displayOrder: 2 }),
  ];
  assert.equal(
    buildMcqPayloadFromCanonical("Stem", "Rationale here enough chars.", options, "SATA"),
    null,
  );
});

// ── buildSataPayloadFromCanonical ────────────────────────────────────────────

test("buildSataPayload: 2 correct options → SataQuestionPayload with correctLetters", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Assess airway", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "Administer oxygen", isCorrect: true, displayOrder: 1 }),
    makeOption({ optionKey: "C", content: "Ignore the alarm", isCorrect: false, rationale: "Ignoring alarms is a safety violation in all clinical settings.", displayOrder: 2 }),
  ];
  const result = buildSataPayloadFromCanonical(
    "Select all nursing actions that are appropriate for a client in respiratory distress.",
    "Both airway assessment and supplemental oxygen are immediate nursing priorities.",
    options,
  );
  assert.ok(result, "should return SATA payload");
  assert.equal(result!.itemKind, "SATA");
  assert.deepEqual(result!.correctLetters, ["A", "B"]);
  assert.equal(result!.rationaleByLetter.length, 3);
  assert.ok(result!.rationaleByLetter.find((r) => r.letter === "A")?.correct);
  assert.ok(!result!.rationaleByLetter.find((r) => r.letter === "C")?.correct);
});

test("buildSataPayload: zero correct → null", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "A", isCorrect: false, rationale: "Not the right choice here." }),
    makeOption({ optionKey: "B", content: "B", isCorrect: false, rationale: "Not applicable in this scenario." }),
    makeOption({ optionKey: "C", content: "C", isCorrect: false, rationale: "Contradicts clinical guidelines." }),
  ];
  assert.equal(buildSataPayloadFromCanonical("Stem", "Rationale", options), null);
});

// ── buildPayloadFromCanonical (auto-detect) ───────────────────────────────────

test("buildPayload: 1 correct → MCQ payload", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Correct action", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "Wrong 1", isCorrect: false, rationale: "Lower priority than option A.", displayOrder: 1 }),
    makeOption({ optionKey: "C", content: "Wrong 2", isCorrect: false, rationale: "Unsafe in this clinical context.", displayOrder: 2 }),
  ];
  const result = buildPayloadFromCanonical(
    "Which is the priority nursing action?",
    "Option A is correct because safety is the highest priority.",
    options,
    "PRIORITY",
  );
  assert.ok(result);
  assert.ok("correctLetter" in result!, "should be MCQ payload (has correctLetter)");
});

test("buildPayload: 2 correct → SATA payload", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Correct 1", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "Correct 2", isCorrect: true, displayOrder: 1 }),
    makeOption({ optionKey: "C", content: "Wrong", isCorrect: false, rationale: "Not appropriate for this clinical situation.", displayOrder: 2 }),
  ];
  const result = buildPayloadFromCanonical(
    "Select all appropriate nursing actions.",
    "Both A and B are evidence-based priorities.",
    options,
    "SATA",
  );
  assert.ok(result);
  assert.ok("correctLetters" in result!, "should be SATA payload (has correctLetters)");
});

// ── fromDbRows ────────────────────────────────────────────────────────────────

test("fromDbRows: sorts by displayOrder", () => {
  const rows: FlashcardOptionRow[] = [
    { id: "3", optionKey: "C", content: "C", isCorrect: false, rationale: null, displayOrder: 2, selectCount: 0, correctSelectCount: 0 },
    { id: "1", optionKey: "A", content: "A", isCorrect: true, rationale: null, displayOrder: 0, selectCount: 0, correctSelectCount: 0 },
    { id: "2", optionKey: "B", content: "B", isCorrect: false, rationale: "Why B is wrong.", displayOrder: 1, selectCount: 0, correctSelectCount: 0 },
  ];
  const result = fromDbRows(rows);
  assert.deepEqual(result.map((r) => r.optionKey), ["A", "B", "C"]);
});

// ── toCreateManyData ──────────────────────────────────────────────────────────

test("toCreateManyData: maps canonical options to Prisma input", () => {
  const options: CanonicalOption[] = [
    makeOption({ optionKey: "A", content: "Option A", isCorrect: true, displayOrder: 0 }),
    makeOption({ optionKey: "B", content: "Option B", isCorrect: false, rationale: "Reason B is wrong.", displayOrder: 1 }),
  ];
  const data = toCreateManyData("card-123", options);
  assert.equal(data.length, 2);
  assert.equal(data[0]!.flashcardId, "card-123");
  assert.equal(data[0]!.optionKey, "A");
  assert.equal(data[0]!.isCorrect, true);
  assert.equal(data[1]!.rationale, "Reason B is wrong.");
});

// ── Backward compatibility: JSON-only path ────────────────────────────────────

test("backward compat: card with canonicalOptions=[] still resolves via JSON", () => {
  // Simulates a legacy card where canonicalOptions array is empty/absent
  const canonicalOptions: CanonicalOption[] = [];

  // When canonicalOptions is empty, caller should fall back to JSON normalization
  const result = normalizeLegacyAnswerPayload({
    answerOptions: MCQ_OPTIONS_JSON,
    correctAnswer: "A",
    rationaleIncorrect: MCQ_RATIONALE_JSON,
  });
  assert.ok(result, "JSON fallback must still produce options for legacy cards");
  assert.equal(result!.length, 3);
  assert.ok(canonicalOptions.length === 0, "canonical array is empty — confirming fallback scenario");
});

test("backward compat: well-formed JSON with SATA correct letters string produces correct result", () => {
  // Simulates content that was authored before canonical table existed
  const result = normalizeLegacyAnswerPayload({
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,B,D",
    rationaleIncorrect: [
      { letter: "C", rationale: "Ignoring alarms is always inappropriate and unsafe in clinical care." },
    ],
  });
  assert.ok(result);
  const sataPayload = buildSataPayloadFromCanonical(
    "Select all appropriate nursing interventions for the client.",
    "Options A, B, and D reflect evidence-based priorities.",
    result!,
  );
  assert.ok(sataPayload, "should build SATA payload from JSON-normalized options");
  assert.deepEqual(sataPayload!.correctLetters, ["A", "B", "D"]);
});
