"use client";

/**
 * SpacedReviewReminder — dashboard card showing flashcards due for review.
 *
 * Fetches the flashcard due summary and displays a calm, supportive nudge
 * when cards are due or overdue. Integrates with the spaced repetition
 * engine (SM-2 scheduler) that already exists for flashcards.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Layers, ArrowRight, Clock } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

interface DueSummary {
  dueToday: number;
  overdue: number;
  learning: number;
}

type SpacedReviewState = "loading" | DueSummary | "empty";

export function SpacedReviewReminder() {
  const [state, setState] = useState<SpacedReviewState>("loading");

  const fetchDue = useCallback(async () => {
    try {
      const res = await fetch("/api/flashcards/due-summary");
      if (!res.ok) {
        setState("empty");
        return;
      }
      const json = await res.json();
      const summary: DueSummary = {
        dueToday: json.dueToday ?? 0,
        overdue: json.overdue ?? 0,
        learning: json.learning ?? 0,
      };
      const total = summary.dueToday + summary.overdue;
      setState(total === 0 ? "empty" : summary);
    } catch {
      setState("empty");
    }
  }, []);

  useEffect(() => {
    const run = () => void fetchDue();
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(run, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 0);
    return () => window.clearTimeout(t);
  }, [fetchDue]);

  if (state === "loading") {
    return (
      <div
        className="nn-spaced-review-reserve nn-engagement-nudge rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] p-4"
        aria-busy="true"
        aria-label="Flashcard review reminder loading"
      >
        <div className="nn-skeleton nn-skeleton-shimmer h-4 w-40 rounded-full" />
        <div className="nn-skeleton nn-skeleton-shimmer mt-3 h-3 w-full max-w-sm rounded-full" />
      </div>
    );
  }

  if (state === "empty") {
    return <div className="nn-spaced-review-reserve nn-spaced-review-reserve--settled" aria-hidden />;
  }

  const data = state;
  const total = data.dueToday + data.overdue;

  const isOverdue = data.overdue > 0;

  return (
    <div
      className="nn-engagement-nudge"
      role="status"
      aria-label="Flashcard review reminder"
    >
      <div
        className="nn-engagement-nudge__icon"
        style={{
          background: isOverdue
            ? "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))"
            : "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
          color: isOverdue ? "var(--semantic-warning)" : "var(--semantic-info)",
        }}
      >
        {isOverdue ? <Clock className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
      </div>

      <div className="nn-engagement-nudge__content">
        <p className="nn-engagement-nudge__title">
          {total} flashcard{total === 1 ? "" : "s"} due for review
        </p>
        <p className="nn-engagement-nudge__body">
          {isOverdue
            ? `${data.overdue} overdue. Review now to keep your memory sharp.`
            : "Spaced repetition works best when you review on schedule."}
        </p>
        <Link
          href="/app/flashcards"
          onClick={() =>
            trackClientEvent("spaced_review_reminder_clicked", {
              due_today: data.dueToday,
              overdue: data.overdue,
            })
          }
          className="nn-engagement-nudge__cta"
          style={{ color: isOverdue ? "var(--semantic-warning)" : "var(--semantic-info)" }}
        >
          Review Cards
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
