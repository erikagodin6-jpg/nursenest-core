"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

/**
 * Marketing route group error surface: never a blank screen.
 * Keeps as much shell chrome as possible via the parent layout.
 * Sentry capture + console.error are handled inside NnErrorCard.
 */
export default function MarketingSegmentError({
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
      surface="marketing_segment"
      title="Just a moment"
      description="We’re having a temporary hiccup on this page. Try again in a moment, or continue browsing below."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
