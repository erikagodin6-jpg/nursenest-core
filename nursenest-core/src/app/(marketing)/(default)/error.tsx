"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

/**
 * Error boundary for all pages rendered inside the default marketing layout
 * (the shell with SiteHeader + SiteFooter stays intact; only the page content is replaced).
 * Catches: page data-loading failures, component rendering errors, DB timeouts surfaced to RSC.
 */
export default function MarketingDefaultSegmentError({
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
      surface="marketing_default"
      title="Just a moment"
      description="We’re loading this page. If it doesn’t appear, try again in a moment — or pick a study track below."
      primaryAction={{ label: "Go home", href: "/" }}
      secondaryAction={{ label: "Browse exam pathways", href: "/lessons" }}
    />
  );
}
