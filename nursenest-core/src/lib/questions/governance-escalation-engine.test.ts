import test from "node:test";
import assert from "node:assert/strict";

import { evaluateGovernanceEscalation } from "./governance-escalation-engine";

test("healthy item remains monitor level", () => {
  const result = evaluateGovernanceEscalation({
    clinicalQualityScore: 95,
    psychometricScore: 92,
    evidenceScore: 94,
    contradictionScore: 96,
    clinicalRiskFlags: 0,
    publishEligible: true,
  });

  assert.equal(result.escalationLevel, "monitor");
  assert.equal(result.remediationRequired, false);
});

test("moderate degradation triggers review", () => {
  const result = evaluateGovernanceEscalation({
    clinicalQualityScore: 68,
    psychometricScore: 70,
    evidenceScore: 88,
    contradictionScore: 90,
  });

  assert.ok(
    result.escalationLevel === "review" ||
      result.escalationLevel === "priority-review",
  );
});

test("multiple severe failures trigger retirement", () => {
  const result = evaluateGovernanceEscalation({
    clinicalQualityScore: 45,
    psychometricScore: 42,
    evidenceScore: 38,
    contradictionScore: 40,
    clinicalRiskFlags: 4,
    staleGuideline: true,
    negativeDiscrimination: true,
    publishEligible: false,
  });

  assert.equal(result.escalationLevel, "retire");
  assert.equal(result.autoRetireRecommended, true);
});

test("negative discrimination increases escalation", () => {
  const result = evaluateGovernanceEscalation({
    clinicalQualityScore: 88,
    psychometricScore: 60,
    evidenceScore: 90,
    contradictionScore: 92,
    negativeDiscrimination: true,
  });

  assert.ok(result.escalationScore >= 30);
  assert.equal(result.remediationRequired, true);
});
