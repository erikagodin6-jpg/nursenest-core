import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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
} from "../src/lib/workforce/healthcare-student-workforce-intelligence";

function response(index: number, overrides: Partial<AnnualSurveyResponse> = {}): AnnualSurveyResponse {
  return {
    id: `demo-response-${index}`,
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

const nationalRows = Array.from({ length: 60 }, (_, index) => response(index));
const institutionRows = Array.from({ length: 35 }, (_, index) => response(index, { confidenceLevel: 8, stressLevel: 5 }));
const nationalAggregate = buildSurveyAggregate(nationalRows, "Canadian Healthcare Students");
const institutionAggregate = buildSurveyAggregate(institutionRows, "Northern College BScN");
const placement = buildClinicalPlacementInsights(nationalRows);
const exam = buildLicensingExamInsights(nationalRows, "NCLEX-RN");
const mediaAssets = buildMediaCenterAssets(ANNUAL_REPORT_DEFINITIONS);
const benchmark = buildInstitutionalBenchmarkSummary({
  label: "Northern College BScN",
  institution: institutionAggregate,
  national: nationalAggregate,
  institutionReadiness: 82,
  nationalReadiness: 76,
});
const authority = scoreWorkforceAuthority({
  reports: ANNUAL_REPORT_DEFINITIONS,
  aggregates: [nationalAggregate, institutionAggregate],
  mediaAssets,
  backlinkAngles: 8,
  institutionalUseCases: 5,
});

const report = `# Healthcare Student Insights & Workforce Intelligence Platform

Generated: ${new Date().toISOString()}

## Implementation Summary

The workforce intelligence foundation is implemented in \`src/lib/workforce/healthcare-student-workforce-intelligence.ts\`.

It supports:

- Annual healthcare student survey contracts.
- Nursing, RPN/LPN, NP, RT, paramedicine, OT, PT, MLT, PSW, social work, and future profession coverage.
- Annual report definitions for nursing education, allied health education, student stress, clinical placement, exam preparation, new graduate readiness, workforce pipeline, student technology, and Canadian healthcare education.
- Aggregate-only survey reporting with a ${WORKFORCE_PRIVACY_THRESHOLD}-response privacy threshold.
- Clinical placement insight summaries.
- Licensing exam preparation trend summaries.
- Media center assets for press summaries, downloadable graphics, and citation resources.
- Institutional benchmark summaries that never expose identifiable learner records.
- Workforce authority scoring across reports, publishable aggregates, media assets, backlink angles, and institutional use cases.

## Survey Coverage

Survey fields:

${ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS.map((field) => `- ${field}`).join("\n")}

## Annual Report Library

${ANNUAL_REPORT_DEFINITIONS.map((definition) => `- ${definition.year} ${definition.title} (${definition.slug})`).join("\n")}

## Demo Aggregate Signals

- National cohort publishable: ${nationalAggregate.publishable ? "Yes" : "No"}
- National responses: ${nationalAggregate.responseCount}
- Average stress: ${nationalAggregate.averageStress ?? "Hidden"}
- Average confidence: ${nationalAggregate.averageConfidence ?? "Hidden"}
- AI tool use rate: ${nationalAggregate.aiToolUseRate == null ? "Hidden" : `${(nationalAggregate.aiToolUseRate * 100).toFixed(1)}%`}
- Mobile study rate: ${nationalAggregate.mobileStudyRate == null ? "Hidden" : `${(nationalAggregate.mobileStudyRate * 100).toFixed(1)}%`}

## Placement & Exam Insights

- Placement insights publishable: ${placement.publishable ? "Yes" : "No"}
- Placement delay rate: ${placement.placementDelayRate == null ? "Hidden" : `${(placement.placementDelayRate * 100).toFixed(1)}%`}
- Placement availability concern rate: ${placement.placementAvailabilityConcernRate == null ? "Hidden" : `${(placement.placementAvailabilityConcernRate * 100).toFixed(1)}%`}
- Exam: ${exam.exam}
- Active exam preparation rate: ${exam.activePreparationRate == null ? "Hidden" : `${(exam.activePreparationRate * 100).toFixed(1)}%`}
- Average exam study hours: ${exam.averageStudyHours ?? "Hidden"}

## Institutional Benchmark Posture

- Benchmark: ${benchmark.label}
- Publishable: ${benchmark.publishable ? "Yes" : "No"}
- Confidence vs national: ${benchmark.confidenceVsNational}
- Stress vs national: ${benchmark.stressVsNational}
- Readiness vs national: ${benchmark.readinessVsNational}
- Note: ${benchmark.note}

## Media & Authority Assets

- Annual reports: ${authority.reportCount}
- Publishable aggregates: ${authority.publishableAggregates}
- Media assets: ${authority.mediaAssetCount}
- Backlink angles: ${authority.backlinkAngles}
- Institutional use cases: ${authority.institutionalUseCases}
- Workforce authority score: ${authority.score}/100

## Next Integration Points

1. Add an annual survey collection surface with consent language and respondent anonymity controls.
2. Persist survey responses and generate aggregate-only report datasets.
3. Build public report pages only from publishable aggregates.
4. Connect media assets to the creator/affiliate ecosystem for outreach and backlink campaigns.
5. Feed institutional benchmarks into hidden school sales and reporting surfaces.
6. Refresh reports annually and publish quarterly trend updates once data volume supports it.
`;

const reportPath = path.join(process.cwd(), "docs/reports/healthcare-student-workforce-intelligence-platform.md");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${reportPath}`);

