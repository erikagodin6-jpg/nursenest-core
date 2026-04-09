import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { TodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { LearnerDailyGoalCelebrationClient } from "@/components/student/learner-daily-goal-celebration-client";

export function LearnerDailyMomentumCard({
  t,
  streakDays,
  todayGoal,
  resume,
  momentumLine,
  focusTopic,
  /** From profile (study goal / minutes) — display only, no writes. */
  personalNote,
  /** When the learner has a streak but has not yet earned a credit today (UTC). */
  showStreakProtectNudge,
}: {
  t: LearnerMarketingT;
  streakDays: number;
  todayGoal: TodayGoalProgress;
  resume: { title: string; href: string } | null;
  momentumLine: string | null;
  /** Optional weak-area label for a grounded “where to improve” line. */
  focusTopic?: string | null;
  personalNote?: string | null;
  showStreakProtectNudge?: boolean;
}) {
  const pct = Math.min(100, Math.round((todayGoal.credits / todayGoal.target) * 100));
  const complete = todayGoal.credits >= todayGoal.target;

  return (
    <section
      className="nn-metric-tile relative overflow-hidden rounded-2xl p-5 pt-6"
      aria-labelledby="daily-momentum-heading"
    >
      <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full nn-momentum-glow blur-3xl opacity-90" aria-hidden />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="daily-momentum-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
                {t("learner.dailyGoal.title")}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.dailyGoal.subtitle")}</p>
              {personalNote?.trim() ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{personalNote.trim()}</p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("learner.dailyGoal.streakLabel")}
              </p>
              <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{streakDays}</p>
              <div className="mt-1 h-1 w-full min-w-[4.5rem] overflow-hidden rounded-full bg-[var(--semantic-progress-track)]" aria-hidden>
                <div
                  className="h-full rounded-full nn-progress-fill-semantic-success"
                  style={{ width: `${Math.min(100, streakDays * 8)}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">{t("learner.dailyGoal.progressLabel")}</span>
              <span className="tabular-nums text-muted-foreground">
                {t("learner.dailyGoal.credits", { n: todayGoal.credits, target: todayGoal.target })}
              </span>
            </div>
            <div
              className="nn-progress-track-semantic nn-progress-track-semantic--md"
              role="progressbar"
              aria-valuenow={todayGoal.credits}
              aria-valuemin={0}
              aria-valuemax={todayGoal.target}
            >
              <div
                className="nn-progress-fill-semantic-brand transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <li className={todayGoal.breakdown.hasExamActivity ? "text-foreground" : ""}>
                {todayGoal.breakdown.hasExamActivity ? "✓ " : "○ "}
                {t("learner.dailyGoal.signal.exam")}
              </li>
              <li className={todayGoal.breakdown.hasPracticeCompleted ? "text-foreground" : ""}>
                {todayGoal.breakdown.hasPracticeCompleted ? "✓ " : "○ "}
                {t("learner.dailyGoal.signal.practice")}
              </li>
              <li className={todayGoal.breakdown.hasLessonTouch ? "text-foreground" : ""}>
                {todayGoal.breakdown.hasLessonTouch ? "✓ " : "○ "}
                {t("learner.dailyGoal.signal.lesson")}
              </li>
            </ul>
          </div>

          {showStreakProtectNudge && !complete ? (
            <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs text-[var(--semantic-warning-contrast)]">
              {t("learner.retention.streakProtectShort")}
            </p>
          ) : null}

          {complete ? (
            <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-3 py-2 text-sm text-[var(--semantic-success-contrast)]">
              {t("learner.dailyGoal.complete")}
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">{t("learner.dailyGoal.encourage")}</p>
          )}

          <LearnerDailyGoalCelebrationClient
            utcDate={todayGoal.utcDate}
            complete={complete}
            message={t("learner.dailyGoal.microReward")}
          />

          {focusTopic?.trim() ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{t("learner.dailyGoal.improvePrefix")} </span>
              {t("learner.dailyGoal.improveTopic", { topic: focusTopic.trim() })}
            </p>
          ) : null}

          {momentumLine ? (
            <p className="border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{t("learner.dailyGoal.momentumPrefix")} </span>
              {momentumLine}
            </p>
          ) : null}

          <p className="text-[10px] text-muted-foreground/90">{t("learner.dailyGoal.utcNote")}</p>
        </div>

        <div className="nn-semantic-inset--cool flex min-w-[min(100%,16rem)] flex-col gap-2 rounded-xl p-4 lg:max-w-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.dailyGoal.resumeHeading")}
          </p>
          {resume ? (
            <Link
              href={resume.href}
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline [overflow-wrap:anywhere]"
            >
              {resume.title}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">{t("learner.dailyGoal.resumeFallback")}</p>
          )}
          <Link
            href="/app/questions"
            className="mt-1 inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {t("learner.dailyGoal.resumeAlt")}
          </Link>
        </div>
      </div>
    </section>
  );
}
