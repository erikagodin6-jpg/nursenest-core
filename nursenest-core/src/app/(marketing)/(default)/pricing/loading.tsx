/**
 * Route loading state for /pricing.
 *
 * Shows a lightweight hero + plan-card skeleton during:
 * 1. Client-side navigation (Next.js wraps this route in Suspense with this fallback)
 * 2. First compilation in dev mode (can take several seconds for this large page)
 *
 * Previously returned null, which caused the entire content area to be blank with
 * no user feedback while the server compiled and streamed the pricing RSC.
 */
export default function PricingLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0">
      {/* Hero skeleton */}
      <div className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 pt-14 pb-10 text-center sm:px-14">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="mx-auto h-6 w-32 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))]" />
          <div className="mx-auto h-10 w-3/4 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))]" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
          <div className="mt-6 flex justify-center gap-3">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))]" />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
          </div>
        </div>
      </div>

      {/* Segment tabs skeleton */}
      <div className="flex justify-center gap-2">
        {[100, 70, 80, 60, 90].map((w) => (
          <div
            key={w}
            className="h-9 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-border-soft))]"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Plan cards skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6" aria-busy="true" aria-label="Loading pricing plans">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative flex min-h-[20rem] flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6"
          >
            <div className="h-6 w-28 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))]" />
            <div className="mt-2 h-3 w-4/5 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
            <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
              <div className="h-8 w-32 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))]" />
              <div className="mt-2 h-3 w-40 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-border-soft))]" />
            </div>
            <div className="mt-6 flex flex-1 flex-col gap-2.5">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="flex gap-2">
                  <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded-sm bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
                  <div className="h-4 flex-1 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-border-soft))]" />
                </div>
              ))}
            </div>
            <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))]" />
          </div>
        ))}
      </div>
    </div>
  );
}
