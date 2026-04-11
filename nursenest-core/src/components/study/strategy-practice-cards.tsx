/**
 * StrategyPracticeCards — entry cards for focused strategy practice sessions.
 *
 * Each card represents one strategy mode (or mixed). Clicking starts a
 * session at `/app/strategy/[strategyKey]`.
 *
 * Design:
 *   - Cards use alternating surface tints keyed to each strategy's accent color
 *   - Left border accent = strategy accent
 *   - Each card shows: strategy name, principle summary, question count, CTA
 *   - Mixed session card uses surface-emphasis
 *
 * Server component — no "use client" needed (only renders static content + hrefs).
 */

import Link from "next/link";
import { STRATEGY_TAXONOMY, type StrategyKey, MIXED_STRATEGY_KEY } from "@/lib/study/strategy-taxonomy";
import { StrategyTagChip } from "@/components/study/strategy-tag-chip";

export type StrategyCounts = Partial<Record<StrategyKey | typeof MIXED_STRATEGY_KEY, number>>;

type StrategyPracticeCardsProps = {
  counts?: StrategyCounts;
};

function StrategyCard({
  strategyKey,
  label,
  description,
  decisionRule,
  accentVar,
  count,
  href,
  size = "normal",
}: {
  strategyKey: string;
  label: string;
  description: string;
  decisionRule: string;
  accentVar: string;
  count?: number;
  href: string;
  size?: "normal" | "featured";
}) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
      style={{
        background:
          `color-mix(in srgb, ${accentVar} 5%, var(--bg-card, var(--theme-card-bg)))`,
        border: "1px solid var(--border-subtle, var(--theme-card-border))",
        borderLeft: `3px solid ${accentVar}`,
      }}
    >
      {/* Card body */}
      <div className={`flex flex-col gap-3 p-5 ${size === "featured" ? "pb-4" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <StrategyTagChip strategyKey={strategyKey} size="sm" showDot />
          {count !== undefined ? (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
              style={{
                background: `color-mix(in srgb, ${accentVar} 12%, transparent)`,
                color: accentVar,
              }}
            >
              {count} Qs
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {label}
        </h3>

        {/* Description */}
        <p
          className="line-clamp-2 text-sm leading-relaxed"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {description}
        </p>

        {/* Decision rule preview */}
        <p
          className="line-clamp-2 rounded-lg px-3 py-2 text-xs leading-relaxed"
          style={{
            background: `color-mix(in srgb, ${accentVar} 8%, transparent)`,
            color: "var(--theme-muted-text)",
            borderLeft: `2px solid color-mix(in srgb, ${accentVar} 40%, transparent)`,
          }}
        >
          {decisionRule}
        </p>
      </div>

      {/* Footer CTA */}
      <div
        className="flex items-center justify-between border-t px-5 py-3"
        style={{ borderColor: "var(--border-subtle, var(--theme-card-border))" }}
      >
        <span
          className="text-xs font-medium"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {count !== undefined && count > 0
            ? `${count} question${count !== 1 ? "s" : ""} available`
            : "Practice available"}
        </span>
        <Link
          href={href}
          className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition"
          style={{
            background: `color-mix(in srgb, ${accentVar} 18%, var(--bg-card, #fff))`,
            color: accentVar,
            border: `1px solid color-mix(in srgb, ${accentVar} 30%, transparent)`,
          }}
        >
          Practice →
        </Link>
      </div>
    </article>
  );
}

function MixedSessionCard({ count }: { count?: number }) {
  return (
    <article
      className="group relative col-span-full flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-md sm:flex-row"
      style={{
        background:
          "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 7%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 22%, transparent)",
      }}
    >
      {/* Body */}
      <div className="flex flex-1 flex-col justify-center gap-3 p-6">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background:
                "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 16%, transparent)",
              color: "var(--surface-emphasis, var(--theme-primary))",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
            Mixed session
          </span>
          {count !== undefined && count > 0 ? (
            <span
              className="text-xs font-medium"
              style={{ color: "var(--theme-muted-text)" }}
            >
              {count} total questions
            </span>
          ) : null}
        </div>
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Mixed Strategy Practice
        </h3>
        <p className="max-w-lg text-sm" style={{ color: "var(--theme-muted-text)" }}>
          Practice across all strategy types in a randomized session. Ideal for full exam
          preparation — simulates the varied strategy demands of the real test.
        </p>
      </div>

      {/* CTA */}
      <div className="flex shrink-0 items-center justify-end p-6">
        <Link
          href="/app/strategy/mixed"
          className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition"
          style={{
            background: "var(--surface-emphasis, var(--theme-primary))",
            color: "var(--bg-page, #fff)",
          }}
        >
          Start mixed session →
        </Link>
      </div>
    </article>
  );
}

export function StrategyPracticeCards({ counts = {} }: StrategyPracticeCardsProps) {
  const totalCount = Object.values(counts).reduce<number>((s, n) => s + (n ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Mixed session featured card */}
      <MixedSessionCard count={totalCount || undefined} />

      {/* Individual strategy cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {STRATEGY_TAXONOMY.map((strategy) => (
          <StrategyCard
            key={strategy.key}
            strategyKey={strategy.key}
            label={`${strategy.label} Questions`}
            description={strategy.description}
            decisionRule={strategy.decisionRule}
            accentVar={strategy.accentVar}
            count={counts[strategy.key]}
            href={`/app/strategy/${strategy.key}`}
          />
        ))}
      </div>
    </div>
  );
}
