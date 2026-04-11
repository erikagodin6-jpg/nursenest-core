/**
 * StrategyTagChip — small premium chip for displaying strategy tags.
 *
 * Design:
 *   - Semi-transparent accent tint background
 *   - Accent-colored border (lighter)
 *   - Accent-colored text
 *   - Size variants: "sm" (default) for rationale panels, "xs" for inline mentions
 *
 * Usage:
 *   <StrategyTagChip strategyKey="prioritization" />
 *   <StrategyTagChip strategyKey={question.examStrategy} size="xs" />
 */

import {
  getStrategy,
  resolveStrategyFromDbValue,
  type StrategyKey,
} from "@/lib/study/strategy-taxonomy";

type StrategyTagChipProps = {
  /** Canonical strategy key or raw DB value — resolved automatically. */
  strategyKey: StrategyKey | string | null | undefined;
  size?: "xs" | "sm" | "md";
  /** Show a small dot indicator before the label. */
  showDot?: boolean;
  className?: string;
};

export function StrategyTagChip({
  strategyKey,
  size = "sm",
  showDot = false,
  className = "",
}: StrategyTagChipProps) {
  const entry = strategyKey
    ? (getStrategy(strategyKey as StrategyKey) ??
       resolveStrategyFromDbValue(strategyKey))
    : null;

  if (!entry) return null;

  const accent = entry.accentVar;

  const sizeStyles: Record<NonNullable<typeof size>, string> = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeStyles[size]} ${className}`}
      style={{
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        color: accent,
        border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
      }}
      title={entry.description}
    >
      {showDot ? (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden
        />
      ) : null}
      {entry.label}
    </span>
  );
}

/**
 * StrategyTagRow — renders a horizontal list of strategy chips.
 * Handles null/empty gracefully.
 */
export function StrategyTagRow({
  strategyKey,
  size = "sm",
  label,
}: {
  strategyKey: string | null | undefined;
  size?: StrategyTagChipProps["size"];
  label?: string;
}) {
  const entry = strategyKey
    ? (getStrategy(strategyKey as StrategyKey) ??
       resolveStrategyFromDbValue(strategyKey))
    : null;

  if (!entry) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {label ? (
        <span
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {label}
        </span>
      ) : null}
      <StrategyTagChip strategyKey={entry.key} size={size} showDot />
    </div>
  );
}
