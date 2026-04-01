import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Flame,
  LineChart,
  Sparkles,
  Target,
  Activity,
  Info,
} from "lucide-react";
import type { LearnerDashboardModel } from "@/lib/learner/load-learner-dashboard";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import { readinessBandLabel, type ReadinessBand } from "@/lib/learner/readiness-score";

function pctLine(current: number, total: number): string {
  if (total <= 0) return "—";
  return `${Math.min(100, Math.round((current / total) * 100))}%`;
}

function bandStyles(band: ReadinessBand): string {
  switch (band) {
    case "insufficient_data":
      return "border-muted-foreground/30 bg-muted/40 text-muted-foreground";
    case "not_ready":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "improving":
      return "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200";
    case "near_ready":
      return "border-sky-500/50 bg-sky-500/10 text-sky-900 dark:text-sky-100";
    case "ready":
      return "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100";
    default:
      return "border-border bg-muted/30";
  }
}

export function LearnerDashboardView({ data }: { data: LearnerDashboardModel }) {
  const lessonPct = pctLine(data.lessonsCompleted, data.lessonsAvailable);
  const topWeak = data.weakTopics.slice(0, 3);
  const r = data.readiness;
  const weakestFactors = [...r.factors]
    .filter((f) => f.maxPoints > 0)
    .sort((a, b) => a.points / Math.max(1, a.maxPoints) - b.points / Math.max(1, b.maxPoints))
    .slice(0, 3);
  const topicFactor = r.factors.find((f) => f.id === "topic_errors") ?? null;
  const mockFactor = r.factors.find((f) => f.id === "mock_performance") ?? null;

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-[var(--theme-card-bg)] to-[var(--theme-page-bg)] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your study hub</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            What to do next
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--theme-body-text)]/85">
            Content is scoped to <span className="font-semibold text-foreground">{data.scope.tier}</span> ·{" "}
            <span className="font-semibold text-foreground">{data.scope.country}</span>. Use the shortcuts below to stay on
            track.
          </p>
        </div>
      </header>

      <section className="nn-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Exam readiness</h2>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${bandStyles(r.band)}`}
          >
            {readinessBandLabel(r.band)}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Indicative only — based on practice in this app, not a pass/fail prediction.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score</p>
            <p className="mt-1 text-4xl font-bold tabular-nums text-[var(--theme-heading-text)]">
              {r.score !== null ? r.score : "—"}
              {r.score !== null ? <span className="text-lg font-semibold text-muted-foreground"> /100</span> : null}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Confidence: <span className="font-medium text-foreground">{r.confidence}</span>
              {r.confidence === "low" ? " — add more full sessions." : null}
              {r.confidence === "medium" ? " — estimate will stabilize with volume." : null}
              {r.confidence === "high" ? " — based on enough recent items." : null}
              {r.calibratedPreview ? " Conservative calibration is active for this exam track." : null}
            </p>
          </div>
          <div className="min-w-0 flex-1 space-y-2 text-sm text-[var(--theme-body-text)]">
            <p>{r.summary}</p>
            {r.whatToImprove.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What to improve</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {r.whatToImprove.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {r.nextActions.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested next steps</p>
                <ul className="mt-1 list-inside list-decimal space-y-0.5">
                  {r.nextActions.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <details className="mt-5 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
          <summary className="cursor-pointer list-none font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              Why this score?
            </span>
          </summary>
          <div className="mt-3 space-y-3 text-muted-foreground">
            <p>
              We combine four signals when available: practice accuracy from graded completed sessions, average
              percentage on recent mock attempts (5+ items each), how concentrated errors are in your top weak topics,
              and lesson completion in your plan pool. Missing signals reduce the maximum score; we scale to 0–100 so
              partial data is not hidden as “mystery missing points.”
            </p>
            <p className="font-medium text-foreground">Bands</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Not ready: under 40</li>
              <li>Improving: 40–59</li>
              <li>Near ready: 60–79</li>
              <li>Ready: 80+</li>
            </ul>
            <p className="text-xs">
              We show a number only after a minimum graded-session or mock threshold is met for your exam track, so we do
              not invent precision from thin data.
            </p>
            {r.factors.length > 0 ? (
              <div>
                <p className="font-medium text-foreground">Your current factors</p>
                <ul className="mt-2 space-y-2">
                  {r.factors.map((f) => (
                    <li key={f.id} className="rounded-lg border border-border/60 bg-card/50 px-3 py-2">
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {" "}
                        ·{" "}
                        {f.maxPoints > 0 ? (
                          <>
                            {f.points}/{f.maxPoints} pts
                          </>
                        ) : (
                          <>not in denominator yet</>
                        )}
                      </span>
                      <p className="mt-0.5 text-xs">{f.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {weakestFactors.length > 0 ? (
              <div>
                <p className="font-medium text-foreground" title="Lowest-contributing factors in your current readiness score.">
                  Weakest factors
                </p>
                <p className="mt-1 text-xs">{weakestFactors.map((f) => f.label).join(" · ")}</p>
              </div>
            ) : null}
            {mockFactor?.detail.includes("Spread is") ? (
              <p
                className="text-xs"
                title="Large score swings across recent mocks reduce confidence and can dampen this factor."
              >
                Mock consistency penalty applied: recent mock spread is high, so readiness emphasizes stable performance.
              </p>
            ) : null}
            {topicFactor ? (
              <p className="text-xs" title="Topic contribution reflects miss concentration on your priority weak topics.">
                Topic performance contribution: {topicFactor.points}/{topicFactor.maxPoints} points.
              </p>
            ) : null}
          </div>
        </details>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="nn-card relative overflow-hidden p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lessons</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {data.lessonsCompleted}
                <span className="text-lg font-semibold text-muted-foreground">
                  {" "}
                  / {data.lessonsAvailable || "—"}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Completed in your plan pool</p>
            </div>
            <BookOpen className="h-9 w-9 shrink-0 text-primary/80" aria-hidden />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: data.lessonsAvailable > 0 ? `${Math.min(100, (data.lessonsCompleted / data.lessonsAvailable) * 100)}%` : "0%" }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-primary">{lessonPct} of pool touched</p>
        </div>

        <div className="nn-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Questions (mocks)</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {data.questionsInMocksLast14d}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Items in scored sessions · last 14 days</p>
            </div>
            <ClipboardCheck className="h-9 w-9 shrink-0 text-primary/80" aria-hidden />
          </div>
        </div>

        <div className="nn-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mocks taken</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {data.recentMocks.length > 0 ? data.recentMocks.length : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Recent attempts below</p>
            </div>
            <LineChart className="h-9 w-9 shrink-0 text-primary/80" aria-hidden />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="nn-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Continue where you left off</h2>
          </div>
          {data.continueLesson ? (
            <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground">{data.continueLesson.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.continueLesson.kind === "pathway" ? "Pathway lesson" : "Lesson module"}
              </p>
              <Link
                href={data.continueLesson.href}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                Resume lesson
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No in-progress lesson. Start one from your list or try a quick question block.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/lessons"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              Browse lessons
            </Link>
            <Link
              href="/app/questions"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              Question bank
            </Link>
          </div>
        </section>

        <section className="nn-card p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recommended next</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">Lesson</p>
                <p className="text-muted-foreground">
                  {data.continueLesson
                    ? `Finish “${data.continueLesson.title.slice(0, 48)}${data.continueLesson.title.length > 48 ? "…" : ""}”.`
                    : "Open a lesson in your tier and mark a section complete."}
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">Quiz block</p>
                {data.recommendedQuizTopic ? (
                  <Link
                    href={`/app/questions?topic=${encodeURIComponent(data.recommendedQuizTopic)}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Practice “{data.recommendedQuizTopic}” in the bank
                  </Link>
                ) : (
                  <p className="text-muted-foreground">Complete a mock exam to unlock topic-level drill-downs.</p>
                )}
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                3
              </span>
              <div>
                <p className="font-medium text-foreground">Timed practice</p>
                <Link href="/app/exams" className="text-primary underline-offset-4 hover:underline">
                  Run a mock exam in your tier
                </Link>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="nn-card p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-600" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Priority review queue</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">From recent scored mock sessions (your plan only).</p>
          {topWeak.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {topWeak.map((w) => (
                <li
                  key={w.topic}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2.5 text-sm"
                >
                  <span className="font-medium text-foreground">{w.topic}</span>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link href={remediationTopicDrillHref(w.topic)} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
                      Topic drill
                    </Link>
                    <Link href={remediationWeakModeTestHref(w.topic)} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
                      Weak-mode test
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {w.missed}/{w.attempted} missed ({w.missRate}%)
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No topic signals yet. Complete a practice exam to populate weak-area hints.
            </p>
          )}
        </section>

        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent performance</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest mock attempts.</p>
          {data.recentMocks.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {data.recentMocks.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate font-medium text-foreground">{m.examTitle}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {m.score}/{m.total} ({m.pct}%)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No mock attempts yet — start from Practice exams.</p>
          )}
        </section>
      </div>
    </div>
  );
}
