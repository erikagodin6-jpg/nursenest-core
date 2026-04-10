"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

/**
 * Isolated error boundary for exam pathway lesson routes.
 * Avoids taking down the whole marketing shell when a lessons page fails.
 */
export default function ExamPathwayLessonsSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="exam_pathway_lessons"
      title="Lessons unavailable"
      description="We couldn't load this lessons page. Try again, or go back to your exam hub."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
