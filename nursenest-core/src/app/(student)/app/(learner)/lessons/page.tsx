import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { maxSafeOffsetPage, parseLessonLibraryLimit } from "@/lib/api/api-pagination-limits";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import {
  pathwayLessonsAppListWhere,
  pathwayLessonsAppListWhereWithTopicFilter,
  visiblePathwayIdsForAppLessons,
} from "@/lib/lessons/app-pathway-lesson-list-scope";
import { paginateLegacyContentMapLessons } from "@/lib/lessons/legacy-content-map-lessons";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { FreemiumCrossTrackNudge } from "@/components/student/freemium-cross-track-nudge";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { FreemiumLessonPeek } from "@/components/student/freemium-lesson-peek";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT } from "@/lib/lessons/pathway-lesson-scale";
import { LearnerLessonsVirtualList } from "@/components/student/learner-lessons-virtual-list";
import { LearnerLessonsSearchToolbar } from "@/components/student/learner-lessons-search-toolbar";
import {
  loadPathwayLessonProgressMap,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { freemiumLessonsExhausted, freemiumQuestionsExhausted } from "@/lib/conversion/freemium-gates";

type AppLessonListRow = {
  id: string;
  title: string;
  summary: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  /** Present for `pathway_lessons` rows — used for hub-style progress + chips. */
  pathwayMeta?: { pathwayId: string; slug: string };
};

type LessonsListBlock = {
  source: "content_items" | "pathway_lessons" | "legacy_content_map";
  total: number;
  page: number;
  pageCount: number;
  rows: AppLessonListRow[];
};

function pathwayLessonCardSummary(row: {
  seoDescription: string;
  topic: string;
  bodySystem: string;
}): string | null {
  const d = row.seoDescription?.trim();
  if (d) return d.length > 220 ? `${d.slice(0, 217)}…` : d;
  const parts = [row.topic?.trim(), row.bodySystem?.trim()].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function pathwayLessonSafetyGateWhere() {
  return {
    AND: [
      { title: { not: "" } },
      { slug: { not: "" } },
      { topic: { not: "" } },
      { topicSlug: { not: "" } },
      { previewSectionCount: { gt: 0 } },
      {
        OR: [{ seoDescription: { not: "" } }, { seoTitle: { not: "" } }],
      },
      {
        NOT: [
          { title: { contains: "placeholder", mode: "insensitive" as const } },
          { title: { contains: "tbd", mode: "insensitive" as const } },
          { slug: { startsWith: "tmp-" } },
          { slug: { startsWith: "draft-" } },
        ],
      },
    ],
  };
}

type Props = {
  searchParams: Promise<{
    page?: string;
    topic?: string;
    topicSlug?: string;
    pathwayId?: string;
    limit?: string;
    q?: string;
  }>;
};

function appLessonsListQuery(
  page: number,
  topic: string | null,
  topicSlug: string | null,
  pathwayId: string | null,
  q: string | null,
  limit: number,
): string {
  const qs = new URLSearchParams();
  if (page > 1) qs.set("page", String(page));
  const ts = topicSlug?.trim().toLowerCase();
  if (ts) qs.set("topicSlug", ts);
  else if (topic?.trim()) qs.set("topic", topic.trim());
  if (pathwayId?.trim()) qs.set("pathwayId", pathwayId.trim());
  const qt = q?.trim();
  if (qt) qs.set("q", qt);
  if (limit !== LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT) qs.set("limit", String(limit));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.lessons.list.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/lessons", routeGroup: "student.learner.lessons" },
  );
}

export default async function LessonsPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <p className="nn-card p-6 text-sm text-muted">
        {t("learner.entitlement.verifyFailed")}
      </p>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div>
        <h1 className="text-3xl font-bold">{t("learner.lessons.list.title")}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("learner.lessons.list.freemiumLead")}{" "}
          <Link className="font-medium text-primary underline" href="/lessons">
            {t("learner.lessons.list.freemiumLink")}
          </Link>{" "}
          {t("learner.lessons.list.freemiumTail")}
        </p>
        {userId && snap && !freemiumLessonsExhausted(snap) ? (
          <div className="mt-6">
            <FreemiumLessonPeek />
          </div>
        ) : null}
        <div className="mt-6">
          <SubscriptionPaywall
            context="lessons"
            freemiumRemainingLessons={snap != null ? snap.lessonRemaining : undefined}
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
          />
        </div>
        {userId && snap && freemiumQuestionsExhausted(snap) && !freemiumLessonsExhausted(snap) ? (
          <FreemiumCrossTrackNudge variant="questions_exhausted" />
        ) : null}
        {userId && snap && freemiumLessonsExhausted(snap) ? <FreemiumPreviewExhaustedSurface kind="lessons" /> : null}
      </div>
    );
  }

  const sp = await searchParams;
  const limitParsed = parseLessonLibraryLimit(typeof sp.limit === "string" ? sp.limit : undefined);
  const qEffective =
    typeof sp.q === "string" && sp.q.trim().length > 0 ? sp.q.trim() : null;
  const rawPage = Math.max(1, Number(sp.page ?? "1") || 1);
  const maxOffsetPage = maxSafeOffsetPage(limitParsed);
  const pageRequested = Math.min(rawPage, maxOffsetPage);
  const topicSlugFilter =
    typeof sp.topicSlug === "string" && sp.topicSlug.trim().length > 0 ? sp.topicSlug.trim().toLowerCase() : null;
  const topicFilter =
    !topicSlugFilter && typeof sp.topic === "string" && sp.topic.trim().length > 0 ? sp.topic.trim() : null;
  const pathwayIdFilter =
    typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 0 ? sp.pathwayId.trim() : null;
  const learnerPathRow = await withDatabaseFallback(
    async () => (userId ? prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } }) : null),
    null,
  );
  const learnerPath = learnerPathRow?.learnerPath ?? null;
  const visiblePathwayIds = visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  const catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: pathwayIdFilter ?? learnerPath,
    availablePathwayIds: visiblePathwayIds,
    intent: "start",
  });

  const lessonsBlockFromDb = await withDatabaseFallback(async () => {
    const contentWhere = lessonAccessWhere(entitlement);
    const contentFilters: typeof contentWhere[] = [];
    if (topicFilter || topicSlugFilter) {
      const term = (topicSlugFilter ?? topicFilter ?? "").trim();
      if (term.length > 0) {
        contentFilters.push({
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { bodySystem: { contains: term, mode: "insensitive" } },
            { category: { contains: term, mode: "insensitive" } },
          ],
        });
      }
    }
    if (qEffective) {
      contentFilters.push({
        OR: [
          { title: { contains: qEffective, mode: "insensitive" } },
          { bodySystem: { contains: qEffective, mode: "insensitive" } },
          { category: { contains: qEffective, mode: "insensitive" } },
        ],
      });
    }
    const contentScopedWhere =
      contentFilters.length > 0
        ? {
            AND: [contentWhere, ...contentFilters],
          }
        : contentWhere;
    const contentTotal = await prisma.contentItem.count({ where: contentScopedWhere });

    // Route scoped pathway lessons first whenever pathway-specific filters are active.
    if (contentTotal > 0 && !pathwayIdFilter) {
      const pageCount = Math.max(1, Math.ceil(contentTotal / limitParsed) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const rowsRaw = await prisma.contentItem.findMany({
        where: contentScopedWhere,
        select: { id: true, title: true, summary: true },
        orderBy: { updatedAt: "desc" },
        skip: (safePage - 1) * limitParsed,
        take: limitParsed,
      });
      const rows: AppLessonListRow[] = rowsRaw.map((r) => ({
        id: r.id,
        title: r.title,
        summary: r.summary ?? null,
      }));
      return {
        source: "content_items" as const,
        total: contentTotal,
        page: safePage,
        pageCount,
        rows,
      };
    }

    const pathwayWhere = pathwayLessonsAppListWhereWithTopicFilter(entitlement, learnerPath, {
      topic: topicFilter,
      topicSlug: topicSlugFilter,
      pathwayId: pathwayIdFilter,
    });
    const pathwayWhereWithSafety = {
      AND: [
        pathwayWhere,
        pathwayLessonSafetyGateWhere(),
        ...(qEffective
          ? [
              {
                OR: [
                  { title: { contains: qEffective, mode: "insensitive" as const } },
                  { topic: { contains: qEffective, mode: "insensitive" as const } },
                  { bodySystem: { contains: qEffective, mode: "insensitive" as const } },
                  { slug: { contains: qEffective, mode: "insensitive" as const } },
                  { seoTitle: { contains: qEffective, mode: "insensitive" as const } },
                ],
              },
            ]
          : []),
      ],
    };
    const pathwaySample = await prisma.pathwayLesson.findFirst({
      where: pathwayWhereWithSafety,
      select: { id: true },
    });

    if (pathwaySample) {
      const pathwayTotal = await prisma.pathwayLesson.count({ where: pathwayWhereWithSafety });
      const pageCount = Math.max(1, Math.ceil(pathwayTotal / limitParsed) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const pathwayRows = await prisma.pathwayLesson.findMany({
        where: pathwayWhereWithSafety,
        select: {
          id: true,
          title: true,
          seoDescription: true,
          topic: true,
          bodySystem: true,
          slug: true,
          pathwayId: true,
          updatedAt: true,
          topicSlug: true,
          previewSectionCount: true,
          seoTitle: true,
          locale: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: (safePage - 1) * limitParsed,
        take: limitParsed,
      });
      const rows: AppLessonListRow[] = pathwayRows.map((r) => ({
        id: r.id,
        title: r.title,
        summary: pathwayLessonCardSummary(r),
        topic: r.topic,
        bodySystem: r.bodySystem,
        pathwayMeta: { pathwayId: r.pathwayId, slug: r.slug },
      }));
      return {
        source: "pathway_lessons" as const,
        total: pathwayTotal,
        page: safePage,
        pageCount,
        rows,
      };
    }

    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, limitParsed, qEffective);
    const rows: AppLessonListRow[] = legacy.rows.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
    }));
    return {
      source: "legacy_content_map" as const,
      total: legacy.total,
      page: legacy.page,
      pageCount: legacy.pageCount,
      rows,
    };
  }, null);

  let lessonsBlock: LessonsListBlock;
  if (lessonsBlockFromDb !== null) {
    lessonsBlock = lessonsBlockFromDb;
  } else {
    safeServerLog("page_lessons", "lesson_list_db_unavailable_fallback_legacy", {});
    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, limitParsed, qEffective);
    const rows: AppLessonListRow[] = legacy.rows.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
    }));
    lessonsBlock = {
      source: "legacy_content_map",
      total: legacy.total,
      page: legacy.page,
      pageCount: legacy.pageCount,
      rows,
    };
  }

  if (rawPage !== lessonsBlock.page) {
    const q = appLessonsListQuery(
      lessonsBlock.page,
      topicFilter,
      topicSlugFilter,
      pathwayIdFilter,
      qEffective,
      limitParsed,
    );
    redirect(q ? `/app/lessons${q}` : "/app/lessons");
  }

  const lessons = lessonsBlock.rows;

  const progressByRowId: Record<string, PathwayLessonProgressStatus> = {};
  if (userId && lessonsBlock.source === "pathway_lessons") {
    const byPathway = new Map<string, string[]>();
    for (const row of lessons) {
      const pm = row.pathwayMeta;
      if (!pm?.slug) continue;
      const list = byPathway.get(pm.pathwayId) ?? [];
      list.push(pm.slug);
      byPathway.set(pm.pathwayId, list);
    }
    for (const [pathwayId, slugs] of byPathway) {
      const unique = [...new Set(slugs)];
      const map = await loadPathwayLessonProgressMap(userId, pathwayId, unique);
      for (const row of lessons) {
        const pm = row.pathwayMeta;
        if (pm && pm.pathwayId === pathwayId && pm.slug) {
          progressByRowId[row.id] = map[pm.slug] ?? "not_started";
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)] sm:text-[1.7rem]">
          {t("learner.lessons.list.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.lessons.list.subscriberIntro")}</p>
      </div>
      {(topicFilter || topicSlugFilter) && lessonsBlock.source === "pathway_lessons" ? (
        <div className="nn-card border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4 text-sm text-[var(--semantic-text-secondary)]">
          <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.lessons.list.topicFilterTitle")}</p>
          <p className="mt-1">
            {t("learner.lessons.list.topicFilterBody", {
              label: topicSlugFilter ?? topicFilter ?? "",
            })}{" "}
            <Link className="font-medium text-[var(--semantic-brand)] underline underline-offset-2" href="/app/lessons">
              {t("learner.lessons.list.topicFilterClear")}
            </Link>
          </p>
        </div>
      ) : (topicFilter || topicSlugFilter) && lessonsBlock.source !== "pathway_lessons" ? (
        <div className="nn-card border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 text-sm text-[var(--semantic-text-secondary)]">
          <p>{t("learner.lessons.list.topicFilterIgnored")}</p>
        </div>
      ) : null}
      {lessons.length === 0 ? (
        <div className="nn-card mt-4 space-y-3 p-6 text-sm text-muted">
          <p className="font-semibold text-[var(--semantic-text-primary)]">No lessons available yet for this topic</p>
          <p>{t("learner.lessons.list.emptyList")}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/lessons"
              className="inline-flex items-center rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 font-semibold text-[var(--semantic-brand)] hover:underline"
            >
              Explore available lessons
            </Link>
            <Link
              href={catHref}
              className="inline-flex items-center rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 font-semibold text-[var(--semantic-brand)] hover:underline"
            >
              Start adaptive exam
            </Link>
          </div>
        </div>
      ) : null}
      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-[var(--semantic-panel-muted)]" />}>
        <LearnerLessonsSearchToolbar
          initialQ={qEffective ?? ""}
          label="Search lessons"
          placeholder="Search by title, topic, or keyword"
        />
      </Suspense>
      <div className="mt-4">
        <LearnerLessonsVirtualList
          lessons={lessons}
          progressByRowId={progressByRowId}
          openLessonCta={t("learner.lessons.list.openLessonCta")}
        />
      </div>

      <PathwayLessonPagination
        basePath="/app/lessons"
        page={lessonsBlock.page}
        pageCount={lessonsBlock.pageCount}
        total={lessonsBlock.total}
        pageSize={limitParsed}
        topic={topicFilter ?? undefined}
        topicSlug={topicSlugFilter ?? undefined}
        pathwayId={pathwayIdFilter ?? undefined}
        limit={limitParsed}
        q={qEffective ?? undefined}
      />

      <LearnerStudyQuickLinksCard t={t} id="lessons-study-quick-links" catHref={catHref} />
      <aside className="nn-card border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-4 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.lessons.list.studyRhythmTitle")}</p>
        <p className="mt-1">{t("learner.lessons.list.studyRhythmBody")}</p>
      </aside>
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        {t("learner.lessons.list.paginationExplainer", { pageSize: limitParsed })}{" "}
        <Link
          className="font-medium text-[var(--semantic-info)] underline decoration-[color-mix(in_srgb,var(--semantic-info)_35%,transparent)] underline-offset-2"
          href="/lessons"
        >
          {t("learner.lessons.list.paginationLink")}
        </Link>
        {t("learner.lessons.list.paginationEnd")}
      </p>
    </div>
  );
}
