"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";

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
  useMarketingRouteErrorDiagnostics("exam_pathway_segment_error_tsx", error);

  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="exam_pathway_segment"
      marketingErrorTelemetry
      title="Just a moment"
      description="We’re loading this exam section. Try again in a moment, or pick another track from home or the pathways list."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
