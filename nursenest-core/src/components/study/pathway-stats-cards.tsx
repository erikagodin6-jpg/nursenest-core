import type { LucideIcon } from "lucide-react";

type Stat = {
  value: number | string;
  label: string;
  icon: LucideIcon;
  /** Optional semantic accent: "brand" | "success" | "info" (default: "info") */
  accent?: "brand" | "success" | "info";
};

type Props = {
  stats: Stat[];
};

const accentMap = {
  brand: {
    icon: "text-[var(--semantic-brand)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,white)]",
    value: "text-[var(--semantic-brand)]",
    borderTop: "border-t-[var(--semantic-brand)]",
  },
  success: {
    icon: "text-[var(--semantic-success)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-success)_10%,white)]",
    value: "text-[var(--semantic-success)]",
    borderTop: "border-t-[var(--semantic-success)]",
  },
  info: {
    icon: "text-[var(--semantic-info)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-info)_10%,white)]",
    value: "text-[var(--semantic-info-contrast)]",
    borderTop: "border-t-[var(--semantic-info)]",
  },
};

/**
 * Shared stat cards row used on both Lessons and Questions hub pages.
 *
 * @example
 * ```tsx
 * <PathwayStatsCards
 *   stats={[
 *     { value: 120, label: "Lessons", icon: BookOpen, accent: "brand" },
 *     { value: 850, label: "Practice questions", icon: ClipboardList, accent: "success" },
 *     { value: 18, label: "Clinical topics", icon: Layers, accent: "info" },
 *   ]}
 * />
 * ```
 */
export function PathwayStatsCards({ stats }: Props) {
  if (stats.length === 0) return null;

  return (
    <div
      className={`grid gap-3 ${
        stats.length === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : stats.length === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
      role="list"
      aria-label="Pathway statistics"
    >
      {stats.map((stat) => {
        const accent = accentMap[stat.accent ?? "info"];
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            role="listitem"
            className={`rounded-2xl border border-t-2 border-[var(--semantic-border-soft)] ${accent.borderTop} bg-white px-4 py-4 shadow-sm ring-1 ring-black/[0.015] sm:px-5 sm:py-5`}
          >
            <div className="flex items-center gap-3">
              <span className={`${accent.iconBg} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl`} aria-hidden>
                <Icon className={`h-4 w-4 ${accent.icon}`} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className={`text-2xl font-extrabold leading-none tracking-tight ${accent.value}`}>
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </p>
                <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
