"use client";

/**
 * InstitutionalDashboard
 *
 * Cohort-level analytics UI for nursing schools, hospital educators,
 * and residency programs. Renders CohortAnalytics from institutional-analytics.ts.
 *
 * Sections:
 *   - Cohort summary (learner count, sessions, telemetry-ready %)
 *   - Domain heatmap (average scores per NCJMM domain)
 *   - Safety distribution (harm event breakdown)
 *   - High-risk learner flags
 *   - Common failure patterns
 *   - Coverage gaps
 *   - Curriculum recommendations
 */

import type { CohortAnalytics, HighRiskLearner, FailurePattern, CurriculumRecommendation } from "@/lib/physiology-monitor/institutional-analytics";
import { NCJMM_DOMAIN_LABELS } from "@/lib/physiology-monitor/clinical-judgment-engine";
import type { NcjmmDomain } from "@/lib/physiology-monitor/clinical-judgment-engine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InstitutionalDashboardProps {
  analytics: CohortAnalytics;
}

// ─── Domain heatmap ───────────────────────────────────────────────────────────

function domainColor(score: number): string {
  if (score >= 80) return "#00e676";
  if (score >= 65) return "#ffd740";
  if (score >= 50) return "#ff9100";
  return "#ff1744";
}

function DomainHeatmap({ analytics }: { analytics: CohortAnalytics }) {
  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }}>
      <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        NCJMM Domain Averages
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {domains.map((d) => {
          const avg = Math.round(analytics.domainAverages[d] ?? 0);
          const dist = analytics.domainDistribution[d];
          const color = domainColor(avg);

          return (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 130, fontSize: "9px", color: "#8fafc8", flexShrink: 0 }}>
                {NCJMM_DOMAIN_LABELS[d]}
              </div>
              <div style={{ flex: 1, height: 8, background: "#152336", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                {/* Distribution stacked bar */}
                {dist && (
                  <div style={{ display: "flex", height: "100%", width: "100%" }}>
                    <div style={{ width: `${dist.below50}%`, background: "#ff174444" }} />
                    <div style={{ width: `${dist.range50_65}%`, background: "#ff910044" }} />
                    <div style={{ width: `${dist.range65_80}%`, background: "#ffd74044" }} />
                    <div style={{ width: `${dist.above80}%`, background: "#00e67644" }} />
                  </div>
                )}
              </div>
              <div
                style={{
                  width: 32,
                  fontSize: "10px",
                  fontWeight: 700,
                  color,
                  fontVariantNumeric: "tabular-nums",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {avg}
              </div>
              <div style={{ fontSize: "7px", color, width: 40, flexShrink: 0 }}>
                med: {Math.round(dist?.median ?? avg)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3" style={{ fontSize: "7px", color: "#4a6a88" }}>
        {[
          { label: "< 50", color: "#ff174444" },
          { label: "50–65", color: "#ff910044" },
          { label: "65–80", color: "#ffd74044" },
          { label: "≥ 80", color: "#00e67644" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1">
            <span style={{ display: "inline-block", width: 10, height: 6, background: color, borderRadius: 1 }} aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Safety distribution ──────────────────────────────────────────────────────

function SafetyDistribution({ analytics }: { analytics: CohortAnalytics }) {
  const dist = analytics.harmDistribution;
  const total = Object.values(dist).reduce((a, b) => a + b, 0);

  const items = [
    { key: "none", label: "No harm", color: "#00e676" },
    { key: "near_miss", label: "Near miss", color: "#ffd740" },
    { key: "moderate", label: "Moderate", color: "#ff9100" },
    { key: "severe", label: "Severe", color: "#ff6090" },
    { key: "preventable_arrest", label: "Arrest", color: "#ff1744" },
  ] as const;

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }}>
      <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        Safety Events
      </div>
      <div className="flex flex-col gap-2">
        {items.map(({ key, label, color }) => {
          const count = dist[key] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={key} className="flex items-center gap-2">
              <div style={{ width: 80, fontSize: "8px", color: "#8fafc8" }}>{label}</div>
              <div style={{ flex: 1, height: 5, background: "#152336", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
              </div>
              <div style={{ width: 24, fontSize: "9px", fontWeight: 700, color, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "8px", color: analytics.safetyIncidentRate > 15 ? "#ff6090" : "#4a6a88", marginTop: 6 }}>
        Safety incident rate: <strong style={{ color: analytics.safetyIncidentRate > 15 ? "#ff1744" : "#00e676" }}>
          {Math.round(analytics.safetyIncidentRate)}%
        </strong>
        {analytics.safetyIncidentRate > 15 && " — above acceptable threshold"}
      </div>
    </div>
  );
}

// ─── High-risk learner list ───────────────────────────────────────────────────

function HighRiskList({ learners }: { learners: HighRiskLearner[] }) {
  if (learners.length === 0) {
    return (
      <div style={{ fontSize: "9px", color: "#4a6a88" }}>No high-risk learners flagged. ✓</div>
    );
  }

  const URGENCY_COLOR = {
    remediation_required: "#ff1744",
    intervene: "#ff9100",
    monitor: "#ffd740",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {learners.slice(0, 5).map((l, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: `${URGENCY_COLOR[l.urgency]}10`,
            border: `1px solid ${URGENCY_COLOR[l.urgency]}44`,
            borderRadius: 5,
            padding: "5px 8px",
          }}
          role="listitem"
        >
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: "8px", fontWeight: 700, color: URGENCY_COLOR[l.urgency], textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {l.urgency.replace(/_/g, " ")}
            </div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#e8edf2", fontVariantNumeric: "tabular-nums" }}>
              {l.compositeScore}/100
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "8px", color: "#8fafc8" }}>{l.learnerId}</div>
            <div style={{ fontSize: "8px", color: "#4a6a88" }}>{l.riskReason}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Failure patterns ─────────────────────────────────────────────────────────

function FailurePatternList({ patterns }: { patterns: FailurePattern[] }) {
  if (patterns.length === 0) return <div style={{ fontSize: "9px", color: "#4a6a88" }}>No systemic patterns detected.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {patterns.slice(0, 4).map((p, i) => (
        <div
          key={i}
          style={{
            borderLeft: "3px solid #ff9100",
            paddingLeft: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#ff9100" }}>{p.pattern}</span>
            <span style={{ fontSize: "8px", color: "#ff6090", fontVariantNumeric: "tabular-nums" }}>
              {p.affectedPercent}% affected
            </span>
          </div>
          <p style={{ fontSize: "8px", color: "#4a6a88", margin: 0, lineHeight: 1.4 }}>{p.recommendedAction}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Curriculum recommendations ───────────────────────────────────────────────

function CurriculumRecommendations({ recommendations }: { recommendations: CurriculumRecommendation[] }) {
  const PRIORITY_COLOR: Record<1 | 2 | 3, string> = { 1: "#ff6090", 2: "#ff9100", 3: "#ffd740" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {recommendations.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: PRIORITY_COLOR[r.priority],
              background: `${PRIORITY_COLOR[r.priority]}18`,
              border: `1px solid ${PRIORITY_COLOR[r.priority]}44`,
              borderRadius: 3,
              padding: "1px 5px",
              flexShrink: 0,
            }}
          >
            P{r.priority}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "9px", color: "#e8edf2", fontWeight: 600 }}>{r.recommendation}</div>
            <div style={{ fontSize: "8px", color: "#4a6a88", lineHeight: 1.4 }}>{r.rationale}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InstitutionalDashboard({ analytics }: InstitutionalDashboardProps) {
  const trendColor =
    analytics.cohortCompositeTrend === "improving" ? "#00e676"
    : analytics.cohortCompositeTrend === "declining" ? "#ff6090"
    : "#8fafc8";

  const trendArrow =
    analytics.cohortCompositeTrend === "improving" ? "↑"
    : analytics.cohortCompositeTrend === "declining" ? "↓"
    : "→";

  return (
    <div
      data-nn-monitor=""
      style={{ fontFamily: "var(--mon-font, monospace)" }}
      aria-label={`Institutional dashboard: ${analytics.cohortName}`}
    >
      {/* Header */}
      <div data-nn-monitor-header="">
        <div>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Institutional Dashboard
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#e8edf2" }}>
            {analytics.cohortName}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "9px", color: "#4a6a88" }}>
            Generated {new Date(analytics.generatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top-line stats */}
        <div className="flex flex-wrap gap-6">
          {[
            { label: "Learners", value: analytics.learnerCount, color: "#8fafc8" },
            { label: "Sessions", value: analytics.totalSessions, color: "#40c4ff" },
            { label: "Telemetry Ready", value: `${Math.round(analytics.telemetryReadyPercent)}%`, color: "#00e676" },
            { label: "ICU Ready", value: `${Math.round(analytics.icuReadyPercent)}%`, color: "#ffd740" },
            { label: "Cohort Trend", value: `${trendArrow} ${analytics.cohortCompositeTrend}`, color: trendColor },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 400, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "8px", color: "#4a6a88", marginTop: 3, letterSpacing: "0.06em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <DomainHeatmap analytics={analytics} />
          <SafetyDistribution analytics={analytics} />
        </div>

        {/* High risk learners */}
        <div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#ff6090", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            High-Risk Learners ({analytics.highRiskLearners.length})
          </div>
          <HighRiskList learners={analytics.highRiskLearners} />
        </div>

        {/* Failure patterns */}
        <div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#ff9100", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Common Failure Patterns
          </div>
          <FailurePatternList patterns={analytics.commonFailurePatterns} />
        </div>

        {/* Coverage gaps */}
        {analytics.conditionCoverageGaps.length > 0 && (
          <div>
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Coverage Gaps
            </div>
            <div className="flex flex-wrap gap-1">
              {analytics.conditionCoverageGaps.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "8px",
                    color: "#ff9100",
                    background: "rgba(255,145,0,0.08)",
                    border: "1px solid rgba(255,145,0,0.3)",
                    borderRadius: 3,
                    padding: "2px 6px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum recommendations */}
        <div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Curriculum Recommendations
          </div>
          <CurriculumRecommendations recommendations={analytics.curriculumRecommendations} />
        </div>

        {/* Timing benchmarks */}
        <div className="flex gap-6 flex-wrap" style={{ fontSize: "9px", borderTop: "1px solid #1e3450", paddingTop: 10 }}>
          <span style={{ color: "#4a6a88" }}>
            Avg recognition: <strong style={{ color: "#ffd740", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(analytics.averageRecognitionTimeSec)}s
            </strong>
          </span>
          <span style={{ color: "#4a6a88" }}>
            Avg first intervention: <strong style={{ color: "#ffd740", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(analytics.averageInterventionTimeSec)}s
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
