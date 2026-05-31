import type { NpCertificationTag } from "./np-certification-ecosystem";
import { HIDDEN_NP_ACADEMY_STATUS, type HiddenNpAcademyStatus } from "./np-advanced-practice-academies";

export type NpCaseComplexity = "beginner" | "intermediate" | "advanced" | "specialty";

export type NpAdvancedCaseLibraryTarget = HiddenNpAcademyStatus & {
  readonly id: string;
  readonly specialtyArea: string;
  readonly caseTarget: number;
  readonly complexityLevels: readonly NpCaseComplexity[];
  readonly requiredSections: readonly ["History", "Assessment", "Diagnostics", "Management", "Follow-Up", "Documentation"];
};

export const NP_ADVANCED_CASE_LIBRARY_TARGETS: readonly NpAdvancedCaseLibraryTarget[] = [
  ["primary-care", "Primary Care", 180],
  ["womens-health", "Women's Health", 120],
  ["mental-health", "Mental Health", 130],
  ["pediatrics", "Pediatrics", 140],
  ["urgent-care", "Urgent Care", 120],
  ["hospital-medicine", "Hospital Medicine", 140],
  ["critical-care", "Critical Care", 140],
  ["emergency-care", "Emergency Care", 130],
].map(([id, specialtyArea, caseTarget]) => ({
  id,
  specialtyArea,
  caseTarget,
  complexityLevels: ["beginner", "intermediate", "advanced", "specialty"],
  requiredSections: ["History", "Assessment", "Diagnostics", "Management", "Follow-Up", "Documentation"],
  ...HIDDEN_NP_ACADEMY_STATUS,
})) as readonly NpAdvancedCaseLibraryTarget[];

export type NpOsceDomain = HiddenNpAcademyStatus & {
  readonly id: string;
  readonly title: string;
  readonly supports: readonly ["Checklists", "Scoring", "Feedback", "Remediation"];
};

export const NP_OSCE_PREPARATION_DOMAINS: readonly NpOsceDomain[] = [
  "Communication",
  "Assessment",
  "Clinical Reasoning",
  "Diagnostics",
  "Management",
  "Patient Education",
  "Professionalism",
].map((title) => ({
  id: title.toLowerCase().replaceAll(" ", "-"),
  title,
  supports: ["Checklists", "Scoring", "Feedback", "Remediation"],
  ...HIDDEN_NP_ACADEMY_STATUS,
})) as readonly NpOsceDomain[];

export type NpReadinessPassportDomain =
  | "competencies-mastered"
  | "cases-completed"
  | "specialty-performance"
  | "assessment-readiness"
  | "pharmacology-readiness"
  | "diagnostic-reasoning-readiness"
  | "certification-readiness";

export type NpSpecialtyReadinessModel = HiddenNpAcademyStatus & {
  readonly certification: Exclude<NpCertificationTag, "NP_CORE">;
  readonly domains: readonly string[];
  readonly reportCardSections: readonly ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"];
};

export const NP_READINESS_PASSPORT_DOMAINS: readonly NpReadinessPassportDomain[] = [
  "competencies-mastered",
  "cases-completed",
  "specialty-performance",
  "assessment-readiness",
  "pharmacology-readiness",
  "diagnostic-reasoning-readiness",
  "certification-readiness",
] as const;

export const NP_SPECIALTY_READINESS_MODELS: readonly NpSpecialtyReadinessModel[] = [
  { certification: "FNP", domains: ["Health Promotion", "Primary Care", "Diagnostics", "Management"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "AGPCNP", domains: ["Adult Medicine", "Geriatrics", "Complex Chronic Disease", "Polypharmacy"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "PMHNP", domains: ["Assessment", "Diagnosis", "Treatment", "Medication Management"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "WHNP", domains: ["Gynecology", "Prenatal Care", "Reproductive Health", "Screening"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "PNP_PC", domains: ["Growth & Development", "Pediatric Assessment", "Preventive Care", "Pediatric Pharmacology"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "PNP_AC", domains: ["Pediatric Acute Illness", "Emergency Pediatrics", "Complex Care", "Hospital Management"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "ACNPC_AG", domains: ["Critical Care", "Hemodynamics", "Ventilation", "Shock"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "ENP", domains: ["Emergency Assessment", "Resuscitation", "Trauma", "Emergency Diagnostics"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
  { certification: "CNPLE", domains: ["Canadian NP Competencies", "Clinical Decision-Making", "Leadership", "Health Promotion"], reportCardSections: ["Competency Trend", "Case Performance", "Weak Areas", "Recommended Remediation"], ...HIDDEN_NP_ACADEMY_STATUS },
] as const;

export function validateNpAdvancedCaseOsceReadiness(): readonly string[] {
  const issues: string[] = [];
  const totalCases = NP_ADVANCED_CASE_LIBRARY_TARGETS.reduce((sum, target) => sum + target.caseTarget, 0);
  if (totalCases < 1000) issues.push("NP Advanced Case Library must target at least 1,000 cases");
  for (const entry of [...NP_ADVANCED_CASE_LIBRARY_TARGETS, ...NP_OSCE_PREPARATION_DOMAINS, ...NP_SPECIALTY_READINESS_MODELS]) {
    if (entry.published || entry.visibleInNavigation || entry.launchReady || entry.indexable || !entry.adminOnly) {
      issues.push("NP case, OSCE, and readiness assets must remain hidden development content");
    }
  }
  return issues;
}
