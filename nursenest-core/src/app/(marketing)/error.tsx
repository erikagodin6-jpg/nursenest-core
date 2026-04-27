"use client";

import { useEffect } from "react";
import { NnErrorCard } from "@/components/error/nn-error-card";
import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";
import {
  logMarketingRouteErrorClient,
  shouldUseMarketingHomeSafeModeFromError,
} from "@/lib/marketing/marketing-home-safe-mode-triggers";

export default function MarketingSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const shouldLog =
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_NN_DEBUG_HOMEPAGE === "1";
    if (shouldLog) {
      try {
        console.error(
          "[NN_HOMEPAGE_REAL_CRASH]",
          JSON.stringify({
            boundary: "marketing_segment_error_tsx",
            pathname: typeof window !== "undefined" ? window.location.pathname : null,
            name: error?.name,
            message: error?.message,
            digest: error?.digest,
            stack: error?.stack,
            componentStack: null,
          }),
        );
      } catch {
        /* ignore */
      }
    }
    logMarketingRouteErrorClient("marketing_segment_error_tsx", error);
  }, [error]);

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
