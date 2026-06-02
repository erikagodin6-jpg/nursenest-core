import assert from "node:assert/strict";
import test from "node:test";

import {
  ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS,
  ANNUAL_REPORT_DEFINITIONS,
  WORKFORCE_PRIVACY_THRESHOLD,
  buildClinicalPlacementInsights,
  buildInstitutionalBenchmarkSummary,
  buildLicensingExamInsights,
  buildMediaCenterAssets,
  buildSurveyAggregate,
  scoreWorkforceAuthority,
  type AnnualSurveyResponse,
} from "@/lib/workforce/healthcare-student-workforce-intelligence";

function response(index: number, overrides: Partial<AnnualSurveyResponse> = {}): AnnualSurveyResponse {
  return {
    id: `response-${index}`,
    profession: "Nursing",
    country: "Canada",
    provinceOrState: "Ontario",
    program: "BScN",
    academicYear: "Year 3",
    school: "Northern College",
    clinicalPlacementStatus: index % 10 === 0 ? "delayed" : "in_progress",
    employmentStatus: index % 3 === 0 ? "student_job" : "not_working",
    examPreparationStatus: index % 4 === 0 ? "exam_booked" : "actively_preparing",
    careerGoals: ["acute care", "critical care"],
    studyHoursPerWeek: 8 + (index % 4),
    usesAiStudyTools: index % 2 === 0,
    usesMobileStudy: index % 3 !== 0,
    stressLevel: 6 + (index % 3),
    burnoutRisk: 5 + (index % 4),
    financialConcern: 6 + (index % 2),
    confidenceLevel: 7 + (index % 2),
    careerConfidence: 6 + (index % 3),
    placementSatisfaction: 7 + (index % 2),
    preceptorExperience: 7 + (index % 3),
    readinessScore: 72 + (index % 6),
    createdAt: "2026-05-01T12:00:00.000Z",
    ...overrides,
  };
}

function responses(count: number, overrides: Partial<AnnualSurveyResponse> = {}): AnnualSurveyResponse[] {
  return Array.from({ length: count }, (_, index) => response(index, overrides));
}

test("annual survey and report registry covers required fields and report families", () => {
  assert.equal(ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS.includes("Profession"), true);
  assert.equal(ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS.includes("Clinical Placement Status"), true);
  assert.equal(ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS.includes("Burnout Indicators"), true);
  assert.equal(ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS.includes("Career Intentions"), true);
  assert.equal(ANNUAL_REPORT_DEFINITIONS.length, 9);
  assert.equal(ANNUAL_REPORT_DEFINITIONS.some((report) => report.title === "State of Nursing Education"), true);
  assert.equal(ANNUAL_REPORT_DEFINITIONS.some((report) => report.title === "Canadian Healthcare Education Report"), true);
});

test("buildSurveyAggregate hides metrics below privacy threshold", () => {
  const aggregate = buildSurveyAggregate(responses(WORKFORCE_PRIVACY_THRESHOLD - 1), "Small Cohort");

  assert.equal(aggregate.publishable, false);
  assert.equal(aggregate.averageStress, null);
  assert.equal(aggregate.mobileStudyRate, null);

  const publishable = buildSurveyAggregate(responses(WORKFORCE_PRIVACY_THRESHOLD), "National Nursing Students");
  assert.equal(publishable.publishable, true);
  assert.ok((publishable.averageStress ?? 0) > 0);
  assert.ok((publishable.mobileStudyRate ?? 0) > 0);
});

test("clinical placement and licensing exam insights use aggregate-only publish gates", () => {
  const rows = responses(40);
  const placement = buildClinicalPlacementInsights(rows);
  assert.equal(placement.publishable, true);
  assert.ok((placement.placementDelayRate ?? 0) > 0);
  assert.equal(placement.preparationGapThemes.includes("Medication safety"), true);

  const exam = buildLicensingExamInsights(rows, "NCLEX-RN");
  assert.equal(exam.publishable, true);
  assert.equal(exam.exam, "NCLEX-RN");
  assert.ok((exam.activePreparationRate ?? 0) > 0);
  assert.equal(exam.commonPreparationSignals.includes("CAT exams"), true);
});

test("media center assets package every annual report for press, graphics, and citation use", () => {
  const assets = buildMediaCenterAssets(ANNUAL_REPORT_DEFINITIONS);

  assert.equal(assets.length, ANNUAL_REPORT_DEFINITIONS.length * 3);
  assert.equal(assets.some((asset) => asset.kind === "press_summary"), true);
  assert.equal(assets.some((asset) => asset.kind === "downloadable_graphic"), true);
  assert.equal(assets.some((asset) => asset.kind === "citation_resource"), true);
  assert.match(assets[0]?.citationText ?? "", /NurseNest/);
});

test("scoreWorkforceAuthority rewards reports, publishable aggregates, media assets, backlinks, and institutional uses", () => {
  const aggregates = [
    buildSurveyAggregate(responses(40), "Nursing"),
    buildSurveyAggregate(responses(12), "Small Cohort"),
  ];
  const score = scoreWorkforceAuthority({
    reports: ANNUAL_REPORT_DEFINITIONS,
    aggregates,
    mediaAssets: buildMediaCenterAssets(ANNUAL_REPORT_DEFINITIONS),
    backlinkAngles: 8,
    institutionalUseCases: 5,
  });

  assert.equal(score.reportCount, 9);
  assert.equal(score.publishableAggregates, 1);
  assert.ok(score.score >= 90);
});

test("institutional benchmarks compare only publishable aggregate cohorts", () => {
  const national = buildSurveyAggregate(responses(60, { confidenceLevel: 7, stressLevel: 7 }), "National");
  const institution = buildSurveyAggregate(responses(35, { confidenceLevel: 8, stressLevel: 5 }), "Northern College");
  const summary = buildInstitutionalBenchmarkSummary({
    label: "Northern College BScN",
    institution,
    national,
    institutionReadiness: 82,
    nationalReadiness: 76,
  });

  assert.equal(summary.publishable, true);
  assert.equal(summary.confidenceVsNational, "above");
  assert.equal(summary.stressVsNational, "above");
  assert.equal(summary.readinessVsNational, "above");
  assert.match(summary.note, /aggregate-only/);

  const hidden = buildInstitutionalBenchmarkSummary({
    label: "Small Program",
    institution: buildSurveyAggregate(responses(10), "Small Program"),
    national,
  });
  assert.equal(hidden.publishable, false);
  assert.equal(hidden.confidenceVsNational, "unavailable");
  assert.match(hidden.note, /privacy threshold/);
});

