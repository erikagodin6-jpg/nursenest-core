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
      title="Exam couldn't load"
      description="We couldn't start or resume this exam session. Your progress is saved — try again or return to your dashboard."
      primaryAction={{ label: "Back to dashboard", href: "/app" }}
      secondaryAction={{ label: "Try again", href: "#" }}
    />
  );
}
