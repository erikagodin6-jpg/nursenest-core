import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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

export default async function LessonsPage({ searchParams }: Props) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <p className="nn-card p-6 text-sm text-muted">
        We couldn’t finish checking your subscription (database or billing lookup failed). This is not the same as “no
        plan”—refresh shortly, or sign in again if it keeps happening.
      </p>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="mt-2 text-sm text-muted">
          Structured modules connect pathophysiology to the same-week question practice. Browse{" "}
          <Link className="font-medium text-primary underline" href="/exam-lessons">
            exam-specific lessons
          </Link>{" "}
          on the marketing site anytime.
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

  const lessonsBlock = await withDatabaseFallback(async () => {
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

  if (lessonsBlock === null) {
    safeServerLog("page_lessons", "prisma_find_failed", {});
    return (
      <main>
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          Lessons couldn’t load because the database was unreachable or the request failed—not because your list is empty.
          Refresh or try again shortly.
        </p>
      </main>
    );
  }

  if (pageRequested !== lessonsBlock.page) {
    redirect(lessonsBlock.page > 1 ? `/app/lessons?page=${lessonsBlock.page}` : "/app/lessons");
  }

  const lessons = lessonsBlock.rows;

  return (
    <main>
      <h1 className="text-3xl font-bold">Lessons</h1>
      <p className="mt-2 text-sm text-muted">Continue modules, then lock in retention with the question bank the same day.</p>
      <p className="mt-2 text-sm text-muted">
        Paginated list: <strong className="text-foreground">{APP_LESSONS_PAGE_SIZE}</strong> app lessons per page (newest
        first) scoped to your region and plan—use Next below when you have more. Exam pathway lessons (NCLEX-RN, REx-PN,
        FNP, …) live under{" "}
        <Link className="font-medium text-primary underline" href="/exam-lessons">
          lessons by exam pathway
        </Link>
        .
      </p>
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">Study rhythm</p>
        <p className="mt-1">Finish a lesson → apply it in 10 timed questions → review rationales. Repeat tomorrow.</p>
      </aside>
      {lessons.length === 0 ? (
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          The list loaded successfully: there are no lessons in your plan’s region and tier right now (not a loading
          glitch). If you expected rows here, check your profile country/tier or contact support.
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
              Open lesson →
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
