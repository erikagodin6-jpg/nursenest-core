"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";
import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";

export default function MarketingDefaultSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = `${error?.message ?? ""} ${error?.digest ?? ""}`.toLowerCase();

  /** Strict markers only — no generic `home` / `homepage` substring matching. */
  const likelyHomeCrash =
    message.includes("marketing_homepage") ||
    message.includes("pages.home.") ||
    message.includes("nn_homepage");

  if (likelyHomeCrash) {
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