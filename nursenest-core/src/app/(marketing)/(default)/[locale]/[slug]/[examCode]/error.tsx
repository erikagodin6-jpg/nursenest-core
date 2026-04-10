"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

/**
 * Granular boundary for the exam hub segment (`/[country]/[role]/[exam]/…`).
 * Keeps the marketing shell and nav usable when a sub-page throws.
 */
export default function ExamPathwaySegmentError({
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
      surface="exam_pathway_segment"
      title="This exam page couldn't load"
      description="Try again, open the home page, or use the main navigation to pick your exam track."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
