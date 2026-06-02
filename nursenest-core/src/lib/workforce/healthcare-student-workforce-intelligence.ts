export type WorkforceProfession =
  | "Nursing"
  | "RPN/LPN"
  | "NP"
  | "Respiratory Therapy"
  | "Paramedicine"
  | "Occupational Therapy"
  | "Physiotherapy"
  | "Medical Laboratory Technology"
  | "PSW"
  | "Social Work"
  | "Future Profession";

export type AnnualSurveyResponse = {
  id: string;
  profession: WorkforceProfession;
  country: string;
  provinceOrState?: string | null;
  program?: string | null;
  academicYear?: string | null;
  school?: string | null;
  clinicalPlacementStatus: "not_started" | "in_progress" | "completed" | "delayed" | "unavailable";
  employmentStatus: "not_working" | "student_job" | "healthcare_job" | "new_grad_job" | "seeking" | "unknown";
  examPreparationStatus: "not_started" | "planning" | "actively_preparing" | "exam_booked" | "completed" | "not_applicable";
  careerGoals: readonly string[];
  studyHoursPerWeek: number;
  usesAiStudyTools: boolean;
  usesMobileStudy: boolean;
  stressLevel: number;
  burnoutRisk: number;
  financialConcern: number;
  confidenceLevel: number;
  careerConfidence: number;
  placementSatisfaction?: number | null;
  preceptorExperience?: number | null;
  readinessScore?: number | null;
  createdAt: string;
};

export type AnnualReportKind =
  | "State of Nursing Education"
  | "State of Allied Health Education"
  | "Healthcare Student Stress Report"
  | "Clinical Placement Experience Report"
  | "Exam Preparation Trends Report"
  | "New Graduate Readiness Report"
  | "Healthcare Workforce Pipeline Report"
  | "Healthcare Student Technology Report"
  | "Canadian Healthcare Education Report";

export type PublicReportDefinition = {
  id: string;
  title: string;
  kind: AnnualReportKind;
  year: number;
  slug: string;
  audience: readonly WorkforceProfession[];
  sections: readonly string[];
  seoFocus: readonly string[];
  mediaAngles: readonly string[];
  indexable: boolean;
};

export type SurveyAggregate = {
  cohortLabel: string;
  responseCount: number;
  publishable: boolean;
  averageStress: number | null;
  averageBurnoutRisk: number | null;
  averageFinancialConcern: number | null;
  averageConfidence: number | null;
  averageCareerConfidence: number | null;
  averageStudyHours: number | null;
  placementSatisfaction: number | null;
  preceptorExperience: number | null;
  aiToolUseRate: number | null;
  mobileStudyRate: number | null;
};

export type ClinicalPlacementInsights = {
  responseCount: number;
  publishable: boolean;
  placementAvailabilityConcernRate: number | null;
  placementDelayRate: number | null;
  averagePlacementSatisfaction: number | null;
  averagePreceptorExperience: number | null;
  preparationGapThemes: readonly string[];
};

export type LicensingExamInsights = {
  exam: string;
  responseCount: number;
  publishable: boolean;
  activePreparationRate: number | null;
  averageStudyHours: number | null;
  averageConfidence: number | null;
  commonPreparationSignals: readonly string[];
};

export type MediaCenterAsset = {
  id: string;
  title: string;
  kind: "press_summary" | "downloadable_graphic" | "research_highlight" | "citation_resource" | "regional_map" | "interactive_dashboard";
  reportId: string;
  audience: "media" | "schools" | "students" | "professional-organizations";
  citationText: string;
};

export type WorkforceAuthorityScore = {
  reportCount: number;
  publishableAggregates: number;
  mediaAssetCount: number;
  backlinkAngles: number;
  institutionalUseCases: number;
  score: number;
};

export type InstitutionalBenchmarkSummary = {
  label: string;
  responseCount: number;
  publishable: boolean;
  confidenceVsNational: "above" | "similar" | "below" | "unavailable";
  stressVsNational: "above" | "similar" | "below" | "unavailable";
  readinessVsNational: "above" | "similar" | "below" | "unavailable";
  note: string;
};

export const WORKFORCE_PRIVACY_THRESHOLD = 30;

export const ANNUAL_HEALTHCARE_STUDENT_SURVEY_FIELDS = [
  "Profession",
  "Country",
  "Province/State",
  "Program",
  "Academic Year",
  "Clinical Placement Status",
  "Employment Status",
  "Exam Preparation Status",
  "Career Goals",
  "Study Habits",
  "Technology Use",
  "Stress Levels",
  "Burnout Indicators",
  "Financial Concerns",
  "Confidence Levels",
  "Career Intentions",
] as const;

export const ANNUAL_REPORT_DEFINITIONS: readonly PublicReportDefinition[] = [
  report("state-nursing-education", "State of Nursing Education", "State of Nursing Education", ["Nursing", "RPN/LPN", "NP"], ["student confidence", "clinical placement", "exam preparation", "new graduate readiness"]),
  report("state-allied-health-education", "State of Allied Health Education", "State of Allied Health Education", ["Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"], ["allied health students", "placement readiness", "workforce pipeline"]),
  report("student-stress", "Healthcare Student Stress Report", "Healthcare Student Stress Report", ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW", "Social Work"], ["healthcare student stress", "burnout", "financial concerns"]),
  report("clinical-placement", "Clinical Placement Experience Report", "Clinical Placement Experience Report", ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"], ["clinical placement", "preceptor experience", "placement satisfaction"]),
  report("exam-prep-trends", "Exam Preparation Trends Report", "Exam Preparation Trends Report", ["Nursing", "RPN/LPN", "NP"], ["NCLEX", "REx-PN", "CNPLE", "study habits"]),
  report("new-grad-readiness", "New Graduate Readiness Report", "New Graduate Readiness Report", ["Nursing", "RPN/LPN", "NP"], ["new graduate readiness", "transition to practice", "confidence"]),
  report("workforce-pipeline", "Healthcare Workforce Pipeline Report", "Healthcare Workforce Pipeline Report", ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW", "Social Work"], ["healthcare workforce", "career intentions", "employment"]),
  report("student-technology", "Healthcare Student Technology Report", "Healthcare Student Technology Report", ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"], ["AI study tools", "mobile learning", "education technology"]),
  report("canadian-healthcare-education", "Canadian Healthcare Education Report", "Canadian Healthcare Education Report", ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"], ["Canadian healthcare education", "province trends", "student readiness"]),
] as const;

function report(id: string, title: string, kind: AnnualReportKind, audience: readonly WorkforceProfession[], seoFocus: readonly string[]): PublicReportDefinition {
  return {
    id,
    title,
    kind,
    year: 2027,
    slug: `2027-${id}`,
    audience,
    sections: ["Executive Summary", "Methods", "Key Findings", "Charts", "Regional Insights", "Profession Insights", "Institutional Implications", "Citation"],
    seoFocus,
    mediaAngles: ["Student confidence", "Workforce pipeline", "Clinical placement readiness", "Technology adoption"],
    indexable: true,
  };
}

function avg(values: readonly (number | null | undefined)[]): number | null {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) return null;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function rate(values: readonly boolean[]): number | null {
  if (!values.length) return null;
  return Math.round((values.filter(Boolean).length / values.length) * 1000) / 1000;
}

function publishable(count: number, threshold = WORKFORCE_PRIVACY_THRESHOLD): boolean {
  return count >= threshold;
}

function maybe<T>(allowed: boolean, value: T): T | null {
  return allowed ? value : null;
}

export function buildSurveyAggregate(responses: readonly AnnualSurveyResponse[], cohortLabel: string, threshold = WORKFORCE_PRIVACY_THRESHOLD): SurveyAggregate {
  const allowed = publishable(responses.length, threshold);
  return {
    cohortLabel,
    responseCount: responses.length,
    publishable: allowed,
    averageStress: maybe(allowed, avg(responses.map((row) => row.stressLevel))),
    averageBurnoutRisk: maybe(allowed, avg(responses.map((row) => row.burnoutRisk))),
    averageFinancialConcern: maybe(allowed, avg(responses.map((row) => row.financialConcern))),
    averageConfidence: maybe(allowed, avg(responses.map((row) => row.confidenceLevel))),
    averageCareerConfidence: maybe(allowed, avg(responses.map((row) => row.careerConfidence))),
    averageStudyHours: maybe(allowed, avg(responses.map((row) => row.studyHoursPerWeek))),
    placementSatisfaction: maybe(allowed, avg(responses.map((row) => row.placementSatisfaction))),
    preceptorExperience: maybe(allowed, avg(responses.map((row) => row.preceptorExperience))),
    aiToolUseRate: maybe(allowed, rate(responses.map((row) => row.usesAiStudyTools))),
    mobileStudyRate: maybe(allowed, rate(responses.map((row) => row.usesMobileStudy))),
  };
}

export function buildClinicalPlacementInsights(responses: readonly AnnualSurveyResponse[], threshold = WORKFORCE_PRIVACY_THRESHOLD): ClinicalPlacementInsights {
  const allowed = publishable(responses.length, threshold);
  const delays = responses.filter((row) => row.clinicalPlacementStatus === "delayed").length;
  const unavailable = responses.filter((row) => row.clinicalPlacementStatus === "unavailable").length;
  return {
    responseCount: responses.length,
    publishable: allowed,
    placementAvailabilityConcernRate: maybe(allowed, responses.length ? Math.round(((delays + unavailable) / responses.length) * 1000) / 1000 : null),
    placementDelayRate: maybe(allowed, responses.length ? Math.round((delays / responses.length) * 1000) / 1000 : null),
    averagePlacementSatisfaction: maybe(allowed, avg(responses.map((row) => row.placementSatisfaction))),
    averagePreceptorExperience: maybe(allowed, avg(responses.map((row) => row.preceptorExperience))),
    preparationGapThemes: allowed ? ["Medication safety", "Clinical reasoning", "Documentation", "Communication", "Unit-specific expectations"] : [],
  };
}

export function buildLicensingExamInsights(responses: readonly AnnualSurveyResponse[], exam: string, threshold = WORKFORCE_PRIVACY_THRESHOLD): LicensingExamInsights {
  const examRows = responses.filter((row) => row.examPreparationStatus !== "not_applicable");
  const allowed = publishable(examRows.length, threshold);
  const activelyPreparing = examRows.filter((row) => row.examPreparationStatus === "actively_preparing" || row.examPreparationStatus === "exam_booked").length;
  return {
    exam,
    responseCount: examRows.length,
    publishable: allowed,
    activePreparationRate: maybe(allowed, examRows.length ? Math.round((activelyPreparing / examRows.length) * 1000) / 1000 : null),
    averageStudyHours: maybe(allowed, avg(examRows.map((row) => row.studyHoursPerWeek))),
    averageConfidence: maybe(allowed, avg(examRows.map((row) => row.confidenceLevel))),
    commonPreparationSignals: allowed ? ["Question banks", "Flashcards", "CAT exams", "Readiness reports", "Clinical reasoning review"] : [],
  };
}

export function buildMediaCenterAssets(reportDefinitions: readonly PublicReportDefinition[]): readonly MediaCenterAsset[] {
  return reportDefinitions.flatMap((definition) => [
    {
      id: `${definition.id}-press-summary`,
      title: `${definition.title} Press Summary`,
      kind: "press_summary" as const,
      reportId: definition.id,
      audience: "media" as const,
      citationText: `NurseNest. (${definition.year}). ${definition.title}.`,
    },
    {
      id: `${definition.id}-downloadable-graphic`,
      title: `${definition.title} Downloadable Graphics`,
      kind: "downloadable_graphic" as const,
      reportId: definition.id,
      audience: "media" as const,
      citationText: `Graphic source: NurseNest ${definition.title}, ${definition.year}.`,
    },
    {
      id: `${definition.id}-citation-resource`,
      title: `${definition.title} Citation Resource`,
      kind: "citation_resource" as const,
      reportId: definition.id,
      audience: "schools" as const,
      citationText: `NurseNest. (${definition.year}). ${definition.title}. Retrieved from NurseNest.`,
    },
  ]);
}

export function scoreWorkforceAuthority(args: {
  reports: readonly PublicReportDefinition[];
  aggregates: readonly SurveyAggregate[];
  mediaAssets: readonly MediaCenterAsset[];
  backlinkAngles: number;
  institutionalUseCases: number;
}): WorkforceAuthorityScore {
  const reportCount = args.reports.length;
  const publishableAggregates = args.aggregates.filter((item) => item.publishable).length;
  const mediaAssetCount = args.mediaAssets.length;
  const score = Math.min(
    100,
    Math.round(reportCount * 5 + publishableAggregates * 10 + Math.min(25, mediaAssetCount * 1.5) + Math.min(20, args.backlinkAngles * 2) + Math.min(15, args.institutionalUseCases * 3)),
  );
  return {
    reportCount,
    publishableAggregates,
    mediaAssetCount,
    backlinkAngles: args.backlinkAngles,
    institutionalUseCases: args.institutionalUseCases,
    score,
  };
}

function compareMetric(local: number | null, national: number | null, higherIsBetter: boolean): "above" | "similar" | "below" | "unavailable" {
  if (local == null || national == null) return "unavailable";
  const diff = local - national;
  if (Math.abs(diff) < 0.4) return "similar";
  const better = higherIsBetter ? diff > 0 : diff < 0;
  return better ? "above" : "below";
}

export function buildInstitutionalBenchmarkSummary(args: {
  label: string;
  institution: SurveyAggregate;
  national: SurveyAggregate;
  institutionReadiness?: number | null;
  nationalReadiness?: number | null;
}): InstitutionalBenchmarkSummary {
  const publishableSummary = args.institution.publishable && args.national.publishable;
  return {
    label: args.label,
    responseCount: args.institution.responseCount,
    publishable: publishableSummary,
    confidenceVsNational: publishableSummary ? compareMetric(args.institution.averageConfidence, args.national.averageConfidence, true) : "unavailable",
    stressVsNational: publishableSummary ? compareMetric(args.institution.averageStress, args.national.averageStress, false) : "unavailable",
    readinessVsNational: publishableSummary ? compareMetric(args.institutionReadiness ?? null, args.nationalReadiness ?? null, true) : "unavailable",
    note: publishableSummary
      ? "Benchmark uses aggregate-only survey data and does not expose identifiable learner records."
      : `Benchmark hidden until both cohorts meet the ${WORKFORCE_PRIVACY_THRESHOLD}-response privacy threshold.`,
  };
}

