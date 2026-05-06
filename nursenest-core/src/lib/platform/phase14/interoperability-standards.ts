/**
 * Phase 14 — interoperability & **standards direction** (identifiers for roadmap; no protocol implementations).
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const InteropStandardTarget = {
  lmsLtiOrOneRoster: "interop.lms_lti_one_roster",
  educationalCompetencyFramework: "interop.competency_framework",
  analyticsExportCsvParquet: "interop.analytics_export_csv_parquet",
  institutionalAccreditationReport: "interop.accreditation_report",
  futureCertificationBody: "interop.certification_body",
  healthcareEducationFhirEducation: "interop.fhir_education_r5_direction",
} as const;

export type InteropStandardTarget =
  (typeof InteropStandardTarget)[keyof typeof InteropStandardTarget];
