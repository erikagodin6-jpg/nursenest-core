export function ScenarioRationalePanel({
  title = "Rationale",
  body,
}: {
  title?: string;
  body: string;
}) {
  return (
    <aside className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--bg-card))] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{body}</p>
    </aside>
  );
}
