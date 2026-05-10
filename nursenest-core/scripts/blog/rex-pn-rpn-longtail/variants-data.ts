/**
 * Eleven variant lenses × 30 anchors = 330 deterministic long-tail permutations.
 * Each variant adjusts title suffix and adds a distinct exam-prep emphasis paragraph bank in the renderer.
 */
export type VariantSpec = {
  slugSuffix: string;
  titleSuffix: string;
  /** Short label used inside body text */
  emphasis: string;
};

export const VARIANTS: VariantSpec[] = [
  { slugSuffix: "clinical-judgment-priorities", titleSuffix: "Clinical judgment and prioritization drills", emphasis: "prioritization and first-action discipline" },
  { slugSuffix: "documentation-exam-focus", titleSuffix: "Documentation expectations on Canadian PN exams", emphasis: "defensible, objective, and legally cautious documentation" },
  { slugSuffix: "delegation-ucp-canada", titleSuffix: "Delegation and unregulated care provider collaboration", emphasis: "delegation to UCPs, supervision, and accountability in Canadian teams" },
  { slugSuffix: "ipac-routine-practices-canada", titleSuffix: "IPAC routine practices and outbreak language", emphasis: "routine practices, additional precautions, and outbreak communication" },
  { slugSuffix: "medication-safety-mar-canada", titleSuffix: "Medication safety, MAR checks, and high-alert vigilance", emphasis: "medication reconciliation, high-alert drugs, and independent double checks where policy requires" },
  { slugSuffix: "home-community-nursing-canada", titleSuffix: "Home and community care realities for RPN practice", emphasis: "home care safety, lone-worker considerations, and family caregiver coaching" },
  { slugSuffix: "ltc-ontario-shift-realities", titleSuffix: "LTC shift realities and resident-centred pacing", emphasis: "LTC workload, consent for care tasks, and respectful assistance with ADLs" },
  { slugSuffix: "acute-med-surg-canada", titleSuffix: "Acute med-surg priorities for practical nurses", emphasis: "acute instability, telemetry basics as taught, and rapid response activation" },
  { slugSuffix: "patient-teaching-health-literacy", titleSuffix: "Patient teaching and health literacy for Canadian PN learners", emphasis: "teach-back, plain language, and culturally safer education delivery" },
  { slugSuffix: "sbar-escalation-canada", titleSuffix: "SBAR, escalation, and interprofessional handoff discipline", emphasis: "SBAR structure, appropriate escalation, and closed-loop communication" },
  { slugSuffix: "rex-pn-ngn-item-thinking", titleSuffix: "REx-PN and NGN-style case thinking", emphasis: "matrix, bowtie, trend, and select-all-that-apply reasoning patterns" },
];
