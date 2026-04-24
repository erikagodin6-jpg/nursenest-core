/**
 * Marketing lessons hub — cross-checks list rows with a **fresh** {@link getPathwayLessonForMarketingHubVerify} load
 * (no `unstable_cache` lag vs the hub list). **Strict** rows match the historical contract (publicComplete + pathway context).
 * **Soft** failures (`detail_not_public_complete`, `pathway_context_mismatch`) still hydrate — those rows are kept
 * with {@link PathwayLessonRecord.hubMarketingDegraded} so the grid does not silently empty while the detail route
 * can still render preview/quality states (see {@link resolveMarketingPathwayLessonRouteResolution}).
 *
 * Intentionally **does not** re-apply professional-practice corpus suppression or `REVIEW_REQUIRED` hub taxonomy —
 * those are not part of marketing detail `not_found` resolution and caused silent “0 lessons” when list rows
 * (metadata / thin hub shape) disagreed with full-document checks.
 *
 * List rows can still diverge on slug/overlay drift; this pass closes **hydration + publicComplete + pathway context** only.
 *
 * **Per-row locale:** Hub rows carry {@link PathwayLessonRecord.localeMeta}`.contentLocale` (warehouse shard). Verify
 * passes the **hub page** marketing locale into {@link getPathwayLessonForMarketingHubVerify} for overlays (same as
 * {@link getPathwayLessonsPageFresh}) and passes the warehouse shard separately so Prisma reads match list SQL.
 *
 * **Resolver parity:** strict verify still uses the same gates as {@link evaluatePublicMarketingLessonCrossLinkIntegrity}.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type {
  HubCurriculumPrepareStageDiagnostics,
  HubMarketingLessonDetailFailureReason,
  HubVerifyDroppedPreparedRowSample,
  MarketingHubLessonVerifyDiagnostics,
} from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { getPathwayLessonForMarketingHubVerify } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Hub verify issues one full-lesson read per unique slug (`getPathwayLessonForMarketingHubVerify`).
 * Values in the ~20s range overload remote poolers: many rows time out → `detail_loader_miss` → verify collapse.
 * Default stays conservative; raise via `NN_MARKETING_HUB_VERIFY_CONCURRENCY` on fast private DBs.
 */
const DEFAULT_DETAIL_VERIFY_CONCURRENCY = 8;
const MAX_DETAIL_VERIFY_CONCURRENCY = 16;

function resolvedMarketingHubVerifyConcurrency(explicit?: number): number {
  if (typeof explicit === "number" && Number.isFinite(explicit)) {
    return Math.max(1, Math.min(MAX_DETAIL_VERIFY_CONCURRENCY, Math.floor(explicit)));
  }
  const raw = process.env.NN_MARKETING_HUB_VERIFY_CONCURRENCY?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const n = Number(raw);
    if (Number.isFinite(n)) return Math.max(1, Math.min(MAX_DETAIL_VERIFY_CONCURRENCY, n));
  }
  return DEFAULT_DETAIL_VERIFY_CONCURRENCY;
}

export type ResolveMarketingLessonDetailFn = (
  pathwayId: string,
  slug: string,
  hubMarketingLocale: string,
  lessonDbShardLocale?: string,
) => Promise<PathwayLessonRecord | undefined>;

/** Optional 4th argument to {@link evaluatePublicMarketingLessonCrossLinkIntegrity}. */
export type EvaluatePublicMarketingLessonCrossLinkOptions = {
  resolveLessonDetail?: ResolveMarketingLessonDetailFn;
  /**
   * `pathway_lessons.locale` shard used when the hub list row was built (`localeMeta.contentLocale`).
   * When set, Prisma reads prefer this shard while overlays still use `hubMarketingLocale` (parity with list SQL).
   */
  lessonDbShardLocale?: string;
};

export type {
  HubCurriculumPrepareStageDiagnostics,
  HubVerifyDroppedPreparedRowSample,
  MarketingHubLessonVerifyDiagnostics,
} from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";

function tallyReason(
  map: Partial<Record<HubMarketingLessonDetailFailureReason, number>>,
  reason: HubMarketingLessonDetailFailureReason,
): void {
  map[reason] = (map[reason] ?? 0) + 1;
}

/** Slugs that hydrate but fail strict marketing gates — keep on hub as {@link PathwayLessonRecord.hubMarketingDegraded}. */
const SOFT_HUB_VERIFY_RECOVERY_REASONS = new Set<HubMarketingLessonDetailFailureReason>([
  "detail_not_public_complete",
  "pathway_context_mismatch",
]);

function isSoftHubVerifyRecoveryReason(
  r: HubMarketingLessonDetailFailureReason | undefined,
): r is HubMarketingLessonDetailFailureReason {
  return Boolean(r && SOFT_HUB_VERIFY_RECOVERY_REASONS.has(r));
}

/**
 * Run `fn` over `items` with at most `limit` in-flight promises (pool). Preserves output order.
 * Prefer this over chunked `Promise.all` so fast rows do not wait for the slowest row in each chunk.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const n = items.length;
  if (n === 0) return [];
  const lim = Math.max(1, limit);
  const out: R[] = new Array(n);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const i = nextIndex++;
      if (i >= n) return;
      out[i] = await fn(items[i]!);
    }
  }

  const workers = Math.min(lim, n);
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return out;
}

export type HubLessonDetailExcluded = {
  slug: string;
  reason: HubMarketingLessonDetailFailureReason;
};

/**
 * Single-slug **same contract** as {@link verifyMarketingHubLessonRowsResolve} — fresh detail load,
 * {@link pathwayLessonEligibleForPublicMarketingSurface}, pathway exam/country context (matches marketing detail gates).
 *
 * @param hubMarketingLocale Hub page marketing locale (same value passed into {@link getPathwayLessonsPageFresh}) — drives overlays.
 * @param opts.lessonDbShardLocale Optional list-row warehouse locale; when set, pass to resolver so DB reads match list SQL.
 */
export async function evaluatePublicMarketingLessonCrossLinkIntegrity(
  pathway: Pick<ExamPathwayDefinition, "id">,
  rawSlug: string,
  hubMarketingLocale: string,
  opts?: EvaluatePublicMarketingLessonCrossLinkOptions,
): Promise<
  | { ok: true; lesson: PathwayLessonRecord }
  | { ok: false; reason: HubMarketingLessonDetailFailureReason; slug: string }
> {
  const resolveLessonDetail = opts?.resolveLessonDetail ?? getPathwayLessonForMarketingHubVerify;
  const dbShard = opts?.lessonDbShardLocale?.trim() ? normalizePathwayLessonLocale(opts.lessonDbShardLocale) : undefined;
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : "";
  if (!pathwayLessonHasRenderableHubSlug({ slug })) {
    return { ok: false, reason: "missing_slug", slug: String(rawSlug ?? "") };
  }
  let loaded: PathwayLessonRecord | undefined;
  try {
    loaded = await resolveLessonDetail(pathway.id, slug, hubMarketingLocale, dbShard);
  } catch {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_loader_error", {
      pathway_id: pathway.id,
      slug: slug.slice(0, 200),
    });
    return { ok: false, reason: "detail_loader_miss", slug };
  }
  if (!loaded) {
    return { ok: false, reason: "detail_loader_miss", slug };
  }
  if (!pathwayLessonEligibleForPublicMarketingSurface(loaded)) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_not_public_complete", {
      pathway_id: pathway.id,
      slug: slug.slice(0, 200),
    });
    return { ok: false, reason: "detail_not_public_complete", slug };
  }
  if (!pathwayLessonMatchesMarketingPathwayContext(pathway.id, loaded)) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_pathway_context_mismatch", {
      pathway_id: pathway.id,
      slug: slug.slice(0, 200),
    });
    return { ok: false, reason: "pathway_context_mismatch", slug };
  }
  return { ok: true, lesson: loaded };
}

/**
 * Historical error type when verify dropped every prepared row. {@link verifyMarketingHubLessonRowsResolve}
 * now returns an empty `kept` array and structured diagnostics instead of throwing — this class remains exported
 * so older tooling / docs references keep resolving.
 */
export class HubVerifyPreparedPositiveZeroKeptError extends Error {
  readonly pathwayId: string;
  readonly lessonContentLocale: string;
  readonly preparedCount: number;
  readonly reasonsJson: string;

  constructor(pathwayId: string, lessonContentLocale: string, preparedCount: number, reasonsJson: string) {
    super(
      `[pathway_lessons] hub verify pipeline invariant: preparedCount=${preparedCount} verifyKeptCount=0 (list vs detail contract drift or loader failure). pathway=${pathwayId} locale=${lessonContentLocale} reasons=${reasonsJson}`,
    );
    this.name = "HubVerifyPreparedPositiveZeroKeptError";
    this.pathwayId = pathwayId;
    this.lessonContentLocale = lessonContentLocale;
    this.preparedCount = preparedCount;
    this.reasonsJson = reasonsJson;
  }
}

export async function verifyMarketingHubLessonRowsResolve(
  pathway: Pick<ExamPathwayDefinition, "id">,
  lessons: readonly PathwayLessonRecord[],
  lessonContentLocale: string,
  options?: {
    concurrency?: number;
    resolveLessonDetail?: ResolveMarketingLessonDetailFn;
    /**
     * Dominant `pathway_lessons.locale` warehouse for this pathway (same as hub SQL list). When hub list rows omit
     * `localeMeta.contentLocale`, verify must still hydrate with this shard or Canada/US peers collapse to `en`-only misses.
     */
    listWarehouseLocale?: string;
    /** When true, zero-kept critical log uses `all_rows_excluded_tests` outcome (unit tests). */
    skipZeroKeptPipelineInvariant?: boolean;
    /** Optional prepare-stage counts merged into `diagnostics` for debug / ops. */
    prepareStages?: HubCurriculumPrepareStageDiagnostics;
  },
): Promise<{
  kept: PathwayLessonRecord[];
  excluded: HubLessonDetailExcluded[];
  diagnostics: MarketingHubLessonVerifyDiagnostics;
}> {
  const concurrency = resolvedMarketingHubVerifyConcurrency(options?.concurrency);
  const resolveLessonDetail = options?.resolveLessonDetail ?? getPathwayLessonForMarketingHubVerify;

  const safe = lessons.filter((l) => pathwayLessonHasRenderableHubSlug(l));
  /** First-seen slug → DB/catalog `contentLocale` from the hub list row (must match detail hydration). */
  const slugToListDetailLocale = new Map<string, string>();
  for (const l of safe) {
    const s = l.slug.trim();
    if (slugToListDetailLocale.has(s)) continue;
    const raw = l.localeMeta?.contentLocale?.trim();
    if (raw) slugToListDetailLocale.set(s, normalizePathwayLessonLocale(raw));
  }
  const uniqueSlugs = [...new Set(safe.map((l) => l.slug.trim()))];

  const listWarehouseLocale = options?.listWarehouseLocale?.trim();

  const pairs = await mapWithConcurrency(uniqueSlugs, concurrency, async (slug) => {
    const detailLocale =
      slugToListDetailLocale.get(slug) ??
      (listWarehouseLocale ? normalizePathwayLessonLocale(listWarehouseLocale) : undefined) ??
      lessonContentLocale;
    const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, slug, lessonContentLocale, {
      resolveLessonDetail,
      lessonDbShardLocale: detailLocale,
    });
    return { slug, ev };
  });

  const verifyExcluded: HubLessonDetailExcluded[] = [];
  const okSlugSet = new Set<string>();

  for (const p of pairs) {
    if (p.ev.ok) {
      okSlugSet.add(p.slug);
    } else {
      verifyExcluded.push({ slug: p.ev.slug, reason: p.ev.reason });
    }
  }

  const kept: PathwayLessonRecord[] = [];
  const excluded: HubLessonDetailExcluded[] = [...verifyExcluded];

  for (const lesson of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(lesson)) {
      excluded.push({ slug: String(lesson.slug ?? ""), reason: "missing_slug" });
      continue;
    }
    const slug = lesson.slug.trim();
    if (okSlugSet.has(slug)) {
      kept.push(lesson);
    }
  }

  const excludedByReason: Partial<Record<HubMarketingLessonDetailFailureReason, number>> = {};
  for (const e of verifyExcluded) {
    tallyReason(excludedByReason, e.reason);
  }
  for (const lesson of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(lesson)) {
      tallyReason(excludedByReason, "missing_slug");
    }
  }

  const slugFailureReason = new Map<string, HubMarketingLessonDetailFailureReason>();
  for (const e of verifyExcluded) {
    slugFailureReason.set(e.slug.trim(), e.reason);
  }

  const strictVerifiedRowCount = kept.length;
  for (const lesson of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(lesson)) continue;
    const slug = lesson.slug.trim();
    if (okSlugSet.has(slug)) continue;
    const r = slugFailureReason.get(slug);
    if (isSoftHubVerifyRecoveryReason(r)) {
      const hubMarketingDegradedReason =
        r === "detail_not_public_complete" ? ("partial_content" as const) : ("pathway_mismatch" as const);
      kept.push({
        ...lesson,
        hubMarketingDegraded: true,
        hubMarketingDegradedReason,
      });
    }
  }
  const degradedHubRowCount = Math.max(0, kept.length - strictVerifiedRowCount);

  const preparedRowBySlug = new Map<string, PathwayLessonRecord>();
  for (const l of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(l)) continue;
    const k = l.slug.trim();
    if (!preparedRowBySlug.has(k)) preparedRowBySlug.set(k, l);
  }
  const droppedSampleCap =
    process.env.NN_MARKETING_HUB_PIPELINE_DEBUG === "1"
      ? Math.min(120, Math.max(48, verifyExcluded.length))
      : 24;
  const droppedPreparedRowSamples: HubVerifyDroppedPreparedRowSample[] = verifyExcluded
    .slice(0, droppedSampleCap)
    .map((e) => {
      const hit = preparedRowBySlug.get(e.slug.trim());
      return {
        slug: e.slug.slice(0, 200),
        pathwayId: pathway.id,
        reasonDropped: e.reason,
        contentLocale: hit?.localeMeta?.contentLocale,
        publicComplete: hit?.structuralQuality?.publicComplete,
        bodySystem: hit?.bodySystem,
        topicSlug: hit?.topicSlug,
      };
    });

  const exclusionReasonsRanked: Array<{ reason: HubMarketingLessonDetailFailureReason; count: number }> = [
    ...Object.entries(excludedByReason),
  ]
    .map(([reason, count]) => ({ reason: reason as HubMarketingLessonDetailFailureReason, count: count ?? 0 }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));

  const rowLevelExcludedByReason: Partial<Record<HubMarketingLessonDetailFailureReason, number>> = {};
  for (const lesson of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(lesson)) {
      tallyReason(rowLevelExcludedByReason, "missing_slug");
      continue;
    }
    const s = lesson.slug.trim();
    if (okSlugSet.has(s)) continue;
    const r = slugFailureReason.get(s) ?? "detail_loader_miss";
    if (isSoftHubVerifyRecoveryReason(r)) continue;
    tallyReason(rowLevelExcludedByReason, r);
  }

  const excludedSlugSampleCap =
    process.env.NN_MARKETING_HUB_PIPELINE_DEBUG === "1"
      ? Math.min(400, Math.max(48, verifyExcluded.length))
      : 24;

  const renderablePreparedRows = lessons.filter(pathwayLessonHasRenderableHubSlug).length;
  const diagnostics: MarketingHubLessonVerifyDiagnostics = {
    pathwayId: pathway.id,
    lessonContentLocale,
    hubPageMarketingLocale: lessonContentLocale,
    verifyListWarehouseLocale: listWarehouseLocale ?? "",
    droppedPreparedRowSamples,
    prepareStages: options?.prepareStages,
    incomingPreparedRowCount: lessons.length,
    uniqueSlugCount: uniqueSlugs.length,
    keptRowCount: kept.length,
    strictVerifiedRowCount,
    degradedHubRowCount,
    droppedRowCount: Math.max(0, renderablePreparedRows - kept.length),
    excludedUniqueSlugCount: verifyExcluded.length,
    verifyResolverCallCount: uniqueSlugs.length,
    excludedByReason,
    exclusionReasonsRanked: lessons.length > 0 ? exclusionReasonsRanked : undefined,
    excludedSlugSamples: verifyExcluded.slice(0, excludedSlugSampleCap).map((e) => ({
      slug: e.slug.slice(0, 200),
      reason: e.reason,
    })),
  };

  if (lessons.length > 0) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_counts", {
      pathway_id: pathway.id,
      lesson_content_locale: lessonContentLocale,
      /** Same as `incoming_rows` — explicit name for dashboards. */
      prepared_count: String(lessons.length),
      /** Same as `kept_rows` — explicit name for dashboards. */
      verify_kept_count: String(kept.length),
      incoming_rows: String(lessons.length),
      unique_slugs: String(uniqueSlugs.length),
      kept_rows: String(kept.length),
      excluded_unique_slugs: String(verifyExcluded.length),
      reasons_json: JSON.stringify(excludedByReason),
      row_level_drop_reasons_json: JSON.stringify(rowLevelExcludedByReason),
      exclusion_reasons_ranked_json: JSON.stringify(exclusionReasonsRanked),
    });
  }
  if (verifyExcluded.length > 0) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_exclusions_sample", {
      pathway_id: pathway.id,
      lesson_content_locale: lessonContentLocale,
      sample: verifyExcluded
        .slice(0, 12)
        .map((e) => `${e.slug}:${e.reason}`)
        .join("|"),
    });
    safeServerLog("pathway_lessons", "hub_verify_dropped_prepared_row_samples", {
      pathway_id: pathway.id,
      lesson_content_locale: lessonContentLocale,
      dropped_prepared_row_samples_json: JSON.stringify(droppedPreparedRowSamples.slice(0, 12)).slice(0, 6000),
    });
  }
  if (lessons.length > 0 && kept.length === 0) {
    safeServerLog("pathway_lessons", "hub_verify_pipeline_zero_kept", {
      pathway_id: pathway.id,
      lesson_content_locale: lessonContentLocale,
      prepared_count: String(lessons.length),
      verify_kept_count: "0",
      incoming_rows: String(lessons.length),
      unique_slugs: String(uniqueSlugs.length),
      reasons_json: JSON.stringify(excludedByReason),
      outcome: "pipeline_break",
    });
  }

  if (process.env.NN_MARKETING_HUB_PIPELINE_DEBUG === "1" && verifyExcluded.length > 0) {
    safeServerLog("pathway_lessons", "hub_verify_excluded_slugs_compact", {
      pathway_id: pathway.id,
      hub_page_marketing_locale: lessonContentLocale,
      list_warehouse_locale: listWarehouseLocale ?? "",
      excluded_count: String(verifyExcluded.length),
      pipe_joined: verifyExcluded
        .slice(0, 320)
        .map((e) => `${e.slug.slice(0, 120)}:${e.reason}`)
        .join("|"),
    });
  }

  const reasonsJson = JSON.stringify(excludedByReason);
  if (lessons.length > 0 && kept.length === 0) {
    safeServerLog("pathway_lessons", "hub_verify_prepared_positive_zero_kept_critical", {
      pathway_id: pathway.id,
      lesson_content_locale: lessonContentLocale,
      prepared_count: String(lessons.length),
      verify_kept_count: "0",
      reasons_json: reasonsJson.slice(0, 2000),
      outcome: options?.skipZeroKeptPipelineInvariant ? "all_rows_excluded_tests" : "all_rows_excluded_soft_return",
    });
  }

  return { kept, excluded, diagnostics };
}
