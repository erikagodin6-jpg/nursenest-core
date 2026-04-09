import Link from "next/link";
import type { LearnerNoteScope } from "@prisma/client";
import { Award, ChevronRight, Crown, FileText, Flame, Sparkles, Target } from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { LessonContinuationStrip } from "@/components/student/lesson-continuation-strip";
import { readinessBandLabel } from "@/lib/learner/readiness-score";

function Bar({
  value,
  max = 100,
  label,
  sublabel,
  compact,
}: {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  /** Pathway-style row: bar + percent only (title lives outside). */
  compact?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      {compact ? (
        <div className="flex justify-end">
          <span className="text-xs tabular-nums text-muted">{pct}% complete</span>
        </div>
      ) : (
        <div className="flex items-baseline justify-between gap-2">
          {label ? <span className="text-sm font-medium text-foreground">{label}</span> : <span />}
          <span className="text-xs tabular-nums text-muted">{pct}%</span>
        </div>
      )}
      {sublabel && !compact ? <p className="text-xs text-muted">{sublabel}</p> : null}
      <div
        className="nn-progress-track-semantic nn-progress-track-semantic--md"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full nn-progress-fill-semantic-success transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FactorBar({ label, points, maxPoints, detail }: { label: string; points: number; maxPoints: number; detail: string }) {
  if (maxPoints <= 0) {
    return (
      <div className="nn-semantic-inset rounded-lg px-3 py-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted">{detail}</p>
      </div>
    );
  }
  const pct = Math.round((points / maxPoints) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted">
          {points}/{maxPoints}
        </span>
      </div>
      <div className="nn-progress-track-semantic">
        <div className="h-full rounded-full nn-progress-fill-semantic-success" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] leading-snug text-muted">{detail}</p>
    </div>
  );
}

export type RecentLearnerNoteSummary = {
  scope: LearnerNoteScope;
  contextId: string;
  title: string | null;
  updatedAt: string;
  href: string;
  scopeLabel: string;
};

export function PremiumLearnerHub({
  snapshot,
  weakTopicTitles = [],
  /** When the dashboard hero already shows readiness — keep momentum only, avoid duplicate score band. */
  compactIntro = false,
  recentNotes = [],
  /** Hide flashcard weak-topic sentence when the adaptive focus card already lists weak areas. */
  suppressFlashcardWeakLine = false,
  /** When the dashboard shows the readiness breakdown above the fold, omit the duplicate block here. */
  omitReadinessBreakdown = false,
  /** When recent mocks are shown in the insight panels, omit the duplicate list here. */
  omitRecentMocks = false,
  /** Shown when readiness breakdown is omitted (e.g. surfaced above the fold). */
  readinessDeferHint,
}: {
  snapshot: PremiumDashboardSnapshot;
  /** From practice stats — surfaces weak-area flashcard link context. */
  weakTopicTitles?: string[];
  compactIntro?: boolean;
  /** Metadata + links only (no note bodies). */
  recentNotes?: RecentLearnerNoteSummary[];
  suppressFlashcardWeakLine?: boolean;
  omitReadinessBreakdown?: boolean;
  omitRecentMocks?: boolean;
  readinessDeferHint?: string;
}) {
  const {
    readiness,
    overallLessons,
    pathways,
    practice,
    recentMocks,
    momentumMessages,
    examReadyHeadline,
    milestones,
    lessonContinuations,
  } = snapshot;

  const momentumSection =
    momentumMessages.length > 0 ? (
      <ul className={compactIntro ? "space-y-2" : "relative mt-5 space-y-2 border-t border-[var(--semantic-border-soft)] pt-4"}>
        {momentumMessages.map((line) => (
          <li key={line} className="flex gap-2 text-sm text-foreground/90">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className={compactIntro ? "text-sm text-muted" : "relative mt-5 border-t border-[var(--semantic-border-soft)] pt-4 text-sm text-muted"}>
        Finish a lesson, a graded bank block, or a mock. Personal notes show up here once we have a trend to compare.
      </p>
    );

  return (
    <div className="space-y-5">
      {!compactIntro && lessonContinuations.length > 0 ? (
        <LessonContinuationStrip rows={lessonContinuations} />
      ) : null}
      {compactIntro ? (
        <section className="nn-card nn-student-card-lift p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Crown className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Momentum this week</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            {examReadyHeadline ? `${examReadyHeadline}. ` : null}
            Short signals from your last sessions. Details stay in the readiness card above.
          </p>
          <div className="mt-4">{momentumSection}</div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-2xl border border-role-premium-border bg-gradient-to-br from-role-premium-surface via-[var(--theme-card-bg)] to-primary/[0.06] p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-role-premium-glow blur-3xl" aria-hidden />
          <div className="relative flex flex-wrap items-start gap-4">
            <div className="flex items-center gap-2 rounded-full border border-role-warning-border bg-role-warning-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-role-warning-text">
              <Crown className="h-3.5 w-3.5" aria-hidden />
              Full member experience
            </div>
            <div className="min-w-0 flex-1">
              {examReadyHeadline ? (
                <p className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">{examReadyHeadline}</p>
              ) : (
                <p className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
                  Your progress is yours. We try to surface it clearly so each session feels worth it.
                </p>
              )}
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--semantic-panel-muted)] px-2 py-0.5">
                  <Target className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Readiness: {readinessBandLabel(readiness.band)}
                </span>
                {readiness.score != null ? (
                  <span className="tabular-nums text-foreground/90">Score {readiness.score}/100</span>
                ) : (
                  <span>Score unlocks after a bit more scored practice</span>
                )}
                {readiness.calibratedPreview ? (
                  <span className="text-role-warning">Conservative calibration active</span>
                ) : null}
              </p>
            </div>
          </div>

          {momentumSection}
        </section>
      )}

      {recentNotes.length > 0 ? (
        <section className="nn-card nn-student-card-lift p-6">
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Recent study notes</h2>
          </div>
          <p className="mt-1 text-xs text-muted">Titles and sources only. Open the lesson or bank to edit.</p>
          <ul className="mt-4 space-y-2">
            {recentNotes.map((n) => (
              <li key={`${n.scope}-${n.contextId}`}>
                <Link
                  href={n.href}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-sm transition-colors hover:bg-[var(--semantic-panel-cool)]"
                >
                  <span className="min-w-0 font-medium text-foreground">
                    {n.title?.trim() || "Untitled note"}
                    <span className="ml-2 text-xs font-normal text-muted">· {n.scopeLabel}</span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {new Date(n.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {snapshot.flashcards ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Flashcards</h2>
          <p className="mt-1 text-xs text-muted">
            Spaced repetition ties to your decks; weak-area study pulls cards that match topics you have missed in the bank.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Reviews logged</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--semantic-chart-3)]">{snapshot.flashcards.cardsReviewedTotal}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Card streak</p>
              <p className="text-2xl font-bold tabular-nums text-foreground">{snapshot.flashcards.reviewStreak}</p>
            </div>
          </div>
          {!suppressFlashcardWeakLine && weakTopicTitles.length > 0 ? (
            <p className="mt-3 text-xs text-muted">
              Priority review queue matched to flashcards:{" "}
              <span className="font-medium text-foreground">{weakTopicTitles.slice(0, 5).join(", ")}</span>
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/flashcards"
              className="inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
            >
              All decks
            </Link>
            <Link
              href="/app/flashcards/weak-areas"
              className="inline-flex rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-foreground"
            >
              Study priority review
            </Link>
          </div>
          {snapshot.flashcards.suggestedDecks.length > 0 ? (
            <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4">
              <p className="text-sm font-medium text-foreground">Suggested decks</p>
              <ul className="mt-2 space-y-2 text-sm">
                {snapshot.flashcards.suggestedDecks.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/app/flashcards/${d.slug}`} className="text-primary underline hover:no-underline">
                      {d.title}
                    </Link>
                    <span className="ml-2 text-xs tabular-nums text-muted">{d.cardCount} cards</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="nn-card nn-student-card-lift p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Pathway progress</h2>
            <p className="mt-1 text-xs text-muted">
              Completion is measured against lessons available in your subscription scope.
            </p>
          </div>
          <Link
            href="/app/lessons"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Continue lessons
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-5 space-y-5">
          {pathways.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-muted">
              Pathway lessons for your plan will list here when the catalog is available for your tier and region.
            </li>
          ) : (
            pathways.map((p) => (
              <li key={p.pathwayId}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">{p.shortLabel}</span>
                  <span className="text-xs tabular-nums text-muted">
                    {p.lessonsTotal === 0
                      ? "No published lessons in scope yet"
                      : `${p.lessonsCompleted} / ${p.lessonsTotal} completed${
                          p.lessonsInProgress > 0 ? ` · ${p.lessonsInProgress} in progress` : ""
                        }`}
                  </span>
                </div>
                {p.lessonsTotal > 0 ? (
                  <div className="mt-2">
                    <Bar compact value={p.pct} />
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted">
                    When lessons publish to your pathway, a completion bar will appear automatically.
                  </p>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="nn-card nn-student-card-lift p-6">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Performance summary</h2>
        <p className="mt-1 text-xs text-muted">Blended signals from your plan. Indicative only, not a pass guarantee.</p>

        <div className="mt-5 space-y-6">
          <Bar
            value={overallLessons.pct}
            label="Overall lesson completion"
            sublabel={
              overallLessons.total > 0
                ? `${overallLessons.completed} of ${overallLessons.total} lessons in your pool`
                : "Lesson pool is still loading for your scope. We will show a target count soon."
            }
          />

          {practice.gradedTotal > 0 ? (
            <Bar
              value={practice.accuracyPct ?? 0}
              label="Recent scored session accuracy"
              sublabel={`${practice.gradedCorrect} correct of ${practice.gradedTotal} graded items across ${practice.sessionCount} completed session(s) in your tier scope.`}
            />
          ) : (
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 shadow-sm">
              <p className="text-sm font-medium text-foreground">Recent scored session accuracy</p>
              <p className="mt-1 text-xs text-muted">
                Finish a timed exam session or mock so we can chart accuracy from graded items in your plan. The question
                bank also updates your topic ledger on each grade.
              </p>
            </div>
          )}

          {!omitReadinessBreakdown ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Readiness breakdown</p>
              <p className="mt-1 text-xs text-muted">{readiness.summary}</p>
              <div className="mt-4 space-y-4">
                {readiness.holdingBack.length > 0 ? (
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Limiting factors: </span>
                    {readiness.holdingBack.join(" · ")}
                  </p>
                ) : null}
                {readiness.factors.length > 0 ? (
                  readiness.factors.map((f) => (
                    <FactorBar key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
                  ))
                ) : (
                  <p className="text-sm text-muted">
                    We will chart practice accuracy, mocks, topic load, and lesson completion here once you have enough scored
                    activity. See the checklist in your readiness band above.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-muted">
              {readinessDeferHint ??
                "Readiness factors and score are summarized in the card above. This section still tracks lesson completion and recent session accuracy."}
            </p>
          )}
        </div>
      </section>

      <section className="nn-card nn-student-card-lift p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Flame className="h-5 w-5 text-role-heat-text" aria-hidden />
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Milestones and streaks</h2>
        </div>
        <p className="mt-1 text-xs text-muted">
          Activity streak counts days with lessons, graded mocks, or completed practice tests. It rewards showing up, not
          perfection.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-role-warning-border bg-role-warning-soft px-3 py-1.5 text-xs font-semibold text-role-warning-text">
            <Flame className="h-3.5 w-3.5" aria-hidden />
            {snapshot.studyStreakDays > 0
              ? `${snapshot.studyStreakDays}-day activity streak`
              : "Start a streak. Any study day counts."}
          </span>
          {milestones.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
            >
              <Award className="h-3.5 w-3.5 text-primary" aria-hidden />
              {m}
            </span>
          ))}
        </div>
        {milestones.length === 0 && snapshot.studyStreakDays === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Milestones show up as you hit lesson thresholds, longer streaks, and more scored volume. Often your next win is
            one focused session away.
          </p>
        ) : null}
      </section>

      {!omitRecentMocks ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Recent mocks</h2>
          <p className="mt-1 text-xs text-muted">Last five attempts. Watch the trend, not one score.</p>
          {recentMocks.length > 0 ? (
            <ul className="mt-4 divide-y divide-[var(--semantic-border-soft)]">
              {recentMocks.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0">
                  <span className="font-medium text-foreground">{m.examTitle}</span>
                  <span className="tabular-nums text-muted">
                    {m.pct}% ({m.score}/{m.total})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-muted">
              No mocks logged yet. When you complete one from the exams page, scores and trends will appear here for a
              high-level view.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/app/exams" className="inline-flex text-sm font-semibold text-primary hover:underline">
              Open practice exams
            </Link>
            <Link href="/app/lessons" className="inline-flex text-sm font-semibold text-primary hover:underline">
              Exam-specific lessons
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
