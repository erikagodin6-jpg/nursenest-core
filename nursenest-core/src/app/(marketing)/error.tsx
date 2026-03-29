"use client";

import { useEffect } from "react";

/**
 * Marketing-route error surface: never a blank screen; keeps layout chrome via parent when possible.
 */
export default function MarketingSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketing-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16">
      <div className="nn-card max-w-md p-8 text-center">
        <h1 className="text-xl font-bold text-[var(--theme-heading-text)]">Something went wrong</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Please try again. If this continues, refresh the page.</p>
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-bold text-[var(--theme-primary-foreground)]"
          onClick={() => reset()}
        >
          Try again
        </button>
        <a href="/" className="mt-4 block text-sm font-medium text-[var(--theme-primary)] underline underline-offset-2">
          Home
        </a>
      </div>
    </div>
  );
}
