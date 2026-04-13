import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveReadinessStartQuestionCount } from "@/components/student/pathway-cat-start-payload";

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
});
