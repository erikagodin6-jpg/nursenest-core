"use client";

import Link from "next/link";

export default function LessonsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="nn-card space-y-4 p-6 text-sm text-[var(--semantic-text-secondary)]">
      <p className="font-semibold text-[var(--semantic-text-primary)]">Could not load lessons</p>
      <p>{error.message || "Something went wrong."}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link className="inline-flex items-center font-medium text-[var(--semantic-brand)] underline" href="/app">
          Back to app
        </Link>
      </div>
    </main>
  );
}
