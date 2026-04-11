"use client";

/**
 * ExamCountdownHero
 *
 * Premium, visually integrated exam countdown component.
 * NOT a generic widget — designed to feel like a living part of the learner's plan.
 *
 * Layout:
 *   Left panel  — Arc countdown ring with days remaining, date, urgency states
 *   Right panel — Plan-track status card, milestones, exam date editor trigger
 *
 * Visual states:
 *   far          → calm brand-accent ring — building momentum
 *   moderate     → info-accent — steady progress
 *   near         → warning-accent — focus mode
 *   final_stretch→ danger-accent — peak intensity (supportive, not alarming)
 *   no_date      → neutral muted — invite to set date
 *
 * Client component for ring animation on mount and exam date editor interop.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Circle, Pencil } from "lucide-react";
import type { PlanTrackAssessment, ExamPlanMilestone } from "@/lib/learner/exam-plan-engine";

// ── Types ─────────────────────────────────────────────────────────────────────

type ExamUrgency = "far" | "moderate" | "near" | "final_stretch" | "no_date";

interface ExamCountdownHeroProps {
  daysUntilExam: number | null;
  examDate: string | null;
  /** Total study window in days (from when user started / created account). */
  totalStudyDays?: number;
  planTrack: PlanTrackAssessment;
  milestones: ExamPlanMilestone[];
  onEditDate?: () => void;
}

// ── Urgency helpers ───────────────────────────────────────────────────────────

function classifyUrgency(days: number | null, examDate: string | null): ExamUrgency {
  if (!examDate) return "no_date";
  if (days === null || days < 0) return "no_date";
  if (days <= 7) return "final_stretch";
  if (days <= 21) return "near";
  if (days <= 60) return "moderate";
  return "far";
}

const URGENCY_ACCENT: Record<ExamUrgency, string> = {
  far:            "var(--accent-primary)",
  moderate:       "var(--semantic-info)",
  near:           "var(--semantic-warning)",
  final_stretch:  "var(--semantic-danger)",
  no_date:        "var(--semantic-text-muted)",
};

const URGENCY_SURFACE: Record<ExamUrgency, string> = {
  far:            "color-mix(in srgb, var(--accent-primary) 8%, var(--bg-card))",
  moderate:       "color-mix(in srgb, var(--semantic-info) 8%, var(--bg-card))",
  near:           "color-mix(in srgb, var(--semantic-warning) 8%, var(--bg-card))",
  final_stretch:  "color-mix(in srgb, var(--semantic-danger) 8%, var(--bg-card))",
  no_date:        "var(--bg-card)",
};

const URGENCY_BORDER: Record<ExamUrgency, string> = {
  far:            "color-mix(in srgb, var(--accent-primary) 20%, var(--border-subtle))",
  moderate:       "color-mix(in srgb, var(--semantic-info) 20%, var(--border-subtle))",
  near:           "color-mix(in srgb, var(--semantic-warning) 20%, var(--border-subtle))",
  final_stretch:  "color-mix(in srgb, var(--semantic-danger) 22%, var(--border-subtle))",
  no_date:        "var(--border-subtle)",
};

const URGENCY_LABEL: Record<ExamUrgency, string> = {
  far:            "Building momentum",
  moderate:       "Steady progress",
  near:           "Focus mode",
  final_stretch:  "Final stretch",
  no_date:        "Set your exam date",
};

// ── Status pill ───────────────────────────────────────────────────────────────

type TrackStatus = PlanTrackAssessment["status"];

const TRACK_COLOR: Record<TrackStatus, string> = {
  on_track:       "var(--semantic-success)",
  slightly_behind:"var(--semantic-warning)",
  at_risk:        "var(--semantic-danger)",
  overdue:        "var(--semantic-text-muted)",
};

const TRACK_ICON_BG: Record<TrackStatus, string> = {
  on_track:       "color-mix(in srgb, var(--semantic-success) 12%, var(--bg-card))",
  slightly_behind:"color-mix(in srgb, var(--semantic-warning) 12%, var(--bg-card))",
  at_risk:        "color-mix(in srgb, var(--semantic-danger) 12%, var(--bg-card))",
  overdue:        "color-mix(in srgb, var(--semantic-text-muted) 10%, var(--bg-card))",
};

function StatusPill({ track }: { track: PlanTrackAssessment }) {
  const color = TRACK_COLOR[track.status];
  const bg = TRACK_ICON_BG[track.status];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 12px 6px 8px",
        borderRadius: 99,
        background: bg,
        border: `1px solid color-mix(in srgb, ${color} 25%, var(--border-subtle))`,
        width: "fit-content",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 6px color-mix(in srgb, ${color} 60%, transparent)`,
        }}
      />
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color,
          letterSpacing: "0.01em",
        }}
      >
        {track.label}
      </span>
    </div>
  );
}

// ── SVG countdown ring ────────────────────────────────────────────────────────

interface CountdownRingProps {
  days: number | null;
  totalDays: number;
  accent: string;
  urgency: ExamUrgency;
}

function CountdownRing({ days, totalDays, accent, urgency }: CountdownRingProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const SIZE = 168;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE * 0.42;
  const circ = 2 * Math.PI * r;
  const arcFrac = 0.8; // 288° arc
  const maxDash = circ * arcFrac;
  const pct = days != null && totalDays > 0 ? Math.max(0, Math.min(1, days / totalDays)) : 0;
  const dash = animated ? maxDash * pct : 0;
  const startAngle = 126; // bottom-left start

  // Track
  const trackColor = urgency === "no_date"
    ? "color-mix(in srgb, var(--border-subtle) 50%, transparent)"
    : `color-mix(in srgb, ${accent} 10%, var(--border-subtle))`;

  // Days label
  const daysLabel = days === null || days < 0
    ? "—"
    : days === 0
      ? "Today"
      : days === 1
        ? "1"
        : String(days);

  const daysSubLabel = days === null ? "No date set"
    : days === 0 ? "Exam day"
    : days === 1 ? "day left"
    : "days left";

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        {/* Outer glow ring (decorative) */}
        {urgency !== "no_date" && (
          <circle
            cx={cx} cy={cy} r={r + 12}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            strokeOpacity={0.08}
          />
        )}
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={14}
          strokeDasharray={`${maxDash} ${circ - maxDash}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={accent}
          strokeWidth={14}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{
            transition: "stroke-dasharray 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        />
      </svg>
      {/* Center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontSize: days === 0 ? "1.1rem" : days != null && days > 99 ? "2rem" : "2.6rem",
            fontWeight: 900,
            lineHeight: 1,
            color: accent,
            letterSpacing: "-0.03em",
          }}
        >
          {daysLabel}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "var(--semantic-text-muted)",
            letterSpacing: "0.01em",
          }}
        >
          {daysSubLabel}
        </span>
      </div>
    </div>
  );
}

// ── Milestone row ─────────────────────────────────────────────────────────────

function MilestoneRow({ milestone }: { milestone: ExamPlanMilestone }) {
  const Icon = milestone.complete ? CheckCircle2 : Circle;
  const color = milestone.complete ? "var(--semantic-success)" : "var(--semantic-text-muted)";

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Icon
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color }}
        aria-hidden
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          href={milestone.href}
          style={{
            fontSize: "0.8125rem",
            fontWeight: milestone.complete ? 500 : 700,
            color: milestone.complete
              ? "var(--semantic-text-muted)"
              : "var(--theme-body-text, var(--semantic-text-primary))",
            textDecoration: "none",
            lineHeight: 1.35,
            display: "block",
          }}
        >
          {milestone.title}
        </Link>
        {!milestone.complete && (
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--semantic-text-muted)",
              lineHeight: 1.4,
              marginTop: 1,
            }}
          >
            {milestone.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Date display ──────────────────────────────────────────────────────────────

function formatExamDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ── Main component ────────────────────────────────────────────────────────────

export function ExamCountdownHero({
  daysUntilExam,
  examDate,
  totalStudyDays = 120,
  planTrack,
  milestones,
  onEditDate,
}: ExamCountdownHeroProps) {
  const urgency = classifyUrgency(daysUntilExam, examDate);
  const accent = URGENCY_ACCENT[urgency];
  const surface = URGENCY_SURFACE[urgency];
  const border = URGENCY_BORDER[urgency];
  const urgencyLabel = URGENCY_LABEL[urgency];

  const completedMilestones = milestones.filter((m) => m.complete).length;
  const totalMilestones = milestones.length;

  return (
    <div
      style={{
        borderRadius: "1.25rem",
        background: surface,
        border: `1px solid ${border}`,
        boxShadow: "var(--shadow-elevated, 0 4px 24px rgb(0 0 0 / 0.06))",
        overflow: "hidden",
        position: "relative",
      }}
      aria-label="Exam countdown"
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 3,
          background: urgency !== "no_date"
            ? `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 40%, transparent))`
            : "var(--border-subtle)",
        }}
        aria-hidden
      />

      {/* Radial glow decoration */}
      {urgency !== "no_date" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, color-mix(in srgb, ${accent} 15%, transparent), transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          padding: "clamp(1.25rem, 3vw, 2rem)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(1.25rem, 3vw, 2rem)",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        {/* ── Left panel: ring + urgency label ─────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.875rem",
            flexShrink: 0,
          }}
        >
          <CountdownRing
            days={daysUntilExam}
            totalDays={totalStudyDays}
            accent={accent}
            urgency={urgency}
          />

          {/* Urgency phase label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: accent,
              }}
            >
              {urgencyLabel}
            </span>
            {examDate && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--semantic-text-muted)",
                  textAlign: "center",
                  maxWidth: "16ch",
                  lineHeight: 1.4,
                }}
              >
                {formatExamDate(examDate)}
              </span>
            )}
          </div>

          {/* Edit / Add date CTA */}
          {onEditDate ? (
            <button
              onClick={onEditDate}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 99,
                border: `1px solid color-mix(in srgb, ${accent} 25%, var(--border-subtle))`,
                background: `color-mix(in srgb, ${accent} 8%, var(--bg-card))`,
                color: accent,
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Pencil className="h-3 w-3" aria-hidden />
              {examDate ? "Edit date" : "Add exam date"}
            </button>
          ) : (
            <Link
              href="/app/exam-plan#exam-date"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 99,
                border: `1px solid color-mix(in srgb, ${accent} 25%, var(--border-subtle))`,
                background: `color-mix(in srgb, ${accent} 8%, var(--bg-card))`,
                color: accent,
                fontSize: "0.75rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <CalendarDays className="h-3 w-3" aria-hidden />
              {examDate ? "Edit date" : "Add exam date"}
            </Link>
          )}
        </div>

        {/* ── Right panel: status + milestones ─────────────────────────── */}
        <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Plan track status */}
          <div>
            <StatusPill track={planTrack} />
            <p
              style={{
                marginTop: "0.625rem",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--theme-heading-text, var(--semantic-text-primary))",
                lineHeight: 1.3,
              }}
            >
              {planTrack.headline}
            </p>
            {planTrack.detail && (
              <p
                style={{
                  marginTop: "0.375rem",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: "var(--semantic-text-muted)",
                }}
              >
                {planTrack.detail}
              </p>
            )}
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div
              style={{
                borderTop: `1px solid color-mix(in srgb, ${accent} 12%, var(--border-subtle))`,
                paddingTop: "0.875rem",
              }}
            >
              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--semantic-text-muted)",
                  }}
                >
                  Milestones
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {completedMilestones}/{totalMilestones}
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  borderRadius: 99,
                  background: `color-mix(in srgb, ${accent} 12%, var(--border-subtle))`,
                  marginBottom: "0.875rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: totalMilestones > 0
                      ? `${Math.round((completedMilestones / totalMilestones) * 100)}%`
                      : "0%",
                    background: accent,
                    borderRadius: 99,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>

              {/* Milestone list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {milestones.slice(0, 4).map((m) => (
                  <MilestoneRow key={m.id} milestone={m} />
                ))}
              </div>
            </div>
          )}

          {/* No date prompt */}
          {urgency === "no_date" && (
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "0.875rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "var(--semantic-text-muted)",
                }}
              >
                Adding your exam date unlocks a personalised weekly plan, pacing targets, and
                adaptive recommendations tuned to your specific timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
