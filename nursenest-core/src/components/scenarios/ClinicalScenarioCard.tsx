export function ClinicalScenarioCard({
  title,
  categoryLabel,
  summary,
  badges,
}: {
  title: string;
  categoryLabel: string;
  summary: string;
  badges?: string[];
}) {
  return (
    <article className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_90%,var(--semantic-text-primary))]">{categoryLabel}</p>
      <h3 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{summary}</p>
      {badges?.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <li
              key={b}
              className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] px-2 py-0.5 text-[11px] font-medium text-[var(--semantic-text-primary)]"
            >
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
