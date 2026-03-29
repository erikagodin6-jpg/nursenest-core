"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "app_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = process.env.NODE_ENV === "development";

  return (
    <main className="mx-auto mt-16 w-full max-w-xl px-6">
      <div className="nn-card p-8">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted">
          A recoverable runtime issue occurred. You can retry; access rules are enforced on the server.
        </p>
        {digest ? (
          <p className="mt-3 text-xs text-muted" suppressHydrationWarning>
            Reference: {digest}
          </p>
        ) : null}
        {showDetail ? <p className="mt-3 text-xs text-muted">{error.message}</p> : null}
        <button type="button" className="mt-5 rounded-xl bg-primary px-4 py-2 font-semibold" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
