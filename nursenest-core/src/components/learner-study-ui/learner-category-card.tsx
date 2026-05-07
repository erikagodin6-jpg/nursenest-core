import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { formatTitleCase } from "@/lib/format/text-case";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

/**
 * Category / body-system picker tile — semantic tokens for readable contrast in light + dark.
 */
export function LearnerCategoryCard({
  id,
  label,
  count,
  poolMax,
  selected,
  onToggle,
  icon: Icon,
  accentVar,
}: {
  id: string;
  label: string;
  count: number;
  /** Largest category count in the grid — drives a subtle relative strength bar. */
  poolMax: number;
  selected: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  accentVar: string;
}) {
  const systemStyle = { "--nn-system-accent": `var(${accentVar})` } as CSSProperties;

  const disabled = count <= 0;
  const strengthPct =
    !disabled && poolMax > 0 ? Math.min(100, Math.round((count / poolMax) * 100)) : 0;
  const strengthFillClass = semanticFillClassForAccuracyPct(strengthPct);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-disabled={disabled}
      data-selected={selected}
      data-nn-e2e-body-system-card={id}
      style={systemStyle}
      className="nn-lesson-system-card group rounded-2xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 text-left text-[var(--semantic-text-primary)] transition hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] hover:shadow-[var(--semantic-shadow-soft)] data-[selected=false]:opacity-[0.92] data-[selected=true]:shadow-[var(--semantic-shadow-soft)] data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--nn-system-accent)_45%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_12%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)] transition group-hover:bg-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-surface))]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-base font-semibold leading-snug text-[var(--semantic-text-primary)]">
            {formatTitleCase(label)}
          </div>
          <p className="mt-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
            {count} {count === 1 ? "item" : "items"} in pool
          </p>
        </div>
      </div>
      {!disabled ? (
        <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--semantic-progress-track)]">
          <div
            className={`h-full rounded-full ${strengthFillClass} transition-[width] duration-300 ease-out`}
            style={{ width: `${strengthPct}%` }}
          />
        </div>
      ) : null}
    </button>
  );
}
