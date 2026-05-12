"use client";

import Link from "next/link";
import type { CaseStepAdvanceResult, CaseSessionScore } from "@/lib/cases/longitudinal-case-types";
import { classifyReadiness } from "@/lib/cases/longitudinal-case-engine";

// ─────────────────────────────────────────────────────────────────────────────
// CNPLE Case Completion screen
// Shown immediately after the last step (before navigating to full review).
// Premium visual: score ring, trajectory summary, quick remediation links.
// ─────────────────────────────────────────────────────────────────────────────

export function CnpleCaseCompletion({
  result,
  caseTitle,
  sessionId,
  onReview,
}: {
  result: CaseStepAdvanceResult;
  caseTitle: string;
  sessionId: string;
  onReview: () => void;
}) {
  const score = result.score;
  if (!score) return null;

  const readiness = classifyReadiness(score.score0to100);
  const { color, label, bg } = readinessDisplay(readiness);

  return (
    <div
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-brand) 20%, var(--semantic-border-soft))",
        background: "var(--semantic-surface)",
      }}
      data-cnple-case="completion"
    >
      {/* Header */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.13em]" style={{ color: "var(--semantic-text-muted)" }}>
          Case complete
        </p>
        <h2 className="text-[20px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          {caseTitle}
        </h2>
        <p className="text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
          For self-assessment only. Not affiliated with CCRNR or official CNPLE.
        </p>
      </div>

      {/* Score ring + readiness */}
      <div className="flex items-center gap-6">
        <ScoreRing score={score.score0to100} color={color} />
        <div>
          <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            {score.correctCount} / {score.totalSteps} steps correct
          </p>
          <span
            className="mt-1 inline-block rounded-full px-3 py-0.5 text-[12px] font-bold"
            style={{ background: bg, color }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Trajectory breakdown */}
      <TrajectoryBreakdown trajectory={score.trajectoryProfile} />

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
            Next steps
          </p>
          <ul className="space-y-2">
            {score.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-[13px]" style={{ color: "var(--semantic-text-primary)" }}>
                <span style={{ color: "var(--semantic-brand)" }}>→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weak domain pills */}
      {score.weakDomains.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
            Domains to review
          </p>
          <div className="flex flex-wrap gap-2">
            {score.weakDomains.map((d) => (
              <Link
                key={d}
                href={`/canada/np/cnple/flashcards?domain=${encodeURIComponent(d)}`}
                className="rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors hover:border-[var(--semantic-brand)]"
                style={{
                  borderColor: "color-mix(in srgb, var(--semantic-warning) 30%, var(--semantic-border-soft))",
                  color: "var(--semantic-warning-contrast)",
                  background: "color-mix(in srgb, var(--semantic-warning) 8%, transparent)",
                }}
              >
                {d.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="rounded-xl px-5 py-2.5 text-[13px] font-bold"
          style={{ background: "var(--semantic-brand)", color: "var(--semantic-on-brand)" }}
        >
          Full review with rationale
        </button>
        <Link
          href="/app/cases/cnple"
          className="rounded-xl border px-5 py-2.5 text-[13px] font-semibold"
          style={{
            borderColor: "var(--semantic-border-soft)",
            color: "var(--semantic-text-primary)",
          }}
        >
          Back to case catalog
        </Link>
      </div>
    </div>
  );
}

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" stroke="var(--semantic-border-soft)" />
        <circle
          cx="36" cy="36" r={r} fill="none" strokeWidth="6"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span className="absolute text-[18px] font-bold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

// ── Trajectory breakdown ──────────────────────────────────────────────────────

function TrajectoryBreakdown({ trajectory }: { trajectory: CaseSessionScore["trajectoryProfile"] }) {
  const entries: Array<{ key: keyof typeof trajectory; label: string; color: string }> = [
    { key: "optimal", label: "Optimal", color: "var(--semantic-success)" },
    { key: "acceptable", label: "Acceptable", color: "var(--semantic-brand)" },
    { key: "suboptimal", label: "Suboptimal", color: "var(--semantic-warning-contrast)" },
    { key: "harmful", label: "Harmful", color: "var(--semantic-danger)" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {entries.map(({ key, label, color }) => (
        <div
          key={key}
          className="rounded-xl border p-3 text-center"
          style={{
            borderColor: `color-mix(in srgb, ${color} 20%, var(--semantic-border-soft))`,
            background: `color-mix(in srgb, ${color} 6%, var(--semantic-surface))`,
          }}
        >
          <p className="text-[20px] font-bold tabular-nums" style={{ color }}>
            {trajectory[key]}
          </p>
          <p className="text-[11px] font-semibold" style={{ color: "var(--semantic-text-muted)" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Readiness display ─────────────────────────────────────────────────────────

function readinessDisplay(level: ReturnType<typeof classifyReadiness>) {
  switch (level) {
    case "ready": return { color: "var(--semantic-success)", label: "Ready", bg: "color-mix(in srgb, var(--semantic-success) 12%, transparent)" };
    case "approaching": return { color: "var(--semantic-brand)", label: "Approaching", bg: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)" };
    case "developing": return { color: "var(--semantic-warning-contrast)", label: "Developing", bg: "color-mix(in srgb, var(--semantic-warning) 12%, transparent)" };
    default: return { color: "var(--semantic-danger)", label: "Needs work", bg: "color-mix(in srgb, var(--semantic-danger) 12%, transparent)" };
  }
}
