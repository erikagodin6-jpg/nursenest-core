import type { CSSProperties } from "react";
import { Check } from "lucide-react";
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
  metaLine,
  showWeakBadge = false,
  strengthPctOverride,
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
  /** Optional secondary line (accuracy, cards remaining, etc.). */
  metaLine?: string | null;
  showWeakBadge?: boolean;
  /** When set (e.g. recent accuracy), drives the strength bar instead of pool ratio. */
  strengthPctOverride?: number;
}) {
  const systemStyle = { "--nn-system-accent": `var(${accentVar})` } as CSSProperties;

  const disabled = count <= 0;
  const strengthPct = !disabled
    ? strengthPctOverride != null
      ? Math.min(100, Math.max(0, Math.round(strengthPctOverride)))
      : poolMax > 0
        ? Math.min(100, Math.round((count / poolMax) * 100))
        : 0
    : 0;
  const strengthFillClass = semanticFillClassForAccuracyPct(strengthPct);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-disabled={disabled}
      aria-pressed={selected}
      aria-selected={selected}
      data-selected={selected}
      data-nn-e2e-body-system-card={id}
      data-nn-category-card={id}
      style={systemStyle}
      className="nn-lesson-system-card group rounded-2xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 text-left text-[var(--semantic-text-primary)] transition-[background-color,border-color,transform,box-shadow] duration-[160ms] ease-out hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] hover:shadow-[var(--semantic-shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_42%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--semantic-surface)] data-[selected=false]:opacity-[0.94] data-[selected=true]:shadow-[var(--semantic-shadow-soft)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_12%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)] transition group-hover:bg-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-surface))]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="line-clamp-2 text-base font-semibold leading-snug text-[var(--semantic-text-primary)]">
              {formatTitleCase(label)}
            </div>
            {selected ? (
              <span
                className="nn-learner-category-card__check inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
            {metaLine ?? `${count} ${count === 1 ? "card" : "cards"} in pool`}
          </p>
          {showWeakBadge ? (
            <span className="nn-badge-semantic-warning mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              Weak area
            </span>
          ) : null}
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
