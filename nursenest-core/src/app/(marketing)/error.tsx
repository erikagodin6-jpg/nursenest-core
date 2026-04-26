"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";
import { shouldUseMarketingHomeSafeModeFromError } from "@/lib/marketing/marketing-home-safe-mode-triggers";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";

export default function MarketingSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useMarketingRouteErrorDiagnostics("marketing_segment_error_tsx", error);

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
