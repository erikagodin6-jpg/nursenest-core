/**
 * ProbabilityUpliftCard
 *
 * Server component. Shows ranked weak topics by their estimated readiness
 * impact — the answer to "what should I do to move my score the most?"
 *
 * Each row: topic, current accuracy, estimated gain, effort badge, CTA link.
 */

import Link from "next/link";
import { TrendingUp, Zap, Flame, Dumbbell } from "lucide-react";
import type { ProbabilityUpliftResult, UpliftOpportunity } from "@/lib/study/adaptive-engine/probability-uplift";

interface ProbabilityUpliftCardProps {
  uplift: ProbabilityUpliftResult;
}

// ── Effort badge ──────────────────────────────────────────────────────────────

function EffortBadge({ effort }: { effort: UpliftOpportunity["effort"] }) {
  const Icon = effort === "quick" ? Zap : effort === "medium" ? Flame : Dumbbell;
  const color =
    effort === "quick"
      ? "var(--semantic-success)"
      : effort === "medium"
        ? "var(--semantic-warning)"
        : "var(--semantic-danger)";
  const label =
    effort === "quick" ? "Quick win" : effort === "medium" ? "Moderate" : "Deep work";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 99,
        border: `1px solid color-mix(in srgb, ${color} 28%, var(--border-subtle))`,
        background: `color-mix(in srgb, ${color} 10%, var(--bg-card))`,
        fontSize: "0.6rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color,
        whiteSpace: "nowrap",
      }}
    >
      <Icon className="h-2.5 w-2.5" aria-hidden />
      {label}
    </span>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function UpliftRow({ opp, rank }: { opp: UpliftOpportunity; rank: number }) {
  const gainColor =
    opp.estimatedReadinessGain >= 7
      ? "var(--semantic-success)"
      : opp.estimatedReadinessGain >= 4
        ? "var(--semantic-info)"
        : "var(--semantic-warning)";

  const actionLabel =
    opp.recommendedAction === "review_lesson"
      ? "Review lesson"
      : opp.recommendedAction === "drill_questions"
        ? "Drill questions"
        : "Study both";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        padding: "12px 0",
        borderBottom: `1px solid var(--border-subtle)`,
      }}
    >
      {/* Rank */}
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: rank === 1
            ? `color-mix(in srgb, var(--accent-primary) 14%, var(--bg-card))`
            : "var(--bg-subtle)",
          border: rank === 1
            ? `1px solid color-mix(in srgb, var(--accent-primary) 28%, var(--border-subtle))`
            : `1px solid var(--border-subtle)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6875rem",
          fontWeight: 800,
          color: rank === 1 ? "var(--accent-primary)" : "var(--semantic-text-muted)",
          flexShrink: 0,
        }}
        aria-label={`Rank ${rank}`}
      >
        {rank}
      </span>

      {/* Topic + effort */}
      <div style={{ flex: "1 1 140px", minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--theme-body-text, var(--semantic-text-primary))",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {opp.topic}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <EffortBadge effort={opp.effort} />
          <span style={{ fontSize: "0.6875rem", color: "var(--semantic-text-muted)" }}>
            Currently {opp.currentAccuracyPct}% → target {opp.targetAccuracyPct}%
          </span>
        </div>
      </div>

      {/* Gain */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
          minWidth: 48,
        }}
      >
        <span
          style={{
            fontSize: "1.125rem",
            fontWeight: 900,
            lineHeight: 1,
            color: gainColor,
          }}
        >
          +{opp.estimatedReadinessGain}
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--semantic-text-muted)",
          }}
        >
          pts
        </span>
      </div>

      {/* CTA */}
      <Link
        href={opp.href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "5px 12px",
          borderRadius: "0.5rem",
          background: `color-mix(in srgb, var(--accent-primary) 12%, var(--bg-card))`,
          border: `1px solid color-mix(in srgb, var(--accent-primary) 22%, var(--border-subtle))`,
          color: "var(--accent-primary)",
          fontSize: "0.75rem",
          fontWeight: 700,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {actionLabel}
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProbabilityUpliftCard({ uplift }: ProbabilityUpliftCardProps) {
  if (uplift.opportunities.length === 0) {
    return (
      <div
        style={{
          borderRadius: "1rem",
          border: `1px solid color-mix(in srgb, var(--semantic-success) 18%, var(--border-subtle))`,
          background: `color-mix(in srgb, var(--semantic-success) 6%, var(--bg-card))`,
          boxShadow: "var(--shadow-card)",
          padding: "24px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: 700, color: "var(--semantic-success)", marginBottom: 4 }}>
          No significant weak areas detected
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--semantic-text-muted)" }}>
          Keep up consistent practice to maintain your readiness edge.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, var(--accent-primary) 18%, var(--border-subtle))`,
        background: `color-mix(in srgb, var(--accent-primary) 4%, var(--bg-card))`,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid color-mix(in srgb, var(--accent-primary) 12%, var(--border-subtle))`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `color-mix(in srgb, var(--accent-primary) 12%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, var(--accent-primary) 24%, var(--border-subtle))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--accent-primary)" }} aria-hidden />
          </span>
          <div>
            <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--theme-heading-text, var(--semantic-text-primary))", lineHeight: 1.2 }}>
              Readiness Uplift Opportunities
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--semantic-text-muted)" }}>
              Study these to gain the most readiness points
            </p>
          </div>
        </div>

        {/* Total potential */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--accent-primary)", lineHeight: 1 }}>
            +{uplift.totalPotentialGain}
          </span>
          <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-text-muted)" }}>
            potential
          </span>
        </div>
      </div>

      {/* Top recommendation callout */}
      {uplift.topRecommendation && (
        <div
          style={{
            margin: "14px 20px 0",
            padding: "12px 14px",
            borderRadius: "0.75rem",
            background: `color-mix(in srgb, var(--accent-primary) 8%, var(--bg-card))`,
            border: `1.5px solid color-mix(in srgb, var(--accent-primary) 22%, var(--border-subtle))`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 4,
              alignSelf: "stretch",
              borderRadius: 99,
              background: "var(--accent-primary)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent-primary)", marginBottom: 2 }}>
              Top priority
            </p>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--theme-body-text, var(--semantic-text-primary))" }}>
              {uplift.topRecommendation.topic}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--semantic-text-muted)" }}>
              Estimated +{uplift.topRecommendation.estimatedReadinessGain} pts if accuracy reaches {uplift.topRecommendation.targetAccuracyPct}%
            </p>
          </div>
          <Link
            href={uplift.topRecommendation.href}
            style={{
              padding: "7px 14px",
              borderRadius: "0.5rem",
              border: "none",
              background: "var(--accent-primary)",
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Start
          </Link>
        </div>
      )}

      {/* Rows */}
      <div style={{ padding: "4px 20px 8px" }}>
        {uplift.opportunities.map((opp, i) => (
          <UpliftRow key={opp.topic} opp={opp} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
