/**
 * AdaptiveEngineHero
 *
 * Hero section for the /app/study-coach page.
 * Shows: readiness gauge, exam countdown, trajectory, key metrics, CTAs.
 */

import Link from "next/link";
import { BookOpen, ClipboardList, Target } from "lucide-react";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";
import type { StudyTimeBudget } from "@/lib/study/adaptive-engine/study-time-budget";
import { StudyReadinessGauge } from "./study-readiness-gauge";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdaptiveEngineHeroProps {
  coach: CoachPageData;
  passReadiness: PassReadinessForecast;
  timeBudget: StudyTimeBudget;
}

// ── Band mapping ──────────────────────────────────────────────────────────────

function forecastBandToGaugeBand(
  band: PassReadinessForecast["band"],
): "insufficient" | "early" | "building" | "strong" {
  if (band === "strong") return "strong";
  if (band === "building") return "building";
  if (band === "early") return "early";
  return "insufficient";
}

// ── Adaptive subtitle ─────────────────────────────────────────────────────────

function buildSubtitle(coach: CoachPageData): string {
  if (coach.daysUntilExam !== null && coach.daysUntilExam <= 14) {
    return "Final stretch — your plan emphasises practice, review, and targeted weak-area work.";
  }
  if (coach.daysUntilExam !== null && coach.daysUntilExam <= 42) {
    return "Exam is near. Your plan is shifting toward higher-volume practice and weak-area closure.";
  }
  if (coach.weakTop3.length > 0) {
    return `Your personalised plan targets ${coach.weakTop3.slice(0, 2).join(" and ")} — the topics most limiting your readiness right now.`;
  }
  return "Your plan updates automatically after every quiz, CAT, and lesson assessment.";
}

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        padding: "10px 16px",
        borderRadius: "0.75rem",
        background: `color-mix(in srgb, ${color} 10%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${color} 22%, var(--border-subtle))`,
        minWidth: 100,
      }}
    >
      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--semantic-text-muted)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "1rem",
          fontWeight: 800,
          color,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdaptiveEngineHero({ coach, passReadiness, timeBudget }: AdaptiveEngineHeroProps) {
  const { readiness, daysUntilExam, streakDays, overallAccuracyPct } = coach;
  const gaugeBand = forecastBandToGaugeBand(passReadiness.band);
  const subtitle = buildSubtitle(coach);

  const countdownLabel =
    daysUntilExam !== null
      ? daysUntilExam === 0
        ? "Exam today"
        : `${daysUntilExam}d to exam`
      : "No exam date";

  const accuracyLabel =
    overallAccuracyPct !== null ? `${overallAccuracyPct}% accuracy` : "No data yet";

  const todayLabel = `${timeBudget.daily.totalMinutes} min today`;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "1.25rem",
        overflow: "hidden",
        background: `color-mix(in srgb, var(--accent-primary) 8%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, var(--accent-primary) 18%, var(--border-subtle))`,
        boxShadow: "var(--shadow-elevated)",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
      }}
      aria-label="Study Coach overview"
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 90% 20%, color-mix(in srgb, var(--accent-primary) 8%, transparent), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div style={{ position: "relative" }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* Left: text */}
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--accent-primary)",
                marginBottom: "0.5rem",
              }}
            >
              Adaptive Study Coach
            </p>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--theme-heading-text, var(--semantic-text-primary))",
                marginBottom: "0.75rem",
              }}
            >
              Your Study Plan,
              <br />
              <span style={{ color: "var(--accent-primary)" }}>Always Current</span>
            </h1>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--theme-body-text, var(--semantic-text-secondary))",
                maxWidth: "38ch",
              }}
            >
              {subtitle}
            </p>

            {/* Stat chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
                marginTop: "1.25rem",
              }}
            >
              <StatChip
                label="Exam"
                value={countdownLabel}
                color="var(--accent-primary)"
              />
              <StatChip
                label="Accuracy"
                value={accuracyLabel}
                color="var(--semantic-info)"
              />
              <StatChip
                label="Streak"
                value={streakDays > 0 ? `${streakDays}d` : "Start today"}
                color="var(--semantic-success)"
              />
              <StatChip
                label="Today"
                value={todayLabel}
                color="var(--semantic-warning)"
              />
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
                marginTop: "1.5rem",
              }}
            >
              <Link
                href="/app/questions?studyMode=weak"
                className="nn-btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minHeight: "2.5rem",
                  borderRadius: "0.625rem",
                  padding: "0 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <Target className="h-4 w-4" aria-hidden />
                Start today&apos;s plan
              </Link>
              <Link
                href="/app/lessons"
                className="nn-btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minHeight: "2.5rem",
                  borderRadius: "0.625rem",
                  padding: "0 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                Lessons
              </Link>
              <Link
                href="/app/exam-plan"
                className="nn-btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minHeight: "2.5rem",
                  borderRadius: "0.625rem",
                  padding: "0 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <ClipboardList className="h-4 w-4" aria-hidden />
                Exam plan
              </Link>
            </div>
          </div>

          {/* Right: gauge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <StudyReadinessGauge
              score={readiness.score}
              forecast={passReadiness.displayRange}
              band={gaugeBand}
              size={148}
            />
            <p
              style={{
                fontSize: "0.6875rem",
                textAlign: "center",
                color: "var(--semantic-text-muted)",
                maxWidth: "15ch",
              }}
            >
              Readiness score
              <br />
              (forecast: {passReadiness.displayRange ?? "building…"})
            </p>
          </div>
        </div>

        {/* Interpretation line */}
        {passReadiness.interpretation && (
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: "var(--semantic-text-muted)",
              borderTop: `1px solid color-mix(in srgb, var(--accent-primary) 14%, var(--border-subtle))`,
              paddingTop: "1rem",
              maxWidth: "65ch",
            }}
          >
            {passReadiness.interpretation}
          </p>
        )}
      </div>
    </div>
  );
}
