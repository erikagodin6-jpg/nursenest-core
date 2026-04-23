import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  ListTodo,
  Sparkles,
} from "lucide-react";
import type { StudyPlannerContext } from "@/lib/learner/load-study-planner-context";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import { StudyPlanToolGateway } from "@/components/student/study-plan-tool-gateway";

function pctDone(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export function StudyPlannerShell({ ctx }: { ctx: StudyPlannerContext }) {
  const d = ctx.dashboard;
  const pathwayRows = ctx.pathwaySummaries.rows;
  const pathwayLoadFailed = ctx.pathwaySummaries.status !== "ok";
  const weak = d?.topicPerformanceReliable === false ? [] : (d?.weakTopics?.slice(0, 4) ?? []);
  const declineTrend =
    d?.topicPerformanceReliable === false ? undefined : d?.topicTrends?.find((t) => t.momentum === "declining");
  const topPath =
    pathwayRows.length > 0
      ? [...pathwayRows].sort(
          (a, b) => pctDone(a.lessonsCompleted, a.lessonsTotal) - pctDone(b.lessonsCompleted, b.lessonsTotal),
        )[0]
      : null;

  const minutes = ctx.dailyStudyMinutes ?? 45;
  const focus = ctx.examFocus?.trim() || "your exam";
  const readiness = d?.readiness;

  const todaySteps = [
    pathwayLoadFailed
      ? "Pathway lesson totals are temporarily unavailable — open Lessons from the nav and continue your track; retry this planner after refresh."
      : declineTrend
        ? `Stabilize “${declineTrend.topic}” first. Recent misses cluster here; use rationales, then 10–15 questions.`
        : weak[0]
          ? `Drill “${weak[0].topic}” in the question bank (15–20 min).`
          : `Open the question bank and run a 20-item block aligned to ${focus}.`,
    pathwayLoadFailed
      ? "When pathway totals load again, we’ll line up the next lesson module for your tier (30–45 min)."
      : topPath
        ? `Advance “${topPath.shortLabel}”: ${topPath.lessonsCompleted}/${topPath.lessonsTotal} lessons in your plan.`
        : `Work one lesson module in your tier (30–45 min).`,
    `Review rationales on misses. Aim for ${minutes} minutes total study today.`,
  ];

  return (
    <div className="space-y-10">
      {(pathwayLoadFailed || d?.topicPerformanceReliable === false) && (
        <LearnerSilentSectionDegradedFallback surfaceName="study-planner" />
      )}
      <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.1] via-[var(--theme-card-bg)] to-[var(--theme-page-bg)] p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Study planner</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            Structured prep for your exam
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--theme-body-text)]/85">
            Plans respect your <span className="font-semibold">{d?.scope.tier ?? "tier"}</span>{" "}
            <span className="font-semibold">{d?.scope.country ?? ""}</span> content scope. Prioritize weak topics from
            practice data, then layer in lessons and mocks.
          </p>
          {readiness ? (
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--theme-body-text)]">
              <span className="font-semibold text-foreground">Readiness</span>
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-semibold">
                {readinessBandLabel(readiness.band)}
              </span>
              {readiness.score !== null ? (
                <span className="tabular-nums text-muted-foreground">
                  Score {readiness.score}/100 · {readiness.confidence} confidence
                  {readiness.calibratedPreview ? " · conservative calibration active" : ""}
                </span>
              ) : (
                <span className="text-muted-foreground">Score not shown yet. Complete more practice or a mock.</span>
              )}
              <Link href="/app" className="text-primary underline-offset-4 hover:underline">
                Details on dashboard
              </Link>
            </p>
          ) : null}
        </div>
      </header>

      <section className="nn-card p-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Today&apos;s plan</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Suggested order. Adjust to your shift schedule.</p>
        <ol className="mt-5 space-y-3">
          {todaySteps.map((step, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border/60 bg-muted/15 px-4 py-3 text-sm leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-role-cta text-xs font-bold text-role-cta-foreground">
                {i + 1}
              </span>
              <span className="text-[var(--theme-body-text)]">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          {weak[0] ? (
            <Link
              href={remediationTopicDrillHref(weak[0].topic)}
              className="inline-flex items-center rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] hover:bg-role-cta-hover"
            >
              Start priority review drill
            </Link>
          ) : null}
          <Link
            href="/app/lessons"
            className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
          >
            Open lessons
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="nn-card p-6">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">By exam pathway</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Completed vs available in your plan.</p>
          <ul className="mt-4 space-y-3">
            {pathwayRows.map((p) => {
              const pct = pctDone(p.lessonsCompleted, p.lessonsTotal);
              const remaining = Math.max(0, p.lessonsTotal - p.lessonsCompleted);
              return (
                <li key={p.pathwayId} className="rounded-xl border border-border/50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{p.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {p.lessonsCompleted}/{p.lessonsTotal}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-role-success transition-[width]" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{remaining} lesson(s) remaining in scope.</p>
                </li>
              );
            })}
          </ul>
          {pathwayLoadFailed ? (
            <p className="mt-4 text-sm text-muted-foreground">
              We could not load pathway lesson totals. Refresh the page — an empty list here does not mean your plan has no pathways.
            </p>
          ) : pathwayRows.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No pathway lessons match your current plan.</p>
          ) : null}
        </section>

        <section className="nn-card p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-role-heat-text" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Priority review queue</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">From recent mock performance (scoped questions only).</p>
          {d?.topicPerformanceReliable === false ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Weak-topic recommendations are unavailable until topic performance reloads. This is not the same as having no weak areas.
            </p>
          ) : weak.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {weak.map((w) => (
                <li key={w.topic} className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-foreground">{w.topic}</span>
                  <Link
                    href={remediationTopicDrillHref(w.topic)}
                    className="shrink-0 text-xs font-semibold text-primary hover:underline"
                  >
                    Topic drill
                  </Link>
                  <Link href={remediationWeakModeTestHref(w.topic)} className="shrink-0 text-xs font-semibold text-primary hover:underline">
                    Weak-mode test
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No weak-topic data yet. Complete a timed mock to populate this list.
            </p>
          )}
        </section>
      </div>

      <section className="nn-card p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Next steps</h2>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="flex items-start gap-2 text-sm text-[var(--theme-body-text)]">
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              {ctx.studyGoal
                ? `Goal: ${ctx.studyGoal}. Align today’s block to that outcome.`
                : "Set a goal in your profile during onboarding to personalize nudges."}
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm text-[var(--theme-body-text)]">
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              {topPath
                ? `Finish the next lesson in ${topPath.shortLabel}, then run a 20-question quiz on the same topic.`
                : "Alternate lessons and question blocks during the week to consolidate."}
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm text-[var(--theme-body-text)]">
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>Schedule one full practice exam weekly. Use the score to reorder weak-topic drills.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">AI plan assistant</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Optional: generate a JSON study outline when <code className="rounded bg-muted px-1">AI_STUDY_PLAN_ENABLED=true</code> and
          an API key are configured. Your structured plan above stays the source of truth for scope.
        </p>
        <StudyPlanToolGateway />
      </section>
    </div>
  );
}
