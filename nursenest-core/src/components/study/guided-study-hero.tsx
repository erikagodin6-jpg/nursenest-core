/**
 * GuidedStudyHero
 *
 * Full-width --surface-emphasis hero for the Guided Study Mode page.
 *
 * Shows:
 *   - Section label ("Guided Study Mode")
 *   - Personalized greeting based on readiness band + streak
 *   - Readiness score (if available) with band badge
 *   - Quick stat row: accuracy, streak, study goal context
 *   - CTA row leading to the recommended next step
 *
 * Design surface: --surface-emphasis (calm emphasis tint, palette-aware)
 */

import Link from "next/link";
import { BAND_LABELS, BAND_HELPER, ReadinessBandBadge } from "./cat-readiness-hero";
import type { ReadinessBand } from "./cat-readiness-hero";
import type { GuidedStudySignalsReliability, GuidedStudyStep } from "@/lib/study/guided-study-data";

// ── Greeting copy ─────────────────────────────────────────────────────────────

function deriveGreeting(
  band: ReadinessBand | null,
  streakDays: number,
  examFocus: string | null,
  hasEnoughData: boolean,
): { headline: string; subtext: string } {
  if (!hasEnoughData) {
    return {
      headline: "Let's build your study plan",
      subtext:
        "Answer a few practice questions so we can personalize your guided study flow.",
    };
  }

  const exam = examFocus ? ` for ${examFocus}` : "";

  if (band === "exam_ready") {
    return {
      headline: `You're exam-ready${exam}`,
      subtext:
        "Your performance is strong. Use this guide to confirm readiness and plan your exam timing.",
    };
  }
  if (band === "approaching") {
    return {
      headline: `You're close${exam}`,
      subtext:
        "A few targeted moves will push you over the finish line. Here is exactly what to do next.",
    };
  }
  if (band === "building") {
    return {
      headline: streakDays > 3
        ? `Good streak — keep building${exam}`
        : `Building momentum${exam}`,
      subtext:
        "Your foundation is forming. Follow this sequence to strengthen your weak areas efficiently.",
    };
  }
  // not_ready or null
  return {
    headline: `Here is your study roadmap${exam}`,
    subtext:
      "Focus on one step at a time. This guide keeps your study sessions purposeful and calm.",
  };
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-extrabold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

// ── GuidedStudyHero ───────────────────────────────────────────────────────────

export type GuidedStudyHeroProps = {
  readinessScore: number | null;
  readinessBand: ReadinessBand | null;
  streakDays: number;
  overallAccuracyPct: number | null;
  examFocus: string | null;
  studyGoal: string | null;
  dailyStudyMinutes: number | null;
  nextStep: GuidedStudyStep;
  hasEnoughData: boolean;
  criticalLoadFailed?: boolean;
  signalsReliability?: GuidedStudySignalsReliability;
};

export function GuidedStudyHero({
  readinessScore,
  readinessBand,
  streakDays,
  overallAccuracyPct,
  examFocus,
  studyGoal,
  dailyStudyMinutes,
  nextStep,
  hasEnoughData,
  criticalLoadFailed = false,
  signalsReliability,
}: GuidedStudyHeroProps) {
  const greeting = deriveGreeting(readinessBand, streakDays, examFocus, hasEnoughData);
  const headline = criticalLoadFailed ? "We couldn’t load your study signals" : greeting.headline;
  const subtext = criticalLoadFailed
    ? "Refresh to retry. What you see here is not an accurate picture of your progress until data loads."
    : greeting.subtext;

  const analyticsOk = signalsReliability?.analyticsSummary !== false;

  return (
    <div
      className="overflow-hidden rounded-2xl px-6 py-8 sm:px-8"
      style={{
        background: "var(--surface-emphasis, var(--semantic-panel-cool))",
        border: "1px solid var(--semantic-border-soft)",
        boxShadow: "var(--semantic-shadow-soft)",
      }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* ── Left: headline + readiness ──────────────────────────────── */}
        <div className="space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Guided Study Mode
          </p>

          <div className="space-y-1.5">
            <h1
              className="text-2xl font-extrabold leading-snug sm:text-3xl"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {headline}
            </h1>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
              {subtext}
            </p>
          </div>

          {/* Readiness score row */}
          {analyticsOk && readinessScore !== null && readinessBand !== null && (
            <div className="flex items-center gap-3">
              <span
                className="text-4xl font-extrabold tabular-nums"
                style={{ color: "var(--semantic-text-primary)" }}
              >
                {readinessScore}%
              </span>
              <div className="flex flex-col gap-1">
                <ReadinessBandBadge band={readinessBand} />
                <p className="text-[11px] leading-snug" style={{ color: "var(--semantic-text-muted)" }}>
                  {BAND_HELPER[readinessBand]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: stats ─────────────────────────────────────────────── */}
        <div
          className="flex shrink-0 gap-5 rounded-2xl px-5 py-4 sm:flex-col sm:items-center sm:gap-4"
          style={{
            background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          {analyticsOk && overallAccuracyPct !== null && (
            <StatPill
              label="Accuracy"
              value={`${overallAccuracyPct}%`}
              color="var(--semantic-brand)"
            />
          )}
          {analyticsOk && streakDays > 0 && (
            <StatPill
              label="Day streak"
              value={`${streakDays}d`}
              color="var(--semantic-success)"
            />
          )}
          {dailyStudyMinutes && dailyStudyMinutes > 0 ? (
            <StatPill
              label="Daily goal"
              value={`${dailyStudyMinutes}m`}
              color="var(--semantic-info)"
            />
          ) : null}
          {studyGoal && (
            <div className="hidden flex-col items-center gap-0.5 sm:flex">
              <span
                className="max-w-[100px] text-center text-[10px] font-semibold leading-snug"
                style={{ color: "var(--semantic-text-secondary)" }}
              >
                {studyGoal}
              </span>
              <span className="text-[9px]" style={{ color: "var(--semantic-text-muted)" }}>
                Goal
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── CTA row ─────────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={nextStep.href}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: "var(--semantic-brand)",
            color: "var(--semantic-on-brand, white)",
          }}
        >
          {nextStep.ctaLabel} →
        </Link>
        <Link
          href="/app/review"
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: "color-mix(in srgb, var(--semantic-text-muted) 10%, var(--semantic-surface))",
            border: "1px solid var(--semantic-border-soft)",
            color: "var(--semantic-text-secondary)",
          }}
        >
          Review queue
        </Link>
      </div>
    </div>
  );
}
