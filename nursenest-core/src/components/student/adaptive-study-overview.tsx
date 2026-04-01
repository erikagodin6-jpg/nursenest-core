import Link from "next/link";
import { Compass, Target } from "lucide-react";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";

function paceLabel(p: AdaptiveLearnerRecommendations["paceStatus"]): string {
  switch (p) {
    case "on_pace":
      return "On pace";
    case "slightly_behind":
      return "Room to tighten";
    case "behind_weak_review":
      return "Prioritize weak-topic review";
    case "final_review":
      return "Final review stage";
    default:
      return "Pacing";
  }
}

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
}: {
  adaptive: AdaptiveLearnerRecommendations;
  showHeading?: boolean;
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
  } = adaptive;

  return (
    <section className="nn-card p-6">
      {showHeading ? (
        <div className="flex items-start gap-2">
          <Compass className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Adaptive study plan</h2>
            <p className="mt-1 text-sm text-muted">
              {countdown.primary}
              {countdown.daysRemaining != null && countdown.weeksRemaining != null
                ? ` · ~${countdown.weeksRemaining} week${countdown.weeksRemaining === 1 ? "" : "s"} left`
                : null}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-medium text-foreground">
          {paceLabel(adaptive.paceStatus)}
        </span>
        <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-medium text-foreground">
          {trajectoryLabel(adaptive.trajectory)}
        </span>
        {countdown.urgencyLabel ? (
          <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-primary">{countdown.urgencyLabel}</span>
        ) : null}
      </div>

      {readinessTimelineLine ? <p className="mt-3 text-sm text-muted">{readinessTimelineLine}</p> : null}

      {adaptive.trajectoryLines.length > 0 ? (
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
          {adaptive.trajectoryLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {weakTop3.length > 0 ? (
        <p className="mt-3 text-sm text-foreground">
          <span className="font-medium">Weakest signals right now: </span>
          {weakTop3.join(", ")}
        </p>
      ) : null}

      {holdingBackLabels.length > 0 ? (
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-foreground">What is holding readiness back: </span>
          {holdingBackLabels.join(" · ")}
        </p>
      ) : null}

      <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next best action</p>
        <Link
          href={primaryNext.href}
          className="mt-2 flex items-start gap-2 text-base font-semibold text-[var(--theme-heading-text)] hover:underline"
        >
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>{primaryNext.title}</span>
        </Link>
        <p className="mt-1 text-sm text-muted">{primaryNext.reason}</p>
      </div>

      {secondary.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {secondary.map((s) => (
            <li key={s.href + s.title}>
              <Link href={s.href} className="text-sm font-medium text-primary hover:underline">
                {s.title}
              </Link>
              <span className="text-sm text-muted"> — {s.reason}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            {todayFocus.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">This week</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            {weeklyPriorities.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        NurseNest does not predict pass/fail outcomes. Readiness and trajectory reflect practice signals and time on the calendar,
        not a guarantee.
      </p>
    </section>
  );
}
