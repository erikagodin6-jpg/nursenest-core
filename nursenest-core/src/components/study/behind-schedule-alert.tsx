/**
 * BehindScheduleAlert
 *
 * Shown when the plan tracking assessment detects the user is behind.
 * Surfaces exact recovery guidance and the impact of the delay.
 *
 * Server component.
 */

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { PlanTrackAssessment, RecoveryRecommendation } from "@/lib/learner/exam-plan-engine";

interface BehindScheduleAlertProps {
  assessment: PlanTrackAssessment;
  recoveryRecommendations?: RecoveryRecommendation[];
}

export function BehindScheduleAlert({ assessment, recoveryRecommendations }: BehindScheduleAlertProps) {
  if (assessment.status === "on_track") return null;

  const isCritical = assessment.status === "at_risk" || assessment.status === "overdue";

  const accentColor = isCritical
    ? "var(--semantic-danger)"
    : "var(--semantic-warning)";

  const heading = assessment.headline;
  const subtext = assessment.detail ?? (
    isCritical
      ? "At your current pace, there may not be enough time to cover all required content before your exam."
      : "This week you've studied less than your target. Catching up now prevents bigger gaps later."
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        borderRadius: "1rem",
        border: `1.5px solid color-mix(in srgb, ${accentColor} 28%, var(--border-subtle))`,
        background: `color-mix(in srgb, ${accentColor} 6%, var(--bg-card))`,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Header stripe */}
      <div
        style={{
          height: 4,
          background: accentColor,
        }}
      />

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <AlertTriangle
            className="h-5 w-5 mt-0.5"
            style={{ color: accentColor, flexShrink: 0 }}
            aria-hidden
          />
          <div>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--theme-heading-text, var(--semantic-text-primary))",
                marginBottom: 4,
              }}
            >
              {heading}
            </p>
            <p
              style={{
                fontSize: "0.8125rem",
                lineHeight: 1.6,
                color: "var(--theme-body-text, var(--semantic-text-secondary))",
              }}
            >
              {subtext}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: 99,
            background: `color-mix(in srgb, ${accentColor} 10%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, ${accentColor} 22%, var(--border-subtle))`,
            fontSize: "0.6875rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: accentColor,
            width: "fit-content",
          }}
        >
          {assessment.label}
        </div>

        {/* Recovery recommendation list */}
        {recoveryRecommendations && recoveryRecommendations.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {recoveryRecommendations.slice(0, 3).map((rec) => (
              <li
                key={rec.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    marginTop: 5,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: accentColor,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--theme-body-text, var(--semantic-text-primary))",
                      lineHeight: 1.4,
                    }}
                  >
                    {rec.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--semantic-text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {rec.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href="/app/questions?studyMode=weak"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: "0.625rem",
              border: "none",
              background: accentColor,
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Start catch-up session
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href="/app/exam-plan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 14px",
              borderRadius: "0.625rem",
              border: `1px solid color-mix(in srgb, ${accentColor} 28%, var(--border-subtle))`,
              background: "transparent",
              color: accentColor,
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View exam plan
          </Link>
        </div>
      </div>
    </div>
  );
}
