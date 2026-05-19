"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  BookOpen,
  Library,
  Settings,
  LogOut,
  Calendar,
  Compass,
  Clock,
  FileText,
  CheckCircle2,
  Target,
  Activity,
  Lock,
  Download,
  Flag,
  RefreshCw,
} from "lucide-react";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

// ── Domain data ─────────────────────────────────────────────────────────────

const NCLEX_DOMAINS = [
  {
    key: "physiological_integrity",
    label: "Physiological Integrity",
    color: "#0d9488",
    bg: "#ccfbf1",
    iconBg: "#0d9488",
  },
  {
    key: "safe_care",
    label: "Safe Care",
    color: "#3b82f6",
    bg: "#dbeafe",
    iconBg: "#3b82f6",
  },
  {
    key: "health_promotion",
    label: "Health Promotion and Maintenance",
    color: "#f59e0b",
    bg: "#fef3c7",
    iconBg: "#f59e0b",
  },
  {
    key: "psychosocial",
    label: "Psychosocial Integrity",
    color: "#ec4899",
    bg: "#fce7f3",
    iconBg: "#ec4899",
  },
  {
    key: "basic_care",
    label: "Basic Care and Comfort",
    color: "#0d9488",
    bg: "#ccfbf1",
    iconBg: "#0d9488",
  },
  {
    key: "risk_reduction",
    label: "Reduction of Risk Potential",
    color: "#8b5cf6",
    bg: "#ede9fe",
    iconBg: "#8b5cf6",
  },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtElapsed(ms: number | null | undefined): string {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

function fmtDate(d?: string | Date | null): string {
  if (!d) return new Date().toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Build domain scores from byTopic + catReport.categoryBreakdown */
function buildDomainScores(results: PracticeTestResultsJson): Record<string, number> {
  const scores: Record<string, number> = {};
  const breakdown = results.catReport?.categoryBreakdown ?? [];

  for (const domain of NCLEX_DOMAINS) {
    // Try to match from catReport.categoryBreakdown
    const match = breakdown.find(
      (b) =>
        b.blueprintKey === domain.key ||
        b.category.toLowerCase().includes(domain.label.toLowerCase().slice(0, 8)),
    );
    if (match) {
      const acc = match.total > 0 ? match.correct / match.total : 0;
      // Convert 0-1 accuracy to logit-ish scale (-1.5 to +1.5)
      scores[domain.key] = parseFloat((acc * 2.5 - 1.25).toFixed(2));
      continue;
    }
    // Try byTopic
    const topicMatch = Object.entries(results.byTopic).find(([topic]) =>
      topic.toLowerCase().includes(domain.label.toLowerCase().slice(0, 6)),
    );
    if (topicMatch) {
      const [, { correct, total }] = topicMatch;
      const acc = total > 0 ? correct / total : 0;
      scores[domain.key] = parseFloat((acc * 2.5 - 1.25).toFixed(2));
      continue;
    }
    // Default near 0
    scores[domain.key] = 0;
  }

  // If we have a real theta, anchor the scores around it
  const theta = results.estimatedAbility ?? results.catReport?.theta;
  if (theta != null) {
    for (const k of Object.keys(scores)) {
      // Add slight variation around theta
      scores[k] = parseFloat((theta * 0.7 + scores[k] * 0.3).toFixed(2));
    }
  }

  return scores;
}

/** Map readiness level to gauge band */
function readinessToBand(level: string | null | undefined): "likely" | "border" | "risk" {
  if (!level) return "border";
  const l = level.toLowerCase();
  if (l.includes("likely") || l.includes("pass") || l.includes("strong")) return "likely";
  if (l.includes("risk") || l.includes("fail") || l.includes("needs")) return "risk";
  return "border";
}

/** Semicircle gauge (SVG-based) */
function ReadinessGauge({
  score,
  band,
}: {
  score: number;
  band: "likely" | "border" | "risk";
}) {
  // Arc from 180° to 0° (half-circle, left to right)
  const clampedScore = Math.min(100, Math.max(0, score));
  const R = 70;
  const cx = 88;
  const cy = 88;
  const circumference = Math.PI * R; // half-circle arc length ≈ 220
  const filled = (clampedScore / 100) * circumference;
  const gap = circumference - filled;

  const bandColor =
    band === "likely" ? "#0d9488" : band === "risk" ? "#dc2626" : "#d97706";
  const bandLabel =
    band === "likely" ? "Likely to Pass" : band === "risk" ? "Needs Improvement" : "Moderate";

  return (
    <div className="nn-nclex-results-gauge-card__gauge" style={{ textAlign: "center" }}>
      <div className="nn-nclex-results-gauge-card__label">PASS OUTLOOK</div>
      <div style={{ position: "relative", width: "11rem", height: "5.5rem", margin: "0.75rem auto 0" }}>
        <svg
          viewBox="0 0 176 88"
          width="176"
          height="88"
          style={{ overflow: "visible" }}
          aria-label={`Readiness gauge: ${clampedScore}% — ${bandLabel}`}
        >
          {/* Background arc */}
          <path
            d={`M ${cx - R},${cy} A ${R},${R} 0 0,1 ${cx + R},${cy}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <path
            d={`M ${cx - R},${cy} A ${R},${R} 0 0,1 ${cx + R},${cy}`}
            fill="none"
            stroke={bandColor}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${gap}`}
            style={{ transition: "stroke-dasharray 800ms ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {clampedScore}%
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: bandColor,
              marginTop: "0.2rem",
            }}
          >
            {bandLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, href: "/app", active: false },
  { label: "My Sessions", Icon: ClipboardList, href: "/app/practice-tests", active: false },
  { label: "Results", Icon: BarChart2, href: "#", active: true },
  { label: "Study Plan", Icon: BookOpen, href: "/app/exam-plan", active: false },
  { label: "Resources", Icon: Library, href: "/app/lessons", active: false },
  { label: "Settings", Icon: Settings, href: "/app/account", active: false },
  { label: "Sign out", Icon: LogOut, href: "/api/auth/signout", active: false },
] as const;

// ── Main component ────────────────────────────────────────────────────────────

export function NclexCatResultsDashboard({
  results,
  testId,
  elapsedMs,
  pathwayId,
  pathwayLabel = "NCLEX-RN®",
  completedAt,
  onNewSession,
  onReviewFlagged,
  onExport,
}: {
  results: PracticeTestResultsJson;
  testId: string;
  elapsedMs?: number | null;
  pathwayId?: string | null;
  pathwayLabel?: string;
  completedAt?: string | Date | null;
  onNewSession?: () => void;
  onReviewFlagged?: () => void;
  onExport?: () => void;
}) {
  const catReport = results.catReport;
  const score = catReport?.readinessScore != null
    ? Math.round(catReport.readinessScore)
    : Math.round(results.accuracyPct ?? 0);
  const readinessLevel = catReport?.readinessLevel ?? results.readinessLevel ?? "Borderline";
  const band = readinessToBand(readinessLevel);
  const theta = results.estimatedAbility ?? catReport?.theta;
  const se = results.abilityStdError ?? catReport?.se;
  const abilityBand = catReport?.result ?? (band === "likely" ? "PASS" : band === "risk" ? "FAIL" : "BORDERLINE");

  const interpretation =
    results.catCoach?.readinessNarrative ??
    (band === "likely"
      ? "You are more likely to pass if your current ability holds steady."
      : band === "risk"
        ? "Continued study is recommended before your exam."
        : "Continue focusing on your weaker areas — consistent performance is key.");

  const domainScores = buildDomainScores(results);

  return (
    <div className="nn-nclex-results-page" data-nclex-shell="results">
      {/* ── Sidebar ── */}
      <aside className="nn-nclex-results-sidebar">
        <div className="nn-nclex-results-sidebar__logo">
          <div className="nn-nclex-results-sidebar__logo-mark">N</div>
          <span className="nn-nclex-results-sidebar__logo-text">NurseNest</span>
        </div>
        <ul className="nn-nclex-results-sidebar__nav">
          {NAV_ITEMS.map(({ label, Icon, href, active }) => (
            <li key={label}>
              <Link
                href={href}
                className={`nn-nclex-results-sidebar__nav-item${active ? " nn-nclex-results-sidebar__nav-item--active" : ""}`}
              >
                <Icon size={15} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Main content ── */}
      <main className="nn-nclex-results-main">
        {/* Header */}
        <div className="nn-nclex-results-main__header">
          <h1 className="nn-nclex-results-main__title">Your CAT session results</h1>
          <p className="nn-nclex-results-main__subtitle">
            Adaptive assessment completed. Review your performance and next steps.
          </p>
        </div>

        {/* Session metadata strip */}
        <div className="nn-nclex-results-strip">
          <div className="nn-nclex-results-strip__cell">
            <div className="nn-nclex-results-strip__icon">
              <Calendar size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-results-strip__label">Session Date</p>
              <p className="nn-nclex-results-strip__value">{fmtDate(completedAt)}</p>
            </div>
          </div>
          <div className="nn-nclex-results-strip__cell">
            <div className="nn-nclex-results-strip__icon">
              <Compass size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-results-strip__label">Pathway</p>
              <p className="nn-nclex-results-strip__value">{pathwayLabel}</p>
            </div>
          </div>
          <div className="nn-nclex-results-strip__cell">
            <div className="nn-nclex-results-strip__icon">
              <Clock size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-results-strip__label">Session Time</p>
              <p className="nn-nclex-results-strip__value">{fmtElapsed(elapsedMs)}</p>
            </div>
          </div>
        </div>

        {/* Results grid: gauge + domain bars */}
        <div className="nn-nclex-results-grid">
          {/* Gauge */}
          <div className="nn-nclex-results-gauge-card">
            <ReadinessGauge score={score} band={band} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "#64748b" }}>
              <Lock size={13} aria-hidden />
              Continue focusing on your weaker areas — consistent performance is key.
            </div>
            <p className="nn-nclex-results-gauge-card__interpretation">{interpretation}</p>
          </div>

          {/* Domain bars */}
          <div className="nn-nclex-results-domains-card">
            <p className="nn-nclex-results-domains-card__title">Domain Performance</p>
            <p className="nn-nclex-results-domains-card__sub">Estimated ability by domain</p>

            {/* Axis header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "0.75rem",
                padding: "0.25rem 0 0.5rem",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }} />
              <span style={{ fontSize: "0.65rem", color: "#94a3b8", textAlign: "right", width: "8rem" }}>
                Ability Estimate (logits)
              </span>
              <span style={{ width: "2.5rem" }} />
            </div>

            {NCLEX_DOMAINS.map((domain) => {
              const logit = domainScores[domain.key] ?? 0;
              // Normalize logit (-2…+2) to 0-100% bar width
              const barPct = Math.min(100, Math.max(0, ((logit + 2) / 4) * 100));
              return (
                <div key={domain.key} className="nn-nclex-domain-row">
                  <div className="nn-nclex-domain-row__info">
                    <div
                      className="nn-nclex-domain-row__icon"
                      style={{ background: domain.bg }}
                      aria-hidden="true"
                    >
                      <Activity size={10} style={{ color: domain.color }} />
                    </div>
                    <span className="nn-nclex-domain-row__name">{domain.label}</span>
                  </div>
                  <div className="nn-nclex-domain-row__bar-wrap">
                    <div
                      className="nn-nclex-domain-row__bar-fill"
                      style={{ width: `${barPct}%`, background: domain.color }}
                    />
                  </div>
                  <span className="nn-nclex-domain-row__logit">
                    {logit > 0 ? "+" : ""}{logit.toFixed(1)}
                  </span>
                </div>
              );
            })}

            <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.75rem" }}>
              Your ability estimate (logits) is shown above. Higher scores reflect stronger performance.
            </p>
          </div>
        </div>

        {/* Session summary */}
        <div className="nn-nclex-session-summary">
          <div className="nn-nclex-session-summary__cell">
            <div className="nn-nclex-session-summary__cell-icon">
              <FileText size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-session-summary__cell-label">Questions Administered</p>
              <p className="nn-nclex-session-summary__cell-value">{results.scoreTotal ?? "—"}</p>
            </div>
          </div>
          <div className="nn-nclex-session-summary__cell">
            <div className="nn-nclex-session-summary__cell-icon">
              <Target size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-session-summary__cell-label">Adaptive Model</p>
              <p className="nn-nclex-session-summary__cell-value">CAT</p>
            </div>
          </div>
          <div className="nn-nclex-session-summary__cell">
            <div className="nn-nclex-session-summary__cell-icon">
              <BarChart2 size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-session-summary__cell-label">Ability Estimate</p>
              <p className="nn-nclex-session-summary__cell-value">
                {theta != null ? `${theta > 0 ? "+" : ""}${theta.toFixed(2)}` : "—"}{" "}
                <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#64748b" }}>logits</span>
              </p>
            </div>
          </div>
          <div className="nn-nclex-session-summary__cell">
            <div className="nn-nclex-session-summary__cell-icon">
              <CheckCircle2 size={16} aria-hidden />
            </div>
            <div>
              <p className="nn-nclex-session-summary__cell-label">Ability Estimate Band</p>
              <p className="nn-nclex-session-summary__cell-value">{readinessLevel}</p>
              {se != null && (
                <p style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                  ±{se.toFixed(2)} SE
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="nn-nclex-results-actions">
          {onReviewFlagged && (
            <button type="button" className="nn-nclex-results-action-btn" onClick={onReviewFlagged}>
              <Flag size={15} aria-hidden />
              Review flagged
            </button>
          )}
          {onNewSession && (
            <button type="button" className="nn-nclex-results-action-btn" onClick={onNewSession}>
              <RefreshCw size={15} aria-hidden />
              New CAT session
            </button>
          )}
          {onExport && (
            <button type="button" className="nn-nclex-results-action-btn" onClick={onExport}>
              <Download size={15} aria-hidden />
              Export summary
            </button>
          )}
        </div>

        {/* Weak areas detail */}
        {catReport?.weakAreas && catReport.weakAreas.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "1rem",
              }}
            >
              Recommended Focus Areas
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {catReport.weakAreas.slice(0, 6).map((area) => (
                <li
                  key={area}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    fontSize: "0.875rem",
                    color: "#374151",
                  }}
                >
                  <span
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      background: "#f59e0b",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  {area}
                </li>
              ))}
            </ul>
            {pathwayId && (
              <Link
                href={`/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#0f2d57",
                  textDecoration: "none",
                }}
              >
                <BookOpen size={14} aria-hidden />
                Study these topics →
              </Link>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="nn-nclex-results-footer-note">
          <Lock size={12} aria-hidden />
          Secure and confidential. Results are for your use only.
        </p>
      </main>
    </div>
  );
}
