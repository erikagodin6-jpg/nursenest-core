"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// CNPLE Report Card — premium Canadian NP performance summary.
// Shows domain-level strengths/weaknesses, readiness metre, prescribing safety,
// diagnostics, lifespan care and other CNPLE-relevant domains.
// Links to weak-topic flashcards, lessons, and remediation pathways.
//
// DISCLAIMER: For self-assessment only. Not affiliated with CCRNR or the
// official CNPLE. Does not predict examination outcomes.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export type CnpleDomain =
  | "prescribing_safety"
  | "diagnostics_labs"
  | "lifespan_care"
  | "chronic_disease"
  | "acute_deterioration"
  | "professional_legal"
  | "mental_health"
  | "womens_health"
  | "pediatrics"
  | "geriatrics";

export type CnpleDomainTrend = "improving" | "declining" | "stable";

/** Urgency tier for targeted learner action. */
export type CnpleRemediationUrgency = "critical" | "high" | "moderate" | "on_track";

export type CnpleDomainResult = {
  domain: CnpleDomain;
  label: string;
  score: number;
  total: number;
  percentile?: number;
  /** Direction of change vs. the learner's previous session on this domain. */
  trend?: CnpleDomainTrend;
  /** Remediation urgency — drives visual prominence. */
  urgencyTier?: CnpleRemediationUrgency;
  /** True when this domain involves prescribing decisions — escalates the alert. */
  isPrescribingSafety?: boolean;
  remediationLessonsHref?: string;
  remediationFlashcardsHref?: string;
};

/** A specific high-risk gap surfaced from the prescribing safety engine. */
export type CnplePrescribingSafetyAlert = {
  domain: string;
  summary: string;
  detail: string;
  remediationHref?: string;
};

export type CnpleReadinessLevel = "not_ready" | "developing" | "approaching" | "ready";

export type CnpleReportCardProps = {
  examTitle?: string;
  sessionDate?: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSec?: number;
  domains: CnpleDomainResult[];
  readinessLevel: CnpleReadinessLevel;
  weakDomains?: CnpleDomain[];
  strongDomains?: CnpleDomain[];
  overallRecommendation?: string;
  /** Prescribing safety alerts from the prescribing-safety engine — shown prominently above domain rows. */
  prescribingSafetyAlerts?: CnplePrescribingSafetyAlert[];
  /** Domains flagged as high-risk weaknesses (low score AND prescribing-safety domain). */
  highRiskWeaknesses?: CnpleDomain[];
  cnpleHubHref?: string;
  practiceHref?: string;
  flashcardsHref?: string;
};

// ── Main component ────────────────────────────────────────────────────────────

export function CnpleReportCard({
  examTitle = "CNPLE Simulation",
  sessionDate,
  totalQuestions,
  correctAnswers,
  timeTakenSec,
  domains,
  readinessLevel,
  weakDomains = [],
  strongDomains = [],
  overallRecommendation,
  prescribingSafetyAlerts = [],
  highRiskWeaknesses = [],
  cnpleHubHref = "/canada/np/cnple",
  practiceHref = "/canada/np/cnple/questions",
  flashcardsHref = "/canada/np/cnple/flashcards",
}: CnpleReportCardProps) {
  const pct = Math.round((correctAnswers / totalQuestions) * 100);
  const mm = timeTakenSec != null ? Math.floor(timeTakenSec / 60) : null;
  const ss = timeTakenSec != null ? timeTakenSec % 60 : null;

  return (
    <div className="cnple-report-card space-y-6" data-cnple-report="card">
      {/* Header */}
      <ReportHeader
        examTitle={examTitle}
        sessionDate={sessionDate}
        pct={pct}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        mm={mm}
        ss={ss}
        readinessLevel={readinessLevel}
      />

      {/* Prescribing safety alerts — shown before domain rows for prominence */}
      {prescribingSafetyAlerts.length > 0 ? (
        <PrescribingSafetyAlertsPanel alerts={prescribingSafetyAlerts} />
      ) : null}

      {/* High-risk weakness panel */}
      {highRiskWeaknesses.length > 0 ? (
        <HighRiskWeaknessPanel
          weaknesses={highRiskWeaknesses}
          domains={domains}
          practiceHref={practiceHref}
        />
      ) : null}

      {/* Domain performance */}
      <section aria-labelledby="cnple-domain-heading">
        <h2
          id="cnple-domain-heading"
          className="mb-4 text-[16px] font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Performance by domain
        </h2>
        <div className="space-y-3">
          {domains.map((d) => (
            <DomainRow
              key={d.domain}
              result={d}
              isWeak={weakDomains.includes(d.domain)}
              isStrong={strongDomains.includes(d.domain)}
            />
          ))}
        </div>
      </section>

      {/* Strengths & weaknesses */}
      {(weakDomains.length > 0 || strongDomains.length > 0) ? (
        <StrengthsWeaknessesPanel
          weakDomains={weakDomains}
          strongDomains={strongDomains}
          domains={domains}
          flashcardsHref={flashcardsHref}
          practiceHref={practiceHref}
        />
      ) : null}

      {/* Recommendation */}
      {overallRecommendation ? (
        <RecommendationCard text={overallRecommendation} />
      ) : null}

      {/* Remediation CTA */}
      <RemediationCtaStrip cnpleHubHref={cnpleHubHref} practiceHref={practiceHref} flashcardsHref={flashcardsHref} />

      {/* Disclaimer */}
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
        This report is for self-assessment purposes only. NurseNest CNPLE simulation experiences
        are inspired by the CNPLE blueprint and Canadian NP competencies and are not affiliated
        with CCRNR or any regulatory body. Results do not predict official examination outcomes.
      </p>
    </div>
  );
}

// ── Readiness meter ───────────────────────────────────────────────────────────

export function CnpleReadinessMeter({ level, pct }: { level: CnpleReadinessLevel; pct: number }) {
  const { label, color, bgColor } = readinessDisplay(level);
  return (
    <div className="cnple-readiness-meter rounded-xl border p-4" style={{ borderColor: "var(--semantic-border-soft)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          Readiness Level
        </span>
        <span
          className="rounded-full px-3 py-0.5 text-[12px] font-bold"
          style={{ background: bgColor, color }}
        >
          {label}
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--semantic-border-soft)" }}>
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(100, pct)}%`, background: color }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
        <span>Developing</span>
        <span>Ready</span>
      </div>
    </div>
  );
}

// ── Report header ─────────────────────────────────────────────────────────────

function ReportHeader({
  examTitle,
  sessionDate,
  pct,
  correctAnswers,
  totalQuestions,
  mm,
  ss,
  readinessLevel,
}: {
  examTitle: string;
  sessionDate?: string;
  pct: number;
  correctAnswers: number;
  totalQuestions: number;
  mm: number | null;
  ss: number | null;
  readinessLevel: CnpleReadinessLevel;
}) {
  const { color } = readinessDisplay(readinessLevel);
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))",
      }}
    >
      <div className="px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
              CNPLE Simulation Report
            </p>
            <h1 className="mt-1 text-[20px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {examTitle}
            </h1>
            {sessionDate ? (
              <p className="mt-0.5 text-[13px]" style={{ color: "var(--semantic-text-muted)" }}>
                {sessionDate}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p
              className="text-[40px] font-black tabular-nums leading-none"
              style={{ color }}
            >
              {pct}%
            </p>
            <p className="mt-1 text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
              {correctAnswers} / {totalQuestions} correct
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <MetaStat label="Questions" value={String(totalQuestions)} />
          <MetaStat
            label="Time Taken"
            value={mm != null && ss != null ? `${mm}m ${String(ss).padStart(2, "0")}s` : "—"}
          />
          <MetaStat label="Format" value="Linear / LOFT" />
        </div>
      </div>

      <div className="border-t px-6 py-4" style={{ borderColor: "var(--semantic-border-soft)" }}>
        <CnpleReadinessMeter level={readinessLevel} pct={pct} />
      </div>
    </div>
  );
}

// ── Domain row ────────────────────────────────────────────────────────────────

function DomainRow({
  result,
  isWeak,
  isStrong,
}: {
  result: CnpleDomainResult;
  isWeak: boolean;
  isStrong: boolean;
}) {
  const [showLinks, setShowLinks] = useState(false);
  const domainPct = Math.round((result.score / result.total) * 100);

  const urgency = result.urgencyTier ?? (isWeak ? (result.isPrescribingSafety ? "critical" : "high") : isStrong ? "on_track" : "moderate");
  const isCritical = urgency === "critical";

  const barColor = isCritical
    ? "var(--semantic-danger)"
    : isWeak
      ? "var(--semantic-danger)"
      : isStrong
        ? "var(--semantic-success)"
        : domainPct >= 70
          ? "var(--semantic-success)"
          : domainPct >= 50
            ? "var(--semantic-warning-contrast)"
            : "var(--semantic-danger)";

  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{
        borderColor: isCritical
          ? "color-mix(in srgb, var(--semantic-danger) 50%, transparent)"
          : isWeak
            ? "color-mix(in srgb, var(--semantic-danger) 30%, transparent)"
            : isStrong
              ? "color-mix(in srgb, var(--semantic-success) 30%, transparent)"
              : "var(--semantic-border-soft)",
        background: isCritical
          ? "color-mix(in srgb, var(--semantic-danger) 6%, var(--semantic-surface))"
          : isWeak
            ? "color-mix(in srgb, var(--semantic-danger) 4%, var(--semantic-surface))"
            : isStrong
              ? "color-mix(in srgb, var(--semantic-success) 4%, var(--semantic-surface))"
              : "var(--semantic-surface)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[14px] font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
            {result.label}
          </span>

          {/* Urgency tier badge */}
          {isCritical ? (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: "color-mix(in srgb, var(--semantic-danger) 18%, transparent)",
                color: "var(--semantic-danger)",
              }}
            >
              ⚠ Critical Gap
            </span>
          ) : isWeak ? (
            <span className="text-[10px] font-bold uppercase" style={{ color: "var(--semantic-danger)" }}>
              ▼ Focus Area
            </span>
          ) : isStrong ? (
            <span className="text-[10px] font-bold uppercase" style={{ color: "var(--semantic-success)" }}>
              ▲ Strength
            </span>
          ) : null}

          {/* Trend arrow */}
          {result.trend ? (
            <span
              className="text-[11px] font-semibold"
              style={{
                color:
                  result.trend === "improving"
                    ? "var(--semantic-success)"
                    : result.trend === "declining"
                      ? "var(--semantic-danger)"
                      : "var(--semantic-text-muted)",
              }}
              title={`Trend vs previous session: ${result.trend}`}
            >
              {result.trend === "improving" ? "↑ Improving" : result.trend === "declining" ? "↓ Declining" : "→ Stable"}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[14px] font-bold tabular-nums" style={{ color: barColor }}>
            {result.score}/{result.total}
          </span>
          <span className="text-[12px] tabular-nums" style={{ color: "var(--semantic-text-muted)" }}>
            ({domainPct}%)
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--semantic-border-soft)" }}>
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${domainPct}%`, background: barColor }}
        />
      </div>

      {/* Confidence indicator — question count */}
      {result.total < 5 ? (
        <p className="mt-1 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
          Low confidence — only {result.total} question{result.total === 1 ? "" : "s"} in this domain.
        </p>
      ) : null}

      {/* Remediation links */}
      {isWeak && (result.remediationLessonsHref || result.remediationFlashcardsHref) ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowLinks((v) => !v)}
            className="text-[12px] font-semibold underline-offset-2 hover:underline"
            style={{ color: "var(--semantic-brand)" }}
          >
            {showLinks ? "Hide remediation ↑" : "View remediation options →"}
          </button>
          {showLinks ? (
            <div className="mt-1.5 flex gap-3">
              {result.remediationLessonsHref ? (
                <Link
                  href={result.remediationLessonsHref}
                  className="text-[12px] font-semibold underline-offset-2 hover:underline"
                  style={{ color: "var(--semantic-text-secondary)" }}
                >
                  → Lessons
                </Link>
              ) : null}
              {result.remediationFlashcardsHref ? (
                <Link
                  href={result.remediationFlashcardsHref}
                  className="text-[12px] font-semibold underline-offset-2 hover:underline"
                  style={{ color: "var(--semantic-text-secondary)" }}
                >
                  → Flashcards
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── Prescribing safety alerts panel ──────────────────────────────────────────

function PrescribingSafetyAlertsPanel({ alerts }: { alerts: CnplePrescribingSafetyAlert[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      aria-labelledby="cnple-prescribing-alert-heading"
      className="rounded-2xl border-2 p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-danger) 40%, transparent)",
        background: "color-mix(in srgb, var(--semantic-danger) 5%, var(--semantic-surface))",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            id="cnple-prescribing-alert-heading"
            className="text-[12px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-danger)" }}
          >
            ⚠ Prescribing Safety — Priority Review
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
            {alerts.length === 1
              ? "1 high-risk prescribing gap identified."
              : `${alerts.length} high-risk prescribing gaps identified.`}{" "}
            Safe prescribing is the highest-stakes domain for Canadian NP practice.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-[12px] font-semibold"
          style={{ color: "var(--semantic-brand)" }}
          aria-expanded={expanded}
        >
          {expanded ? "Collapse ↑" : "Details ↓"}
        </button>
      </div>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: "color-mix(in srgb, var(--semantic-danger) 20%, transparent)" }}>
          {alerts.map((alert, i) => (
            <div key={i}>
              <p className="text-[13px] font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                {alert.summary}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
                {alert.detail}
              </p>
              {alert.remediationHref ? (
                <Link
                  href={alert.remediationHref}
                  className="mt-1 inline-block text-[12px] font-semibold underline-offset-2 hover:underline"
                  style={{ color: "var(--semantic-brand)" }}
                >
                  Review this topic →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// ── High-risk weakness panel ──────────────────────────────────────────────────

function HighRiskWeaknessPanel({
  weaknesses,
  domains,
  practiceHref,
}: {
  weaknesses: CnpleDomain[];
  domains: CnpleDomainResult[];
  practiceHref: string;
}) {
  const domainLabel = (d: CnpleDomain) => domains.find((r) => r.domain === d)?.label ?? d;
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-warning) 40%, transparent)",
        background: "color-mix(in srgb, var(--semantic-warning) 6%, var(--semantic-surface))",
      }}
    >
      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-warning-contrast)" }}>
        High-Risk Weaknesses
      </p>
      <p className="mt-1 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
        These domains combine low performance with patient safety relevance — prioritise them in your next study session.
      </p>
      <ul className="mt-2 space-y-1">
        {weaknesses.map((d) => (
          <li key={d} className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
            <span style={{ color: "var(--semantic-warning-contrast)" }}>▶</span>
            {domainLabel(d)}
          </li>
        ))}
      </ul>
      <Link
        href={practiceHref}
        className="mt-3 inline-block text-[13px] font-semibold underline-offset-2 hover:underline"
        style={{ color: "var(--semantic-brand)" }}
      >
        Targeted practice on these domains →
      </Link>
    </div>
  );
}

// ── Strengths / weaknesses panel ──────────────────────────────────────────────

function StrengthsWeaknessesPanel({
  weakDomains,
  strongDomains,
  domains,
  flashcardsHref,
  practiceHref,
}: {
  weakDomains: CnpleDomain[];
  strongDomains: CnpleDomain[];
  domains: CnpleDomainResult[];
  flashcardsHref: string;
  practiceHref: string;
}) {
  const domainLabel = (d: CnpleDomain) => domains.find((r) => r.domain === d)?.label ?? d;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {strongDomains.length > 0 ? (
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-success) 30%, transparent)",
            background: "color-mix(in srgb, var(--semantic-success) 5%, var(--semantic-surface))",
          }}
        >
          <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-success)" }}>
            Strengths
          </p>
          <ul className="mt-2 space-y-1">
            {strongDomains.map((d) => (
              <li key={d} className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
                <span style={{ color: "var(--semantic-success)" }}>✓</span> {domainLabel(d)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {weakDomains.length > 0 ? (
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-danger) 25%, transparent)",
            background: "color-mix(in srgb, var(--semantic-danger) 4%, var(--semantic-surface))",
          }}
        >
          <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-danger)" }}>
            Focus Areas
          </p>
          <ul className="mt-2 space-y-1">
            {weakDomains.map((d) => (
              <li key={d} className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
                <span style={{ color: "var(--semantic-warning-contrast)" }}>!</span> {domainLabel(d)}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-3">
            <Link
              href={flashcardsHref}
              className="text-[12px] font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--semantic-brand)" }}
            >
              Flashcards →
            </Link>
            <Link
              href={practiceHref}
              className="text-[12px] font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--semantic-brand)" }}
            >
              Practice questions →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Recommendation card ───────────────────────────────────────────────────────

function RecommendationCard({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl border-l-4 p-4"
      style={{
        borderColor: "var(--semantic-brand)",
        background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))",
      }}
    >
      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-brand)" }}>
        Study Recommendation
      </p>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {text}
      </p>
    </div>
  );
}

// ── Remediation CTA strip ─────────────────────────────────────────────────────

function RemediationCtaStrip({
  cnpleHubHref,
  practiceHref,
  flashcardsHref,
}: {
  cnpleHubHref: string;
  practiceHref: string;
  flashcardsHref: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))",
      }}
    >
      <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        Continue your CNPLE preparation
      </p>
      <p className="mt-1 text-[13px]" style={{ color: "var(--semantic-text-muted)" }}>
        Targeted practice on weak domains accelerates readiness faster than full re-runs.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <RemediationLink href={practiceHref} label="Practice Questions" primary />
        <RemediationLink href={flashcardsHref} label="Flashcards" />
        <RemediationLink href={`${cnpleHubHref}/lessons`} label="Lessons" />
        <RemediationLink href={cnpleHubHref} label="CNPLE Hub" />
      </div>
    </div>
  );
}

function RemediationLink({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
      style={
        primary
          ? { background: "var(--semantic-brand)", color: "#fff" }
          : {
              background: "var(--semantic-surface)",
              color: "var(--semantic-text-secondary)",
              border: "1px solid var(--semantic-border-soft)",
            }
      }
    >
      {label}
    </Link>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readinessDisplay(level: CnpleReadinessLevel): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (level) {
    case "ready":
      return {
        label: "Ready",
        color: "var(--semantic-success)",
        bgColor: "color-mix(in srgb, var(--semantic-success) 14%, transparent)",
      };
    case "approaching":
      return {
        label: "Approaching",
        color: "var(--semantic-brand)",
        bgColor: "color-mix(in srgb, var(--semantic-brand) 14%, transparent)",
      };
    case "developing":
      return {
        label: "Developing",
        color: "var(--semantic-warning-contrast)",
        bgColor: "color-mix(in srgb, var(--semantic-warning) 14%, transparent)",
      };
    default:
      return {
        label: "Not Ready",
        color: "var(--semantic-danger)",
        bgColor: "color-mix(in srgb, var(--semantic-danger) 14%, transparent)",
      };
  }
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

// ── Domain label registry ─────────────────────────────────────────────────────

export const CNPLE_DOMAIN_LABELS: Record<CnpleDomain, string> = {
  prescribing_safety: "Prescribing Safety",
  diagnostics_labs: "Diagnostics & Labs",
  lifespan_care: "Lifespan Care",
  chronic_disease: "Chronic Disease Management",
  acute_deterioration: "Acute Deterioration Recognition",
  professional_legal: "Professional & Legal Judgment",
  mental_health: "Mental Health",
  womens_health: "Women's Health",
  pediatrics: "Pediatrics",
  geriatrics: "Geriatrics",
};
