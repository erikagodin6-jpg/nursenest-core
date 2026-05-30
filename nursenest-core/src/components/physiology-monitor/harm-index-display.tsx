"use client";

/**
 * HarmIndexDisplay
 *
 * Standalone component for rendering the patient-safety Harm Index result.
 * Can be embedded in the session report card or shown inline in the workstation.
 *
 * Compact variant: badge + score only.
 * Full variant: badge + score + events timeline + safety coaching.
 */

import type { HarmIndexResult, HarmEvent, HarmLevel } from "@/lib/physiology-monitor/harm-index";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HarmIndexDisplayProps {
  result: HarmIndexResult;
  variant?: "compact" | "full";
}

// ─── Color config ─────────────────────────────────────────────────────────────

const COLOR_CONFIG = {
  green:  { bg: "rgba(0,230,118,0.10)",  border: "rgba(0,230,118,0.35)",  text: "#00e676", label: "Green — No Harm"        },
  yellow: { bg: "rgba(255,215,64,0.10)", border: "rgba(255,215,64,0.35)", text: "#ffd740", label: "Yellow — Near Miss"      },
  red:    { bg: "rgba(255,23,68,0.12)",  border: "rgba(255,23,68,0.4)",   text: "#ff6090", label: "Red — Patient Harm"      },
} as const;

const LEVEL_LABELS: Record<HarmLevel, string> = {
  none:               "No events",
  near_miss:          "Near miss",
  moderate:           "Moderate harm",
  severe:             "Severe harm",
  preventable_arrest: "Preventable arrest",
};

const LEVEL_COLORS: Record<HarmLevel, string> = {
  none:               "#00e676",
  near_miss:          "#ffd740",
  moderate:           "#ff9100",
  severe:             "#ff6090",
  preventable_arrest: "#ff1744",
};

// ─── Compact badge ────────────────────────────────────────────────────────────

function CompactBadge({ result }: { result: HarmIndexResult }) {
  const cfg = COLOR_CONFIG[result.color];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 6,
        padding: "6px 12px",
        fontFamily: "var(--mon-font, monospace)",
      }}
      role="status"
      aria-label={`Harm Index: ${cfg.label}, score ${result.score}`}
    >
      <ColorDot color={cfg.text} size={10} pulse={result.color === "red"} />
      <div>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: cfg.text }}>
          Harm Index
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
          {cfg.label}
        </div>
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 400,
          color: cfg.text,
          fontVariantNumeric: "tabular-nums",
          marginLeft: 6,
        }}
      >
        {result.score}
        <span style={{ fontSize: "10px", color: "#4a6a88", marginLeft: 2 }}>/100</span>
      </div>
    </div>
  );
}

// ─── Color dot ────────────────────────────────────────────────────────────────

function ColorDot({ color, size = 8, pulse = false }: { color: string; size?: number; pulse?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: pulse ? "mon-alarm-pulse 1s ease-in-out infinite" : "none",
      }}
      aria-hidden
    />
  );
}

// ─── Event timeline ───────────────────────────────────────────────────────────

function EventTimeline({ events }: { events: HarmEvent[] }) {
  if (events.length === 0) {
    return (
      <div style={{ fontSize: "10px", color: "#4a6a88", padding: "8px 0" }}>
        No harm events recorded — excellent patient safety.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} role="list" aria-label="Harm event timeline">
      {events.map((event, i) => {
        const levelColor = LEVEL_COLORS[event.level];
        const simMin = Math.floor(event.simSeconds / 60);
        const simSec = Math.floor(event.simSeconds % 60);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              borderLeft: `3px solid ${levelColor}`,
              paddingLeft: 8,
            }}
            role="listitem"
          >
            {/* Time */}
            <span
              style={{
                fontSize: "9px",
                fontVariantNumeric: "tabular-nums",
                color: "#4a6a88",
                minWidth: 36,
                flexShrink: 0,
                paddingTop: 1,
              }}
            >
              {String(simMin).padStart(2, "0")}:{String(simSec).padStart(2, "0")}
            </span>

            {/* Content */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                <ColorDot color={levelColor} size={5} />
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: 700,
                    color: levelColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {LEVEL_LABELS[event.level]}
                </span>
                {event.correctedByLearner && (
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#00e676",
                      background: "rgba(0,230,118,0.1)",
                      border: "1px solid rgba(0,230,118,0.3)",
                      borderRadius: 3,
                      padding: "0 4px",
                    }}
                  >
                    Corrected
                  </span>
                )}
              </div>
              <p style={{ fontSize: "9px", color: "#8fafc8", margin: 0, lineHeight: 1.5 }}>
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Safety coaching ──────────────────────────────────────────────────────────

function SafetyCoachingPanel({ items }: { items: string[] }) {
  return (
    <div
      style={{
        background: "rgba(255,215,64,0.05)",
        border: "1px solid rgba(255,215,64,0.2)",
        borderRadius: 6,
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#ffd740",
          marginBottom: 6,
        }}
      >
        Safety Coaching
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <span style={{ color: "#ffd740", flexShrink: 0, marginTop: 1 }} aria-hidden>›</span>
            <span style={{ fontSize: "9px", color: "#e8edf2", lineHeight: 1.55 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreArc({ score, color }: { score: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden>
      <circle cx="25" cy="25" r={r} fill="none" stroke="#152336" strokeWidth="4" />
      <circle
        cx="25" cy="25" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
      />
      <text x="25" y="29" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HarmIndexDisplay({ result, variant = "full" }: HarmIndexDisplayProps) {
  const cfg = COLOR_CONFIG[result.color];

  if (variant === "compact") {
    return <CompactBadge result={result} />;
  }

  return (
    <div
      style={{ fontFamily: "var(--mon-font, monospace)", display: "flex", flexDirection: "column", gap: 12 }}
      aria-label="Patient safety harm index"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <ScoreArc score={result.score} color={cfg.text} />
        <div>
          <div
            style={{
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a6a88",
              marginBottom: 3,
            }}
          >
            Harm Index
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 5,
              padding: "4px 10px",
            }}
          >
            <ColorDot color={cfg.text} size={8} pulse={result.color === "red"} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: cfg.text }}>{cfg.label}</span>
          </div>
          <p style={{ fontSize: "9px", color: "#8fafc8", margin: "5px 0 0", lineHeight: 1.5, maxWidth: 260 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Events timeline */}
      <div>
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#4a6a88",
            marginBottom: 6,
          }}
        >
          Events Timeline
        </div>
        <EventTimeline events={result.events} />
      </div>

      {/* Safety coaching */}
      {result.safetyCoaching.length > 0 && (
        <SafetyCoachingPanel items={result.safetyCoaching} />
      )}
    </div>
  );
}
