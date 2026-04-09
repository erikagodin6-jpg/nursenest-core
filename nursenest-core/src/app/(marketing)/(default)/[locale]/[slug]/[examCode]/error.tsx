"use client";

import { useEffect } from "react";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

/**
 * Granular boundary for exam hub segment (`/[country]/[role]/[exam]/…`) — keeps shell/nav usable when a sub-page throws.
 */
export default function ExamPathwaySegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[exam-pathway-segment-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-14">
      <div className="nn-card max-w-md p-8 text-center">
        <a href="/" className="mb-5 inline-flex justify-center bg-transparent" aria-label="NurseNest home">
          <SiteBrandLogoMark variant="auth" />
        </a>
        <h1 className="text-xl font-bold text-[var(--theme-heading-text)]">This exam page couldn&apos;t load</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Try again, open the home page, or use the main navigation to pick your exam track.
        </p>
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
