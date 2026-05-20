/**
 * AdaptiveCoachSummary
 *
 * 1–2 sentence coach interpretation, rendered as a calm, premium pill card.
 *
 * Rules (per spec §7):
 *   - 1–2 short sentences only
 *   - No long generic motivational paragraphs
 *   - No fake certainty
 *   - No exaggerated claims
 *
 * Surface: soft brand tint (calm, interpretive, not alarm-like)
 */

import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";

function buildCoachSummary(args: {
  adaptive: Pick<AdaptiveLearnerRecommendations, "trajectory" | "trajectoryLines" | "readinessTimelineLine">;
  passReadiness: PassReadinessForecast;
  daysUntilExam: number | null;
}): string {
  const { adaptive, passReadiness, daysUntilExam } = args;

  // If exam is close, use timeline context
  if (daysUntilExam !== null && daysUntilExam <= 21) {
    return `Your exam is close, so this plan shifts toward practice, review, and CAT repetition. ${passReadiness.limitingFactor ? `Focus most on: ${passReadiness.limitingFactor}.` : "Stay consistent and targeted."}`;
  }

  // Use trajectoryLines if available
  if (adaptive.trajectoryLines.length > 0) {
    const line = adaptive.trajectoryLines[0]!;
    // Trim to 1–2 sentences max
    const sentences = line.split(/[.!?]+/).filter(Boolean);
    return sentences.slice(0, 2).join(". ") + (sentences.length > 0 ? "." : "");
  }

  // Fallback to readiness timeline copy
  if (adaptive.readinessTimelineLine) {
    return adaptive.readinessTimelineLine;
  }

  // Generic fallback based on trajectory
  switch (adaptive.trajectory) {
    case "building_foundation":
      return "Focus is on building your foundation through lessons and consistent practice.";
    case "improving":
      return "Trajectory is improving. Keep addressing weak areas to maintain momentum.";
    case "on_track":
      return "You are on track. Continue with targeted practice and periodic CAT check-ins.";
    case "needs_focused_review":
      return "Weak areas are limiting readiness. Focused review sessions will have the most impact.";
    case "final_review":
      return "Entering final review phase. Prioritise weak areas, practice, and exam-style questions.";
    default:
      return "Keep studying consistently and review your weak areas to improve readiness.";
  }
}

export function AdaptiveCoachSummary({
  adaptive,
  passReadiness,
  daysUntilExam,
}: {
  adaptive: AdaptiveLearnerRecommendations;
  passReadiness: PassReadinessForecast;
  daysUntilExam: number | null;
}) {
  const text = buildCoachSummary({ adaptive, passReadiness, daysUntilExam });

  return (
    <div
      className="flex items-start gap-3 rounded-2xl px-5 py-4"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-brand) 7%, var(--bg-page, var(--semantic-surface)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
      }}
    >
      {/* Coach icon */}
      <div
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
          color: "var(--semantic-brand)",
        }}
        aria-hidden="true"
      >
        ✦
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--semantic-text-secondary)" }}
      >
        {text}
      </p>
    </div>
  );
}
