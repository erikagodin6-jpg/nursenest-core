/**
 * StrategyExplanationPanel — enhanced rationale sections for strategy-aware questions.
 *
 * Designed to appear BELOW the existing `PracticeRationalePanel` when strategy
 * metadata is available on a question. Completely standalone — does not modify
 * the existing rationale panel.
 *
 * Three sections (spec §3):
 *   1. "What strategy helps here?" — soft info surface → describes the strategy principle
 *   2. "Why the wrong answer is tempting" — soft warning surface → clinical trap explanation
 *   3. "Decision rule to remember" — soft emphasis surface → the memory hook / framework
 *
 * Colors: all from CSS custom properties, no hardcoded hex.
 */

import { getStrategy, resolveStrategyFromDbValue, type StrategyKey } from "@/lib/study/strategy-taxonomy";
import { StrategyTagChip } from "@/components/study/strategy-tag-chip";

// ── Inner section components ──────────────────────────────────────────────────

type SectionVariant = "info" | "warning" | "emphasis";

function StrategySection({
  variant,
  heading,
  children,
}: {
  variant: SectionVariant;
  heading: string;
  children: React.ReactNode;
}) {
  const surfaceVars: Record<SectionVariant, { bg: string; border: string; label: string }> = {
    info: {
      bg: "color-mix(in srgb, var(--surface-soft-a, var(--semantic-info, #38bdf8)) 8%, var(--bg-card, var(--theme-card-bg)))",
      border: "color-mix(in srgb, var(--semantic-info, #38bdf8) 22%, transparent)",
      label: "var(--semantic-info-text, var(--semantic-info, #0284c7))",
    },
    warning: {
      bg: "color-mix(in srgb, var(--semantic-warning, #f59e0b) 8%, var(--bg-card, var(--theme-card-bg)))",
      border: "color-mix(in srgb, var(--semantic-warning, #f59e0b) 22%, transparent)",
      label: "color-mix(in srgb, var(--semantic-warning, #f59e0b) 80%, #000)",
    },
    emphasis: {
      bg: "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 8%, var(--bg-card, var(--theme-card-bg)))",
      border: "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 22%, transparent)",
      label: "var(--surface-emphasis, var(--theme-primary))",
    },
  };

  const s = surfaceVars[variant];

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <p
        className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: s.label }}
      >
        {heading}
      </p>
      <div
        className="text-sm leading-relaxed"
        style={{ color: "var(--theme-heading-text)" }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export type StrategyExplanationPanelProps = {
  /**
   * Strategy key from the question (ExamQuestion.examStrategy).
   * Can be a canonical key or a raw DB string — resolved via taxonomy.
   */
  examStrategy: string | null | undefined;
  /**
   * Clinical trap from the question (ExamQuestion.clinicalTrap).
   * "Why the tempting wrong answer is tempting."
   */
  clinicalTrap: string | null | undefined;
  /**
   * Memory hook from the question (ExamQuestion.memoryHook).
   * The decision rule the learner should remember.
   */
  memoryHook: string | null | undefined;
  /**
   * Framework used in the question (ExamQuestion.frameworkUsed).
   * Falls back to taxonomy's decisionRule if not provided.
   */
  frameworkUsed: string | null | undefined;
  /** If false, renders nothing (e.g. before the user has answered). */
  visible?: boolean;
};

/**
 * StrategyExplanationPanel
 *
 * Renders three palette-varied sections teaching the strategy behind a question.
 * Returns null if no strategy metadata is available or `visible` is false.
 */
export function StrategyExplanationPanel({
  examStrategy,
  clinicalTrap,
  memoryHook,
  frameworkUsed,
  visible = true,
}: StrategyExplanationPanelProps) {
  if (!visible) return null;

  const entry = examStrategy
    ? (getStrategy(examStrategy as StrategyKey) ??
       resolveStrategyFromDbValue(examStrategy))
    : null;

  // Don't render anything if we have no strategy data at all
  const hasTrap = clinicalTrap && clinicalTrap.trim().length > 0;
  const hasRule = memoryHook ?? frameworkUsed;
  const hasAny = entry || hasTrap || hasRule;
  if (!hasAny) return null;

  const trapText = hasTrap
    ? clinicalTrap
    : entry?.typicalTrap ?? null;

  const ruleText = memoryHook ?? frameworkUsed ?? entry?.decisionRule ?? null;

  const principleText = entry?.nursingPrinciple ?? null;

  return (
    <div className="flex flex-col gap-3">
      {/* Divider heading */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--theme-muted-text)" }}
        >
          Strategy Insight
        </span>
        {entry ? (
          <StrategyTagChip strategyKey={entry.key} size="xs" />
        ) : null}
        <div
          className="flex-1 border-t"
          style={{ borderColor: "var(--border-subtle, var(--theme-card-border))" }}
        />
      </div>

      {/* Section 1: What strategy helps here */}
      {principleText ? (
        <StrategySection variant="info" heading="What strategy helps here?">
          {principleText}
        </StrategySection>
      ) : null}

      {/* Section 2: Why the wrong answer is tempting */}
      {trapText ? (
        <StrategySection variant="warning" heading="Why the wrong answer is tempting">
          {trapText}
        </StrategySection>
      ) : null}

      {/* Section 3: Decision rule to remember */}
      {ruleText ? (
        <StrategySection variant="emphasis" heading="Decision rule to remember">
          {ruleText}
        </StrategySection>
      ) : null}
    </div>
  );
}

/**
 * StrategyExplanationCompact — a collapsed preview version for smaller spaces.
 * Shows just the strategy chip + one-line principle.
 */
export function StrategyExplanationCompact({
  examStrategy,
}: {
  examStrategy: string | null | undefined;
}) {
  const entry = examStrategy
    ? (getStrategy(examStrategy as StrategyKey) ??
       resolveStrategyFromDbValue(examStrategy))
    : null;

  if (!entry) return null;

  return (
    <div
      className="flex items-start gap-2 rounded-lg px-3 py-2"
      style={{
        background: `color-mix(in srgb, ${entry.accentVar} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${entry.accentVar} 18%, transparent)`,
      }}
    >
      <StrategyTagChip strategyKey={entry.key} size="xs" />
      <p className="text-xs leading-relaxed" style={{ color: "var(--theme-muted-text)" }}>
        {entry.decisionRule.slice(0, 120)}
        {entry.decisionRule.length > 120 ? "…" : ""}
      </p>
    </div>
  );
}
