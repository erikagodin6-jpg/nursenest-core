import Link from "next/link";
import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { SubscriberPracticeRollups } from "@/components/student/subscriber-practice-rollups";

export default async function DashboardPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Learner dashboard</h1>
        </div>
        <section className="nn-card p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Access status</h2>
          <p className="mt-2 text-sm text-muted">Subscription status could not be loaded. Refresh the page.</p>
        </section>
      </main>
    );
  }

  let nextLessonTitle: string | null = null;
  let completedLessons = 0;
  let pathwayLessonsDone = 0;
  let attemptCount = 0;
  let lastMockPct: number | null = null;
  let userPrefs: {
    examFocus: string | null;
    studyGoal: string | null;
    dailyStudyMinutes: number | null;
  } | null = null;

  if (userId && isDatabaseUrlConfigured()) {
    try {
      userPrefs = await prisma.user.findUnique({
        where: { id: userId },
        select: { examFocus: true, studyGoal: true, dailyStudyMinutes: true },
      });
    } catch {
      /* optional */
    }
    try {
      completedLessons = await prisma.progress.count({ where: { userId, completed: true } });
    } catch {
      completedLessons = 0;
    }
    try {
      attemptCount = await prisma.examAttempt.count({ where: { userId } });
    } catch {
      attemptCount = 0;
    }
    try {
      pathwayLessonsDone = await prisma.progress.count({
        where: { userId, completed: true, lessonId: { startsWith: "pathway:" } },
      });
    } catch {
      pathwayLessonsDone = 0;
    }
    try {
      const last = await prisma.examAttempt.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { score: true, total: true },
      });
      if (last && last.total > 0) {
        lastMockPct = Math.round((last.score / last.total) * 100);
      }
    } catch {
      lastMockPct = null;
    }
    try {
      const incomplete = await prisma.progress.findFirst({
        where: { userId, completed: false },
        orderBy: { updatedAt: "desc" },
        select: { lessonId: true },
      });
      const lessonRow = incomplete?.lessonId
        ? await prisma.contentItem.findFirst({
            where: { id: incomplete.lessonId, type: "lesson" },
            select: { title: true },
          })
        : null;
      nextLessonTitle = lessonRow?.title ?? null;
    } catch {
      nextLessonTitle = null;
    }
  }

  return (
    <main className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Learner dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          {formatMarketingMessage(messages, "pages.pricing.social.passRateLine")}
        </p>
      </div>

      <section className="nn-card p-6">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Access status</h2>
        <p className="mt-2 text-sm text-muted">
          {entitlement.hasAccess ? "Active subscription — full bank, lessons, and mocks." : "No active subscription — previews may still be available on lessons/questions."}
        </p>
        {!entitlement.hasAccess ? (
          <Link className="mt-3 inline-block text-sm font-semibold text-primary underline" href="/pricing">
            Upgrade to unlock everything
          </Link>
        ) : null}
      </section>

      {entitlement.hasAccess ? (
        <>
          <section className="nn-card p-6">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Continue where you left off</h2>
            {nextLessonTitle ? (
              <p className="mt-2 text-sm text-muted">
                Next open lesson: <span className="font-medium text-foreground">{nextLessonTitle}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">Pick a lesson or jump to the question bank for a timed block.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
                href="/app/lessons"
              >
                Open lessons
              </Link>
              <Link
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
                href="/app/questions"
              >
                Question bank
              </Link>
              <Link
                className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                href="/app/exams"
              >
                Mock exams
              </Link>
            </div>
          </section>

          <section className="nn-card p-6">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Readiness snapshot</h2>
            <p className="mt-2 text-xs text-muted">
              Informative only—not a pass prediction. Use it to steer study time toward practice and review.
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
              <li>Activity: {completedLessons} lesson(s) completed</li>
              <li>Mock exams taken: {attemptCount}</li>
              {lastMockPct !== null ? (
                <li>Latest mock score: {lastMockPct}% — keep mixing timed sets until scores hold steady week over week.</li>
              ) : (
                <li>Latest mock score: not recorded yet — start a session on the exams page when you are ready.</li>
              )}
              <li>
                Weak areas: use question bank misses and mock review notes; open{" "}
                <Link className="font-medium text-primary underline" href="/exam-lessons">
                  exam-specific lessons
                </Link>{" "}
                for targeted review.
              </li>
            </ul>
            {userId ? <SubscriberPracticeRollups userId={userId} /> : null}
          </section>

          <section className="nn-card p-6">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Features to use this week</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
              <li>Timed mock exams with autosave and score history</li>
              <li>SATA and NGN-style judgment stems in the question bank</li>
              <li>Full rationales after each block</li>
              <li>Exam report card on the exams page</li>
            </ul>
          </section>
        </>
      ) : null}

      {userPrefs && (userPrefs.examFocus || userPrefs.studyGoal || userPrefs.dailyStudyMinutes) ? (
        <section className="nn-card p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Your onboarding targets</h2>
          <ul className="mt-2 text-sm text-muted">
            {userPrefs.examFocus ? <li>Exam focus: {userPrefs.examFocus}</li> : null}
            {userPrefs.studyGoal ? <li>Goal: {userPrefs.studyGoal}</li> : null}
            {userPrefs.dailyStudyMinutes ? <li>Daily cadence: ~{userPrefs.dailyStudyMinutes} minutes</li> : null}
          </ul>
          <p className="mt-2 text-xs text-muted">We will use this to prioritize recommendations as the product evolves.</p>
        </section>
      ) : null}
    </main>
  );
}
