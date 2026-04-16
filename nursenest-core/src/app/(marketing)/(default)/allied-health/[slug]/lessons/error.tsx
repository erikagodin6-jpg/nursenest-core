"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

export default function AlliedHealthLessonsSegmentError({
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
      surface="allied_health_lessons"
      title="Just a moment"
      description="We’re loading these lessons. Try again in a moment, or return to allied exam prep."
      primaryAction={{ label: "Allied exam prep", href: "/allied-health" }}
      secondaryAction={{ label: "Home", href: "/" }}
    />
  );
}
