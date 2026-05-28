"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  composeDashboardOrchestrationV3,
  type DashboardOrchestrationV3,
} from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
import { recordCoachingTelemetry } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";
import { GovernedNextActionLink } from "@/components/educational-graph/governed-next-action-link";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import { nextActionFromGraphStep } from "@/lib/educational-graph/graph-step-next-action";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

const TONE_ACCENT: Record<DashboardOrchestrationV3["cards"][0]["tone"], string> = {
  momentum: "var(--semantic-success)",
  alert: "var(--semantic-warning)",
  pacing: "var(--semantic-info)",
  remediation: "var(--semantic-chart-4)",
  neutral: "var(--semantic-brand)",
};

const TONE_PRIORITY: Record<DashboardOrchestrationV3["cards"][0]["tone"], string> = {
  momentum: "Momentum",
  alert: "Priority",
  pacing: "Pacing",
  remediation: "Remediation",
  neutral: "Coach tip",
};

/**
 * Premium AI clinical coach — prioritized action cards with clear hierarchy.
 */
export function LearnerCoachingDashboardPanel() {
  const [orch, setOrch] = useState<DashboardOrchestrationV3 | null | undefined>(undefined);

  useEffect(() => {
    const run = () => {
      const composed = composeDashboardOrchestrationV3();
      if (composed.cards.length > 0 || composed.feed) {
        setOrch(composed);
        const emit = () => {
          recordCoachingTelemetry("coaching_report_generated", {
            surface: "dashboard_v3",
            card_count: composed.cards.length,
            remediation_fatigue: composed.remediationFatigue,
            graph_authoritative: Boolean(composed.graphActions?.length),
          });
        };
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(emit, { timeout: 4000 });
        } else {
          window.setTimeout(emit, 0);
        }
      } else {
        setOrch(null);
      }
    };
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (orch === undefined) {
    return (
      <section
        className="nn-coaching-dashboard-reserve nn-dash-section min-w-0"
        aria-busy="true"
        aria-label="Study intelligence loading"
      >
        <div className="nn-skeleton nn-skeleton-shimmer mb-3 h-3 w-32 rounded-full" />
        <div className="nn-coaching-command-center__grid">
          <div className="nn-skeleton nn-skeleton-shimmer min-h-[8rem] rounded-2xl" />
          <div className="nn-skeleton nn-skeleton-shimmer min-h-[8rem] rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!orch || (orch.cards.length === 0 && !orch.feed)) {
    return <div className="nn-coaching-dashboard-reserve nn-coaching-dashboard-reserve--settled" aria-hidden />;
  }

  const actionByCardId = new Map<string, EduGraphStep>(
    (orch.graphActions ?? []).map((a) => [`graph-${a.stepId}`, a.step] as const),
  );

  return (
    <section
      className="nn-coaching-command-center min-w-0 min-h-0"
      data-nn-learner-coaching-dashboard=""
      aria-labelledby="learner-coaching-dashboard-heading"
    >
      <div className="nn-coaching-command-center__header min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
            aria-hidden
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 id="learner-coaching-dashboard-heading" className="nn-coaching-command-center__title">
              Clinical study coach
            </h2>
            <p className="nn-coaching-command-center__subtitle">
              {orch.feed?.headline ??
                "Personalized next steps based on your practice patterns, weak areas, and exam trajectory."}
            </p>
          </div>
        </div>
      </div>

      <div className="nn-coaching-command-center__grid min-w-0 min-h-0">
        {orch.cards.map((card) => {
          const graphStep = actionByCardId.get(card.id);
          const accent = TONE_ACCENT[card.tone];
          const cta =
            card.href && graphStep ? (
              <GovernedNextActionLink
                action={nextActionFromGraphStep(graphStep)}
                graphStep={graphStep}
                sourceSurface="dashboard_feed"
                className="nn-btn-secondary mt-2 inline-flex min-h-[2.75rem] items-center rounded-lg px-4 text-xs font-semibold"
              >
                Start now
              </GovernedNextActionLink>
            ) : card.href ? (
              <Link
                href={card.href}
                className="nn-btn-secondary mt-2 inline-flex min-h-[2.75rem] items-center rounded-lg px-4 text-xs font-semibold"
                onClick={() => {
                  void captureGovernedGraphTelemetry({
                    event: "graph_step_clicked",
                    topicSlug: "dashboard",
                    sourceSurface: "dashboard_feed",
                    pathwayId: orch.learnerState?.pathwayId ?? null,
                  });
                  recordCoachingTelemetry("remediation_cta_clicked", {
                    surface: "dashboard_v3",
                    card_id: card.id,
                  });
                }}
              >
                Start now
              </Link>
            ) : null;

          return (
            <article
              key={card.id}
              className="nn-coaching-action-card min-w-0 min-h-0"
              style={{ ["--coaching-accent" as string]: accent }}
            >
              <span className="nn-coaching-action-card__priority">{TONE_PRIORITY[card.tone]}</span>
              <h3 className="nn-coaching-action-card__title">{card.title}</h3>
              <p className="nn-coaching-action-card__body nn-dash-report-copy">{card.body}</p>
              {cta}
            </article>
          );
        })}
      </div>
    </section>
  );
}
