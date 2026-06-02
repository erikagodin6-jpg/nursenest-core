"use client";

/**
 * Minimal error boundary for static public routes.
 * No dependencies on auth, session, or heavy providers.
 */
import { useEffect } from "react";

export default function PublicStaticError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log but never crash — static pages must remain available
    try {
      console.error("[public-static] page error", {
        pathname: typeof window !== "undefined" ? window.location.pathname : null,
        message: error?.message,
        digest: error?.digest,
      });
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">
        This page is temporarily unavailable
      </h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        We're working on it. Try refreshing, or come back shortly.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}