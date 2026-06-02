import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AnomalySeverity,
  ContentQualityCheckKind,
  LearnerPredictionFamily,
  OperationalDiagnosticReportKind,
  OperationalSignalKind,
  RemediationOrchestrationIntent,
} from "@/lib/platform/phase12";

describe("phase12 platform intelligence contracts", () => {
  it("defines operational signals and anomaly severity", () => {
    assert.ok(OperationalSignalKind.releaseGateFailure.startsWith("ops."));
    assert.equal(AnomalySeverity.critical, "critical");
  });

  it("scopes learner prediction families without clinical claims in identifiers", () => {
    assert.ok(LearnerPredictionFamily.dropoutRisk.includes("risk"));
    assert.equal(LearnerPredictionFamily.cohortRiskAggregate.includes("cohort"), true);
  });

  it("enumerates content quality checks for automation boundaries", () => {
    assert.ok(Object.values(ContentQualityCheckKind).every((v) => v.startsWith("content.")));
  });

  it("keeps operational diagnostics read-only report kinds", () => {
    assert.ok(OperationalDiagnosticReportKind.envConfigDrift.includes("env"));
  });

  it("defines remediation orchestration intents", () => {
    assert.equal(RemediationOrchestrationIntent.crossSurfaceHandoff, "remediation.cross_surface_handoff");
  });
});
