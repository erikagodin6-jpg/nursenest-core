"use client";

import { CheckCircle2, TrendingUp, Compass } from "lucide-react";
import type { SessionFeedback } from "@/lib/learner/session-feedback";

const TONE_CONFIG = {
  positive: {
    icon: TrendingUp,
    accentVar: "--semantic-success",
    bgClass: "nn-session-feedback--positive",
  },
  neutral: {
    icon: CheckCircle2,
    accentVar: "--semantic-info",
    bgClass: "nn-session-feedback--neutral",
  },
  guidance: {
    icon: Compass,
    accentVar: "--semantic-brand",
    bgClass: "nn-session-feedback--guidance",
  },
} as const;

/**
 * Renders a single session feedback message. Calm, minimal, no confetti.
 * Designed to sit at the top of post-session results or inline on the dashboard.
 */
export function SessionFeedbackStrip({
  feedback,
}: {
  feedback: SessionFeedback;
}) {
  const config = TONE_CONFIG[feedback.tone];
  const Icon = config.icon;

  return (
    <div className={`nn-session-feedback ${config.bgClass}`}>
      <div
        className="nn-session-feedback__icon"
        style={{
          color: `var(${config.accentVar})`,
          background: `color-mix(in srgb, var(${config.accentVar}) 10%, var(--semantic-surface))`,
        }}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="nn-session-feedback__text">
        <p className="nn-session-feedback__primary">{feedback.primary}</p>
        {feedback.secondary ? (
          <p className="nn-session-feedback__secondary">{feedback.secondary}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Renders multiple feedback lines as a compact list.
 * For richer surfaces like the dashboard momentum section.
 */
export function SessionFeedbackList({
  lines,
}: {
  lines: string[];
}) {
  if (lines.length === 0) return null;

  return (
    <ul className="nn-session-feedback-list">
      {lines.map((line) => (
        <li key={line} className="nn-session-feedback-list__item">
          <CheckCircle2
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            style={{ color: "var(--semantic-success)" }}
            aria-hidden
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
