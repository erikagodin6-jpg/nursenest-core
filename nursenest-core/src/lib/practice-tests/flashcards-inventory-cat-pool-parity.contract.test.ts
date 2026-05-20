/**
 * CAT / flashcards inventory share non-ECG + study-bank gates on the canonical pathway WHERE.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const appRoot = join(process.cwd(), "src");

describe("flashcards inventory vs CAT pool parity (static)", () => {
  it("canonical pathway WHERE composes questionAccessWhereWithPathway + NON_ECG + study bank gates + RT ventilator gate", () => {
    const src = readFileSync(join(appRoot, "lib/study-question-pool/canonical-exam-question-where.ts"), "utf8");
    assert.match(src, /questionAccessWhereWithPathway/);
    assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
    assert.match(src, /generalStudyBankModuleSurfaceWhere/);
    assert.match(src, /rtVentilatorPremiumBankGateWhere/);
  });

  it("CAT fetchCatPracticePool still ANDs the same non-ECG + study-bank + RT ventilator slices onto pathway base", () => {
    const src = readFileSync(join(appRoot, "lib/practice-tests/cat-pool.ts"), "utf8");
    assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
    assert.match(src, /generalStudyBankModuleSurfaceWhere/);
    assert.match(src, /rtVentilatorPremiumBankGateWhere/);
    assert.match(src, /questionAccessWhereWithPathway/);
  });
});
