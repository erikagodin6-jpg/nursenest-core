import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isHardBlockingReadinessCode, resolveReadinessStartQuestionCount } from "@/components/student/pathway-cat-start-payload";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";

describe("resolveReadinessStartQuestionCount", () => {
  it("caps non-NP exam simulation at 145", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 150,
      catPresentationMode: "exam_simulation",
      examFamily: "NCLEX_RN",
    });
    assert.equal(count, 145);
  });

  it("keeps NP exam simulation at 150", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 150,
      catPresentationMode: "exam_simulation",
      examFamily: "NP",
    });
    assert.equal(count, 150);
  });

  it("enforces minimum CAT input cap of 10", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 3,
      catPresentationMode: "exam_simulation",
      examFamily: "NCLEX_RN",
    });
    assert.equal(count, 10);
  });

  it("caps non-NP CAT input cap at 145 even above 150", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 999,
      catPresentationMode: "exam_simulation",
      examFamily: "NCLEX_PN",
    });
    assert.equal(count, 145);
  });
});

describe("isHardBlockingReadinessCode", () => {
  it("blocks only entitlement and pool errors", () => {
    assert.equal(isHardBlockingReadinessCode(PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled), true);
    assert.equal(isHardBlockingReadinessCode(PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid), true);
    assert.equal(isHardBlockingReadinessCode(PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready), false);
    assert.equal(isHardBlockingReadinessCode("readiness_fetch_failed"), false);
    assert.equal(isHardBlockingReadinessCode(null), false);
  });
});
