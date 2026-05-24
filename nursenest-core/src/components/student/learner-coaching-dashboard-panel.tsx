"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  composeDashboardOrchestrationV3,
  type DashboardOrchestrationV3,
} from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
import { recordCoachingTelemetry } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";
import { GovernedNextActionLink } from "@/components/educational-graph/governed-next-action-link";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import { nextActionFromGraphStep } from "@/lib/educational-graph/graph-step-next-action";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

const TONE_CLASS: Record<DashboardOrchestrationV3["cards"][0]["tone"], string> = {
  momentum: "nn-semantic-inset--positive",
  alert: "nn-semantic-inset--warning",
  pacing: "nn-semantic-inset--cool",
  remediation: "nn-semantic-inset--warm",
  neutral: "border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
};

/**
 * Dashboard orchestration V3 — graph-substrate cards when pathway is known; governed graph telemetry on CTAs.
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
        className="nn-coaching-dashboard-reserve nn-dash-section"
        aria-busy="true"
        aria-label="Study intelligence loading"
      >
        <div className="nn-skeleton nn-skeleton-shimmer mb-3 h-3 w-32 rounded-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="nn-skeleton nn-skeleton-shimmer min-h-[5.5rem] rounded-2xl" />
          <div className="nn-skeleton nn-skeleton-shimmer min-h-[5.5rem] rounded-2xl" />
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
      className="space-y-3"
      data-nn-learner-coaching-dashboard=""
      aria-labelledby="learner-coaching-dashboard-heading"
    >
      <h2
        id="learner-coaching-dashboard-heading"
        className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-brand)]"
      >
        Study intelligence
      </h2>
      {orch.feed?.headline ? (
        <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{orch.feed.headline}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {orch.cards.map((card) => {
          const graphStep = actionByCardId.get(card.id);
          const cta =
            card.href && graphStep ? (
              <GovernedNextActionLink
                action={nextActionFromGraphStep(graphStep)}
                graphStep={graphStep}
                sourceSurface="dashboard_feed"
                className="nn-btn-secondary mt-3 inline-flex min-h-[2.5rem] items-center rounded-lg px-3 text-xs font-semibold"
              >
                Continue
              </GovernedNextActionLink>
            ) : card.href ? (
              <Link
                href={card.href}
                className="nn-btn-secondary mt-3 inline-flex min-h-[2.5rem] items-center rounded-lg px-3 text-xs font-semibold"
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
                Continue
              </Link>
            ) : null;

          return (
            <article
              key={card.id}
              className={`rounded-2xl p-4 ${TONE_CLASS[card.tone]}`}
            >
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{card.title}</h3>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{card.body}</p>
              {cta}
            </article>
          );
        })}
      </div>
    </section>
  );
}
