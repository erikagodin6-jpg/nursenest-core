/**
 * Shared types and builders for nursing metadata review artifacts (generate + import queue).
 */
import { stemHashHex } from "./field-maps/exam-question-from-legacy";
import type { EnrichmentAudit, NursingEnrichmentContext } from "./nursing-exam-metadata-enrich";
import { computeHeuristicSuggestion, type HeuristicSuggestion } from "./nursing-review-metadata";

export type NursingUnresolvedReviewEntryV1 = {
  id: string;
  cache_key: string | null;
  source_file: string;
  row_index: number;
  output_item_index: number;
  stem_excerpt: string;
  stem_hash: string | null;
  explicit_tier: string | null;
  explicit_exam: string | null;
  parent_metadata_snapshot: Record<string, unknown>;
  filename_path_hints: string[];
  heuristic: HeuristicSuggestion;
  confidence: "low" | "medium" | "high";
  status: "needs_review";
  reviewed_tier: string;
  reviewed_exam: string;
  reasons: string[];
  enrichment: EnrichmentAudit | null;
  map_errors: string[];
};

function optStr(o: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function stemExcerpt(item: Record<string, unknown>): string {
  const s =
    typeof item.stem === "string"
      ? item.stem
      : typeof item.question === "string"
        ? item.question
        : "";
  const t = s.trim();
  if (t.length <= 400) return t;
  return `${t.slice(0, 400)}…`;
}

export function buildNursingUnresolvedReviewEntry(
  item: Record<string, unknown>,
  ctx: NursingEnrichmentContext,
  mapErrors: string[],
  enrichment: EnrichmentAudit | null,
  sourceFile: string,
): NursingUnresolvedReviewEntryV1 {
  const ex = stemExcerpt(item);
  let stemHash: string | null = null;
  try {
    if (ex) stemHash = stemHashHex(ex);
  } catch {
    stemHash = null;
  }

  const explicit_tier = optStr(item, "tier");
  const explicit_exam = optStr(item, "exam", "exam_type", "examType");

  const parent = ctx.parentRow;
  const parentSnap: Record<string, unknown> = {};
  for (const k of ["tier", "exam", "exam_type", "examType", "cache_key", "cacheKey"]) {
    if (parent[k] !== undefined) parentSnap[k] = parent[k] as unknown;
  }
  const metaRaw = parent.metadata ?? parent.extra ?? parent.job_metadata ?? parent.jobMetadata;
  if (metaRaw && typeof metaRaw === "object" && !Array.isArray(metaRaw)) {
    parentSnap.metadata = metaRaw as Record<string, unknown>;
  }

  const hints = [ctx.sourceFileName, pathBasenameHint(ctx.exportDirAbs)].filter(Boolean) as string[];
  const heuristic = computeHeuristicSuggestion(item, ctx);

  const reasons: string[] = [...mapErrors];
  if (enrichment?.ambiguousReasons?.length) reasons.push(...enrichment.ambiguousReasons);
  if (!reasons.length) reasons.push("unresolved_metadata");

  const ck = ctx.cacheKey ?? "null";
  const id = `${ck}:${ctx.rowIndex}:${ctx.outputItemIndex}`;

  let confidence: "low" | "medium" | "high" = "low";
  if (heuristic.suggestion_reasons.length && heuristic.suggested_tier && heuristic.suggested_exam) {
    confidence = heuristic.suggestion_confidence;
  }

  return {
    id,
    cache_key: ctx.cacheKey,
    source_file: sourceFile,
    row_index: ctx.rowIndex,
    output_item_index: ctx.outputItemIndex,
    stem_excerpt: ex,
    stem_hash: stemHash,
    explicit_tier,
    explicit_exam,
    parent_metadata_snapshot: parentSnap,
    filename_path_hints: hints,
    heuristic,
    confidence,
    status: "needs_review",
    reviewed_tier: "",
    reviewed_exam: "",
    reasons: [...new Set(reasons)],
    enrichment,
    map_errors: mapErrors,
  };
}

function pathBasenameHint(dirAbs: string): string {
  const parts = dirAbs.split(/[/\\]/).filter(Boolean);
  return parts[parts.length - 1] ?? dirAbs;
}

export type NursingReviewArtifactFileV1 = {
  version: 1;
  kind: "nursing_unresolved_metadata_review";
  generatedAt: string;
  sourceDir: string;
  sourceFile: string;
  counts: {
    totalNursingRowsScanned: number;
    validRows: number;
    unresolvedRows: number;
    uniqueUnresolvedCacheKeys: number;
    suggestionOnlyRows: number;
  };
  entries: NursingUnresolvedReviewEntryV1[];
};
