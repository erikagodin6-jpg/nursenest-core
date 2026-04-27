"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";
import { errorBoundaryDescription, isLikelyTransientBoundaryError } from "@/lib/runtime/error-boundary-copy";

export default function BlogIndexError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useMarketingRouteErrorDiagnostics("marketing_blog_index_error_tsx", error);
  const isTransient = isLikelyTransientBoundaryError(error);

  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="marketing_blog_index"
      marketingErrorTelemetry
      title={isTransient ? "Just a moment" : "Blog could not load"}
      description={errorBoundaryDescription({
        error,
        fallback: isTransient
          ? "We’re loading the blog. Try again in a moment, or head home and come back when you’re ready."
          : "The blog hit an unexpected error. It has been logged so we can fix it.",
      })}
      primaryAction={{ label: "Home", href: "/" }}
      secondaryAction={{ label: "Exam lessons", href: "/lessons" }}
    />
  );
}
