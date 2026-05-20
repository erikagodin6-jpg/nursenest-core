/**
 * When allied pathway registry data is missing — show an explicit allied shell (never RN fallback).
 */
export function AlliedMarketingPathwayMissing({ pathname }: { pathname: string }) {
  return (
    <div
      className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-6 py-10 text-center"
      data-nn-allied-pathway-missing="1"
    >
      <h1 className="text-xl font-bold text-[var(--theme-heading-text)]">Allied Health is temporarily unavailable</h1>
      <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        We could not load the Allied Health pathway configuration for{" "}
        <span className="font-mono text-[var(--semantic-text-primary)]">{pathname}</span>. This is a product data issue,
        not a nursing exam page. Try again shortly, or contact support if it persists.
      </p>
    </div>
  );
}
