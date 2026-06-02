/**
 * DailyStudyPlanCard
 *
 * Today's structured study blocks, drawn from the adaptive planner.
 * Each block is a premium card with: kind icon, title, reason, estimated effort, CTA.
 *
 * Surfaces: alternating --surface-soft-a / --surface-soft-b per block
 *
 * Inputs:
 *   - primaryNext: top-priority action
 *   - secondary: additional ordered actions
 *   - todayFocus: plain-text focus labels when no structured next actions
 */

import type { AdaptiveLearnerRecommendations, NextAction } from "@/lib/learner/adaptive-recommendations";
import Link from "next/link";

// ── Kind metadata ─────────────────────────────────────────────────────────────

const KIND_META: Record<
  NextAction["kind"],
  { icon: string; accentVar: string; effortLabel: string }
> = {
  lesson: {
    icon: "📖",
    accentVar: "var(--semantic-info)",
    effortLabel: "~15–20 min",
  },
  quiz: {
    icon: "🎯",
    accentVar: "var(--semantic-brand)",
    effortLabel: "~10–15 min",
  },
  mock: {
    icon: "📊",
    accentVar: "var(--semantic-warning)",
    effortLabel: "~30–45 min",
  },
  cat: {
    icon: "📊",
    accentVar: "var(--semantic-warning)",
    effortLabel: "~30–60 min",
  },
  review: {
    icon: "🔄",
    accentVar: "var(--semantic-success)",
    effortLabel: "~10 min",
  },
  continue: {
    icon: "▶",
    accentVar: "var(--semantic-info)",
    effortLabel: "~15 min",
  },
  settings: {
    icon: "⚙",
    accentVar: "var(--semantic-text-muted)",
    effortLabel: "~2 min",
  },
  exams: {
    icon: "📋",
    accentVar: "var(--semantic-brand)",
    effortLabel: "~5 min",
  },
};

const BLOCK_SURFACES = [
  "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
  "var(--surface-soft-b, color-mix(in srgb, var(--theme-secondary, var(--theme-primary)) 5%, var(--bg-page)))",
  "var(--surface-soft-c, color-mix(in srgb, var(--theme-accent, var(--theme-primary)) 5%, var(--bg-page)))",
];

// ── Single study block ────────────────────────────────────────────────────────

function StudyBlock({
  action,
  index,
  isPrimary,
}: {
  action: NextAction;
  index: number;
  isPrimary: boolean;
}) {
  const meta = KIND_META[action.kind];
  const surface = BLOCK_SURFACES[index % BLOCK_SURFACES.length]!;
  const accent = meta.accentVar;

  return (
    <div
      className="flex items-start gap-4 rounded-xl p-4 transition-opacity"
      style={{
        background: surface,
        border: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
      }}
    >
      {/* Number + icon */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
            color: accent,
          }}
        >
          {index + 1}
        </div>
        <span className="text-base" aria-hidden="true">
          {meta.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            {action.title}
          </p>
          {isPrimary && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: `color-mix(in srgb, ${accent} 14%, var(--semantic-surface))`,
                color: accent,
              }}
            >
              Priority
            </span>
          )}
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--semantic-text-secondary)" }}
        >
          {action.reason}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            {meta.effortLabel}
          </span>

          <Link
            href={action.href}
            className="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, var(--semantic-surface))`,
              color: accent,
              border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
            }}
          >
            Start →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Fallback text block ───────────────────────────────────────────────────────

function TextFocusBlock({ label, index }: { label: string; index: number }) {
  const surface = BLOCK_SURFACES[index % BLOCK_SURFACES.length]!;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: surface,
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--semantic-text-primary)" }}>
        {label}
      </p>
    </div>
  );
}

// ── DailyStudyPlanCard ────────────────────────────────────────────────────────

export type DailyStudyPlanCardProps = {
  primaryNext: AdaptiveLearnerRecommendations["primaryNext"];
  secondary: AdaptiveLearnerRecommendations["secondary"];
  todayFocus: AdaptiveLearnerRecommendations["todayFocus"];
};

export function DailyStudyPlanCard({
  primaryNext,
  secondary,
  todayFocus,
}: DailyStudyPlanCardProps) {
  // Build ordered action list: primary first, then up to 3 secondary
  const actions: (NextAction & { isPrimary: boolean })[] = [
    { ...primaryNext, isPrimary: true },
    ...secondary.slice(0, 3).map((a) => ({ ...a, isPrimary: false })),
  ];

  const hasTodayFocus = todayFocus.length > 0;
  const hasActions = actions.length > 0 && actions[0]!.title;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid var(--semantic-border-soft)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--semantic-border-soft)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Today's plan
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Your ordered study blocks for today
        </p>
      </div>

      {/* Blocks */}
      <div className="space-y-3 p-5">
        {hasActions ? (
          actions.map((action, i) => (
            <StudyBlock
              key={`${action.kind}-${i}`}
              action={action}
              index={i}
              isPrimary={action.isPrimary}
            />
          ))
        ) : hasTodayFocus ? (
          todayFocus.map((label, i) => (
            <TextFocusBlock key={i} label={label} index={i} />
          ))
        ) : (
          <p
            className="py-4 text-center text-sm"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Complete some practice sessions to generate your daily plan.
          </p>
        )}
      </div>

      {/* Footer note */}
      {hasTodayFocus && hasActions && (
        <div
          className="px-5 py-3"
          style={{ borderTop: "1px solid var(--semantic-border-soft)" }}
        >
          <p
            className="text-[10px]"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Today's focus: {todayFocus.slice(0, 3).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
