import assert from "node:assert/strict";
import { test } from "node:test";
import type { ClinicalNursingScenario, ClinicalNursingScenarioStage } from "@prisma/client";
import {
  CLINICAL_SCENARIO_PUBLISH_MAX_STAGES,
  CLINICAL_SCENARIO_PUBLISH_MIN_STAGES,
  validateClinicalScenarioReadyToPublish,
} from "@/lib/clinical-scenarios/clinical-scenario-publish-guard";

const baseScenario: ClinicalNursingScenario = {
  id: "sc",
  title: "T",
  pathwayId: "ca-rn-nclex-rn",
  canonicalCategoryId: "cardiovascular",
  tierFocus: "RN_NCLEX_RN",
  difficulty: "INTERMEDIATE",
  patientAgeContext: "50y",
  presentingConcern: "x",
  briefHistory: "y",
  medicationsAllergies: null,
  initialVitals: {},
  assessmentFindings: "z",
  labsDiagnostics: null,
  referencesJson: [],
  isPremium: false,
  publishStatus: "DRAFT",
  createdByUserId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function stage(orderIndex: number, branching: boolean): ClinicalNursingScenarioStage {
  const optionsJson = branching
    ? [
        {
          id: "ok",
          text: "good",
          isCorrect: true,
          rationale: "r",
          consequence: { trajectory: "improves", effect: "unlock" },
        },
        {
          id: "bad",
          text: "bad",
          isCorrect: false,
          rationale: "w",
          consequence: { trajectory: "unchanged", effect: "delay" },
        },
      ]
    : [{ id: "a", label: "A" }];
  return {
    id: `st-${orderIndex}`,
    scenarioId: "sc",
    orderIndex,
    scenarioText: "t",
    vitals: {},
    assessmentFindings: "",
    labUpdates: null,
    questionStem: "q",
    optionsJson,
    correctOptionId: branching ? "ok" : "a",
    rationale: "",
    whyWrongByOptionId: {},
    clinicalJudgmentFocus: "",
    consequencesByOptionId: {},
    nextStageOrder: null,
  };
}

test("validateClinicalScenarioReadyToPublish rejects too few stages", () => {
  const stages = [stage(0, true), stage(1, true)];
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.equal(r.code, "stage_count");
    assert.ok(r.message.includes(String(CLINICAL_SCENARIO_PUBLISH_MIN_STAGES)));
  }
});

test("validateClinicalScenarioReadyToPublish rejects non-contiguous orderIndex", () => {
  const stages = [0, 1, 2, 4, 5].map((i) => stage(i, true));
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "stage_order");
});

test("validateClinicalScenarioReadyToPublish rejects legacy flat options", () => {
  const stages = Array.from({ length: CLINICAL_SCENARIO_PUBLISH_MIN_STAGES }, (_, i) => stage(i, false));
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "branching_options");
});

test("validateClinicalScenarioReadyToPublish accepts five-stage branching scenario", () => {
  const stages = [0, 1, 2, 3, 4].map((i) => stage(i, true));
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, true);
});

test("validateClinicalScenarioReadyToPublish accepts six-stage cap", () => {
  const stages = [0, 1, 2, 3, 4, 5].map((i) => stage(i, true));
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, true);
});

test("validateClinicalScenarioReadyToPublish rejects seventh stage", () => {
  const stages = [0, 1, 2, 3, 4, 5, 6].map((i) => stage(i, true));
  const r = validateClinicalScenarioReadyToPublish({ ...baseScenario, stages });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "stage_count");
  assert.ok(r.message.includes(String(CLINICAL_SCENARIO_PUBLISH_MAX_STAGES)));
});
