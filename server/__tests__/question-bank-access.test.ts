import { describe, test, expect } from "vitest";
import {
  resolveQuestionBankLearnerGate,
  learnerCanAccessQuestionBankItem,
} from "../question-bank-access";
import { deriveQuestionBankContentTierFromExamType } from "../question-bank-validation";

describe("question-bank-access", () => {
  test("admin gate allows any row", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "rpn", region: "US" }, true);
    expect(gate.kind).toBe("admin");
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "CA", examType: "REx-PN", contentTier: "rpn" },
        gate,
      ),
    ).toBe(true);
  });

  test("US rpn learner can read rpn NCLEX-PN row with content tier", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "rpn", region: "US" }, false);
    expect(gate.kind).toBe("learner");
    expect(gate.scope).toEqual({ country: "US", examType: "NCLEX-PN" });
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "US", examType: "NCLEX-PN", contentTier: "rpn" },
        gate,
      ),
    ).toBe(true);
  });

  test("rpn learner denied cross-region", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "rpn", region: "US" }, false);
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "CA", examType: "REx-PN", contentTier: "rpn" },
        gate,
      ),
    ).toBe(false);
  });

  test("rpn learner denied out-of-tier row", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "rpn", region: "US" }, false);
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "US", examType: "NCLEX-PN", contentTier: "np" },
        gate,
      ),
    ).toBe(false);
  });

  test("np learner can access rpn-tier bank row (ladder)", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "np", region: "US" }, false);
    expect(gate.kind).toBe("learner");
    if (gate.kind === "learner") {
      expect(gate.contentTiers).toContain("rpn");
    }
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "US", examType: "NCLEX-PN", contentTier: "rpn" },
        gate,
      ),
    ).toBe(true);
  });

  test("missing content tier denied for learner", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "rpn", region: "US" }, false);
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "US", examType: "NCLEX-PN", contentTier: null },
        gate,
      ),
    ).toBe(false);
  });

  test("allied learner has no nursing tiers — denied", () => {
    const gate = resolveQuestionBankLearnerGate({ tier: "allied", region: "US" }, false);
    expect(gate.contentTiers.length).toBe(0);
    expect(
      learnerCanAccessQuestionBankItem(
        { country: "US", examType: "NCLEX-PN", contentTier: "rpn" },
        gate,
      ),
    ).toBe(false);
  });
});

describe("deriveQuestionBankContentTierFromExamType", () => {
  test("PN exams map to rpn", () => {
    expect(deriveQuestionBankContentTierFromExamType("NCLEX-PN")).toBe("rpn");
    expect(deriveQuestionBankContentTierFromExamType("REx-PN")).toBe("rpn");
  });
});
