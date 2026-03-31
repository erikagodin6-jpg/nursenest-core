import catalog from "@/content/pathway-lessons/catalog.json";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { normalizePathwayLessonLocale, PATHWAY_LESSON_SITEMAP_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import type {
  PathwayLessonLocaleMeta,
  PathwayLessonQuizItem,
  PathwayLessonRecord,
  PathwayLessonSection,
  PathwayLessonSectionKind,
} from "@/lib/lessons/pathway-lesson-types";
import { ContentStatus } from "@prisma/client";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type CatalogShape = {
  version: number;
  pathways: Record<
    string,
    {
      lessons: Array<{
        slug: string;
        title: string;
        topic: string;
        topicSlug: string;
        bodySystem: string;
        previewSectionCount: number;
        seoTitle: string;
        seoDescription: string;
        sections: PathwayLessonRecord["sections"];
        preTest?: PathwayLessonQuizItem[];
        postTest?: PathwayLessonQuizItem[];
      }>;
    }
  >;
};

const data = catalog as CatalogShape;

type LessonInput = CatalogShape["pathways"][string]["lessons"][number];

/** Default page size for pathway lesson hubs (safe render + memory). */
export const PATHWAY_HUB_PAGE_SIZE_DEFAULT = 40;
/** Hard cap per hub request — larger values need cursor-based pagination later. */
export const PATHWAY_HUB_PAGE_SIZE_MAX = 60;
/** DB read timeout for pathway lesson queries (marketing paths). */
export const PATHWAY_LESSON_DB_TIMEOUT_MS = 12_000;
/** Related lessons block on lesson detail — small bounded list. */
export const RELATED_PATHWAY_LESSONS_LIMIT = 8;
/** Sitemap / batch reads: rows per round-trip. */
export const PATHWAY_LESSON_SITEMAP_BATCH = 600;
/** Absolute safety cap: catalog pathways with more lessons are truncated for list/hub pagination math. */
export const PATHWAY_CATALOG_LIST_HARD_CAP = 2_000;

const CANONICAL_ORDER: PathwayLessonSectionKind[] = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
];

function hasAllCanonicalKinds(sections: PathwayLessonSection[]): boolean {
  return CANONICAL_ORDER.every((k) => sections.some((s) => s.kind === k));
}

function sanitizeSectionBody(body: unknown): string {
  if (typeof body !== "string") return "";
  return body.trim();
}

function sanitizeSection(raw: Partial<PathwayLessonSection>, index: number): PathwayLessonSection {
  const kind = (raw.kind ?? "intro") as PathwayLessonSectionKind;
  const heading = typeof raw.heading === "string" && raw.heading.trim().length > 0 ? raw.heading.trim() : "Section";
  const id = typeof raw.id === "string" && raw.id.trim().length > 0 ? raw.id : `${kind}-${index}`;
  return {
    id,
    heading,
    kind,
    body: sanitizeSectionBody(raw.body),
  };
}

function sanitizeIncomingSections(sections: unknown): PathwayLessonSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((s, i) => sanitizeSection(s as Partial<PathwayLessonSection>, i));
}

function expandToStandardFiveSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const cleaned = sanitizeIncomingSections(sections);

  if (cleaned.length >= 5 && hasAllCanonicalKinds(cleaned)) {
    const ordered = CANONICAL_ORDER.map((k) => cleaned.find((s) => s.kind === k)).filter(
      (s): s is PathwayLessonSection => Boolean(s),
    );
    if (ordered.length === 5) {
      return ordered.map((s) => ({
        ...s,
        body: s.body || defaultBodyFor(s.kind),
      }));
    }
  }

  const byKind = Object.fromEntries(cleaned.map((s) => [s.kind, s])) as Partial<
    Record<PathwayLessonSectionKind, PathwayLessonSection>
  >;

  const intro = byKind.intro ?? byKind.clinical_meaning;
  const core = byKind.core ?? byKind.core_concept;
  const clinical = byKind.clinical_application ?? byKind.clinical_scenario;
  const exam = byKind.exam_tips ?? byKind.exam_relevance;
  const explicitTakeaways = byKind.takeaways;

  const examBody = (exam?.body ?? "").trim();
  const sentences = examBody.split(/(?<=[.!?])\s+/).filter(Boolean);
  const examRelevanceBody =
    sentences.length > 1
      ? sentences.slice(0, Math.min(2, sentences.length)).join(" ")
      : examBody.length > 0
        ? `${examBody} Boards reward judgment, pacing, and elimination over memorizing isolated facts.`
        : "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";

  const takeawaysBody =
    explicitTakeaways?.body?.trim() ||
    (sentences.length > 2
      ? sentences.slice(2).join(" ")
      : "Before your next question block, restate one rule you will not violate on prioritization or scope.");

  return [
    {
      id: "clinical_meaning",
      heading: "What this means clinically",
      kind: "clinical_meaning",
      body:
        intro?.body?.trim() ||
        "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.",
    },
    {
      id: "exam_relevance",
      heading: "Why this appears on exams",
      kind: "exam_relevance",
      body: examRelevanceBody,
    },
    {
      id: "core_concept",
      heading: "Core concept explanation",
      kind: "core_concept",
      body:
        core?.body?.trim() ||
        "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.",
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario example",
      kind: "clinical_scenario",
      body:
        clinical?.body?.trim() ||
        "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.",
    },
    {
      id: "takeaways",
      heading: "Key takeaways",
      kind: "takeaways",
      body: takeawaysBody,
    },
  ];
}

function defaultBodyFor(kind: PathwayLessonSectionKind): string {
  switch (kind) {
    case "clinical_meaning":
      return "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.";
    case "exam_relevance":
      return "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";
    case "core_concept":
      return "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.";
    case "clinical_scenario":
      return "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.";
    case "takeaways":
      return "Before your next question block, restate one rule you will not violate on prioritization or scope.";
    default:
      return "";
  }
}

/**
 * Hub / list / related-link rows: metadata only — no `sections` JSON loaded from DB.
 * Enrichment (FNP, NCLEX hubs) falls back to {@link PathwayLessonRecord.seoDescription} when bodies are absent.
 */
function normalizeLessonForHubList(raw: LessonInput): PathwayLessonRecord {
  const title = typeof raw.title === "string" ? raw.title : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = typeof raw.seoDescription === "string" ? raw.seoDescription : "";
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;
  const previewSectionCount = Math.max(1, Math.min(previewCandidate, 5));
  return {
    slug: raw.slug,
    title,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    bodySystem: typeof raw.bodySystem === "string" ? raw.bodySystem : "",
    previewSectionCount,
    seoTitle,
    seoDescription,
    sections: [],
  };
}

export function sanitizeQuizItems(raw: unknown): PathwayLessonQuizItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonQuizItem[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const options = Array.isArray(o.options)
      ? o.options.filter((y): y is string => typeof y === "string" && y.trim().length > 0)
      : [];
    const correct = typeof o.correct === "number" && Number.isInteger(o.correct) ? o.correct : -1;
    if (question.length < 5 || options.length < 2 || correct < 0 || correct >= options.length) continue;
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : undefined;
    out.push({ question, options, correct, ...(rationale ? { rationale } : {}) });
  }
  return out.length ? out : undefined;
}

function normalizeLesson(raw: LessonInput): PathwayLessonRecord {
  const title = typeof raw.title === "string" ? raw.title : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = typeof raw.seoDescription === "string" ? raw.seoDescription : "";
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;

  const base: PathwayLessonRecord = {
    slug: raw.slug,
    title,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    bodySystem: typeof raw.bodySystem === "string" ? raw.bodySystem : "",
    previewSectionCount: Math.max(1, Math.min(previewCandidate, 5)),
    seoTitle,
    seoDescription,
    sections: raw.sections as PathwayLessonRecord["sections"],
  };
  const expanded = expandToStandardFiveSections(base.sections as PathwayLessonSection[]);
  const maxPreview = Math.min(expanded.length, 5);
  const preview = Math.max(1, Math.min(base.previewSectionCount, maxPreview || 1));
  const preTest = sanitizeQuizItems((raw as { preTest?: unknown }).preTest);
  const postTest = sanitizeQuizItems((raw as { postTest?: unknown }).postTest);
  return {
    ...base,
    sections: expanded,
    previewSectionCount: preview,
    ...(preTest ? { preTest } : {}),
    ...(postTest ? { postTest } : {}),
  };
}

function listCatalogPathwayIdsWithLessonsSync(): string[] {
  return Object.keys(data.pathways).filter((id) => (data.pathways[id]?.lessons?.length ?? 0) > 0);
}

function filterCatalogLessonsByTopicSlugs(raw: LessonInput[], topicSlugsIn?: string[]): LessonInput[] {
  if (!topicSlugsIn) return raw;
  if (topicSlugsIn.length === 0) return [];
  const set = new Set(topicSlugsIn);
  return raw.filter((l) => set.has(l.topicSlug));
}

function getCatalogLessonsRaw(pathwayId: string): LessonInput[] {
  const bucket = data.pathways[pathwayId];
  if (!bucket?.lessons?.length) return [];
  return bucket.lessons.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP);
}

function getCatalogPathwayLessonsSync(pathwayId: string): PathwayLessonRecord[] {
  return getCatalogLessonsRaw(pathwayId).map(normalizeLesson);
}

export type PathwayLessonRuntimeSource = "database" | "catalog" | "none";

function pathwayLessonRowToInput(row: {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: unknown;
  locale: string;
}): LessonInput {
  return {
    slug: row.slug,
    title: row.title,
    topic: row.topic,
    topicSlug: row.topicSlug,
    bodySystem: row.bodySystem,
    previewSectionCount: row.previewSectionCount,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    sections: row.sections as LessonInput["sections"],
  };
}

function withLocaleMeta(lesson: PathwayLessonRecord, meta: PathwayLessonLocaleMeta): PathwayLessonRecord {
  return { ...lesson, localeMeta: meta };
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

async function dbCall<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, PATHWAY_LESSON_DB_TIMEOUT_MS);
}

/** Any published row for pathway (any locale). */
async function pathwayHasPublishedDbLessons(pathwayId: string): Promise<boolean> {
  const row = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, status: ContentStatus.PUBLISHED },
        select: { id: true },
      }),
    null,
  );
  return !!row;
}

/** Count published rows for pathway in one locale (bounded index). Optional topic filter for allied / scoped hubs. */
async function countPublishedDbLessonsForPathwayLocale(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
): Promise<number> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return 0;
  return dbCall(
    () =>
      prisma.pathwayLesson.count({
        where: {
          pathwayId,
          status: ContentStatus.PUBLISHED,
          locale,
          ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
        },
      }),
    0,
  );
}

/** Total published rows for pathway across locales (audit / metrics). */
async function countPublishedDbLessonsAllLocales(pathwayId: string): Promise<number> {
  return dbCall(
    () => prisma.pathwayLesson.count({ where: { pathwayId, status: ContentStatus.PUBLISHED } }),
    0,
  );
}

/**
 * Pick which `locale` key to query for list/topic pages — one `groupBy` per request.
 * Prefers requested locale when present, else English, else first available.
 */
async function resolveEffectiveListLocale(pathwayId: string, requestedRaw: string): Promise<string> {
  const requested = normalizePathwayLessonLocale(requestedRaw);
  const rows = await dbCall(
    () =>
      prisma.pathwayLesson.groupBy({
        by: ["locale"],
        where: { pathwayId, status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      }),
    [],
  );
  if (rows.length === 0) return requested;
  const available = new Set(rows.map((r) => r.locale));
  if (available.has(requested)) return requested;
  if (requested !== "en" && available.has("en")) return "en";
  const sorted = [...available].sort((a, b) => a.localeCompare(b));
  return sorted[0] ?? "en";
}

const PATHWAY_LESSON_HUB_LIST_SELECT = {
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  locale: true,
} as const;

async function loadPublishedLessonRowsPage(
  pathwayId: string,
  locale: string,
  skip: number,
  take: number,
  topicSlugsIn?: string[],
): Promise<LessonInput[]> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return [];
  return dbCall(async () => {
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId,
        status: ContentStatus.PUBLISHED,
        locale,
        ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      skip,
      take,
      select: PATHWAY_LESSON_HUB_LIST_SELECT,
    });
    return rows.map((row) =>
      pathwayLessonRowToInput({
        ...row,
        sections: [],
      }),
    );
  }, []);
}

export type PathwayLessonListLocaleInfo = {
  requested: string;
  effective: string;
  usedEnglishFallback: boolean;
  catalogEnglishOnlySource: boolean;
};

export type PathwayLessonsPageResult = {
  items: PathwayLessonRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  locale?: PathwayLessonListLocaleInfo;
};

function clampPageSize(pageSize: number): number {
  return Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(1, Math.floor(pageSize)));
}

function clampPage(page: number): number {
  return Math.max(1, Math.floor(page));
}

/**
 * Paginated lessons for hub rendering — never loads the full pathway in one query.
 * Catalog fallback uses a capped in-memory slice (see PATHWAY_CATALOG_LIST_HARD_CAP).
 *
 * @param marketingLocale Requested **lesson content** locale (BCP-47 base), not the exam URL country segment.
 * @param listOptions.topicSlugsIn When set, restrict to these topic slugs (empty array = no matches). Omit for full pathway.
 */
export async function getPathwayLessonsPage(
  pathwayId: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[] },
): Promise<PathwayLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = clampPage(page);
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const topicSlugsIn = listOptions?.topicSlugsIn;

  const dbAny = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbAny) {
    const t0 = performance.now();
    const effective = await resolveEffectiveListLocale(pathwayId, requested);
    const total = await countPublishedDbLessonsForPathwayLocale(pathwayId, effective, topicSlugsIn);
    const pageCount = total === 0 ? 1 : Math.max(1, Math.ceil(total / ps));
    const safePage = total === 0 ? 1 : Math.min(p, pageCount);
    const skip = (safePage - 1) * ps;
    const raw = await loadPublishedLessonRowsPage(pathwayId, effective, skip, ps, topicSlugsIn);
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("pathway_lessons", "hub_list_db_timing", {
      pathwayId,
      pathwayLessonRuntimeSource: "database",
      durationMs,
      page: safePage,
      pageSize: ps,
      total,
    });
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    return {
      items: raw.map((row) => withLocaleMeta(normalizeLessonForHubList(row), meta)),
      total,
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

  const allRaw = filterCatalogLessonsByTopicSlugs(getCatalogLessonsRaw(pathwayId), topicSlugsIn);
  const total = allRaw.length;
  const pageCount = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, pageCount);
  const skip = (safePage - 1) * ps;
  const slice = allRaw.slice(skip, skip + ps);
  safeServerLog("pathway_lessons", "hub_list_source", {
    pathwayId,
    pathwayLessonRuntimeSource: total > 0 ? "catalog" : "none",
    total,
    page: safePage,
    pageSize: ps,
  });
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  return {
    items: slice.map((row) => withLocaleMeta(normalizeLesson(row), catMeta)),
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

export type TopicLessonsPageResult = PathwayLessonsPageResult;

/** Topic cluster page — bounded page through lessons in one topic slug. */
export async function getLessonsForTopicPage(
  pathwayId: string,
  topicSlug: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
): Promise<TopicLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = clampPage(page);
  const requested = normalizePathwayLessonLocale(marketingLocale);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const t0 = performance.now();
    const effective = await resolveEffectiveListLocale(pathwayId, requested);
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
        const pageCountCat = Math.max(1, Math.ceil(catMatched.length / ps));
        const safePageCat = Math.min(p, pageCountCat);
        const skipCat = (safePageCat - 1) * ps;
        const sliceCat = catMatched.slice(skipCat, skipCat + ps);
        const metaCat = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
        const durationMs = Math.round(performance.now() - t0);
        safeServerLog("pathway_lessons", "topic_list_db_timing", {
          pathwayId,
          topicSlug,
          pathwayLessonRuntimeSource: "database",
          durationMs,
          page: safePageCat,
          pageSize: ps,
          total: catMatched.length,
          catalogSupplement: true,
        });
        return {
          items: sliceCat.map((row) => withLocaleMeta(normalizeLesson(row), metaCat)),
          total: catMatched.length,
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
    const pageCount = Math.max(1, Math.ceil(total / ps));
    const safePage = Math.min(p, pageCount);
    const skip = (safePage - 1) * ps;
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug, locale: effective },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          skip,
          take: ps,
          select: PATHWAY_LESSON_HUB_LIST_SELECT,
        }),
      [],
    );
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("pathway_lessons", "topic_list_db_timing", {
      pathwayId,
      topicSlug,
      pathwayLessonRuntimeSource: "database",
      durationMs,
      page: safePage,
      pageSize: ps,
      total,
    });
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    return {
      items: rows.map((r) =>
        withLocaleMeta(normalizeLessonForHubList(pathwayLessonRowToInput({ ...r, sections: [] })), meta),
      ),
      total,
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
  const total = matched.length;
  const pageCount = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, pageCount);
  const skip = (safePage - 1) * ps;
  const slice = matched.slice(skip, skip + ps);
  safeServerLog("pathway_lessons", "topic_list_source", {
    pathwayId,
    topicSlug,
    pathwayLessonRuntimeSource: total > 0 ? "catalog" : "none",
    total,
    page: safePage,
    pageSize: ps,
  });
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  return {
    items: slice.map((row) => withLocaleMeta(normalizeLesson(row), catMeta)),
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

/** Single lesson by slug — one targeted DB fetch (requested locale, then English fallback). */
export async function getPathwayLesson(
  pathwayId: string,
  slug: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  const requested = normalizePathwayLessonLocale(marketingLocale);

  const rowRequested = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: { pathwayId, slug, locale: requested },
        },
      }),
    null,
  );
  if (rowRequested && rowRequested.status === ContentStatus.PUBLISHED) {
    return withLocaleMeta(
      normalizeLesson(pathwayLessonRowToInput(rowRequested)),
      lessonLocaleMeta(marketingLocale, requested, false, false),
    );
  }

  if (requested !== "en") {
    const rowEn = await dbCall(
      () =>
        prisma.pathwayLesson.findUnique({
          where: {
            pathwayId_slug_locale: { pathwayId, slug, locale: "en" },
          },
        }),
      null,
    );
    if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
      return withLocaleMeta(
        normalizeLesson(pathwayLessonRowToInput(rowEn)),
        lessonLocaleMeta(marketingLocale, "en", true, false),
      );
    }
  }

  const dbHasAny = await pathwayHasPublishedDbLessons(pathwayId);
  const hit = getCatalogLessonsRaw(pathwayId).find((l) => l.slug === slug);
  if (!hit) return undefined;
  if (dbHasAny) {
    safeServerLog("pathway_lessons", "lesson_detail_catalog_supplement", {
      pathwayId,
      slug,
      pathwayLessonRuntimeSource: "database",
    });
  }
  return withLocaleMeta(
    normalizeLesson(hit),
    lessonLocaleMeta(marketingLocale, "en", requested !== "en", true),
  );
}

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
    return normalizeLesson(pathwayLessonRowToInput(rowEn));
  }
  const rowAny = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        orderBy: [{ locale: "asc" }],
      }),
    null,
  );
  if (rowAny) return normalizeLesson(pathwayLessonRowToInput(rowAny));
  const hit = getCatalogLessonsRaw(pathwayId).find((l) => l.slug === slug);
  return hit ? normalizeLesson(hit) : undefined;
}

/**
 * App shell `/app/lessons/[id]`: load a published DB row by primary key (no catalog fallback).
 * Callers must enforce access with {@link appPathwayLessonVisibleToSubscriber}.
 */
export async function getPublishedPathwayLessonRecordById(id: string): Promise<PathwayLessonRecord | undefined> {
  const row = await dbCall(() => prisma.pathwayLesson.findUnique({ where: { id } }), null);
  if (!row || row.status !== ContentStatus.PUBLISHED) return undefined;
  return normalizeLesson(pathwayLessonRowToInput(row));
}

/** Related lessons (same topic) for detail page — capped list, bounded query on DB. */
export async function getRelatedPathwayLessons(
  pathwayId: string,
  topicSlug: string,
  excludeSlug: string,
  limit: number = RELATED_PATHWAY_LESSONS_LIMIT,
  marketingLocale?: string,
): Promise<PathwayLessonRecord[]> {
  const cap = Math.min(24, Math.max(1, Math.floor(limit)));
  const requested = normalizePathwayLessonLocale(marketingLocale);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await resolveEffectiveListLocale(pathwayId, requested);
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            topicSlug,
            locale: effective,
            slug: { not: excludeSlug },
          },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          take: cap,
          select: PATHWAY_LESSON_HUB_LIST_SELECT,
        }),
      [],
    );
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    return rows.map((r) =>
      withLocaleMeta(normalizeLessonForHubList(pathwayLessonRowToInput({ ...r, sections: [] })), meta),
    );
  }

  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  return getCatalogPathwayLessonsSync(pathwayId)
    .filter((l) => l.topicSlug === topicSlug && l.slug !== excludeSlug)
    .slice(0, cap)
    .map((l) => withLocaleMeta(l, catMeta));
}

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
  const lessons = getCatalogPathwayLessonsSync(pathwayId);
  const map = new Map<string, { label: string; count: number }>();
  for (const l of lessons) {
    const cur = map.get(l.topicSlug) ?? { label: l.topic, count: 0 };
    cur.count += 1;
    map.set(l.topicSlug, { label: l.topic, count: cur.count });
  }
  return [...map.entries()]
    .map(([topicSlug, v]) => ({ topicSlug, label: v.label, count: v.count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Topic index for a pathway — aggregates only (no full section bodies loaded). */
export async function listTopicClusters(pathwayId: string, marketingLocale?: string): Promise<TopicCluster[]> {
  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await resolveEffectiveListLocale(pathwayId, normalizePathwayLessonLocale(marketingLocale));
    const groups = await dbCall(
      () =>
        prisma.pathwayLesson.groupBy({
          by: ["topicSlug"],
          where: { pathwayId, status: ContentStatus.PUBLISHED, locale: effective },
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
    const slugs = groups.map((g) => g.topicSlug);
    const labelRows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, locale: effective, topicSlug: { in: slugs } },
          distinct: ["topicSlug"],
          select: { topicSlug: true, topic: true },
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

export type PathwayLessonSlugRow = { slug: string; topicSlug: string };

/** Batched slug/topic reads for sitemaps — caller iterates until batch shorter than `batchSize`. */
export async function listPathwayLessonSlugBatch(
  pathwayId: string,
  skip: number,
  batchSize: number = PATHWAY_LESSON_SITEMAP_BATCH,
  contentLocale: string = PATHWAY_LESSON_SITEMAP_LOCALE,
): Promise<PathwayLessonSlugRow[]> {
  const take = Math.min(2000, Math.max(1, Math.floor(batchSize)));
  const sk = Math.max(0, Math.floor(skip));
  const loc = normalizePathwayLessonLocale(contentLocale);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (sk === 0) {
    const catN = getCatalogLessonsRaw(pathwayId).length;
    safeServerLog("pathway_lessons", "sitemap_batch_source", {
      pathwayId,
      locale: loc,
      pathwayLessonRuntimeSource: dbHas ? "database" : catN > 0 ? "catalog" : "none",
    });
  }
  if (dbHas) {
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, locale: loc },
          select: { slug: true, topicSlug: true },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          skip: sk,
          take,
        }),
      [],
    );
    return rows;
  }

  const raw = getCatalogLessonsRaw(pathwayId).slice(sk, sk + take);
  return raw.map((l) => ({ slug: l.slug, topicSlug: l.topicSlug }));
}

/** Total lessons for pathway — count/sum only (audit, metrics). */
export async function countPathwayLessons(pathwayId: string): Promise<number> {
  const dbN = await countPublishedDbLessonsAllLocales(pathwayId);
  if (dbN > 0) return dbN;
  return getCatalogLessonsRaw(pathwayId).length;
}
