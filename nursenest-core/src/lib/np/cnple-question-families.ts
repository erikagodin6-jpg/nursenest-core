/**
 * CNPLE-aligned practice question families for NurseNest.
 *
 * IMPORTANT DISCLAIMER:
 * These are NurseNest practice question formats modelled on Canadian NP clinical
 * competency frameworks. They are NOT confirmed official CNPLE item types, not
 * sourced from an official CNPLE blueprint, and do not represent the official
 * weighting, item count, or format specification of the CNPLE exam.
 *
 * Present to learners as "CNPLE-aligned practice formats" or "clinical judgment
 * practice," never as "official CNPLE question types."
 *
 * The CNPLE uses LOFT (linear on-the-fly testing), not CAT.
 */

import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";

export type CnpleQuestionFamilySlug =
  | "single-best-answer-clinical-judgment"
  | "case-based-diagnostic-reasoning"
  | "safe-prescribing-medication-management"
  | "lab-diagnostic-interpretation"
  | "lifespan-primary-care"
  | "acute-deterioration-urgent-referral"
  | "health-promotion-screening"
  | "professional-ethics-legal-scope"
  | "interprofessional-care-consultation"
  | "chronic-disease-management";

export type CnpleQuestionFamily = {
  slug: CnpleQuestionFamilySlug;
  /** Learner-facing practice format label. */
  label: string;
  /** Short label for compact UI (filters, chips). */
  shortLabel: string;
  /**
   * Learner-facing description of what this practice format tests.
   * Must not claim to be official CNPLE format.
   */
  description: string;
  /** Primary CNPLE study domains this format most commonly assesses. */
  primaryDomains: CnpleDomainSlug[];
  /** Whether this family emphasises clinical scenario/case setup. */
  isCaseBased: boolean;
  /** Practical notes for content authors. Not rendered to learners. */
  authoringNotes: string;
};

export const CNPLE_QUESTION_FAMILIES: CnpleQuestionFamily[] = [
  {
    slug: "single-best-answer-clinical-judgment",
    label: "Single-Best-Answer Clinical Judgment",
    shortLabel: "Clinical Judgment",
    description:
      "Clinical vignette with one best answer requiring integration of assessment findings, differential reasoning, or management selection. Emphasises decision-making rather than recall.",
    primaryDomains: ["clinical-assessment", "diagnosis-differential", "adult-care"],
    isCaseBased: true,
    authoringNotes:
      "Use a 2–5 sentence patient scenario. One clearly superior answer; distractors differ in priority or safety. Rationale must explain why each distractor is inferior.",
  },
  {
    slug: "case-based-diagnostic-reasoning",
    label: "Case-Based Diagnostic Reasoning",
    shortLabel: "Diagnostic Reasoning",
    description:
      "Multi-detail clinical case requiring the NP to form a working diagnosis or differential and determine the most appropriate next diagnostic step.",
    primaryDomains: ["diagnosis-differential", "diagnostics-labs", "clinical-assessment"],
    isCaseBased: true,
    authoringNotes:
      "Include relevant positives and negatives in the case. The correct answer should be the most likely diagnosis or the most discriminating next investigation. Avoid diagnosis by exclusion unless clinically sound.",
  },
  {
    slug: "safe-prescribing-medication-management",
    label: "Safe Prescribing and Medication Management",
    shortLabel: "Prescribing Safety",
    description:
      "Practice questions focused on safe drug selection, dose, contraindications, interactions, monitoring, and Canadian prescribing regulations. Includes high-alert medications and controlled substances.",
    primaryDomains: ["pharmacotherapeutics", "chronic-disease-management", "older-adult-care"],
    isCaseBased: true,
    authoringNotes:
      "Ground in Canadian drug guides (CPS) and provincial/federal prescribing authority. Flag high-alert drugs (warfarin, insulin, opioids, lithium). Rationale must explain mechanism or regulatory basis.",
  },
  {
    slug: "lab-diagnostic-interpretation",
    label: "Lab and Diagnostic Interpretation",
    shortLabel: "Lab Interpretation",
    description:
      "Interpret laboratory panels, point-of-care results, ECG tracings, or imaging reports to reach a clinical decision. Includes identifying critical values and appropriate follow-up.",
    primaryDomains: ["diagnostics-labs", "diagnosis-differential", "pharmacotherapeutics"],
    isCaseBased: true,
    authoringNotes:
      "Provide lab values with reference ranges. Questions should lead to a management decision, not pure recall of normal values. ECG stems should identify rhythm or key finding, not just name the tracing.",
  },
  {
    slug: "lifespan-primary-care",
    label: "Lifespan Primary Care",
    shortLabel: "Lifespan Care",
    description:
      "Primary care scenarios across age groups — from paediatric well-child visits to geriatric complex cases — assessing NP competence in age-appropriate assessment and management.",
    primaryDomains: ["pediatrics", "adult-care", "older-adult-care", "health-promotion-prevention"],
    isCaseBased: true,
    authoringNotes:
      "Specify age and relevant developmental context. For children, use weight-based dosing and milestone context. For older adults, consider polypharmacy, frailty, and atypical presentation.",
  },
  {
    slug: "acute-deterioration-urgent-referral",
    label: "Acute Deterioration and Urgent Referral Recognition",
    shortLabel: "Acute/Urgent",
    description:
      "Recognise time-sensitive clinical deterioration and select the most appropriate escalation, referral, or emergency management step within NP scope.",
    primaryDomains: ["acute-urgent-care", "clinical-assessment", "interprofessional-collaboration"],
    isCaseBased: true,
    authoringNotes:
      "Include red-flag signs in the scenario (desaturation, hypotension, altered LOC). Correct answer is often the most urgent safe action (call 911, transfer, activate code). Rationale should explain the physiological urgency.",
  },
  {
    slug: "health-promotion-screening",
    label: "Health Promotion and Screening",
    shortLabel: "Prevention/Screening",
    description:
      "Apply Canadian evidence-based screening guidelines, immunisation schedules, and health promotion counselling in primary care encounters.",
    primaryDomains: ["health-promotion-prevention", "adult-care", "pediatrics", "older-adult-care"],
    isCaseBased: false,
    authoringNotes:
      "Reference Canadian Task Force on Preventive Health Care, NACI (vaccines), or provincial guidelines. Do not cite USPSTF as primary authority for Canadian practice; note differences where relevant.",
  },
  {
    slug: "professional-ethics-legal-scope",
    label: "Professional, Ethical, Legal, and Scope-of-Practice",
    shortLabel: "Professional Practice",
    description:
      "Navigate ethical dilemmas, legal obligations, privacy and consent, mandatory reporting, and NP scope-of-practice boundaries within Canadian regulatory frameworks.",
    primaryDomains: [
      "ethics-legal-professional",
      "indigenous-health-cultural-safety",
      "patient-education-shared-decision",
    ],
    isCaseBased: true,
    authoringNotes:
      "Reference Canadian legislation (PIPEDA, provincial privacy acts, Controlled Drugs and Substances Act). Avoid HIPAA — it is US-specific. Scope-of-practice questions must reflect provincial NP regulations, not US NP scope.",
  },
  {
    slug: "interprofessional-care-consultation",
    label: "Interprofessional Care and Consultation",
    shortLabel: "Collaboration",
    description:
      "Determine when and how to refer, consult, or collaborate with other health professionals, and how to communicate effectively across the care team.",
    primaryDomains: ["interprofessional-collaboration", "ethics-legal-professional", "acute-urgent-care"],
    isCaseBased: true,
    authoringNotes:
      "The correct answer often hinges on when to involve another provider versus manage independently. Rationale should justify the referral threshold using clinical criteria or Canadian care pathways.",
  },
  {
    slug: "chronic-disease-management",
    label: "Chronic Disease Management Across Lifespan",
    shortLabel: "Chronic Disease",
    description:
      "Apply guideline-based management for prevalent chronic conditions (HTN, diabetes, COPD, CHF, dyslipidemia, CKD, osteoporosis) across adult and older-adult populations in a Canadian primary-care context.",
    primaryDomains: ["chronic-disease-management", "pharmacotherapeutics", "older-adult-care", "patient-education-shared-decision"],
    isCaseBased: true,
    authoringNotes:
      "Reference Canadian guidelines (Hypertension Canada, Diabetes Canada, CTS COPD, CCS Heart Failure). Flag where Canadian and US guidelines diverge. Include target values (e.g. BP, A1c, LDL) but do not present them as exam-required memorisation thresholds.",
  },
];

/** Stable set of all family slugs for validation. */
export const CNPLE_QUESTION_FAMILY_SLUGS = new Set<CnpleQuestionFamilySlug>(
  CNPLE_QUESTION_FAMILIES.map((f) => f.slug),
);

/** Look up a question family by slug. */
export function getCnpleQuestionFamily(slug: string): CnpleQuestionFamily | undefined {
  return CNPLE_QUESTION_FAMILIES.find((f) => f.slug === slug);
}

/** Validate that a slug is a known CNPLE question family. */
export function isValidCnpleQuestionFamilySlug(slug: string): slug is CnpleQuestionFamilySlug {
  return CNPLE_QUESTION_FAMILY_SLUGS.has(slug as CnpleQuestionFamilySlug);
}
