"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function LearnerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "learner_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = process.env.NODE_ENV === "development";

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">This section hit a snag</h1>
      <p className="text-sm text-muted">
        Your session is unchanged. Retry the page or return to the dashboard.
      </p>
      {digest ? <p className="text-xs text-muted">Reference: {digest}</p> : null}
      {showDetail ? <p className="text-xs text-muted">{error.message}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => reset()}>
          Try again
        </button>
        <a href="/app" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
          Dashboard
        </a>
      </div>
    </main>
  );
}
