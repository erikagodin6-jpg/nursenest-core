"use client";

import { TrendingUp, Lightbulb, AlertCircle } from "lucide-react";
import {
  MISTAKE_REASON_LABELS,
  MISTAKE_REASON_ROLE,
  type MistakeNotebookData,
  type MistakePattern,
  type MistakeReason,
} from "@/lib/mistakes/mistake-types";
import { patternHeadline, patternInsight } from "@/lib/mistakes/mistake-patterns";

const ROLE_COLORS: Record<string, { primary: string; soft: string }> = {
  info:        { primary: "var(--semantic-info)",                       soft: "color-mix(in srgb, var(--semantic-info) 10%, var(--bg-card))" },
  warning:     { primary: "color-mix(in srgb, var(--semantic-warning) 85%, var(--semantic-text-primary))", soft: "color-mix(in srgb, var(--semantic-warning) 10%, var(--bg-card))" },
  concept:     { primary: "var(--semantic-violet, #7c3aed)",            soft: "color-mix(in srgb, var(--semantic-violet, #7c3aed) 10%, var(--bg-card))" },
  action:      { primary: "var(--semantic-teal, #0d9488)",              soft: "color-mix(in srgb, var(--semantic-teal, #0d9488) 10%, var(--bg-card))" },
  diagnostic:  { primary: "var(--semantic-cyan, #0891b2)",              soft: "color-mix(in srgb, var(--semantic-cyan, #0891b2) 10%, var(--bg-card))" },
  application: { primary: "var(--semantic-chart-5, #6366f1)",           soft: "color-mix(in srgb, var(--semantic-chart-5, #6366f1) 10%, var(--bg-card))" },
};

function getColor(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS["info"];
}

function PatternRow({ pattern }: { pattern: MistakePattern }) {
  const role = MISTAKE_REASON_ROLE[pattern.reason];
  const { primary, soft } = getColor(role);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: soft,
        border: `1px solid color-mix(in srgb, ${primary} 18%, transparent)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: primary }}>
            {patternHeadline(pattern.reason, pattern.count)}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
            {patternInsight(pattern.reason, pattern.count, pattern.pct)}
          </p>
        </div>
        {/* Pct bar */}
        <div className="flex-shrink-0 text-right">
          <span className="text-xl font-black" style={{ color: primary }}>
            {pattern.pct}%
          </span>
        </div>
      </div>

      {/* Study tip */}
      <div
        className="mt-3 flex gap-2 rounded-lg px-3 py-2"
        style={{
          background: "var(--semantic-surface)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: primary }} aria-hidden="true" />
        <p className="text-xs leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
          {pattern.studyTip}
        </p>
      </div>

      {/* Top topics for this pattern */}
      {pattern.topTopics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pattern.topTopics.map((t) => (
            <span
              key={t}
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                background: `color-mix(in srgb, ${primary} 8%, var(--bg-card))`,
                color: primary,
                border: `1px solid color-mix(in srgb, ${primary} 18%, transparent)`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  data: MistakeNotebookData;
  onFilterReason?: (reason: MistakeReason) => void;
};

/**
 * "Top mistakes holding you back" section.
 * Shows aggregated patterns with actionable study tips.
 */
export function MistakePatternCard({ data, onFilterReason }: Props) {
  const { patterns, taggedCount, totalMisses } = data;
  const untaggedCount = totalMisses - taggedCount;

  if (totalMisses === 0) return null;

  if (taggedCount === 0) {
    return (
      <section
        className="rounded-2xl p-5"
        aria-labelledby="patterns-heading"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))",
          border: "1px solid color-mix(in srgb, var(--semantic-warning) 18%, transparent)",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 flex-shrink-0"
            style={{ color: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))" }}
            aria-hidden="true"
          />
          <div>
            <h2 id="patterns-heading" className="text-sm font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              Top mistakes holding you back
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
              Tag your {totalMisses} missed question{totalMisses !== 1 ? "s" : ""} to reveal your error patterns. Even tagging 5–10 will show you where to focus.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="patterns-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" style={{ color: "var(--semantic-brand)" }} aria-hidden="true" />
        <h2 id="patterns-heading" className="text-base font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          Top mistakes holding you back
        </h2>
        {untaggedCount > 0 && (
          <span className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
            ({taggedCount} of {totalMisses} tagged)
          </span>
        )}
      </div>

      {patterns.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--semantic-text-muted)" }}>
          Tag more mistakes to see patterns emerge.
        </p>
      ) : (
        <div className="space-y-2.5">
          {patterns.slice(0, 3).map((p) => (
            <button
              key={p.reason}
              type="button"
              onClick={() => onFilterReason?.(p.reason)}
              className="block w-full text-left transition-opacity hover:opacity-90"
              aria-label={`Filter by ${MISTAKE_REASON_LABELS[p.reason]}`}
            >
              <PatternRow pattern={p} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
