import test from "node:test";
import assert from "node:assert/strict";
import { FlashcardItemKind } from "@prisma/client";
import {
  isTrivialDefinitionOnlyStem,
  parseExamMicroQuestionFromDbFields,
  shuffleExamMicroQuestionOrder,
  validateExamMicroQuestionInput,
  parseSataFromDbFields,
  parseSataFromCanonicalOptions,
  shuffleSataQuestionOrder,
} from "@/lib/flashcards/flashcard-exam-style";
import type { CanonicalOption } from "@/lib/flashcards/flashcard-canonical-options";

test("parseExamMicroQuestionFromDbFields accepts a valid 4-option card", () => {
  const payload = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: "A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?",
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress and continue" },
      { letter: "D", text: "Flush the line with normal saline" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Stopping the infusion and assessing the site is the priority safety action before other interventions.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of a possible irritant when infiltration is suspected." },
      { letter: "C", rationale: "Warm compresses do not replace assessment and may mask worsening injury." },
      { letter: "D", rationale: "Flushing can worsen tissue exposure if infiltration is present." },
    ],
  });
  assert.ok(payload);
  assert.equal(payload!.correctLetter, "B");
  assert.equal(payload!.answerOptions.length, 4);
  assert.equal(payload!.rationaleIncorrect.length, 3);
});

test("parseExamMicroQuestionFromDbFields rejects fewer than 3 options", () => {
  const payload = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.RECALL,
    questionStem: "Which of the following is most accurate regarding hand hygiene?",
    answerOptions: [
      { letter: "A", text: "Alcohol rub is acceptable when hands are not visibly soiled" },
      { letter: "B", text: "Soap and water are never needed" },
    ],
    correctAnswer: "A",
    rationaleCorrect: "Alcohol-based hand rub is effective when hands are not visibly soiled.",
    rationaleIncorrect: [{ letter: "B", rationale: "Soap and water are required when hands are visibly dirty." }],
  });
  assert.equal(payload, null);
});

test("validateExamMicroQuestionInput mirrors parser", () => {
  const v = validateExamMicroQuestionInput({
    examItemKind: FlashcardItemKind.PRIORITY,
    questionStem: "Which client should the nurse assess first in a busy med-surg unit?",
    answerOptions: [
      { letter: "A", text: "Stable post-op awaiting discharge" },
      { letter: "B", text: "New onset confusion with dropping oxygen saturation" },
      { letter: "C", text: "Chronic pain 3/10 after scheduled analgesic" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Airway and oxygenation threats plus acute mental status change represent the highest risk.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Stable findings are lower priority than acute deterioration." },
      { letter: "C", rationale: "Controlled chronic pain is lower priority than acute physiological compromise." },
    ],
  });
  assert.equal(v.ok, true);
});

test("isTrivialDefinitionOnlyStem flags acronym / definition stems", () => {
  assert.equal(isTrivialDefinitionOnlyStem("What does ABG stand for?"), true);
  assert.equal(isTrivialDefinitionOnlyStem("Define COPD."), true);
  assert.equal(isTrivialDefinitionOnlyStem("What is MI?"), true);
  assert.equal(
    isTrivialDefinitionOnlyStem(
      "A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?",
    ),
    false,
  );
});

test("validateExamMicroQuestionInput rejects trivial acronym stems even with valid options", () => {
  const v = validateExamMicroQuestionInput({
    examItemKind: FlashcardItemKind.RECALL,
    questionStem: "What does ABG stand for?",
    answerOptions: [
      { letter: "A", text: "Arterial blood gas" },
      { letter: "B", text: "Airway breathing guide" },
      { letter: "C", text: "Automatic blood glucose" },
      { letter: "D", text: "Acid–base gradient" },
    ],
    correctAnswer: "A",
    rationaleCorrect: "ABG commonly refers to arterial blood gas analysis in clinical documentation and care planning.",
    rationaleIncorrect: [
      { letter: "B", rationale: "This expansion is not the standard nursing meaning of ABG." },
      { letter: "C", rationale: "ABG is not used for blood glucose monitoring in this sense." },
      { letter: "D", rationale: "This is not a recognized meaning of the ABG abbreviation." },
    ],
  });
  assert.equal(v.ok, false);
  if (!v.ok) assert.match(v.error, /acronym|definition trivia/i);
});

test("shuffleExamMicroQuestionOrder keeps correct answer aligned with rationales", () => {
  const base = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: "A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?",
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress and continue" },
      { letter: "D", text: "Flush the line with normal saline" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Stopping the infusion and assessing the site is the priority safety action before other interventions.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of a possible irritant when infiltration is suspected." },
      { letter: "C", rationale: "Warm compresses do not replace assessment and may mask worsening injury." },
      { letter: "D", rationale: "Flushing can worsen tissue exposure if infiltration is present." },
    ],
  });
  assert.ok(base);
  const shuffled = shuffleExamMicroQuestionOrder(base!, "session-salt-1");
  const correctText = shuffled.answerOptions.find((o) => o.letter === shuffled.correctLetter)?.text;
  assert.equal(correctText, "Stop the infusion and assess the site");
  const letters = new Set(shuffled.answerOptions.map((o) => o.letter));
  assert.equal(letters.size, 4);
  for (const row of shuffled.rationaleIncorrect) {
    const opt = shuffled.answerOptions.find((o) => o.letter === row.letter);
    assert.ok(opt);
  }
});

test("shuffleExamMicroQuestionOrder varies order by seed", () => {
  const base = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: "A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?",
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress and continue" },
      { letter: "D", text: "Flush the line with normal saline" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Stopping the infusion and assessing the site is the priority safety action before other interventions.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of a possible irritant when infiltration is suspected." },
      { letter: "C", rationale: "Warm compresses do not replace assessment and may mask worsening injury." },
      { letter: "D", rationale: "Flushing can worsen tissue exposure if infiltration is present." },
    ],
  });
  assert.ok(base);
  const a = shuffleExamMicroQuestionOrder(base!, "seed-a");
  const b = shuffleExamMicroQuestionOrder(base!, "seed-b");
  const orderA = a.answerOptions.map((o) => o.text).join("|");
  const orderB = b.answerOptions.map((o) => o.text).join("|");
  assert.notEqual(orderA, orderB);
});

// ─── SATA: parseSataFromDbFields ──────────────────────────────────────────────

const SATA_STEM = "A nurse is caring for a client who develops acute pulmonary edema. Which interventions should the nurse implement?";
const SATA_OPTIONS_JSON = [
  { letter: "A", text: "Place the client in high-Fowler's position" },
  { letter: "B", text: "Encourage increased oral fluid intake" },
  { letter: "C", text: "Administer oxygen as prescribed" },
  { letter: "D", text: "Decrease IV fluid rate" },
  { letter: "E", text: "Monitor lung sounds and oxygen saturation" },
];
const SATA_RATIONALE_INCORRECT_JSON = [
  { letter: "B", rationale: "Oral fluids are contraindicated in pulmonary edema as they worsen fluid overload." },
];

test("parseSataFromDbFields accepts valid SATA with comma-separated correctAnswer", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,C,D,E",
    rationaleCorrect: "These interventions address hypoxia and reduce the fluid overload contributing to pulmonary edema.",
    rationaleIncorrect: SATA_RATIONALE_INCORRECT_JSON,
  });

  assert.ok(payload, "should return a SataQuestionPayload");
  assert.equal(payload!.itemKind, "SATA");
  assert.deepEqual(payload!.correctLetters.sort(), ["A", "C", "D", "E"]);
  assert.equal(payload!.answerOptions.length, 5);
  assert.equal(payload!.rationaleByLetter.length, 5);
});

test("parseSataFromDbFields returns null for non-SATA itemKind", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,C",
    rationaleCorrect: "Rationale.",
    rationaleIncorrect: null,
  });
  assert.equal(payload, null);
});

test("parseSataFromDbFields returns null when fewer than 2 correct letters", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A",
    rationaleCorrect: "Rationale.",
    rationaleIncorrect: null,
  });
  assert.equal(payload, null, "single correct answer is not valid SATA");
});

test("parseSataFromDbFields returns null when answerOptions is null", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: null,
    correctAnswer: "A,C",
    rationaleCorrect: "Rationale.",
    rationaleIncorrect: null,
  });
  assert.equal(payload, null);
});

test("parseSataFromDbFields rationaleByLetter marks correct vs incorrect", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,C,D,E",
    rationaleCorrect: "These reduce hypoxia and fluid overload.",
    rationaleIncorrect: SATA_RATIONALE_INCORRECT_JSON,
  });
  assert.ok(payload);
  const byLetter = new Map(payload!.rationaleByLetter.map((r) => [r.letter, r]));
  assert.equal(byLetter.get("A")?.correct, true);
  assert.equal(byLetter.get("B")?.correct, false);
  assert.equal(byLetter.get("C")?.correct, true);
  assert.equal(byLetter.get("E")?.correct, true);
});

// ─── SATA: parseSataFromCanonicalOptions ──────────────────────────────────────

const CANONICAL_SATA_OPTIONS: CanonicalOption[] = [
  { optionKey: "A", content: "High-Fowler's position", isCorrect: true, rationale: "Improves oxygenation.", displayOrder: 0 },
  { optionKey: "B", content: "Increase oral fluids", isCorrect: false, rationale: "Contraindicated in fluid overload.", displayOrder: 1 },
  { optionKey: "C", content: "Administer O2", isCorrect: true, rationale: "Treats hypoxia directly.", displayOrder: 2 },
  { optionKey: "D", content: "Decrease IV rate", isCorrect: true, rationale: "Reduces fluid overload.", displayOrder: 3 },
];

test("parseSataFromCanonicalOptions returns a valid SATA payload", () => {
  const payload = parseSataFromCanonicalOptions(
    SATA_STEM,
    CANONICAL_SATA_OPTIONS,
    "These interventions manage pulmonary edema.",
  );
  assert.ok(payload);
  assert.equal(payload!.itemKind, "SATA");
  assert.deepEqual(payload!.correctLetters.sort(), ["A", "C", "D"]);
  assert.equal(payload!.answerOptions.length, 4);
});

test("parseSataFromCanonicalOptions returns null for 1 correct option", () => {
  const one = CANONICAL_SATA_OPTIONS.map((o, i) => ({ ...o, isCorrect: i === 0 }));
  const payload = parseSataFromCanonicalOptions(SATA_STEM, one, null);
  assert.equal(payload, null);
});

test("parseSataFromCanonicalOptions returns null for null stem", () => {
  const payload = parseSataFromCanonicalOptions(null, CANONICAL_SATA_OPTIONS, null);
  assert.equal(payload, null);
});

test("parseSataFromCanonicalOptions returns null for empty options", () => {
  const payload = parseSataFromCanonicalOptions(SATA_STEM, [], null);
  assert.equal(payload, null);
});

// ─── SATA: shuffleSataQuestionOrder ──────────────────────────────────────────

test("shuffleSataQuestionOrder preserves correctLetters after shuffle", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,C,D,E",
    rationaleCorrect: "Treats hypoxia and fluid overload.",
    rationaleIncorrect: SATA_RATIONALE_INCORRECT_JSON,
  });
  assert.ok(payload);
  const shuffled = shuffleSataQuestionOrder(payload!, "test-seed-42");

  // All original option texts are still present
  const shuffledTexts = new Set(shuffled.answerOptions.map((o) => o.text));
  for (const opt of SATA_OPTIONS_JSON) {
    assert.ok(shuffledTexts.has(opt.text), `missing option text: ${opt.text}`);
  }

  // correctLetters are still the same set (remapped to new positions)
  assert.equal(shuffled.correctLetters.length, 4);

  // Each correctLetter maps to an option that was originally correct
  const originalCorrect = new Set(["A", "C", "D", "E"]);
  const originalTexts = new Map(SATA_OPTIONS_JSON.map((o) => [o.letter, o.text]));
  for (const letter of shuffled.correctLetters) {
    const opt = shuffled.answerOptions.find((o) => o.letter === letter);
    assert.ok(opt, `correct letter ${letter} not found in shuffled options`);
    // Find the original letter for this text and confirm it was correct
    const origLetter = SATA_OPTIONS_JSON.find((o) => o.text === opt!.text)?.letter;
    assert.ok(originalCorrect.has(origLetter!), `option text "${opt!.text}" was not originally correct`);
  }
});

test("shuffleSataQuestionOrder produces different order with different seed", () => {
  const payload = parseSataFromDbFields({
    examItemKind: FlashcardItemKind.SATA,
    questionStem: SATA_STEM,
    answerOptions: SATA_OPTIONS_JSON,
    correctAnswer: "A,C,D,E",
    rationaleCorrect: "Rationale.",
    rationaleIncorrect: SATA_RATIONALE_INCORRECT_JSON,
  });
  assert.ok(payload);
  const s1 = shuffleSataQuestionOrder(payload!, "seed-one");
  const s2 = shuffleSataQuestionOrder(payload!, "seed-two");
  const order1 = s1.answerOptions.map((o) => o.text).join("|");
  const order2 = s2.answerOptions.map((o) => o.text).join("|");
  assert.notEqual(order1, order2, "different seeds should produce different orderings");
});
