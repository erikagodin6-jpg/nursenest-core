/**
 * Psychometric governance regression matrix.
 *
 * Run: node --import tsx --test src/lib/testing/psychometric-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  TESTING_MODEL_DEFINITIONS,
  assertCatEngineAllowedForPathwayId,
  assertCatTelemetryAllowedForPathway,
  assertNoCatLanguageForLoftPathway,
  getCoachingPolicyForTestingModel,
  getTestingEngineCapabilities,
  getTestingModelAnalyticsDimensions,
  getTestingModelDefinition,
  validatePsychometricCopyForModel,
  validateTestingModelMarketingLanguage,
} from "@/lib/testing/testing-model";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

const ROOT = join(process.cwd(), "src");

function src(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("testing model behavioral contracts", () => {
  it("LOFT definition forbids adaptive psychometrics", () => {
    const loft = getTestingModelDefinition("LOFT");
    assert.equal(loft.allowsDifficultyAdaptation, false);
    assert.equal(loft.allowsConfidenceEstimation, false);
    assert.equal(loft.allowsAdaptiveTermination, false);
    assert.equal(loft.psychometricStyle, "blueprint_constrained");
    assert.equal(loft.remediationStyle, "competency_balance");
  });

  it("CAT definition allows adaptive psychometrics", () => {
    const cat = getTestingModelDefinition("CAT");
    assert.equal(cat.allowsDifficultyAdaptation, true);
    assert.equal(cat.allowsConfidenceEstimation, true);
    assert.equal(cat.allowsAdaptiveTermination, true);
  });

  it("every TestingModel has a full definition", () => {
    for (const model of ["CAT", "LOFT", "LINEAR"] as const) {
      assert.ok(TESTING_MODEL_DEFINITIONS[model]);
    }
  });
});

describe("engine capability boundaries", () => {
  it("LOFT engine cannot adapt", () => {
    const caps = getTestingEngineCapabilities("LOFT");
    assert.equal(caps.supportsAdaptiveSelection, false);
    assert.equal(caps.supportsDifficultyEscalation, false);
    assert.equal(caps.supportsBlueprintAssembly, true);
    assert.equal(caps.supportsStableFormAssembly, true);
  });

  it("CAT engine can adapt", () => {
    const caps = getTestingEngineCapabilities("CAT");
    assert.equal(caps.supportsAdaptiveSelection, true);
    assert.equal(caps.supportsDifficultyEscalation, true);
  });

  it("blocks CAT session creation for CNPLE", () => {
    const guard = assertCatEngineAllowedForPathwayId(CNPLE_PATHWAY_ID);
    assert.equal(guard.ok, false);
    if (!guard.ok) {
      assert.match(guard.message, /LOFT/i);
    }
  });

  it("forbids CAT telemetry on LOFT pathways", () => {
    assert.throws(() => assertCatTelemetryAllowedForPathway(CNPLE_PATHWAY_ID, "cat_advance"), /CAT telemetry forbidden/);
  });
});

describe("LOFT psychometric isolation", () => {
  it("flags adaptive product claims", () => {
    const v = validatePsychometricCopyForModel("LOFT", "The exam adapted to your performance.");
    assert.ok(v.length > 0);
  });

  it("allows educational contrast copy", () => {
    const v = validatePsychometricCopyForModel(
      "LOFT",
      "CNPLE uses LOFT linear format, not computerized adaptive testing.",
    );
    assert.equal(v.length, 0);
  });

  it("assertNoCatLanguageForLoftPathway throws on leakage", () => {
    assert.throws(
      () => assertNoCatLanguageForLoftPathway(CNPLE_PATHWAY_ID, "Difficulty increased on harder items."),
      /LOFT psychometric isolation/,
    );
  });
});

describe("coaching policy separation", () => {
  it("LOFT coaching avoids adaptive follow-up", () => {
    const policy = getCoachingPolicyForTestingModel("LOFT");
    assert.equal(policy.followUpAdaptiveSessionTitle, null);
    assert.equal(policy.emphasizeAdaptiveProgression, false);
    assert.match(policy.followUpSimulationReason, /blueprint-balanced/i);
  });

  it("CAT coaching allows adaptive follow-up", () => {
    const policy = getCoachingPolicyForTestingModel("CAT");
    assert.ok(policy.followUpAdaptiveSessionTitle);
    assert.equal(policy.emphasizeAdaptiveProgression, true);
  });
});

describe("analytics governance", () => {
  it("CNPLE analytics dimensions are LOFT-only", () => {
    const dims = getTestingModelAnalyticsDimensions(CNPLE_PATHWAY_ID);
    assert.equal(dims.testingModel, "LOFT");
    assert.equal(dims.analyticsModel, "loft");
    assert.equal(dims.psychometricStyle, "blueprint_constrained");
    assert.equal(dims.remediationStyle, "competency_balance");
    assert.equal(dims.simulationFamily, "canadian_np_readiness");
  });
});

describe("marketing governance", () => {
  it("rejects CNPLE adaptive exam claims", () => {
    const audit = validateTestingModelMarketingLanguage(
      CNPLE_PATHWAY_ID,
      "CNPLE is a computerized adaptive test for Canadian NPs.",
    );
    assert.equal(audit.ok, false);
  });
});

describe("implementation wiring (static)", () => {
  it("post-exam report uses coaching policy", () => {
    const content = src("lib/learner/post-exam-performance-report.ts");
    assert.match(content, /getCoachingPolicyForPathway/);
    assert.match(content, /loft_simulation/);
  });

  it("cat-session uses engine guard", () => {
    const content = src("lib/practice-tests/cat-session.ts");
    assert.match(content, /assertCatEngineAllowedForPathwayId/);
  });

  it("case analytics emits full testing dimensions", () => {
    const content = src("lib/cases/case-session-analytics.ts");
    assert.match(content, /psychometric_style/);
    assert.match(content, /getTestingModelAnalyticsDimensions/);
  });
});
