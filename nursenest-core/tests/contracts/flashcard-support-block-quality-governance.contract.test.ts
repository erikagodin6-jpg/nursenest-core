import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFlashcardClinicalPearl,
  buildFlashcardHint,
  buildFlashcardMemoryHook,
  buildFlashcardNclexTakeaway,
  buildFlashcardWhyThisMatters,
  validateFlashcardSupportBlock,
  type FlashcardSupportBlockKind,
} from "@/lib/flashcards/flashcard-support-block-quality";

function wc(value: string): number {
  return value.match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function assertRange(kind: FlashcardSupportBlockKind, text: string, min: number, max: number) {
  const count = wc(text);
  assert.ok(count >= min, `${kind} is too short (${count}): ${text}`);
  assert.ok(count <= max, `${kind} is too long (${count}): ${text}`);
}

const radiationContext = {
  stem: "A client receiving radiation therapy reports severe fatigue during the third week of treatment.",
  topic: "Oncology",
  subtopic: "Cancer treatment effects",
  answerText: "Encourage the patient to rest and conserve energy.",
  correctLetter: "B",
  rationale:
    "Radiation therapy commonly causes fatigue because normal cells are affected along with cancer cells. Energy conservation helps maintain activity tolerance during treatment.",
  pathwayLabel: "NCLEX",
};

describe("flashcard support block quality governance", () => {
  it("builds hints that guide reasoning without revealing the answer", () => {
    const hint = buildFlashcardHint(radiationContext);

    assertRange("hint", hint, 15, 40);
    assert.doesNotMatch(hint, /Encourage|rest|conserve energy/i);
    assert.doesNotMatch(hint, /\bB\b/);
    assert.equal(validateFlashcardSupportBlock("hint", hint, radiationContext).pass, true);
  });

  it("builds clinical pearls with practical nurse-focused knowledge", () => {
    const pearl = buildFlashcardClinicalPearl(radiationContext);

    assertRange("clinicalPearl", pearl, 25, 75);
    assert.match(pearl, /Nurses|fatigue|therapy/i);
    assert.doesNotMatch(pearl, /is correct because|concept being tested|match the answer choice/i);
    assert.equal(validateFlashcardSupportBlock("clinicalPearl", pearl, radiationContext).pass, true);
  });

  it("builds concise memory hooks without parroting the answer", () => {
    const hook = buildFlashcardMemoryHook(radiationContext);

    assertRange("memoryHook", hook, 5, 20);
    assert.doesNotMatch(hook, /Encourage|conserve energy/i);
    assert.equal(validateFlashcardSupportBlock("memoryHook", hook, radiationContext).pass, true);
  });

  it("builds why-this-matters statements around patient outcomes", () => {
    const why = buildFlashcardWhyThisMatters(radiationContext);

    assertRange("whyThisMatters", why, 20, 60);
    assert.match(why, /quality of life|patient|outcome|complication|distress|safety/i);
    assert.equal(validateFlashcardSupportBlock("whyThisMatters", why, radiationContext).pass, true);
  });

  it("builds exam-focused NCLEX takeaways without generic filler", () => {
    const takeaway = buildFlashcardNclexTakeaway(radiationContext);

    assertRange("nclexTakeaway", takeaway, 15, 40);
    assert.match(takeaway, /cancer-treatment|items|priority|interventions|option|cue/i);
    assert.doesNotMatch(takeaway, /review the material|important to know|generic priority framework/i);
    assert.equal(validateFlashcardSupportBlock("nclexTakeaway", takeaway, radiationContext).pass, true);
  });

  it("rejects answer-revealing hints and placeholder phrasing", () => {
    const result = validateFlashcardSupportBlock(
      "hint",
      "Think about encouraging rest because B is correct and this is the concept being tested.",
      radiationContext,
    );

    assert.equal(result.pass, false);
    assert.ok(result.issues.includes("placeholder_phrase"));
    assert.ok(result.issues.includes("hint_reveals_answer_letter"));
  });

  it("replaces authored blocks that repeat the answer with educator-quality fallback text", () => {
    const authored = "Encourage the patient to rest and conserve energy is correct because it is the concept being tested.";
    const pearl = buildFlashcardClinicalPearl(radiationContext, authored);

    assert.notEqual(pearl, authored);
    assert.doesNotMatch(pearl, /concept being tested|is correct because/i);
    assert.equal(validateFlashcardSupportBlock("clinicalPearl", pearl, radiationContext).pass, true);
  });
});
