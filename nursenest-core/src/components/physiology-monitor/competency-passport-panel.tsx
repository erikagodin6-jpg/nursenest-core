"use client";

/**
 * CompetencyPassportPanel
 *
 * Renders the Monitor Competency Passport — four domain competency bars,
 * overall level, and clinical-readiness clearance gates (Telemetry Ready,
 * ICU Ready).
 *
 * Integrates with MonitorCompetencyPassport from monitor-competency-tracker.ts.
 * Can be embedded in the session report card or shown on the learner dashboard.
 */

import type {
  MonitorCompetencyPassport,
  MonitorCompetencyDomainRecord,
  MonitorCompetencyLevel,
} from "@/lib/physiology-monitor/monitor-competency-tracker";
import { COMPETENCY_LEVEL_LABELS, COMPETENCY_LEVEL_ORDER } from "@/lib/physiology-monitor/monitor-competency-tracker";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompetencyPassportPanelProps {
  passport: MonitorCompetencyPassport;
  /** Show compact (domain bars only) or full (bars + clearances + coaching). */
  variant?: "compact" | "full";
}

// ─── Level config ─────────────────────────────────────────────────────────────

const LEVEL_COLOR: Record<MonitorCompetencyLevel, string> = {
  not_started: "#2a4a6e",
  developing:  "#ff6090",
  approaching: "#ff9100",
  competent:   "#ffd740",
  proficient:  "#40c4ff",
  expert:      "#00e676",
};

const LEVEL_BG: Record<MonitorCompetencyLevel, string> = {
  not_started: "rgba(42,74,110,0.12)",
  developing:  "rgba(255,96,144,0.10)",
  approaching: "rgba(255,145,0,0.10)",
  competent:   "rgba(255,215,64,0.10)",
  proficient:  "rgba(64,196,255,0.10)",
  expert:      "rgba(0,230,118,0.10)",
};

// ─── Level badge ──────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: MonitorCompetencyLevel }) {
  const color = LEVEL_COLOR[level];
  const bg = LEVEL_BG[level];
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        border: `1px solid ${color}44`,
        color,
        fontSize: "8px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: 3,
        padding: "2px 6px",
        fontFamily: "var(--mon-font, monospace)",
      }}
    >
      {COMPETENCY_LEVEL_LABELS[level]}
    </span>
  );
}

// ─── Domain progress bar ──────────────────────────────────────────────────────

function DomainBar({ domain }: { domain: MonitorCompetencyDomainRecord }) {
  const levelIndex = COMPETENCY_LEVEL_ORDER.indexOf(domain.level);
  const totalLevels = COMPETENCY_LEVEL_ORDER.length;
  // Overall progression across all levels (0–100)
  const totalProgress = Math.round(
    ((levelIndex / (totalLevels - 1)) * 80) +
    (domain.progressWithinLevel / 100) * (80 / (totalLevels - 1)),
  );

  const barColor = LEVEL_COLOR[domain.level];
  const isWorstHarmBlocking =
    domain.worstHarmLevelSeen === "severe" || domain.worstHarmLevelSeen === "preventable_arrest";

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }} role="listitem">
      {/* Domain header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#8fafc8" }}>{domain.label}</span>
          {isWorstHarmBlocking && (
            <span
              style={{
                marginLeft: 6,
                fontSize: "7px",
                fontWeight: 700,
                color: "#ff6090",
                background: "rgba(255,96,144,0.1)",
                border: "1px solid rgba(255,96,144,0.3)",
                borderRadius: 3,
                padding: "1px 4px",
              }}
              title="Advancement blocked due to harm event"
            >
              Blocked
            </span>
          )}
        </div>
        <LevelBadge level={domain.level} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: "#152336",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 3,
        }}
        role="progressbar"
        aria-valuenow={totalProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${domain.label}: ${COMPETENCY_LEVEL_LABELS[domain.level]}`}
      >
        <div
          style={{
            height: "100%",
            width: `${totalProgress}%`,
            background: barColor,
            borderRadius: 3,
            transition: "width 600ms ease",
          }}
        />
      </div>

      {/* Sub-stats */}
      <div style={{ display: "flex", gap: 10, fontSize: "8px", color: "#4a6a88" }}>
        <span>
          Sessions: <strong style={{ color: "#8fafc8" }}>{domain.sessionCount}</strong>
        </span>
        <span>
          Last: <strong style={{ color: barColor }}>{domain.lastSessionScore}</strong>
        </span>
        <span>
          Progress: <strong style={{ color: "#8fafc8" }}>{domain.progressWithinLevel}</strong>
          <span style={{ color: "#2a4a6e" }}>/{domain.advancementThreshold} needed</span>
        </span>
      </div>
    </div>
  );
}

// ─── Clearance gate ───────────────────────────────────────────────────────────

function ClearanceGate({
  label,
  description,
  cleared,
}: {
  label: string;
  description: string;
  cleared: boolean;
}) {
  const color = cleared ? "#00e676" : "#2a4a6e";
  const bg = cleared ? "rgba(0,230,118,0.08)" : "rgba(42,74,110,0.08)";
  const borderColor = cleared ? "rgba(0,230,118,0.3)" : "rgba(42,74,110,0.25)";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
      role="status"
      aria-label={`${label}: ${cleared ? "Cleared" : "Not yet cleared"}`}
    >
      {/* Status icon */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: bg,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "11px",
          color,
          fontWeight: 700,
        }}
        aria-hidden
      >
        {cleared ? "✓" : "○"}
      </div>
      <div>
        <div style={{ fontSize: "9px", fontWeight: 700, color, letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: "8px", color: "#4a6a88", lineHeight: 1.4 }}>{description}</div>
      </div>
    </div>
  );
}

// ─── Overall level display ────────────────────────────────────────────────────

function OverallLevelDisplay({ level }: { level: MonitorCompetencyLevel }) {
  const idx = COMPETENCY_LEVEL_ORDER.indexOf(level);
  const total = COMPETENCY_LEVEL_ORDER.length;
  const color = LEVEL_COLOR[level];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Step indicators */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {COMPETENCY_LEVEL_ORDER.map((l, i) => (
          <div
            key={l}
            style={{
              width: i <= idx ? 12 : 8,
              height: i <= idx ? 12 : 8,
              borderRadius: "50%",
              background: i < idx ? LEVEL_COLOR[l] : i === idx ? color : "#152336",
              border: i === idx ? `2px solid ${color}` : "2px solid transparent",
              transition: "all 300ms ease",
            }}
            aria-hidden
          />
        ))}
      </div>
      <div>
        <div style={{ fontSize: "8px", color: "#4a6a88", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
          Overall Level
        </div>
        <LevelBadge level={level} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompetencyPassportPanel({ passport, variant = "full" }: CompetencyPassportPanelProps) {
  const domains = Object.values(passport.domains);

  if (variant === "compact") {
    return (
      <div
        style={{ fontFamily: "var(--mon-font, monospace)", display: "flex", flexDirection: "column", gap: 8 }}
        aria-label="Monitor competency passport"
      >
        <OverallLevelDisplay level={passport.overallLevel} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }} role="list">
          {domains.map((d) => <DomainBar key={d.domainId} domain={d} />)}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "var(--mon-font, monospace)", display: "flex", flexDirection: "column", gap: 14 }}
      aria-label="Monitor competency passport"
    >
      {/* Section header */}
      <div>
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4a6a88",
            marginBottom: 6,
          }}
        >
          Monitor Competency Passport
        </div>
        <OverallLevelDisplay level={passport.overallLevel} />
      </div>

      {/* Domain bars */}
      <div
        style={{
          background: "rgba(15,30,46,0.6)",
          border: "1px solid #1e3450",
          borderRadius: 6,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        role="list"
        aria-label="Competency domains"
      >
        {domains.map((d) => <DomainBar key={d.domainId} domain={d} />)}
      </div>

      {/* Clearance gates */}
      <div>
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4a6a88",
            marginBottom: 6,
          }}
        >
          Clinical Readiness Gates
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <ClearanceGate
            label="Telemetry Ready"
            description="Competent across all four monitor domains. No severe harm events on record."
            cleared={passport.telemetryReadyClearance}
          />
          <ClearanceGate
            label="ICU Ready"
            description="Proficient across all domains. Cleared for advanced haemodynamic monitoring in supervised ICU environments."
            cleared={passport.icuReadyClearance}
          />
        </div>
      </div>

      {/* Last updated */}
      {passport.lastUpdatedAt && (
        <div style={{ fontSize: "8px", color: "#2a4a6e", textAlign: "right" }}>
          Updated {new Date(passport.lastUpdatedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
