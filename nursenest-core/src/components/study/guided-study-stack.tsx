/**
 * GuidedStudyStack — ordered action block stack (2–3 cards below the next step)
 * GuidedReviewLaterCard — review later block
 * GuidedRetestCard — retest recommendation
 *
 * Design surfaces:
 *   - Study blocks: alternating --surface-soft-a / --surface-soft-b
 *   - Review later: soft neutral (--surface-soft-b with info accent)
 *   - Retest:       soft accent surface keyed to urgency/band
 */

import Link from "next/link";
import { BAND_LABELS } from "./cat-readiness-hero";
import type { ReadinessBand } from "./cat-readiness-hero";
import type { GuidedStudyStep, GuidedRetestRec, GuidedStepKind } from "@/lib/study/guided-study-data";

// ── Step card (individual block in the study stack) ───────────────────────────

const KIND_ICONS: Record<GuidedStepKind, React.ReactNode> = {
  lesson: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  questions: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  review: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.4" />
    </svg>
  ),
  retest: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  baseline: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 8 16 12 12 16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
};

const KIND_LABELS: Record<GuidedStepKind, string> = {
  lesson: "Lesson",
  questions: "Practice",
  review: "Review",
  retest: "CAT",
  baseline: "Start",
};

const SOFT_SURFACES: [string, string][] = [
  [
    "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
    "color-mix(in srgb, var(--semantic-brand) 20%, var(--semantic-border-soft))",
  ],
  [
    "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
    "color-mix(in srgb, var(--semantic-success) 20%, var(--semantic-border-soft))",
  ],
];

function StepCard({
  step,
  index,
  position,
}: {
  step: GuidedStudyStep;
  index: number;
  position: number;
}) {
  const [surface, border] = SOFT_SURFACES[index % 2]!;
  const icon = KIND_ICONS[step.kind];
  const kindLabel = KIND_LABELS[step.kind];

  const accentColor = index % 2 === 0 ? "var(--semantic-brand)" : "var(--semantic-success)";

  return (
    <li>
      <div
        className="flex items-start gap-4 overflow-hidden rounded-2xl px-5 py-4 transition-shadow hover:shadow-sm"
        style={{ background: surface, border: `1px solid ${border}` }}
      >
        {/* Step number */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: `color-mix(in srgb, ${accentColor} 12%, var(--semantic-surface))`,
            color: accentColor,
            border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
          }}
          aria-label={`Step ${position}`}
        >
          {position}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1 space-y-0.5">
            {/* Kind badge + title */}
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: `color-mix(in srgb, ${accentColor} 10%, var(--semantic-surface))`,
                  color: accentColor,
                }}
              >
                {icon}
                {kindLabel}
              </span>
            </div>
            <p
              className="text-sm font-semibold leading-snug"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {step.title}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {step.why}
            </p>
          </div>

          {/* CTA */}
          <Link
            href={step.href}
            className="inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, var(--semantic-surface))`,
              border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
              color: accentColor,
            }}
          >
            {step.ctaLabel}
          </Link>
        </div>
      </div>
    </li>
  );
}

// ── GuidedStudyStack ──────────────────────────────────────────────────────────

export function GuidedStudyStack({ steps }: { steps: GuidedStudyStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section aria-label="Study block stack">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          What to study next
        </span>
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
      </div>

      <ol className="space-y-2.5" aria-label="Study steps">
        {steps.map((step, i) => (
          <StepCard
            key={`${step.kind}-${step.topic ?? i}`}
            step={step}
            index={i}
            position={i + 2} // +2 because nextStep is position 1
          />
        ))}
      </ol>
    </section>
  );
}

// ── GuidedReviewLaterCard ─────────────────────────────────────────────────────

export function GuidedReviewLaterCard({
  count,
  topics,
  reviewLaterReliable = true,
}: {
  count: number;
  topics: string[];
  /** When false, do not present “no pending reviews” as a real empty queue. */
  reviewLaterReliable?: boolean;
}) {
  return (
    <section aria-label="Review later">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Review later
        </span>
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
      </div>

      <div
        className="flex flex-col gap-4 overflow-hidden rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
          border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
              color: "var(--semantic-info)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
              {!reviewLaterReliable
                ? "Review queue could not be loaded"
                : count > 0
                  ? `${count} topic${count > 1 ? "s" : ""} queued for review`
                  : "No pending reviews"}
            </p>
            {!reviewLaterReliable ? (
              <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
                Retry in a moment — a count of zero here does not mean you are caught up.
              </p>
            ) : topics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
                      color: "var(--semantic-info)",
                      border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, transparent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
                Keep studying and your review queue will populate automatically.
              </p>
            )}
          </div>
        </div>

        <Link
          href={reviewLaterReliable ? "/app/review" : "/app/guided"}
          className="shrink-0 self-start rounded-full px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 sm:self-center"
          style={{
            background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--semantic-info) 25%, transparent)",
            color: "var(--semantic-info)",
          }}
        >
          {!reviewLaterReliable ? "Retry" : count > 0 ? "Open review queue" : "View queue"}
        </Link>
      </div>
    </section>
  );
}

// ── GuidedRetestCard ──────────────────────────────────────────────────────────

const RETEST_URGENCY_STYLE: Record<GuidedRetestRec["urgency"], { surface: string; border: string; accent: string }> = {
  ready: {
    surface: "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
    border: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
    accent: "var(--semantic-success)",
  },
  soon: {
    surface: "var(--surface-soft-c, color-mix(in srgb, var(--semantic-brand) 5%, var(--bg-card)))",
    border: "color-mix(in srgb, var(--semantic-brand) 22%, var(--semantic-border-soft))",
    accent: "var(--semantic-brand)",
  },
  not_yet: {
    surface: "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
    border: "color-mix(in srgb, var(--semantic-info) 18%, var(--semantic-border-soft))",
    accent: "var(--semantic-info)",
  },
};

export function GuidedRetestCard({
  rec,
}: {
  rec: GuidedRetestRec;
}) {
  const style = RETEST_URGENCY_STYLE[rec.urgency];
  const bandLabel = rec.band ? BAND_LABELS[rec.band] : null;

  return (
    <section aria-label="Retest recommendation">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          When to retest
        </span>
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
      </div>

      <div
        className="flex flex-col gap-4 overflow-hidden rounded-2xl px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: style.surface, border: `1px solid ${style.border}` }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in srgb, ${style.accent} 12%, var(--semantic-surface))`,
              color: style.accent,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <div className="space-y-1.5">
            {bandLabel && (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: `color-mix(in srgb, ${style.accent} 12%, var(--semantic-surface))`,
                  color: style.accent,
                }}
              >
                {bandLabel}
              </span>
            )}
            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
              {rec.urgency === "ready"
                ? "You're exam-ready"
                : rec.urgency === "soon"
                  ? "Retest soon"
                  : "Not ready to retest yet"}
            </p>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
              {rec.message}
            </p>
          </div>
        </div>

        <Link
          href={rec.href}
          className="shrink-0 self-start rounded-full px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 sm:self-center"
          style={{
            background: `color-mix(in srgb, ${style.accent} 12%, var(--semantic-surface))`,
            border: `1px solid color-mix(in srgb, ${style.accent} 30%, transparent)`,
            color: style.accent,
          }}
        >
          {rec.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
