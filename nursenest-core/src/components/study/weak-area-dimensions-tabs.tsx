"use client";

/**
 * WeakAreaDimensionsTabs
 *
 * Tabbed view of multi-dimensional weak area analysis:
 *   Tab 1: By Body System — horizontal accuracy bars
 *   Tab 2: By Cognitive Level — three tiers
 *   Tab 3: Speed & Consistency — pace profile + consistency meter
 *
 * Client component for tab switching only. Data is server-fetched.
 */

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Brain, Gauge } from "lucide-react";
import type { WeakAreaDimensions, BodySystemGroup } from "@/lib/study/adaptive-engine/weak-area-dimensions";

interface WeakAreaDimensionsTabsProps {
  dimensions: WeakAreaDimensions;
}

// ── Severity colours ──────────────────────────────────────────────────────────

function severityColor(severity: BodySystemGroup["severity"]): string {
  switch (severity) {
    case "major_gap":   return "var(--semantic-danger)";
    case "needs_work":  return "var(--semantic-warning)";
    case "inconsistent":return "var(--semantic-info)";
    default:            return "var(--semantic-success)";
  }
}

function severityLabel(severity: BodySystemGroup["severity"]): string {
  switch (severity) {
    case "major_gap":   return "Major gap";
    case "needs_work":  return "Needs work";
    case "inconsistent":return "Inconsistent";
    default:            return "Stable";
  }
}

function accuracyColor(pct: number): string {
  if (pct < 40) return "var(--semantic-danger)";
  if (pct < 60) return "var(--semantic-warning)";
  if (pct < 75) return "var(--semantic-info)";
  return "var(--semantic-success)";
}

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: "body",  label: "Body System",      icon: AlertTriangle },
  { id: "cog",   label: "Cognitive Level",  icon: Brain },
  { id: "speed", label: "Speed & Pace",     icon: Gauge },
] as const;

type TabId = typeof TABS[number]["id"];

// ── Body System Tab ───────────────────────────────────────────────────────────

function BodySystemTab({ systems }: { systems: WeakAreaDimensions["byBodySystem"] }) {
  if (systems.length === 0) {
    return (
      <p style={{ fontSize: "0.875rem", color: "var(--semantic-text-muted)" }}>
        Answer more questions to unlock body-system analysis.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {systems.slice(0, 8).map((g) => {
        const color = severityColor(g.severity);
        const barColor = accuracyColor(g.accuracyPct);
        return (
          <div key={g.system} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  flex: "0 0 8px",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  flex: 1,
                  color: "var(--theme-body-text, var(--semantic-text-primary))",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {g.system}
              </span>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color,
                  flexShrink: 0,
                }}
              >
                {severityLabel(g.severity)}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 800,
                  color: barColor,
                  width: "3ch",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {g.accuracyPct}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 99,
                background: `color-mix(in srgb, ${barColor} 12%, var(--border-subtle))`,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(2, g.accuracyPct)}%`,
                  background: barColor,
                  borderRadius: 99,
                }}
              />
            </div>
            <p
              style={{
                fontSize: "0.6875rem",
                color: "var(--semantic-text-muted)",
                paddingLeft: 16,
              }}
            >
              {g.topics.slice(0, 3).join(" · ")}{g.topics.length > 3 ? ` +${g.topics.length - 3} more` : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Cognitive Level Tab ───────────────────────────────────────────────────────

const COG_DESCRIPTIONS: Record<string, string> = {
  knowledge: "Definitions, normal values, pathophysiology basics.",
  application: "Nursing interventions, medication administration, care planning.",
  analysis_evaluation: "Delegation, priority-setting, triage, safety decisions — NCLEX's most frequent category.",
};

function CognitiveTab({ levels }: { levels: WeakAreaDimensions["byCognitiveLevel"] }) {
  if (levels.length === 0) {
    return (
      <p style={{ fontSize: "0.875rem", color: "var(--semantic-text-muted)" }}>
        Answer more questions to unlock cognitive-level analysis.
      </p>
    );
  }

  const cogColors = ["var(--semantic-success)", "var(--semantic-info)", "var(--semantic-warning)"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {levels.map((lvl, i) => {
        const color = lvl.isWeakArea
          ? "var(--semantic-danger)"
          : cogColors[i] ?? "var(--semantic-info)";
        return (
          <div
            key={lvl.level}
            style={{
              padding: "12px 14px",
              borderRadius: "0.75rem",
              background: `color-mix(in srgb, ${color} 7%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, ${color} 18%, var(--border-subtle))`,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--theme-heading-text, var(--semantic-text-primary))",
                }}
              >
                {lvl.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {lvl.isWeakArea && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: `color-mix(in srgb, var(--semantic-danger) 12%, var(--bg-card))`,
                      border: `1px solid color-mix(in srgb, var(--semantic-danger) 22%, var(--border-subtle))`,
                      color: "var(--semantic-danger)",
                    }}
                  >
                    Weak area
                  </span>
                )}
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 900,
                    color,
                  }}
                >
                  {lvl.accuracyPct}%
                </span>
              </div>
            </div>
            <div
              style={{
                height: 5,
                borderRadius: 99,
                background: `color-mix(in srgb, ${color} 14%, var(--border-subtle))`,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(2, lvl.accuracyPct)}%`,
                  background: color,
                  borderRadius: 99,
                }}
              />
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--semantic-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {COG_DESCRIPTIONS[lvl.level] ?? ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Speed Tab ─────────────────────────────────────────────────────────────────

function SpeedTab({ dimensions }: { dimensions: WeakAreaDimensions }) {
  const { avgSecondsPerQuestion, speedClassification, consistencyScore, consistencyLabel } =
    dimensions;

  const speedColor =
    speedClassification === "slow"
      ? "var(--semantic-warning)"
      : speedClassification === "fast"
        ? "var(--semantic-info)"
        : "var(--semantic-success)";

  const consistencyColor =
    consistencyLabel === "highly_consistent"
      ? "var(--semantic-success)"
      : consistencyLabel === "moderate"
        ? "var(--semantic-warning)"
        : "var(--semantic-danger)";

  const consistencyText =
    consistencyLabel === "highly_consistent"
      ? "Your accuracy is reliably consistent across sessions. Great habit-building."
      : consistencyLabel === "moderate"
        ? "Some variation across sessions. Focus on building a daily routine."
        : "High variance between sessions — irregular study patterns can slow growth.";

  const speedText =
    speedClassification === "slow"
      ? "You tend to spend more than 95 seconds per question. For timed exams, work on decisiveness — eliminate wrong answers faster and trust your clinical reasoning."
      : speedClassification === "fast"
        ? "You move quickly (under 45 s/q). Ensure you&apos;re reading all answer options fully before choosing."
        : "Your pacing is well-balanced — close to the 60–75 second sweet spot for NCLEX-style questions.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Avg seconds */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 16px",
          borderRadius: "0.75rem",
          background: `color-mix(in srgb, ${speedColor} 7%, var(--bg-card))`,
          border: `1px solid color-mix(in srgb, ${speedColor} 18%, var(--border-subtle))`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 72 }}>
          <span
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: speedColor,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {avgSecondsPerQuestion !== null ? `${avgSecondsPerQuestion}s` : "—"}
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--semantic-text-muted)", fontWeight: 600 }}>
            avg / question
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: speedColor,
              marginBottom: 4,
            }}
          >
            {speedClassification === "slow"
              ? "Pacing: Take more time to focus"
              : speedClassification === "fast"
                ? "Pacing: Read carefully"
                : "Pacing: Well-balanced"}
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              lineHeight: 1.55,
              color: "var(--semantic-text-muted)",
            }}
            dangerouslySetInnerHTML={{ __html: speedText }}
          />
        </div>
      </div>

      {/* Consistency meter */}
      <div
        style={{
          padding: "14px 16px",
          borderRadius: "0.75rem",
          background: `color-mix(in srgb, ${consistencyColor} 7%, var(--bg-card))`,
          border: `1px solid color-mix(in srgb, ${consistencyColor} 18%, var(--border-subtle))`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--theme-heading-text, var(--semantic-text-primary))" }}>
            Session Consistency
          </span>
          <span style={{ fontSize: "1.125rem", fontWeight: 900, color: consistencyColor }}>
            {consistencyScore}/100
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 99,
            background: `color-mix(in srgb, ${consistencyColor} 12%, var(--border-subtle))`,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${consistencyScore}%`,
              background: consistencyColor,
              borderRadius: 99,
            }}
          />
        </div>
        <p style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--semantic-text-muted)" }}>
          {consistencyText}
        </p>
      </div>

      {avgSecondsPerQuestion === null && (
        <p style={{ fontSize: "0.8125rem", color: "var(--semantic-text-muted)", fontStyle: "italic" }}>
          Complete a few timed practice sessions to unlock detailed speed analysis.{" "}
          <Link href="/app/questions" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
            Start a timed set
          </Link>
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function WeakAreaDimensionsTabs({ dimensions }: WeakAreaDimensionsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("body");

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, var(--semantic-danger) 14%, var(--border-subtle))`,
        background: `color-mix(in srgb, var(--semantic-danger) 4%, var(--bg-card))`,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px 0",
          borderBottom: `1px solid color-mix(in srgb, var(--semantic-danger) 12%, var(--border-subtle))`,
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--semantic-danger)",
            marginBottom: "0.75rem",
          }}
        >
          Weak Area Analysis
        </p>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "0.5rem 0.5rem 0 0",
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid var(--semantic-danger)`
                    : "2px solid transparent",
                  background: isActive
                    ? `color-mix(in srgb, var(--semantic-danger) 8%, var(--bg-card))`
                    : "transparent",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--semantic-danger)" : "var(--semantic-text-muted)",
                  whiteSpace: "nowrap",
                }}
                aria-selected={isActive}
                role="tab"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "18px 20px" }} role="tabpanel">
        {activeTab === "body" && <BodySystemTab systems={dimensions.byBodySystem} />}
        {activeTab === "cog" && <CognitiveTab levels={dimensions.byCognitiveLevel} />}
        {activeTab === "speed" && <SpeedTab dimensions={dimensions} />}
      </div>
    </div>
  );
}
