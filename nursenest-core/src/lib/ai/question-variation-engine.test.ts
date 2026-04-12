/**
 * Run: `npx tsx --test src/lib/ai/question-variation-engine.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { QuestionType } from "@prisma/client";
import {
  answerPatternFingerprint,
  buildVariationSpecsForConcept,
  clampVariationsPerTopicBatch,
  formatVariationDirective,
} from "./question-variation-engine";

describe("buildVariationSpecsForConcept", () => {
  it("returns N unique signatures for the same label", () => {
    const specs = buildVariationSpecsForConcept("Sepsis recognition", 6);
    assert.equal(specs.length, 6);
    const sigs = new Set(specs.map((s) => s.signature));
    assert.equal(sigs.size, 6);
  });

  it("includes directive text for model prompt", () => {
    const s = buildVariationSpecsForConcept("Heart failure", 1)[0]!;
    const d = formatVariationDirective(s);
    assert.match(d, /VARIATION CONTRACT/);
    assert.match(d, /Care setting/);
  });

  it("clamps batch API input", () => {
    assert.equal(clampVariationsPerTopicBatch(undefined), 1);
    assert.equal(clampVariationsPerTopicBatch(0), 1);
    assert.equal(clampVariationsPerTopicBatch(99), 8);
  });
});

describe("answerPatternFingerprint", () => {
  it("differs when MCQ correct index changes", () => {
    const opts = ["a", "b", "c", "d"];
    const a = answerPatternFingerprint({
      questionType: QuestionType.MCQ,
      options: opts,
      answerKey: ["b"],
    });
    const b = answerPatternFingerprint({
      questionType: QuestionType.MCQ,
      options: opts,
      answerKey: ["c"],
    });
    assert.notEqual(a, b);
  });
});
