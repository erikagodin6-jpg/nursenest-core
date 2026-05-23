"use client";

import { useEffect } from "react";

import FlashcardErrorBoundary from "@/components/flashcards/flashcard-error-boundary";
import { captureClientExceptionIfEnabled } from "@/lib/observability/sentry-if-enabled";

export default function FlashcardsRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientExceptionIfEnabled(error, {
      tags: { route: "learner_flashcards_error", feature: "flashcards_route_boundary" },
    });
  }, [error]);

  return <FlashcardErrorBoundary error={error} resetErrorBoundary={reset} />;
}
