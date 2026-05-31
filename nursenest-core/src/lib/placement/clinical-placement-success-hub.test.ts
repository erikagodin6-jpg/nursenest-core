import assert from "node:assert/strict";
import test from "node:test";
import {
  PLACEMENT_BADGES,
  PLACEMENT_FEATURE_ACCESS,
  PLACEMENT_PROFESSION_FRAMEWORKS,
  buildClinicalCoachInsights,
  buildInterprofessionalLearningLog,
  buildPlacementSuccessHubSnapshot,
  buildPreparationCenter,
  buildShiftPrepToolkit,
  calculatePlacementDashboard,
  getPlacementFramework,
  type ClinicalHourLog,
  type CompetencyEvidence,
  type FeedbackTrend,
  type PlacementProfession,
  type PlacementProfile,
} from "@/lib/placement/clinical-placement-success-hub";

const professions: PlacementProfession[] = [
  "RN",
  "RPN_LPN",
  "NP",
  "RT",
  "PARAMEDIC",
  "OT",
  "PT",
  "MLT",
  "PSW",
  "SOCIAL_WORK",
  "PSYCHOTHERAPY",
];

function profile(profession: PlacementProfession): PlacementProfile {
  return {
    learnerId: "learner-1",
    profession,
    program: "NurseNest Demo Program",
    academicYear: "Year 2",
    placementSetting: "Medical-Surgical",
    placementSpecialty: "Cardiorespiratory",
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    requiredHours: 120,
    preceptor: { name: "Jordan Lee", role: "Preceptor" },
    instructor: { name: "Taylor Singh", role: "Clinical Instructor" },
    goals: ["Improve clinical communication", "Collect medication safety evidence"],
    evaluationStatus: "midterm_pending",
  };
}

const hourLogs: ClinicalHourLog[] = [
  {
    date: "2026-06-01",
    hours: 8,
    unit: "4 West",
    patientPopulation: "Adults with cardiorespiratory conditions",
    skillsPerformed: ["Focused assessment", "Medication teaching"],
    competencyIds: ["rn-assessment", "rn-med-admin"],
    preceptorNotes: "Prepared, safe, and asked relevant questions.",
  },
  {
    date: "2026-06-03",
    hours: 8,
    unit: "4 West",
    patientPopulation: "Adults with cardiorespiratory conditions",
    skillsPerformed: ["SBAR", "Documentation"],
    competencyIds: ["rn-clinical-judgment", "rn-documentation"],
    preceptorNotes: "Improved prioritization and communication.",
  },
];

const evidence: CompetencyEvidence[] = [
  {
    competencyId: "rn-assessment",
    status: "performed_independently",
    date: "2026-06-01",
    evidence: "Completed focused respiratory assessment and escalated abnormal findings.",
    validatedBy: "Jordan Lee",
  },
  {
    competencyId: "rn-med-admin",
    status: "mastered",
    date: "2026-06-03",
    evidence: "Led medication teaching with teach-back and improved patient understanding.",
    validatedBy: "Jordan Lee",
  },
];

const feedback: FeedbackTrend = {
  strengths: ["Clear patient-centered communication", "Prepared medication safety checks"],
  improvementAreas: ["Continue improving time management during busy shifts"],
  clinicalComments: ["Recognized worsening dyspnea and reported appropriately."],
  professionalComments: ["Accepts feedback and follows through with goals."],
  skillEvaluations: [{ competencyId: "rn-assessment", status: "performed_independently", note: "Safe and organized." }],
};

test("placement success hub defines meaningful profession-specific frameworks", () => {
  assert.deepEqual(Object.keys(PLACEMENT_PROFESSION_FRAMEWORKS).sort(), [...professions].sort());

  for (const profession of professions) {
    const framework = getPlacementFramework(profession);
    assert.equal(framework.profession, profession);
    assert.ok(framework.commonSettings.length >= 3, `${profession} needs common settings`);
    assert.ok(framework.preparationTopics.length >= 5, `${profession} needs preparation topics`);
    assert.ok(framework.expectedSkills.length >= 5, `${profession} needs expected skills`);
    assert.ok(framework.competencies.length >= 5, `${profession} needs competencies`);
    assert.ok(framework.competencies.every((item) => item.evidenceExamples.length >= 2), `${profession} needs evidence examples`);
  }

  assert.ok(getPlacementFramework("RT").competencies.some((item) => item.label === "Ventilator Management"));
  assert.ok(getPlacementFramework("PARAMEDIC").competencies.some((item) => item.label === "Trauma Assessment"));
  assert.ok(getPlacementFramework("OT").competencies.some((item) => item.label === "ADL Assessment"));
  assert.ok(getPlacementFramework("PT").competencies.some((item) => item.label === "Gait Assessment"));
  assert.ok(getPlacementFramework("MLT").competencies.some((item) => item.label === "Critical Value Communication"));
  assert.ok(getPlacementFramework("PSW").competencies.some((item) => item.label === "Observation And Reporting"));
});

test("placement dashboard calculates hours, progress, and competency completion", () => {
  const dashboard = calculatePlacementDashboard(profile("RN"), hourLogs, evidence);
  assert.equal(dashboard.hoursCompleted, 16);
  assert.equal(dashboard.hoursRemaining, 104);
  assert.equal(dashboard.programProgress, 13);
  assert.equal(dashboard.competenciesCompleted, 2);
  assert.equal(dashboard.competenciesOutstanding, 3);
  assert.equal(dashboard.competencyProgress, 40);
  assert.equal(dashboard.weeklyHours.length, 1);
  assert.equal(dashboard.evaluationStatus, "midterm_pending");
});

test("preparation center and shift tools are generated from profession context", () => {
  const rtProfile = { ...profile("RT"), placementSetting: "ICU", placementSpecialty: "Ventilation" };
  const prep = buildPreparationCenter(rtProfile);
  const shift = buildShiftPrepToolkit(rtProfile);

  assert.ok(prep.unitOrientationGuide.some((item) => item.includes("ICU")));
  assert.ok(prep.expectedSkills.includes("Ventilator checks"));
  assert.ok(prep.commonEquipment.some((item) => item.includes("Ventilator checks")));
  assert.ok(shift.instructorQuestionBanks.some((item) => item.includes("ABGs")));
  assert.ok(shift.labInterpretationReviewSheets.includes("Critical values"));
});

test("portfolio, evaluation, coach, mobile, and monetization surfaces are present", () => {
  const snapshot = buildPlacementSuccessHubSnapshot(profile("RN"), hourLogs, evidence, feedback);
  assert.ok(snapshot.evaluationPrep.strengthSummary.includes("Clear patient-centered communication"));
  assert.ok(snapshot.portfolio.competenciesAchieved.includes("Medication Administration"));
  assert.ok(snapshot.resumeInterview.resumeBullets[0].includes("Cardiorespiratory"));
  assert.ok(snapshot.coachInsights.some((item) => item.focusArea === "Placement Momentum" || item.focusArea === "Competency Progress"));
  assert.ok(snapshot.mobileCapabilities.includes("Log hours"));
  assert.ok(snapshot.mobileCapabilities.includes("Track competencies"));
  assert.ok(snapshot.instructorResourceCenter.features.includes("Competency review"));
  assert.ok(snapshot.monetization.free.features.includes("Basic hour tracking"));
  assert.ok(snapshot.monetization.paid.features.includes("AI clinical coaching"));
  assert.ok(snapshot.monetization.institution.features.includes("Program analytics"));
});

test("reflection, interprofessional learning, badges, and coaching standards are explicit", () => {
  const log = buildInterprofessionalLearningLog();
  assert.ok(log.disciplines.includes("RTs"));
  assert.ok(log.disciplines.includes("Pharmacists"));
  assert.ok(log.reflectionPrompts.some((item) => item.includes("role clarity")));

  const dashboard = calculatePlacementDashboard(profile("RN"), [], []);
  const insights = buildClinicalCoachInsights(dashboard, feedback);
  assert.ok(insights.length > 0);
  assert.ok(insights.every((item) => item.recommendedAction.length > 0));

  assert.ok(PLACEMENT_BADGES.includes("Medication Safety"));
  assert.ok(PLACEMENT_BADGES.includes("Clinical Communication"));
  assert.ok(PLACEMENT_FEATURE_ACCESS.free.features.includes("Basic reflections"));
});
