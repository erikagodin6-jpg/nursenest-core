import { pool } from "./storage";

const CANONICAL_BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal", "Endocrine", "Musculoskeletal", "Integumentary",
  "Hematology", "Immunological", "Reproductive", "Mental Health",
  "Pediatrics", "Maternal/Newborn", "Pharmacology", "Fundamentals",
  "Infection Control", "Emergency", "Oncology", "Geriatrics",
  "Critical Care", "Perioperative", "Multi-system",
];

const BODY_SYSTEM_ALIASES: Record<string, string> = {
  "cardiac": "Cardiovascular",
  "heart": "Cardiovascular",
  "cardio": "Cardiovascular",
  "vascular": "Cardiovascular",
  "pulmonary": "Respiratory",
  "lung": "Respiratory",
  "neuro": "Neurological",
  "neurology": "Neurological",
  "nervous system": "Neurological",
  "gi": "Gastrointestinal",
  "digestive": "Gastrointestinal",
  "hepatic": "Gastrointestinal",
  "liver": "Gastrointestinal",
  "renal/urinary": "Renal",
  "urinary": "Renal",
  "kidney": "Renal",
  "gu": "Renal",
  "urology": "Renal",
  "nephrology": "Renal",
  "endocrinology": "Endocrine",
  "thyroid": "Endocrine",
  "diabetes": "Endocrine",
  "msk": "Musculoskeletal",
  "orthopedic": "Musculoskeletal",
  "skin": "Integumentary",
  "dermatology": "Integumentary",
  "wound care": "Integumentary",
  "hematological": "Hematology",
  "blood": "Hematology",
  "immune": "Immunological",
  "immunology": "Immunological",
  "immune/respiratory": "Immunological",
  "infectious disease": "Infection Control",
  "infection": "Infection Control",
  "reproductive": "Reproductive",
  "women's health": "Reproductive",
  "maternal": "Maternal/Newborn",
  "maternal health": "Maternal/Newborn",
  "maternal-newborn": "Maternal/Newborn",
  "maternity": "Maternal/Newborn",
  "obstetrics": "Maternal/Newborn",
  "newborn": "Maternal/Newborn",
  "neonatal": "Maternal/Newborn",
  "psychiatry": "Mental Health",
  "psych": "Mental Health",
  "behavioral health": "Mental Health",
  "pediatric": "Pediatrics",
  "peds": "Pediatrics",
  "child health": "Pediatrics",
  "pharmacology": "Pharmacology",
  "medication": "Pharmacology",
  "drug": "Pharmacology",
  "fundamentals": "Fundamentals",
  "safety": "Fundamentals",
  "delegation": "Fundamentals",
  "professional practice": "Fundamentals",
  "community health": "Fundamentals",
  "health promotion": "Fundamentals",
  "ent": "Respiratory",
  "sensory": "Neurological",
  "sepsis": "Infection Control",
  "oncology": "Oncology",
  "cancer": "Oncology",
  "geriatrics": "Geriatrics",
  "gerontology": "Geriatrics",
  "emergency": "Emergency",
  "trauma": "Emergency",
  "critical care": "Critical Care",
  "icu": "Critical Care",
  "perioperative": "Perioperative",
  "surgical": "Perioperative",
  "multi-system": "Multi-system",
  "pain management": "Pharmacology",
  "palliative care": "Geriatrics",
  "stress/metabolism": "Endocrine",
  "fluid/electrolytes": "Renal",
  "clinical procedures": "Fundamentals",
  "safety/delegation": "Fundamentals",
  "ethics/legal": "Fundamentals",
  "medical-surgical": "Multi-system",
  "preventive medicine": "Fundamentals",
};

const CANONICAL_TIERS = ["rpn", "rn", "np"];

const TIER_EXAM_MAP: Record<string, string> = {
  rpn: "REx-PN",
  rn: "NCLEX-RN",
  np: "NP-CAT",
};

export function normalizeBodySystem(input: string | null | undefined): string {
  if (!input) return "Multi-system";
  const trimmed = input.trim();

  const exactMatch = CANONICAL_BODY_SYSTEMS.find(
    s => s.toLowerCase() === trimmed.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  const aliasMatch = BODY_SYSTEM_ALIASES[trimmed.toLowerCase()];
  if (aliasMatch) return aliasMatch;

  const partialMatch = CANONICAL_BODY_SYSTEMS.find(
    s => trimmed.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  for (const [alias, canonical] of Object.entries(BODY_SYSTEM_ALIASES)) {
    if (trimmed.toLowerCase().includes(alias)) return canonical;
  }

  return "Multi-system";
}

export function normalizeTier(input: string | null | undefined): string {
  if (!input) return "rpn";
  const lower = input.toLowerCase().trim();
  if (CANONICAL_TIERS.includes(lower)) return lower;
  if (lower.includes("pn") || lower.includes("lpn") || lower.includes("rpn") || lower.includes("practical")) return "rpn";
  if (lower.includes("np") || lower.includes("practitioner")) return "np";
  if (lower.includes("rn") || lower.includes("registered")) return "rn";
  return "rpn";
}

export function getExamForTier(tier: string): string {
  return TIER_EXAM_MAP[tier] || TIER_EXAM_MAP.rpn;
}

export function normalizeQuestionType(input: string | null | undefined): string {
  if (!input) return "MCQ";
  const upper = input.toUpperCase().trim();
  const supported = ["MCQ", "SATA", "ORDERED", "HOTSPOT", "FILL_IN_BLANK"];
  if (supported.includes(upper)) return upper;
  if (upper === "MULTIPLE_CHOICE" || upper === "MULTIPLE-CHOICE") return "MCQ";
  if (upper === "SELECT_ALL" || upper === "SELECT-ALL") return "SATA";
  return "MCQ";
}

export function normalizeDifficulty(input: any): number {
  if (typeof input === "number") return Math.max(1, Math.min(5, Math.round(input)));
  if (typeof input === "string") {
    const lower = input.toLowerCase();
    if (lower === "easy") return 2;
    if (lower === "moderate" || lower === "medium") return 3;
    if (lower === "hard" || lower === "difficult") return 4;
    if (lower === "very_challenging" || lower === "expert") return 5;
    const parsed = parseInt(lower);
    if (!isNaN(parsed)) return Math.max(1, Math.min(5, parsed));
  }
  return 3;
}

let cachedTopics: string[] | null = null;
let topicsCachedAt = 0;

export async function getExistingTopics(): Promise<string[]> {
  if (cachedTopics && Date.now() - topicsCachedAt < 300000) return cachedTopics;
  try {
    const res = await pool.query(
      `SELECT DISTINCT topic FROM exam_questions WHERE topic IS NOT NULL AND career_type = 'nursing' ORDER BY topic`
    );
    cachedTopics = res.rows.map((r: any) => r.topic);
    topicsCachedAt = Date.now();
    return cachedTopics;
  } catch {
    return [];
  }
}

export async function normalizeTopic(input: string | null | undefined): Promise<string | null> {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const existingTopics = await getExistingTopics();

  const exactMatch = existingTopics.find(t => t.toLowerCase() === trimmed.toLowerCase());
  if (exactMatch) return exactMatch;

  const partialMatch = existingTopics.find(
    t => t.toLowerCase().includes(trimmed.toLowerCase()) || trimmed.toLowerCase().includes(t.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  return trimmed;
}

export { CANONICAL_BODY_SYSTEMS, CANONICAL_TIERS };
