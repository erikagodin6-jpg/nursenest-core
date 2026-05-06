import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { formatTitleCase } from "@/lib/format/text-case";

export function LearnerBodySystemCard({
  id,
  label,
  count,
  selected,
  onToggle,
  icon: Icon,
  accentVar,
}: {
  id: string;
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  accentVar: string;
}) {
  const systemStyle = { "--nn-system-accent": `var(${accentVar})` } as CSSProperties;

  return (
    <button
      key={id}
      type="button"
      onClick={onToggle}
      data-selected={selected}
      data-nn-e2e-body-system-card={id}
      style={systemStyle}
      className="nn-lesson-system-card text-left transition hover:shadow-[var(--semantic-shadow-soft)] data-[selected=false]:opacity-70 rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 sm:p-4 data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--nn-system-accent)_45%,transparent)]"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
            {formatTitleCase(label)}
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">
            {count} {count === 1 ? "item" : "items"} in pool
          </p>
        </div>
      </div>
    </button>
  );
}
