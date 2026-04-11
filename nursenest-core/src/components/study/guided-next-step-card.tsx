/**
 * GuidedNextStepCard
 *
 * The primary "do this now" card — visually the most prominent element
 * on the Guided Study Mode page after the hero.
 *
 * Shows:
 *   - "Your best next step" label
 *   - Step kind icon + badge
 *   - Title (what to do)
 *   - Why it matters (one sentence)
 *   - Full-width CTA button
 *
 * Design surface:
 *   - High urgency:   --surface-soft-c (info/warning cool tint) with warning accent
 *   - Medium urgency: --surface-soft-a (brand tint) with brand accent
 *   - Low urgency:    --surface-soft-b (success tint) with success accent
 */

import Link from "next/link";
import type { GuidedStudyStep, GuidedStepKind } from "@/lib/study/guided-study-data";

// ── Step kind metadata ────────────────────────────────────────────────────────

type KindMeta = {
  label: string;
  icon: React.ReactNode;
};

function kindMeta(kind: GuidedStepKind): KindMeta {
  const icons: Record<GuidedStepKind, KindMeta> = {
    lesson: {
      label: "Lesson",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    questions: {
      label: "Practice",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    review: {
      label: "Review",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.4" />
        </svg>
      ),
    },
    retest: {
      label: "CAT Exam",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    baseline: {
      label: "Get started",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 8 16 12 12 16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
  };
  return icons[kind];
}

// ── Surface + accent colors per urgency ───────────────────────────────────────

type UrgencyStyle = {
  surface: string;
  border: string;
  accentColor: string;
  badgeBg: string;
  badgeColor: string;
  btnBg: string;
  btnColor: string;
  stripeBg: string;
};

function urgencyStyle(urgency: GuidedStudyStep["urgency"]): UrgencyStyle {
  switch (urgency) {
    case "high":
      return {
        surface: "var(--surface-soft-c, color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card)))",
        border: "color-mix(in srgb, var(--semantic-warning) 30%, var(--semantic-border-soft))",
        accentColor: "var(--semantic-warning)",
        badgeBg: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
        badgeColor: "var(--semantic-warning)",
        btnBg: "var(--semantic-warning)",
        btnColor: "white",
        stripeBg: "var(--semantic-warning)",
      };
    case "medium":
      return {
        surface: "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
        border: "color-mix(in srgb, var(--semantic-brand) 25%, var(--semantic-border-soft))",
        accentColor: "var(--semantic-brand)",
        badgeBg: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
        badgeColor: "var(--semantic-brand)",
        btnBg: "var(--semantic-brand)",
        btnColor: "var(--semantic-on-brand, white)",
        stripeBg: "var(--semantic-brand)",
      };
    case "low":
      return {
        surface: "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
        border: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
        accentColor: "var(--semantic-success)",
        badgeBg: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
        badgeColor: "var(--semantic-success)",
        btnBg: "var(--semantic-success)",
        btnColor: "white",
        stripeBg: "var(--semantic-success)",
      };
  }
}

// ── GuidedNextStepCard ────────────────────────────────────────────────────────

export function GuidedNextStepCard({ step }: { step: GuidedStudyStep }) {
  const meta = kindMeta(step.kind);
  const style = urgencyStyle(step.urgency);

  return (
    <section aria-label="Your best next step">
      {/* Section label */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-px flex-1"
          style={{ background: "var(--semantic-border-soft)" }}
        />
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Your best next step
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "var(--semantic-border-soft)" }}
        />
      </div>

      {/* Card */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ background: style.surface, border: `1px solid ${style.border}` }}
      >
        <div className="flex min-h-[130px]">
          {/* Left accent stripe */}
          <div
            className="w-1.5 shrink-0"
            style={{ background: style.stripeBg }}
            aria-hidden
          />

          <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center">
            {/* Icon + kind badge */}
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: style.badgeBg,
                  color: style.accentColor,
                }}
              >
                {meta.icon}
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ background: style.badgeBg, color: style.accentColor }}
              >
                {meta.label}
              </span>
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col gap-1.5">
              <h2
                className="text-lg font-extrabold leading-snug"
                style={{ color: "var(--semantic-text-primary)" }}
              >
                {step.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
                {step.why}
              </p>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link
                href={step.href}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
                style={{ background: style.btnBg, color: style.btnColor }}
              >
                {step.ctaLabel} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
