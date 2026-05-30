import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  buildSimpleCorrectRationale,
  buildSimpleDistractorRationale,
  isGenericRationaleText,
  validateFlashcardRationaleContent,
} from "@/lib/questions/rationale-quality";

const PROHIBITED_PHRASES = [
  "is correct because",
  "concept being tested",
  "connect it directly",
  "match the answer choice",
  "generic priority framework",
] as const;

function assertNoPlaceholderPhrases(value: string): void {
  for (const phrase of PROHIBITED_PHRASES) {
    assert.doesNotMatch(value, new RegExp(phrase, "i"), `Unexpected placeholder phrase: ${phrase}`);
  }
}

describe("flashcard rationale quality governance", () => {
  it("rebuilds weak correct-answer rationales into educator-quality teaching copy", () => {
    const answer = "Encourage rest periods and energy conservation.";
    const rationale = buildSimpleCorrectRationale({
      stem: "A client receiving radiation therapy reports severe fatigue. Which instruction is most appropriate?",
      correctOptionText: answer,
    });

    assert.match(rationale, /best answer/i);
    assert.match(rationale, /client cue|key cue|patient-specific/i);
    assertNoPlaceholderPhrases(rationale);
    assert.equal(validateFlashcardRationaleContent({ rationale, answerText: answer }).pass, true);
  });

  it("rebuilds weak distractor rationales without answer parroting or template language", () => {
    const rationale = buildSimpleDistractorRationale({
      stem: "A client receiving radiation therapy reports severe fatigue. Which instruction is most appropriate?",
      optionText: "Apply a heating pad to the irradiated skin.",
      correctOptionText: "Encourage rest periods and energy conservation.",
    });

    assert.match(rationale, /plausible|reasonable/i);
    assert.match(rationale, /mechanism|cue|risk|safety/i);
    assertNoPlaceholderPhrases(rationale);
  });

  it("flags duplicate, short, answer-echo, and placeholder rationale content", () => {
    const bad =
      "Encourage rest periods and energy conservation. is correct because Encourage rest periods and energy conservation. is the concept being tested. Encourage rest periods and energy conservation. is the concept being tested.";
    const result = validateFlashcardRationaleContent({
      rationale: bad,
      answerText: "Encourage rest periods and energy conservation.",
    });

    assert.equal(result.pass, false);
    assert.ok(result.issues.includes("placeholder_phrase"));
    assert.ok(result.issues.includes("duplicate_sentence"));
    assert.ok(result.issues.includes("answer_repeated"));
    assert.equal(isGenericRationaleText(bad), true);
  });
});

describe("flashcard rationale typography governance", () => {
  it("keeps learner-facing rationale labels in Title Case instead of forced all caps", () => {
    const revealPanels = readFileSync("src/components/flashcards/flashcard-study-reveal-panels.tsx", "utf8");
    const premiumCss = readFileSync("src/app/learner-flashcard-premium.css", "utf8");
    const brandingCss = readFileSync("src/app/learner-flashcard-branding-revamp.css", "utf8");
    const combinedCss = `${premiumCss}\n${brandingCss}`;

    assert.doesNotMatch(revealPanels, /font-bold\s+uppercase\s+tracking-wide/);
    assert.doesNotMatch(combinedCss, /nn-clinical-pearl-label[\s\S]{0,500}text-transform:\s*uppercase/i);
    assert.doesNotMatch(combinedCss, /nn-flashcard-rationale-section h3[\s\S]{0,500}text-transform:\s*uppercase/i);
    assert.doesNotMatch(combinedCss, /nn-flashcard-study-heading__eyebrow[\s\S]{0,350}text-transform:\s*uppercase/i);
  });
});
