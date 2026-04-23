/**
 * Marketing lessons hub — guarantees every linked lesson matches the **same server contract** as
 * the marketing lesson detail route (`resolveMarketingPathwayLessonRouteResolution` inputs), not only list-row metadata.
 *
 * Runs **after** {@link prepareLessonsForHubCurriculum}. A slug is kept only when a **fresh**
 * {@link getPathwayLessonForMarketingHubVerify} load (no `unstable_cache` lag vs the hub list) yields a lesson that:
 * - is {@link pathwayLessonEligibleForPublicMarketingSurface} (same `publicComplete` gate as detail)
 * - passes {@link pathwayLessonMatchesMarketingPathwayContext} (same exam/country gate as the hub list pipeline)
 *
 * Intentionally **does not** re-apply professional-practice corpus suppression or `REVIEW_REQUIRED` hub taxonomy —
 * those are not part of marketing detail `not_found` resolution and caused silent “0 lessons” when list rows
 * (metadata / thin hub shape) disagreed with full-document checks.
 *
 * List rows can still diverge on slug/overlay drift; this pass closes **hydration + publicComplete + pathway context** only.
 *
 * **Per-row locale:** Hub rows carry {@link PathwayLessonRecord.localeMeta}`.contentLocale` (warehouse shard used when
 * the list row was built). Verify passes that into {@link getPathwayLessonForMarketingHubVerify} so hydration matches
 * the list SQL/catalog merge even when the page-level marketing locale cookie differs.
 *
 * **Resolver parity:** {@link pathwayLessonEligibleForPublicMarketingSurface} is the same `publicComplete` gate as
 * {@link resolveMarketingPathwayLessonRouteResolution} (detail returns `not_found` / `lesson_not_public_complete` when
 * this would be false). Do not add stricter hub-only filters than the detail route uses.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type {
  HubMarketingLessonDetailFailureReason,
  MarketingHubLessonVerifyDiagnostics,
} from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { getPathwayLessonForMarketingHubVerify } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Hub verify issues one full-lesson read per unique slug; keep concurrency high enough to finish under serverless budgets without starving the pool. */
const DEFAULT_DETAIL_VERIFY_CONCURRENCY = 24;

export type ResolveMarketingLessonDetailFn = (
  pathwayId: string,
  slug: string,
  lessonContentLocale: string,
) => Promise<PathwayLessonRecord | undefined>;

export type { MarketingHubLessonVerifyDiagnostics } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";

function tallyReason(
  map: Partial<Record<HubMarketingLessonDetailFailureReason, number>>,
  reason: HubMarketingLessonDetailFailureReason,
): void {
  map[reason] = (map[reason] ?? 0) + 1;
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    out.push(...(await Promise.all(chunk.map((x) => fn(x)))));
  }
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
 * @param lessonContentLocale Preferred locale for {@link getPathwayLessonForMarketingHubVerify} — use hub row
 * `localeMeta.contentLocale` when verifying list rows so it matches the list pipeline warehouse.
 */
export async function evaluatePublicMarketingLessonCrossLinkIntegrity(
  pathway: Pick<ExamPathwayDefinition, "id">,
  rawSlug: string,
  lessonContentLocale: string,
  resolveLessonDetail: ResolveMarketingLessonDetailFn = getPathwayLessonForMarketingHubVerify,
): Promise<
  | { ok: true; lesson: PathwayLessonRecord }
  | { ok: false; reason: HubMarketingLessonDetailFailureReason; slug: string }
> {
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : "";
  if (!pathwayLessonHasRenderableHubSlug({ slug })) {
    return { ok: false, reason: "missing_slug", slug: String(rawSlug ?? "") };
  }
  let loaded: PathwayLessonRecord | undefined;
  try {
    loaded = await resolveLessonDetail(pathway.id, slug, lessonContentLocale);
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
  },
): Promise<{
  kept: PathwayLessonRecord[];
  excluded: HubLessonDetailExcluded[];
  diagnostics: MarketingHubLessonVerifyDiagnostics;
}> {
  const concurrency = Math.max(1, Math.min(24, options?.concurrency ?? DEFAULT_DETAIL_VERIFY_CONCURRENCY));
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
    const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(
      pathway,
      slug,
      detailLocale,
      resolveLessonDetail,
    );
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
    tallyReason(rowLevelExcludedByReason, r);
  }

  const diagnostics: MarketingHubLessonVerifyDiagnostics = {
    pathwayId: pathway.id,
    lessonContentLocale,
    incomingPreparedRowCount: lessons.length,
    uniqueSlugCount: uniqueSlugs.length,
    keptRowCount: kept.length,
    droppedRowCount: Math.max(0, lessons.length - kept.length),
    excludedUniqueSlugCount: verifyExcluded.length,
    verifyResolverCallCount: uniqueSlugs.length,
    excludedByReason,
    exclusionReasonsRanked: lessons.length > 0 ? exclusionReasonsRanked : undefined,
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
