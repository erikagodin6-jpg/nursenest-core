"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { getErrorMessage } from "@/lib/runtime/error-message";

export default function LearnerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "student_app_error", feature: "react_error_boundary" } });
  }, [error]);

  return (
    <div className="nn-card p-6">
      <a href="/" className="mb-4 inline-flex" aria-label="NurseNest home">
        <SiteBrandLogoMark />
      </a>
      <h2 className="text-xl font-semibold">Unable to load this section</h2>
      <p className="mt-2 text-sm text-muted">Your account and access remain intact. Try again.</p>
      <p className="mt-2 text-xs text-muted">{getErrorMessage(error)}</p>
      <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
