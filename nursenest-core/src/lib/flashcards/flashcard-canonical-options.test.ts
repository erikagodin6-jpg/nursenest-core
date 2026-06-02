import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateCanonicalOptions,
  normalizeLegacyAnswerPayload,
  hydrateCanonicalMcq,
  hydrateCanonicalSata,
  resolvePayloadFromCanonicalOptions,
  mcqPayloadToCanonicalOptions,
  sataPayloadToCanonicalOptions,
  assignStandardLetters,
  type CanonicalOption,
} from "./flashcard-canonical-options";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MCQ_OPTIONS: CanonicalOption[] = [
  { optionKey: "A", content: "Slow the infusion", isCorrect: false, rationale: "Slowing delays removal.", displayOrder: 0 },
  { optionKey: "B", content: "Stop and assess", isCorrect: true, rationale: "Stopping is the safety priority.", displayOrder: 1 },
  { optionKey: "C", content: "Apply warm compress", isCorrect: false, rationale: "May mask worsening.", displayOrder: 2 },
  { optionKey: "D", content: "Flush with NS", isCorrect: false, rationale: "Can worsen infiltration.", displayOrder: 3 },
];

const SATA_OPTIONS: CanonicalOption[] = [
  { optionKey: "A", content: "High-Fowler position", isCorrect: true, rationale: "Improves oxygenation.", displayOrder: 0 },
  { optionKey: "B", content: "Increase oral fluids", isCorrect: false, rationale: "Contraindicated in pulmonary edema.", displayOrder: 1 },
  { optionKey: "C", content: "Administer O2", isCorrect: true, rationale: "Treats hypoxia.", displayOrder: 2 },
  { optionKey: "D", content: "Decrease IV rate", isCorrect: true, rationale: "Reduces fluid overload.", displayOrder: 3 },
  { optionKey: "E", content: "Monitor lung sounds", isCorrect: true, rationale: "Detects response to interventions.", displayOrder: 4 },
];

// ─── validateCanonicalOptions ─────────────────────────────────────────────────

describe("validateCanonicalOptions — MCQ", () => {
  it("accepts valid 4-option MCQ", () => {
    const r = validateCanonicalOptions("CLINICAL", MCQ_OPTIONS);
    assert.equal(r.ok, true);
  });

  it("accepts valid 3-option MCQ", () => {
    const r = validateCanonicalOptions("RECALL", MCQ_OPTIONS.slice(0, 3));
    assert.equal(r.ok, true);
  });

  it("rejects 0 options", () => {
    const r = validateCanonicalOptions("CLINICAL", []);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "no_options");
  });

  it("rejects duplicate option keys", () => {
    const duped: CanonicalOption[] = [
      ...MCQ_OPTIONS.slice(0, 3),
      { ...MCQ_OPTIONS[0], optionKey: "A" },
    ];
    const r = validateCanonicalOptions("CLINICAL", duped);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "duplicate_option_keys");
  });

  it("rejects MCQ with 0 correct options", () => {
    const none = MCQ_OPTIONS.map((o) => ({ ...o, isCorrect: false }));
    const r = validateCanonicalOptions("CLINICAL", none);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "mcq_no_correct");
  });

  it("rejects MCQ with 2 correct options", () => {
    const two: CanonicalOption[] = [
      { ...MCQ_OPTIONS[0], isCorrect: true },
      { ...MCQ_OPTIONS[1], isCorrect: true },
      { ...MCQ_OPTIONS[2], isCorrect: false },
      { ...MCQ_OPTIONS[3], isCorrect: false },
    ];
    const r = validateCanonicalOptions("CLINICAL", two);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "mcq_multiple_correct");
  });

  it("rejects MCQ with 2-option count (below min)", () => {
    const r = validateCanonicalOptions("RECALL", MCQ_OPTIONS.slice(0, 2));
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "option_count_out_of_range");
  });

  it("rejects invalid option key", () => {
    const bad: CanonicalOption[] = [
      { ...MCQ_OPTIONS[0], optionKey: "1" },
      ...MCQ_OPTIONS.slice(1),
    ];
    const r = validateCanonicalOptions("CLINICAL", bad);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "option_key_invalid");
  });

  it("rejects empty content", () => {
    const empty: CanonicalOption[] = [
      { ...MCQ_OPTIONS[0], content: "  " },
      ...MCQ_OPTIONS.slice(1),
    ];
    const r = validateCanonicalOptions("CLINICAL", empty);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "option_content_empty");
  });
});

describe("validateCanonicalOptions — SATA", () => {
  it("accepts valid SATA with 4 correct of 5", () => {
    const r = validateCanonicalOptions("SATA", SATA_OPTIONS);
    assert.equal(r.ok, true);
  });

  it("accepts SATA with exactly 2 correct", () => {
    const two = SATA_OPTIONS.map((o, i) => ({ ...o, isCorrect: i < 2 }));
    const r = validateCanonicalOptions("SATA", two);
    assert.equal(r.ok, true);
  });

  it("rejects SATA with only 1 correct option", () => {
    const one = SATA_OPTIONS.map((o, i) => ({ ...o, isCorrect: i === 0 }));
    const r = validateCanonicalOptions("SATA", one);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "sata_insufficient_correct");
  });

  it("rejects SATA with 0 correct options", () => {
    const none = SATA_OPTIONS.map((o) => ({ ...o, isCorrect: false }));
    const r = validateCanonicalOptions("SATA", none);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "sata_insufficient_correct");
  });

  it("rejects SATA with more than 10 options", () => {
    const many: CanonicalOption[] = Array.from({ length: 11 }, (_, i) => ({
      optionKey: String.fromCharCode(65 + i),
      content: `Option ${i}`,
      isCorrect: i < 3,
      rationale: null,
      displayOrder: i,
    }));
    const r = validateCanonicalOptions("SATA", many);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.code, "sata_too_many_options");
  });
});

// ─── normalizeLegacyAnswerPayload ─────────────────────────────────────────────

describe("normalizeLegacyAnswerPayload", () => {
  it("normalizes valid MCQ legacy fields", () => {
    const result = normalizeLegacyAnswerPayload({
      examItemKind: "CLINICAL",
      answerOptions: [
        { letter: "A", text: "Slow the infusion" },
        { letter: "B", text: "Stop and assess" },
        { letter: "C", text: "Warm compress" },
      ],
      correctAnswer: "B",
      rationaleCorrect: "Stopping is the safety priority.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Delays intervention." },
        { letter: "C", rationale: "Masks injury." },
      ],
    });
    assert.ok(result);
    assert.equal(result!.length, 3);
    const correct = result!.find((o) => o.optionKey === "B");
    assert.equal(correct?.isCorrect, true);
    assert.equal(correct?.rationale, "Stopping is the safety priority.");
    const wrong = result!.find((o) => o.optionKey === "A");
    assert.equal(wrong?.isCorrect, false);
    assert.equal(wrong?.rationale, "Delays intervention.");
  });

  it("normalizes SATA with comma-separated correctAnswer", () => {
    const result = normalizeLegacyAnswerPayload({
      examItemKind: "SATA",
      answerOptions: [
        { letter: "A", text: "High-Fowler" },
        { letter: "B", text: "Increase fluids" },
        { letter: "C", text: "Administer O2" },
        { letter: "D", text: "Decrease IV rate" },
      ],
      correctAnswer: "A,C,D",
      rationaleCorrect: "These interventions manage pulmonary edema.",
      rationaleIncorrect: [
        { letter: "B", rationale: "Contraindicated in fluid overload." },
      ],
    });
    assert.ok(result);
    const correct = result!.filter((o) => o.isCorrect).map((o) => o.optionKey);
    assert.deepEqual(correct.sort(), ["A", "C", "D"]);
    const wrong = result!.find((o) => o.optionKey === "B");
    assert.equal(wrong?.isCorrect, false);
    assert.equal(wrong?.rationale, "Contraindicated in fluid overload.");
  });

  it("returns null for fewer than 3 options", () => {
    const result = normalizeLegacyAnswerPayload({
      examItemKind: "CLINICAL",
      answerOptions: [{ letter: "A", text: "Only option" }],
      correctAnswer: "A",
      rationaleCorrect: "Reason.",
      rationaleIncorrect: null,
    });
    assert.equal(result, null);
  });

  it("returns null for null answerOptions", () => {
    const result = normalizeLegacyAnswerPayload({
      examItemKind: "CLINICAL",
      answerOptions: null,
      correctAnswer: "A",
      rationaleCorrect: "Reason.",
      rationaleIncorrect: null,
    });
    assert.equal(result, null);
  });

  it("returns null for malformed option objects", () => {
    const result = normalizeLegacyAnswerPayload({
      examItemKind: "CLINICAL",
      answerOptions: [{ bad: "data" }, { letter: "B", text: "ok" }, { letter: "C", text: "ok" }],
      correctAnswer: "B",
      rationaleCorrect: "ok",
      rationaleIncorrect: null,
    });
    assert.equal(result, null);
  });
});

// ─── hydrateCanonicalMcq ─────────────────────────────────────────────────────

describe("hydrateCanonicalMcq", () => {
  const STEM = "Which action should the nurse take first for suspected IV infiltration?";

  it("returns a valid ExamMicroQuestionPayload", () => {
    const payload = hydrateCanonicalMcq(STEM, "CLINICAL", MCQ_OPTIONS, null);
    assert.ok(payload);
    assert.equal(payload!.correctLetter, "B");
    assert.equal(payload!.itemKind, "CLINICAL");
    assert.equal(payload!.answerOptions.length, 4);
    assert.equal(payload!.rationaleIncorrect.length, 3);
  });

  it("falls back to card-level rationaleCorrect when per-option rationale is null", () => {
    const stripped = MCQ_OPTIONS.map((o) => ({ ...o, rationale: o.isCorrect ? null : o.rationale }));
    const payload = hydrateCanonicalMcq(STEM, "CLINICAL", stripped, "Card-level rationale.");
    assert.equal(payload!.rationaleCorrect, "Card-level rationale.");
  });

  it("returns null for a short stem", () => {
    const payload = hydrateCanonicalMcq("Short", "CLINICAL", MCQ_OPTIONS, null);
    assert.equal(payload, null);
  });

  it("returns null when no correct option exists", () => {
    const none = MCQ_OPTIONS.map((o) => ({ ...o, isCorrect: false }));
    const payload = hydrateCanonicalMcq(STEM, "CLINICAL", none, null);
    assert.equal(payload, null);
  });
});

// ─── hydrateCanonicalSata ────────────────────────────────────────────────────

describe("hydrateCanonicalSata", () => {
  const STEM = "A nurse is caring for a client with acute pulmonary edema. Which interventions should the nurse implement?";

  it("returns a valid SataQuestionPayload", () => {
    const payload = hydrateCanonicalSata(STEM, SATA_OPTIONS, "These address oxygenation and fluid overload.");
    assert.ok(payload);
    assert.equal(payload!.itemKind, "SATA");
    assert.deepEqual(payload!.correctLetters.sort(), ["A", "C", "D", "E"]);
    assert.equal(payload!.answerOptions.length, 5);
    assert.equal(payload!.rationaleByLetter.length, 5);
  });

  it("rationaleByLetter correctly marks correct vs incorrect", () => {
    const payload = hydrateCanonicalSata(STEM, SATA_OPTIONS, "Shared rationale.");
    const byLetter = new Map(payload!.rationaleByLetter.map((r) => [r.letter, r]));
    assert.equal(byLetter.get("A")?.correct, true);
    assert.equal(byLetter.get("B")?.correct, false);
    assert.equal(byLetter.get("C")?.correct, true);
  });

  it("returns null when fewer than 2 correct options", () => {
    const one = SATA_OPTIONS.map((o, i) => ({ ...o, isCorrect: i === 0 }));
    const payload = hydrateCanonicalSata(STEM, one, null);
    assert.equal(payload, null);
  });

  it("returns null for short stem (< 8 chars)", () => {
    // "Too short" is 9 chars and passes the guard; use a stem that is genuinely < 8 chars.
    const payload = hydrateCanonicalSata("Short", SATA_OPTIONS, null);
    assert.equal(payload, null);
  });
});

// ─── resolvePayloadFromCanonicalOptions ──────────────────────────────────────

describe("resolvePayloadFromCanonicalOptions", () => {
  const MCQ_STEM = "Which client should the nurse assess first?";
  const SATA_STEM = "A client with pulmonary edema — which interventions are appropriate?";

  it("returns MCQ payload when 1 correct option", () => {
    const payload = resolvePayloadFromCanonicalOptions("CLINICAL", MCQ_STEM, MCQ_OPTIONS, null);
    assert.ok(payload);
    assert.equal(payload!.itemKind, "CLINICAL");
    assert.ok("correctLetter" in payload!);
  });

  it("returns SATA payload when kind is SATA", () => {
    const payload = resolvePayloadFromCanonicalOptions("SATA", SATA_STEM, SATA_OPTIONS, null);
    assert.ok(payload);
    assert.equal(payload!.itemKind, "SATA");
    assert.ok("correctLetters" in payload!);
  });

  it("returns SATA when 2+ correct even if kind is CLINICAL (data mismatch guard)", () => {
    const multiCorrect = MCQ_OPTIONS.map((o, i) => ({ ...o, isCorrect: i < 2 }));
    const payload = resolvePayloadFromCanonicalOptions("CLINICAL", SATA_STEM, multiCorrect, null);
    assert.ok(payload);
    assert.equal(payload!.itemKind, "SATA");
  });

  it("returns null for empty options", () => {
    const payload = resolvePayloadFromCanonicalOptions("CLINICAL", MCQ_STEM, [], null);
    assert.equal(payload, null);
  });

  it("returns null for null stem", () => {
    const payload = resolvePayloadFromCanonicalOptions("CLINICAL", null, MCQ_OPTIONS, null);
    assert.equal(payload, null);
  });
});

// ─── Round-trip: payload → canonical → payload ────────────────────────────────

describe("round-trip: mcqPayloadToCanonicalOptions", () => {
  it("converts MCQ payload to canonical rows preserving correctness and rationale", () => {
    const payload = {
      itemKind: "CLINICAL" as const,
      questionStem: "Which action?",
      answerOptions: [
        { letter: "A", text: "Slow infusion" },
        { letter: "B", text: "Stop and assess" },
        { letter: "C", text: "Apply compress" },
      ],
      correctLetter: "B",
      rationaleCorrect: "Stopping is the safety priority.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Delays intervention." },
        { letter: "C", rationale: "Masks injury." },
      ],
    };

    const rows = mcqPayloadToCanonicalOptions(payload);
    assert.equal(rows.length, 3);
    const correct = rows.find((r) => r.optionKey === "B");
    assert.equal(correct?.isCorrect, true);
    assert.equal(correct?.rationale, "Stopping is the safety priority.");
    const wrongA = rows.find((r) => r.optionKey === "A");
    assert.equal(wrongA?.isCorrect, false);
    assert.equal(wrongA?.rationale, "Delays intervention.");
  });
});

describe("round-trip: sataPayloadToCanonicalOptions", () => {
  it("converts SATA payload to canonical rows", () => {
    const payload = {
      itemKind: "SATA" as const,
      questionStem: "Which interventions are appropriate?",
      answerOptions: [
        { letter: "A", text: "High-Fowler" },
        { letter: "B", text: "Increase fluids" },
        { letter: "C", text: "O2" },
      ],
      correctLetters: ["A", "C"],
      rationaleCorrect: "These address oxygenation.",
      rationaleByLetter: [
        { letter: "A", rationale: "Improves oxygenation.", correct: true },
        { letter: "B", rationale: "Contraindicated.", correct: false },
        { letter: "C", rationale: "Treats hypoxia.", correct: true },
      ],
    };

    const rows = sataPayloadToCanonicalOptions(payload);
    assert.equal(rows.length, 3);
    const correctKeys = rows.filter((r) => r.isCorrect).map((r) => r.optionKey).sort();
    assert.deepEqual(correctKeys, ["A", "C"]);
    const wrongB = rows.find((r) => r.optionKey === "B");
    assert.equal(wrongB?.isCorrect, false);
    assert.equal(wrongB?.rationale, "Contraindicated.");
  });
});

describe("assignStandardLetters", () => {
  it("assigns A–D keys to unlabeled options", () => {
    const opts = [
      { content: "First option", isCorrect: false },
      { content: "Correct option", isCorrect: true },
      { content: "Third option", isCorrect: false },
    ];
    const rows = assignStandardLetters(opts);
    assert.equal(rows[0].optionKey, "A");
    assert.equal(rows[1].optionKey, "B");
    assert.equal(rows[1].isCorrect, true);
    assert.equal(rows[2].optionKey, "C");
  });

  it("caps at 6 options (F)", () => {
    const opts = Array.from({ length: 8 }, (_, i) => ({
      content: `Option ${i}`,
      isCorrect: i === 0,
    }));
    const rows = assignStandardLetters(opts);
    assert.equal(rows.length, 6);
    assert.equal(rows[5].optionKey, "F");
  });
});
