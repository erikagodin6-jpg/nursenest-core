/**
 * UnifiedReviewHero
 *
 * Multi-source hero for the /app/review page.
 * Shows a 5-stat summary across questions, flashcards, and topics.
 * Each stat chip uses a distinct semantic color (no monochrome).
 *
 * Server Component — no client state needed.
 */

import type { UnifiedReviewSummary } from "@/lib/study/unified-review-types";
import { BrainCircuit } from "lucide-react";

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  accent,
  hide,
}: {
  label: string;
  value: number;
  accent: string;
  hide?: boolean;
}) {
  if (hide) return null;
  return (
    <div
      className="flex min-w-[5.5rem] flex-col items-center rounded-xl px-4 py-3 text-center"
      style={{
        background: `color-mix(in srgb, ${accent} 10%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${accent} 28%, var(--border-subtle, var(--theme-border)))`,
      }}
    >
      <span
        className="text-2xl font-extrabold leading-none tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </span>
      <span
        className="mt-1 text-[11px] font-medium leading-tight"
        style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Source badge row ──────────────────────────────────────────────────────────

function SourceBadge({
  label,
  count,
  accent,
}: {
  label: string;
  count: number;
  accent: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: `color-mix(in srgb, ${accent} 12%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${accent} 28%, var(--border-subtle, var(--theme-border)))`,
        color: accent,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: accent }}
        aria-hidden="true"
      />
      {count} {label}
    </span>
  );
}

// ── UnifiedReviewHero ─────────────────────────────────────────────────────────

export function UnifiedReviewHero({ summary }: { summary: UnifiedReviewSummary }) {
  const urgent = summary.overdueCount + summary.dueTodayCount;
  const hasItems = summary.totalItems > 0;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-emphasis, color-mix(in srgb, var(--semantic-brand) 7%, var(--bg-card)))",
        border:
          "1px solid color-mix(in srgb, var(--theme-primary) 22%, var(--border-subtle, var(--theme-border)))",
      }}
      role="region"
      aria-label="Spaced repetition review summary"
    >
      <div className="px-6 py-5 sm:px-7 sm:py-6">
        {/* Label row */}
        <div className="flex items-center gap-2">
          <BrainCircuit
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            style={{ color: "var(--theme-primary)" }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            aria-hidden="true"
          >
            Spaced repetition · Smart review
          </p>
        </div>

        {/* Headline */}
        <h1
          className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {hasItems
            ? urgent > 0
              ? `${urgent} item${urgent !== 1 ? "s" : ""} need your attention`
              : `${summary.dueSoonCount} coming up soon`
            : "Your review queue is empty"}
        </h1>

        {/* Summary message */}
        <p
          className="mt-1.5 max-w-xl text-sm leading-relaxed"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
        >
          {summary.summaryMessage}
        </p>

        {/* Stat chips — primary metrics */}
        {hasItems ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            <StatChip
              label="Overdue"
              value={summary.overdueCount}
              accent="var(--semantic-danger, #ef4444)"
              hide={summary.overdueCount === 0}
            />
            <StatChip
              label="Due Today"
              value={summary.dueTodayCount}
              accent="var(--semantic-warning, #f59e0b)"
              hide={summary.dueTodayCount === 0}
            />
            <StatChip
              label="High Risk"
              value={summary.highRiskCount}
              accent="var(--semantic-chart-5, #f97316)"
              hide={summary.highRiskCount === 0}
            />
            <StatChip
              label="Due Soon"
              value={summary.dueSoonCount}
              accent="var(--semantic-info, #38bdf8)"
              hide={summary.dueSoonCount === 0}
            />
            <StatChip
              label="Stable"
              value={summary.stableCount}
              accent="var(--semantic-success, #22c55e)"
              hide={summary.stableCount === 0}
            />
          </div>
        ) : null}

        {/* Source breakdown badges */}
        {hasItems ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              Sources:
            </span>
            {summary.flashcardDecksWithDue > 0 ? (
              <SourceBadge
                label={`flashcard deck${summary.flashcardDecksWithDue !== 1 ? "s" : ""}`}
                count={summary.flashcardDecksWithDue}
                accent="var(--semantic-chart-3, #a78bfa)"
              />
            ) : null}
            {summary.topicsAtRisk > 0 ? (
              <SourceBadge
                label={`topic${summary.topicsAtRisk !== 1 ? "s" : ""} at risk`}
                count={summary.topicsAtRisk}
                accent="var(--semantic-chart-5, #f97316)"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
