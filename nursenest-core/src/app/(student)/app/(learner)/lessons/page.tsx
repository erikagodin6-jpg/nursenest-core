import Link from "next/link";
import { auth } from "@/lib/auth";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { FreemiumLessonPeek } from "@/components/student/freemium-lesson-peek";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";

export default async function LessonsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <p className="nn-card p-6 text-sm text-muted">
        We could not verify your subscription right now. Refresh the page or try again in a moment.
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

  const lessonsLoad = await withDatabaseFallback(
    () =>
      prisma.contentItem.findMany({
        where: lessonAccessWhere(entitlement),
        select: { id: true, title: true, summary: true },
        orderBy: { updatedAt: "desc" },
        take: 15,
      }),
    null,
  );

  if (lessonsLoad === null) {
    safeServerLog("page_lessons", "prisma_find_failed", {});
    return (
      <main>
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          Lessons could not be loaded. Please refresh or try again shortly.
        </p>
      </main>
    );
  }

  const lessons = lessonsLoad;

  return (
    <main>
      <h1 className="text-3xl font-bold">Lessons</h1>
      <p className="mt-2 text-sm text-muted">Continue modules, then lock in retention with the question bank the same day.</p>
      <p className="mt-2 text-sm text-muted">
        Prefer exam-scoped study? Open{" "}
        <Link className="font-medium text-primary underline" href="/exam-lessons">
          lessons by exam pathway
        </Link>{" "}
        (NCLEX-RN, REx-PN, FNP, …).
      </p>
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">Study rhythm</p>
        <p className="mt-1">Finish a lesson → apply it in 10 timed questions → review rationales. Repeat tomorrow.</p>
      </aside>
      {lessons.length === 0 ? (
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          No lessons match your region and tier yet. If you expect content here, confirm your profile country/tier or contact support.
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
    </main>
  );
}
