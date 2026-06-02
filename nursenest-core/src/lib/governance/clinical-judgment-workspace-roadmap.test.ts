import assert from "node:assert/strict";
import test from "node:test";
import {
  auditClinicalJudgmentWorkspaceRoadmap,
  CLINICAL_JUDGMENT_WORKSPACES,
  RECOMMENDED_POST_ECG_VENTILATOR_SEQUENCE,
  workspaceForClinicalJudgmentKey,
  type ClinicalJudgmentWorkspaceKey,
} from "./clinical-judgment-workspace-roadmap";

test("post ECG and ventilator sequence prioritizes the five reusable sophistication engines", () => {
  assert.deepEqual(RECOMMENDED_POST_ECG_VENTILATOR_SEQUENCE, [
    "clinical_judgment_engine",
    "multi_patient_assignment",
    "chart_review",
    "timeline_deterioration",
    "medication_administration",
  ] satisfies readonly ClinicalJudgmentWorkspaceKey[]);
});

test("all requested high-priority workspaces are governed", () => {
  const keys = new Set(CLINICAL_JUDGMENT_WORKSPACES.map((workspace) => workspace.key));
  for (const key of [
    "medication_administration",
    "timeline_deterioration",
    "shift_management",
    "handoff_sbar",
    "clinical_skills_decision_trees",
    "fetal_monitoring",
    "ems_scene_assessment",
  ] satisfies readonly ClinicalJudgmentWorkspaceKey[]) {
    assert.ok(keys.has(key), `${key} should be represented in the roadmap`);
  }
});

test("workspace contracts preserve shared shell reuse and cross-profession value", () => {
  for (const workspace of CLINICAL_JUDGMENT_WORKSPACES) {
    assert.equal(workspace.mustReuseSharedShell, true, `${workspace.key} must not fork the learner shell`);
    assert.ok(workspace.requiredDataSurfaces.length >= 3, `${workspace.key} needs realistic patient data surfaces`);
    assert.ok(workspace.requiredDecisions.length >= 3, `${workspace.key} needs active learner decisions`);
    assert.ok(workspace.reusableAcross.length >= 3, `${workspace.key} should serve multiple pathways`);
  }
});

test("medication workspace includes safe medication decision states", () => {
  const workspace = workspaceForClinicalJudgmentKey("medication_administration");

  assert.ok(workspace.requiredDataSurfaces.includes("MAR"));
  assert.ok(workspace.requiredDataSurfaces.includes("allergies"));
  assert.ok(workspace.requiredDataSurfaces.includes("labs"));
  assert.ok(workspace.requiredDataSurfaces.includes("provider orders"));
  assert.ok(workspace.requiredDecisions.includes("administer"));
  assert.ok(workspace.requiredDecisions.includes("hold"));
  assert.ok(workspace.requiredDecisions.includes("clarify order"));
});

test("deterioration workspace includes trend and escalation decisions", () => {
  const workspace = workspaceForClinicalJudgmentKey("timeline_deterioration");

  assert.ok(workspace.requiredDataSurfaces.includes("vital trends"));
  assert.ok(workspace.requiredDataSurfaces.includes("lab trends"));
  assert.ok(workspace.requiredDataSurfaces.includes("ECG progression"));
  assert.ok(workspace.requiredDataSurfaces.includes("ventilator progression"));
  assert.ok(workspace.requiredDecisions.includes("choose escalation threshold"));
});

test("clinical judgment workspace roadmap audit is clean", () => {
  assert.deepEqual(auditClinicalJudgmentWorkspaceRoadmap(), []);
});
