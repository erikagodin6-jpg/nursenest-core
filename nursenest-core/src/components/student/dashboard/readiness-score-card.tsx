import { Target } from "lucide-react";
import type { ReadinessBand, ReadinessResult } from "@/lib/learner/readiness-score";
import { readinessBandLabel, readinessBandProgressFillClass } from "@/lib/learner/readiness-score";
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

/**
 * Circular SVG progress ring for the readiness KPI.
 * Rotated -90deg so the arc starts at 12 o'clock.
 */
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
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={RING_R}
          fill="none"
          stroke="var(--semantic-border-soft)"
          strokeWidth={RING_STROKE}
          opacity={0.4}
        />
        {/* Progress arc */}
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
      {/* Score number centred inside ring */}
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
 * Primary KPI — overall exam readiness (brand-forward meter, calm premium shell).
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
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_16%,transparent),transparent_62%)] blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] shadow-sm">
            <Target className="h-6 w-6 text-[var(--semantic-brand)]" aria-hidden strokeWidth={2} />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{t("learner.dashboard.readinessCard.kicker")}</p>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.dashboard.insight.readinessTitle")}</h2>
            <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.readinessSubtitle")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                {readinessBandLabel(readiness.band)}
              </span>
              {readiness.calibratedPreview ? (
                <span className="nn-badge-semantic-warning px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">{t("learner.dashboard.insight.calibrated")}</span>
              ) : null}
            </div>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {t(
                (
                  {
                    insufficient_data: "learner.dashboard.readinessBandExplain.insufficient_data",
                    not_ready: "learner.dashboard.readinessBandExplain.not_ready",
                    improving: "learner.dashboard.readinessBandExplain.improving",
                    near_ready: "learner.dashboard.readinessBandExplain.near_ready",
                    ready: "learner.dashboard.readinessBandExplain.ready",
                  } as const
                )[readiness.band],
              )}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-left lg:text-right">
          {scorePct != null ? (
            <p className="nn-score-reveal bg-gradient-to-br from-[var(--semantic-info)] via-[var(--semantic-brand)] to-[var(--semantic-success)] bg-clip-text text-5xl font-bold tabular-nums leading-none tracking-tight text-transparent sm:text-6xl">
              {scorePct}
            </p>
          ) : (
            <p className="max-w-[16rem] text-sm text-[var(--semantic-text-secondary)] lg:ml-auto lg:text-right">{t("learner.dashboard.insight.scorePending")}</p>
          )}
          {scorePct != null ? <p className="mt-1 text-xs font-medium text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.scoreSuffix")}</p> : null}
        </div>
      </div>

      <div className="relative mt-6 space-y-2">
        <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--semantic-text-secondary)]">
          <span className="font-medium">{t("learner.dashboard.insight.scoreMeterLabel")}</span>
          {scorePct != null ? <span className="tabular-nums text-[var(--semantic-text-primary)]">{scorePct}%</span> : null}
        </div>
          <div
            className="nn-progress-track-semantic nn-progress-track-semantic--lg"
            role="progressbar"
            aria-valuenow={scorePct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
          <div
            className={`h-full rounded-full ${meterFill} nn-progress-fill-reveal transition-[width] duration-700 ease-out`}
            style={{ width: `${scorePct ?? 0}%` }}
          />
        </div>
      </div>

      {readiness.holdingBack.length > 0 ? (
        <p className="relative mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-4 py-3 text-sm text-[var(--semantic-warning-contrast)]">
          <span className="font-semibold">{t("learner.dashboard.insight.limiting")}: </span>
          {readiness.holdingBack.join(" · ")}
        </p>
      ) : null}

      <p className="relative mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{readiness.summary}</p>

      {factors.length > 0 ? (
        <div className="relative mt-6 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{t("learner.dashboard.insight.factorsTitle")}</p>
          <div className="mt-4 space-y-4">
            {factors.map((f) => (
              <InsightFactorBar key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
