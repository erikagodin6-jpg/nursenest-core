import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadAdminStudyPerformanceAnalytics,
  parseStudyPerformanceSearchParams,
} from "@/lib/admin/load-admin-study-performance-analytics";
import {
  loadAdminUserAnalytics,
  parseUserAnalyticsSearchParams,
} from "@/lib/admin/load-admin-user-analytics";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export const dynamic = "force-dynamic";

/**
 * Content & learning analytics hub — aggregates Postgres-backed study metrics.
 * Per-question miss ranks are not stored in PG (use Study performance + topic aggregates, or PostHog for item funnels).
 */
export default async function AdminContentAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const studyQ = parseStudyPerformanceSearchParams(sp);
  const userQ = parseUserAnalyticsSearchParams(sp);

  const [study, users] = await Promise.all([
    loadAdminStudyPerformanceAnalytics(studyQ),
    loadAdminUserAnalytics(userQ),
  ]);

  const offline = !isDatabaseUrlConfigured() || isRuntimeSafeMode();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Content & learning</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Lessons, topics, and practice signals from Postgres. For subscription funnels and full user filters, use{" "}
            <Link className="font-semibold text-primary underline" href="/admin/analytics/users">
              User analytics
            </Link>
            . For CAT and session depth, open{" "}
            <Link className="font-semibold text-primary underline" href="/admin/analytics/study-performance">
              Study performance
            </Link>{" "}
            with the same date range (adjust <code className="rounded bg-muted px-1">from</code> /{" "}
            <code className="rounded bg-muted px-1">to</code> query params).
          </p>
        </div>
      </div>

      {offline ? (
        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
          Database unavailable or safe mode — metrics disabled.
        </div>
      ) : null}

      {users ? (
        <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Learners (filtered)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Range {users.query.fromDay} → {users.query.toDay}
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Users (filter)</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground">{users.totals.users}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active in range</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground">{users.totals.activeUsers}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active share</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                {users.totals.activeShare != null ? `${Math.round(users.totals.activeShare * 1000) / 10}%` : "—"}
              </dd>
            </div>
          </dl>
          {users.lessonUsage.topLessonsByDistinctUsers.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Most opened lessons (distinct users)</h3>
              <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                {users.lessonUsage.topLessonsByDistinctUsers.slice(0, 8).map((l) => (
                  <li key={l.lessonId} className="flex justify-between gap-4 border-b border-border/50 py-1">
                    <span className="min-w-0 truncate text-foreground">{l.title ?? l.lessonId}</span>
                    <span className="shrink-0 tabular-nums">{l.distinctUsers}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}

      {study ? (
        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Study window snapshot</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Range {study.query.fromDay} → {study.query.toDay} · Lesson rows from <code className="rounded bg-muted px-1">Progress</code>;
            topics from <code className="rounded bg-muted px-1">UserTopicStat</code>
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top lessons (progress events)</h3>
              <ol className="mt-2 space-y-1 text-sm">
                {study.lessons.topLessons.slice(0, 8).map((l) => (
                  <li key={l.lessonKey} className="flex flex-col gap-0.5 border-b border-border/50 py-2">
                    <span className="font-medium text-foreground">{l.title}</span>
                    <span className="text-xs text-muted-foreground">
                      Completion {l.completionRatePct ?? "—"}% · {l.distinctLearners} learners · {l.progressRows} touches
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Hardest topics (accuracy)</h3>
              <ol className="mt-2 space-y-1 text-sm">
                {study.questions.hardestTopics.slice(0, 8).map((t) => (
                  <li key={t.topic} className="flex justify-between gap-4 border-b border-border/50 py-1">
                    <span className="min-w-0 truncate text-foreground">{t.topic}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {t.accuracyPct}% · {t.attempts} attempts
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Per-question “most missed”</p>
            <p className="mt-1">
              Aggregates are by <strong>topic</strong> in Postgres, not per <code className="rounded bg-muted px-1">questionId</code>. For
              item-level funnels, use PostHog or add a dedicated fact table in a future migration.
            </p>
          </div>

          {study.warnings.length > 0 ? (
            <ul className="mt-4 list-inside list-disc text-sm text-amber-800 dark:text-amber-200">
              {study.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/admin/lessons" className="text-primary underline">
          Lessons CMS
        </Link>
        <Link href="/admin/questions" className="text-primary underline">
          Questions
        </Link>
        <Link href="/admin/ai/flashcards" className="text-primary underline">
          AI · Flashcards
        </Link>
        <Link href="/admin/blog/studio" className="text-primary underline">
          Blog / SEO studio
        </Link>
        <Link href="/admin/seo" className="text-primary underline">
          SEO hub
        </Link>
      </div>
    </main>
  );
}
