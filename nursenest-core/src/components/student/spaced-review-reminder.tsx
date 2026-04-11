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

export function SpacedReviewReminder() {
  const [data, setData] = useState<DueSummary | null>(null);

  const fetchDue = useCallback(async () => {
    try {
      const res = await fetch("/api/flashcards/due-summary");
      if (!res.ok) return;
      const json = await res.json();
      setData({
        dueToday: json.dueToday ?? 0,
        overdue: json.overdue ?? 0,
        learning: json.learning ?? 0,
      });
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    fetchDue();
  }, [fetchDue]);

  if (!data) return null;

  const total = data.dueToday + data.overdue;
  if (total === 0) return null;

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
            ? `${data.overdue} overdue — review now to keep your memory strong.`
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
