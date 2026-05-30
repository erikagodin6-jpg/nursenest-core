"use client";

/**
 * LearnerGrowthProfile
 *
 * Renders a learner's longitudinal growth profile across all monitor sessions.
 * Shows NCJMM domain trends, harm index history, competency trajectory,
 * unsafe trend flags, and readiness indicators.
 */

import type {
  LearnerGrowthProfile,
  TrendLine,
  ReadinessIndicator,
  UnsafeTrend,
} from "@/lib/physiology-monitor/learner-profile";
import { NCJMM_DOMAIN_LABELS } from "@/lib/physiology-monitor/clinical-judgment-engine";
import type { NcjmmDomain } from "@/lib/physiology-monitor/clinical-judgment-engine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LearnerGrowthProfileProps {
  profile: LearnerGrowthProfile;
}

// ─── Trend sparkline ──────────────────────────────────────────────────────────

const DIRECTION_ARROW: Record<TrendLine["direction"], string> = {
  improving: "↑",
  declining: "↓",
  stable: "→",
};

const DIRECTION_COLOR: Record<TrendLine["direction"], string> = {
  improving: "#00e676",
  declining: "#ff6090",
  stable: "#8fafc8",
};

function TrendSparkline({ trend, color, label }: { trend: TrendLine; color: string; label: string }) {
  const W = 80;
  const H = 20;
  const pts = trend.points.slice(-10);
  if (pts.length < 2) {
    return (
      <div style={{ width: W, textAlign: "center", fontSize: "8px", color: "#2a4a6e" }}>No data</div>
    );
  }

  const min = Math.min(...pts.map((p) => p.value));
  const max = Math.max(...pts.map((p) => p.value));
  const range = max - min || 1;
  const step = W / (pts.length - 1);

  const d = pts
    .map((p, i) => {
      const x = i * step;
      const y = H - ((p.value - min) / range) * H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-label={`${label} trend`}
      style={{ display: "block" }}
    >
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(pts.length - 1) * step}
        cy={H - ((pts[pts.length - 1]!.value - min) / range) * H}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

// ─── Domain row ───────────────────────────────────────────────────────────────

const DOMAIN_COLORS: Record<NcjmmDomain, string> = {
  recognize_cues:        "#00e5ff",
  analyze_cues:          "#ea80fc",
  prioritize_hypotheses: "#ffd740",
  generate_solutions:    "#40c4ff",
  take_action:           "#00e676",
  evaluate_outcomes:     "#ff9100",
};

function DomainRow({ domain, trend }: { domain: NcjmmDomain; trend: TrendLine }) {
  const color = DOMAIN_COLORS[domain];
  const arrowColor = DIRECTION_COLOR[trend.direction];
  const score = Math.round(trend.rollingAverage);

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8 }}
      role="listitem"
    >
      {/* Label */}
      <div style={{ width: 120, fontSize: "9px", color: "#8fafc8", flexShrink: 0 }}>
        {NCJMM_DOMAIN_LABELS[domain]}
      </div>

      {/* Bar */}
      <div style={{ flex: 1, minWidth: 60, height: 5, background: "#152336", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: color,
            borderRadius: 3,
            transition: "width 600ms ease",
          }}
        />
      </div>

      {/* Score */}
      <div style={{ width: 28, fontSize: "10px", fontWeight: 700, color, fontVariantNumeric: "tabular-nums", textAlign: "right", flexShrink: 0 }}>
        {score}
      </div>

      {/* Trend arrow */}
      <div style={{ width: 14, fontSize: "10px", color: arrowColor, flexShrink: 0 }}>
        {DIRECTION_ARROW[trend.direction]}
      </div>

      {/* Sparkline */}
      <TrendSparkline trend={trend} color={color} label={NCJMM_DOMAIN_LABELS[domain]} />
    </div>
  );
}

// ─── Readiness checklist ──────────────────────────────────────────────────────

function ReadinessChecklist({ indicators }: { indicators: ReadinessIndicator[] }) {
  if (indicators.length === 0) return null;

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }}>
      <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
        Telemetry Ready Indicators
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {indicators.map((ind, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <span
              style={{
                fontSize: "9px",
                color: ind.met ? "#00e676" : "#ff6090",
                flexShrink: 0,
                marginTop: 1,
              }}
              aria-hidden
            >
              {ind.met ? "✓" : "○"}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "8px", color: ind.met ? "#00e676" : "#8fafc8" }}>
                {ind.indicator}
              </div>
              <div style={{ fontSize: "8px", color: "#4a6a88" }}>
                {ind.currentValue} / target: {ind.target}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Unsafe trend flags ───────────────────────────────────────────────────────

function UnsafeTrendFlags({ trends }: { trends: UnsafeTrend[] }) {
  if (trends.length === 0) return null;

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }}>
      <div style={{ fontSize: "8px", fontWeight: 700, color: "#ff6090", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
        Safety Flags
      </div>
      {trends.map((t, i) => (
        <div
          key={i}
          style={{
            background: t.severity === "critical" ? "rgba(255,23,68,0.08)" : "rgba(255,145,0,0.08)",
            border: `1px solid ${t.severity === "critical" ? "rgba(255,23,68,0.3)" : "rgba(255,145,0,0.3)"}`,
            borderRadius: 5,
            padding: "6px 10px",
            marginBottom: 4,
          }}
          role="alert"
        >
          <div style={{ fontSize: "9px", fontWeight: 700, color: t.severity === "critical" ? "#ff1744" : "#ff9100", marginBottom: 2 }}>
            {t.domain}
          </div>
          <p style={{ fontSize: "8px", color: "#8fafc8", margin: 0, lineHeight: 1.5 }}>{t.description}</p>
          <div style={{ fontSize: "7px", color: "#4a6a88", marginTop: 3 }}>
            Seen in {t.sessionCount} session(s)
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Summary stats ────────────────────────────────────────────────────────────

function SummaryStats({ profile }: { profile: LearnerGrowthProfile }) {
  const stats = [
    { label: "Sessions", value: profile.sessionCount, color: "#8fafc8" },
    { label: "Composite", value: `${Math.round(profile.compositeTrend.current)}`, color: "#00e5ff" },
    { label: "Conditions", value: profile.conditionsCovered.length, color: "#ffd740" },
    { label: "Passed", value: profile.simulationsPassed.length, color: "#00e676" },
    { label: "Telemetry ✓", value: profile.telemetryReadySessions, color: "#40c4ff" },
  ];

  return (
    <div
      className="flex flex-wrap gap-4"
      style={{ fontSize: "9px", fontVariantNumeric: "tabular-nums" }}
    >
      {stats.map(({ label, value, color }) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 400, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: "8px", color: "#4a6a88", marginTop: 2, letterSpacing: "0.06em" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LearnerGrowthProfilePanel({ profile }: LearnerGrowthProfileProps) {
  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  const compositeDir = profile.compositeTrend.direction;

  return (
    <div
      data-nn-monitor=""
      style={{ fontFamily: "var(--mon-font, monospace)" }}
      aria-label="Learner growth profile"
    >
      {/* Header */}
      <div data-nn-monitor-header="">
        <div>
          <div style={{ fontSize: "8px", color: "#4a6a88", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Learner Growth Profile
          </div>
          <div style={{ fontSize: "10px", color: "#8fafc8" }}>
            {profile.profession} · {profile.sessionCount} sessions
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: DIRECTION_COLOR[compositeDir] }}>
            {DIRECTION_ARROW[compositeDir]}
          </span>
          <span style={{ fontSize: "9px", color: "#4a6a88" }}>
            {compositeDir.charAt(0).toUpperCase() + compositeDir.slice(1)}
          </span>
        </div>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Summary stats */}
        <SummaryStats profile={profile} />

        {/* NCJMM domain trends */}
        <div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Clinical Judgment Domains
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }} role="list">
            {domains.map((d) => (
              <DomainRow key={d} domain={d} trend={profile.ncjmmTrends[d]} />
            ))}
          </div>
        </div>

        {/* Strengths and weaknesses */}
        {(profile.strengthAreas.length > 0 || profile.weakAreas.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {profile.strengthAreas.length > 0 && (
              <div>
                <div style={{ fontSize: "8px", fontWeight: 700, color: "#00e676", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  Strengths
                </div>
                {profile.strengthAreas.map((s, i) => (
                  <div key={i} style={{ fontSize: "9px", color: "#00e676", marginBottom: 2 }}>✓ {s}</div>
                ))}
              </div>
            )}
            {profile.weakAreas.length > 0 && (
              <div>
                <div style={{ fontSize: "8px", fontWeight: 700, color: "#ff6090", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  Priority Areas
                </div>
                {profile.weakAreas.map((w, i) => (
                  <div key={i} style={{ fontSize: "9px", color: "#ff6090", marginBottom: 2 }}>○ {w}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unsafe trends */}
        {profile.unsafeTrends.length > 0 && (
          <UnsafeTrendFlags trends={profile.unsafeTrends} />
        )}

        {/* Readiness checklist */}
        {profile.readinessIndicators.length > 0 && (
          <ReadinessChecklist indicators={profile.readinessIndicators} />
        )}

        {/* Conditions covered */}
        {profile.conditionsCovered.length > 0 && (
          <div>
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Conditions Practiced
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.conditionsCovered.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "8px",
                    fontWeight: 600,
                    color: "#40c4ff",
                    background: "rgba(64,196,255,0.08)",
                    border: "1px solid rgba(64,196,255,0.2)",
                    borderRadius: 3,
                    padding: "1px 5px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
