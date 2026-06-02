/**
 * Phase 13 — institutional analytics **federation boundaries** (single-tenant query scope).
 *
 * Cross-institution comparison uses **pre-aggregated** public benchmark tiles only — never learner-level joins.
 *
 * See reports/phase-13-strategic-intelligence.md
 */

export const FederationAnalyticsSurface = {
  institutionScopedDashboard: "fed.institution_dashboard",
  instructorCohortView: "fed.instructor_cohort_view",
  cohortComparisonSameInstitution: "fed.cohort_compare_same_institution",
  multiCampusRollup: "fed.multi_campus_rollup",
  analyticsExportJob: "fed.analytics_export_job",
  accreditationReportPack: "fed.accreditation_report_pack",
} as const;

export type FederationAnalyticsSurface =
  (typeof FederationAnalyticsSurface)[keyof typeof FederationAnalyticsSurface];

export type InstitutionAnalyticsQueryScope = {
  institutionKey: string;
  /** Optional campus id — must still satisfy same org root. */
  campusKey?: string;
  /** Instructor or staff actor — resolved server-side; never from client alone. */
  actorStaffSubjectId: string;
};
