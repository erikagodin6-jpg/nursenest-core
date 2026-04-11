/**
 * RecoveryPlanCard
 *
 * Premium recovery plan card — shown when the learner is "slightly_behind"
 * or "at_risk". Surfaces prioritised catch-up actions, concrete targets,
 * and (when applicable) a "cut first" section of lower-value activities.
 *
 * Design language: encouraging, actionable, non-judgmental.
 * Never harsh. Never a red-alert dashboard.
 *
 * Three visual sections:
 *   1. Header — supportive headline, consequence (if severe), status colour
 *   2. Action list — highest-impact first, with priority badges and concrete targets
 *   3. Cut-first panel — what to reduce to create recovery headroom (optional)
 *
 * Server component — all data pre-computed by buildRecoveryPlan().
 */

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  RotateCcw,
  Scissors,
  Target,
  Timer,
} from "lucide-react";
import type { RecoveryPlan, RecoveryAction, CatchUpStrategy } from "@/lib/learner/recovery-planner";

// ── Icon map for strategies ───────────────────────────────────────────────────

const STRATEGY_ICON: Record<CatchUpStrategy, typeof Target> = {
  redistribute: Timer,
  quiz_boost:   HelpCircle,
  weak_focus:   Target,
  cut_low_value:Scissors,
};

const STRATEGY_COLOR: Record<CatchUpStrategy, string> = {
  redistribute: "var(--semantic-info)",
  quiz_boost:   "var(--accent-primary)",
  weak_focus:   "var(--semantic-warning)",
  cut_low_value:"var(--semantic-text-muted)",
};

// ── Priority badge ────────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: RecoveryAction["priority"] }) {
  if (priority === "optional") return null;
  const isHighest = priority === "highest_impact";
  const color = isHighest ? "var(--accent-primary)" : "var(--semantic-text-muted)";
  const label = isHighest ? "Highest impact" : "Also helpful";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 7px",
        borderRadius: 99,
        fontSize: "0.5625rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color,
        background: `color-mix(in srgb, ${color} 10%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${color} 20%, var(--border-subtle))`,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

// ── Action row ────────────────────────────────────────────────────────────────

function ActionRow({ action, index }: { action: RecoveryAction; index: number }) {
  const Icon = STRATEGY_ICON[action.strategy];
  const color = STRATEGY_COLOR[action.strategy];
  const isFirst = index === 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "13px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "0.625rem",
          background: `color-mix(in srgb, ${color} 12%, var(--bg-card))`,
          border: `1px solid color-mix(in srgb, ${color} 22%, var(--border-subtle))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isFirst ? `0 0 10px color-mix(in srgb, ${color} 20%, transparent)` : "none",
        }}
      >
        <Icon className="h-4 w-4" style={{ color }} aria-hidden />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--theme-body-text, var(--semantic-text-primary))",
            }}
          >
            {action.label}
          </span>
          <PriorityBadge priority={action.priority} />
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            color: "var(--theme-body-text, var(--semantic-text-secondary))",
          }}
        >
          {action.rationale}
        </p>
        {action.concreteTarget && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: 6,
              padding: "3px 9px",
              borderRadius: "0.375rem",
              background: `color-mix(in srgb, ${color} 8%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, ${color} 18%, var(--border-subtle))`,
              fontSize: "0.75rem",
              fontWeight: 700,
              color,
            }}
          >
            {action.concreteTarget}
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={action.href}
        aria-label={`Start: ${action.label}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isFirst
            ? "var(--accent-primary)"
            : `color-mix(in srgb, ${color} 10%, var(--bg-card))`,
          border: isFirst
            ? "none"
            : `1px solid color-mix(in srgb, ${color} 22%, var(--border-subtle))`,
          color: isFirst ? "#fff" : color,
          flexShrink: 0,
          textDecoration: "none",
        }}
      >
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}

// ── Reduction row ─────────────────────────────────────────────────────────────

function ReductionRow({ label, rationale }: { label: string; rationale: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "9px 0",
        borderBottom: "1px solid color-mix(in srgb, var(--semantic-text-muted) 10%, var(--border-subtle))",
      }}
    >
      <Scissors
        className="h-3.5 w-3.5 mt-0.5 shrink-0"
        style={{ color: "var(--semantic-text-muted)" }}
        aria-hidden
      />
      <div>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--theme-body-text, var(--semantic-text-secondary))",
            marginBottom: 2,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            lineHeight: 1.55,
            color: "var(--semantic-text-muted)",
          }}
        >
          {rationale}
        </p>
      </div>
    </div>
  );
}

// ── Status accent by plan track ───────────────────────────────────────────────

function statusAccent(status: RecoveryPlan["status"]): string {
  if (status === "at_risk" || status === "overdue") return "var(--semantic-warning)";
  return "var(--semantic-info)";
}

// ── Extra minutes callout ─────────────────────────────────────────────────────

function ExtraMinutesCallout({ minutes, accent }: { minutes: number; accent: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: "0.75rem",
        background: `color-mix(in srgb, ${accent} 7%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${accent} 18%, var(--border-subtle))`,
        width: "fit-content",
      }}
    >
      <Timer className="h-4 w-4" style={{ color: accent }} aria-hidden />
      <div>
        <span style={{ fontSize: "1.25rem", fontWeight: 900, color: accent, lineHeight: 1 }}>
          +{minutes}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--semantic-text-muted)", marginLeft: 4 }}>
          min/day for a few days to catch up
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface RecoveryPlanCardProps {
  plan: RecoveryPlan;
}

export function RecoveryPlanCard({ plan }: RecoveryPlanCardProps) {
  const accent = statusAccent(plan.status);
  const highImpact = plan.actions.filter((a) => a.priority === "highest_impact");
  const secondary = plan.actions.filter((a) => a.priority !== "highest_impact");

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, ${accent} 20%, var(--border-subtle))`,
        background: `color-mix(in srgb, ${accent} 4%, var(--bg-card))`,
        boxShadow: "var(--shadow-card, 0 2px 8px rgb(0 0 0 / 0.04))",
        overflow: "hidden",
      }}
      aria-live="polite"
    >
      {/* Accent stripe */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 30%, transparent))`,
        }}
        aria-hidden
      />

      {/* Header */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: `1px solid color-mix(in srgb, ${accent} 12%, var(--border-subtle))`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "0.625rem",
              background: `color-mix(in srgb, ${accent} 12%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, ${accent} 22%, var(--border-subtle))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RotateCcw className="h-4 w-4" style={{ color: accent }} aria-hidden />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accent,
                marginBottom: 4,
              }}
            >
              Recovery Plan
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 700,
                lineHeight: 1.35,
                color: "var(--theme-heading-text, var(--semantic-text-primary))",
              }}
            >
              {plan.headline}
            </p>
            {plan.consequence && (
              <p
                style={{
                  marginTop: 4,
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: "var(--semantic-text-muted)",
                }}
              >
                {plan.consequence}
              </p>
            )}
          </div>
        </div>

        {plan.extraMinutesPerDay && plan.extraMinutesPerDay > 0 && (
          <ExtraMinutesCallout minutes={plan.extraMinutesPerDay} accent={accent} />
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: "4px 20px 12px" }}>
        {/* High-impact section */}
        {highImpact.length > 0 && (
          <div>
            <p
              style={{
                padding: "10px 0 0",
                fontSize: "0.625rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--accent-primary)",
              }}
            >
              Do these first
            </p>
            {highImpact.map((action, i) => (
              <ActionRow key={action.id} action={action} index={i} />
            ))}
          </div>
        )}

        {/* Secondary section */}
        {secondary.filter((a) => a.priority === "secondary").length > 0 && (
          <div>
            <p
              style={{
                padding: "10px 0 0",
                fontSize: "0.625rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--semantic-text-muted)",
              }}
            >
              Also recommended
            </p>
            {secondary
              .filter((a) => a.priority === "secondary")
              .map((action, i) => (
                <ActionRow key={action.id} action={action} index={highImpact.length + i} />
              ))}
          </div>
        )}
      </div>

      {/* Cut-first section */}
      {plan.requiresReduction && plan.reductions.length > 0 && (
        <div
          style={{
            padding: "14px 20px 16px",
            borderTop: `1px solid color-mix(in srgb, var(--semantic-text-muted) 10%, var(--border-subtle))`,
            background: "color-mix(in srgb, var(--semantic-text-muted) 3%, var(--bg-card))",
          }}
        >
          <p
            style={{
              fontSize: "0.625rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--semantic-text-muted)",
              marginBottom: 4,
            }}
          >
            Reduce first to make room
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--semantic-text-muted)",
              lineHeight: 1.55,
              marginBottom: 10,
            }}
          >
            Trimming lower-yield activities creates recovery headroom without adding more time to your day.
          </p>
          {plan.reductions.map((r, i) => (
            <ReductionRow key={i} label={r.label} rationale={r.rationale} />
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: `1px solid color-mix(in srgb, ${accent} 12%, var(--border-subtle))`,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/app/questions?studyMode=weak"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: "0.625rem",
            background: accent,
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <Target className="h-3.5 w-3.5" aria-hidden />
          Start now
        </Link>
        <Link
          href="/app/lessons"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: "0.625rem",
            background: `color-mix(in srgb, var(--semantic-info) 10%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, var(--semantic-info) 20%, var(--border-subtle))`,
            color: "var(--semantic-info)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Lessons
        </Link>
        <Link
          href="/app/flashcards"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: "0.625rem",
            background: `color-mix(in srgb, var(--semantic-success) 10%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, var(--semantic-success) 20%, var(--border-subtle))`,
            color: "var(--semantic-success)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Layers className="h-3.5 w-3.5" aria-hidden />
          Flashcards
        </Link>
      </div>
    </div>
  );
}
