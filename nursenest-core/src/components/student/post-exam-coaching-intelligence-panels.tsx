"use client";

import Link from "next/link";
import { GovernedCoachingRemediationLink } from "@/components/educational-graph/governed-coaching-remediation-link";
import { buildTimingInsightCards } from "@/lib/learner/rn-coaching-intelligence/timing-insights-ui";
import { groupReasoningByEmphasis, summarizeReasoningForUi } from "@/lib/learner/rn-coaching-intelligence/reasoning-insights-ui";
import type { RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";

type CoachingIntel = PostExamCoachingReport & Partial<RnCoachingIntelligenceReport>;

export function PostExamCoachingIntelligencePanels({ coaching }: { coaching: CoachingIntel }) {
  const timingV2 = coaching.timingV2;
  const learnerState = coaching.learnerState;
  const timingCards = timingV2
    ? buildTimingInsightCards({
        timing: timingV2,
        reliability: coaching.readinessReliability.level,
      })
    : [];

  const reasoning = summarizeReasoningForUi(coaching.clinicalJudgment);
  const { focusAreas } = groupReasoningByEmphasis(reasoning);

  const competencyClusters =
    learnerState?.competencyStates
      .filter((c) => c.persistentWeak || c.masteryScore < 55)
      .slice(0, 5) ?? [];

  const trajectory =
    learnerState && learnerState.readinessTrajectory.length >= 2
      ? learnerState.readinessTrajectory
      : null;

  if (
    !timingCards.length &&
    !focusAreas.length &&
    competencyClusters.length === 0 &&
    !trajectory
  ) {
    return null;
  }

  return (
    <div className="space-y-4" data-nn-coaching-intelligence-panels="">
      {trajectory ? (
        <section
          className="nn-post-exam-report__section nn-semantic-inset--info"
          aria-labelledby="post-exam-trajectory-heading"
        >
          <h2 id="post-exam-trajectory-heading" className="nn-cat-results__section-title">
            Readiness trajectory
          </h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Recent sessions: {trajectory.map((s) => `${Math.round(s)}%`).join(" → ")}
            {coaching.certaintyTier === "observation"
              ? " — treat as directional until more sessions complete."
              : null}
          </p>
        </section>
      ) : null}

      {competencyClusters.length > 0 ? (
        <section
          className="nn-post-exam-report__section"
          aria-labelledby="post-exam-competency-clusters-heading"
        >
          <h2 id="post-exam-competency-clusters-heading" className="nn-cat-results__section-title">
            Competency focus
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {competencyClusters.map((c) => (
              <li
                key={c.competencyId}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
              >
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {c.competencyId.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                  Mastery {Math.round(c.masteryScore)}% · {c.volatility} ·{" "}
                  {c.persistentWeak ? "continuing focus" : "building"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {timingCards.length > 0 ? (
        <section
          className="nn-post-exam-report__section nn-semantic-inset--cool"
          aria-labelledby="post-exam-timing-v2-heading"
        >
          <h2 id="post-exam-timing-v2-heading" className="nn-cat-results__section-title">
            Pacing & hesitation
          </h2>
          <ul className="mt-3 space-y-3">
            {timingCards.map((card) => (
              <li
                key={card.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3"
              >
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{card.title}</p>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{card.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {focusAreas.length > 0 ? (
        <section
          className="nn-post-exam-report__section"
          aria-labelledby="post-exam-reasoning-heading"
        >
          <h2 id="post-exam-reasoning-heading" className="nn-cat-results__section-title">
            Reasoning patterns
          </h2>
          <ul className="mt-3 space-y-2">
            {focusAreas.map((r) => (
              <li key={r.patternLabel} className="text-sm text-[var(--semantic-text-secondary)]">
                <span className="font-semibold text-[var(--semantic-text-primary)]">{r.patternLabel}</span>
                {r.nclexLayer ? (
                  <span className="ml-2 text-xs text-[var(--semantic-text-muted)]">({r.nclexLayer})</span>
                ) : null}
                — {r.guidance}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {coaching.recommendations.some((r) => r.graphStep) ? (
        <section
          className="nn-post-exam-report__section nn-semantic-inset--warm"
          aria-labelledby="post-exam-remediation-ladder-heading"
        >
          <h2 id="post-exam-remediation-ladder-heading" className="nn-cat-results__section-title">
            Remediation ladder
          </h2>
          <ol className="mt-3 space-y-2">
            {coaching.recommendations
              .filter((r) => r.graphStep)
              .map((r, idx) => (
                <li key={r.exposureKey} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-info)]">
                    {idx + 1}
                  </span>
                  <GovernedCoachingRemediationLink
                    recommendation={r}
                    className="font-semibold text-[var(--semantic-brand)] hover:underline"
                  >
                    {r.title}
                  </GovernedCoachingRemediationLink>
                  <span className="text-[var(--semantic-text-muted)]">— {r.reason}</span>
                </li>
              ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
