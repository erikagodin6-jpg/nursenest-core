/** Route-level shell while the homepage server component resolves — avoids a blank first paint on client navigations. */
export default function DefaultMarketingHomeLoading() {
  return (
    <div className="font-sans flex min-h-[50vh] flex-col overflow-x-hidden bg-[var(--page-bg)]">
      <div className="nn-gradient-safe nn-hero-branded relative overflow-hidden border-b border-[var(--header-nav-border)]">
        <div className="relative pt-10 pb-16 md:pt-12 md:pb-20">
          <div className="nn-section-shell">
            <div className="grid min-w-0 gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
              <div className="min-w-0 space-y-5">
                <div className="h-7 max-w-[14rem] animate-pulse rounded-full bg-[color-mix(in_srgb,var(--semantic-text-muted)_14%,transparent)]" />
                <div className="h-12 max-w-xl animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,transparent)]" />
                <div className="h-4 max-w-lg animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,transparent)]" />
                <div className="h-4 max-w-md animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,transparent)]" />
                <div className="flex flex-wrap gap-3">
                  <div className="h-12 w-44 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]" />
                  <div className="h-12 w-40 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,transparent)]" />
                </div>
                <div className="flex max-w-xl flex-wrap gap-2 pt-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-success)_16%,transparent)]" />
                  <span className="text-[var(--semantic-border-soft)]">·</span>
                  <div className="h-4 w-28 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-info)_14%,transparent)]" />
                  <span className="text-[var(--semantic-border-soft)]">·</span>
                  <div className="h-4 w-32 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,transparent)]" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="aspect-[4/3] w-full animate-pulse rounded-[1.25rem] bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,var(--bg-card))]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-48 animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,var(--semantic-surface))]" />
      </div>
    </div>
  );
}
