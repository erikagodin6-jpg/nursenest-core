"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

/**
 * Error boundary scoped to the exam shell (`/app/exams/*`).
 * The outer app layout stays intact; only the exam surface is replaced.
 * Catches: exam session load failures, question bank errors, adaptive engine failures.
 */
export default function ExamShellError({
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
      surface="exam_shell"
      title="Just a moment"
      description="We’re loading your exam session. This is usually temporary — try again in a moment. Your progress stays saved."
      primaryAction={{ label: "Back to dashboard", href: "/app" }}
    />
  );
}
