export type FrCaGlossaryEntry = {
  english: string;
  preferredFrench: string;
  notes?: string;
  protected?: boolean;
};

export const FR_CA_PROTECTED_TERMS = [
  "NurseNest",
  "REx-PN",
  "NCLEX",
  "CPNRE",
  "OSCE",
  "CAT",
  "RN",
  "RPN",
  "PN",
  "NP",
  "NGN",
  "NCSBN",
  "CASN",
] as const;

export const FR_CA_CLINICAL_GLOSSARY: readonly FrCaGlossaryEntry[] = [
  { english: "practical nurse", preferredFrench: "infirmière auxiliaire autorisée", notes: "Use Canadian PN/RPN context; keep PN/RPN abbreviation when part of exam branding." },
  { english: "registered practical nurse", preferredFrench: "infirmière auxiliaire autorisée", notes: "Ontario-specific RPN may be kept as RPN when referring to the credential." },
  { english: "registered nurse", preferredFrench: "infirmière autorisée" },
  { english: "nurse practitioner", preferredFrench: "infirmière praticienne" },
  { english: "nursing exam prep", preferredFrench: "préparation aux examens infirmiers" },
  { english: "practice questions", preferredFrench: "questions d'entraînement" },
  { english: "flashcards", preferredFrench: "cartes mémoire" },
  { english: "rationale", preferredFrench: "justification" },
  { english: "care plan", preferredFrench: "plan de soins" },
  { english: "clinical judgment", preferredFrench: "jugement clinique" },
  { english: "priority assessment", preferredFrench: "évaluation prioritaire" },
  { english: "medication administration", preferredFrench: "administration des médicaments" },
  { english: "dosage calculation", preferredFrench: "calcul de dose" },
  { english: "patient safety", preferredFrench: "sécurité des patients" },
  { english: "infection prevention", preferredFrench: "prévention des infections" },
  { english: "therapeutic communication", preferredFrench: "communication thérapeutique" },
  { english: "scope of practice", preferredFrench: "champ d'exercice" },
  { english: "professional accountability", preferredFrench: "responsabilité professionnelle" },
  { english: "health assessment", preferredFrench: "évaluation de la santé" },
  { english: "pediatrics", preferredFrench: "pédiatrie" },
  { english: "maternity", preferredFrench: "maternité" },
  { english: "mental health", preferredFrench: "santé mentale" },
  { english: "pharmacology", preferredFrench: "pharmacologie" },
  { english: "medical-surgical nursing", preferredFrench: "soins infirmiers médico-chirurgicaux" },
  ...FR_CA_PROTECTED_TERMS.map((term) => ({ english: term, preferredFrench: term, protected: true })),
] as const;
