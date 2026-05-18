/**
 * CNPLE study-domain taxonomy for NurseNest content tagging.
 *
 * These domain slugs are used internally to tag questions, flashcards, lessons,
 * and remediation signals for the ca-np-cnple pathway. Names are derived from
 * Canadian NP entry-level competency frameworks and practice-analysis literature.
 *
 * IMPORTANT: These are NurseNest internal study domains, not official CNPLE
 * blueprint percentages or confirmed exam section names. Use the label field for
 * learner-facing display and cross-reference against official CCRNR documentation
 * if exact blueprint categories become public.
 */

export type CnpleDomainSlug =
  | "clinical-assessment"
  | "diagnosis-differential"
  | "pharmacotherapeutics"
  | "diagnostics-labs"
  | "health-promotion-prevention"
  | "chronic-disease-management"
  | "dermatology-wound-care"
  | "endocrine-metabolic"
  | "acute-urgent-care"
  | "pediatrics"
  | "adult-care"
  | "older-adult-care"
  | "reproductive-sexual-health"
  | "mental-health"
  | "mental-health-substance-use"
  | "indigenous-health-cultural-safety"
  | "ethics-legal-professional"
  | "professional-practice"
  | "interprofessional-collaboration"
  | "patient-education-shared-decision";

export type CnpleDomain = {
  slug: CnpleDomainSlug;
  /** Learner-facing label. */
  label: string;
  /** Short label for compact UI (badges, chips). */
  shortLabel: string;
  /** Internal description of what the domain covers — not rendered to learners. */
  description: string;
};

export const CNPLE_DOMAINS: CnpleDomain[] = [
  {
    slug: "clinical-assessment",
    label: "Clinical Assessment",
    shortLabel: "Assessment",
    description:
      "History-taking, physical examination, vital signs interpretation, red-flag identification, and functional/psychosocial assessment across the lifespan.",
  },
  {
    slug: "diagnosis-differential",
    label: "Diagnosis and Differential Diagnosis",
    shortLabel: "Diagnosis",
    description:
      "Applying clinical reasoning to form a working diagnosis, generating a differential, and ruling in/out conditions based on history, exam, and initial investigations.",
  },
  {
    slug: "pharmacotherapeutics",
    label: "Pharmacotherapeutics and Prescribing Safety",
    shortLabel: "Prescribing",
    description:
      "Safe prescribing across drug classes, drug interactions, contraindications, dose adjustments for renal/hepatic/age factors, controlled substance regulations, and Canadian prescribing authority.",
  },
  {
    slug: "diagnostics-labs",
    label: "Diagnostics and Laboratory Interpretation",
    shortLabel: "Labs/Diagnostics",
    description:
      "Ordering and interpreting lab panels (CBC, BMP/CMP, LFTs, TSH, HbA1c, UA, INR/PT, lipids), ECG interpretation, diagnostic imaging selection, and critical value recognition.",
  },
  {
    slug: "health-promotion-prevention",
    label: "Health Promotion and Disease Prevention",
    shortLabel: "Prevention",
    description:
      "Immunization schedules (Canadian), cancer and chronic disease screening, lifestyle counselling, upstream determinants of health, and population health approaches.",
  },
  {
    slug: "chronic-disease-management",
    label: "Chronic Disease Management Across Lifespan",
    shortLabel: "Chronic Disease",
    description:
      "Guideline-based management of hypertension, diabetes, COPD, heart failure, dyslipidemia, osteoporosis, CKD, and other prevalent chronic conditions across adult and older-adult populations.",
  },
  {
    slug: "endocrine-metabolic",
    label: "Endocrine and Metabolic Care",
    shortLabel: "Endocrine",
    description:
      "Thyroid disease, diabetes-adjacent metabolic risk, endocrine prescribing, monitoring intervals, and patient education for long-term endocrine conditions.",
  },
  {
    slug: "dermatology-wound-care",
    label: "Dermatology and Wound Care",
    shortLabel: "Skin/Wounds",
    description:
      "Skin infection assessment, wound and cellulitis escalation, recurrence prevention, dermatologic red flags, and related prescribing safety.",
  },
  {
    slug: "acute-urgent-care",
    label: "Acute Deterioration and Urgent Referral Recognition",
    shortLabel: "Acute/Urgent",
    description:
      "Red-flag recognition for time-sensitive presentations (chest pain, stroke, sepsis, respiratory failure, anaphylaxis), appropriate escalation, and consultation/referral thresholds.",
  },
  {
    slug: "pediatrics",
    label: "Pediatrics",
    shortLabel: "Pediatrics",
    description:
      "Developmental milestones, pediatric vital sign norms, common childhood illnesses, growth and nutrition, vaccine-preventable disease, and safe dosing in children.",
  },
  {
    slug: "adult-care",
    label: "Adult Primary Care",
    shortLabel: "Adult Care",
    description:
      "Primary care for working-age adults including preventive care, acute illness, occupational health considerations, and mental/physical comorbidity management.",
  },
  {
    slug: "older-adult-care",
    label: "Older Adult Care and Geriatrics",
    shortLabel: "Geriatrics",
    description:
      "Frailty screening, polypharmacy/Beers criteria, falls prevention, dementia, delirium, functional decline, advance care planning, and atypical disease presentation in older adults.",
  },
  {
    slug: "reproductive-sexual-health",
    label: "Reproductive and Sexual Health",
    shortLabel: "Reproductive Health",
    description:
      "Prenatal care, contraception, STI screening and treatment, menopause, sexual health counselling, pregnancy complications, and fertility considerations within NP scope.",
  },
  {
    slug: "mental-health",
    label: "Mental Health",
    shortLabel: "Mental Health",
    description:
      "Assessment and management of depression, anxiety, PTSD, substance use disorders, eating disorders, psychosis risk, and safe prescribing in mental health (Canadian context).",
  },
  {
    slug: "mental-health-substance-use",
    label: "Mental Health and Substance Use",
    shortLabel: "MH/SUD",
    description:
      "Integrated mental health and substance-use assessment, opioid agonist therapy readiness, harm reduction, follow-up planning, and safe prescribing.",
  },
  {
    slug: "indigenous-health-cultural-safety",
    label: "Indigenous Health and Culturally Safe Care",
    shortLabel: "Cultural Safety",
    description:
      "Culturally safe practice, trauma-informed care, understanding health disparities, UNDRIP principles, and NP responsibilities in providing equitable care for Indigenous peoples in Canada.",
  },
  {
    slug: "ethics-legal-professional",
    label: "Ethics, Legal, and Professional Responsibility",
    shortLabel: "Ethics/Legal",
    description:
      "Informed consent, capacity assessment, mandatory reporting, privacy legislation (PIPEDA/provincial), scope of practice in Canadian jurisdictions, documentation standards, and professional accountability.",
  },
  {
    slug: "professional-practice",
    label: "Professional Practice",
    shortLabel: "Professional",
    description:
      "NP scope, collaborative practice, documentation, mandatory reporting, public-health obligations, autonomy, and ethical decision-making in Canadian care settings.",
  },
  {
    slug: "interprofessional-collaboration",
    label: "Interprofessional Care and Consultation",
    shortLabel: "Collaboration",
    description:
      "Referral decision-making, communication with specialist/hospital teams, delegation, collaborative care models, and NP role clarity in team-based Canadian health systems.",
  },
  {
    slug: "patient-education-shared-decision",
    label: "Patient Education and Shared Decision-Making",
    shortLabel: "Patient Education",
    description:
      "Engaging patients in care planning, health literacy-appropriate education, self-management support, motivational interviewing, and supported decision-making.",
  },
];

/** Stable set of all domain slugs for validation. */
export const CNPLE_DOMAIN_SLUGS = new Set<CnpleDomainSlug>(
  CNPLE_DOMAINS.map((d) => d.slug),
);

/** Look up a domain by slug. Returns `undefined` if not found. */
export function getCnpleDomain(slug: string): CnpleDomain | undefined {
  return CNPLE_DOMAINS.find((d) => d.slug === slug);
}

/** Validate that a slug is a known CNPLE domain. */
export function isValidCnpleDomainSlug(slug: string): slug is CnpleDomainSlug {
  return CNPLE_DOMAIN_SLUGS.has(slug as CnpleDomainSlug);
}
