import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  evaluatePublicMarketingLessonCrossLinkIntegrity,
  mapWithConcurrency,
  type EvaluatePublicMarketingLessonCrossLinkOptions,
  type ResolveMarketingLessonDetailFn,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import type { HubMarketingLessonDetailFailureReason } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import { shouldSuppressProfessionalPracticeHubLesson } from "@/lib/taxonomy/nursing-taxonomy-validation";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/** Marketing hub: target minimum **strict** (detail-verified) public lesson cards. */
export const MARKETING_HUB_MIN_VISIBLE_LESSONS = 12;

const DEFAULT_FILL_VERIFY_CONCURRENCY = 8;
const MAX_FILL_VERIFY_CONCURRENCY = 16;

function resolvedFillVerifyConcurrency(explicit?: number): number {
  if (typeof explicit === "number" && Number.isFinite(explicit)) {
    return Math.max(1, Math.min(MAX_FILL_VERIFY_CONCURRENCY, Math.floor(explicit)));
  }
  const raw = process.env.NN_MARKETING_HUB_VERIFY_CONCURRENCY?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const n = Number(raw);
    if (Number.isFinite(n)) return Math.max(1, Math.min(MAX_FILL_VERIFY_CONCURRENCY, n));
  }
  return DEFAULT_FILL_VERIFY_CONCURRENCY;
}

function tallyReason(
  map: Partial<Record<HubMarketingLessonDetailFailureReason, number>>,
  reason: HubMarketingLessonDetailFailureReason,
): void {
  map[reason] = (map[reason] ?? 0) + 1;
}

function detailShardLocaleForListRow(
  row: PathwayLessonRecord,
  listWarehouseLocale: string | null | undefined,
): string | undefined {
  const raw = row.localeMeta?.contentLocale?.trim();
  if (raw) return normalizePathwayLessonLocale(raw);
  const lw = listWarehouseLocale?.trim();
  if (lw) return normalizePathwayLessonLocale(lw);
  return undefined;
}

/** Rows that passed strict marketing hub verify (not soft-recovery / inventory padding). */
export function countStrictMarketingHubInventoryRows(rows: readonly PathwayLessonRecord[]): number {
  return rows.filter((l) => !l.hubMarketingDegraded).length;
}

export type MarketingHubLessonInventoryFillPrefilterDropped = {
  missingSlug: number;
  missingMarketingHref: number;
  taxonomyReviewRequired: number;
  listRowNotPublicComplete: number;
  pathwayContextMismatchOnListRow: number;
};

export type MarketingHubLessonInventoryFillDiagnostics = {
  routePathname: string;
  pathwayId: string;
  contentLocale: string;
  listWarehouseLocale: string;
  initialStrictCount: number;
  initialTotalKeptCount: number;
  /** Distinct extra slugs after prefilter + dedupe against `verifiedKept`. */
  candidateSlugsDiscovered: number;
  /** Slugs sent through detail verify (capped for pool safety). */
  candidateSlugsEvaluated: number;
  filledStrictCount: number;
  finalStrictCount: number;
  finalTotalCount: number;
  rejectedEvaluateCount: number;
  evaluateRejectionReasons: Partial<Record<HubMarketingLessonDetailFailureReason, number>>;
  professionalCorpusSuppressedCount: number;
  prefilterDropped: MarketingHubLessonInventoryFillPrefilterDropped;
};

export type MarketingHubLessonInventoryFillDeps = {
  evaluateCrossLink?: (
    pathway: Pick<ExamPathwayDefinition, "id">,
    rawSlug: string,
    hubMarketingLocale: string,
    opts?: EvaluatePublicMarketingLessonCrossLinkOptions,
  ) => ReturnType<typeof evaluatePublicMarketingLessonCrossLinkIntegrity>;
  resolveLessonDetail?: ResolveMarketingLessonDetailFn;
};

/**
 * After {@link verifyMarketingHubLessonRowsResolve}, raises **strict** (detail-resolvable + publicComplete +
 * pathway context + taxonomy/pro guards) inventory up to `minVisible` using **only** additional rows from the same
 * pathway-scoped loader/prepared pools. Preserves `verifiedKept` order first; appends newly verified hydrations.
 */
export async function fillMarketingHubLessonInventoryToMinimum(args: {
  pathway: Pick<ExamPathwayDefinition, "id">;
  routePathname: string;
  lessonContentLocale: string;
  listWarehouseLocale?: string | null;
  lessonsBasePath: string;
  minVisible?: number;
  verifiedKept: readonly PathwayLessonRecord[];
  hubCurriculumPrepared: readonly PathwayLessonRecord[];
  loaderRenderable: readonly PathwayLessonRecord[];
  verifyConcurrency?: number;
  deps?: MarketingHubLessonInventoryFillDeps;
}): Promise<{ lessons: PathwayLessonRecord[]; diagnostics: MarketingHubLessonInventoryFillDiagnostics }> {
  const min = Math.max(0, Math.floor(args.minVisible ?? MARKETING_HUB_MIN_VISIBLE_LESSONS));
  const pathwayId = args.pathway.id;
  const listWh = args.listWarehouseLocale?.trim() ?? "";

  const initialTotal = [...args.verifiedKept];
  const initialStrict = countStrictMarketingHubInventoryRows(initialTotal);

  const prefilterDropped: MarketingHubLessonInventoryFillPrefilterDropped = {
    missingSlug: 0,
    missingMarketingHref: 0,
    taxonomyReviewRequired: 0,
    listRowNotPublicComplete: 0,
    pathwayContextMismatchOnListRow: 0,
  };

  const seenSlug = new Set(initialTotal.map((l) => l.slug.trim()));
  const orderedExtras: PathwayLessonRecord[] = [];
  for (const row of [...args.loaderRenderable, ...args.hubCurriculumPrepared]) {
    if (!pathwayLessonHasRenderableHubSlug(row)) {
      prefilterDropped.missingSlug += 1;
      continue;
    }
    const slug = row.slug.trim();
    if (seenSlug.has(slug)) continue;
    if (pathwayLessonMarketingDetailHref(args.lessonsBasePath, slug) == null) {
      prefilterDropped.missingMarketingHref += 1;
      continue;
    }
    if (classifyPathwayLessonRecordForHub(row).categoryId === REVIEW_REQUIRED) {
      prefilterDropped.taxonomyReviewRequired += 1;
      continue;
    }
    if (!pathwayLessonEligibleForPublicMarketingSurface(row)) {
      prefilterDropped.listRowNotPublicComplete += 1;
      continue;
    }
    if (!pathwayLessonMatchesMarketingPathwayContext(pathwayId, row)) {
      prefilterDropped.pathwayContextMismatchOnListRow += 1;
      continue;
    }
    seenSlug.add(slug);
    orderedExtras.push(row);
  }

  const need = Math.max(0, min - initialStrict);
  const evaluateRejectionReasons: Partial<Record<HubMarketingLessonDetailFailureReason, number>> = {};
  let filledStrict = 0;
  let professionalCorpusSuppressedCount = 0;

  if (need === 0 || orderedExtras.length === 0) {
    const diagnostics: MarketingHubLessonInventoryFillDiagnostics = {
      routePathname: args.routePathname,
      pathwayId,
      contentLocale: args.lessonContentLocale,
      listWarehouseLocale: listWh,
      initialStrictCount: initialStrict,
      initialTotalKeptCount: initialTotal.length,
      candidateSlugsDiscovered: orderedExtras.length,
      candidateSlugsEvaluated: 0,
      filledStrictCount: 0,
      finalStrictCount: initialStrict,
      finalTotalCount: initialTotal.length,
      rejectedEvaluateCount: 0,
      evaluateRejectionReasons,
      professionalCorpusSuppressedCount: 0,
      prefilterDropped,
    };
    if (initialStrict < min) {
      safeServerLog("pathway_lessons", "marketing_hub_inventory_fill_degraded", {
        stage: "marketing_hub_inventory_fill_degraded",
        event: "marketing_hub_inventory_fill_degraded",
        route: args.routePathname,
        pathway_id: pathwayId,
        content_locale: args.lessonContentLocale,
        list_warehouse_locale: listWh,
        initial_strict: String(initialStrict),
        final_strict: String(initialStrict),
        min_target: String(min),
        candidate_slugs_discovered: String(orderedExtras.length),
        candidate_slugs_evaluated: "0",
        reason: "no_additional_candidates_or_target_met",
        prefilter_json: JSON.stringify(prefilterDropped),
      });
    }
    return { lessons: initialTotal, diagnostics };
  }

  const concurrency = resolvedFillVerifyConcurrency(args.verifyConcurrency);
  const MAX_EXTRA_EVAL_SLUGS = Math.min(240, Math.max(need * 8, 48));
  const cappedExtras = orderedExtras.slice(0, MAX_EXTRA_EVAL_SLUGS);

  const pairs = await mapWithConcurrency(cappedExtras, concurrency, async (row) => {
    const slug = row.slug.trim();
    const shard = detailShardLocaleForListRow(row, args.listWarehouseLocale);
    const ev = args.deps?.evaluateCrossLink
      ? await args.deps.evaluateCrossLink(args.pathway, slug, args.lessonContentLocale, {
          lessonDbShardLocale: shard,
          resolveLessonDetail: args.deps?.resolveLessonDetail,
        })
      : await evaluatePublicMarketingLessonCrossLinkIntegrity(args.pathway, slug, args.lessonContentLocale, {
          lessonDbShardLocale: shard,
          resolveLessonDetail: args.deps?.resolveLessonDetail,
        });
    return { slug, ev };
  });

  const appended: PathwayLessonRecord[] = [];
  for (const p of pairs) {
    if (filledStrict >= need) break;
    if (!p.ev.ok) {
      tallyReason(evaluateRejectionReasons, p.ev.reason);
      continue;
    }
    if (shouldSuppressProfessionalPracticeHubLesson(p.ev.lesson)) {
      professionalCorpusSuppressedCount += 1;
      tallyReason(evaluateRejectionReasons, "professional_hub_corpus_guard");
      continue;
    }
    appended.push(p.ev.lesson);
    filledStrict += 1;
  }

  const rejectedEvaluateCount = pairs.filter((p) => {
    if (!p.ev.ok) return true;
    return shouldSuppressProfessionalPracticeHubLesson(p.ev.lesson);
  }).length;

  const lessons = [...initialTotal, ...appended];
  const finalStrict = countStrictMarketingHubInventoryRows(lessons);

  const diagnostics: MarketingHubLessonInventoryFillDiagnostics = {
    routePathname: args.routePathname,
    pathwayId,
    contentLocale: args.lessonContentLocale,
    listWarehouseLocale: listWh,
    initialStrictCount: initialStrict,
    initialTotalKeptCount: initialTotal.length,
    candidateSlugsDiscovered: orderedExtras.length,
    candidateSlugsEvaluated: cappedExtras.length,
    filledStrictCount: filledStrict,
    finalStrictCount: finalStrict,
    finalTotalCount: lessons.length,
    rejectedEvaluateCount,
    evaluateRejectionReasons,
    professionalCorpusSuppressedCount,
    prefilterDropped,
  };

  if (filledStrict > 0) {
    safeServerLog("pathway_lessons", "marketing_hub_inventory_fill_applied", {
      stage: "marketing_hub_inventory_fill_applied",
      event: "marketing_hub_inventory_fill_applied",
      route: args.routePathname,
      pathway_id: pathwayId,
      content_locale: args.lessonContentLocale,
      list_warehouse_locale: listWh,
      initial_strict: String(initialStrict),
      filled_strict: String(filledStrict),
      final_strict: String(finalStrict),
      final_total: String(lessons.length),
      min_target: String(min),
      candidate_slugs_discovered: String(orderedExtras.length),
      candidate_slugs_evaluated: String(cappedExtras.length),
      rejected_evaluate: String(rejectedEvaluateCount),
      professional_corpus_suppressed: String(professionalCorpusSuppressedCount),
      evaluate_reasons_json: JSON.stringify(evaluateRejectionReasons),
      prefilter_json: JSON.stringify(prefilterDropped),
    });
  }

  if (finalStrict < min) {
    safeServerLog("pathway_lessons", "marketing_hub_inventory_fill_degraded", {
      stage: "marketing_hub_inventory_fill_degraded",
      event: "marketing_hub_inventory_fill_degraded",
      route: args.routePathname,
      pathway_id: pathwayId,
      content_locale: args.lessonContentLocale,
      list_warehouse_locale: listWh,
      initial_strict: String(initialStrict),
      final_strict: String(finalStrict),
      min_target: String(min),
      candidate_slugs_discovered: String(orderedExtras.length),
      candidate_slugs_evaluated: String(cappedExtras.length),
      filled_strict: String(filledStrict),
      reason: "insufficient_strict_inventory_after_fill",
      evaluate_reasons_json: JSON.stringify(evaluateRejectionReasons),
      prefilter_json: JSON.stringify(prefilterDropped),
    });
  }

  if (rejectedEvaluateCount > 0) {
    safeServerLog("pathway_lessons", "marketing_hub_inventory_rejected", {
      stage: "marketing_hub_inventory_rejected",
      route: args.routePathname,
      pathway_id: pathwayId,
      content_locale: args.lessonContentLocale,
      list_warehouse_locale: listWh,
      strict_before: String(initialStrict),
      strict_after: String(finalStrict),
      min_visible: String(min),
      candidates_considered: String(cappedExtras.length),
      rejects_by_reason_json: JSON.stringify(evaluateRejectionReasons),
      rejected_evaluate: String(rejectedEvaluateCount),
    });
  }

  return { lessons, diagnostics };
}
