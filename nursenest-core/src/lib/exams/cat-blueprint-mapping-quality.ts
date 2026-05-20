import {
  CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED,
  CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM,
  CAT_BLUEPRINT_SESSION_MAPPED_WARN,
  getCatBlueprintQualityThresholds,
} from "@/lib/exams/cat-blueprint-thresholds";
import type {
  CatAnswerResult,
  CatBlueprintAdminDiagnostics,
  CatExamReport,
  CatFallbackDistributionEntry,
  CatPresentationMode,
} from "@/lib/exams/cat-types";

/** @deprecated Use {@link CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM} from `cat-blueprint-thresholds`. */
export const CAT_BLUEPRINT_WARN_POOL_EXAM_SIM_FRACTION = CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM;

/** @deprecated Use {@link CAT_BLUEPRINT_SESSION_MAPPED_WARN} from `cat-blueprint-thresholds`. */
export const CAT_BLUEPRINT_WARN_SESSION_DELIVERED_FRACTION = CAT_BLUEPRINT_SESSION_MAPPED_WARN;

/** @deprecated Use {@link CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED} from `cat-blueprint-thresholds`. */
export const CAT_BLUEPRINT_LOG_POOL_PRACTICE_FRACTION = CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED;

function isBlueprintMappedSource(s: CatAnswerResult["blueprintMappingSource"]): boolean {
  return s === "nclex_client_needs" || s === "aanp_blueprint";
}

export function sessionMappedFractionFromResultsLocal(results: CatAnswerResult[]): number {
  if (results.length === 0) return 0;
  const n = results.filter((r) => isBlueprintMappedSource(r.blueprintMappingSource)).length;
  return n / results.length;
}

export function buildMappingQualityWarnings(params: {
  poolMappedFraction: number;
  sessionMappedFraction: number;
  scoredCount: number;
  presentationMode?: CatPresentationMode;
}): Array<{ code: string; detail: string }> {
  const w: Array<{ code: string; detail: string }> = [];
  if (
    params.presentationMode === "exam_simulation" &&
    params.poolMappedFraction < CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM
  ) {
    w.push({
      code: "exam_sim_pool_mapping_low",
      detail: `Exam simulation pool blueprint mapping is ${(params.poolMappedFraction * 100).toFixed(1)}% (target ≥ ${CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM * 100}%). Backfill nclex_client_needs_category with NCLEX or AANP blueprint ids.`,
    });
  }
  if (params.scoredCount > 0 && params.sessionMappedFraction < CAT_BLUEPRINT_SESSION_MAPPED_WARN) {
    w.push({
      code: "session_delivered_mapping_low",
      detail: `Delivered session used blueprint tags on ${(params.sessionMappedFraction * 100).toFixed(1)}% of scored items (target ≥ ${CAT_BLUEPRINT_SESSION_MAPPED_WARN * 100}%).`,
    });
  }
  return w;
}

/**
 * Admin filters / summaries: true when persisted warnings exist or when fractions + mode
 * would produce the same warnings as {@link buildMappingQualityWarnings} (thresholds live in
 * `cat-blueprint-thresholds.ts` via that helper). Missing fractions are treated as “unknown”
 * for the corresponding check (no false positives).
 */
export function catBlueprintSessionHasQualityWarnings(params: {
  presentationMode?: CatPresentationMode;
  poolMappedFraction: number | null | undefined;
  sessionMappedFraction: number | null | undefined;
  scoredCount: number | null | undefined;
  persistedWarnings?: Array<{ code: string; detail: string }> | null | undefined;
}): boolean {
  if (params.persistedWarnings && params.persistedWarnings.length > 0) return true;
  const pool = params.poolMappedFraction;
  const sess = params.sessionMappedFraction;
  if (pool == null && sess == null) return false;
  const safePool = typeof pool === "number" ? pool : 1;
  const safeSess = typeof sess === "number" ? sess : 1;
  return (
    buildMappingQualityWarnings({
      poolMappedFraction: safePool,
      sessionMappedFraction: safeSess,
      scoredCount: params.scoredCount ?? 0,
      presentationMode: params.presentationMode,
    }).length > 0
  );
}

const FALLBACK_DISTRIBUTION_MAX_KEYS = 30;
const TOP_FALLBACK_QUICK_LIST = 15;

function buildFallbackDistribution(
  fallbackByKey: Record<string, number>,
  deliveredFallbackCount: number,
  totalScored: number,
): { distribution: CatFallbackDistributionEntry[]; topQuick: Array<{ blueprintKey: string; count: number }> } {
  const entries = Object.entries(fallbackByKey).sort((a, b) => b[1] - a[1]);
  const slice = entries.slice(0, FALLBACK_DISTRIBUTION_MAX_KEYS);
  const distribution: CatFallbackDistributionEntry[] = slice.map(([blueprintKey, count]) => ({
    blueprintKey,
    count,
    percentOfFallbackItems: deliveredFallbackCount
      ? Math.round((count / deliveredFallbackCount) * 10_000) / 100
      : 0,
    percentOfTotalScored: totalScored ? Math.round((count / totalScored) * 10_000) / 100 : 0,
  }));
  const topQuick = distribution.slice(0, TOP_FALLBACK_QUICK_LIST).map(({ blueprintKey, count }) => ({
    blueprintKey,
    count,
  }));
  return { distribution, topQuick };
}

export function buildCatBlueprintAdminDiagnostics(params: {
  results: CatAnswerResult[];
  poolMappedFraction: number;
  presentationMode?: CatPresentationMode;
}): CatBlueprintAdminDiagnostics {
  let deliveredMappedCount = 0;
  let deliveredFallbackCount = 0;
  const fallbackByKey: Record<string, number> = {};
  for (const r of params.results) {
    if (isBlueprintMappedSource(r.blueprintMappingSource)) {
      deliveredMappedCount += 1;
    } else {
      deliveredFallbackCount += 1;
      const k = r.categoryKey || "General";
      fallbackByKey[k] = (fallbackByKey[k] ?? 0) + 1;
    }
  }

  const totalScored = params.results.length;
  const { distribution: fallbackDistributionDelivered, topQuick: topFallbackBlueprintKeysDelivered } =
    buildFallbackDistribution(fallbackByKey, deliveredFallbackCount, totalScored);

  const sessionMappedFraction = sessionMappedFractionFromResultsLocal(params.results);
  const t = getCatBlueprintQualityThresholds();
  const mappingQualityWarnings = buildMappingQualityWarnings({
    poolMappedFraction: params.poolMappedFraction,
    sessionMappedFraction,
    scoredCount: params.results.length,
    presentationMode: params.presentationMode,
  });

  const deliveredPercentMapped = totalScored ? Math.round((deliveredMappedCount / totalScored) * 10_000) / 100 : 0;
  const deliveredPercentFallback = totalScored
    ? Math.round((deliveredFallbackCount / totalScored) * 10_000) / 100
    : 0;

  return {
    poolMappedFraction: params.poolMappedFraction,
    sessionMappedFraction,
    deliveredMappedCount,
    deliveredFallbackCount,
    topFallbackBlueprintKeysDelivered,
    fallbackDistributionDelivered,
    qualityThresholds: {
      poolMappedFractionWarning: t.poolMappedFractionWarning,
      sessionMappedFractionWarning: t.sessionMappedFractionWarning,
      practicePoolLogFraction: t.practicePoolLogFraction,
    },
    deliveredPercentMapped,
    deliveredPercentFallback,
    mappingQualityWarnings,
  };
}

export function logCatBlueprintSessionMappingQuality(params: {
  practiceTestId?: string;
  userId?: string;
  presentationMode?: CatPresentationMode;
  warnings: Array<{ code: string; detail: string }>;
  poolMappedFraction: number;
  sessionMappedFraction: number;
}): void {
  if (params.warnings.length === 0) return;
  console.info(
    JSON.stringify({
      tag: "nursenest_cat_blueprint",
      event: "session_mapping_quality",
      practiceTestId: params.practiceTestId,
      userId: params.userId,
      presentationMode: params.presentationMode,
      poolMappedFraction: params.poolMappedFraction,
      sessionMappedFraction: params.sessionMappedFraction,
      qualityThresholds: getCatBlueprintQualityThresholds(),
      warnings: params.warnings,
    }),
  );
}

export function logCatBlueprintSessionMappingQualityFromReport(
  report: CatExamReport,
  ctx?: { userId?: string; practiceTestId?: string; presentationMode?: CatPresentationMode },
): void {
  const admin = report.blueprintAdminDiagnostics;
  if (!admin?.mappingQualityWarnings.length) return;
  logCatBlueprintSessionMappingQuality({
    practiceTestId: ctx?.practiceTestId,
    userId: ctx?.userId,
    presentationMode: ctx?.presentationMode,
    warnings: admin.mappingQualityWarnings,
    poolMappedFraction: admin.poolMappedFraction,
    sessionMappedFraction: admin.sessionMappedFraction,
  });
}
