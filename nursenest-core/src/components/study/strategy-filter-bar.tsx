"use client";

/**
 * StrategyFilterBar — horizontal chip bar for filtering questions by strategy.
 *
 * Design: pill-style chips with semantic tints, one per strategy + "All".
 * Active chip uses the strategy's full accent tint.
 * Inactive chips use a soft neutral tint.
 */

import { STRATEGY_TAXONOMY, MIXED_STRATEGY_KEY, type SessionMode, type StrategyKey } from "@/lib/study/strategy-taxonomy";

type StrategyFilterBarProps = {
  activeKey: SessionMode | "";
  onChange: (key: SessionMode | "") => void;
  /** Optional per-strategy question counts to show alongside labels. */
  counts?: Partial<Record<StrategyKey | typeof MIXED_STRATEGY_KEY, number>>;
};

export function StrategyFilterBar({
  activeKey,
  onChange,
  counts = {},
}: StrategyFilterBarProps) {
  const allCount = Object.values(counts).reduce<number>((sum, n) => sum + (n ?? 0), 0);

  return (
    <nav
      aria-label="Filter by strategy"
      className="flex flex-wrap gap-2"
    >
      {/* All / mixed chip */}
      <StrategyFilterChip
        label="All strategies"
        count={allCount || undefined}
        accentVar="var(--theme-primary)"
        active={activeKey === "" || activeKey === MIXED_STRATEGY_KEY}
        onSelect={() => onChange("")}
      />

      {STRATEGY_TAXONOMY.map((s) => (
        <StrategyFilterChip
          key={s.key}
          label={s.label}
          count={counts[s.key]}
          accentVar={s.accentVar}
          active={activeKey === s.key}
          onSelect={() => onChange(s.key)}
        />
      ))}
    </nav>
  );
}

function StrategyFilterChip({
  label,
  count,
  accentVar,
  active,
  onSelect,
}: {
  label: string;
  count?: number;
  accentVar: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition"
      style={
        active
          ? {
              background: `color-mix(in srgb, ${accentVar} 18%, var(--bg-card, #fff))`,
              color: accentVar,
              border: `1px solid color-mix(in srgb, ${accentVar} 35%, transparent)`,
            }
          : {
              background:
                "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 6%, var(--bg-page, #f9fafb))",
              color: "var(--theme-muted-text)",
              border: "1px solid var(--border-subtle, var(--theme-card-border))",
            }
      }
    >
      {label}
      {count !== undefined && count > 0 ? (
        <span
          className="rounded-full px-1 py-0.5 text-[9px] font-bold tabular-nums leading-none"
          style={{
            background: active
              ? `color-mix(in srgb, ${accentVar} 25%, transparent)`
              : "color-mix(in srgb, var(--theme-muted-text) 12%, transparent)",
            color: active ? accentVar : "var(--theme-muted-text)",
          }}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
