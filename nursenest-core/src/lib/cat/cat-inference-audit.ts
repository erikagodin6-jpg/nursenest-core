/**
 * CAT Inference Audit Utility
 *
 * Dev/ops tool for inspecting how the adapter infers CAT axes for real DB questions.
 * Never loads the full question bank — bounded by AUDIT_MAX_SAMPLE (hard cap 200).
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 * Script usage (tsx):
 *   tsx -e "
 *     import { runCatInferenceAudit } from './src/lib/cat/cat-inference-audit';
 *     import { prisma } from './src/lib/db';
 *     runCatInferenceAudit(prisma, { exam: 'np-aanp', sample: 50 }).then(r =>
 *       console.log(JSON.stringify(r, null, 2))
 *     );
 *   "
 *
 * Protected internal route: /api/cat/np/audit (disabled in production unless
 * NP_CAT_AUDIT_ENABLED=true is set explicitly).
 *
 * ─── Load safety ─────────────────────────────────────────────────────────────
 * - `take` is always capped at AUDIT_MAX_SAMPLE.
 * - Only CAT_QUESTION_SELECT columns are fetched (no large JSON fields).
 * - No joins; no sub-queries; no COUNT on the full table.
 * - Returns a compact report — not the raw rows.
 */

import type { PrismaClient } from "@prisma/client";
import { CAT_QUESTION_SELECT, dbRowToCatQuestion, type DbQuestionRow } from "./db-adapter";
import {
  cognitiveLayerFromFormat,
  cognitiveLayerFromLevel,
  cognitiveLayerFromStem,
  COGNITIVE_LAYER_DEFAULT,
  inferDispositionTagFromText,
  inferPopulationTagsFromText,
  inferRiskLevelFromSignals,
  canonicalSystemTag,
} from "./cat-inference-maps";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIT_DEFAULT_SAMPLE = 50;
const AUDIT_MAX_SAMPLE = 200;
const STEM_PREVIEW_LENGTH = 80;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatAuditFilter {
  /** Exam key (e.g. "np-aanp"). Defaults to all NP exams. */
  exam?: string;
  /** Filter to questions with this topic substring. */
  topic?: string;
  /** Filter to questions that have this tag. */
  tag?: string;
  /**
   * Number of questions to sample. Capped at AUDIT_MAX_SAMPLE.
   * @default 50
   */
  sample?: number;
}

export interface CatAuditRow {
  id: string;
  stemPreview: string;
  inferred: {
    cognitiveLayer: string;
    riskLevel: string;
    systemTag: string;
    dispositionTag: string | null;
    populationTags: string[];
  };
  /** Signals that drove each inference decision. */
  signals: {
    cognitiveLayer: string;
    riskLevel: string;
    systemTag: string;
  };
}

export interface CatAuditReport {
  generatedAt: string;
  filter: CatAuditFilter;
  sampleSize: number;
  rows: CatAuditRow[];
  summary: {
    cognitiveLayerCounts: Record<string, number>;
    riskLevelCounts: Record<string, number>;
    systemTagCounts: Record<string, number>;
    dispositionTagCount: number;
    questionsWithPopulationTags: number;
    inferenceSourceBreakdown: {
      cognitiveLayer: Record<string, number>;
      riskLevel: Record<string, number>;
    };
  };
}

// ─── Inference signal explanations ───────────────────────────────────────────

function cognitiveLayerSignal(row: DbQuestionRow): string {
  for (const tag of row.tags) {
    const t = tag.trim().toUpperCase();
    if (t === "L1" || t === "L2" || t === "L3") return `explicit-tag:${t}`;
  }
  if (cognitiveLayerFromLevel(row.cognitiveLevel)) return `bloom-level:${row.cognitiveLevel}`;
  if (cognitiveLayerFromFormat(row.questionFormat)) return `question-format:${row.questionFormat}`;
  if (cognitiveLayerFromStem(row.stem)) return "stem-keyword";
  return `default:${COGNITIVE_LAYER_DEFAULT}`;
}

function riskLevelSignal(row: DbQuestionRow): string {
  const tagStr = row.tags.join(" ").toLowerCase();
  const category = (row.nclexClientNeedsCategory ?? "").toLowerCase();
  const topic = (row.topic ?? "").toLowerCase();
  const stem = row.stem.toLowerCase();
  const d = row.difficulty ?? 3;

  if (/\bhigh[- ]?risk\b|\bsepsis\b|\bstroke\b/.test(tagStr)) return "high-risk-tag";
  if (/\blow[- ]?risk\b|\bpreventive\b|\bscreening\b|\bwellness\b/.test(tagStr)) return "low-risk-tag";
  if (/safety|emergenc|pharmacol|risk|critical/.test(category)) return `category:${row.nclexClientNeedsCategory}`;
  if (/health[\s-]promot|prevention|education/.test(category)) return `category:${row.nclexClientNeedsCategory}`;
  if (/sepsis|stroke|aortic|eclampsia|dka|seizure/.test(topic)) return `high-risk-topic:${row.topic}`;
  if (/preventive|wellness|vaccine/.test(topic)) return `low-risk-topic:${row.topic}`;
  if (/immediately|emergency|call 911/.test(stem)) return "high-risk-stem";
  if (d >= 4) return `difficulty:${d}>=4→high`;
  if (d <= 2) return `difficulty:${d}<=2→low`;
  return "default:moderate";
}

function systemTagSignal(row: DbQuestionRow): string {
  if (!row.bodySystem) return "no-bodySystem→general";
  const canonical = canonicalSystemTag(row.bodySystem);
  return canonical !== row.bodySystem.toLowerCase().trim().replace(/\s+/g, "-")
    ? `alias:${row.bodySystem}→${canonical}`
    : `raw:${row.bodySystem}`;
}

// ─── Main audit function ──────────────────────────────────────────────────────

/**
 * Run a bounded inference audit on a sample of NP exam questions.
 *
 * @param prisma  - Prisma client instance.
 * @param filter  - Optional filter and sample size.
 */
export async function runCatInferenceAudit(
  prisma: PrismaClient,
  filter: CatAuditFilter = {},
): Promise<CatAuditReport> {
  const sample = Math.min(filter.sample ?? AUDIT_DEFAULT_SAMPLE, AUDIT_MAX_SAMPLE);

  const NP_EXAM_KEYS = ["np-aanp", "np-aanpcnp", "np-canp", "np-fnp", "np-agpcnp", "np-pmhnp"];

  // Build bounded where clause — no full-table scans
  const where: Parameters<typeof prisma.examQuestion.findMany>[0]["where"] = {
    exam: filter.exam ? filter.exam : { in: NP_EXAM_KEYS },
    status: "published",
    ...(filter.topic ? { topic: { contains: filter.topic, mode: "insensitive" } } : {}),
    ...(filter.tag ? { tags: { has: filter.tag } } : {}),
  };

  const rows = await prisma.examQuestion.findMany({
    where,
    select: CAT_QUESTION_SELECT,
    take: sample,
    orderBy: { updatedAt: "desc" },
  });

  const typedRows = rows as unknown as DbQuestionRow[];

  // ── Build audit rows ────────────────────────────────────────────────────────

  const auditRows: CatAuditRow[] = typedRows.map((row) => {
    const q = dbRowToCatQuestion(row);
    const combinedText = row.tags.join(" ") + " " + row.stem + " " + (row.topic ?? "");
    return {
      id: row.id,
      stemPreview: row.stem.slice(0, STEM_PREVIEW_LENGTH).replace(/\s+/g, " "),
      inferred: {
        cognitiveLayer: q.cognitiveLayer,
        riskLevel: q.riskLevel,
        systemTag: q.systemTag,
        dispositionTag: inferDispositionTagFromText(combinedText) ?? null,
        populationTags: inferPopulationTagsFromText(combinedText),
      },
      signals: {
        cognitiveLayer: cognitiveLayerSignal(row),
        riskLevel: riskLevelSignal(row),
        systemTag: systemTagSignal(row),
      },
    };
  });

  // ── Aggregate summary ────────────────────────────────────────────────────────

  const cogLayerCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = {};
  const systemCounts: Record<string, number> = {};
  const cogSourceCounts: Record<string, number> = {};
  const riskSourceCounts: Record<string, number> = {};
  let dispositionCount = 0;
  let popTagCount = 0;

  for (const r of auditRows) {
    cogLayerCounts[r.inferred.cognitiveLayer] = (cogLayerCounts[r.inferred.cognitiveLayer] ?? 0) + 1;
    riskCounts[r.inferred.riskLevel] = (riskCounts[r.inferred.riskLevel] ?? 0) + 1;
    systemCounts[r.inferred.systemTag] = (systemCounts[r.inferred.systemTag] ?? 0) + 1;
    if (r.inferred.dispositionTag) dispositionCount++;
    if (r.inferred.populationTags.length > 0) popTagCount++;

    const cogSrc = r.signals.cognitiveLayer.split(":")[0] ?? "default";
    cogSourceCounts[cogSrc] = (cogSourceCounts[cogSrc] ?? 0) + 1;

    const riskSrc = r.signals.riskLevel.split(":")[0] ?? "default";
    riskSourceCounts[riskSrc] = (riskSourceCounts[riskSrc] ?? 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    filter: { ...filter, sample },
    sampleSize: auditRows.length,
    rows: auditRows,
    summary: {
      cognitiveLayerCounts: cogLayerCounts,
      riskLevelCounts: riskCounts,
      systemTagCounts: systemCounts,
      dispositionTagCount: dispositionCount,
      questionsWithPopulationTags: popTagCount,
      inferenceSourceBreakdown: {
        cognitiveLayer: cogSourceCounts,
        riskLevel: riskSourceCounts,
      },
    },
  };
}

/** Check if audit is allowed in the current environment. */
export function isCatAuditAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.NP_CAT_AUDIT_ENABLED === "true";
}
