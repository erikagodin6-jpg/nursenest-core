import Link from "next/link";
import { AlertCircle, ArrowDown, ArrowRight, ArrowUp, Lock, Minus, Target } from "lucide-react";
import type { ReadinessBand, ReadinessResult, ReadinessTrend } from "@/lib/learner/readiness-score";
import { readinessBandLabel, readinessBandProgressFillClass, readinessBandGuidance } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { ProgressBarSemantic } from "@/components/student/product/progress-bar-semantic";

const RING_SIZE = 108;
const RING_STROKE = 9;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

function ringColorForBand(band: ReadinessBand): string {
  switch (band) {
    case "ready":
      return "var(--semantic-success)";
    case "near_ready":
      return "var(--semantic-brand)";
    case "improving":
      return "var(--semantic-info)";
    case "not_ready":
      return "var(--semantic-warning)";
    case "insufficient_data":
    default:
      return "var(--semantic-border-soft)";
  }
}

function ReadinessRing({ pct, band }: { pct: number | null; band: ReadinessBand }) {
  const offset = pct != null ? RING_CIRC - (Math.min(100, Math.max(0, pct)) / 100) * RING_CIRC : RING_CIRC;
  const color = ringColorForBand(band);
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={cx}
          cy={cy}
          r={RING_R}
          fill="none"
          stroke="var(--semantic-border-soft)"
          strokeWidth={RING_STROKE}
          opacity={0.4}
        />
        {pct != null && (
          <circle
            cx={cx}
            cy={cy}
            r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {pct != null ? (
          <>
            <span
              className="text-2xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {pct}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              / 100
            </span>
          </>
        ) : (
          <Target className="h-6 w-6 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </div>
    </div>
  );
}

function readinessBandTopBorderClass(band: ReadinessBand): string {
  switch (band) {
    case "ready":
      return "border-t-[var(--semantic-success)]";
    case "near_ready":
      return "border-t-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-success))]";
    case "improving":
      return "border-t-[var(--semantic-info)]";
    case "not_ready":
      return "border-t-[var(--semantic-warning)]";
    case "insufficient_data":
    default:
      return "border-t-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-muted))]";
  }
}

function TrendBadge({ trend }: { trend: ReadinessTrend }) {
  const config = {
    improving: {
      label: "Improving",
      icon: ArrowUp,
      color: "var(--semantic-success)",
      bg: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
      border: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
    },
    stable: {
      label: "Stable",
      icon: Minus,
      color: "var(--semantic-info)",
      bg: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
      border: "color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
    },
    declining: {
      label: "Needs Attention",
      icon: ArrowDown,
      color: "var(--semantic-warning)",
      bg: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
      border: "color-mix(in srgb, var(--semantic-warning) 25%, var(--semantic-border-soft))",
    },
  } as const;

  const c = config[trend];
  const Icon = c.icon;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {c.label}
    </span>
  );
}

function InsightFactorBar({
  label,
  points,
  maxPoints,
  detail,
}: {
  label: string;
  points: number;
  maxPoints: number;
  detail: string;
}) {
  if (maxPoints <= 0) {
    return (
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2">
        <p className="text-xs font-medium text-[var(--semantic-text-primary)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{detail}</p>
      </div>
    );
  }
  return (
    <ProgressBarSemantic
      value={points}
      max={maxPoints}
      variant="info"
      size="sm"
      label={label}
      hint={`${points}/${maxPoints}`}
      footer={<p className="text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{detail}</p>}
    />
  );
}

/**
 * Primary readiness KPI card with score ring, band, trend, weak areas, and next actions.
 */
export function ReadinessScoreCard({
  readiness,
  t,
  maxFactors = 4,
}: {
  readiness: ReadinessResult;
  t: LearnerMarketingT;
  maxFactors?: number;
}) {
  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;
  const factors = readiness.factors.slice(0, maxFactors);
  const meterFill = readinessBandProgressFillClass(readiness.band);
  const topAccent = readinessBandTopBorderClass(readiness.band);

  return (
    <article
      className={`nn-card nn-student-card-lift relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] border-t-4 ${topAccent} bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6`}
      aria-labelledby="readiness-card-heading"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_16%,transparent),transparent_62%)] blur-2xl" aria-hidden />

      {/* Header row: ring + copy */}
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex flex-col items-center gap-2 sm:shrink-0">
          <ReadinessRing pct={scorePct} band={readiness.band} />
          <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            {readinessBandLabel(readiness.band)}
          </span>
          {readiness.calibratedPreview ? (
            <span className="nn-badge-semantic-warning px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{t("learner.dashboard.insight.calibrated")}</span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 id="readiness-card-heading" className="text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              Exam Readiness
            </h2>
            {readiness.trend ? <TrendBadge trend={readiness.trend} /> : null}
          </div>

          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {readinessBandGuidance(readiness.band)}
          </p>

          {scorePct == null ? (
            <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.scorePending")}</p>
          ) : null}
        </div>
      </div>

      {/* Linear bar meter */}
      <div className="relative mt-5 space-y-2">
        <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--semantic-text-secondary)]">
          <span className="font-medium">Readiness Score</span>
          {scorePct != null ? <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">{scorePct}%</span> : null}
        </div>
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--lg"
          role="progressbar"
          aria-valuenow={scorePct ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Exam Readiness"
        >
          <div
            className={`h-full rounded-full ${meterFill} nn-progress-fill-reveal transition-[width] duration-700 ease-out`}
            style={{ width: `${scorePct ?? 0}%` }}
          />
        </div>
      </div>

      {/* What is limiting readiness */}
      {readiness.holdingBack.length > 0 ? (
        <p className="relative mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-4 py-3 text-sm text-[var(--semantic-warning-contrast)]">
          <span className="font-semibold">Limiting factors: </span>
          {readiness.holdingBack.join(", ")}
        </p>
      ) : null}

      {/* Weak areas + next actions */}
      {(readiness.topWeakAreas.length > 0 || readiness.nextActions.length > 0) ? (
        <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
          {readiness.topWeakAreas.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_3%,var(--semantic-surface))] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-danger)]">
                Weak Areas
              </p>
              <ul className="mt-2 space-y-1">
                {readiness.topWeakAreas.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {readiness.nextActions.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                Suggested Next Steps
              </p>
              <ul className="mt-2 space-y-1">
                {readiness.nextActions.slice(0, 3).map((action) => (
                  <li key={action.slice(0, 40)} className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="relative mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{readiness.summary}</p>

      {/* Contributing factors (collapsed by default for cleaner view) */}
      {factors.length > 0 ? (
        <details className="relative mt-6 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-5">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)] hover:text-[var(--semantic-brand)]">
            Contributing Factors
          </summary>
          <div className="mt-4 space-y-4">
            {factors.map((f) => (
              <InsightFactorBar key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}

/**
 * Locked readiness card for trial/free users. Shows limited info with upgrade CTA.
 * Client component for analytics tracking on CTA click.
 */
export function ReadinessLockedCard() {
  return (
    <article className="nn-card relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] border-t-4 border-t-[var(--semantic-border-soft)] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-info)_4%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_10%,transparent),transparent_62%)] blur-2xl" aria-hidden />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Blurred placeholder ring */}
        <div className="flex flex-col items-center gap-2 sm:shrink-0 blur-[6px] select-none" aria-hidden>
          <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
            <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
              <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="var(--semantic-border-soft)" strokeWidth={RING_STROKE} opacity={0.4} />
              <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="var(--semantic-brand)" strokeWidth={RING_STROKE} strokeDasharray={RING_CIRC} strokeDashoffset={RING_CIRC * 0.4} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums leading-none text-[var(--semantic-brand)]">--</span>
            </div>
          </div>
        </div>

        <div className="relative min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
            <h2 className="text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              Exam Readiness
            </h2>
          </div>

          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Limited insight available. Full readiness tracking shows your score, trend, weak areas, and what to focus on next.
          </p>

          <p className="text-sm text-[var(--semantic-text-secondary)]">
            See your full readiness and know when you are ready to pass.
          </p>

          <Link
            href="/pricing"
            className="mt-3 inline-flex rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </article>
  );
}
