/**
 * Pathway lesson data layer (marketing + sitemap).
 *
 * **Scale:** Hub/topic lists use offset pagination and hub-list selects (no `sections` JSON).
 * **Build:** Marketing lesson routes use `generateStaticParams() => []` + `dynamicParams` so builds
 * do not pre-render every lesson slug.
 * **Catalog:** `catalog.json` is bundled with server code; full-lesson bodies load only for detail/sitemap
 * batches — avoid passing entire pathway catalogs to client components.
 * **Scope:** Intentional route-scoped heavy loader. Do not import this into root/shared layouts, the
 * homepage shell, or header/nav chrome; use metadata/preview helpers on shared surfaces instead.
 */
import { prisma } from "@/lib/db";
import { PRISMA_ID_IN_CHUNK_SIZE, takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { HubLessonsListDatabaseError } from "@/lib/lessons/hub-lessons-database-error";
import type { PathwayLessonEducationalOverlay } from "@/lib/i18n/educational-content-overlay";
import { applyPathwayLessonEducationalOverlay } from "@/lib/i18n/educational-content-overlay";
import { fetchPublishedPathwayLessonOverlayMapSafe } from "@/lib/i18n/educational-translation-db";
import {
  normalizePathwayLessonLocale,
  PATHWAY_LESSON_CANONICAL_DB_LOCALE,
  PATHWAY_LESSON_SITEMAP_LOCALE,
  pickPathwayLessonListWarehouseLocale,
} from "@/lib/lessons/pathway-lesson-locale";
import { filterTopicClustersForPublicNavigationByTopicPageTotal } from "@/lib/lessons/pathway-topic-sitemap-filter";
import { evaluatePathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-premium";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import {
  type PathwayLessonClinicalPriority,
  type PathwayLessonExamMeta,
  type PathwayLessonPriority,
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonAudienceTier,
  type PathwayLessonCountryScope,
  type PathwayLessonExamRelevance,
  type PathwayLessonRuntimeCountry,
  type PathwayLessonRuntimeExam,
  type PathwayLessonFigure,
  type PathwayLessonFigureKind,
  type PathwayLessonLocaleMeta,
  type PathwayLessonOmittedPremiumSection,
  type PathwayLessonQuizItem,
  type PathwayLessonRecord,
  type PathwayLessonRelatedRef,
  type PathwayLessonSection,
  type PathwayLessonSectionKind,
  type PathwayLessonYieldLevel,
} from "@/lib/lessons/pathway-lesson-types";
import { cacheTagPathwayLessonsHub } from "@/lib/cache/cache-tags";
import { ContentStatus, type Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logDurabilityEvent } from "@/lib/durability/durability-log";
import { getPaidContentStaleCache } from "@/lib/durability/paid-content-stale-cache";
import { sortPathwayLessonsForPublicPreview } from "@/lib/lessons/pathway-lesson-public-preview-priority";
import type { LaunchBundleEntry, PathwayLaunchBundleSpec } from "@/lib/lessons/pathway-launch-bundle";
import { getLaunchBundleSpec } from "@/lib/lessons/pathway-launch-bundle";
import { maxSafeOffsetPage } from "@/lib/api/api-pagination-limits";
import {
  PATHWAY_CATALOG_LIST_HARD_CAP,
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-scale";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";
import {
  PATHWAY_LESSON_DB_TIMEOUT_MS,
  PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS,
} from "@/lib/lessons/pathway-lesson-loader-config";
import type { LessonInput } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  getCatalogLessonsRaw,
  getCatalogPathwayLessonsSync,
  getEffectiveCatalogLessonsForPathwaySync,
  listCatalogPathwayIdsWithLessonsSync,
  normalizeLesson,
  normalizePathwayLessonInput,
  pathwayLessonRowToInput,
  sanitizeQuestionIdArray,
  sanitizeQuizItems,
  pathwayLessonMatchesMarketingPathwayContext,
  countMarketingPathwayContextFilterStages,
  sortAndFilterLessonsForPathwayContext,
  summarizePathwayContextPipelineDrops,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

export {
  getCatalogLessonsRaw,
  getCatalogPathwayLessonsSync,
  getEffectiveCatalogLessonsForPathwaySync,
  normalizeLesson,
  normalizePathwayLessonInput,
  pathwayLessonRowToInput,
  sanitizeQuestionIdArray,
  sanitizeQuizItems,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

export {
  PATHWAY_CATALOG_LIST_HARD_CAP,
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-scale";
export {
  PATHWAY_LESSON_DB_TIMEOUT_MS,
  PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS,
} from "@/lib/lessons/pathway-lesson-loader-config";
/**
 * Cross-request Data Cache TTL for public lesson payloads (no user/session).
 * Personalized progress stays outside this layer (see pathway-lesson-progress).
 * Also use as `export const revalidate` on marketing lesson detail so page ISR matches Data Cache.
 */
export const PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS = 3600;
/** Related lessons block on lesson detail — small bounded list. */
export const RELATED_PATHWAY_LESSONS_LIMIT = 8;
/** Topic-filtered question hub / cross-links: same numeric cap as {@link RELATED_PATHWAY_LESSONS_LIMIT}. */
export const RELATED_LESSONS_FOR_TOPIC_CAP = RELATED_PATHWAY_LESSONS_LIMIT;
/** Pass to {@link getRelatedPathwayLessons} when no lesson should be excluded (hub / topic-only views). */
export const RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL = "__related_lessons_exclude_none__";
/** Sitemap / batch reads: rows per round-trip. */
export const PATHWAY_LESSON_SITEMAP_BATCH = 600;
/** Hub lesson search: ignore single-character noise; cap length for safety. */
export const PATHWAY_HUB_SEARCH_MIN_LEN = 2;
export const PATHWAY_HUB_SEARCH_MAX_LEN = 80;

/** Normalized search string for pathway lesson hubs (catalog + DB lists), or `undefined` when inactive. */
export function normalizePathwayHubSearchQuery(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (t.length < PATHWAY_HUB_SEARCH_MIN_LEN) return undefined;
  return t.slice(0, PATHWAY_HUB_SEARCH_MAX_LEN);
}

function hubSearchHaystackLessonInput(l: LessonInput): string {
  const system = typeof l.system === "string" ? l.system : "";
  return `${l.title}\n${l.slug}\n${l.topic}\n${l.topicSlug}\n${system}\n${l.bodySystem}\n${l.seoDescription}`.toLowerCase();
}

function lessonInputMatchesHubSearch(l: LessonInput, qLower: string): boolean {
  return hubSearchHaystackLessonInput(l).includes(qLower);
}

function filterCatalogLessonsByTopicSlugs(
  rows: LessonInput[],
  topicSlugsIn: string[] | undefined,
): LessonInput[] {
  if (!topicSlugsIn?.length) return rows;
  const set = new Set(topicSlugsIn.map((s) => s.trim()).filter(Boolean));
  if (set.size === 0) return rows;
  return rows.filter((row) => set.has(typeof row.topicSlug === "string" ? row.topicSlug.trim() : ""));
}

function pathwayLessonHubSearchWhere(q: string): Prisma.PathwayLessonWhereInput {
  return {
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { topic: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { topicSlug: { contains: q, mode: "insensitive" } },
      { bodySystem: { contains: q, mode: "insensitive" } },
      { seoDescription: { contains: q, mode: "insensitive" } },
    ],
  };
}


/**
 * Hub cards: keep metadata + structural gate, drop heavy bodies after completeness filtering.
 */
export function stripPathwayLessonToHubListShape(full: PathwayLessonRecord): PathwayLessonRecord {
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    system: full.system ?? full.bodySystem,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
    sections: [],
    structuralQuality: full.structuralQuality,
    localeMeta: full.localeMeta,
    ...(full.audienceTiers?.length ? { audienceTiers: full.audienceTiers } : {}),
    ...(full.countryScope ? { countryScope: full.countryScope } : {}),
    ...(full.examRelevance ? { examRelevance: full.examRelevance } : {}),
    ...(full.relatedLessonRefs?.length ? { relatedLessonRefs: full.relatedLessonRefs } : {}),
    ...(full.premiumOmittedSections?.length ? { premiumOmittedSections: full.premiumOmittedSections } : {}),
    ...(full.audioUrl ? { audioUrl: full.audioUrl } : {}),
    ...(full.exams?.length ? { exams: full.exams } : {}),
    ...(full.countries?.length ? { countries: full.countries } : {}),
    ...(full.priority ? { priority: full.priority } : {}),
    ...(full.examMeta?.length ? { examMeta: full.examMeta } : {}),
    ...(full.activeExamMeta ? { activeExamMeta: full.activeExamMeta } : {}),
    ...(full.preTestQuestionIds?.length ? { preTestQuestionIds: full.preTestQuestionIds } : {}),
    ...(full.postTestQuestionIds?.length ? { postTestQuestionIds: full.postTestQuestionIds } : {}),
    ...(full.preTest ? { preTest: full.preTest } : {}),
    ...(full.postTest ? { postTest: full.postTest } : {}),
    ...(full.premiumValidation ? { premiumValidation: full.premiumValidation } : {}),
  };
}

/** Drops lesson rows that cannot build a safe public hub href; logs for admin follow-up. */
function filterHubListItemsForSafeSlugs(items: PathwayLessonRecord[], pathwayId: string): PathwayLessonRecord[] {
  const out: PathwayLessonRecord[] = [];
  for (const it of items) {
    if (pathwayLessonHasRenderableHubSlug(it)) {
      out.push(it);
      continue;
    }
    safeServerLog("content_quarantine", "pathway_lesson_hub_slug_unsafe", {
      pathwayId,
      slug_preview: String(it.slug ?? "").slice(0, 120),
    });
  }
  return out;
}

function logHubListPipelineDropSamples(
  pathwayId: string,
  afterSafeSlug: PathwayLessonRecord[],
  afterContext: PathwayLessonRecord[],
  limit: number,
): void {
  if (process.env.NN_PATHWAY_HUB_PIPELINE_DROP_LOG !== "1") return;
  const kept = new Set(afterContext.map((l) => l.slug));
  const dropped = afterSafeSlug.filter((l) => !kept.has(l.slug));
  if (dropped.length === 0) return;
  const samples = dropped.slice(0, limit).map((l) => {
    let reason = "unknown";
    if (!pathwayLessonEligibleForPublicMarketingSurface(l)) reason = "not_public_complete";
    else if (!pathwayLessonMatchesMarketingPathwayContext(pathwayId, l)) reason = "exam_country_context_mismatch";
    return { slug: String(l.slug ?? "").slice(0, 120), reason };
  });
  safeServerLog("pathway_lessons", "hub_list_pipeline_drop_sample", {
    pathwayId,
    dropped_total: String(dropped.length),
    sample_json: JSON.stringify(samples),
  });
}

/** First N lesson titles from the static catalog (public marketing previews). Empty when catalog has no rows for the pathway. */
export function getCatalogLessonPreviewTitles(pathwayId: string, limit = 4): string[] {
  const lessons = sortPathwayLessonsForPublicPreview(pathwayId, getCatalogPathwayLessonsSync(pathwayId));
  return lessons.slice(0, Math.max(0, limit)).map((l) => l.title);
}

function withLocaleMeta(lesson: PathwayLessonRecord, meta: PathwayLessonLocaleMeta): PathwayLessonRecord {
  return { ...lesson, localeMeta: meta };
}

/** File-based `lessons.json` + optional DB-published overlays (slug or `pathwayId:slug`). */
function applyLessonEducationalOverlay(
  lesson: PathwayLessonRecord,
  marketingLocale: string | undefined,
  pathwayId: string,
  dbLessonOverlayBundle?: Record<string, PathwayLessonEducationalOverlay>,
): PathwayLessonRecord {
  return applyPathwayLessonEducationalOverlay(
    lesson,
    normalizePathwayLessonLocale(marketingLocale),
    pathwayId,
    dbLessonOverlayBundle,
  );
}

/** Recompute structural gate after overlay patches titles/sections (locale overlays). */
function applyOverlayAndStructural(
  lesson: PathwayLessonRecord,
  marketingLocale: string | undefined,
  pathwayId: string,
  dbLessonOverlayBundle?: Record<string, PathwayLessonEducationalOverlay>,
): PathwayLessonRecord {
  const after = applyLessonEducationalOverlay(lesson, marketingLocale, pathwayId, dbLessonOverlayBundle);
  return { ...after, structuralQuality: evaluatePathwayLessonStructuralGate(after) };
}

function lessonLocaleMeta(
  requestedRaw: string | undefined,
  contentLocale: string,
  usedLocaleFallback: boolean,
  isCatalogEnglishSource: boolean,
): PathwayLessonLocaleMeta {
  return {
    requestedContentLocale: normalizePathwayLessonLocale(requestedRaw),
    contentLocale,
    usedLocaleFallback,
    isCatalogEnglishSource,
  };
}

async function dbCall<T>(
  run: () => Promise<T>,
  fallback: T,
  timeoutMs: number = PATHWAY_LESSON_DB_TIMEOUT_MS,
): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, timeoutMs, {
    scope: "pathway_lessons",
    label: "pathway_lesson_prisma",
  });
}

/**
 * Hub inventory queries must **not** swallow auth/timeout errors as empty lists — callers surface a retryable error.
 */
async function lessonHubDbQueryOrThrow<T>(label: string, run: () => Promise<T>): Promise<T> {
  if (!isDatabaseUrlConfigured()) {
    throw new HubLessonsListDatabaseError({
      category: "db_missing_url",
      label,
      message: "DATABASE_URL is not configured",
    });
  }
  if (isRuntimeSafeMode()) {
    throw new HubLessonsListDatabaseError({
      category: "db_error",
      label,
      message: "runtime_safe_mode_blocked_database",
    });
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("database_timeout")), PATHWAY_LESSON_DB_TIMEOUT_MS);
      }),
    ]);
  } catch (e) {
    throw HubLessonsListDatabaseError.fromCaughtUnknown(e, label);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function assertPublishedLessonInventoryDbReachable(pathwayId: string): Promise<number> {
  return lessonHubDbQueryOrThrow("pathway_published_lesson_count_all_locales", () =>
    prisma.pathwayLesson.count({
      where: { pathwayId, status: ContentStatus.PUBLISHED },
    }),
  );
}

/**
 * Per-request memo: marketing hub verify loads hundreds of slugs; published lesson overlays are
 * locale-wide (not per slug). Without memoization each verify call re-hit the overlay query and
 * amplified timeouts → `detail_loader_miss` for most rows while the hub list still looked healthy.
 */
const fetchPublishedLessonOverlaysForMarketingLocale = cache(async (normalizedLocale: string) =>
  fetchPublishedPathwayLessonOverlayMapSafe(normalizedLocale),
);

/** Batch: which scoped-gold slugs already have a published row (avoids N sequential count queries on hub cold start). */
async function scopedGoldPublishedSlugSet(pathwayId: string, locale: string, slugs: string[]): Promise<Set<string>> {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (unique.length === 0) return new Set();
  const out = new Set<string>();
  for (let i = 0; i < unique.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
    const chunk = unique.slice(i, i + PRISMA_ID_IN_CHUNK_SIZE);
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            locale,
            status: ContentStatus.PUBLISHED,
            slug: { in: chunk },
          },
          select: { slug: true },
        }),
      [],
    );
    for (const r of rows) out.add(r.slug);
  }
  return out;
}

/** Hub rows for scoped gold lessons not yet published in DB (DB overrides catalog/injections). */
async function listMissingScopedGoldHubRows(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
): Promise<LessonInput[]> {
  const { scopedGoldHubRowsForPathway } = await import("@/lib/lessons/scoped-lessons/scoped-gold-registry");
  const candidates = scopedGoldHubRowsForPathway(pathwayId, topicSlugsIn);
  const publishedSlugs = await scopedGoldPublishedSlugSet(
    pathwayId,
    locale,
    candidates.map((c) => c.slug),
  );
  const catalogFullBySlug = new Map(getCatalogLessonsRaw(pathwayId).map((l) => [l.slug, l]));
  const out: LessonInput[] = [];
  for (const row of candidates) {
    if (publishedSlugs.has(row.slug)) continue;
    const full = catalogFullBySlug.get(row.slug);
    if (full) {
      out.push(full);
      continue;
    }
    safeServerLog("content_quarantine", "scoped_gold_hub_missing_catalog_body", {
      pathwayId,
      slug: row.slug,
    });
  }
  return out;
}

/**
 * Any published row for pathway (any locale).
 * Request-memoized — {@link getPathwayLessonImpl} consults this for every slug during hub verify.
 */
const pathwayHasPublishedDbLessons = cache(async function pathwayHasPublishedDbLessons(pathwayId: string): Promise<boolean> {
  const row = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, status: ContentStatus.PUBLISHED },
        select: { id: true },
      }),
    null,
  );
  return !!row;
});


/** Total published rows for pathway across locales (audit / metrics). */
async function countPublishedDbLessonsAllLocales(pathwayId: string): Promise<number> {
  return dbCall(
    () => prisma.pathwayLesson.count({ where: { pathwayId, status: ContentStatus.PUBLISHED } }),
    0,
  );
}

/**
 * Same count as {@link countPublishedDbLessonsAllLocales} but swallows hub-level DB errors so
 * admin/reporting paths can degrade to catalog length. **Marketing hub list** uses
 * {@link assertPublishedLessonInventoryDbReachable} instead so auth failures are not shown as “0 lessons”.
 */
async function countPublishedDbLessonsAllLocalesWithHealth(
  pathwayId: string,
): Promise<{ count: number; unavailable: boolean }> {
  try {
    const n = await assertPublishedLessonInventoryDbReachable(pathwayId);
    return { count: n, unavailable: false };
  } catch {
    return { count: 0, unavailable: true };
  }
}

/**
 * One `groupBy` per pathway + requested locale: pick the dominant `pathway_lessons.locale` warehouse.
 * See {@link pickPathwayLessonListWarehouseLocale} — avoids a stray `en` shard hiding a large non-English corpus.
 *
 * **Request-memoized:** hub list and per-slug marketing verify both call this; without memoization a
 * full-hub verify issued hundreds of identical `groupBy` queries and starved Prisma time budgets.
 */
const effectiveLocaleForPathwayLessonDbRows = cache(async function effectiveLocaleForPathwayLessonDbRows(
  pathwayId: string,
  requestedRaw: string,
): Promise<string> {
  const requested = normalizePathwayLessonLocale(requestedRaw);
  const rows = await lessonHubDbQueryOrThrow("pathway_lesson_locale_groupby", () =>
    prisma.pathwayLesson.groupBy({
      by: ["locale"],
      where: { pathwayId, status: ContentStatus.PUBLISHED },
      _count: { _all: true },
    }),
  );
  if (rows.length === 0) return PATHWAY_LESSON_CANONICAL_DB_LOCALE;
  const effective = pickPathwayLessonListWarehouseLocale({
    localeCounts: rows.map((r) => ({ locale: r.locale, count: r._count._all })),
    requestedLocale: requested,
  });
  if (rows.length > 1 || effective !== requested) {
    const funnel = [...rows]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12)
      .map((r) => `${r.locale}:${r._count._all}`)
      .join("|");
    safeServerLog("pathway_lessons", "hub_list_db_locale_pick", {
      pathwayId,
      requested,
      effective,
      funnel,
    });
  }
  return effective;
});

const PATHWAY_LESSON_HUB_LIST_SELECT = {
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  exams: true,
  countries: true,
  priority: true,
  examMeta: true,
  locale: true,
} as const;

const PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS = {
  ...PATHWAY_LESSON_HUB_LIST_SELECT,
  sections: true,
} as const;

async function loadPublishedLessonRowsPage(
  pathwayId: string,
  locale: string,
  skip: number,
  take: number,
  topicSlugsIn?: string[],
  hubSearch?: string,
  /** When true, load `sections` JSON so subscriber completeness gates can run before stripping for hub cards. */
  includeSections = false,
): Promise<LessonInput[]> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return [];
  const base: Prisma.PathwayLessonWhereInput = {
    pathwayId,
    status: ContentStatus.PUBLISHED,
    locale,
    ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
  };
  const where: Prisma.PathwayLessonWhereInput =
    hubSearch && hubSearch.length >= PATHWAY_HUB_SEARCH_MIN_LEN
      ? { AND: [base, pathwayLessonHubSearchWhere(hubSearch)] }
      : base;
  const select = includeSections ? PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS : PATHWAY_LESSON_HUB_LIST_SELECT;
  return dbCall(async () => {
    const rows = await prisma.pathwayLesson.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      skip,
      take,
      select,
    });
    return rows.map((row) =>
      pathwayLessonRowToInput({
        ...row,
        sections: includeSections && "sections" in row && row.sections != null ? row.sections : [],
      }),
    );
  }, []);
}

async function countPublishedLessonRows(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
  hubSearch?: string,
): Promise<number> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return 0;
  const base: Prisma.PathwayLessonWhereInput = {
    pathwayId,
    status: ContentStatus.PUBLISHED,
    locale,
    ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
  };
  const where: Prisma.PathwayLessonWhereInput =
    hubSearch && hubSearch.length >= PATHWAY_HUB_SEARCH_MIN_LEN
      ? { AND: [base, pathwayLessonHubSearchWhere(hubSearch)] }
      : base;
  return dbCall(() => prisma.pathwayLesson.count({ where }), 0);
}

export type PathwayLessonListLocaleInfo = {
  requested: string;
  effective: string;
  usedEnglishFallback: boolean;
  catalogEnglishOnlySource: boolean;
};

/** Stage counts for marketing lessons hub debugging (optional; populated by {@link getPathwayLessonsPageFresh}). */
export type PathwayLessonsHubLoadDiagnostics = {
  runtimeSource?: "database" | "catalog" | "none";
  /** Published `pathway_lessons` rows for pathway (any locale), from DB presence probe. */
  rawDbCount?: number;
  /** Raw catalog lessons for pathway before topic/search filter (catalog runtime only). */
  rawCatalogCount?: number;
  /** `COUNT` matching hub list SQL filters in the effective list locale (DB path). */
  afterDbWhereCount?: number;
  /** Alias of {@link afterDbWhereCount} for older logs. */
  sqlDbPublishedApprox?: number;
  rawMergedInputCount?: number;
  /** Rows after overlay + structural + marketing strip, before safe-slug filter. */
  afterHubNormalizedCount?: number;
  afterSlugNormalizeCount?: number;
  /** Same length as post-sort list — equals `afterCountryContextCount` when no sort removes rows. */
  afterPathwayContextCount?: number;
  /** After `publicComplete` gate only (pre exam/country match). */
  afterPublicCompleteCount?: number;
  /** After exam/country context match (same filter set as {@link sortAndFilterLessonsForPathwayContext}). */
  afterCountryContextCount?: number;
  afterDedupeCount?: number;
  catalogRawFilteredApprox?: number;
  truncatedDbScan?: boolean;
  goldInjectedCount?: number;
  resolveDurationMs?: number;
  sliceDurationMs?: number;
  /** Sub-phase timings inside {@link resolveMarketingHubRenderableLessonList} (ms, best-effort). */
  timingsMs?: {
    dbQuery?: number | null;
    catalogLoad?: number | null;
    normalization?: number | null;
    contextFilter?: number | null;
    dedupe?: number | null;
  };
};

export type PathwayLessonsPageResult = {
  items: PathwayLessonRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  locale?: PathwayLessonListLocaleInfo;
  /**
   * Full normalized hub list backing `items` + `total` (same filters as pagination).
   * Used by the curriculum hub so body-system sections are not built from a single page slice alone.
   */
  renderableAll?: PathwayLessonRecord[];
  /** Optional pipeline metrics for `/…/lessons` diagnostics (never required for rendering). */
  loadDiagnostics?: PathwayLessonsHubLoadDiagnostics;
};

const HUB_FULL_SCAN_CHUNK = 400;

/** Loads published hub-list rows in bounded chunks until exhausted or `maxRows` (same filters as pagination). */
async function loadPublishedLessonInputsAllChunked(
  pathwayId: string,
  locale: string,
  topicSlugsIn: string[] | undefined,
  hubSearch: string | undefined,
  maxRows: number,
): Promise<LessonInput[]> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return [];
  const out: LessonInput[] = [];
  let skip = 0;
  while (out.length < maxRows) {
    const take = Math.min(HUB_FULL_SCAN_CHUNK, maxRows - out.length);
    const part = await loadPublishedLessonRowsPage(pathwayId, locale, skip, take, topicSlugsIn, hubSearch, true);
    if (part.length === 0) break;
    out.push(...part);
    skip += part.length;
    if (part.length < take) break;
  }
  return out;
}

/**
 * Full marketing hub lesson list after the same normalization as hub cards:
 * overlay, structural gate, marketing-surface filter, pathway exam/country context, safe slugs, dedupe.
 * Pagination slices from this array so `total` and rendered rows cannot disagree.
 */
async function resolveMarketingHubRenderableLessonList(
  pathwayId: string,
  marketingLocale: string | undefined,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<{
  renderableAll: PathwayLessonRecord[];
  locale: PathwayLessonListLocaleInfo;
  runtimeSource: "database" | "catalog" | "none";
  diagnostics: PathwayLessonsHubLoadDiagnostics;
}> {
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(requested);
  const topicSlugsIn = listOptions?.topicSlugsIn;
  const qRaw = normalizePathwayHubSearchQuery(listOptions?.q);
  const qLower = qRaw ? qRaw.toLowerCase() : "";

  let publishedCrossLocaleCount: number;
  try {
    publishedCrossLocaleCount = await assertPublishedLessonInventoryDbReachable(pathwayId);
  } catch (e) {
    const err = HubLessonsListDatabaseError.fromCaughtUnknown(e, "pathway_published_lesson_count_all_locales");
    safeServerLog("pathway_lessons", "hub_list_db_unavailable_fail_closed", {
      pathwayId,
      hubSearch: qRaw ? "1" : "0",
      db_failure_category: err.category,
    });
    safeServerLog("pathway_lessons", "lesson_hub_db_unavailable", {
      pathway_id: pathwayId,
      hub_search: qRaw ? "1" : "0",
      db_failure_category: err.category,
    });
    throw err;
  }

  const dbAny = publishedCrossLocaleCount > 0;
  if (dbAny) {
    const tDbQuery0 = performance.now();
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const missingGolds = await listMissingScopedGoldHubRows(pathwayId, effective, topicSlugsIn);
    const goldsFiltered = qRaw ? missingGolds.filter((row) => lessonInputMatchesHubSearch(row, qLower)) : missingGolds;
    const sqlDbOnly = await countPublishedLessonRows(pathwayId, effective, topicSlugsIn, qRaw);
    const dbChunked = await loadPublishedLessonInputsAllChunked(
      pathwayId,
      effective,
      topicSlugsIn,
      qRaw,
      PATHWAY_CATALOG_LIST_HARD_CAP,
    );
    const dbQueryMs = Math.round(performance.now() - tDbQuery0);
    const truncatedDbScan = sqlDbOnly > dbChunked.length;
    const rawInputs = [...goldsFiltered, ...dbChunked];
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const tNorm0 = performance.now();
    const hubNormalized = rawInputs.map((row) =>
      stripPathwayLessonToHubListShape(
        applyOverlayAndStructural(
          withLocaleMeta(normalizeLesson(row, pathwayId), meta),
          marketingLocale,
          pathwayId,
          lessonDbOverlays,
        ),
      ),
    );
    const normalizationMs = Math.round(performance.now() - tNorm0);
    const afterSafeSlug = filterHubListItemsForSafeSlugs(hubNormalized, pathwayId);
    const tCtx0 = performance.now();
    const ctxStages = countMarketingPathwayContextFilterStages(pathwayId, afterSafeSlug);
    const afterPathwayContext = sortAndFilterLessonsForPathwayContext(pathwayId, afterSafeSlug);
    const contextFilterMs = Math.round(performance.now() - tCtx0);
    const contextDropSummary = summarizePathwayContextPipelineDrops(pathwayId, afterSafeSlug, afterPathwayContext);
    logHubListPipelineDropSamples(pathwayId, afterSafeSlug, afterPathwayContext, 24);
    const tDedupe0 = performance.now();
    const deduped = dedupePathwayLessonsForLibrary(afterPathwayContext, {
      pathwayIdHint: pathwayId,
      source: `hub_page:${pathwayId}:db`,
      devLog: true,
    });
    const dedupeMs = Math.round(performance.now() - tDedupe0);
    const renderableAll = deduped.items;

    safeServerLog("pathway_lessons", "hub_list_pipeline_stages", {
      pathwayId,
      runtime: "database",
      db_published_all_locales: String(publishedCrossLocaleCount),
      effective_list_locale: effective,
      gold_injected: String(goldsFiltered.length),
      sql_db_published_effective_locale: String(sqlDbOnly),
      db_chunk_scanned: String(dbChunked.length),
      after_initial_merge: String(rawInputs.length),
      after_normalization: String(hubNormalized.length),
      after_safe_slug: String(afterSafeSlug.length),
      after_context_and_public_complete: String(afterPathwayContext.length),
      after_dedupe: String(renderableAll.length),
      duplicate_drops: String(deduped.duplicateCount),
      hub_search: qRaw ? "1" : "0",
      context_filter_dropped_total: String(contextDropSummary.droppedTotal),
      context_filter_drop_reasons_json: JSON.stringify(contextDropSummary.reasons),
    });

    if (sqlDbOnly >= 25 && renderableAll.length < Math.max(5, Math.floor(sqlDbOnly * 0.15))) {
      safeServerLog("pathway_lessons", "hub_inventory_pipeline_shrink", {
        pathwayId,
        golds: goldsFiltered.length,
        db_chunked: dbChunked.length,
        normalized: hubNormalized.length,
        after_safe_slug: afterSafeSlug.length,
        after_pathway_context: afterPathwayContext.length,
        after_dedupe: renderableAll.length,
        duplicate_drops: deduped.duplicateCount,
      });
    }

    if (process.env.NODE_ENV !== "production" && sqlDbOnly + goldsFiltered.length > 0 && renderableAll.length === 0) {
      safeServerLog("pathway_lessons", "hub_marketing_all_db_candidates_filtered_out", {
        pathwayId,
        sql_db_only: sqlDbOnly,
        gold_injected: goldsFiltered.length,
      });
    }
    if (truncatedDbScan) {
      safeServerLog("pathway_lessons", "hub_list_renderable_truncated_to_cap", {
        pathwayId,
        cap: PATHWAY_CATALOG_LIST_HARD_CAP,
        sql_db_only: sqlDbOnly,
        scanned_db_rows: dbChunked.length,
      });
    }

    return {
      renderableAll,
      locale: {
        requested,
        effective,
        usedEnglishFallback: requested !== effective,
        catalogEnglishOnlySource: false,
      },
      runtimeSource: "database",
      diagnostics: {
        runtimeSource: "database",
        rawDbCount: publishedCrossLocaleCount,
        afterDbWhereCount: sqlDbOnly,
        sqlDbPublishedApprox: sqlDbOnly,
        rawMergedInputCount: rawInputs.length,
        afterHubNormalizedCount: hubNormalized.length,
        afterSlugNormalizeCount: afterSafeSlug.length,
        afterPublicCompleteCount: ctxStages.afterPublicComplete,
        afterCountryContextCount: ctxStages.afterCountryContext,
        afterPathwayContextCount: afterPathwayContext.length,
        afterDedupeCount: renderableAll.length,
        truncatedDbScan,
        goldInjectedCount: goldsFiltered.length,
        timingsMs: {
          dbQuery: dbQueryMs,
          normalization: normalizationMs,
          contextFilter: contextFilterMs,
          dedupe: dedupeMs,
          catalogLoad: null,
        },
      },
    };
  }

  const tCat0 = performance.now();
  const allRaw = filterCatalogLessonsByTopicSlugs(getCatalogLessonsRaw(pathwayId), topicSlugsIn);
  const filteredRaw = qRaw ? allRaw.filter((row) => lessonInputMatchesHubSearch(row, qLower)) : allRaw;
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  const tNormCat0 = performance.now();
  const hydratedCatalog = filteredRaw.map((row) =>
    stripPathwayLessonToHubListShape(
      applyOverlayAndStructural(
        withLocaleMeta(normalizeLesson(row, pathwayId), catMeta),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      ),
    ),
  );
  const normalizationCatMs = Math.round(performance.now() - tNormCat0);
  const afterSafeSlugCat = filterHubListItemsForSafeSlugs(hydratedCatalog, pathwayId);
  const tCtxCat0 = performance.now();
  const ctxStagesCat = countMarketingPathwayContextFilterStages(pathwayId, afterSafeSlugCat);
  const afterContextCat = sortAndFilterLessonsForPathwayContext(pathwayId, afterSafeSlugCat);
  const contextFilterCatMs = Math.round(performance.now() - tCtxCat0);
  const contextDropSummaryCat = summarizePathwayContextPipelineDrops(pathwayId, afterSafeSlugCat, afterContextCat);
  logHubListPipelineDropSamples(pathwayId, afterSafeSlugCat, afterContextCat, 24);
  const tDedupeCat0 = performance.now();
  const renderableAll = dedupePathwayLessonsForLibrary(afterContextCat, {
    pathwayIdHint: pathwayId,
    source: `hub_page:${pathwayId}:catalog`,
    devLog: true,
  }).items;
  const dedupeCatMs = Math.round(performance.now() - tDedupeCat0);
  const catalogLoadMs = Math.round(performance.now() - tCat0);

  safeServerLog("pathway_lessons", "hub_list_pipeline_stages", {
    pathwayId,
    runtime: "catalog",
    db_published_all_locales: String(publishedCrossLocaleCount),
    catalog_raw: String(allRaw.length),
    after_topic_filter: String(filteredRaw.length),
    after_safe_slug: String(afterSafeSlugCat.length),
    after_context_and_public_complete: String(afterContextCat.length),
    after_dedupe: String(renderableAll.length),
    hub_search: qRaw ? "1" : "0",
    context_filter_dropped_total: String(contextDropSummaryCat.droppedTotal),
    context_filter_drop_reasons_json: JSON.stringify(contextDropSummaryCat.reasons),
  });

  if (process.env.NODE_ENV !== "production" && filteredRaw.length > 0 && renderableAll.length === 0) {
    safeServerLog("pathway_lessons", "hub_marketing_catalog_all_filtered_out", {
      pathwayId,
      catalog_raw_filtered: filteredRaw.length,
    });
  }

  return {
    renderableAll,
    locale: {
      requested,
      effective: "en",
      usedEnglishFallback: requested !== "en",
      catalogEnglishOnlySource: true,
    },
    runtimeSource: renderableAll.length > 0 ? "catalog" : "none",
    diagnostics: {
      runtimeSource: renderableAll.length > 0 ? "catalog" : "none",
      rawDbCount: publishedCrossLocaleCount,
      rawCatalogCount: allRaw.length,
      afterDbWhereCount: undefined,
      catalogRawFilteredApprox: filteredRaw.length,
      rawMergedInputCount: filteredRaw.length,
      afterHubNormalizedCount: hydratedCatalog.length,
      afterSlugNormalizeCount: afterSafeSlugCat.length,
      afterPublicCompleteCount: ctxStagesCat.afterPublicComplete,
      afterCountryContextCount: ctxStagesCat.afterCountryContext,
      afterPathwayContextCount: afterContextCat.length,
      afterDedupeCount: renderableAll.length,
      timingsMs: {
        dbQuery: null,
        catalogLoad: catalogLoadMs,
        normalization: normalizationCatMs,
        contextFilter: contextFilterCatMs,
        dedupe: dedupeCatMs,
      },
    },
  };
}

function clampPageSize(pageSize: number): number {
  return Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(1, Math.floor(pageSize)));
}

function clampPage(page: number): number {
  return Math.max(1, Math.floor(page));
}

async function getPathwayLessonsPageImpl(
  pathwayId: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = Math.min(clampPage(page), maxSafeOffsetPage(ps));
  const qRaw = normalizePathwayHubSearchQuery(listOptions?.q);
  const t0 = performance.now();
  const resolved = await resolveMarketingHubRenderableLessonList(pathwayId, marketingLocale, listOptions);
  const tResolve = performance.now();
  const slice = sliceNormalizedHubLessons(resolved.renderableAll, p, ps);
  const tEnd = performance.now();
  const durationMs = Math.round(tEnd - t0);
  const resolveDurationMs = Math.round(tResolve - t0);
  const sliceDurationMs = Math.round(tEnd - tResolve);
  const diag = resolved.diagnostics;
  safeServerLog("pathway_lessons", "hub_list_resolved", {
    pathwayId,
    pathwayLessonRuntimeSource: resolved.runtimeSource,
    durationMs,
    resolve_duration_ms: resolveDurationMs,
    slice_duration_ms: sliceDurationMs,
    page: slice.page,
    pageSize: slice.pageSize,
    renderable_total: slice.total,
    hubSearch: qRaw ? "1" : "0",
    sql_db_approx: diag.sqlDbPublishedApprox ?? 0,
    catalog_raw_filtered: diag.catalogRawFilteredApprox ?? 0,
    gold_injected: diag.goldInjectedCount ?? 0,
    truncated_db_scan: diag.truncatedDbScan ? 1 : 0,
  });
  if (process.env.NODE_ENV !== "production" && slice.total > 0 && slice.items.length === 0 && slice.page === 1) {
    safeServerLog("pathway_lessons", "hub_invariant_first_page_empty", {
      pathwayId,
      renderable_total: slice.total,
      page: slice.page,
    });
  }
  return {
    items: slice.items,
    total: slice.total,
    page: slice.page,
    pageSize: slice.pageSize,
    pageCount: slice.pageCount,
    locale: resolved.locale,
    renderableAll: resolved.renderableAll,
    loadDiagnostics: {
      ...diag,
      resolveDurationMs,
      sliceDurationMs,
    },
  };
}

async function getPathwayLessonsPageWithDataCache(
  pathwayId: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  const topicKey = JSON.stringify(listOptions?.topicSlugsIn?.slice().sort() ?? []);
  const qKey = listOptions?.q ?? "";
  return unstable_cache(
    async () => getPathwayLessonsPageImpl(pathwayId, page, pageSize, marketingLocale, listOptions),
    ["pathway-hub-all", pathwayId, String(page), String(pageSize), marketingLocale ?? "", topicKey, qKey],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [cacheTagPathwayLessonsHub(pathwayId)] },
  )();
}

/** Dedupes identical hub list fetches within a single request (metadata + page, etc.). */
export const getPathwayLessonsPage = cache(getPathwayLessonsPageWithDataCache);
/**
 * Non-persistent cached variant for live hubs that must reflect recent imports immediately.
 * Uses request-scope memoization only (React cache), bypassing Next Data Cache.
 */
export const getPathwayLessonsPageFresh = cache(async function getPathwayLessonsPageFresh(
  pathwayId: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  return getPathwayLessonsPageImpl(pathwayId, page, pageSize, marketingLocale, listOptions);
});

export type TopicLessonsPageResult = PathwayLessonsPageResult;

/** Topic cluster page — bounded page through lessons in one topic slug. */
async function getLessonsForTopicPageImpl(
  pathwayId: string,
  topicSlug: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
): Promise<TopicLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = Math.min(clampPage(page), maxSafeOffsetPage(ps));
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(requested);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const t0 = performance.now();
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const total = await dbCall(
      () =>
        prisma.pathwayLesson.count({
          where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug, locale: effective },
        }),
      0,
    );
    if (total === 0) {
      const catMatched = getCatalogLessonsRaw(pathwayId).filter((l) => l.topicSlug === topicSlug);
      if (catMatched.length > 0) {
        safeServerLog("pathway_lessons", "topic_list_catalog_supplement", {
          pathwayId,
          topicSlug,
          pathwayLessonRuntimeSource: "database",
          catalogSupplementCount: catMatched.length,
        });
        const metaCat = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
        const contextCat = sortAndFilterLessonsForPathwayContext(
          pathwayId,
          filterHubListItemsForSafeSlugs(
            catMatched
              .map((row) =>
                applyOverlayAndStructural(
                  withLocaleMeta(normalizeLesson(row, pathwayId), metaCat),
                  marketingLocale,
                  pathwayId,
                  lessonDbOverlays,
                ),
              )
              .map((full) => stripPathwayLessonToHubListShape(full)),
            pathwayId,
          ),
        );
        const pageCountCat = Math.max(1, Math.ceil(contextCat.length / ps));
        const safePageCat = Math.min(p, pageCountCat);
        const skipCat = (safePageCat - 1) * ps;
        const sliceCat = contextCat.slice(skipCat, skipCat + ps);
        const durationMs = Math.round(performance.now() - t0);
        safeServerLog("pathway_lessons", "topic_list_db_timing", {
          pathwayId,
          topicSlug,
          pathwayLessonRuntimeSource: "database",
          durationMs,
          page: safePageCat,
          pageSize: ps,
          total: contextCat.length,
          catalogSupplement: true,
        });
        const dedupedSliceCat = dedupePathwayLessonsForLibrary(sliceCat, {
          pathwayIdHint: pathwayId,
          source: `topic_page:${pathwayId}:${topicSlug}:catalog_supplement`,
          devLog: true,
        });
        return {
          items: dedupedSliceCat.items,
          total: contextCat.length,
          page: safePageCat,
          pageSize: ps,
          pageCount: pageCountCat,
          locale: {
            requested,
            effective: "en",
            usedEnglishFallback: requested !== "en",
            catalogEnglishOnlySource: true,
          },
        };
      }
      const durationMs = Math.round(performance.now() - t0);
      safeServerLog("pathway_lessons", "topic_list_db_timing", {
        pathwayId,
        topicSlug,
        pathwayLessonRuntimeSource: "database",
        durationMs,
        page: 1,
        pageSize: ps,
        total: 0,
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: ps,
        pageCount: 1,
        locale: {
          requested,
          effective,
          usedEnglishFallback: requested !== effective,
          catalogEnglishOnlySource: false,
        },
      };
    }
    const missingGolds = await listMissingScopedGoldHubRows(pathwayId, effective, [topicSlug]);
    const dbRowsAll = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug, locale: effective },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          take: 200,
          select: { ...PATHWAY_LESSON_HUB_LIST_SELECT, sections: true },
        }),
      [],
    );
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const rawInputs: LessonInput[] = [
      ...missingGolds,
      ...dbRowsAll.map((r) => pathwayLessonRowToInput(r)),
    ];
    const hubReady = sortAndFilterLessonsForPathwayContext(
      pathwayId,
      filterHubListItemsForSafeSlugs(
        rawInputs
          .map((row) =>
            applyOverlayAndStructural(
              withLocaleMeta(normalizeLesson(row, pathwayId), meta),
              marketingLocale,
              pathwayId,
              lessonDbOverlays,
            ),
          )
          .map((full) => stripPathwayLessonToHubListShape(full)),
        pathwayId,
      ),
    );
    const totalReady = hubReady.length;
    const pageCount = Math.max(1, Math.ceil(totalReady / ps));
    const safePage = Math.min(p, pageCount);
    const skip = (safePage - 1) * ps;
    const items = hubReady.slice(skip, skip + ps);
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("pathway_lessons", "topic_list_db_timing", {
      pathwayId,
      topicSlug,
      pathwayLessonRuntimeSource: "database",
      durationMs,
      page: safePage,
      pageSize: ps,
      total: totalReady,
    });
    const dedupedTopicItems = dedupePathwayLessonsForLibrary(items, {
      pathwayIdHint: pathwayId,
      source: `topic_page:${pathwayId}:${topicSlug}:db`,
      devLog: true,
    });
    return {
      items: dedupedTopicItems.items,
      total: totalReady,
      page: safePage,
      pageSize: ps,
      pageCount,
      locale: {
        requested,
        effective,
        usedEnglishFallback: requested !== effective,
        catalogEnglishOnlySource: false,
      },
    };
  }

  const matched = getCatalogLessonsRaw(pathwayId).filter((l) => l.topicSlug === topicSlug);
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  const hubCatalog = sortAndFilterLessonsForPathwayContext(
    pathwayId,
    filterHubListItemsForSafeSlugs(
      matched
        .map((row) =>
          applyOverlayAndStructural(
            withLocaleMeta(normalizeLesson(row, pathwayId), catMeta),
            marketingLocale,
            pathwayId,
            lessonDbOverlays,
          ),
        )
        .map((full) => stripPathwayLessonToHubListShape(full)),
      pathwayId,
    ),
  );
  const total = hubCatalog.length;
  const pageCount = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, pageCount);
  const skip = (safePage - 1) * ps;
  const contextItems = hubCatalog.slice(skip, skip + ps);
  safeServerLog("pathway_lessons", "topic_list_source", {
    pathwayId,
    topicSlug,
    pathwayLessonRuntimeSource: total > 0 ? "catalog" : "none",
    total,
    page: safePage,
    pageSize: ps,
  });
  const dedupedTopicCatalog = dedupePathwayLessonsForLibrary(contextItems, {
    pathwayIdHint: pathwayId,
    source: `topic_page:${pathwayId}:${topicSlug}:catalog`,
    devLog: true,
  });
  return {
    items: dedupedTopicCatalog.items,
    total,
    page: safePage,
    pageSize: ps,
    pageCount,
    locale: {
      requested,
      effective: "en",
      usedEnglishFallback: requested !== "en",
      catalogEnglishOnlySource: true,
    },
  };
}

async function getLessonsForTopicPageWithDataCache(
  pathwayId: string,
  topicSlug: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
): Promise<TopicLessonsPageResult> {
  return unstable_cache(
    async () => getLessonsForTopicPageImpl(pathwayId, topicSlug, page, pageSize, marketingLocale),
    ["pathway-topic-page", pathwayId, topicSlug, String(page), String(pageSize), marketingLocale ?? ""],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [cacheTagPathwayLessonsHub(pathwayId)] },
  )();
}

export const getLessonsForTopicPage = cache(getLessonsForTopicPageWithDataCache);

/**
 * Public topic-link list for marketing UI: keeps only clusters whose topic page resolves to at least
 * one visible lesson for the current content locale. This prevents sidebars / topic chips from linking
 * into the empty topic fallback while preserving the existing ordering and labels from `listTopicClusters`.
 */
async function listTopicClustersForPublicNavigationImpl(
  pathwayId: string,
  marketingLocale?: string,
): Promise<TopicCluster[]> {
  const effectiveLocale = normalizePathwayLessonLocale(marketingLocale);
  const all = await listTopicClusters(pathwayId, effectiveLocale);
  return filterTopicClustersForPublicNavigationByTopicPageTotal(all, async (topicSlug) =>
    getLessonsForTopicPage(pathwayId, topicSlug, 1, 1, effectiveLocale),
  );
}

export const listTopicClustersForPublicNavigation = cache(listTopicClustersForPublicNavigationImpl);

/**
 * Topic clusters for `/sitemap.xml` only: keeps slugs where {@link getLessonsForTopicPage} would list
 * at least one lesson after hub filters (`pathwayLessonEligibleForPublicMarketingSurface`, pathway context, safe slugs).
 * {@link listTopicClusters} alone can include slugs from raw DB groupBy or catalog aggregates that render
 * the empty topic state (zero rows after the same filters) — those URLs are poor crawl targets.
 */
export async function listTopicClustersForSitemap(pathwayId: string): Promise<TopicCluster[]> {
  return listTopicClustersForPublicNavigation(pathwayId, PATHWAY_LESSON_SITEMAP_LOCALE);
}

/**
 * Last-resort marketing verify recovery: when targeted `findUnique` shards all miss (timeouts,
 * drifted locale metadata, or composite edge cases) but the pathway still has published inventory,
 * scan published rows for this slug and prefer locales aligned with hub hints + warehouse picks.
 */
async function tryRecoverPublishedLessonAcrossWarehouseLocales(params: {
  pathwayId: string;
  slug: string;
  marketingLocale?: string;
  overlayLocale: string;
  shardNorm?: string;
  lessonDbOverlays: Awaited<ReturnType<typeof fetchPublishedLessonOverlaysForMarketingLocale>>;
  dbTimeout: number;
}): Promise<PathwayLessonRecord | undefined> {
  const { pathwayId, slug, marketingLocale, overlayLocale, shardNorm, lessonDbOverlays, dbTimeout } = params;
  const rows = await dbCall(
    () =>
      prisma.pathwayLesson.findMany({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        take: 24,
        orderBy: [{ updatedAt: "desc" }],
      }),
    [],
    dbTimeout,
  );
  if (rows.length === 0) return undefined;
  const effectiveWarehouse = await effectiveLocaleForPathwayLessonDbRows(pathwayId, overlayLocale);
  const preferred = [
    shardNorm,
    overlayLocale,
    effectiveWarehouse,
    PATHWAY_LESSON_CANONICAL_DB_LOCALE,
  ]
    .filter((x): x is string => Boolean(x && String(x).trim()))
    .map((loc) => normalizePathwayLessonLocale(loc));
  const rank = new Map(preferred.map((loc, i) => [loc, i]));
  const sorted = [...rows].sort((a, b) => {
    const ra = rank.get(normalizePathwayLessonLocale(a.locale)) ?? 50;
    const rb = rank.get(normalizePathwayLessonLocale(b.locale)) ?? 50;
    if (ra !== rb) return ra - rb;
    return 0;
  });
  for (const row of sorted) {
    const locNorm = normalizePathwayLessonLocale(row.locale);
    const rec = applyOverlayAndStructural(
      withLocaleMeta(
        normalizeLesson(pathwayLessonRowToInput(row), pathwayId),
        lessonLocaleMeta(
          marketingLocale,
          locNorm,
          normalizePathwayLessonLocale(marketingLocale ?? "") !== locNorm,
          false,
        ),
      ),
      marketingLocale,
      pathwayId,
      lessonDbOverlays,
    );
    if (pathwayLessonEligibleForPublicMarketingSurface(rec)) {
      safeServerLog("pathway_lessons", "lesson_detail_any_published_locale_recovered", {
        pathway_id: pathwayId,
        slug: slug.slice(0, 180),
        chosen_locale: row.locale,
      });
      return rec;
    }
  }
  return undefined;
}

/** Single lesson by slug — canonical English DB row when present, then file/DB overlays; legacy non-English row if no English. */
async function getPathwayLessonImpl(
  pathwayId: string,
  slug: string,
  marketingLocale?: string,
  options?: { dbTimeoutMs?: number; lessonDbShardLocale?: string; preferPublishedLocaleScan?: boolean },
): Promise<PathwayLessonRecord | undefined> {
  const dbTimeout = options?.dbTimeoutMs ?? PATHWAY_LESSON_DB_TIMEOUT_MS;
  const overlayLocale = normalizePathwayLessonLocale(marketingLocale);
  const shardNorm = options?.lessonDbShardLocale?.trim()
    ? normalizePathwayLessonLocale(options.lessonDbShardLocale)
    : undefined;
  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(overlayLocale);
  const catalogLessons = getCatalogLessonsRaw(pathwayId);
  const catalogHitForSlug = catalogLessons.find((l) => l.slug === slug);

  const tryCatalogPublicComplete = (): PathwayLessonRecord | undefined => {
    if (!catalogHitForSlug) return undefined;
    const fromCatalog = applyOverlayAndStructural(
      withLocaleMeta(
        normalizeLesson(catalogHitForSlug, pathwayId),
        lessonLocaleMeta(marketingLocale, PATHWAY_LESSON_CANONICAL_DB_LOCALE, overlayLocale !== "en", true),
      ),
      marketingLocale,
      pathwayId,
      lessonDbOverlays,
    );
    return pathwayLessonEligibleForPublicMarketingSurface(fromCatalog) ? fromCatalog : undefined;
  };

  const rowEn = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: {
            pathwayId,
            slug,
            locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
          },
        },
      }),
    null,
    dbTimeout,
  );
  if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
    const fromDb = applyOverlayAndStructural(
      withLocaleMeta(
        normalizeLesson(pathwayLessonRowToInput(rowEn), pathwayId),
        lessonLocaleMeta(marketingLocale, PATHWAY_LESSON_CANONICAL_DB_LOCALE, false, false),
      ),
      marketingLocale,
      pathwayId,
      lessonDbOverlays,
    );
    /** Stale or partial DB rows can fail `publicComplete` while catalog JSON is editorially complete — prefer catalog for marketing detail. */
    if (pathwayLessonEligibleForPublicMarketingSurface(fromDb)) {
      return fromDb;
    }
    const fromCatalogEn = tryCatalogPublicComplete();
    if (fromCatalogEn) {
      safeServerLog("pathway_lessons", "lesson_detail_catalog_fallback_after_db_incomplete", {
        pathwayId,
        slug,
      });
      return fromCatalogEn;
    }
    /** Do not return incomplete EN rows — marketing detail + hub integrity require `publicComplete`. */
  }

  /**
   * Hub list rows are keyed by warehouse `locale` (`localeMeta.contentLocale`) while overlays follow the
   * hub page marketing locale (`marketingLocale`). When they differ, read the shard row here before the
   * generic `overlayLocale` Prisma pass (which may equal the page locale, not the warehouse).
   */
  if (
    shardNorm &&
    shardNorm !== PATHWAY_LESSON_CANONICAL_DB_LOCALE &&
    shardNorm !== overlayLocale
  ) {
    const rowShard = await dbCall(
      () =>
        prisma.pathwayLesson.findUnique({
          where: {
            pathwayId_slug_locale: { pathwayId, slug, locale: shardNorm },
          },
        }),
      null,
      dbTimeout,
    );
    if (rowShard && rowShard.status === ContentStatus.PUBLISHED) {
      const fromShard = applyOverlayAndStructural(
        withLocaleMeta(
          normalizeLesson(pathwayLessonRowToInput(rowShard), pathwayId),
          lessonLocaleMeta(
            marketingLocale,
            shardNorm,
            normalizePathwayLessonLocale(marketingLocale) !== shardNorm,
            false,
          ),
        ),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      );
      if (pathwayLessonEligibleForPublicMarketingSurface(fromShard)) {
        return fromShard;
      }
      const fromCatalogAfterShard = tryCatalogPublicComplete();
      if (fromCatalogAfterShard) {
        safeServerLog("pathway_lessons", "lesson_detail_catalog_fallback_after_shard_row_incomplete", {
          pathwayId,
          slug: slug.slice(0, 160),
          shard_locale: shardNorm,
        });
        return fromCatalogAfterShard;
      }
    }
  }

  if (overlayLocale !== PATHWAY_LESSON_CANONICAL_DB_LOCALE) {
    const rowRequested = await dbCall(
      () =>
        prisma.pathwayLesson.findUnique({
          where: {
            pathwayId_slug_locale: { pathwayId, slug, locale: overlayLocale },
          },
        }),
      null,
      dbTimeout,
    );
    if (rowRequested && rowRequested.status === ContentStatus.PUBLISHED) {
      const fromLocaleRow = applyOverlayAndStructural(
        withLocaleMeta(
          normalizeLesson(pathwayLessonRowToInput(rowRequested), pathwayId),
          lessonLocaleMeta(marketingLocale, overlayLocale, false, false),
        ),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      );
      if (pathwayLessonEligibleForPublicMarketingSurface(fromLocaleRow)) {
        return fromLocaleRow;
      }
      const fromCatalogAfterLocale = tryCatalogPublicComplete();
      if (fromCatalogAfterLocale) {
        safeServerLog("pathway_lessons", "lesson_detail_catalog_fallback_after_locale_row_incomplete", {
          pathwayId,
          slug,
          overlayLocale,
        });
        return fromCatalogAfterLocale;
      }
    }
  }

  /**
   * Hub SQL lists scan the dominant `pathway_lessons.locale` warehouse from
   * {@link effectiveLocaleForPathwayLessonDbRows} — which can differ from {@link PATHWAY_LESSON_CANONICAL_DB_LOCALE}
   * even when the learner marketing preference is EN. Without this pass, `findUnique(pathwayId, slug, en)` misses
   * rows that only exist under the warehouse locale and hub verify collapses the grid while the list still shows them.
   */
  const dbHasAny = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHasAny) {
    const attemptedDbLocales = new Set<string>([PATHWAY_LESSON_CANONICAL_DB_LOCALE]);
    if (overlayLocale !== PATHWAY_LESSON_CANONICAL_DB_LOCALE) {
      attemptedDbLocales.add(overlayLocale);
    }
    const effectiveWarehouse = await effectiveLocaleForPathwayLessonDbRows(pathwayId, overlayLocale);
    if (!attemptedDbLocales.has(effectiveWarehouse)) {
      const rowWh = await dbCall(
        () =>
          prisma.pathwayLesson.findUnique({
            where: {
              pathwayId_slug_locale: {
                pathwayId,
                slug,
                locale: effectiveWarehouse,
              },
            },
          }),
        null,
        dbTimeout,
      );
      if (rowWh && rowWh.status === ContentStatus.PUBLISHED) {
        const fromWh = applyOverlayAndStructural(
          withLocaleMeta(
            normalizeLesson(pathwayLessonRowToInput(rowWh), pathwayId),
            lessonLocaleMeta(
              marketingLocale,
              effectiveWarehouse,
              normalizePathwayLessonLocale(marketingLocale) !== effectiveWarehouse,
              false,
            ),
          ),
          marketingLocale,
          pathwayId,
          lessonDbOverlays,
        );
        if (pathwayLessonEligibleForPublicMarketingSurface(fromWh)) {
          safeServerLog("pathway_lessons", "lesson_detail_effective_warehouse_row", {
            pathwayId,
            slug: slug.slice(0, 160),
            effective_warehouse: effectiveWarehouse,
            marketing_locale_pref: overlayLocale,
          });
          return fromWh;
        }
        const fromCatalogEff = tryCatalogPublicComplete();
        if (fromCatalogEff) {
          safeServerLog("pathway_lessons", "lesson_detail_catalog_fallback_after_effective_warehouse_incomplete", {
            pathwayId,
            slug: slug.slice(0, 160),
            effective_warehouse: effectiveWarehouse,
          });
          return fromCatalogEff;
        }
      }
    }
  }

  if (
    options?.preferPublishedLocaleScan === true &&
    dbHasAny &&
    !(rowEn && rowEn.status === ContentStatus.PUBLISHED)
  ) {
    const recovered = await tryRecoverPublishedLessonAcrossWarehouseLocales({
      pathwayId,
      slug,
      marketingLocale,
      overlayLocale,
      shardNorm,
      lessonDbOverlays,
      dbTimeout,
    });
    if (recovered) {
      return recovered;
    }
  }

  if (!catalogHitForSlug) return undefined;
  const fromCatalogOnly = applyOverlayAndStructural(
    withLocaleMeta(
      normalizeLesson(catalogHitForSlug, pathwayId),
      lessonLocaleMeta(marketingLocale, PATHWAY_LESSON_CANONICAL_DB_LOCALE, overlayLocale !== "en", true),
    ),
    marketingLocale,
    pathwayId,
    lessonDbOverlays,
  );
  if (!pathwayLessonEligibleForPublicMarketingSurface(fromCatalogOnly)) {
    safeServerLog("pathway_lessons", "lesson_detail_catalog_only_incomplete", { pathwayId, slug });
    return undefined;
  }
  if (dbHasAny) {
    safeServerLog("pathway_lessons", "lesson_detail_catalog_supplement", {
      pathwayId,
      slug,
      pathwayLessonRuntimeSource: "database",
    });
  }
  return fromCatalogOnly;
}

async function getPathwayLessonWithDataCache(
  pathwayId: string,
  slug: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  return unstable_cache(
    async () => getPathwayLessonImpl(pathwayId, slug, marketingLocale),
    ["pathway-lesson-detail", pathwayId, slug, marketingLocale ?? ""],
    {
      revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS,
      tags: [cacheTagPathwayLessonsHub(pathwayId), `pathway-lesson:${pathwayId}:${slug}`],
    },
  )();
}

/** Dedupes metadata + page lesson fetches in the same request. */
export const getPathwayLesson = cache(getPathwayLessonWithDataCache);

/**
 * Uncached lesson read for **marketing hub row integrity** (`verifyMarketingHubLessonRowsResolve`).
 * Hub lists use {@link getPathwayLessonsPageFresh} (no `unstable_cache`); verifying against cached
 * {@link getPathwayLesson} can incorrectly empty the hub right after a publish when the list already
 * reflects `publicComplete` but the per-slug cache entry is still stale.
 */
export async function getPathwayLessonForMarketingHubVerify(
  pathwayId: string,
  slug: string,
  hubMarketingLocale?: string,
  lessonDbShardLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  return getPathwayLessonImpl(pathwayId, slug, hubMarketingLocale, {
    dbTimeoutMs: PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS,
    preferPublishedLocaleScan: true,
    ...(lessonDbShardLocale?.trim()
      ? { lessonDbShardLocale: normalizePathwayLessonLocale(lessonDbShardLocale) }
      : {}),
  });
}

export type PathwayLessonSeoMeta = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  publicComplete: boolean;
};

function pathwayLessonSeoMetaFromRecord(record: PathwayLessonRecord): PathwayLessonSeoMeta {
  return {
    slug: record.slug,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    topic: record.topic,
    topicSlug: record.topicSlug,
    bodySystem: record.bodySystem,
    publicComplete: Boolean(record.structuralQuality?.publicComplete),
  };
}

async function getPathwayLessonSeoMetaImpl(pathwayId: string, slug: string): Promise<PathwayLessonSeoMeta | undefined> {
  const rowEn = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: {
            pathwayId,
            slug,
            locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
          },
        },
        select: {
          slug: true,
          seoTitle: true,
          seoDescription: true,
          topic: true,
          topicSlug: true,
          bodySystem: true,
          structuralPublicComplete: true,
          status: true,
        },
      }),
    null,
  );

  if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
    if (rowEn.structuralPublicComplete) {
      return {
        slug: rowEn.slug,
        seoTitle: rowEn.seoTitle,
        seoDescription: rowEn.seoDescription,
        topic: rowEn.topic,
        topicSlug: rowEn.topicSlug,
        bodySystem: rowEn.bodySystem,
        publicComplete: true,
      };
    }

    const catalogHit = getCatalogLessonsRaw(pathwayId).find((lesson) => lesson.slug === slug);
    if (catalogHit) {
      const fromCatalog = normalizeLesson(catalogHit, pathwayId);
      if (pathwayLessonEligibleForPublicMarketingSurface(fromCatalog)) {
        safeServerLog("pathway_lessons", "lesson_metadata_catalog_fallback_after_db_incomplete", {
          pathwayId,
          slug,
        });
        return pathwayLessonSeoMetaFromRecord(fromCatalog);
      }
    }

    return {
      slug: rowEn.slug,
      seoTitle: rowEn.seoTitle,
      seoDescription: rowEn.seoDescription,
      topic: rowEn.topic,
      topicSlug: rowEn.topicSlug,
      bodySystem: rowEn.bodySystem,
      publicComplete: false,
    };
  }

  const hit = getCatalogLessonsRaw(pathwayId).find((lesson) => lesson.slug === slug);
  if (!hit) return undefined;
  return pathwayLessonSeoMetaFromRecord(normalizeLesson(hit, pathwayId));
}

async function getPathwayLessonSeoMetaWithDataCache(
  pathwayId: string,
  slug: string,
): Promise<PathwayLessonSeoMeta | undefined> {
  return unstable_cache(
    async () => getPathwayLessonSeoMetaImpl(pathwayId, slug),
    ["pathway-lesson-seo-meta", pathwayId, slug],
    {
      revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS,
      tags: [cacheTagPathwayLessonsHub(pathwayId), `pathway-lesson:${pathwayId}:${slug}`],
    },
  )();
}

/** Thin metadata loader for lesson SEO without hydrating the full lesson body. */
export const getPathwayLessonSeoMeta = cache(getPathwayLessonSeoMetaWithDataCache);

export type ResolvedPathwayLaunchBundle = {
  spec: PathwayLaunchBundleSpec;
  resolved: Array<{ entry: LaunchBundleEntry; lesson: PathwayLessonRecord }>;
};

/**
 * Resolves the editorial **launch essentials** list for a pathway (independent of hub pagination).
 * Missing slugs are skipped — content can roll out incrementally.
 */
export const resolvePathwayLaunchBundle = cache(async function resolvePathwayLaunchBundle(
  pathwayId: string,
  marketingLocale?: string,
): Promise<ResolvedPathwayLaunchBundle | null> {
  const spec = getLaunchBundleSpec(pathwayId);
  if (!spec) return null;
  const settled = await Promise.allSettled(
    spec.entries.map((e) => getPathwayLesson(pathwayId, e.slug, marketingLocale)),
  );
  const resolved = spec.entries
    .map((entry, i) => {
      const r = settled[i];
      const lesson = r?.status === "fulfilled" ? r.value : undefined;
      if (!lesson || !lesson.structuralQuality?.publicComplete) return null;
      return { entry, lesson };
    })
    .filter((x): x is { entry: LaunchBundleEntry; lesson: PathwayLessonRecord } => x !== null);
  return { spec, resolved };
});

/**
 * Progress API: accept lesson completion if slug exists in any published locale (prefer `en` row when duplicated).
 */
export async function getPathwayLessonForProgress(pathwayId: string, slug: string): Promise<PathwayLessonRecord | undefined> {
  const rowEn = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: { pathwayId_slug_locale: { pathwayId, slug, locale: "en" } },
      }),
    null,
  );
  if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
    return normalizeLesson(pathwayLessonRowToInput(rowEn), pathwayId);
  }
  const rowAny = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        orderBy: [{ locale: "asc" }],
      }),
    null,
  );
  if (rowAny) return normalizeLesson(pathwayLessonRowToInput(rowAny), pathwayId);
  const hit = getCatalogLessonsRaw(pathwayId).find((l) => l.slug === slug);
  return hit ? normalizeLesson(hit, pathwayId) : undefined;
}

/**
 * App shell `/app/lessons/[id]`: load a published DB row by primary key (no catalog fallback).
 * Callers must enforce access with {@link appPathwayLessonVisibleToSubscriber}.
 */
export async function getPublishedPathwayLessonRecordById(
  id: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  const staleKey = `lesson:${id}:${normalizePathwayLessonLocale(marketingLocale)}`;
  const row = await dbCall(() => prisma.pathwayLesson.findUnique({ where: { id } }), null);
  if (!row || row.status !== ContentStatus.PUBLISHED) {
    const stale = getPaidContentStaleCache().get<PathwayLessonRecord>(staleKey);
    if (stale) {
      logDurabilityEvent({
        event: "content_fallback_served",
        route: "getPublishedPathwayLessonRecordById",
        subsystem: "lesson",
        durationMs: 0,
        fallbackUsed: true,
        reason: "primary_unavailable",
      });
      return stale;
    }
    return undefined;
  }
  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(
    normalizePathwayLessonLocale(marketingLocale),
  );
  const lesson = applyOverlayAndStructural(
    normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId),
    marketingLocale,
    row.pathwayId,
    lessonDbOverlays,
  );
  getPaidContentStaleCache().set(staleKey, lesson);
  return lesson;
}

/** Related lessons (same topic) for detail page — capped list, bounded query on DB. */
async function getRelatedPathwayLessonsImpl(
  pathwayId: string,
  topicSlug: string,
  excludeSlug: string,
  limit: number = RELATED_PATHWAY_LESSONS_LIMIT,
  marketingLocale?: string,
  /** When the same-topic list is short, fill up to `limit` with other topics in this body system (deduped). */
  relatedBackfillBodySystem?: string | null,
): Promise<PathwayLessonRecord[]> {
  const cap = Math.min(24, Math.max(1, Math.floor(limit)));
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(requested);
  const slugWhere: Prisma.PathwayLessonWhereInput =
    excludeSlug === RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL ? {} : { slug: { not: excludeSlug } };

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            topicSlug,
            locale: effective,
            ...slugWhere,
          },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          take: Math.min(48, cap * 6),
          select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
        }),
      [],
    );
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const mapDbRows = (batch: typeof rows) =>
      batch
        .map((r) =>
          applyOverlayAndStructural(
            withLocaleMeta(normalizeLesson(pathwayLessonRowToInput(r), pathwayId), meta),
            marketingLocale,
            pathwayId,
            lessonDbOverlays,
          ),
        )
        .map((full) => stripPathwayLessonToHubListShape(full))
        .filter(pathwayLessonEligibleForPublicMarketingSurface)
        .filter(pathwayLessonHasRenderableHubSlug);

    let merged = mapDbRows(rows);
    const bsTrim = relatedBackfillBodySystem?.trim();
    if (bsTrim && merged.length < cap) {
      const need = cap - merged.length;
      const seenSlugs = new Set(merged.map((m) => m.slug));
      const backfillRows = await dbCall(
        () =>
          prisma.pathwayLesson.findMany({
            where: {
              pathwayId,
              status: ContentStatus.PUBLISHED,
              locale: effective,
              bodySystem: { equals: bsTrim, mode: "insensitive" },
              topicSlug: { not: topicSlug },
              ...slugWhere,
            },
            orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
            take: Math.min(48, need + 24),
            select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
          }),
        [],
      );
      const extra = mapDbRows(backfillRows).filter((l) => !seenSlugs.has(l.slug));
      merged = [...merged, ...extra].slice(0, cap);
    }
    return merged;
  }

  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  const catalogPrimary = getCatalogLessonsRaw(pathwayId).filter(
    (l) => l.topicSlug === topicSlug && l.slug !== excludeSlug,
  );
  const bsTrimCat = relatedBackfillBodySystem?.trim();
  let catalogMerged = catalogPrimary;
  if (bsTrimCat && catalogPrimary.length < cap) {
    const need = cap - catalogPrimary.length;
    const seen = new Set(catalogPrimary.map((p) => p.slug));
    const extra = getCatalogLessonsRaw(pathwayId).filter(
      (l) =>
        l.topicSlug !== topicSlug &&
        l.slug !== excludeSlug &&
        !seen.has(l.slug) &&
        (l.bodySystem ?? "").trim().toLowerCase() === bsTrimCat.toLowerCase(),
    );
    catalogMerged = [...catalogPrimary, ...extra.slice(0, need)];
  }

  return catalogMerged
    .map((raw) =>
      applyOverlayAndStructural(
        withLocaleMeta(normalizeLesson(raw, pathwayId), catMeta),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      ),
    )
    .map((full) => stripPathwayLessonToHubListShape(full))
    .filter(pathwayLessonEligibleForPublicMarketingSurface)
    .filter(pathwayLessonHasRenderableHubSlug)
    .slice(0, cap);
}

async function getRelatedPathwayLessonsWithDataCache(
  pathwayId: string,
  topicSlug: string,
  excludeSlug: string,
  limit: number = RELATED_PATHWAY_LESSONS_LIMIT,
  marketingLocale?: string,
  relatedBackfillBodySystem?: string | null,
): Promise<PathwayLessonRecord[]> {
  return unstable_cache(
    async () =>
      getRelatedPathwayLessonsImpl(
        pathwayId,
        topicSlug,
        excludeSlug,
        limit,
        marketingLocale,
        relatedBackfillBodySystem,
      ),
    [
      "pathway-related",
      pathwayId,
      topicSlug,
      excludeSlug,
      String(limit),
      marketingLocale ?? "",
      relatedBackfillBodySystem?.trim().toLowerCase() ?? "",
    ],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [cacheTagPathwayLessonsHub(pathwayId)] },
  )();
}

export const getRelatedPathwayLessons = cache(getRelatedPathwayLessonsWithDataCache);

async function listPathwayIdsWithDbLessons(): Promise<string[]> {
  return dbCall(
    async () => {
      const groups = await prisma.pathwayLesson.groupBy({
        by: ["pathwayId"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      });
      return groups.map((g) => g.pathwayId);
    },
    [],
  );
}

/** Pathway IDs that have at least one lesson in DB or catalog (union). */
export async function listPathwayIdsWithLessons(): Promise<string[]> {
  const catalogIds = listCatalogPathwayIdsWithLessonsSync();
  const dbIds = await listPathwayIdsWithDbLessons();
  const merged = new Set([...catalogIds, ...dbIds]);
  return [...merged].sort((a, b) => a.localeCompare(b));
}

export type TopicCluster = { topicSlug: string; label: string; count: number };

/** Topic index from static catalog (used when DB is primary but DB topic aggregates are empty). */
function topicClustersFromCatalogPathway(pathwayId: string): TopicCluster[] {
  const raw = getCatalogLessonsRaw(pathwayId);
  const map = new Map<string, { label: string; count: number }>();
  for (const l of raw) {
    const topicSlug = typeof l.topicSlug === "string" ? l.topicSlug : "";
    if (!topicSlug) continue;
    const label = typeof l.topic === "string" ? l.topic : topicSlug;
    const cur = map.get(topicSlug) ?? { label, count: 0 };
    cur.count += 1;
    map.set(topicSlug, { label: cur.label, count: cur.count });
  }
  return [...map.entries()]
    .map(([topicSlug, v]) => ({ topicSlug, label: v.label, count: v.count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Topic index for a pathway — aggregates only (no full section bodies loaded). */
async function listTopicClustersImpl(pathwayId: string, marketingLocale?: string): Promise<TopicCluster[]> {
  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await effectiveLocaleForPathwayLessonDbRows(
      pathwayId,
      normalizePathwayLessonLocale(marketingLocale),
    );
    const groups = await dbCall(
      () =>
        prisma.pathwayLesson.groupBy({
          by: ["topicSlug"],
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            locale: effective,
            topicSlug: { not: "" },
          },
          _count: { _all: true },
        }),
      [],
    );
    if (groups.length === 0) {
      const catClusters = topicClustersFromCatalogPathway(pathwayId);
      if (catClusters.length > 0) {
        safeServerLog("pathway_lessons", "topic_index_catalog_supplement", {
          pathwayId,
          pathwayLessonRuntimeSource: "database",
          catalogTopicCount: catClusters.length,
        });
        return catClusters;
      }
      return [];
    }
    const slugList = groups.map((g) => g.topicSlug).filter(Boolean);
    const labelRows =
      slugList.length === 0
        ? []
        : await dbCall(
            () =>
              prisma.pathwayLesson.findMany({
                where: {
                  pathwayId,
                  status: ContentStatus.PUBLISHED,
                  locale: effective,
                  topicSlug: { in: slugList },
                },
                select: { topicSlug: true, topic: true },
                distinct: ["topicSlug"],
                take: takeForIdIn(slugList),
              }),
            [],
          );
    const labelBySlug = new Map(labelRows.map((r) => [r.topicSlug, r.topic]));
    return groups
      .map((g) => ({
        topicSlug: g.topicSlug,
        label: labelBySlug.get(g.topicSlug) ?? g.topicSlug,
        count: g._count._all,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  return topicClustersFromCatalogPathway(pathwayId);
}

async function listTopicClustersWithDataCache(pathwayId: string, marketingLocale?: string): Promise<TopicCluster[]> {
  return unstable_cache(
    async () => listTopicClustersImpl(pathwayId, marketingLocale),
    ["pathway-topic-clusters", pathwayId, marketingLocale ?? ""],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [cacheTagPathwayLessonsHub(pathwayId)] },
  )();
}

/** Dedupes topic index work when metadata + page both need clusters in one request. */
export const listTopicClusters = cache(listTopicClustersWithDataCache);

export type PathwayLessonSlugRow = { slug: string; topicSlug: string };

export type ListPathwayLessonSlugBatchOptions = {
  /**
   * When true, only lessons that pass {@link pathwayLessonEligibleForPublicMarketingSurface}
   * (DB: `structural_public_complete`) are returned. Required for `/sitemap.xml` so URLs match
   * marketing lesson routes that `notFound()` when the lesson is not publicly complete.
   */
  restrictToPublicMarketingSurface?: boolean;
};

/** Batched slug/topic reads for sitemaps — caller iterates until batch shorter than `batchSize`. */
export async function listPathwayLessonSlugBatch(
  pathwayId: string,
  skip: number,
  batchSize: number = PATHWAY_LESSON_SITEMAP_BATCH,
  contentLocale: string = PATHWAY_LESSON_SITEMAP_LOCALE,
  opts?: ListPathwayLessonSlugBatchOptions,
): Promise<PathwayLessonSlugRow[]> {
  const take = Math.min(2000, Math.max(1, Math.floor(batchSize)));
  const sk = Math.max(0, Math.floor(skip));
  const loc = normalizePathwayLessonLocale(contentLocale);
  const surfaceOnly = Boolean(opts?.restrictToPublicMarketingSurface);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (sk === 0) {
    const catN = getCatalogLessonsRaw(pathwayId).length;
    safeServerLog("pathway_lessons", "sitemap_batch_source", {
      pathwayId,
      locale: loc,
      pathwayLessonRuntimeSource: dbHas ? "database" : catN > 0 ? "catalog" : "none",
      restrictToPublicMarketingSurface: surfaceOnly,
    });
  }

  const lessonDbOverlays = await fetchPublishedLessonOverlaysForMarketingLocale(loc);

  if (dbHas) {
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            locale: loc,
            ...(surfaceOnly ? { structuralPublicComplete: true } : {}),
          },
          select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          skip: sk,
          take,
        }),
      [],
    );
    const meta = lessonLocaleMeta(undefined, loc, false, false);
    return rows
      .map((r) =>
        applyOverlayAndStructural(
          withLocaleMeta(normalizeLesson(pathwayLessonRowToInput(r), pathwayId), meta),
          undefined,
          pathwayId,
          lessonDbOverlays,
        ),
      )
      .map((l) => ({ slug: l.slug, topicSlug: l.topicSlug }));
  }

  const metaCat = lessonLocaleMeta(
    undefined,
    PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    loc !== PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    true,
  );
  const rawFull = getCatalogLessonsRaw(pathwayId).map((hit) =>
    applyOverlayAndStructural(
      withLocaleMeta(normalizeLesson(hit, pathwayId), metaCat),
      undefined,
      pathwayId,
      lessonDbOverlays,
    ),
  );
  const catalogForPaging = surfaceOnly ? rawFull.filter(pathwayLessonEligibleForPublicMarketingSurface) : rawFull;
  const raw = catalogForPaging.slice(sk, sk + take);
  return raw.map((l) => ({ slug: l.slug, topicSlug: l.topicSlug }));
}

/** Total lessons for pathway — count/sum only (audit, metrics). */
export async function countPathwayLessons(pathwayId: string): Promise<number> {
  return countPathwayLessonsDbOnly(pathwayId);
}

/** DB-only pathway lesson count (internal/admin/reporting semantics). */
export async function countPathwayLessonsDbOnly(pathwayId: string): Promise<number> {
  const dbState = await countPublishedDbLessonsAllLocalesWithHealth(pathwayId);
  if (dbState.unavailable) return 0;
  const dbN = dbState.count;
  if (dbN > 0) return dbN;
  return getCatalogLessonsRaw(pathwayId).length;
}

/**
 * Public-facing pathway lesson total for hubs/libraries.
 * Uses the same normalized marketing-hub pipeline as {@link getPathwayLessonsPage} (renderable lessons only).
 */
export async function countPathwayLessonsPublic(
  pathwayId: string,
  marketingLocale?: string,
): Promise<number> {
  const { renderableAll } = await resolveMarketingHubRenderableLessonList(pathwayId, marketingLocale, undefined);
  return renderableAll.length;
}

/** Same warehouse locale as hub SQL lists — use as verify fallback when hub rows omit `localeMeta.contentLocale`. */
export { effectiveLocaleForPathwayLessonDbRows as getPathwayLessonListWarehouseLocaleForHub };
