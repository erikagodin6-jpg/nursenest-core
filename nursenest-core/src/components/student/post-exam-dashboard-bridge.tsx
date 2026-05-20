"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearDashboardFeedSession,
  readDashboardFeedFromSession,
} from "@/lib/learner/post-exam-coaching/dashboard-feed";
import type { PostExamDashboardFeed } from "@/lib/learner/post-exam-coaching/types";

/**
 * Surfaces the latest post-exam coaching feed on the learner dashboard (session-scoped).
 */
export function PostExamDashboardBridgeBanner() {
  const [feed, setFeed] = useState<PostExamDashboardFeed | null>(null);

  useEffect(() => {
    setFeed(readDashboardFeedFromSession());
  }, []);

  if (!feed) return null;

  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))] p-4 sm:p-5"
      data-nn-post-exam-dashboard-bridge=""
      aria-labelledby="post-exam-bridge-heading"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
        From your latest session
      </p>
      <h2 id="post-exam-bridge-heading" className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">
        {feed.headline}
      </h2>
      {feed.reassessmentPrompt ? (
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{feed.reassessmentPrompt}</p>
      ) : null}
      {feed.weakTopics.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
          Focus: {feed.weakTopics.slice(0, 3).join(", ")}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={feed.primaryHref}
          className="nn-btn-primary inline-flex min-h-[2.75rem] items-center rounded-lg px-4 text-sm font-semibold"
        >
          Continue remediation
        </Link>
        <button
          type="button"
          className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-4 text-sm font-semibold"
          onClick={() => {
            clearDashboardFeedSession();
            setFeed(null);
          }}
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
