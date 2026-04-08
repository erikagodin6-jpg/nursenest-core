import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { paginateLegacyContentMapLessons } from "@/lib/lessons/legacy-content-map-lessons";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { FreemiumLessonPeek } from "@/components/student/freemium-lesson-peek";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";

const APP_LESSONS_PAGE_SIZE = 15;

type AppLessonListRow = { id: string; title: string; summary: string | null };

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

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.lessons.list.metaTitle"),
    robots: { index: false, follow: false },
  };
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
          <SubscriptionPaywall context="lessons" freemiumRemainingLessons={snap?.lessonRemaining ?? 0} />
        </div>
        {userId && snap && snap.lessonRemaining > 0 ? <FreemiumLessonPeek /> : null}
      </main>
    );
  }

  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);

  const lessonsBlockFromDb = await withDatabaseFallback(async () => {
    const learnerPathRow = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
      : null;
    const learnerPath = learnerPathRow?.learnerPath ?? null;

    const contentWhere = lessonAccessWhere(entitlement);
    const contentTotal = await prisma.contentItem.count({ where: contentWhere });

    if (contentTotal > 0) {
      const pageCount = Math.max(1, Math.ceil(contentTotal / APP_LESSONS_PAGE_SIZE) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const rowsRaw = await prisma.contentItem.findMany({
        where: contentWhere,
        select: { id: true, title: true, summary: true },
        orderBy: { updatedAt: "desc" },
        skip: (safePage - 1) * APP_LESSONS_PAGE_SIZE,
        take: APP_LESSONS_PAGE_SIZE,
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

    const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);
    const pathwayTotal = await prisma.pathwayLesson.count({ where: pathwayWhere });

    if (pathwayTotal > 0) {
      const pageCount = Math.max(1, Math.ceil(pathwayTotal / APP_LESSONS_PAGE_SIZE) || 1);
      const safePage = Math.min(pageRequested, pageCount);
      const pathwayRows = await prisma.pathwayLesson.findMany({
        where: pathwayWhere,
        select: {
          id: true,
          title: true,
          seoDescription: true,
          topic: true,
          bodySystem: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: (safePage - 1) * APP_LESSONS_PAGE_SIZE,
        take: APP_LESSONS_PAGE_SIZE,
      });
      const rows: AppLessonListRow[] = pathwayRows.map((r) => ({
        id: r.id,
        title: r.title,
        summary: pathwayLessonCardSummary(r),
      }));
      return {
        source: "pathway_lessons" as const,
        total: pathwayTotal,
        page: safePage,
        pageCount,
        rows,
      };
    }

    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, APP_LESSONS_PAGE_SIZE);
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
    const legacy = await paginateLegacyContentMapLessons(entitlement, pageRequested, APP_LESSONS_PAGE_SIZE);
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

  if (pageRequested !== lessonsBlock.page) {
    redirect(lessonsBlock.page > 1 ? `/app/lessons?page=${lessonsBlock.page}` : "/app/lessons");
  }

  const lessons = lessonsBlock.rows;

  return (
    <main>
      <h1 className="text-3xl font-bold">{t("learner.lessons.list.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("learner.lessons.list.subscriberIntro")}</p>
      <p className="mt-2 text-sm text-muted">
        {t("learner.lessons.list.paginationExplainer", { pageSize: APP_LESSONS_PAGE_SIZE })}{" "}
        <Link className="font-medium text-primary underline" href="/lessons">
          {t("learner.lessons.list.paginationLink")}
        </Link>
        {t("learner.lessons.list.paginationEnd")}
      </p>
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">{t("learner.lessons.list.studyRhythmTitle")}</p>
        <p className="mt-1">{t("learner.lessons.list.studyRhythmBody")}</p>
      </aside>
      {lessons.length === 0 ? (
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          {t("learner.lessons.list.emptyList")}
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {lessons.map((lesson) => (
          <article className="nn-card p-4" key={lesson.id}>
            <h2 className="font-semibold">
              <Link href={`/app/lessons/${lesson.id}`} className="hover:text-primary hover:underline">
                {lesson.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted">{lesson.summary}</p>
            <Link
              href={`/app/lessons/${lesson.id}`}
              className="mt-3 inline-block text-sm font-semibold text-primary"
            >
              {t("learner.lessons.list.openLessonCta")}
            </Link>
          </article>
        ))}
      </div>

      <PathwayLessonPagination
        basePath="/app/lessons"
        page={lessonsBlock.page}
        pageCount={lessonsBlock.pageCount}
        total={lessonsBlock.total}
        pageSize={APP_LESSONS_PAGE_SIZE}
      />
    </main>
  );
}
