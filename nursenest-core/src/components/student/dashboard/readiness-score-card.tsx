import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, Lock, Minus, Target } from "lucide-react";
import type { ReadinessBand, ReadinessResult, ReadinessTrend } from "@/lib/learner/readiness-score";
import { readinessBandLabel, readinessBandProgressFillClass, readinessBandGuidance } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { ProgressBarSemantic } from "@/components/student/product/progress-bar-semantic";

/* ── Ring constants ─────────────────────────────────────────────────── */

const RING_SIZE = 120;
const RING_STROKE = 10;
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
  const clamped = pct != null ? Math.min(100, Math.max(0, pct)) : null;
  const offset = clamped != null ? RING_CIRC - (clamped / 100) * RING_CIRC : RING_CIRC;
  const color = ringColorForBand(band);
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90" aria-hidden>
        <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke="var(--semantic-border-soft)" strokeWidth={RING_STROKE} opacity={0.3} />
        {clamped != null && (
          <circle
            cx={cx} cy={cy} r={RING_R} fill="none"
            stroke={color} strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRC} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {clamped != null ? (
          <>
            <span className="text-[1.75rem] font-bold tabular-nums leading-none" style={{ color }}>{clamped}</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">/ 100</span>
          </>
        ) : (
          <Target className="h-7 w-7 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </div>
    </div>
  );
}

/* ── Trend pill ─────────────────────────────────────────────────────── */

function TrendPill({ trend }: { trend: ReadinessTrend }) {
  const cfg = {
    improving: { label: "Improving", Icon: ArrowUp, cls: "nn-readiness-trend--up" },
    stable:    { label: "Holding Steady", Icon: Minus, cls: "nn-readiness-trend--flat" },
    declining: { label: "Needs Attention", Icon: ArrowDown, cls: "nn-readiness-trend--down" },
  } as const;
  const { label, Icon, cls } = cfg[trend];

  return (
    <span className={`nn-readiness-trend ${cls}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

/* ── Top border color per band ──────────────────────────────────────── */

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

/* ── Factor row (inside collapsible) ────────────────────────────────── */

function FactorRow({ label, points, maxPoints, detail }: { label: string; points: number; maxPoints: number; detail: string }) {
  if (maxPoints <= 0) {
    return (
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
        <p className="text-[13px] font-medium text-[var(--semantic-text-primary)]">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{detail}</p>
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
      footer={<p className="text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">{detail}</p>}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ReadinessScoreCard (subscriber view)
   ═══════════════════════════════════════════════════════════════════════ */

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
  const topAccent = readinessBandTopBorderClass(readiness.band);
  const hasWeakAreas = readiness.topWeakAreas.length > 0;
  const hasActions = readiness.nextActions.length > 0;

  return (
    <article
      className={`nn-readiness-card relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] border-t-4 ${topAccent} bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]`}
      aria-labelledby="readiness-heading"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_12%,transparent),transparent_60%)] blur-3xl" aria-hidden />

      {/* ── Hero: score ring + assessment ── */}
      <div className="relative flex flex-col items-center gap-5 px-6 pb-6 pt-7 text-center sm:flex-row sm:items-start sm:gap-7 sm:px-7 sm:text-left">
        <div className="flex flex-col items-center gap-2.5">
          <ReadinessRing pct={scorePct} band={readiness.band} />
          <span className="nn-readiness-band-badge">{readinessBandLabel(readiness.band)}</span>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <h2 id="readiness-heading" className="text-[1.3rem] font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              Exam Readiness
            </h2>
            {readiness.trend ? <TrendPill trend={readiness.trend} /> : null}
          </div>

          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
            {readinessBandGuidance(readiness.band)}
          </p>

          {readiness.calibratedPreview ? (
            <span className="nn-badge-semantic-warning mt-1 inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{t("learner.dashboard.insight.calibrated")}</span>
          ) : null}

          {scorePct == null ? (
            <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">{t("learner.dashboard.insight.scorePending")}</p>
          ) : null}
        </div>
      </div>

      {/* ── Focus Areas (weak topics + next steps) ── */}
      {(hasWeakAreas || hasActions) ? (
        <div className="nn-readiness-actions-strip">
          {hasWeakAreas ? (
            <div className="min-w-0 flex-1">
              <p className="nn-readiness-section-label text-[var(--semantic-danger)]">Topics to Review</p>
              <ul className="mt-2 space-y-1.5">
                {readiness.topWeakAreas.map((topic) => (
                  <li key={topic} className="text-[0.8125rem] text-[var(--semantic-text-secondary)]">{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasActions ? (
            <div className="min-w-0 flex-1">
              <p className="nn-readiness-section-label text-[var(--semantic-brand)]">What to Do Next</p>
              <ul className="mt-2 space-y-1.5">
                {readiness.nextActions.slice(0, 3).map((action) => (
                  <li key={action.slice(0, 40)} className="flex items-start gap-2 text-[0.8125rem] text-[var(--semantic-text-secondary)]">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Summary + confidence disclaimer ── */}
      <div className="px-6 pb-5 sm:px-7">
        <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">{readiness.summary}</p>
      </div>

      {/* ── Score Breakdown (opt-in) ── */}
      {factors.length > 0 ? (
        <details className="nn-readiness-details group">
          <summary className="nn-readiness-details-trigger">
            <span>Score Breakdown</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="space-y-4 px-6 pb-6 pt-4 sm:px-7">
            {factors.map((f) => (
              <FactorRow key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
            ))}

            {readiness.holdingBack.length > 0 ? (
              <p className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-4 py-3 text-[0.8125rem] text-[var(--semantic-warning-contrast)]">
                <span className="font-semibold">Holding you back: </span>
                {readiness.holdingBack.join(", ")}
              </p>
            ) : null}
          </div>
        </details>
      ) : null}
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ReadinessLockedCard (trial / free users)
   ═══════════════════════════════════════════════════════════════════════ */

export function ReadinessLockedCard() {
  return (
    <article className="nn-readiness-card relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] border-t-4 border-t-[var(--semantic-border-soft)] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-info)_3%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_8%,transparent),transparent_60%)] blur-3xl" aria-hidden />

      <div className="relative flex flex-col items-center gap-6 px-6 py-7 text-center sm:flex-row sm:items-start sm:gap-7 sm:px-7 sm:text-left">
        {/* Blurred placeholder ring */}
        <div className="shrink-0 select-none blur-[6px]" aria-hidden>
          <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
            <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
              <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="var(--semantic-border-soft)" strokeWidth={RING_STROKE} opacity={0.3} />
              <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="var(--semantic-brand)" strokeWidth={RING_STROKE} strokeDasharray={RING_CIRC} strokeDashoffset={RING_CIRC * 0.4} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[1.75rem] font-bold tabular-nums leading-none text-[var(--semantic-brand)]">--</span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Lock className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
            <h2 className="text-[1.3rem] font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              Exam Readiness
            </h2>
          </div>

          <p className="max-w-md text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
            Unlock your readiness score to see where you stand, which topics need work, and what to focus on next.
          </p>

          <Link
            href="/pricing"
            className="mt-1 inline-flex rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </article>
  );
}
