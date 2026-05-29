import assert from "node:assert/strict";
import test from "node:test";
import {
  auditStrategicDifferentiationRoadmap,
  phaseForStrategicRoadmapKey,
  STRATEGIC_ROADMAP_PHASES,
  summarizeStrategicRoadmapStatus,
  UNIVERSAL_STRATEGIC_THEMES,
  type StrategicRoadmapPhaseKey,
} from "./strategic-differentiation-roadmap";

const REQUIRED_PHASE_KEYS: readonly StrategicRoadmapPhaseKey[] = [
  "adaptive_learning_command_center",
  "exam_success_forecasting",
  "ai_tutor_system",
  "clinical_skills_ecosystem_expansion",
  "pharmacology_learning_ecosystem",
  "exam_blueprint_compliance_engine",
  "question_quality_intelligence",
  "ai_content_auditor",
  "institutional_licensing_platform",
  "new_grad_residency_platform",
  "clinical_placement_companion",
  "nursenest_academy",
  "executive_business_command_center",
  "reliability_first_architecture",
] as const;

test("the strategic differentiation roadmap contains the requested 14 phases in order", () => {
  assert.equal(STRATEGIC_ROADMAP_PHASES.length, 14);
  assert.deepEqual(
    STRATEGIC_ROADMAP_PHASES.map((phase) => phase.key),
    REQUIRED_PHASE_KEYS,
  );
  assert.deepEqual(
    STRATEGIC_ROADMAP_PHASES.map((phase) => phase.phaseNumber),
    Array.from({ length: 14 }, (_, index) => index + 1),
  );
});

test("every roadmap phase preserves the universal NurseNest product requirements", () => {
  for (const phase of STRATEGIC_ROADMAP_PHASES) {
    assert.equal(phase.mustRemainUnified, true, `${phase.key} must not become a disconnected product`);
    for (const theme of UNIVERSAL_STRATEGIC_THEMES) {
      assert.ok(phase.strategicThemes.includes(theme), `${phase.key} must be ${theme}`);
    }
    assert.ok(phase.analyticsEvents.length >= 2, `${phase.key} must be measurable`);
    assert.ok(phase.validationGates.length >= 3, `${phase.key} needs validation gates`);
    assert.ok(phase.evidenceRequired.length >= 3, `${phase.key} needs completion evidence`);
  }
});

test("Adaptive Learning Command Center captures the no-decision study experience", () => {
  const phase = phaseForStrategicRoadmapKey("adaptive_learning_command_center");

  assert.ok(phase.requiredCapabilities.includes("today's study plan"));
  assert.ok(phase.requiredCapabilities.includes("predicted pass probability display"));
  assert.ok(phase.requiredCapabilities.includes("Start My Session orchestration"));
  assert.ok(phase.sharedSurfaces.includes("/app/study-coach"));
  assert.ok(phase.analyticsEvents.includes("recommended_session_started"));
});

test("Executive Business Command Center is represented as a foundation already implemented", () => {
  const phase = phaseForStrategicRoadmapKey("executive_business_command_center");

  assert.equal(phase.status, "implemented_foundation");
  assert.ok(phase.sharedSurfaces.includes("/admin/business-command-center"));
  for (const capability of ["MRR", "ARR", "uptime", "referral revenue", "institution revenue", "system health"]) {
    assert.ok(phase.requiredCapabilities.includes(capability), `${capability} should be tracked`);
  }
});

test("Reliability First Architecture protects study launches before deployments reach learners", () => {
  const phase = phaseForStrategicRoadmapKey("reliability_first_architecture");

  assert.ok(phase.requiredCapabilities.includes("deployment blocking tests"));
  assert.ok(phase.requiredCapabilities.includes("automatic rollbacks"));
  assert.ok(phase.requiredCapabilities.includes("Emergency Study Mode"));
  assert.ok(phase.requiredCapabilities.includes("synthetic monitoring"));
  assert.ok(phase.validationGates.includes("pre-deploy learner suite"));
});

test("roadmap status summary remains honest about foundations versus complete builds", () => {
  const summary = summarizeStrategicRoadmapStatus();

  assert.equal(summary.implemented_foundation, 1);
  assert.ok(summary.partial_foundation >= 1);
  assert.ok(summary.requires_content_scale >= 1);
  assert.ok(summary.planned >= 1);
});

test("strategic differentiation roadmap audit is clean", () => {
  assert.deepEqual(auditStrategicDifferentiationRoadmap(), []);
});
