import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { clinicalScenarioMarketingPageBlocked } from "@/lib/clinical-scenarios/clinical-scenario-marketing-access";
import { clinicalScenariosRobotsMetadata } from "@/lib/clinical-scenarios/clinical-scenarios-metadata";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { patientTrajectoryFromConsequence } from "@/lib/clinical-scenarios/clinical-scenario-trajectory";
import {
  mapClinicalNursingScenarioToPreview,
  redactPremiumStagesForFreeLearner,
} from "@/lib/clinical-scenarios/map-clinical-scenario-to-preview";
import type { ClinicalNursingScenario, ClinicalNursingScenarioStage } from "@prisma/client";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
});

test("clinical feature flag defaults off", () => {
  delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
  assert.equal(isClinicalScenariosPubliclyEnabled(), false);
  process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS = "true";
  assert.equal(isClinicalScenariosPubliclyEnabled(), true);
});

test("clinicalScenariosRobotsMetadata is noindex/nofollow", () => {
  const r = clinicalScenariosRobotsMetadata();
  assert.equal(r?.index, false);
  assert.equal(r?.follow, false);
});

test("marketing clinical hub is blocked in production when flag is off", () => {
  const prevEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
    assert.equal(clinicalScenarioMarketingPageBlocked(), true);
    process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS = "true";
    assert.equal(clinicalScenarioMarketingPageBlocked(), false);
  } finally {
    process.env.NODE_ENV = prevEnv;
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
  }
});

test("patient trajectory maps consequence strings", () => {
  assert.equal(patientTrajectoryFromConsequence("patient improves"), "improving");
  assert.equal(patientTrajectoryFromConsequence("patient deteriorates"), "deteriorating");
  assert.equal(patientTrajectoryFromConsequence("unchanged"), "stable");
});

test("mapClinicalNursingScenarioToPreview preserves pathway and stages", () => {
  const stage: ClinicalNursingScenarioStage = {
    id: "st1",
    scenarioId: "sc1",
    orderIndex: 0,
    scenarioText: "text",
    vitals: { HR: "80" },
    assessmentFindings: "af",
    labUpdates: null,
    questionStem: "stem?",
    optionsJson: [{ id: "a", label: "A" }],
    correctOptionId: "a",
    rationale: "because",
    whyWrongByOptionId: {},
    clinicalJudgmentFocus: "focus",
    consequencesByOptionId: { a: "stable" },
    nextStageOrder: null,
  };
  const scenario: ClinicalNursingScenario = {
    id: "sc1",
    title: "T",
    pathwayId: "ca-rpn-rex-pn",
    canonicalCategoryId: "respiratory",
    tierFocus: "RPN_PN",
    difficulty: "FOUNDATION",
    patientAgeContext: "50y",
    presentingConcern: "cough",
    briefHistory: "hx",
    medicationsAllergies: null,
    initialVitals: { BP: "120/80" },
    assessmentFindings: "wheeze",
    labsDiagnostics: null,
    referencesJson: [],
    isPremium: false,
    publishStatus: "DRAFT",
    createdByUserId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const m = mapClinicalNursingScenarioToPreview({ ...scenario, stages: [stage] });
  assert.equal(m.pathwayId, "ca-rpn-rex-pn");
  assert.equal(m.stages.length, 1);
  assert.equal(m.stages[0]!.correctOptionId, "a");
  assert.equal(m.isPremium, false);
});

test("mapClinicalNursingScenarioToPreview sets isPremium from referencesJson", () => {
  const stage: ClinicalNursingScenarioStage = {
    id: "st1",
    scenarioId: "sc1",
    orderIndex: 0,
    scenarioText: "text",
    vitals: {},
    assessmentFindings: "af",
    labUpdates: null,
    questionStem: "stem?",
    optionsJson: [{ id: "a", label: "A" }],
    correctOptionId: "a",
    rationale: "because",
    whyWrongByOptionId: {},
    clinicalJudgmentFocus: "focus",
    consequencesByOptionId: { a: "stable" },
    nextStageOrder: null,
  };
  const scenario: ClinicalNursingScenario = {
    id: "sc1",
    title: "T",
    pathwayId: "ca-rpn-rex-pn",
    canonicalCategoryId: "respiratory",
    tierFocus: "RPN_PN",
    difficulty: "FOUNDATION",
    patientAgeContext: "50y",
    presentingConcern: "cough",
    briefHistory: "hx",
    medicationsAllergies: null,
    initialVitals: { BP: "120/80" },
    assessmentFindings: "wheeze",
    labsDiagnostics: null,
    referencesJson: [{ kind: "premium", isPremium: true }],
    isPremium: false,
    publishStatus: "DRAFT",
    createdByUserId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const m = mapClinicalNursingScenarioToPreview({ ...scenario, stages: [stage] });
  assert.equal(m.isPremium, true);
});

test("mapClinicalNursingScenarioToPreview sets isPremium from column when references omit marker", () => {
  const stage: ClinicalNursingScenarioStage = {
    id: "st1",
    scenarioId: "sc1",
    orderIndex: 0,
    scenarioText: "text",
    vitals: {},
    assessmentFindings: "af",
    labUpdates: null,
    questionStem: "stem?",
    optionsJson: [{ id: "a", label: "A" }],
    correctOptionId: "a",
    rationale: "because",
    whyWrongByOptionId: {},
    clinicalJudgmentFocus: "focus",
    consequencesByOptionId: { a: "stable" },
    nextStageOrder: null,
  };
  const scenario: ClinicalNursingScenario = {
    id: "sc1",
    title: "T",
    pathwayId: "ca-rpn-rex-pn",
    canonicalCategoryId: "respiratory",
    tierFocus: "RPN_PN",
    difficulty: "FOUNDATION",
    patientAgeContext: "50y",
    presentingConcern: "cough",
    briefHistory: "hx",
    medicationsAllergies: null,
    initialVitals: { BP: "120/80" },
    assessmentFindings: "wheeze",
    labsDiagnostics: null,
    referencesJson: [],
    isPremium: true,
    publishStatus: "DRAFT",
    createdByUserId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const m = mapClinicalNursingScenarioToPreview({ ...scenario, stages: [stage] });
  assert.equal(m.isPremium, true);
});

test("redactPremiumStagesForFreeLearner keeps first stage only for premium + locked", () => {
  const s0 = {
    id: "a",
    orderIndex: 0,
    scenarioText: "t0",
    vitals: {},
    assessmentFindings: "",
    labUpdates: null,
    questionStem: "q0",
    optionsJson: [],
    correctOptionId: "x",
    rationale: "",
    whyWrongByOptionId: {},
    clinicalJudgmentFocus: "",
    consequencesByOptionId: {},
    nextStageOrder: null,
  };
  const s1 = { ...s0, id: "b", orderIndex: 1, questionStem: "q1" };
  const base = mapClinicalNursingScenarioToPreview({
    id: "sc",
    title: "T",
    pathwayId: "p",
    canonicalCategoryId: "cardiovascular",
    tierFocus: "RN_NCLEX_RN",
    difficulty: "ADVANCED",
    patientAgeContext: "40y",
    presentingConcern: "c",
    briefHistory: "h",
    medicationsAllergies: null,
    initialVitals: {},
    assessmentFindings: "",
    labsDiagnostics: null,
    referencesJson: [],
    isPremium: true,
    publishStatus: "APPROVED",
    createdByUserId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    stages: [s0, s1] as ClinicalNursingScenarioStage[],
  });
  const redacted = redactPremiumStagesForFreeLearner(base, { premiumUnlocked: false, allowStaffFullPreview: false });
  assert.equal(redacted.stages.length, 1);
  assert.equal(redacted.stages[0]!.id, "a");
});
