export type FilterPill = { key: string; label: string };

export function LearnerFilterBar({
  pills,
  activeKey,
  onSelect,
  "data-testid": dataTestId,
}: {
  pills: readonly FilterPill[];
  activeKey: string;
  onSelect: (key: string) => void;
  "data-testid"?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
      {pills.map((p) => {
        const on = activeKey === p.key;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onSelect(p.key)}
            data-active={on}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              on
                ? "border-[color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
