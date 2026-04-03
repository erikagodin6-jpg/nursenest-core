import Link from "next/link";
import { CheckCircle2, Circle, Compass, Flag, Heart, Target } from "lucide-react";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import { retentionPromptHints } from "@/lib/learner/exam-plan-engine";
import { AdaptiveRecommendationLoopPanel } from "@/components/student/adaptive-recommendation-loop-panel";

function trajectoryLabel(t: AdaptiveLearnerRecommendations["trajectory"]): string {
  switch (t) {
    case "building_foundation":
      return "Building foundation";
    case "improving":
      return "Improving";
    case "on_track":
      return "On track";
    case "needs_focused_review":
      return "Needs focused review";
    case "final_review":
      return "Final review phase";
    default:
      return "Trajectory";
  }
}

export function AdaptiveStudyOverview({
  adaptive,
  showHeading = true,
  compact = false,
  /** Subscriber — enables soft retention copy (non-pushy). */
  subscriber = true,
  userId,
}: {
  adaptive: AdaptiveLearnerRecommendations;
  showHeading?: boolean;
  compact?: boolean;
  subscriber?: boolean;
  userId?: string;
}) {
  const {
    countdown,
    primaryNext,
    secondary,
    weeklyPriorities,
    todayFocus,
    readinessTimelineLine,
    weakTop3,
    holdingBackLabels,
    planTrack,
    weeklyPlan,
    recovery,
    milestones,
    cadenceDisplay,
    studyCadencePreference,
  } = adaptive;

  const retention = subscriber
    ? retentionPromptHints({
        planTrack: planTrack.status,
        cadence: studyCadencePreference,
        entitlementTier: "paid",
      })
    : null;

  return (
    <section className="nn-card p-6">
      {showHeading ? (
        <div className="flex items-start gap-2">
          <Compass className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">
              {compact ? "Plan & pacing" : "Your exam plan"}
            </h2>
            {!compact ? (
              <p className="mt-1 text-sm text-muted">
                {countdown.primary}
                {countdown.daysRemaining != null && countdown.weeksRemaining != null
                  ? ` · ~${countdown.weeksRemaining} week${countdown.weeksRemaining === 1 ? "" : "s"} left`
                  : null}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">Weekly targets, pacing, and checkpoints tied to your exam timing.</p>
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-border/70 bg-gradient-to-br from-muted/30 to-transparent p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {planTrack.label}
          </span>
          <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground">
            {trajectoryLabel(adaptive.trajectory)}
          </span>
          <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
            {cadenceDisplay}
          </span>
          {countdown.urgencyLabel ? (
            <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs text-primary">{countdown.urgencyLabel}</span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">{planTrack.headline}</p>
        {planTrack.detail ? <p className="mt-2 text-sm text-muted-foreground">{planTrack.detail}</p> : null}
      </div>

      {readinessTimelineLine ? <p className="mt-3 text-sm text-muted-foreground">{readinessTimelineLine}</p> : null}

      {adaptive.trajectoryLines.length > 0 ? (
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {adaptive.trajectoryLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">This week&apos;s targets</p>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{weeklyPlan.rationale}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Lessons: </span>
              finish ~{weeklyPlan.lessonsToFinish} module{weeklyPlan.lessonsToFinish === 1 ? "" : "s"} when available in your pathway
            </li>
            <li>
              <span className="font-medium text-foreground">Questions: </span>~{weeklyPlan.questionVolume} scored items (bank / drills)
            </li>
            <li>
              <span className="font-medium text-foreground">Flashcards: </span>
              {weeklyPlan.flashcardSessions} short review session{weeklyPlan.flashcardSessions === 1 ? "" : "s"}
            </li>
            <li>
              <span className="font-medium text-foreground">Mocks: </span>
              {weeklyPlan.mockTiming}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Milestones</p>
          <ul className="mt-3 space-y-2">
            {milestones.map((m) => (
              <li key={m.id}>
                <Link
                  href={m.href}
                  className="flex items-start gap-2 rounded-lg border border-transparent px-1 py-0.5 text-sm transition hover:border-border hover:bg-background/60"
                >
                  {m.complete ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                  <span>
                    <span className="font-medium text-foreground">{m.title}</span>
                    <span className="block text-xs text-muted-foreground">{m.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {recovery.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">If things feel tight</p>
          <ul className="mt-2 space-y-2">
            {recovery.map((r) => (
              <li key={r.id} className="rounded-lg border border-border/60 bg-card/50 px-3 py-2">
                <Link href={r.href} className="text-sm font-semibold text-primary hover:underline">
                  {r.title}
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {weakTop3.length > 0 ? (
        <p className="mt-4 text-sm text-foreground">
          <span className="font-medium">Priority review queue: </span>
          {weakTop3.join(", ")}
        </p>
      ) : null}

      {holdingBackLabels.length > 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">What is holding readiness back: </span>
          {holdingBackLabels.join(" · ")}
        </p>
      ) : null}

      <details className="mt-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
        <summary className="cursor-pointer font-medium text-foreground">Why this score?</summary>
        <p className="mt-2 text-xs text-muted-foreground">
          Readiness combines practice accuracy, mock consistency, topic miss concentration, and lesson completion. The same
          factors are shown on your dashboard so recommendations stay consistent.
        </p>
      </details>

      {!compact ? (
        <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next best action</p>
          <Link
            href={primaryNext.href}
            className="mt-2 flex items-start gap-2 text-base font-semibold text-[var(--theme-heading-text)] hover:underline"
          >
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{primaryNext.title}</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{primaryNext.reason}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Primary step: </span>
          <Link href={primaryNext.href} className="font-semibold text-primary underline-offset-2 hover:underline">
            {primaryNext.title}
          </Link>
        </div>
      )}

      {secondary.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {secondary.map((s) => (
            <li key={s.href + s.title}>
              <Link href={s.href} className="text-sm font-medium text-primary hover:underline">
                {s.title}
              </Link>
              <span className="text-sm text-muted-foreground"> · {s.reason}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {userId ? <AdaptiveRecommendationLoopPanel userId={userId} fallbackTopics={weakTop3} /> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {todayFocus.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">This week</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {weeklyPriorities.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {retention ? (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 p-3">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium text-foreground">{retention.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{retention.body}</p>
            <Link href={retention.ctaHref} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
              {retention.ctaHref.includes("pricing") ? "View plans" : "Open suggested area →"}
            </Link>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-muted-foreground">
        <Flag className="mr-1 inline h-3 w-3" aria-hidden />
        NurseNest does not predict pass/fail outcomes. Plans reflect practice signals and your calendar. Adjust anytime.
      </p>
    </section>
  );
}
