"use client";

import Link from "next/link";
import type { PracticeTestConfigJson, PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

export type PracticeAdaptivePostMissPayload = {
  trigger: string;
  suggestedSurfaceOrder: string[];
  recommendations: {
    rankedWeakTopics: Array<{ topicKey: string; urgencyScore: number }>;
    lessons: Array<{ slug: string; title: string; topicKey: string }>;
    usedEmptyFallback: boolean;
    fallbackReason?: string;
    practiceCat: {
      topicKeys: readonly string[];
      suggestStudyModeReview: boolean;
      catPoolSurfaceAvailable: boolean;
    };
  };
};

export function PracticeAdaptivePostMissPanel(props: {
  payload: PracticeAdaptivePostMissPayload;
  testConfig: PracticeTestConfigJson | null;
  pathwaySurface: PracticeTestPathwayClientShell | null;
  tx: (key: string, fallback: string) => string;
}) {
  const { payload, testConfig, pathwaySurface, tx } = props;
  const pid = testConfig?.pathwayId ?? pathwaySurface?.id ?? "";
  return (
    <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))] p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-chart-2)]">
        {tx("learner.studyHome.sectionMomentumTitle", "Adaptive next steps")}
      </p>
      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
        {payload.recommendations.usedEmptyFallback
          ? tx("learner.studyHome.sectionAttentionIntro", "Keep building signals with graded practice.")
          : tx("learner.studyHome.sectionMomentumIntro", "Drill weak topics next, then mixed review.")}
      </p>
      {payload.recommendations.lessons.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {payload.recommendations.lessons.slice(0, 3).map((l) => {
            const href =
              pid.length > 0
                ? `/app/lessons/${encodeURIComponent(l.slug)}?pathwayId=${encodeURIComponent(pid)}`
                : `/app/lessons/${encodeURIComponent(l.slug)}`;
            return (
              <li key={l.slug}>
                <Link className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline" href={href}>
                  {l.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--semantic-text-muted)]">
        {payload.suggestedSurfaceOrder.join(" -> ")}
      </p>
    </div>
  );
}
