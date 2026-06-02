import { describe, test, expect } from "vitest";
import {
  getLegacyQuestionBankScopeForUser,
  legacyQuestionBankItemMatchesUserScope,
} from "../question-bank-validation";

describe("legacy question_bank region/exam scope helpers", () => {
  test("US learner gets NCLEX-PN + US", () => {
    const scope = getLegacyQuestionBankScopeForUser({ region: "US" });
    expect(scope).toEqual({ country: "US", examType: "NCLEX-PN" });
  });

  test("CA learner gets REx-PN + CA", () => {
    const scope = getLegacyQuestionBankScopeForUser({ region: "CA" });
    expect(scope).toEqual({ country: "CA", examType: "REx-PN" });
  });

  test("unknown region yields no scope (must not read legacy bank)", () => {
    expect(getLegacyQuestionBankScopeForUser({ region: "GB" })).toBeNull();
    expect(getLegacyQuestionBankScopeForUser({ region: null })).toBeNull();
  });

  test("item matches only same country and exam type as scope", () => {
    const us = getLegacyQuestionBankScopeForUser({ region: "US" })!;
    expect(
      legacyQuestionBankItemMatchesUserScope(
        { country: "US", examType: "NCLEX-PN" },
        us,
      ),
    ).toBe(true);
    expect(
      legacyQuestionBankItemMatchesUserScope(
        { country: "CA", examType: "REx-PN" },
        us,
      ),
    ).toBe(false);
    expect(
      legacyQuestionBankItemMatchesUserScope(
        { country: "US", examType: "REx-PN" },
        us,
      ),
    ).toBe(false);
  });
});
