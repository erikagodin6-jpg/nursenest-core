"use client";

import { useEffect } from "react";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

export default function AlliedHealthLessonsSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[allied-health-lessons-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-14">
      <div className="nn-card max-w-md p-8 text-center">
        <a href="/" className="mb-5 inline-flex justify-center bg-transparent" aria-label="NurseNest home">
          <SiteBrandLogoMark variant="auth" />
        </a>
        <h1 className="text-xl font-bold text-[var(--theme-heading-text)]">Lessons unavailable</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          We couldn&apos;t load this page. Try again or return to allied exam prep.
        </p>
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-bold text-[var(--theme-primary-foreground)]"
          onClick={() => reset()}
        >
          Try again
        </button>
        <a href="/allied-health" className="mt-4 block text-sm font-medium text-[var(--theme-primary)] underline underline-offset-2">
          Allied exam prep
        </a>
      </div>
    </div>
  );
}
