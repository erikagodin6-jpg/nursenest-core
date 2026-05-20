"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";
import { errorBoundaryDescription, isLikelyTransientBoundaryError } from "@/lib/runtime/error-boundary-copy";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useMarketingRouteErrorDiagnostics("marketing_blog_post_error_tsx", error);
  const isTransient = isLikelyTransientBoundaryError(error);

  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="marketing_blog_post"
      marketingErrorTelemetry
      title={isTransient ? "Just a moment" : "Article could not load"}
      description={errorBoundaryDescription({
        error,
        fallback: isTransient
          ? "We’re loading this article. Try again in a moment, or browse the blog from the link below."
          : "This article hit an unexpected error. It has been logged so we can fix it.",
      })}
      primaryAction={{ label: "Blog", href: "/blog" }}
      secondaryAction={{ label: "Home", href: "/" }}
    />
  );
}
