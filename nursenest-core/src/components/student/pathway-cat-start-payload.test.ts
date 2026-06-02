import assert from "node:assert/strict";
import { ExamFamily } from "@prisma/client";
import { describe, it } from "node:test";
import {
  isHardBlockingReadinessCode,
  resolveCatStartUiState,
  resolveReadinessStartQuestionCount,
} from "@/components/student/pathway-cat-start-payload";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";

describe("resolveReadinessStartQuestionCount", () => {
  it("caps non-NP exam simulation at 145", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 150,
      catPresentationMode: "exam_simulation",
      examFamily: ExamFamily.NCLEX_RN,
    });
    assert.equal(count, 145);
  });

  it("allows NP exam simulation up to 175 when configured", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 175,
      catPresentationMode: "exam_simulation",
      examFamily: ExamFamily.NP,
    });
    assert.equal(count, 175);
  });

  it("enforces minimum CAT input cap of 10", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 3,
      catPresentationMode: "exam_simulation",
      examFamily: ExamFamily.NCLEX_RN,
    });
    assert.equal(count, 10);
  });

  it("caps non-NP CAT input cap at 145 even above 150", () => {
    const count = resolveReadinessStartQuestionCount({
      configuredMaxQuestions: 999,
      catPresentationMode: "exam_simulation",
      examFamily: ExamFamily.NCLEX_PN,
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

describe("resolveCatStartUiState", () => {
  it("keeps start disabled and pathway-required message visible when no pathway is selected", () => {
    const state = resolveCatStartUiState({
      pathwayId: "",
      pathwayChoiceRequired: true,
      readinessLoading: false,
      readiness: null,
    });
    assert.equal(state.startDisabled, true);
    assert.equal(state.showPathwayRequiredMessage, true);
    assert.equal(state.showReadinessMessage, false);
  });

  it("enables start and hides pathway-required message when pathway is selected and readiness is ok", () => {
    const state = resolveCatStartUiState({
      pathwayId: "us-rn-nclex-rn",
      pathwayChoiceRequired: true,
      readinessLoading: false,
      readiness: { ok: true, availableQuestions: 3622, requiredQuestions: 30 },
    });
    assert.equal(state.startDisabled, false);
    assert.equal(state.showPathwayRequiredMessage, false);
    assert.equal(state.showReadinessMessage, false);
  });

  it("disables start and shows readiness message when pool is insufficient", () => {
    const state = resolveCatStartUiState({
      pathwayId: "us-rn-nclex-rn",
      pathwayChoiceRequired: true,
      readinessLoading: false,
      readiness: {
        ok: false,
        code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
        message: "not enough pool",
        availableQuestions: 10,
        requiredQuestions: 30,
      },
    });
    assert.equal(state.startDisabled, true);
    assert.equal(state.showPathwayRequiredMessage, false);
    assert.equal(state.showReadinessMessage, true);
  });

  it("disables start and shows fallback readiness message when readiness API errors", () => {
    const state = resolveCatStartUiState({
      pathwayId: "us-rn-nclex-rn",
      pathwayChoiceRequired: true,
      readinessLoading: false,
      readiness: {
        ok: false,
        code: "readiness_fetch_failed",
        message: "Could not verify readiness",
      },
    });
    assert.equal(state.startDisabled, true);
    assert.equal(state.showPathwayRequiredMessage, false);
    assert.equal(state.showReadinessMessage, true);
  });
});
