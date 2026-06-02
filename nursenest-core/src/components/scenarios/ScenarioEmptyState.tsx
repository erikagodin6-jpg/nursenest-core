export function ScenarioEmptyState({
  title,
  description,
  footnote,
}: {
  title: string;
  description: string;
  footnote?: string;
}) {
  return (
    <section
      className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--bg-card))] px-4 py-6 text-center"
      aria-live="polite"
    >
      <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{description}</p>
      {footnote ? <p className="mt-3 text-xs text-[var(--semantic-info)]">{footnote}</p> : null}
    </section>
  );
}
