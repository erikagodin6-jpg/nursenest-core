import type { ReactNode } from "react";

export function LearnerModeCard({
  title,
  description,
  selected,
  onSelect,
  accent = "brand",
  disabled,
  children,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  accent?: "brand" | "info" | "success" | "warning";
  disabled?: boolean;
  children?: ReactNode;
}) {
  const ring =
    accent === "info"
      ? "border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))]"
      : accent === "success"
        ? "border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
        : accent === "warning"
          ? "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))]"
          : "border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]";

  return (
    <button
      type="button"
      disabled={disabled}
      data-selected={selected}
      onClick={onSelect}
      className={`rounded-2xl border p-3 text-left text-sm transition disabled:opacity-50 ${
        selected ? `${ring} shadow-[var(--semantic-shadow-soft)]` : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
      }`}
    >
      <span className="font-semibold text-[var(--semantic-text-primary)]">{title}</span>
      {description ? <span className="mt-1 block text-xs text-[var(--semantic-text-secondary)]">{description}</span> : null}
      {children}
    </button>
  );
}
