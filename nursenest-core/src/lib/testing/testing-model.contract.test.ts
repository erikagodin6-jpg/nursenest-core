/**
 * Regression: CNPLE must stay LOFT — never CAT product language or engine routing.
 *
 * Run: node --import tsx --test src/lib/testing/testing-model.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  CNPLE_PATHWAY_ID,
  getExamAnalyticsContext,
  getTestingModelAnalyticsDimensions,
  getTestingModelDefinition,
  getLearnerExamsSurfaceLabel,
  getTestingModelForPathwayId,
  pathwayUsesCatEngine,
  pathwayUsesLoftEngine,
  resolveLearnerExamsNavHref,
} from "@/lib/testing/testing-model";

const ROOT = join(process.cwd(), "src");

function src(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("testing-model canonical map", () => {
  it("CNPLE is LOFT", () => {
    assert.equal(getTestingModelForPathwayId(CNPLE_PATHWAY_ID), "LOFT");
    assert.equal(pathwayUsesLoftEngine(CNPLE_PATHWAY_ID), true);
    assert.equal(pathwayUsesCatEngine(CNPLE_PATHWAY_ID), false);
  });

  it("NCLEX-RN is CAT", () => {
    assert.equal(getTestingModelForPathwayId("us-rn-nclex-rn"), "CAT");
    assert.equal(pathwayUsesCatEngine("us-rn-nclex-rn"), true);
  });

  it("CNPLE learner nav uses LOFT Simulation label and case route", () => {
    assert.equal(getLearnerExamsSurfaceLabel(CNPLE_PATHWAY_ID), "LOFT Simulation");
    assert.equal(resolveLearnerExamsNavHref(CNPLE_PATHWAY_ID), "/app/cases/cnple");
  });

  it("CNPLE analytics never emits CAT examModel", () => {
    const ctx = getExamAnalyticsContext(CNPLE_PATHWAY_ID);
    assert.equal(ctx.examModel, "LOFT");
    assert.equal(ctx.simulationType, "canadian_np_readiness");
    assert.notEqual(ctx.examModel, "CAT");
  });

  it("CNPLE analytics dimensions use blueprint_constrained psychometrics", () => {
    const dims = getTestingModelAnalyticsDimensions(CNPLE_PATHWAY_ID);
    assert.equal(dims.psychometricStyle, "blueprint_constrained");
    assert.equal(dims.remediationStyle, "competency_balance");
    const def = getTestingModelDefinition("LOFT");
    assert.equal(def.allowsDifficultyAdaptation, false);
  });
});

describe("CNPLE CAT language regression (grep contracts)", () => {
  const CNpleLearnerFiles = [
    "components/student/learner-np-exam-practice-pick-surface.tsx",
    "components/cases/cnple-longitudinal-case-shell.tsx",
    "lib/learner/premium-dashboard-launch-tiles.ts",
    "components/student/loft-simulation-session-copy.ts",
  ];

  for (const file of CNpleLearnerFiles) {
    it(`${file} does not claim CNPLE is CAT or adaptive`, () => {
      const content = src(file);
      assert.doesNotMatch(content, /CNPLE.{0,80}(?:is|uses) (?:a )?(?:computerized )?adaptive/si);
      assert.doesNotMatch(content, /CNPLE.{0,40}\bCAT\b exam/si);
    });
  }

  it("pathway-entitlements-policy blocks CAT engine for CNPLE", () => {
    const content = src("lib/exam-pathways/pathway-entitlements-policy.ts");
    assert.match(content, /pathwayUsesCatEngine/);
  });

  it("study-loop-cat-routing routes CNPLE to LOFT simulation", () => {
    const content = src("lib/exam-pathways/study-loop-cat-routing.ts");
    assert.match(content, /pathwayUsesLoftEngine/);
    assert.match(content, /\/app\/cases\/cnple/);
  });

  it("case-session-analytics includes governed testing dimensions", () => {
    const content = src("lib/cases/case-session-analytics.ts");
    assert.match(content, /toTestingModelPostHogFields/);
    assert.match(content, /assertPathwayPostHogCapture/);
  });
});
