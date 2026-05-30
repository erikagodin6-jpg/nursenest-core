"use client";

/**
 * MonitorSessionReport
 *
 * Post-session report card rendered after a Physiology Monitor session ends.
 * Consumes MonitorSessionReport from monitor-session-report.ts (data layer).
 *
 * Sections:
 *   1. Score summary (4 domain scores + composite)
 *   2. Clinical Judgment breakdown (NCJMM domains)
 *   3. Harm Index (color badge + events)
 *   4. Time-to-Intervention metrics
 *   5. Competency passport (if provided)
 *   6. Personalised Remediation Plan
 *   7. Badges earned
 */

import type { MonitorSessionReport as ReportData } from "@/lib/physiology-monitor/monitor-session-report";
import { NCJMM_DOMAIN_LABELS } from "@/lib/physiology-monitor/clinical-judgment-engine";
import { COMPETENCY_LEVEL_LABELS } from "@/lib/physiology-monitor/monitor-competency-tracker";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--semantic-border-soft)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dasharray 600ms ease" }}
        />
        <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--semantic-text-primary)">{score}</text>
      </svg>
      <span className="text-[0.65rem] font-semibold text-center text-[var(--semantic-text-muted)] uppercase tracking-wide leading-tight max-w-[5rem]">{label}</span>
    </div>
  );
}

function DomainBar({ label, score, feedback }: { label: string; score: number; feedback: string[] }) {
  const color = score >= 80 ? "var(--semantic-success)" : score >= 60 ? "var(--semantic-warning)" : "var(--semantic-danger)";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--semantic-text-primary)]">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--semantic-border-soft)] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }} />
      </div>
      {feedback.length > 0 && (
        <p className="text-[0.68rem] text-[var(--semantic-text-secondary)] leading-relaxed">{feedback[0]}</p>
      )}
    </div>
  );
}

function HarmBadge({ color, score }: { color: "green" | "yellow" | "red"; score: number }) {
  const cfg = {
    green:  { bg: "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]", border: "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]", text: "text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))]", label: "Safe Practice" },
    yellow: { bg: "bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))]", border: "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))]", text: "text-[color-mix(in_srgb,var(--semantic-warning)_80%,var(--semantic-text-primary))]", label: "Near Miss" },
    red:    { bg: "bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))]",   border: "border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))]",  text: "text-[color-mix(in_srgb,var(--semantic-danger)_80%,var(--semantic-text-primary))]",  label: "Harm Occurred" },
  }[color];
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 ${cfg.bg} ${cfg.border}`}>
      <span className={`text-lg font-black tabular-nums ${cfg.text}`}>{score}</span>
      <div>
        <p className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</p>
        <p className="text-[0.6rem] text-[var(--semantic-text-muted)] uppercase tracking-wide">Harm Index</p>
      </div>
    </div>
  );
}

function TimingRow({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const mins = Math.floor(value / 60);
  const secs = String(value % 60).padStart(2, "0");
  const display = mins > 0 ? `${mins}:${secs}` : `0:${secs}`;
  const color = value <= 60 ? "text-[var(--semantic-success)]" : value <= 180 ? "text-[var(--semantic-warning)]" : "text-[var(--semantic-danger)]";
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[var(--semantic-border-soft)] last:border-0">
      <span className="text-xs text-[var(--semantic-text-secondary)]">{label}</span>
      <span className={`text-xs font-bold tabular-nums font-mono ${color}`}>{display}</span>
    </div>
  );
}

function RemediationItem({ item }: { item: ReportData["remediationPlan"]["items"][number] }) {
  const surfaceIcon: Record<string, string> = {
    lessons: "📖", flashcards: "🃏", questions: "✏️", simulations: "🖥", ecg: "💓", clinical_skills: "🩺",
  };
  const priorityColor = item.priority === 1 ? "text-[var(--semantic-danger)]" : item.priority === 2 ? "text-[var(--semantic-warning)]" : "text-[var(--semantic-text-muted)]";
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
      <span className="text-lg leading-none">{surfaceIcon[item.surface] ?? "📌"}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[var(--semantic-text-primary)]">{item.label}</span>
          <span className={`text-[0.6rem] font-bold uppercase tracking-wide ${priorityColor}`}>
            P{item.priority}
          </span>
        </div>
        <p className="text-[0.68rem] text-[var(--semantic-text-secondary)] mt-0.5 leading-relaxed">{item.reason}</p>
      </div>
    </div>
  );
}

function BadgeChip({ badge }: { badge: ReportData["badgesEarned"][number] }) {
  const tierColor = badge.tier === "gold" ? "border-amber-300 bg-amber-50 text-amber-800"
    : badge.tier === "silver" ? "border-slate-300 bg-slate-50 text-slate-700"
    : "border-orange-200 bg-orange-50 text-orange-800";
  const tierEmoji = badge.tier === "gold" ? "🥇" : badge.tier === "silver" ? "🥈" : "🥉";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tierColor}`}>
      <span>{tierEmoji}</span>
      {badge.label}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface MonitorSessionReportProps {
  report: ReportData;
  onClose?: () => void;
  onStartNew?: () => void;
  onViewRemediation?: () => void;
}

export function MonitorSessionReport({
  report,
  onClose,
  onStartNew,
  onViewRemediation,
}: MonitorSessionReportProps) {
  const { scores, summary, clinicalJudgment, harmIndex, timeToIntervention,
          remediationPlan, badgesEarned, topStrengths, topImprovements, competencyPassport } = report;

  const simMinutes = Math.round(summary.totalSimSeconds / 60);

  return (
    <div
      className="nn-monitor-session-report flex flex-col gap-5 overflow-y-auto rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5 sm:p-6"
      data-nn-monitor
      style={{ maxHeight: "90vh" }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)] mb-0.5">Session Complete</p>
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">{summary.conditionLabel}</h2>
          <p className="text-xs text-[var(--semantic-text-muted)]">
            {simMinutes} sim-minutes · {summary.interventionsApplied} interventions · {summary.mode} mode
          </p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-primary)] text-xl leading-none p-1">×</button>
        ) : null}
      </div>

      {/* ── Score Summary ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
        <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)] mb-3">Performance Overview</p>
        <div className="flex flex-wrap justify-around gap-3">
          <ScoreRing score={scores.clinicalJudgment} label="Clinical Judgment" color="var(--semantic-brand)" />
          <ScoreRing score={scores.monitorInterpretation} label="Monitor Interpretation" color="var(--semantic-chart-2)" />
          <ScoreRing score={scores.timeToIntervention} label="Time to Intervention" color="var(--semantic-success)" />
          <ScoreRing score={scores.harmIndex} label="Harm Index" color={harmIndex.color === "green" ? "var(--semantic-success)" : harmIndex.color === "yellow" ? "var(--semantic-warning)" : "var(--semantic-danger)"} />
          <ScoreRing score={scores.composite} label="Composite" color="var(--semantic-chart-4)" />
        </div>
      </div>

      {/* ── Badges ── */}
      {badgesEarned.length > 0 && (
        <div className="space-y-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Badges Earned</p>
          <div className="flex flex-wrap gap-2">
            {badgesEarned.map((b) => <BadgeChip key={b.id} badge={b} />)}
          </div>
        </div>
      )}

      {/* ── Clinical Judgment NCJMM ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Clinical Judgment (NCJMM)</p>
          <span className="text-xs font-bold text-[var(--semantic-brand)]">{clinicalJudgment.overallLevel}</span>
        </div>
        {(Object.keys(clinicalJudgment.domainScores) as (keyof typeof clinicalJudgment.domainScores)[]).map((domain) => {
          const ds = clinicalJudgment.domainScores[domain];
          return (
            <DomainBar
              key={domain}
              label={NCJMM_DOMAIN_LABELS[domain]}
              score={ds.score}
              feedback={ds.feedback}
            />
          );
        })}
        {clinicalJudgment.missedIndicatedInterventions.length > 0 && (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_6%,var(--semantic-surface))] p-3">
            <p className="text-[0.62rem] font-bold text-[var(--semantic-warning)] uppercase tracking-wide mb-1">Missed Interventions</p>
            <ul className="text-xs text-[var(--semantic-text-secondary)] space-y-0.5">
              {clinicalJudgment.missedIndicatedInterventions.map((m) => (
                <li key={m} className="flex items-center gap-1.5"><span className="text-[var(--semantic-warning)]">▸</span>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Harm Index ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 space-y-3">
        <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Patient Safety</p>
        <div className="flex items-center gap-3 flex-wrap">
          <HarmBadge color={harmIndex.color} score={harmIndex.score} />
          <p className="text-xs text-[var(--semantic-text-secondary)] flex-1 min-w-[10rem]">{harmIndex.summary}</p>
        </div>
        {harmIndex.events.length > 0 && (
          <ul className="space-y-1.5">
            {harmIndex.events.map((ev, i) => (
              <li key={i} className="text-[0.68rem] text-[var(--semantic-text-secondary)] flex items-start gap-1.5">
                <span className={ev.level === "near_miss" ? "text-[var(--semantic-warning)]" : "text-[var(--semantic-danger)]"}>▸</span>
                {ev.description}
                {ev.correctedByLearner && <span className="text-[var(--semantic-success)]"> (corrected)</span>}
              </li>
            ))}
          </ul>
        )}
        {harmIndex.safetyCoaching.length > 0 && (
          <div className="space-y-0.5">
            {harmIndex.safetyCoaching.map((c, i) => (
              <p key={i} className="text-[0.68rem] italic text-[var(--semantic-text-secondary)]">{c}</p>
            ))}
          </div>
        )}
      </div>

      {/* ── Time-to-Intervention ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
        <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)] mb-2">Timing</p>
        <TimingRow label="Deterioration Recognised" value={timeToIntervention.recognitionTimeSec} />
        <TimingRow label="First Intervention" value={timeToIntervention.firstInterventionTimeSec} />
        <TimingRow label="Escalation Initiated" value={timeToIntervention.escalationTimeSec} />
        <TimingRow label="Reassessment" value={timeToIntervention.reassessmentTimeSec} />
      </div>

      {/* ── Strengths / Improvements ── */}
      {(topStrengths.length > 0 || topImprovements.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {topStrengths.length > 0 && (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--semantic-surface))] p-3">
              <p className="text-[0.58rem] font-bold uppercase tracking-wide text-[var(--semantic-success)] mb-1.5">Strengths</p>
              <ul className="space-y-0.5">
                {topStrengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-[0.68rem] text-[var(--semantic-text-secondary)] flex items-center gap-1"><span className="text-[var(--semantic-success)]">✓</span>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {topImprovements.length > 0 && (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_5%,var(--semantic-surface))] p-3">
              <p className="text-[0.58rem] font-bold uppercase tracking-wide text-[var(--semantic-warning)] mb-1.5">Priority Focus</p>
              <ul className="space-y-0.5">
                {topImprovements.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-[0.68rem] text-[var(--semantic-text-secondary)] flex items-center gap-1"><span className="text-[var(--semantic-warning)]">▸</span>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Competency Passport ── */}
      {competencyPassport && (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 space-y-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Competency Progress</p>
          {Object.entries(competencyPassport.domains).map(([domain, state]) => (
            <div key={domain} className="flex items-center justify-between gap-2">
              <span className="text-xs text-[var(--semantic-text-secondary)]">{domain.replace(/_/g, " ")}</span>
              <span className="text-[0.65rem] font-bold text-[var(--semantic-brand)] capitalize">{COMPETENCY_LEVEL_LABELS[state.level]}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Remediation Plan ── */}
      {remediationPlan.items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Personalised Remediation Plan</p>
            <span className="text-[0.6rem] text-[var(--semantic-text-muted)]">~{remediationPlan.estimatedMinutes} min</span>
          </div>
          <p className="text-[0.72rem] text-[var(--semantic-text-secondary)]">{remediationPlan.planSummary}</p>
          <div className="space-y-2">
            {remediationPlan.items.slice(0, 5).map((item, i) => (
              <RemediationItem key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-2 pt-2">
        {onStartNew && (
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold nn-text-on-solid-fill shadow-md transition hover:opacity-95 focus-visible:outline focus-visible:outline-2"
            style={{ background: "var(--role-cta, var(--semantic-brand))" }}
          >
            New Session
          </button>
        )}
        {onViewRemediation && remediationPlan.items.length > 0 && (
          <button
            type="button"
            onClick={onViewRemediation}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[var(--semantic-panel-muted)]"
          >
            Start Remediation
          </button>
        )}
      </div>
    </div>
  );
}
