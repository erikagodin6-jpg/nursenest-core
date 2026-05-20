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
  buildCaseSessionAnalytics,
  toCaseAnalyticsPostHogEvent,
} from "@/lib/cases/case-session-analytics";
import { buildPostExamPerformanceReportFromCase } from "@/lib/learner/post-exam-performance-report";
import {
  TESTING_MODEL_DEFINITIONS,
  assertCatAdaptiveEngineAllowed,
  assertCatEngineAllowedForPathwayId,
  assertCatTelemetryAllowedForPathway,
  assertLoftPsychometricIntegrity,
  assertNoCatLanguageForLoftPathway,
  getCoachingPolicyForPathway,
  getCoachingPolicyForTestingModel,
  getLearnerDashboardProfile,
  getTestingEngineCapabilities,
  getTestingModelAnalyticsDimensions,
  getTestingModelDefinition,
  logTestingModelScopedEvent,
  modelSupportsCapability,
  pathwaySupportsCapability,
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

describe("capability-based extensibility", () => {
  it("CNPLE pathway cannot use adaptive selection", () => {
    assert.equal(pathwaySupportsCapability(CNPLE_PATHWAY_ID, "adaptive_selection"), false);
    assert.equal(pathwaySupportsCapability(CNPLE_PATHWAY_ID, "stable_form_assembly"), true);
  });

  it("NCLEX RN pathway supports adaptive selection", () => {
    assert.equal(pathwaySupportsCapability("us-rn-nclex-rn", "adaptive_selection"), true);
  });

  it("assertLoftPsychometricIntegrity passes for CNPLE", () => {
    assert.doesNotThrow(() => assertLoftPsychometricIntegrity(CNPLE_PATHWAY_ID));
  });

  it("assertCatAdaptiveEngineAllowed throws for CNPLE", () => {
    assert.throws(() => assertCatAdaptiveEngineAllowed(CNPLE_PATHWAY_ID), /adaptive_selection/);
  });
});

describe("dashboard governance", () => {
  it("LOFT dashboard hides CAT progression semantics", () => {
    const profile = getLearnerDashboardProfile(CNPLE_PATHWAY_ID);
    assert.equal(profile.showAdaptiveProgression, false);
    assert.equal(profile.showCatStreakSemantics, false);
    assert.match(profile.primaryMetricLabel, /competency balance/i);
  });

  it("CAT dashboard allows adaptive progression", () => {
    const profile = getLearnerDashboardProfile("us-rn-nclex-rn");
    assert.equal(profile.showAdaptiveProgression, true);
  });
});

describe("telemetry governance runtime", () => {
  it("logTestingModelScopedEvent blocks cat_ events on LOFT pathways", () => {
    assert.throws(
      () => logTestingModelScopedEvent("practice_test", "cat_advance", CNPLE_PATHWAY_ID, {}),
      /CAT telemetry forbidden/,
    );
  });

  it("logTestingModelScopedEvent allows loft namespaced events on CNPLE", () => {
    assert.doesNotThrow(() =>
      logTestingModelScopedEvent("cnple_case", "loft_simulation_complete", CNPLE_PATHWAY_ID, {}),
    );
  });
});

describe("coaching policy on pathway", () => {
  it("CNPLE coaching policy matches LOFT semantics", () => {
    const policy = getCoachingPolicyForPathway(CNPLE_PATHWAY_ID);
    assert.equal(policy.model, "LOFT");
    assert.equal(policy.emphasizeAdaptiveProgression, false);
    assert.equal(policy.followUpAdaptiveSessionTitle, null);
  });
});

describe("implementation wiring (static)", () => {
  it("post-exam report uses coaching policy", () => {
    const content = src("lib/learner/post-exam-performance-report.ts");
    assert.match(content, /getCoachingPolicyForPathway/);
    assert.match(content, /loft_simulation/);
  });

  it("cat-session uses engine and telemetry guards", () => {
    const content = src("lib/practice-tests/cat-session.ts");
    assert.match(content, /assertCatEngineAllowedForPathwayId/);
    assert.match(content, /assertCatAdaptiveEngineAllowed/);
    assert.match(content, /logTestingModelScopedEvent/);
  });

  it("marketing copy validates psychometric language", () => {
    const content = src("lib/exam-pathways/pathway-cat-marketing-copy.ts");
    assert.match(content, /validateTestingModelMarketingLanguage/);
  });

  it("coaching report validates pathway copy", () => {
    const content = src("lib/learner/post-exam-coaching/build-coaching-report.ts");
    assert.match(content, /validateCoachingCopyForPathway/);
  });

  it("loft policy asserts psychometric integrity", () => {
    const content = src("lib/practice-tests/loft-simulation-policy.ts");
    assert.match(content, /assertLoftPsychometricIntegrity/);
  });

  it("cat-engine asserts adaptive capability", () => {
    const content = src("lib/exams/cat-engine.ts");
    assert.match(content, /assertModelSupportsCapability/);
  });

  it("case analytics emits full testing dimensions", () => {
    const content = src("lib/cases/case-session-analytics.ts");
    assert.match(content, /toTestingModelPostHogFields/);
    assert.match(content, /assertPathwayPostHogCapture/);
  });
});

describe("CNPLE second-pass isolation (routing + UI + telemetry)", () => {
  it("cat-launch redirects CNPLE to LOFT case hub", () => {
    const content = src("app/(student)/app/(learner)/practice-tests/cat-launch/page.tsx");
    assert.match(content, /isCnplePathway/);
    assert.match(content, /redirect\("\/app\/cases\/cnple"\)/);
  });

  it("post-exam UI uses LOFT hero for loft_simulation sessions", () => {
    const content = src("components/student/post-exam-adaptive-report.tsx");
    assert.match(content, /LoftSimulationResultsHero/);
    assert.match(content, /report\.sessionKind === "loft_simulation"/);
    assert.doesNotMatch(
      content,
      /loft_simulation[\s\S]{0,400}<CatResultsHero/,
      "LOFT sessions must not render CatResultsHero",
    );
  });

  it("CNPLE case completion routes through governed post-exam report", () => {
    const content = src("components/cases/cnple-case-completion.tsx");
    assert.match(content, /buildPostExamPerformanceReportFromCase/);
    assert.match(content, /PostExamAdaptiveReport/);
  });

  it("practice-tests CAT create filters LOFT pathways via entitlement policy", () => {
    const content = src("app/api/practice-tests/route.ts");
    assert.match(content, /pathwayAllowsCatAdaptiveStart/);
  });

  it("case PostHog shaper never prefixes cat_", () => {
    const payload = buildCaseSessionAnalytics({
      scenarioId: "audit-scenario",
      mode: "SIMULATION",
      decisions: [],
      score: {
        totalSteps: 12,
        correctCount: 8,
        score0to100: 67,
        weakDomains: ["pharmacotherapeutics"],
        strongDomains: ["clinical-assessment"],
        trajectoryProfile: { optimal: 6, acceptable: 3, suboptimal: 2, harmful: 1 },
        recommendations: ["Review pharmacology safety checks"],
        remediationPriority: [],
      },
      trajectoryState: {
        stabilityState: "stable",
        cumulativeRiskScore: 0,
        unresolvedClinicalIssues: [],
        activeSafetyFlags: [],
      },
      completedAt: new Date("2026-05-20T12:00:00.000Z"),
    });
    const event = toCaseAnalyticsPostHogEvent(payload);
    for (const key of Object.keys(event)) {
      assert.ok(!/^cat_/i.test(key), `CNPLE case analytics must not emit cat_* key: ${key}`);
      assert.equal(event.testing_model, "LOFT");
      assert.equal(event.psychometric_style, "blueprint_constrained");
    }
  });

  it("LOFT case post-exam report omits CAT pass outlook fields", () => {
    const report = buildPostExamPerformanceReportFromCase({
      score: {
        totalSteps: 10,
        correctCount: 7,
        score0to100: 70,
        weakDomains: ["diagnosis-differential"],
        strongDomains: ["professional-practice"],
        trajectoryProfile: { optimal: 5, acceptable: 3, suboptimal: 1, harmful: 1 },
        recommendations: ["Re-run a blueprint-balanced simulation"],
        remediationPriority: [],
      },
      caseTitle: "Audit case",
      mode: "SIMULATION",
    });
    assert.equal(report.sessionKind, "loft_simulation");
    assert.equal(report.overall.passOutlookPct, null);
    assert.equal(report.overall.passOutlookBand, null);
    assert.equal(report.overall.readinessResult, null);
  });
});
