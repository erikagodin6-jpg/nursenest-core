import { describe, test, expect } from "vitest";
import { validateQuestionBankImport } from "../question-bank-validation";

function minimalRow(overrides: Record<string, unknown> = {}) {
  return {
    question: "Sample stem for import validation row one",
    option_a: "Alpha",
    option_b: "Bravo",
    option_c: "Charlie",
    option_d: "Delta",
    correct_answer: "A",
    rationale: "Rationale text that is long enough to satisfy validation requirements here.",
    category: "General",
    difficulty: "easy",
    exam_type: "NCLEX-PN",
    country: "US",
    question_type: "MCQ",
    client_needs: "Physiological Integrity",
    topic: "Cardiac",
    ...overrides,
  };
}

describe("validateQuestionBankImport content_tier", () => {
  test("defaults NCLEX-PN to rpn when content_tier omitted", () => {
    const r = validateQuestionBankImport([minimalRow()]);
    expect(r.errors.length).toBe(0);
    expect(r.valid[0]?.contentTier).toBe("rpn");
  });

  test("rejects wrong tier for NCLEX-PN", () => {
    const r = validateQuestionBankImport([minimalRow({ content_tier: "np" })]);
    expect(r.valid.length).toBe(0);
    expect(r.errors.some((e) => e.field === "content_tier")).toBe(true);
  });
});
