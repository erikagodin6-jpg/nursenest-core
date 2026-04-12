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
    bg: "bg-[var(--semantic-panel-cool)]",
    icon: "text-[var(--semantic-brand)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]",
    value: "text-[var(--semantic-brand)]",
  },
  success: {
    bg: "bg-[var(--semantic-panel-positive)]",
    icon: "text-[var(--semantic-success)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]",
    value: "text-[var(--semantic-success)]",
  },
  info: {
    bg: "bg-[var(--semantic-panel-cool)]",
    icon: "text-[var(--semantic-info)]",
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))]",
    value: "text-[var(--semantic-info-contrast)]",
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
          ? "grid-cols-2"
          :         stats.length === 3
            ? "grid-cols-3"
            : "grid-cols-2 sm:grid-cols-4"
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
            className={`${accent.bg} flex flex-col gap-1 rounded-2xl border border-[var(--semantic-border-soft)] p-3 shadow-[var(--semantic-shadow-soft)] sm:gap-1.5 sm:p-5`}
          >
            <span
              className={`${accent.iconBg} hidden h-8 w-8 items-center justify-center rounded-lg sm:flex`}
              aria-hidden
            >
              <Icon className={`h-4 w-4 ${accent.icon}`} strokeWidth={1.75} />
            </span>
            <p className={`text-xl font-extrabold tracking-tight sm:text-2xl ${accent.value}`}>
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
