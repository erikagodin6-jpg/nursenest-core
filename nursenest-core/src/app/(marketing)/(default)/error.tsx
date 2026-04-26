"use client";

import { useEffect } from "react";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";
import {
  logMarketingRouteErrorClient,
  shouldUseMarketingHomeSafeModeFromError,
} from "@/lib/marketing/marketing-home-safe-mode-triggers";

export default function MarketingDefaultSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logMarketingRouteErrorClient("marketing_default_segment_error_tsx", error);
  }, [error]);

  if (shouldUseMarketingHomeSafeModeFromError(error)) {
    return <MarketingHomeSafeMode layout="embedded" onRetry={reset} />;
  }

  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="marketing_default"
      title="Just a moment"
      description="We’re loading this page. If it doesn’t appear, try again in a moment — or pick a study track below."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
