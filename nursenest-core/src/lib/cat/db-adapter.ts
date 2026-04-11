/**
 * DB Adapter — maps ExamQuestion Prisma rows to CatQuestion
 *
 * The DB schema stores questions with:
 *  - `cognitiveLevel`  → Bloom's string ("remember", "understand", "apply", "analyze", "evaluation")
 *  - `difficulty`      → 1–5 integer
 *  - `bodySystem`      → system tag (nullable)
 *  - `topic`           → NP topic string (nullable)
 *  - `tags`            → string array (may include "high-risk", "L2", population tags, etc.)
 *  - `nclexClientNeedsCategory` → AANP/NCLEX blueprint category (nullable)
 *
 * This module infers the three CAT axes (cognitiveLayer, riskLevel, systemTag)
 * from those fields using heuristics that cover NP question patterns.
 * Where inference is ambiguous it falls back to safe defaults.
 *
 * Inference is deterministic — same input always produces the same CatQuestion.
 * No DB writes; pure transformation.
 */

import type {
  CatQuestion,
  CognitiveLayer,
  DispositionTag,
  RiskLevel,
} from "./types";

// ─── Input shape (subset of Prisma ExamQuestion) ──────────────────────────────

export interface DbQuestionRow {
  id: string;
  topic: string | null;
  subtopic: string | null;
  bodySystem: string | null;
  difficulty: number | null;
  cognitiveLevel: string | null;
  questionFormat: string | null;
  tags: string[];
  nclexClientNeedsCategory: string | null;
  /** Stem text — used only for keyword inference; never stored in CatQuestion. */
  stem: string;
}

// ─── Cognitive Layer inference ────────────────────────────────────────────────

/**
 * Infer CognitiveLayer (L1/L2/L3) from Bloom's level and question-format keywords.
 *
 * Mapping rationale:
 *  remember / knowledge              → L1 (recognition)
 *  understand / comprehension        → L1 (still recognition-level for NP)
 *  apply / application               → L2 (interpretation, clinical reasoning)
 *  analyze / analysis / evaluation   → L3 (action, prioritization, decision)
 *  synthesis / create                → L3
 *
 * Tags may also explicitly declare "L1", "L2", or "L3".
 */
export function inferCognitiveLayer(row: Pick<DbQuestionRow, "cognitiveLevel" | "tags" | "questionFormat" | "stem">): CognitiveLayer {
  // Explicit tag takes priority
  for (const tag of row.tags) {
    const t = tag.toUpperCase().trim();
    if (t === "L1") return "L1";
    if (t === "L2") return "L2";
    if (t === "L3") return "L3";
  }

  const level = (row.cognitiveLevel ?? "").toLowerCase();
  const format = (row.questionFormat ?? "").toLowerCase();

  // Bloom's → L3 (action/decision)
  if (/eval|analys|synthesis|create|priorit|judgment|creat/.test(level)) return "L3";
  // Bloom's → L2 (interpretation)
  if (/appl|application/.test(level)) return "L2";
  // Bloom's → L1 (recognition)
  if (/remember|knowledge|recall|comprehend|understand/.test(level)) return "L1";

  // Format-based inference
  if (/priorit|triage|next step|initial action|escalat|emergenc|refer|discharge/.test(format)) return "L3";
  if (/interpret|compare|select|choose|distinguish|differentiat/.test(format)) return "L2";

  // Stem keyword light inference (last resort)
  const stem = row.stem.toLowerCase();
  if (/next (best )?step|most appropriate|which action|refer (to|the)|immediate/.test(stem)) return "L3";
  if (/most consistent with|most likely|which finding|interpret|compare/.test(stem)) return "L2";

  // Default: difficulty-based fallback
  return "L2"; // safe middle ground
}

// ─── Risk Level inference ─────────────────────────────────────────────────────

/**
 * Infer RiskLevel (low / moderate / high) from tags, topic, and AANP category.
 *
 * "high" signals: explicit tag, red-flag topics, emergent conditions, L3 + difficulty ≥ 4.
 * "low" signals: preventive care, wellness, foundational topics, difficulty ≤ 2.
 * "moderate" is the default.
 */
export function inferRiskLevel(
  row: Pick<DbQuestionRow, "tags" | "topic" | "nclexClientNeedsCategory" | "difficulty" | "stem">,
): RiskLevel {
  // Explicit tags
  const tagStr = row.tags.join(" ").toLowerCase();
  if (/\bhigh.?risk\b|\bsepsis\b|\bstroke\b|\bmi\b|\bpe\b|\bemergenc\b|\bescalat\b|\bred.flag\b|\bimmediately?\b/.test(tagStr)) return "high";
  if (/\blow.?risk\b|\bpreventive\b|\bscreening\b|\bwellness\b/.test(tagStr)) return "low";

  // AANP/NCLEX category
  const category = (row.nclexClientNeedsCategory ?? "").toLowerCase();
  if (/safety|emergenc|pharmacol|risk|critical/.test(category)) return "high";
  if (/health promot|prevention|education/.test(category)) return "low";

  // Topic-based signal
  const topic = (row.topic ?? "").toLowerCase();
  const highRiskTopics = /sepsis|aortic|dissect|stroke|syncope|hypertensive.emerg|eclampsia|anaphylax|pulmonary.embolism|acute.coronary|meningitis|headache|chest.pain|overdose|seizure|dka|siadh|adrenal/;
  const lowRiskTopics = /preventive|wellness|vaccine|immunization|screening|nutrition|exercise|counseling|education|follow.up/;

  if (highRiskTopics.test(topic)) return "high";
  if (lowRiskTopics.test(topic)) return "low";

  // Stem signal
  const stem = row.stem.toLowerCase();
  if (/immediately|emergency|urgent|call 911|activate|rapid response|life.threatening/.test(stem)) return "high";

  // Difficulty-based fallback
  const d = row.difficulty ?? 3;
  if (d >= 4) return "high";
  if (d <= 2) return "low";
  return "moderate";
}

// ─── System Tag normalisation ─────────────────────────────────────────────────

const BODY_SYSTEM_MAP: Record<string, string> = {
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
};

/**
 * Normalise `bodySystem` to a canonical system tag.
 * Falls back to the raw value (lowercased, hyphenated) if not found in map.
 */
export function normaliseSystemTag(bodySystem: string | null | undefined): string {
  if (!bodySystem) return "general";
  const key = bodySystem.toLowerCase().trim().replace(/\s+/g, "-");
  return BODY_SYSTEM_MAP[key] ?? key;
}

// ─── Disposition tag inference ────────────────────────────────────────────────

const DISPOSITION_PATTERNS: Array<[RegExp, DispositionTag]> = [
  [/immediate.escalation|call 911|activate code|rapid response|emergent transfer/, "immediate-escalation"],
  [/ed.referral|emergency department|send to ed|refer to ed/, "ED-referral"],
  [/urgent.same.day|same.day eval|urgent follow.up|today's appointment/, "urgent-same-day"],
  [/safe.outpatient|routine follow.up|schedule follow|primary care follow/, "outpatient"],
];

export function inferDispositionTag(tags: string[], stem: string): DispositionTag | undefined {
  const combined = (tags.join(" ") + " " + stem).toLowerCase();
  for (const [pattern, tag] of DISPOSITION_PATTERNS) {
    if (pattern.test(combined)) return tag;
  }
  return undefined;
}

// ─── Population tags ──────────────────────────────────────────────────────────

const POPULATION_SIGNALS: Array<[RegExp, string]> = [
  [/\bolder.?adult\b|\belderly\b|\bgeriatric\b|\bfrail\b/, "older-adult"],
  [/\bpediatric\b|\bchild\b|\binfant\b|\bneonatal\b|\badolescent\b/, "pediatric"],
  [/\bpregnant\b|\bpregnancy\b|\bgestational\b|\bpostpartum\b|\bmaternity\b/, "reproductive-health"],
  [/\blgbtq\b|\btransgender\b|\bgay\b|\blesbian\b|\bbisexual\b/, "LGBTQ+"],
  [/\bsubstance.use\b|\baddiction\b|\bopioid\b|\balcohol.use\b/, "behavioral-health"],
  [/\bchronic.disease\b|\bchronic.condition\b|\bcomorbid/, "chronic-disease"],
  [/\burgent.care\b|\bemergency.room\b|\bed.setting\b/, "urgent-care"],
];

export function inferPopulationTags(tags: string[], stem: string, topic: string | null): string[] {
  const combined = (tags.join(" ") + " " + stem + " " + (topic ?? "")).toLowerCase();
  const result: string[] = [];
  for (const [pattern, popTag] of POPULATION_SIGNALS) {
    if (pattern.test(combined)) result.push(popTag);
  }
  return result;
}

// ─── Difficulty normalisation ─────────────────────────────────────────────────

function normaliseDifficulty(raw: number | null | undefined): 1 | 2 | 3 | 4 | 5 {
  const d = typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : 3;
  return Math.min(5, Math.max(1, d)) as 1 | 2 | 3 | 4 | 5;
}

// ─── Main adapter ─────────────────────────────────────────────────────────────

/**
 * Convert a DB ExamQuestion row to a CatQuestion for use with the CAT engine.
 *
 * All inference is deterministic and non-destructive.
 * The original DB row is not mutated.
 *
 * @param row       - ExamQuestion row from Prisma.
 * @param overrides - Optional field overrides (e.g., for manually tagged questions).
 */
export function dbRowToCatQuestion(
  row: DbQuestionRow,
  overrides?: Partial<Pick<CatQuestion, "cognitiveLayer" | "riskLevel" | "systemTag" | "difficulty">>,
): CatQuestion {
  const systemTag = overrides?.systemTag ?? normaliseSystemTag(row.bodySystem);
  const cognitiveLayer = overrides?.cognitiveLayer ?? inferCognitiveLayer(row);
  const riskLevel = overrides?.riskLevel ?? inferRiskLevel(row);
  const difficulty = overrides?.difficulty ?? normaliseDifficulty(row.difficulty);

  const dispositionTag = inferDispositionTag(row.tags, row.stem);
  const populationTags = inferPopulationTags(row.tags, row.stem, row.topic);

  return {
    id: row.id,
    topicSlug: normaliseTopicSlug(row.topic, row.subtopic),
    systemTag,
    cognitiveLayer,
    riskLevel,
    difficulty,
    ...(populationTags.length > 0 && { populationTags }),
    ...(dispositionTag && { dispositionTag }),
  };
}

/**
 * Convert multiple rows in bulk. Preserves order.
 */
export function dbRowsToCatQuestions(
  rows: DbQuestionRow[],
  overridesFn?: (row: DbQuestionRow) => Partial<Pick<CatQuestion, "cognitiveLayer" | "riskLevel" | "systemTag" | "difficulty">> | undefined,
): CatQuestion[] {
  return rows.map((row) => dbRowToCatQuestion(row, overridesFn?.(row)));
}

// ─── Topic slug normalisation ─────────────────────────────────────────────────

/**
 * Derive a stable topic slug from DB `topic` and `subtopic` fields.
 * Slug format: `{topic-kebab}` or `{topic-kebab}--{subtopic-kebab}`.
 */
function normaliseTopicSlug(topic: string | null, subtopic: string | null): string {
  const base = topic
    ? topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "uncategorized";
  if (!subtopic) return base;
  const sub = subtopic.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base}--${sub}`;
}

// ─── Prisma query helper ──────────────────────────────────────────────────────

/**
 * Minimal Prisma select clause for loading question rows needed by the adapter.
 * Use this as `select` in any `prisma.examQuestion.findMany` call that feeds the CAT engine.
 *
 * @example
 * const rows = await prisma.examQuestion.findMany({
 *   where: { exam: "np-aanp", status: "published", isAdaptiveEligible: true },
 *   select: CAT_QUESTION_SELECT,
 *   take: 200,
 * });
 * const pool = dbRowsToCatQuestions(rows);
 */
export const CAT_QUESTION_SELECT = {
  id: true,
  topic: true,
  subtopic: true,
  bodySystem: true,
  difficulty: true,
  cognitiveLevel: true,
  questionFormat: true,
  tags: true,
  nclexClientNeedsCategory: true,
  stem: true,
} as const;

/**
 * Type inferred from `CAT_QUESTION_SELECT` — matches what Prisma returns.
 * Cast the Prisma result to this type before passing to `dbRowsToCatQuestions`.
 */
export type CatQuestionSelectResult = {
  [K in keyof typeof CAT_QUESTION_SELECT]: K extends "tags" ? string[] : string | null;
} & { id: string; difficulty: number | null };
