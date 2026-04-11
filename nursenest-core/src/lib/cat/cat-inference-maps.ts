/**
 * CAT Inference Maps — canonical single source of truth
 *
 * All pattern matching and alias maps for CAT metadata inference live here.
 * No other file should duplicate these definitions.
 *
 * ─── Architecture note ────────────────────────────────────────────────────────
 * Where canonical rules live:
 *   - cognitiveLevel   → CognitiveLayer:  COGNITIVE_LEVEL_TO_LAYER, COGNITIVE_FORMAT_PATTERNS
 *   - bodySystem/topic → systemTag:       BODY_SYSTEM_ALIASES
 *   - risk level:                         RISK_HIGH_TAG_RE, RISK_LOW_TAG_RE, RISK_HIGH_TOPIC_RE, etc.
 *   - dispositionTag:                     DISPOSITION_PATTERNS
 *   - populationTags:                     POPULATION_SIGNALS
 *
 * All helpers are deterministic and side-effect free.
 * Unknown values fall back to safe defaults — none throw.
 *
 * db-adapter.ts imports from here exclusively; no duplicate logic allowed there.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { CognitiveLayer, DispositionTag, RiskLevel } from "./types";

// ─── Cognitive Layer ──────────────────────────────────────────────────────────

/**
 * Explicit Bloom's level string → CognitiveLayer.
 * Keys are lower-cased substrings; first match wins.
 */
export const COGNITIVE_LEVEL_TO_LAYER: Array<[string, CognitiveLayer]> = [
  // L3 — action / decision / evaluation
  ["eval",       "L3"],
  ["analys",     "L3"],
  ["synthesis",  "L3"],
  ["create",     "L3"],
  ["priorit",    "L3"],
  ["judgment",   "L3"],
  // L2 — interpretation / application
  ["appl",       "L2"],
  ["application","L2"],
  // L1 — recognition / recall
  ["remember",   "L1"],
  ["knowledge",  "L1"],
  ["recall",     "L1"],
  ["comprehend", "L1"],
  ["understand", "L1"],
];

/**
 * Question-format keyword → CognitiveLayer (lower-cased substring match).
 * Only consulted when no Bloom's level match is found.
 */
export const COGNITIVE_FORMAT_PATTERNS: Array<[RegExp, CognitiveLayer]> = [
  [/priorit|triage|next[\s-]step|initial[\s-]action|escalat|emergenc|refer|discharge/, "L3"],
  [/interpret|compare|select|choose|distinguish|differentiat/, "L2"],
];

/**
 * Stem keyword → CognitiveLayer (last resort, lower-cased).
 */
export const COGNITIVE_STEM_PATTERNS: Array<[RegExp, CognitiveLayer]> = [
  [/next (?:best )?step|most appropriate|which action|refer (?:to|the)|immediate/, "L3"],
  [/most consistent with|most likely|which finding|interpret|compare/, "L2"],
];

/** Default CognitiveLayer when nothing matches. */
export const COGNITIVE_LAYER_DEFAULT: CognitiveLayer = "L2";

// ─── Risk Level ───────────────────────────────────────────────────────────────

/** Tag string → high risk (applied to joined tag string, lower-cased). */
export const RISK_HIGH_TAG_RE = /\bhigh[- ]?risk\b|\bsepsis\b|\bstroke\b|\bmi\b|\bpe\b|\bemergenc\b|\bescalat\b|\bred[- ]?flag\b|\bimmediately?\b/;

/** Tag string → low risk. */
export const RISK_LOW_TAG_RE = /\blow[- ]?risk\b|\bpreventive\b|\bscreening\b|\bwellness\b/;

/** AANP/NCLEX blueprint category → high risk. */
export const RISK_HIGH_CATEGORY_RE = /safety|emergenc|pharmacol|risk|critical/;

/** AANP/NCLEX blueprint category → low risk. */
export const RISK_LOW_CATEGORY_RE = /health[\s-]promot|prevention|education/;

/** Topic string → high risk. */
export const RISK_HIGH_TOPIC_RE = /sepsis|aortic|dissect|stroke|syncope|hypertensive[\s-]emerg|eclampsia|anaphylax|pulmonary[\s-]embolism|acute[\s-]coronary|meningitis|headache|chest[\s-]pain|overdose|seizure|dka|siadh|adrenal/;

/** Topic string → low risk. */
export const RISK_LOW_TOPIC_RE = /preventive|wellness|vaccine|immunization|screening|nutrition|exercise|counseling|education|follow[- ]?up/;

/** Stem keywords → high risk (last resort). */
export const RISK_HIGH_STEM_RE = /immediately|emergency|urgent|call 911|activate|rapid[\s-]response|life[- ]threatening/;

/** Default when difficulty is the final signal. Thresholds: ≥4 → high, ≤2 → low. */
export const RISK_HIGH_DIFFICULTY_THRESHOLD = 4;
export const RISK_LOW_DIFFICULTY_THRESHOLD = 2;

/** Default RiskLevel when nothing matches. */
export const RISK_LEVEL_DEFAULT: RiskLevel = "moderate";

// ─── System Tag aliases ───────────────────────────────────────────────────────

/**
 * Alias → canonical systemTag.
 * Keys are lower-cased, space→hyphen normalised.
 * Canonical values are the final strings used in PerformanceProfile.bySystem.
 */
export const BODY_SYSTEM_ALIASES: Readonly<Record<string, string>> = {
  // Cardiovascular
  cardiovascular: "cardiovascular",
  cardiac: "cardiovascular",
  heart: "cardiovascular",
  "cardio-vascular": "cardiovascular",
  cardiology: "cardiovascular",
  // Respiratory
  respiratory: "respiratory",
  pulmonary: "respiratory",
  lungs: "respiratory",
  "pulm-resp": "respiratory",
  // Neurological
  neurological: "neurological",
  neuro: "neurological",
  neurology: "neurological",
  brain: "neurological",
  // Musculoskeletal
  musculoskeletal: "musculoskeletal",
  msk: "musculoskeletal",
  orthopedics: "musculoskeletal",
  ortho: "musculoskeletal",
  // Gastrointestinal
  gastrointestinal: "gastrointestinal",
  gi: "gastrointestinal",
  abdomen: "gastrointestinal",
  "gi-tract": "gastrointestinal",
  // Endocrine
  endocrine: "endocrine",
  metabolic: "endocrine",
  diabetes: "endocrine",
  thyroid: "endocrine",
  // Genitourinary
  genitourinary: "genitourinary",
  renal: "genitourinary",
  kidney: "genitourinary",
  urinary: "genitourinary",
  // Reproductive (distinct from genitourinary)
  "reproductive-health": "reproductive-health",
  reproductive: "reproductive-health",
  obstetric: "reproductive-health",
  gynecology: "reproductive-health",
  // Dermatology
  dermatology: "dermatology",
  skin: "dermatology",
  // Psychiatry / Behavioral
  psychiatric: "behavioral-health",
  psychiatry: "behavioral-health",
  "behavioral-health": "behavioral-health",
  "mental-health": "behavioral-health",
  behavioral: "behavioral-health",
  // Infectious Disease
  "infectious-disease": "infectious-disease",
  infectious: "infectious-disease",
  infection: "infectious-disease",
  // Hematology / Oncology
  hematology: "hematology-oncology",
  oncology: "hematology-oncology",
  "hematology-oncology": "hematology-oncology",
  // Pharmacology (cross-system)
  pharmacology: "pharmacology",
  pharmacotherapy: "pharmacology",
} as const;

/** Default systemTag when bodySystem is null or unrecognised. */
export const SYSTEM_TAG_DEFAULT = "general";

// ─── Disposition Tags ─────────────────────────────────────────────────────────

/**
 * Ordered pattern list: first match wins.
 * Applied to lower-cased concatenation of tags + stem.
 */
export const DISPOSITION_PATTERNS: ReadonlyArray<readonly [RegExp, DispositionTag]> = [
  [/immediate[\s-]?escalation|call 911|activate code|rapid[\s-]response|emergent[\s-]transfer/, "immediate-escalation"],
  [/ed[\s-]referral|emergency[\s-]department|send to ed|refer to ed/, "ED-referral"],
  [/urgent[\s-]same[\s-]day|same[\s-]day eval|urgent follow[\s-]?up|today's appointment/, "urgent-same-day"],
  [/safe[\s-]outpatient|routine follow[\s-]?up|schedule follow|primary[\s-]care follow/, "outpatient"],
] as const;

// ─── Population Tags ──────────────────────────────────────────────────────────

/**
 * Population signal patterns → population tag string.
 * All matches are collected (not first-wins); a question may carry multiple tags.
 * Applied to lower-cased concatenation of tags + stem + topic.
 */
export const POPULATION_SIGNALS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bolder[- ]?adult\b|\belderly\b|\bgeriatric\b|\bfrail\b/, "older-adult"],
  [/\bpediatric\b|\bchild\b|\binfant\b|\bneonatal\b|\badolescent\b/, "pediatric"],
  [/\bpregnant\b|\bpregnancy\b|\bgestational\b|\bpostpartum\b|\bmaternity\b/, "reproductive-health"],
  [/\blgbtq\b|\btransgender\b|\bgay\b|\blesbian\b|\bbisexual\b/, "LGBTQ+"],
  [/\bsubstance[- ]use\b|\baddiction\b|\bopioid\b|\balcohol[- ]use\b/, "behavioral-health"],
  [/\bchronic[- ]disease\b|\bchronic[- ]condition\b|\bcomorbid/, "chronic-disease"],
  [/\burgent[- ]care\b|\bemergency[- ]room\b|\bed[- ]setting\b/, "urgent-care"],
] as const;

// ─── Pure helper functions ────────────────────────────────────────────────────

/**
 * Map a Bloom's cognitive level string to a CognitiveLayer.
 * Safe: returns COGNITIVE_LAYER_DEFAULT for unknown or empty input.
 */
export function cognitiveLayerFromLevel(level: string | null | undefined): CognitiveLayer | null {
  if (!level) return null;
  const lower = level.toLowerCase();
  for (const [substr, layer] of COGNITIVE_LEVEL_TO_LAYER) {
    if (lower.includes(substr)) return layer;
  }
  return null;
}

/**
 * Match a question format string to a CognitiveLayer.
 * Returns null if no pattern matches.
 */
export function cognitiveLayerFromFormat(format: string | null | undefined): CognitiveLayer | null {
  if (!format) return null;
  const lower = format.toLowerCase();
  for (const [pattern, layer] of COGNITIVE_FORMAT_PATTERNS) {
    if (pattern.test(lower)) return layer;
  }
  return null;
}

/**
 * Match a stem excerpt to a CognitiveLayer.
 * Returns null if no pattern matches.
 */
export function cognitiveLayerFromStem(stem: string): CognitiveLayer | null {
  const lower = stem.toLowerCase();
  for (const [pattern, layer] of COGNITIVE_STEM_PATTERNS) {
    if (pattern.test(lower)) return layer;
  }
  return null;
}

/**
 * Normalise a bodySystem raw string to a canonical systemTag.
 * Unknown values pass through as lower-kebab-cased — never throws.
 */
export function canonicalSystemTag(raw: string | null | undefined): string {
  if (!raw) return SYSTEM_TAG_DEFAULT;
  const key = raw.toLowerCase().trim().replace(/\s+/g, "-");
  return BODY_SYSTEM_ALIASES[key] ?? key;
}

/**
 * Infer RiskLevel from a joined tag string, category, topic, stem, and difficulty.
 * All inputs are optional — returns RISK_LEVEL_DEFAULT when nothing matches.
 */
export function inferRiskLevelFromSignals(signals: {
  tagStr: string;
  category: string;
  topic: string;
  stem: string;
  difficulty: number;
}): RiskLevel {
  const { tagStr, category, topic, stem, difficulty } = signals;
  // Tags (highest priority)
  if (RISK_HIGH_TAG_RE.test(tagStr)) return "high";
  if (RISK_LOW_TAG_RE.test(tagStr)) return "low";
  // Blueprint category
  if (RISK_HIGH_CATEGORY_RE.test(category)) return "high";
  if (RISK_LOW_CATEGORY_RE.test(category)) return "low";
  // Topic
  if (RISK_HIGH_TOPIC_RE.test(topic)) return "high";
  if (RISK_LOW_TOPIC_RE.test(topic)) return "low";
  // Stem
  if (RISK_HIGH_STEM_RE.test(stem)) return "high";
  // Difficulty fallback
  if (difficulty >= RISK_HIGH_DIFFICULTY_THRESHOLD) return "high";
  if (difficulty <= RISK_LOW_DIFFICULTY_THRESHOLD) return "low";
  return RISK_LEVEL_DEFAULT;
}

/**
 * Infer DispositionTag from a combined tags+stem string (lower-cased).
 * Returns undefined when no pattern matches (most questions have no disposition tag).
 */
export function inferDispositionTagFromText(combined: string): DispositionTag | undefined {
  const lower = combined.toLowerCase();
  for (const [pattern, tag] of DISPOSITION_PATTERNS) {
    if (pattern.test(lower)) return tag;
  }
  return undefined;
}

/**
 * Infer all matching population tags from a combined tags+stem+topic string.
 * Returns an empty array when nothing matches.
 */
export function inferPopulationTagsFromText(combined: string): string[] {
  const lower = combined.toLowerCase();
  const result: string[] = [];
  for (const [pattern, popTag] of POPULATION_SIGNALS) {
    if (pattern.test(lower)) result.push(popTag);
  }
  return result;
}

/**
 * Clamp a raw difficulty integer to the 1–5 range.
 * Non-finite or null values fall back to 3.
 */
export function clampDifficulty(raw: number | null | undefined): 1 | 2 | 3 | 4 | 5 {
  const d = typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : 3;
  return Math.min(5, Math.max(1, d)) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Derive a stable topic slug from DB `topic` and optional `subtopic`.
 * Output format: `{topic-kebab}` or `{topic-kebab}--{subtopic-kebab}`.
 * Unknown / null input → "uncategorized".
 */
export function canonicalTopicSlug(topic: string | null | undefined, subtopic?: string | null): string {
  const base = topic
    ? topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "uncategorized";
  if (!subtopic) return base;
  const sub = subtopic.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return sub ? `${base}--${sub}` : base;
}
