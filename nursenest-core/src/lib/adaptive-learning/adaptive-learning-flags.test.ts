/**
 * Run: `node --import tsx --test src/lib/adaptive-learning/adaptive-learning-flags.test.ts`
 */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { isAdaptiveLearningEnabled } from "@/lib/adaptive-learning/adaptive-learning-flags";

const orig = process.env.ADAPTIVE_LEARNING_ENABLED;

afterEach(() => {
  if (orig === undefined) delete process.env.ADAPTIVE_LEARNING_ENABLED;
  else process.env.ADAPTIVE_LEARNING_ENABLED = orig;
});

test("ADAPTIVE_LEARNING_ENABLED defaults to false", () => {
  delete process.env.ADAPTIVE_LEARNING_ENABLED;
  assert.equal(isAdaptiveLearningEnabled(), false);
  process.env.ADAPTIVE_LEARNING_ENABLED = "";
  assert.equal(isAdaptiveLearningEnabled(), false);
  process.env.ADAPTIVE_LEARNING_ENABLED = "1";
  assert.equal(isAdaptiveLearningEnabled(), false);
});

test("ADAPTIVE_LEARNING_ENABLED true only for literal true", () => {
  process.env.ADAPTIVE_LEARNING_ENABLED = "true";
  assert.equal(isAdaptiveLearningEnabled(), true);
});
