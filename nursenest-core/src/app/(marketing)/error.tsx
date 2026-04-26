"use client";

import { useEffect } from "react";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";
import {
  logMarketingRouteErrorClient,
  shouldUseMarketingHomeSafeModeFromError,
} from "@/lib/marketing/marketing-home-safe-mode-triggers";

const ERROR_BOUNDARY_SOURCE = "src/app/(marketing)/error.tsx:MarketingSegmentError";

export default function MarketingSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      const stack =
        typeof error?.stack === "string" ? error.stack.slice(0, 12_000) : undefined;
      console.error(
        "[nn-homepage-error-boundary]",
        JSON.stringify({
          boundary: ERROR_BOUNDARY_SOURCE,
          name: error?.name,
          message: error?.message,
          digest: error?.digest,
          stack,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [error]);

  logMarketingRouteErrorClient("marketing_segment_error_tsx", error);

  if (shouldUseMarketingHomeSafeModeFromError(error)) {
    return <MarketingHomeSafeMode layout="embedded" onRetry={reset} />;
  }

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