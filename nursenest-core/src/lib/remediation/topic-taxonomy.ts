/**
 * Canonical topic taxonomy for CNPLE adaptive remediation.
 *
 * Maps raw topic strings (from questions, flashcards, lessons, remediation events)
 * to stable canonical IDs and CNPLE competency domain codes.
 *
 * Conservative: no semantic synonym merging beyond formatting normalization.
 * All lookups go through normalizeTopicKey so the index is case/whitespace-invariant.
 */

import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

export type CnpleDomainCode =
  | "diagnostics"
  | "prescribing"
  | "lifespan_care"
  | "escalation_referral"
  | "clinical_judgment";

export type TopicDangerLevel = "critical" | "high" | "standard";

export type CanonicalTopicEntry = {
  /** Stable ID, format: "cnple:{domain}:{slug}" */
  id: string;
  domain: CnpleDomainCode;
  label: string;
  /** Alternate raw topic strings that resolve to this entry. */
  aliases: string[];
  /** True when a miss in this topic is prescribing-safety-critical. */
  prescribingSafety?: boolean;
  dangerLevel?: TopicDangerLevel;
};

/** CNPLE domain metadata for readiness scoring thresholds. */
export const CNPLE_DOMAIN_META: Record<
  CnpleDomainCode,
  { label: string; passingThreshold: number }
> = {
  diagnostics: { label: "Diagnostics & Assessment", passingThreshold: 0.72 },
  prescribing: { label: "Prescribing & Pharmacology", passingThreshold: 0.78 },
  lifespan_care: { label: "Lifespan Care", passingThreshold: 0.70 },
  escalation_referral: { label: "Escalation & Referral", passingThreshold: 0.75 },
  clinical_judgment: { label: "Clinical Judgment", passingThreshold: 0.70 },
};

const CANONICAL_ENTRIES: CanonicalTopicEntry[] = [
  // ── Diagnostics ───────────────────────────────────────────────────────────
  {
    id: "cnple:diagnostics:physical_assessment",
    domain: "diagnostics",
    label: "Physical Assessment",
    aliases: [
      "physical assessment",
      "health assessment",
      "clinical assessment",
      "systems assessment",
      "focused assessment",
      "head-to-toe assessment",
    ],
  },
  {
    id: "cnple:diagnostics:laboratory",
    domain: "diagnostics",
    label: "Laboratory Interpretation",
    aliases: [
      "laboratory",
      "lab values",
      "lab interpretation",
      "diagnostic tests",
      "bloodwork",
      "blood tests",
      "urinalysis",
      "serology",
      "culture and sensitivity",
    ],
    dangerLevel: "high",
  },
  {
    id: "cnple:diagnostics:imaging",
    domain: "diagnostics",
    label: "Imaging & Diagnostic Studies",
    aliases: [
      "imaging",
      "radiology",
      "ecg",
      "electrocardiogram",
      "ekg",
      "diagnostic imaging",
      "echocardiogram",
      "ultrasound",
      "x-ray",
      "ct scan",
      "mri",
      "spirometry",
    ],
  },
  {
    id: "cnple:diagnostics:differential",
    domain: "diagnostics",
    label: "Differential Diagnosis",
    aliases: [
      "differential diagnosis",
      "diagnostic reasoning",
      "clinical reasoning",
      "history taking",
      "patient history",
      "clinical diagnosis",
      "diagnostic workup",
    ],
  },
  {
    id: "cnple:diagnostics:mental_health_assessment",
    domain: "diagnostics",
    label: "Mental Health Assessment",
    aliases: [
      "mental health assessment",
      "psychiatric assessment",
      "mental status exam",
      "cognitive assessment",
      "suicide risk assessment",
      "depression screening",
      "anxiety screening",
    ],
    dangerLevel: "high",
  },

  // ── Prescribing ───────────────────────────────────────────────────────────
  {
    id: "cnple:prescribing:pharmacology",
    domain: "prescribing",
    label: "Pharmacology",
    aliases: [
      "pharmacology",
      "pharmacotherapeutics",
      "drug therapy",
      "medication management",
      "pharmacokinetics",
      "pharmacodynamics",
    ],
    prescribingSafety: true,
    dangerLevel: "critical",
  },
  {
    id: "cnple:prescribing:drug_interactions",
    domain: "prescribing",
    label: "Drug Interactions & Contraindications",
    aliases: [
      "drug interactions",
      "medication interactions",
      "drug-drug interactions",
      "contraindications",
      "drug-food interactions",
      "drug contraindications",
    ],
    prescribingSafety: true,
    dangerLevel: "critical",
  },
  {
    id: "cnple:prescribing:controlled_substances",
    domain: "prescribing",
    label: "Controlled Substances",
    aliases: [
      "controlled substances",
      "opioids",
      "narcotics",
      "scheduled medications",
      "benzodiazepines",
      "stimulants",
      "opioid prescribing",
      "narcotic prescribing",
    ],
    prescribingSafety: true,
    dangerLevel: "critical",
  },
  {
    id: "cnple:prescribing:adverse_effects",
    domain: "prescribing",
    label: "Adverse Effects & Toxicity",
    aliases: [
      "adverse effects",
      "side effects",
      "drug reactions",
      "toxicity",
      "medication errors",
      "adverse drug reactions",
      "drug toxicity",
      "medication toxicity",
    ],
    prescribingSafety: true,
    dangerLevel: "high",
  },
  {
    id: "cnple:prescribing:dosing",
    domain: "prescribing",
    label: "Medication Dosing",
    aliases: [
      "dosing",
      "dose calculation",
      "medication dosing",
      "dosage",
      "titration",
      "dose adjustment",
      "renal dosing",
      "hepatic dosing",
      "weight-based dosing",
    ],
    prescribingSafety: true,
    dangerLevel: "high",
  },
  {
    id: "cnple:prescribing:antibiotics",
    domain: "prescribing",
    label: "Antimicrobial Prescribing",
    aliases: [
      "antibiotics",
      "antimicrobials",
      "antibiotic prescribing",
      "antimicrobial stewardship",
      "antivirals",
      "antifungals",
    ],
    prescribingSafety: true,
    dangerLevel: "high",
  },

  // ── Lifespan Care ─────────────────────────────────────────────────────────
  {
    id: "cnple:lifespan_care:pediatrics",
    domain: "lifespan_care",
    label: "Pediatrics",
    aliases: [
      "pediatrics",
      "paediatrics",
      "child health",
      "pediatric care",
      "infant care",
      "neonatal care",
      "adolescent health",
      "well-child visits",
    ],
  },
  {
    id: "cnple:lifespan_care:geriatrics",
    domain: "lifespan_care",
    label: "Geriatrics",
    aliases: [
      "geriatrics",
      "elderly care",
      "older adult",
      "gerontology",
      "frailty",
      "falls prevention",
      "polypharmacy",
      "dementia care",
    ],
  },
  {
    id: "cnple:lifespan_care:perinatal",
    domain: "lifespan_care",
    label: "Perinatal & Prenatal Care",
    aliases: [
      "prenatal",
      "perinatal",
      "obstetrics",
      "maternal care",
      "pregnancy",
      "postpartum",
      "antepartum",
      "intrapartum",
      "antenatal",
    ],
  },
  {
    id: "cnple:lifespan_care:womens_health",
    domain: "lifespan_care",
    label: "Women's Health",
    aliases: [
      "women's health",
      "gynecology",
      "reproductive health",
      "menopause",
      "contraception",
      "cervical screening",
      "breast health",
      "pap smear",
    ],
  },
  {
    id: "cnple:lifespan_care:preventive",
    domain: "lifespan_care",
    label: "Preventive Care & Health Promotion",
    aliases: [
      "preventive care",
      "health promotion",
      "screening",
      "immunization",
      "vaccination",
      "health education",
      "lifestyle counselling",
      "chronic disease prevention",
    ],
  },
  {
    id: "cnple:lifespan_care:mental_health",
    domain: "lifespan_care",
    label: "Mental Health Across the Lifespan",
    aliases: [
      "mental health",
      "psychiatric care",
      "depression",
      "anxiety",
      "bipolar disorder",
      "schizophrenia",
      "substance use",
      "addiction",
      "trauma-informed care",
    ],
    dangerLevel: "high",
  },

  // ── Escalation & Referral ─────────────────────────────────────────────────
  {
    id: "cnple:escalation_referral:emergency",
    domain: "escalation_referral",
    label: "Emergency Management",
    aliases: [
      "emergency",
      "emergency management",
      "acute care",
      "critical care",
      "resuscitation",
      "code management",
      "sepsis",
      "anaphylaxis",
      "acute MI",
      "stroke",
    ],
    dangerLevel: "critical",
  },
  {
    id: "cnple:escalation_referral:referral",
    domain: "escalation_referral",
    label: "Referral & Consultation",
    aliases: [
      "referral",
      "consultation",
      "specialist referral",
      "care coordination",
      "interprofessional",
      "collaborative practice",
      "specialist consultation",
    ],
    dangerLevel: "high",
  },
  {
    id: "cnple:escalation_referral:transfer",
    domain: "escalation_referral",
    label: "Transfer of Care & Escalation",
    aliases: [
      "transfer",
      "transfer of care",
      "handoff",
      "patient transfer",
      "escalation",
      "sbar",
      "deteriorating patient",
      "rapid response",
    ],
    dangerLevel: "high",
  },
  {
    id: "cnple:escalation_referral:safety_reporting",
    domain: "escalation_referral",
    label: "Safety Reporting & Duty to Report",
    aliases: [
      "mandatory reporting",
      "duty to report",
      "incident reporting",
      "adverse event reporting",
      "near miss",
      "safety reporting",
      "child protection",
      "elder abuse",
    ],
    dangerLevel: "high",
  },

  // ── Clinical Judgment ─────────────────────────────────────────────────────
  {
    id: "cnple:clinical_judgment:priority",
    domain: "clinical_judgment",
    label: "Priority Setting & Triage",
    aliases: [
      "priority",
      "triage",
      "urgency",
      "prioritization",
      "safety",
      "first action",
      "priority setting",
      "clinical priority",
    ],
    dangerLevel: "high",
  },
  {
    id: "cnple:clinical_judgment:management",
    domain: "clinical_judgment",
    label: "Clinical Management & Care Planning",
    aliases: [
      "management",
      "clinical management",
      "treatment planning",
      "care planning",
      "chronic disease management",
    ],
  },
  {
    id: "cnple:clinical_judgment:delegation",
    domain: "clinical_judgment",
    label: "Delegation & Scope of Practice",
    aliases: [
      "delegation",
      "supervision",
      "scope of practice",
      "care delegation",
      "task assignment",
      "unlicensed personnel",
    ],
  },
  {
    id: "cnple:clinical_judgment:evidence",
    domain: "clinical_judgment",
    label: "Evidence-Based Practice",
    aliases: [
      "evidence-based",
      "clinical guidelines",
      "best practice",
      "research application",
      "clinical evidence",
      "cpg",
      "practice guidelines",
    ],
  },
  {
    id: "cnple:clinical_judgment:ethics_legal",
    domain: "clinical_judgment",
    label: "Ethics, Legal & Professional Practice",
    aliases: [
      "ethics",
      "legal",
      "professional practice",
      "informed consent",
      "confidentiality",
      "documentation",
      "regulated practice",
      "scope",
      "professional accountability",
    ],
  },
];

// ── Lookup indexes (built at module load) ─────────────────────────────────────

const _byNormalizedAlias = new Map<string, CanonicalTopicEntry>();
const _byId = new Map<string, CanonicalTopicEntry>();

for (const entry of CANONICAL_ENTRIES) {
  _byId.set(entry.id, entry);
  _byNormalizedAlias.set(normalizeTopicKey(entry.label), entry);
  for (const alias of entry.aliases) {
    const key = normalizeTopicKey(alias);
    if (!_byNormalizedAlias.has(key)) {
      _byNormalizedAlias.set(key, entry);
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Resolve a raw topic string to its canonical entry.
 * Returns null when the topic is not in the CNPLE taxonomy.
 */
export function resolveCanonicalTopic(raw: string | null | undefined): CanonicalTopicEntry | null {
  if (!raw) return null;
  return _byNormalizedAlias.get(normalizeTopicKey(raw)) ?? null;
}

/** Resolve to canonical ID string, or null. */
export function resolveCanonicalTopicId(raw: string | null | undefined): string | null {
  return resolveCanonicalTopic(raw)?.id ?? null;
}

/** Resolve to CNPLE domain code, or null. */
export function resolveCnpleDomain(raw: string | null | undefined): CnpleDomainCode | null {
  return resolveCanonicalTopic(raw)?.domain ?? null;
}

/** True when the topic is prescribing-safety-critical. */
export function isPrescribingSafetyTopic(raw: string | null | undefined): boolean {
  return resolveCanonicalTopic(raw)?.prescribingSafety === true;
}

/** Returns the danger level of a topic, defaulting to "standard". */
export function topicDangerLevel(raw: string | null | undefined): TopicDangerLevel {
  return resolveCanonicalTopic(raw)?.dangerLevel ?? "standard";
}

/** All canonical entries for a given CNPLE domain. */
export function canonicalEntriesForDomain(domain: CnpleDomainCode): CanonicalTopicEntry[] {
  return CANONICAL_ENTRIES.filter((e) => e.domain === domain);
}

export { CANONICAL_ENTRIES };
