import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamPracticeClient } from "@/components/student/exam-practice-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveDefaultExamForUser } from "@/lib/exams/resolve-default-exam";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function ExamsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  const examCrumbs = appShellBreadcrumbs("exams");

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">
          We could not verify your subscription right now. Refresh the page or try again in a moment.
        </p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <h1 className="text-3xl font-bold">Practice exams</h1>
        <p className="mt-2 text-sm text-muted">
          Timed practice pulls from the same server-filtered pool as your question bank. Subscribe to start full sessions and save
          attempts to your history.
        </p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="exams"
            freemiumRemainingQuestions={snap?.questionRemaining ?? 0}
          />
        </div>
        <section className="nn-card mt-6 p-4 text-sm text-muted">
          <p className="font-semibold text-foreground">After you subscribe</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Full-length mocks with server-filtered item pools</li>
            <li>Score history for readiness tracking</li>
            <li>Resumable sessions with autosaved progress</li>
          </ul>
        </section>
      </main>
    );
  }

  const attemptsLoad = await withDatabaseFallback(
    () =>
      prisma.examAttempt.findMany({
        where: { userId },
        select: { id: true, score: true, total: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    null,
  );

  if (attemptsLoad === null) {
    safeServerLog("page_exams", "attempts_find_failed", {});
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={examCrumbs} />
        </div>
        <h1 className="text-3xl font-bold">Practice exams</h1>
        <p className="nn-card mt-4 p-6 text-sm text-muted">
          Past attempts could not be loaded. Refresh or try again shortly.
        </p>
      </main>
    );
  }

  const attempts = attemptsLoad;

  const last = attempts[0];
  const pct = last && last.total > 0 ? Math.round((last.score / last.total) * 100) : null;

  const defaultExam = userId ? await resolveDefaultExamForUser(userId) : null;

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={examCrumbs} />
      </div>
      <h1 className="text-3xl font-bold">Practice exams</h1>
      <p className="mt-2 text-muted">
        Timed linear practice exams use your subscription pool (filtered by country and tier). Submit at the end for a score—
        rationales are not shown between items so the run mirrors test-day pacing.
      </p>
      {pct !== null ? (
        <p className="mt-3 text-sm font-medium text-foreground">
          Latest attempt: {last?.score}/{last?.total} ({pct}%) —{" "}
          {pct >= 75 ? "strong practice band—keep mixing timed sets." : "add timed blocks this week to lift accuracy."}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">No attempts yet—start a session below when you are ready.</p>
      )}
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">Report card & analytics</p>
        <p className="mt-1">Pair exam scores with question bank misses to plan your next study blocks.</p>
      </aside>

      {defaultExam ? (
        <ExamPracticeClient examId={defaultExam.id} examTitle={defaultExam.title} />
      ) : (
        <aside className="nn-card mt-4 border-amber-200/80 bg-amber-50/50 p-4 text-sm text-foreground">
          <p className="font-semibold">Setting up your practice exam</p>
          <p className="mt-1 text-muted">
            We could not attach a default exam profile to your account yet. You can still use the question bank while we finish loading
            exam metadata.
          </p>
          <Link href="/app/questions" className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-2">
            Open question bank →
          </Link>
        </aside>
      )}

      <div className="mt-4 space-y-3">
        {attempts.map((attempt) => (
          <article className="nn-card p-4" key={attempt.id}>
            <p className="font-semibold">
              Score: {attempt.score}/{attempt.total}
            </p>
            <p className="text-sm text-muted">{attempt.createdAt.toISOString()}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
