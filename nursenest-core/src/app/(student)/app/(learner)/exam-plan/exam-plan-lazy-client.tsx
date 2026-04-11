"use client";

/**
 * ExamPlanLazyClient
 *
 * Lazy-loads secondary dashboard sections after initial server render.
 * Prevents the initial page load from being blocked by slower queries.
 *
 * Sections lazy-loaded here:
 *   - SavedForReviewSection (notes/bookmarks/rationales)
 *   - ProgressTrendCard (readiness score history)
 *
 * Uses server actions from actions.ts — all queries remain server-side.
 */

import { useCallback } from "react";
import { SavedForReviewSection } from "@/components/study/saved-for-review-section";
import { ProgressTrendCard } from "@/components/study/progress-trend-card";
import { loadExamPlanNotesAction, loadExamPlanTrendAction } from "./actions";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import type { TrendPoint } from "@/components/study/progress-trend-card";

type Props = {
  readiness: CoachPageData["readiness"];
  initialTrendPoints?: TrendPoint[];
};

export function ExamPlanLazyClient({ readiness, initialTrendPoints = [] }: Props) {
  const loadNotes = useCallback(() => loadExamPlanNotesAction(), []);

  return (
    <div className="space-y-8">
      {/* Recent Progress / Trend */}
      <section aria-labelledby="recent-progress-heading">
        <h2
          id="recent-progress-heading"
          className="mb-4 text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Your Recent Progress
        </h2>
        <ProgressTrendCard trendPoints={initialTrendPoints} readiness={readiness} />
      </section>

      {/* Saved for Review */}
      <SavedForReviewSection loadAction={loadNotes} />
    </div>
  );
}
