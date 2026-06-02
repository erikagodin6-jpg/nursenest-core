/**
 * Consolidated handoff guardrails — pure/static checks for pathway content isolation
 * and CAT feedback modes. Complements practice-adaptive-setup.test.ts and pathway-entitlements.test.ts.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  buildCatExamSimulationCreatePayload,
  buildPracticeAdaptiveCreatePayload,
} from "@/components/student/pathway-cat-start-payload";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

function shellFromPathwayId(pathwayId: string): PracticeTestPathwayClientShell {
  const p = getExamPathwayById(pathwayId);
  assert.ok(p, `pathway ${pathwayId}`);
  return {
    id: p.id,
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
    examCode: p.examCode,
    shortName: p.shortName,
    examFamily: p.examFamily,
  };
}

describe("pre-developer handoff guardrails", () => {
  it("US RN and Canada RPN pathway question pools use disjoint contentExamKeys (no shared exam column)", () => {
    const rn = getExamPathwayById("us-rn-nclex-rn");
    const rpn = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(rn && rpn, "fixture pathways must exist");
    const a = new Set(rn.contentExamKeys);
    const b = new Set(rpn.contentExamKeys);
    for (const k of a) {
      assert.ok(!b.has(k), `overlap on exam key ${k} — RN and RPN pools must stay isolated`);
    }
  });

  it("CAT exam simulation stays in test feedback mode (no rationale during session)", () => {
    const p = buildCatExamSimulationCreatePayload(shellFromPathwayId("us-rn-nclex-rn"));
    assert.equal(p.catExamFeedbackMode, "test");
    assert.equal(p.catPresentationMode, "exam_simulation");
  });

  it("adaptive practice keeps study feedback (rationale after questions)", () => {
    const shell = shellFromPathwayId("ca-rpn-rex-pn");
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: shell.id,
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 30,
    });
    assert.equal(p.catExamFeedbackMode, "study");
    assert.notEqual(p.catPresentationMode, "exam_simulation");
  });
});
