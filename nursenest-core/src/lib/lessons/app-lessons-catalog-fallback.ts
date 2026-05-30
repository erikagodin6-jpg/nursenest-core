import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { getEffectiveCatalogLessonsForPathwaySync, getLessonBySlug } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { exclusiveTopicSlugsForAlliedProfession } from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

export const APP_LESSON_CATALOG_FALLBACK_ID_PREFIX = "catalog";

export type AppLessonCatalogFallbackRow = {
  id: string;
  title: string;
  summary: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  bodySystem?: string | null;
  pathwayMeta: { pathwayId: string; slug: string };
};

export type AppLessonCatalogFallbackBlock = {
  source: "pathway_lessons";
  total: number;
  page: number;
  pageCount: number;
  rows: AppLessonCatalogFallbackRow[];
};

export function appLessonCatalogFallbackId(pathwayId: string, slug: string): string {
  return `${APP_LESSON_CATALOG_FALLBACK_ID_PREFIX}:${pathwayId}:${slug}`;
}

export function parseAppLessonCatalogFallbackId(
  id: string,
): { pathwayId: string; slug: string } | null {
  const trimmed = id.trim();
  const prefix = `${APP_LESSON_CATALOG_FALLBACK_ID_PREFIX}:`;
  if (!trimmed.startsWith(prefix)) return null;
  const rest = trimmed.slice(prefix.length);
  const colon = rest.indexOf(":");
  if (colon <= 0) return null;
  const pathwayId = rest.slice(0, colon).trim();
  const slug = rest.slice(colon + 1).trim();
  if (!pathwayId || !slug) return null;
  return { pathwayId, slug };
}

function pathwayLessonCardSummary(row: {
  seoDescription: string;
  topic: string;
  bodySystem: string;
}): string | null {
  const d = row.seoDescription?.trim();
  if (d) return d.length > 220 ? `${d.slice(0, 217)}...` : d;
  const parts = [row.topic?.trim(), row.bodySystem?.trim()].filter(Boolean);
  return parts.length ? parts.join(" / ") : null;
}

function lessonMatchesFilters(
  lesson: PathwayLessonRecord,
  args: {
    qEffective: string | null;
    topicSlugFilter: string | null;
    topicFilter: string | null;
  },
): boolean {
  const topicSlug = args.topicSlugFilter?.trim().toLowerCase();
  if (topicSlug && lesson.topicSlug?.trim().toLowerCase() !== topicSlug) return false;

  const topic = args.topicFilter?.trim().toLowerCase();
  if (topic && lesson.topic?.trim().toLowerCase() !== topic) return false;

  const q = args.qEffective?.trim().toLowerCase();
  if (q) {
    const haystack = [
      lesson.title,
      lesson.topic,
      lesson.bodySystem,
      lesson.slug,
      lesson.seoTitle,
      lesson.seoDescription,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  return true;
}

function lessonsForVisiblePathways(args: {
  visiblePathwayIds: readonly string[];
  pathwayIdFilter: string | null;
  learnerPath: string | null;
  alliedProfessionKey?: string | null;
}): Array<{ pathwayId: string; lesson: PathwayLessonRecord }> {
  const preferred = args.pathwayIdFilter?.trim() || args.learnerPath?.trim() || "";
  const requested = args.pathwayIdFilter?.trim();
  const pathwayIds = requested
    ? args.visiblePathwayIds.includes(requested)
      ? [requested]
      : []
    : [
        ...(preferred && args.visiblePathwayIds.includes(preferred) ? [preferred] : []),
        ...args.visiblePathwayIds.filter((id) => id !== preferred),
      ];
  const out: Array<{ pathwayId: string; lesson: PathwayLessonRecord }> = [];

  for (const pathwayId of pathwayIds) {
    const allied = args.alliedProfessionKey?.trim().toLowerCase();
    let allowedTopicSlugs: Set<string> | null = null;
    if (allied && isAlliedMarketingCorePathwayId(pathwayId)) {
      const owned = exclusiveTopicSlugsForAlliedProfession(pathwayId, allied);
      allowedTopicSlugs = owned.length ? new Set(owned) : new Set();
    }

    for (const lesson of getEffectiveCatalogLessonsForPathwaySync(pathwayId)) {
      if (allowedTopicSlugs && !allowedTopicSlugs.has(lesson.topicSlug)) continue;
      out.push({ pathwayId, lesson });
    }
  }

  return out;
}

export function buildAppLessonsCatalogFallbackBlock(args: {
  visiblePathwayIds: readonly string[];
  pathwayIdFilter: string | null;
  learnerPath: string | null;
  qEffective: string | null;
  topicSlugFilter: string | null;
  topicFilter: string | null;
  alliedProfessionKey?: string | null;
  pageRequested: number;
  pageSize: number;
}): AppLessonCatalogFallbackBlock | null {
  const rows = lessonsForVisiblePathways(args)
    .filter(({ lesson }) => lessonMatchesFilters(lesson, args))
    .map(({ pathwayId, lesson }) => ({
      id: appLessonCatalogFallbackId(pathwayId, lesson.slug),
      title: lesson.title,
      summary: pathwayLessonCardSummary({
        seoDescription: lesson.seoDescription ?? "",
        topic: lesson.topic ?? "",
        bodySystem: lesson.bodySystem ?? "",
      }),
      topic: lesson.topic ?? null,
      topicSlug: lesson.topicSlug ?? null,
      bodySystem: lesson.bodySystem ?? null,
      pathwayMeta: { pathwayId, slug: lesson.slug },
    }));

  if (rows.length === 0) return null;

  const pageSize = Math.max(1, args.pageSize);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(Math.max(1, args.pageRequested), pageCount);
  const start = (page - 1) * pageSize;

  return {
    source: "pathway_lessons",
    total: rows.length,
    page,
    pageCount,
    rows: rows.slice(start, start + pageSize),
  };
}

export function getAppCatalogFallbackLesson(
  pathwayId: string,
  slug: string,
): PathwayLessonRecord | null {
  return getLessonBySlug(pathwayId, slug) ?? null;
}
