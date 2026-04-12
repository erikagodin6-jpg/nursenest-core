"use client";

/**
 * ReadinessDimensionTabs
 *
 * Client component showing readiness breakdown across three dimensions:
 *   Tab 1 — Body System (e.g. Cardiovascular, Neurological, Respiratory)
 *   Tab 2 — Cognitive Level (Knowledge, Application, Analysis, Synthesis)
 *   Tab 3 — Question Type (MCQ, SATA, Ordered Response, etc.)
 *
 * Each tab renders a ranked horizontal bar chart using CSS width percentages
 * and semantic color fills — no external charting library.
 *
 * Color semantics:
 *   ≥ 80% accuracy → success (green)
 *   60–79%         → info/brand (blue)
 *   40–59%         → warning (amber)
 *   < 40%          → danger (red)
 *
 * Empty state renders a motivating call-to-action if no data for that dimension.
 */

import { useState } from "react";
import Link from "next/link";
import type { DimensionBreakdown, DimensionStat } from "@/lib/learner/readiness-dashboard-data";

// ── Accuracy color ────────────────────────────────────────────────────────────

function accuracyAccent(pct: number): string {
  if (pct >= 80) return "var(--semantic-success, #22c55e)";
  if (pct >= 60) return "var(--semantic-info, #76b6c4)";
  if (pct >= 40) return "var(--semantic-warning, #d97706)";
  return "var(--semantic-danger, #e11d48)";
}

function accuracyFillClass(pct: number): string {
  if (pct >= 80) return "nn-progress-fill-semantic-success";
  if (pct >= 60) return "nn-progress-fill-semantic-info";
  if (pct >= 40) return "nn-progress-fill-semantic-warning";
  return "nn-progress-fill-semantic-danger";
}

function accuracyLabel(pct: number): string {
  if (pct >= 80) return "Strong";
  if (pct >= 60) return "Solid";
  if (pct >= 40) return "Needs work";
  return "Weak";
}

// ── Single bar row ────────────────────────────────────────────────────────────

function DimensionBar({ stat, rank }: { stat: DimensionStat; rank: number }) {
  const accent = accuracyAccent(stat.accuracyPct);
  const fillClass = accuracyFillClass(stat.accuracyPct);
  const label = accuracyLabel(stat.accuracyPct);

  return (
    <div className="group flex items-center gap-3">
      {/* Rank */}
      <span
        className="w-5 shrink-0 text-right text-[11px] font-bold tabular-nums"
        style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
        aria-hidden="true"
      >
        {rank}
      </span>

      {/* Label + bar */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="truncate text-xs font-semibold"
            style={{ color: "var(--semantic-text-primary, var(--foreground))" }}
          >
            {stat.label}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className="text-[10px] font-medium"
              style={{ color: accent }}
            >
              {label}
            </span>
            <span
              className="text-xs font-bold tabular-nums"
              style={{ color: accent }}
            >
              {stat.accuracyPct}%
            </span>
          </div>
        </div>
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--xs"
          role="progressbar"
          aria-valuenow={stat.accuracyPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${stat.label}: ${stat.accuracyPct}% accuracy`}
        >
          <div
            className={`h-full rounded-full ${fillClass} transition-[width] duration-500 ease-out`}
            style={{ width: `${stat.accuracyPct}%` }}
          />
        </div>
        <p
          className="text-[10px]"
          style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
        >
          {stat.correct}/{stat.total} correct
        </p>
      </div>
    </div>
  );
}

// ── Empty state per tab ───────────────────────────────────────────────────────

function DimensionEmpty({ dimension }: { dimension: string }) {
  return (
    <div className="py-8 text-center">
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--semantic-text-primary, var(--foreground))" }}
      >
        No {dimension} data yet
      </p>
      <p
        className="mt-1 text-xs leading-relaxed"
        style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
      >
        Answer at least 2 questions in a category for it to appear here.
      </p>
      <Link
        href="/app/questions"
        className="mt-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-85"
        style={{
          background: "var(--theme-primary)",
          color: "var(--theme-primary-foreground, #fff)",
        }}
      >
        Practice questions →
      </Link>
    </div>
  );
}

// ── Dimension panel ───────────────────────────────────────────────────────────

function DimensionPanel({
  stats,
  emptyLabel,
}: {
  stats: DimensionStat[];
  emptyLabel: string;
}) {
  if (stats.length === 0) return <DimensionEmpty dimension={emptyLabel} />;

  const sorted = [...stats].sort((a, b) => b.total - a.total).slice(0, 12);

  // Sort by accuracy for display ranking (weakest first for quick diagnosis)
  const displayed = [...sorted].sort((a, b) => a.accuracyPct - b.accuracyPct);

  return (
    <div className="space-y-4">
      {displayed.map((stat, i) => (
        <DimensionBar key={stat.label} stat={stat} rank={i + 1} />
      ))}
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────

type TabId = "body_system" | "cognitive_level" | "question_type";

const TABS: { id: TabId; label: string; emptyLabel: string }[] = [
  { id: "body_system",     label: "Body System",     emptyLabel: "body system" },
  { id: "cognitive_level", label: "Cognitive Level",  emptyLabel: "cognitive level" },
  { id: "question_type",   label: "Question Type",    emptyLabel: "question type" },
];

// ── ReadinessDimensionTabs ────────────────────────────────────────────────────

export function ReadinessDimensionTabs({
  dimensions,
}: {
  dimensions: DimensionBreakdown;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("body_system");

  const panels: Record<TabId, DimensionStat[]> = {
    body_system:     dimensions.byBodySystem,
    cognitive_level: dimensions.byCognitiveLevel,
    question_type:   dimensions.byQuestionType,
  };

  const totalItems = Object.values(panels).reduce((s, a) => s + a.length, 0);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
      }}
    >
      {/* Section heading */}
      <div className="px-5 py-4 sm:px-6">
        <h2
          className="text-base font-bold"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          Readiness Breakdown
        </h2>
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
        >
          Accuracy by dimension — ranked weakest-first to prioritise your focus.
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b px-5 sm:px-6"
        style={{ borderColor: "var(--border-subtle, var(--theme-border))" }}
        role="tablist"
        aria-label="Readiness dimensions"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const count = panels[tab.id].length;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`dim-panel-${tab.id}`}
              id={`dim-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-3 pt-2 text-xs font-semibold transition-colors focus-visible:outline-none mr-5 last:mr-0"
              style={{
                borderColor: active
                  ? "var(--theme-primary)"
                  : "transparent",
                color: active
                  ? "var(--theme-primary)"
                  : "var(--semantic-text-muted, var(--muted-foreground))",
              }}
            >
              {tab.label}
              {count > 0 ? (
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: active
                      ? "color-mix(in srgb, var(--theme-primary) 14%, var(--bg-card))"
                      : "color-mix(in srgb, var(--border-subtle) 40%, var(--bg-card))",
                    color: active
                      ? "var(--theme-primary)"
                      : "var(--semantic-text-muted)",
                  }}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      {totalItems === 0 ? (
        <DimensionEmpty dimension="readiness breakdown" />
      ) : (
        TABS.map((tab) => (
          <div
            key={tab.id}
            id={`dim-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`dim-tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className="px-5 py-5 sm:px-6"
          >
            <DimensionPanel stats={panels[tab.id]} emptyLabel={tab.emptyLabel} />
          </div>
        ))
      )}
    </div>
  );
}
