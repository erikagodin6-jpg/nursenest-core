import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACCREDITATION_SUPPORT_REPORTS,
  benchmarkCohorts,
  buildCohortProgressReport,
  buildFacultyDashboard,
  buildInstitutionAnalyticsDashboard,
  calculateEnterpriseSeatUtilization,
  CONTENT_ASSIGNMENT_BUNDLES,
  createEnterpriseInstitutionAccount,
  ENTERPRISE_REVENUE_MODELS,
  ENTERPRISE_SCREENSHOT_LIBRARY,
  evaluatePlacementReadiness,
  HIDDEN_ENTERPRISE_VISIBILITY,
  HOSPITAL_ONBOARDING_PROGRAMS,
  HOSPITAL_RESIDENCY_PROGRAMS,
  summarizeAssignmentCompletion,
  validateEnterpriseCompetency,
  type EnterpriseAssignment,
  type EnterpriseCohort,
} from "@/lib/enterprise";

describe("hidden enterprise, school, and hospital ecosystem foundation", () => {
  it("keeps every enterprise surface hidden, admin-only, and not launch-ready", () => {
    assert.deepEqual(HIDDEN_ENTERPRISE_VISIBILITY, {
      published: false,
      visibleInNavigation: false,
      launchReady: false,
      adminOnly: true,
      indexable: false,
    });

    const institution = createEnterpriseInstitutionAccount({
      id: "inst-1",
      name: "NurseNest School Demo",
      type: "school",
    });

    assert.equal(institution.visibility.adminOnly, true);
    assert.equal(institution.visibility.launchReady, false);
    assert.ok(HOSPITAL_ONBOARDING_PROGRAMS.every((program) => program.visibility.visibleInNavigation === false));
    assert.ok(HOSPITAL_RESIDENCY_PROGRAMS.every((program) => program.visibility.published === false));
    assert.ok(ENTERPRISE_REVENUE_MODELS.every((model) => model.publicPricingEnabled === false));
    assert.ok(ENTERPRISE_SCREENSHOT_LIBRARY.every((asset) => asset.generated === false && asset.visibility.indexable === false));
  });

  it("summarizes cohort progress and faculty dashboard risk signals", () => {
    const cohort: EnterpriseCohort = {
      id: "cohort-1",
      name: "RN Class 2028",
      kind: "rn_class",
      institutionId: "inst-1",
      programId: "program-1",
      learnerIds: ["learner-a", "learner-b"],
      facultyIds: ["faculty-a"],
      benchmarkGroup: "rn-class",
      visibility: HIDDEN_ENTERPRISE_VISIBILITY,
    };
    const report = buildCohortProgressReport(cohort, [
      { learnerId: "learner-a", completionPct: 42, readinessScore: 62, simulationCompletionPct: 40, clinicalSkillsCompletionPct: 55 },
      { learnerId: "learner-b", completionPct: 88, readinessScore: 84, simulationCompletionPct: 90, clinicalSkillsCompletionPct: 86 },
    ]);
    const dashboard = buildFacultyDashboard({
      cohortReport: report,
      learners: [
        {
          learnerId: "learner-a",
          progressPct: 42,
          readinessScore: 62,
          weakAreas: ["ECG", "Medication Safety"],
          examReadiness: 64,
          simulationCompletionPct: 40,
          clinicalSkillsCompletionPct: 55,
          medicationMathPerformance: 68,
          labInterpretationPerformance: 70,
          ecgPerformance: 52,
        },
      ],
    });

    assert.deepEqual(report.strugglingLearnerIds, ["learner-a"]);
    assert.deepEqual(dashboard.riskLearnerIds, ["learner-a"]);
    assert.ok(dashboard.topWeakAreas.includes("ECG"));
  });

  it("evaluates placement readiness and competency validation using performance, not participation", () => {
    const placement = evaluatePlacementReadiness({
      clinical_skills: 82,
      medication_safety: 76,
      documentation: 90,
      communication: 88,
      professionalism: 92,
      assessment: 80,
      prioritization: 72,
    });
    const competency = validateEnterpriseCompetency({
      knowledge: 86,
      application: 84,
      simulationPerformance: 78,
      clinicalJudgment: 88,
      repeatedSuccessCount: 2,
    });

    assert.equal(placement.readyForPlacement, false);
    assert.ok(placement.weakDomains.includes("prioritization"));
    assert.equal(competency.validated, false);
    assert.ok(competency.missingRequirements.some((requirement) => requirement.includes("Simulation performance")));
    assert.ok(competency.missingRequirements.some((requirement) => requirement.includes("repeated success")));
  });

  it("supports educator assignments, benchmarking, institutional analytics, and accreditation reports", () => {
    const assignment: EnterpriseAssignment = {
      id: "assign-1",
      type: "simulation",
      contentId: "telemetry-shift",
      assignedByUserId: "faculty-a",
      learnerIds: ["learner-a", "learner-b"],
      cohortId: "cohort-1",
      dueAtIso: null,
    };
    const completion = summarizeAssignmentCompletion(assignment, [
      { assignmentId: "assign-1", learnerId: "learner-a", completed: true },
      { assignmentId: "assign-1", learnerId: "learner-b", completed: false },
    ]);
    const benchmarks = benchmarkCohorts([
      { id: "cohort-a", label: "RN Class 2028", readinessScore: 82, competencyScore: 80, weakAreaCount: 2 },
      { id: "cohort-b", label: "RPN Fall Intake", readinessScore: 62, competencyScore: 65, weakAreaCount: 6 },
    ]);
    const analytics = buildInstitutionAnalyticsDashboard({
      enrollment: 120,
      completionPct: 68,
      readinessScore: 72,
      weakAreaCount: 8,
      simulationSuccessPct: 64,
      clinicalSkillsPerformance: 78,
      retentionPct: 88,
      engagementPct: 60,
    });

    assert.equal(completion.completionPct, 50);
    assert.equal(benchmarks.find((row) => row.id === "cohort-b")?.struggling, true);
    assert.equal(analytics.health, "at_risk");
    assert.ok(ACCREDITATION_SUPPORT_REPORTS.some((report) => report.kind === "competency_tracking"));
  });

  it("defines assignable bundles, residency programs, revenue models, and hidden screenshot assets", () => {
    assert.ok(CONTENT_ASSIGNMENT_BUNDLES.some((bundle) => bundle.id === "telemetry-readiness-bundle"));
    assert.ok(CONTENT_ASSIGNMENT_BUNDLES.every((bundle) => bundle.visibility.adminOnly));
    assert.ok(HOSPITAL_RESIDENCY_PROGRAMS.some((program) => program.track === "new_graduate_nurse_residency"));
    assert.ok(ENTERPRISE_REVENUE_MODELS.some((model) => model.model === "enterprise_contract"));
    assert.ok(ENTERPRISE_SCREENSHOT_LIBRARY.some((asset) => asset.useCase === "faculty_dashboard"));

    const seats = calculateEnterpriseSeatUtilization(100, 72);
    assert.equal(seats.availableSeats, 28);
    assert.equal(seats.utilizationPct, 72);
  });
});
