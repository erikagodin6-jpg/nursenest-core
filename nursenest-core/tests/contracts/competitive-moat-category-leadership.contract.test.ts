import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CompetencyEvidence } from "@/lib/competencies/competency-registry";
import {
  buildCompetencyClearances,
  buildInstitutionCohortView,
  buildIntelligentRemediationPlan,
  buildMasteryPassports,
  buildPersonalLearningTwin,
  buildPersonalStudyCoachPlan,
  buildReadinessForecast,
  CAREER_LONG_LEARNING_ROADMAP,
  createHyperkalemiaGraphSeed,
  nextCareerStages,
  traverseTopicGraph,
} from "@/lib/moat";

describe("competitive moat and category leadership engines", () => {
  it("connects hyperkalemia across the knowledge graph into a remediation path", () => {
    const graph = createHyperkalemiaGraphSeed();
    const traversal = traverseTopicGraph(graph, "hyperkalemia");

    assert.deepEqual(
      traversal.remediationPath.map((node) => node.type),
      ["lesson", "flashcard", "question", "ecg", "lab", "simulation", "readiness_domain", "study_plan"],
    );
    assert.equal(traversal.missingAssetTypes.length, 0);
    assert.ok(traversal.edges.some((edge) => edge.relation === "simulates"));
  });

  it("builds a personal learning twin that identifies weak, forgotten, and misunderstood areas", () => {
    const twin = buildPersonalLearningTwin({
      learnerId: "learner-1",
      previousOverallKnowledge: 0.4,
      signals: [
        {
          topic: "hyperkalemia",
          accuracy: 0.52,
          retention: 0.48,
          confidence: 0.88,
          clinicalJudgment: 0.45,
          prioritization: 0.5,
          attempts: 8,
          lastSeenDaysAgo: 35,
        },
        {
          topic: "heart failure",
          accuracy: 0.82,
          retention: 0.8,
          confidence: 0.78,
          clinicalJudgment: 0.76,
          prioritization: 0.74,
          attempts: 10,
          lastSeenDaysAgo: 4,
        },
      ],
    });

    assert.ok(twin.weakAreas.includes("hyperkalemia"));
    assert.ok(twin.forgottenAreas.includes("hyperkalemia"));
    assert.ok(twin.misunderstoodAreas.includes("hyperkalemia"));
    assert.equal(twin.nextBestTopics[0], "hyperkalemia");
    assert.equal(twin.improvementTrend, "improving");
  });

  it("generates targeted remediation, readiness forecasting, and coach guidance from learner data", () => {
    const graph = createHyperkalemiaGraphSeed();
    const twin = buildPersonalLearningTwin({
      learnerId: "learner-1",
      signals: [
        {
          topic: "hyperkalemia",
          accuracy: 0.52,
          retention: 0.48,
          confidence: 0.88,
          clinicalJudgment: 0.45,
          prioritization: 0.5,
          attempts: 8,
          lastSeenDaysAgo: 35,
        },
      ],
    });
    const remediation = buildIntelligentRemediationPlan({ twin, graph });
    const forecast = buildReadinessForecast({ twin, currentReadiness: 0.58, weeklyStudyHours: 8 });
    const coach = buildPersonalStudyCoachPlan({ twin, remediation, forecast });

    assert.equal(remediation[0]?.topic, "hyperkalemia");
    assert.ok(remediation[0]?.activitySequence.includes("ecg"));
    assert.ok(remediation[0]?.activitySequence.includes("lab"));
    assert.equal(forecast.interventionRequired, true);
    assert.ok(forecast.projected30DayReadiness > forecast.currentReadiness);
    assert.ok(coach.studyPlan[0]?.includes("hyperkalemia"));
    assert.ok(coach.mistakeExplanationPrompts.some((prompt) => prompt.includes("cue")));
  });

  it("creates evidence-based mastery passports and clearances", () => {
    const evidence: CompetencyEvidence[] = [
      { competencyId: "rn_ecg_foundations", method: "knowledge", score: 0.93, sourceType: "ecg", sourceId: "ecg-1", completedAt: "2026-05-31T00:00:00.000Z" },
      { competencyId: "rn_ecg_foundations", method: "reasoning", score: 0.9, sourceType: "ecg", sourceId: "ecg-2", completedAt: "2026-05-31T00:00:00.000Z" },
      { competencyId: "rn_ecg_foundations", method: "simulation", score: 0.9, sourceType: "simulation", sourceId: "sim-1", completedAt: "2026-05-31T00:00:00.000Z" },
      { competencyId: "rn_abg_lab_interpretation", method: "knowledge", score: 0.9, sourceType: "lab", sourceId: "lab-1", completedAt: "2026-05-31T00:00:00.000Z" },
      { competencyId: "rn_abg_lab_interpretation", method: "reasoning", score: 0.9, sourceType: "lab", sourceId: "lab-2", completedAt: "2026-05-31T00:00:00.000Z" },
      { competencyId: "rn_abg_lab_interpretation", method: "simulation", score: 0.9, sourceType: "simulation", sourceId: "sim-2", completedAt: "2026-05-31T00:00:00.000Z" },
    ];
    const passports = buildMasteryPassports({ profession: "RN", evidence });
    const clearances = buildCompetencyClearances({ profession: "RN", evidence });

    assert.ok(passports.some((passport) => passport.name === "ECG Passport"));
    assert.ok(clearances.some((clearance) => clearance.id === "telemetry_ready" && clearance.earned));
    assert.ok(clearances.every((clearance) => clearance.disclaimer.includes("not licensure")));
  });

  it("keeps the institution layer hidden until enabled and reports cohort risk", () => {
    const view = buildInstitutionCohortView({
      cohortId: "cohort-1",
      role: "school",
      signals: [
        { learnerId: "a", competencyId: "rn_medication_safety", readiness: 0.62, mastery: 0.58, risk: 0.7 },
        { learnerId: "b", competencyId: "rn_medication_safety", readiness: 0.88, mastery: 0.86, risk: 0.1 },
      ],
    });

    assert.equal(view.hiddenUntilEnabled, true);
    assert.deepEqual(view.riskLearnerIds, ["a"]);
    assert.ok(view.weakCompetencies.includes("rn_medication_safety"));
  });

  it("maps career-long learning progression without adding public launch scope", () => {
    assert.equal(CAREER_LONG_LEARNING_ROADMAP[0]?.stage, "pre_nursing");
    assert.ok(nextCareerStages("rn_rpn").some((stage) => stage.stage === "new_graduate"));
    assert.equal(nextCareerStages("continuing_education").length, 0);
  });
});
