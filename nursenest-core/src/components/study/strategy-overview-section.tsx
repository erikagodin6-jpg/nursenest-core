/**
 * StrategyOverviewSection — hero section for the Strategy Trainer hub page.
 *
 * Design:
 *   - surface-emphasis background (tinted, not solid)
 *   - Strategy count stat + strategy list pills
 *   - Calm intro copy explaining the system
 *   - Server component
 */

import { STRATEGY_TAXONOMY } from "@/lib/study/strategy-taxonomy";
import { StrategyTagChip } from "@/components/study/strategy-tag-chip";
import type { StrategyCounts } from "@/components/study/strategy-practice-cards";

type StrategyOverviewSectionProps = {
  counts?: StrategyCounts;
  /** Total questions available across all strategies. */
  totalQuestions?: number;
};

export function StrategyOverviewSection({
  counts = {},
  totalQuestions,
}: StrategyOverviewSectionProps) {
  const totalDue = Object.values(counts).reduce<number>((s, n) => s + (n ?? 0), 0);
  const displayTotal = totalQuestions ?? totalDue;

  return (
    <section
      className="relative overflow-hidden rounded-2xl px-7 py-8"
      style={{
        background:
          "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 8%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 18%, transparent)",
      }}
    >
      {/* Decorative accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, var(--surface-emphasis, var(--theme-primary)) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
        aria-hidden
      />

      <div className="relative">
        {/* Label */}
        <p
          className="mb-2 text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--surface-emphasis, var(--theme-primary))" }}
        >
          Strategy Trainer
        </p>

        {/* Heading */}
        <h1
          className="mb-3 text-2xl font-bold leading-tight"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Learn how to think through nursing exam questions
        </h1>

        {/* Intro */}
        <p
          className="mb-6 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--theme-muted-text)" }}
        >
          Most exam errors aren't knowledge gaps — they're thinking-pattern errors. This trainer
          teaches you the seven core strategies that appear repeatedly on NCLEX-style exams so you
          can recognize the pattern and apply the right decision rule under pressure.
        </p>

        {/* Stat chips */}
        {displayTotal > 0 ? (
          <div className="mb-6 flex flex-wrap gap-3">
            <StatChip label="Strategy types" value={String(STRATEGY_TAXONOMY.length)} />
            {displayTotal > 0 ? (
              <StatChip label="Tagged questions" value={displayTotal.toLocaleString()} />
            ) : null}
          </div>
        ) : null}

        {/* Strategy chip overview */}
        <div>
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--theme-muted-text)" }}
          >
            Strategies covered
          </p>
          <div className="flex flex-wrap gap-2">
            {STRATEGY_TAXONOMY.map((s) => (
              <StrategyTagChip key={s.key} strategyKey={s.key} size="sm" showDot />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col rounded-xl px-4 py-2 text-center"
      style={{
        background:
          "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 12%, transparent)",
        border:
          "1px solid color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 20%, transparent)",
      }}
    >
      <span
        className="text-lg font-bold tabular-nums"
        style={{ color: "var(--surface-emphasis, var(--theme-primary))" }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-medium uppercase tracking-wide"
        style={{ color: "var(--theme-muted-text)" }}
      >
        {label}
      </span>
    </div>
  );
}
