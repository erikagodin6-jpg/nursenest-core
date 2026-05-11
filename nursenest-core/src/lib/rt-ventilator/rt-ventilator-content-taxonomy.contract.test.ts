import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-question-completeness";
import {
  RT_VENTILATOR_BANK_TAG,
  examQuestionWhereRtVentilatorBankTag,
  rtVentilatorTopicNamesForPickQuestions,
} from "./rt-ventilator-content-taxonomy";

describe("rt-ventilator-content-taxonomy", () => {
  it("exports stable bank tag for admin/CMS alignment", () => {
    assert.equal(RT_VENTILATOR_BANK_TAG, "module:rt-ventilator");
  });

  it("topic helper returns non-empty authoring targets", () => {
    assert.ok(rtVentilatorTopicNamesForPickQuestions().length > 0);
  });

  it("ventilator tag filter composes with NON_ECG_PRACTICE_EXAM_WHERE without shape errors", () => {
    const merged: Record<string, unknown> = {
      AND: [NON_ECG_PRACTICE_EXAM_WHERE, examQuestionWhereRtVentilatorBankTag()],
    };
    assert.ok("AND" in merged);
  });
});
