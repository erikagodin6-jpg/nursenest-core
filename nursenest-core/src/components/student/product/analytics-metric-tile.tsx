import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const ACCENT: Record<"c1" | "c2" | "c3" | "c4" | "c5", { ring: string; bg: string }> = {
  c1: {
    ring: "border-[color-mix(in_srgb,var(--semantic-chart-1)_35%,var(--semantic-border-soft))] text-[var(--semantic-chart-1)]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-1)_11%,var(--semantic-surface))]",
  },
  c2: {
    ring: "border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] text-[var(--semantic-chart-2)]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-2)_11%,var(--semantic-surface))]",
  },
  c3: {
    ring: "border-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))] text-[var(--semantic-chart-3)]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-3)_11%,var(--semantic-surface))]",
  },
  c4: {
    ring: "border-[color-mix(in_srgb,var(--semantic-chart-4)_35%,var(--semantic-border-soft))] text-[var(--semantic-chart-4)]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-4)_11%,var(--semantic-surface))]",
  },
  c5: {
    ring: "border-[color-mix(in_srgb,var(--semantic-chart-5)_35%,var(--semantic-border-soft))] text-[var(--semantic-chart-5)]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-5)_11%,var(--semantic-surface))]",
  },
};

/**
 * Small KPI tile for dashboards — semantic chart accents, not brand-only.
 */
export function AnalyticsMetricTile({
  icon: Icon,
  label,
  value,
  hint,
  accent = "c3",
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: keyof typeof ACCENT;
}) {
  const a = ACCENT[accent];
  return (
    <div className="flex min-w-0 gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${a.bg} ${a.ring}`}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-[var(--semantic-text-primary)]">{value}</p>
        {hint ? <p className="mt-0.5 text-[11px] leading-snug text-[var(--semantic-text-muted)]">{hint}</p> : null}
      </div>
    </div>
  );
}
