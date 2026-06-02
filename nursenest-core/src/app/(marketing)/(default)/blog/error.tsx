"use client";

import Link from "next/link";
import { useMarketingRouteErrorDiagnostics } from "@/lib/marketing/use-marketing-route-error-diagnostics";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useMarketingRouteErrorDiagnostics("marketing_blog_index_error_tsx", error);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
        Article library
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">
        We’re updating our article library.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--theme-muted-text)]">
        Please try again in a moment. Lessons, flashcards, and practice tools remain available.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-on-brand)]"
        >
          Reload articles
        </button>
        <Link
          href="/app"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-5 text-sm font-semibold text-[var(--theme-body-text)]"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
