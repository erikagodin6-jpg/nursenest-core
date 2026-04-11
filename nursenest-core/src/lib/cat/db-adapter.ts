/**
 * DB Adapter — maps ExamQuestion Prisma rows to CatQuestion
 *
 * All inference logic is delegated to `cat-inference-maps.ts`.
 * This file owns only the DB-to-domain type conversion, the Prisma
 * select shape, and the explicit-tag override precedence rules.
 *
 * Inference priority (highest → lowest):
 *  1. Explicit tag in `tags[]` (e.g. "L1", "L2", "L3", "high-risk")
 *  2. Bloom's cognitiveLevel / nclexClientNeedsCategory / topic
 *  3. question_format keywords
 *  4. Stem keywords (light inference, last resort)
 *  5. Numeric difficulty fallback
 *  6. Hardcoded safe defaults
 */

import type { CatQuestion, CognitiveLayer } from "./types";
import {
  canonicalSystemTag,
  canonicalTopicSlug,
  clampDifficulty,
  cognitiveLayerFromFormat,
  cognitiveLayerFromLevel,
  cognitiveLayerFromStem,
  COGNITIVE_LAYER_DEFAULT,
  inferDispositionTagFromText,
  inferPopulationTagsFromText,
  inferRiskLevelFromSignals,
} from "./cat-inference-maps";

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
  /** Stem text — used only for keyword inference; not stored in CatQuestion. */
  stem: string;
}

// ─── Cognitive Layer ──────────────────────────────────────────────────────────

/**
 * Infer CognitiveLayer for a question row.
 * Explicit "L1"/"L2"/"L3" tags override all inference.
 */
export function inferCognitiveLayer(
  row: Pick<DbQuestionRow, "cognitiveLevel" | "tags" | "questionFormat" | "stem">,
): CognitiveLayer {
  // Explicit tag takes absolute priority
  for (const tag of row.tags) {
    const t = tag.trim().toUpperCase();
    if (t === "L1") return "L1";
    if (t === "L2") return "L2";
    if (t === "L3") return "L3";
  }

  return (
    cognitiveLayerFromLevel(row.cognitiveLevel) ??
    cognitiveLayerFromFormat(row.questionFormat) ??
    cognitiveLayerFromStem(row.stem) ??
    COGNITIVE_LAYER_DEFAULT
  );
}

// ─── Risk Level ───────────────────────────────────────────────────────────────

/**
 * Infer RiskLevel for a question row using canonical signal maps.
 */
export function inferRiskLevel(
  row: Pick<DbQuestionRow, "tags" | "topic" | "nclexClientNeedsCategory" | "difficulty" | "stem">,
) {
  return inferRiskLevelFromSignals({
    tagStr: row.tags.join(" ").toLowerCase(),
    category: (row.nclexClientNeedsCategory ?? "").toLowerCase(),
    topic: (row.topic ?? "").toLowerCase(),
    stem: row.stem.toLowerCase(),
    difficulty: row.difficulty ?? 3,
  });
}

// ─── System Tag ───────────────────────────────────────────────────────────────

/** Normalise bodySystem to a canonical system tag (delegates to canonical map). */
export function normaliseSystemTag(bodySystem: string | null | undefined): string {
  return canonicalSystemTag(bodySystem);
}

// ─── Disposition / Population ─────────────────────────────────────────────────

export function inferDispositionTag(tags: string[], stem: string) {
  return inferDispositionTagFromText(tags.join(" ") + " " + stem);
}

export function inferPopulationTags(tags: string[], stem: string, topic: string | null): string[] {
  return inferPopulationTagsFromText(tags.join(" ") + " " + stem + " " + (topic ?? ""));
}

// ─── Main adapter ─────────────────────────────────────────────────────────────

/**
 * Convert a single DB ExamQuestion row to a CatQuestion.
 *
 * @param row       - ExamQuestion row from Prisma (use CAT_QUESTION_SELECT).
 * @param overrides - Optional axis overrides for manually tagged questions.
 */
export function dbRowToCatQuestion(
  row: DbQuestionRow,
  overrides?: Partial<Pick<CatQuestion, "cognitiveLayer" | "riskLevel" | "systemTag" | "difficulty">>,
): CatQuestion {
  const systemTag   = overrides?.systemTag    ?? normaliseSystemTag(row.bodySystem);
  const cognitiveLayer = overrides?.cognitiveLayer ?? inferCognitiveLayer(row);
  const riskLevel   = overrides?.riskLevel    ?? inferRiskLevel(row);
  const difficulty  = overrides?.difficulty   ?? clampDifficulty(row.difficulty);

  const dispositionTag = inferDispositionTag(row.tags, row.stem);
  const populationTags = inferPopulationTags(row.tags, row.stem, row.topic);

  return {
    id: row.id,
    topicSlug: canonicalTopicSlug(row.topic, row.subtopic),
    systemTag,
    cognitiveLayer,
    riskLevel,
    difficulty,
    ...(populationTags.length > 0 && { populationTags }),
    ...(dispositionTag !== undefined && { dispositionTag }),
  };
}

/** Convert multiple rows in bulk. Preserves order. */
export function dbRowsToCatQuestions(
  rows: DbQuestionRow[],
  overridesFn?: (row: DbQuestionRow) => Partial<Pick<CatQuestion, "cognitiveLayer" | "riskLevel" | "systemTag" | "difficulty">> | undefined,
): CatQuestion[] {
  return rows.map((row) => dbRowToCatQuestion(row, overridesFn?.(row)));
}

// ─── Prisma query helpers ─────────────────────────────────────────────────────

/**
 * Minimal Prisma select clause for CAT pool loading.
 * Do not add columns without measuring payload impact — the pool may be 200+ rows.
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

export type CatQuestionSelectResult = {
  [K in keyof typeof CAT_QUESTION_SELECT]: K extends "tags" ? string[] : string | null;
} & { id: string; difficulty: number | null };
