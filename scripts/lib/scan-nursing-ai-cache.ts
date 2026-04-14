/**
 * Shared classification for nursing-first Replit ai_cache → MCQ vs flashcard vs quarantine.
 * Reuses monolith helpers under /scripts/replit-import (repo root = parent of nursenest-core).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildNursingParseContext,
  iterateAiCacheOutputItems,
  itemLooksLikeNursingMcq,
  normalizeAiCacheOutputJson,
  parseAiCacheNursingExamItem,
} from "../../../scripts/replit-import/nursing-ai-cache-extract";
import type { MappedExamQuestion } from "../../../scripts/replit-import/field-maps/exam-question-from-legacy";
import {
  enrichNursingExamItemMetadata,
  loadManualMappingCached,
  type EnrichmentAudit,
} from "../../../scripts/replit-import/nursing-exam-metadata-enrich";
import { loadReviewedOverridesCached } from "../../../scripts/replit-import/nursing-review-metadata";

export type ScanKind =
  | "mcq_nursing"
  | "flashcard_nursing"
  | "quarantine"
  | "skipped_allied"
  | "skipped_non_nursing_career";

export type ScanRecord =
  | {
      kind: "mcq_nursing";
      rowIndex: number;
      outputItemIndex: number;
      cacheKey: string | null;
      sourceFileName: string;
      value: MappedExamQuestion;
      enrichment?: EnrichmentAudit;
    }
  | {
      kind: "flashcard_nursing";
      rowIndex: number;
      outputItemIndex: number;
      cacheKey: string | null;
      sourceFileName: string;
      front: string;
      back: string;
      topicTag: string | null;
      merged: Record<string, unknown>;
      audit: EnrichmentAudit;
    }
  | {
      kind: "quarantine";
      rowIndex: number;
      outputItemIndex: number;
      cacheKey: string | null;
      sourceFileName: string;
      reason: string;
      mapErrors?: string[];
      enrichment?: EnrichmentAudit;
      sample?: Record<string, unknown>;
    }
  | {
      kind: "skipped_allied" | "skipped_non_nursing_career";
      rowIndex: number;
      outputItemIndex: number;
      cacheKey: string | null;
      sourceFileName: string;
      detail: string;
    };

function isFlashcardShape(item: Record<string, unknown>): boolean {
  const front = item.front;
  const back = item.back;
  return typeof front === "string" && typeof back === "string" && front.length > 2 && back.length > 2;
}

function tierExamAllied(item: Record<string, unknown>): boolean {
  const t = typeof item.tier === "string" ? item.tier.trim().toLowerCase() : "";
  const e = typeof item.exam === "string" ? item.exam.trim().toLowerCase() : "";
  const c = typeof item.careerType === "string" ? item.careerType.trim().toLowerCase() : "";
  if (c === "allied") return true;
  if (t === "allied") return true;
  if (e.includes("allied") || e.includes("paramedic") || e.includes("mlt") || e.includes("imaging")) return true;
  return false;
}

function isNursingMcq(m: MappedExamQuestion): boolean {
  const c = (m.careerType ?? "nursing").trim().toLowerCase();
  if (c === "allied") return false;
  const t = m.tier.trim().toLowerCase();
  if (t === "allied") return false;
  return true;
}

/**
 * Resolve monorepo root (NurseNest-4): nursenest-core/scripts/lib → ../../../..
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function resolveMonorepoRoot(): string {
  return path.resolve(__dirname, "..", "..", "..");
}

export function scanNursingFromRows(
  rows: Record<string, unknown>[],
  opts: {
    repoRoot: string;
    exportDirAbs: string;
    sourceFileName: string;
  },
): ScanRecord[] {
  const out: ScanRecord[] = [];
  const manual = loadManualMappingCached(opts.repoRoot);
  const reviewed = loadReviewedOverridesCached(opts.repoRoot);

  let rowIndex = -1;
  for (const row of rows) {
    rowIndex += 1;
    const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
    if (oj === null || oj === undefined) continue;

    let outputItemIndex = -1;
    for (const item of iterateAiCacheOutputItems(oj)) {
      outputItemIndex += 1;
      const rec = item as Record<string, unknown>;
      const ctx = buildNursingParseContext(row, {
        exportDirAbs: opts.exportDirAbs,
        sourceFileName: opts.sourceFileName,
        rowIndex,
        outputItemIndex,
        repoRoot: opts.repoRoot,
      });
      const cacheKey = ctx.cacheKey;

      if (!itemLooksLikeNursingMcq(rec) && isFlashcardShape(rec)) {
        const { merged, audit } = enrichNursingExamItemMetadata(rec, ctx, manual, reviewed);
        if (tierExamAllied(merged)) {
          out.push({
            kind: "skipped_allied",
            rowIndex,
            outputItemIndex,
            cacheKey,
            sourceFileName: opts.sourceFileName,
            detail: "flashcard_allied_signal",
          });
          continue;
        }
        if (!audit.importable) {
          out.push({
            kind: "quarantine",
            rowIndex,
            outputItemIndex,
            cacheKey,
            sourceFileName: opts.sourceFileName,
            reason: "flashcard_missing_tier_exam",
            enrichment: audit,
            sample: { front: rec.front, back: (rec.back as string).slice(0, 120) },
          });
          continue;
        }
        const front = rec.front as string;
        const back = rec.back as string;
        const topicTag =
          typeof rec.topicTag === "string"
            ? rec.topicTag.trim()
            : typeof merged.topicTag === "string"
              ? (merged.topicTag as string).trim()
              : null;
        out.push({
          kind: "flashcard_nursing",
          rowIndex,
          outputItemIndex,
          cacheKey,
          sourceFileName: opts.sourceFileName,
          front,
          back,
          topicTag,
          merged,
          audit,
        });
        continue;
      }

      const parsed = parseAiCacheNursingExamItem(rec, ctx);
      if (parsed.kind === "flashcard") {
        continue;
      }
      if (parsed.kind === "inconclusive") {
        if (parsed.enrichment?.ambiguous) {
          out.push({
            kind: "quarantine",
            rowIndex,
            outputItemIndex,
            cacheKey,
            sourceFileName: opts.sourceFileName,
            reason: "mcq_inconclusive",
            mapErrors: parsed.mapErrors,
            enrichment: parsed.enrichment,
            sample: { keys: Object.keys(rec) },
          });
        } else {
          out.push({
            kind: "quarantine",
            rowIndex,
            outputItemIndex,
            cacheKey,
            sourceFileName: opts.sourceFileName,
            reason: "mcq_map_failed",
            mapErrors: parsed.mapErrors,
            enrichment: parsed.enrichment,
          });
        }
        continue;
      }

      const v = parsed.value;
      if (!isNursingMcq(v)) {
        out.push({
          kind: "skipped_non_nursing_career",
          rowIndex,
          outputItemIndex,
          cacheKey,
          sourceFileName: opts.sourceFileName,
          detail: `careerType=${v.careerType} tier=${v.tier}`,
        });
        continue;
      }
      if (tierExamAllied(v as unknown as Record<string, unknown>)) {
        out.push({
          kind: "skipped_allied",
          rowIndex,
          outputItemIndex,
          cacheKey,
          sourceFileName: opts.sourceFileName,
          detail: "mcq_allied_signal",
        });
        continue;
      }

      out.push({
        kind: "mcq_nursing",
        rowIndex,
        outputItemIndex,
        cacheKey,
        sourceFileName: opts.sourceFileName,
        value: v,
        enrichment: parsed.enrichment,
      });
    }
  }

  return out;
}
