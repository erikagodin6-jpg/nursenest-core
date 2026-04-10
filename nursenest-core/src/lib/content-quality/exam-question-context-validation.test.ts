import assert from "node:assert/strict";
import test from "node:test";
import { assertExamQuestionContextForPublish } from "@/lib/content-quality/exam-question-context-validation";

test("publish validation throws when exam context fields are missing", () => {
  assert.throws(
    () => assertExamQuestionContextForPublish({ tier: "", exam: "NCLEX_RN", countryCode: "US" }),
    /tier is required/i,
  );
  assert.throws(
    () => assertExamQuestionContextForPublish({ tier: "rn", exam: "", countryCode: "US" }),
    /exam is required/i,
  );
  assert.throws(
    () => assertExamQuestionContextForPublish({ tier: "rn", exam: "NCLEX_RN", countryCode: "" }),
    /country_code is required/i,
  );
});

test("publish validation accepts complete context", () => {
  assert.doesNotThrow(() =>
    assertExamQuestionContextForPublish({ tier: "rn", exam: "NCLEX_RN", countryCode: "US" }),
  );
});
