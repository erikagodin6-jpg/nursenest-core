/**
 * Segment-level loading for all routes under `(marketing)/(default)`.
 *
 * Intentionally **not** a homepage hero clone: a homepage-shaped skeleton here would flash
 * incorrect composition on client navigations to/from `/pricing`, `/blog`, `/faq`, etc., while
 * the real layout chrome (header/footer) still comes from `layout.tsx`.
 */
export default function DefaultMarketingSegmentLoading() {
  return (
    <div className="flex min-h-[36vh] flex-col bg-[var(--page-bg)] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="h-7 w-40 max-w-[60%] animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,transparent)]" />
        <div className="h-4 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,transparent)]" />
        <div className="h-4 w-[92%] max-w-xl animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,transparent)]" />
        <div className="h-4 w-[70%] max-w-md animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,transparent)]" />
      </div>
    </div>
  );
}
