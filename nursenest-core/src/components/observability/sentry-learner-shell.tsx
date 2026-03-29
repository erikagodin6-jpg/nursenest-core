"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "@sentry/react";
import { sentryUserHashClient } from "@/lib/observability/sentry-user-hash-client";

export function SentryLearnerShell({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      const id = await sentryUserHashClient(userId);
      if (!cancelled) {
        Sentry.setUser({ id });
        Sentry.setTag("feature", "learner_app");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <ErrorBoundary
      fallback={({ error, resetError: resetBoundary }) => (
        <div className="nn-card p-6">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted">We logged this error. You can try again.</p>
          <button type="button" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold" onClick={resetBoundary}>
            Retry
          </button>
          {process.env.NODE_ENV === "development" && error instanceof Error ? (
            <p className="mt-2 text-xs text-muted">{error.message}</p>
          ) : null}
        </div>
      )}
      showDialog={false}
    >
      {children}
    </ErrorBoundary>
  );
}
