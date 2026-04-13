import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { maxSafeOffsetPage } from "@/lib/api/api-pagination-limits";
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
import { LEARNER_APP_LESSONS_PAGE_SIZE } from "@/lib/lessons/pathway-lesson-scale";
import {
  loadPathwayLessonProgressMap,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { normalizeLesson, pathwayLessonRowToInput } from "@/lib/lessons/pathway-lesson-loader";
import { LessonCard, LessonCardChip } from "@/components/student/product/lesson-card";
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

type Props = { searchParams: Promise<{ page?: string; topic?: string; topicSlug?: string; pathwayId?: string }> };

function appLessonsListQuery(
  page: number,
  topic: string | null,
  topicSlug: string | null,
  pathwayId: string | null,
): string {
  const qs = new URLSearchParams();
  if (page > 1) qs.set("page", String(page));
  const ts = topicSlug?.trim().toLowerCase();
  if (ts) qs.set("topicSlug", ts);
  else if (topic?.trim()) qs.set("topic", topic.trim());
  if (pathwayId?.trim()) qs.set("pathwayId", pathwayId.trim());
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
      <main>
        <h1 className="text-3xl font-bold">{t("learner.lessons.list.title")}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("learner.lessons.list.freemiumLead")}{" "}
          <Link className="font-medium text-primary underline" href="/lessons">
            {t("learner.lessons.list.freemiumLink")}
          </Link>{" "}
          {t("learner.lessons.list.freemiumTail")}
        </p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="lessons"
            freemiumRemainingLessons={snap?.lessonRemaining ?? 0}
            freemiumRemainingQuestions={snap?.questionRemaining ?? 0}
          />
        </div>
        {userId && snap && freemiumQuestionsExhausted(snap) && !freemiumLessonsExhausted(snap) ? (
          <FreemiumCrossTrackNudge variant="questions_exhausted" />
        ) : null}
        {userId && snap && !freemiumLessonsExhausted(snap) ? <FreemiumLessonPeek /> : null}
        {userId && snap && freemiumLessonsExhausted(snap) ? <FreemiumPreviewExhaustedSurface kind="lessons" /> : null}
      </main>
    );
  }

  const sp = await searchParams;
  const rawPage = Math.max(1, Number(sp.page ?? "1") || 1);
  const maxOffsetPage = maxSafeOffsetPage(LEARNER_APP_LESSONS_PAGE_SIZE);
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
    const contentTotal = await prisma.contentItem.count({ where: contentWhere });

    if (contentTotal > 0) {
      const pageCount = Math.max(1, Math.ceil(contentTotal / LEARNER_APP_LESSONS_PAGE_SIZE) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const rowsRaw = await prisma.contentItem.findMany({
        where: contentWhere,
        select: { id: true, title: true, summary: true },
        orderBy: { updatedAt: "desc" },
        skip: (safePage - 1) * LEARNER_APP_LESSONS_PAGE_SIZE,
        take: LEARNER_APP_LESSONS_PAGE_SIZE,
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
    const pathwaySample = await prisma.pathwayLesson.findFirst({
      where: pathwayWhere,
      select: { id: true },
    });

    if (pathwaySample) {
      const pathwayAllRows = await prisma.pathwayLesson.findMany({
        where: pathwayWhere,
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
          sections: true,
          locale: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 500,
      });
      const readyRows = pathwayAllRows.filter((r) => {
        const rec = normalizeLesson(pathwayLessonRowToInput(r), r.pathwayId);
        return Boolean(rec.structuralQuality?.publicComplete);
      });
      const pathwayTotal = readyRows.length;
      const pageCount = Math.max(1, Math.ceil(pathwayTotal / LEARNER_APP_LESSONS_PAGE_SIZE) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const pathwayRows = readyRows.slice(
        (safePage - 1) * LEARNER_APP_LESSONS_PAGE_SIZE,
        safePage * LEARNER_APP_LESSONS_PAGE_SIZE,
      );
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

    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, LEARNER_APP_LESSONS_PAGE_SIZE);
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
    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, LEARNER_APP_LESSONS_PAGE_SIZE);
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
    const q = appLessonsListQuery(lessonsBlock.page, topicFilter, topicSlugFilter, pathwayIdFilter);
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
    <main className="space-y-6">
      <div className="nn-learner-page-hero">
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.lessons.list.title")}</h1>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.lessons.list.subscriberIntro")}</p>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
          {t("learner.lessons.list.paginationExplainer", { pageSize: LEARNER_APP_LESSONS_PAGE_SIZE })}{" "}
          <Link className="font-medium text-[var(--semantic-info)] underline decoration-[color-mix(in_srgb,var(--semantic-info)_35%,transparent)] underline-offset-2" href="/lessons">
            {t("learner.lessons.list.paginationLink")}
          </Link>
          {t("learner.lessons.list.paginationEnd")}
        </p>
      </div>
      <LearnerStudyQuickLinksCard t={t} id="lessons-study-quick-links" catHref={catHref} />
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
      <aside className="nn-card border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-4 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.lessons.list.studyRhythmTitle")}</p>
        <p className="mt-1">{t("learner.lessons.list.studyRhythmBody")}</p>
      </aside>
      {lessons.length === 0 ? (
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          {t("learner.lessons.list.emptyList")}
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {lessons.map((lesson) => {
          const chips =
            lesson.topic?.trim() || lesson.bodySystem?.trim() ? (
              <>
                {lesson.topic?.trim() ? (
                  <LessonCardChip variant="category">{lesson.topic.trim()}</LessonCardChip>
                ) : null}
                {lesson.bodySystem?.trim() ? (
                  <LessonCardChip variant="body">{lesson.bodySystem.trim()}</LessonCardChip>
                ) : null}
              </>
            ) : undefined;
          return (
            <LessonCard
              key={lesson.id}
              href={`/app/lessons/${lesson.id}`}
              title={lesson.title}
              summary={lesson.summary}
              chips={chips}
              progressStatus={lesson.pathwayMeta ? (progressByRowId[lesson.id] ?? "not_started") : undefined}
              footer={
                <Link
                  href={`/app/lessons/${lesson.id}`}
                  className="inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
                >
                  {t("learner.lessons.list.openLessonCta")}
                </Link>
              }
            />
          );
        })}
      </div>

      <PathwayLessonPagination
        basePath="/app/lessons"
        page={lessonsBlock.page}
        pageCount={lessonsBlock.pageCount}
        total={lessonsBlock.total}
        pageSize={LEARNER_APP_LESSONS_PAGE_SIZE}
        topic={topicFilter ?? undefined}
        topicSlug={topicSlugFilter ?? undefined}
      />
    </main>
  );
}
