import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildAdaptiveStudyPlan,
  buildAdminProfessionJourneyInsights,
  buildCompetencyHeatMap,
  buildJourneyRecommendations,
  buildProfessionDashboardModel,
  buildProfessionReadinessScores,
  getProfessionCompetencyMap,
  listExperienceLevelOptions,
  listGoalOptions,
  listProfessionOnboardingOptions,
  type ProfessionJourneyInput,
} from "./profession-journey-system";

describe("profession journey personalization system", () => {
  it("offers the complete profession-specific onboarding contract", () => {
    const options = listProfessionOnboardingOptions();
    const labels = options.map((option) => option.label);

    for (const label of [
      "RN",
      "RPN/LPN",
      "NP",
      "Respiratory Therapy",
      "Medical Laboratory Science",
      "Diagnostic Imaging",
      "Occupational Therapy",
      "Physiotherapy",
      "Speech-Language Pathology",
      "Social Work",
      "Paramedicine",
      "New Graduate Nurse",
      "Other Allied Health",
    ]) {
      assert.ok(labels.includes(label), `${label} onboarding option missing`);
    }
  });

  it("supports multi-goal selection and all required experience levels", () => {
    const goals = listGoalOptions();
    const goalLabels = goals.map((goal) => goal.label);

    for (const label of [
      "Pass my licensing exam",
      "Prepare for school exams",
      "Improve clinical skills",
      "Prepare for orientation",
      "Build medication confidence",
      "Improve clinical judgment",
      "Prepare for certification",
      "Advance my career",
      "Maintain competency",
    ]) {
      assert.ok(goalLabels.includes(label), `${label} goal missing`);
    }

    assert.ok(goals.find((goal) => goal.id === "pass-licensing-exam")?.recommendationBias.includes("questions"));
    assert.ok(goals.find((goal) => goal.id === "build-medication-confidence")?.recommendationBias.includes("pharmacology"));

    const levels = listExperienceLevelOptions().map((level) => level.label);
    assert.deepEqual(levels, [
      "Student",
      "Final Semester",
      "Graduate Awaiting Exam",
      "New Graduate",
      "Practicing Professional",
      "Advanced Practitioner",
    ]);
  });

  it("defines profession-specific competency maps instead of generic dashboards", () => {
    assert.deepEqual(
      getProfessionCompetencyMap("rn").map((competency) => competency.label),
      ["Medical Surgical", "Maternal Child", "Mental Health", "Pharmacology", "Leadership", "Clinical Judgment"],
    );
    assert.deepEqual(
      getProfessionCompetencyMap("np").map((competency) => competency.label),
      ["Assessment", "Diagnostics", "Prescribing", "Clinical Reasoning"],
    );
    assert.deepEqual(
      getProfessionCompetencyMap("respiratory-therapy").map((competency) => competency.label),
      ["Ventilation", "ABGs", "Airway Management"],
    );
    assert.deepEqual(
      getProfessionCompetencyMap("physiotherapy").map((competency) => competency.label),
      ["Mobility", "Assessment", "Exercise Therapy"],
    );
  });

  it("builds competency heat maps and dynamic readiness scores from performance and confidence", () => {
    const input: ProfessionJourneyInput = {
      professionId: "rn",
      goalIds: ["pass-licensing-exam", "improve-clinical-judgment"],
      experienceLevel: "graduate-awaiting-exam",
      availableStudyMinutesPerDay: 42,
      weakAreas: ["Pharmacology", "Clinical Judgment"],
      performanceByCompetency: {
        pharmacology: 54,
        "clinical-judgment": 61,
        "medical-surgical": 86,
      },
      confidenceByCompetency: {
        pharmacology: 42,
        "clinical-judgment": 58,
        "medical-surgical": 80,
      },
    };

    const heatMap = buildCompetencyHeatMap(input);
    assert.equal(heatMap.find((cell) => cell.id === "pharmacology")?.status, "needs-improvement");
    assert.equal(heatMap.find((cell) => cell.id === "medical-surgical")?.status, "mastered");

    const readiness = buildProfessionReadinessScores(heatMap);
    assert.ok(readiness.find((score) => score.label === "Profession Readiness"));
    assert.ok(readiness.find((score) => score.label === "Medication Readiness")?.supportingCompetencies.includes("Pharmacology"));
  });

  it("generates adaptive daily, weekly, and monthly plans without generic recommendations", () => {
    const input: ProfessionJourneyInput = {
      professionId: "new-graduate-nurse",
      goalIds: ["prepare-orientation", "build-medication-confidence"],
      experienceLevel: "new-graduate",
      availableStudyMinutesPerDay: 42,
      weakAreas: ["Medication Safety", "Shift Management"],
    };

    const plan = buildAdaptiveStudyPlan(input);
    assert.ok(plan.daily.length >= 3);
    assert.ok(plan.weekly.length >= plan.daily.length);
    assert.ok(plan.monthly.length >= plan.weekly.length);
    assert.match(plan.planRationale, /profession, goals, available time, weak areas, confidence, and performance history/i);

    const recommendations = buildJourneyRecommendations(input);
    assert.ok(recommendations.some((recommendation) => recommendation.kind === "simulation"));
    assert.ok(recommendations.some((recommendation) => recommendation.kind === "pharmacology"));
    assert.ok(recommendations.every((recommendation) => recommendation.competencyId.length > 0));
  });

  it("creates profession dashboards with milestones and professional retention language", () => {
    const model = buildProfessionDashboardModel({
      professionId: "respiratory-therapy",
      goalIds: ["prepare-certification", "maintain-competency"],
      experienceLevel: "practicing-professional",
      availableStudyMinutesPerDay: 30,
      weakAreas: ["Ventilation"],
      performanceByCompetency: { ventilation: 49, abgs: 72, "airway-management": 76 },
      confidenceByCompetency: { ventilation: 45, abgs: 70, "airway-management": 74 },
    });

    assert.equal(model.profession.label, "Respiratory Therapy");
    assert.ok(model.readinessScores.some((score) => score.label === "ECG Readiness"));
    assert.equal(model.milestones.find((milestone) => milestone.id === "independent-practice")?.status, "current");
    assert.ok(model.dashboardFocus.includes("Profession Readiness"));
    assert.ok(model.recommendations[0]?.title.includes("Ventilation"));
  });

  it("aggregates admin insights for goals, weak areas, content demand, and simulation demand", () => {
    const rn = buildProfessionDashboardModel({
      professionId: "rn",
      goalIds: ["pass-licensing-exam"],
      experienceLevel: "final-semester",
      availableStudyMinutesPerDay: 45,
      weakAreas: ["Clinical Judgment"],
    });
    const newGrad = buildProfessionDashboardModel({
      professionId: "new-graduate-nurse",
      goalIds: ["prepare-orientation"],
      experienceLevel: "new-graduate",
      availableStudyMinutesPerDay: 30,
      weakAreas: ["Shift Management"],
    });

    const insights = buildAdminProfessionJourneyInsights([rn, newGrad]);
    assert.equal(insights.totalLearners, 2);
    assert.ok(insights.mostCommonGoals.some((goal) => goal.label === "Pass my licensing exam"));
    assert.ok(insights.mostCommonWeakAreas.length > 0);
    assert.ok(insights.professionTrends.some((trend) => trend.label === "New Graduate Nurse"));
    assert.ok(insights.contentDemand.some((demand) => demand.activity === "simulation"));
  });
});
