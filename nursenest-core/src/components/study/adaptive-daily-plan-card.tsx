/**
 * AdaptiveDailyPlanCard
 *
 * Server component. Shows today's time-blocked study plan with pacing info.
 * Derives blocks from the StudyTimeBudget and adaptive NextActions.
 */

import Link from "next/link";
import { BookOpen, HelpCircle, RotateCcw, Layers, Calendar } from "lucide-react";
import type { StudyTimeBudget } from "@/lib/study/adaptive-engine/study-time-budget";
import type { NextAction } from "@/lib/learner/adaptive-recommendations";

interface AdaptiveDailyPlanCardProps {
  timeBudget: StudyTimeBudget;
  primaryAction: NextAction | null;
  secondaryAction: NextAction | null;
}

// ── Time block definition ─────────────────────────────────────────────────────

type TimeBlock = {
  activity: string;
  minutes: number;
  description: string;
  href: string;
  color: string;
  Icon: typeof BookOpen;
};

function buildTimeBlocks(
  budget: StudyTimeBudget,
  primaryAction: NextAction | null,
): TimeBlock[] {
  const { breakdown } = budget.daily;
  const blocks: TimeBlock[] = [];

  if (breakdown.lesson > 0) {
    const isLesson = primaryAction?.kind === "lesson";
    blocks.push({
      activity: "Lesson",
      minutes: breakdown.lesson,
      description: isLesson
        ? primaryAction!.title
        : "Review a lesson module on your weakest topic.",
      href: isLesson ? primaryAction!.href : "/app/lessons",
      color: "var(--semantic-info)",
      Icon: BookOpen,
    });
  }

  if (breakdown.practice > 0) {
    const isPractice = primaryAction?.kind === "quiz" || primaryAction?.kind === "mock" || primaryAction?.kind === "cat";
    blocks.push({
      activity: "Practice",
      minutes: breakdown.practice,
      description: isPractice
        ? primaryAction!.title
        : "Scored questions targeting your highest-impact weak areas.",
      href: isPractice ? primaryAction!.href : "/app/questions?studyMode=weak",
      color: "var(--accent-primary)",
      Icon: HelpCircle,
    });
  }

  if (breakdown.review > 0) {
    blocks.push({
      activity: "Review",
      minutes: breakdown.review,
      description: "Revisit rationales for questions answered incorrectly this week.",
      href: "/app/review",
      color: "var(--semantic-warning)",
      Icon: RotateCcw,
    });
  }

  if (breakdown.flashcard > 0) {
    blocks.push({
      activity: "Flashcards",
      minutes: breakdown.flashcard,
      description: "Quick spaced-repetition review of due cards.",
      href: "/app/flashcards",
      color: "var(--semantic-success)",
      Icon: Layers,
    });
  }

  return blocks;
}

function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdaptiveDailyPlanCard({
  timeBudget,
  primaryAction,
  secondaryAction,
}: AdaptiveDailyPlanCardProps) {
  const blocks = buildTimeBlocks(timeBudget, primaryAction);
  const { daily, weekly } = timeBudget;

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, var(--semantic-success) 18%, var(--border-subtle))`,
        background: `color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card))`,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: `1px solid color-mix(in srgb, var(--semantic-success) 14%, var(--border-subtle))`,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `color-mix(in srgb, var(--semantic-success) 12%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, var(--semantic-success) 24%, var(--border-subtle))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Calendar className="h-3.5 w-3.5" style={{ color: "var(--semantic-success)" }} aria-hidden />
        </span>
        <div>
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--theme-heading-text, var(--semantic-text-primary))",
              lineHeight: 1.2,
            }}
          >
            Today&apos;s Study Plan
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--semantic-text-muted)" }}>
            {formatMinutes(daily.totalMinutes)} · {weekly.questionTarget} questions this week
          </p>
        </div>
      </div>

      {/* Time blocks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "12px 20px 16px" }}>
        {blocks.map((block, i) => {
          const Icon = block.Icon;
          return (
            <div
              key={block.activity}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 0",
                borderBottom:
                  i < blocks.length - 1
                    ? `1px solid var(--border-subtle)`
                    : "none",
              }}
            >
              {/* Color bar + icon */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "0.5rem",
                    background: `color-mix(in srgb, ${block.color} 12%, var(--bg-card))`,
                    border: `1px solid color-mix(in srgb, ${block.color} 24%, var(--border-subtle))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: block.color }}
                    aria-hidden
                  />
                </div>
                {/* Connector line */}
                {i < blocks.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 18,
                      borderRadius: 99,
                      background: `color-mix(in srgb, ${block.color} 30%, var(--border-subtle))`,
                    }}
                  />
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: block.color,
                    }}
                  >
                    {block.activity}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--semantic-text-muted)",
                    }}
                  >
                    {block.minutes} min
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                    color: "var(--theme-body-text, var(--semantic-text-secondary))",
                    marginTop: 2,
                  }}
                >
                  {block.description}
                </p>
                <Link
                  href={block.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: 6,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: block.color,
                    textDecoration: "none",
                  }}
                >
                  Start →
                </Link>
              </div>
            </div>
          );
        })}

        {/* Secondary action tip */}
        {secondaryAction && (
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: "0.625rem",
              background: `color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, var(--semantic-warning) 16%, var(--border-subtle))`,
            }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--semantic-warning)", marginBottom: 2 }}>
              Also recommended
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--theme-body-text, var(--semantic-text-secondary))" }}>
              {secondaryAction.title}
            </p>
            <Link
              href={secondaryAction.href}
              style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--semantic-warning)", textDecoration: "none" }}
            >
              View →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
