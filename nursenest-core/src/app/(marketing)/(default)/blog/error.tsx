"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";

export default function BlogIndexError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useMarketingRouteErrorDiagnostics("marketing_blog_index_error_tsx", error);

  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="marketing_blog_index"
      title="Just a moment"
      description="We’re loading the blog. Try again in a moment — or head home and come back when you’re ready."
      primaryAction={{ label: "Home", href: "/" }}
      secondaryAction={{ label: "Exam lessons", href: "/lessons" }}
    />
  );
}
