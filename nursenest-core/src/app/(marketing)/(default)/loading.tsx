/**
 * Segment-level loading for all routes under `(marketing)/(default)`.
 *
 * Intentionally **not** a homepage hero clone: a homepage-shaped skeleton here would flash
 * incorrect composition on client navigations to/from `/pricing`, `/blog`, `/faq`, etc., while
 * the real layout chrome (header/footer) still comes from `layout.tsx`.
 *
 * Real `<a href>` links stay in this fallback so streamed `<main>` always exposes navigable
 * anchors while RSC resolves (matches premium hero CTAs: question bank + lessons).
 */
import { HUB } from "@/lib/marketing/marketing-entry-routes";

export default function DefaultMarketingSegmentLoading() {
  return (
    <div className="flex min-h-[36vh] flex-col bg-[var(--page-bg)] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="h-7 w-40 max-w-[60%] animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,transparent)]" />
        <div className="h-4 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,transparent)]" />
        <div className="h-4 w-[92%] max-w-xl animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,transparent)]" />
        <div className="h-4 w-[70%] max-w-md animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,transparent)]" />
      </div>
      <nav
        className="mx-auto mt-10 flex w-full max-w-2xl flex-wrap gap-x-6 gap-y-2 text-sm font-semibold"
        aria-label="Explore NurseNest while this page loads"
      >
        <a
          href={HUB.questionBank}
          className="text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]"
        >
          Practice questions
        </a>
        <a
          href={HUB.examLessons}
          className="text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]"
        >
          Browse lessons
        </a>
      </nav>
    </div>
  );
}
