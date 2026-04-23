/**
 * Shown when study inventory is served from last-known-good snapshot after primary (live) load failed.
 */
export function LearnerStudyLiveSyncBanner() {
  return (
    <div
      className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
      role="status"
      data-nn-study-live-sync-banner="1"
    >
      <p className="font-medium text-[var(--semantic-text-primary)]">Showing last synced study content</p>
      <p className="mt-1">
        We&apos;re showing the latest available study content while live data reloads. Your links and study launches
        still work; counts may catch up after refresh.
      </p>
    </div>
  );
}
