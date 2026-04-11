/**
 * WeeklyStudyPlanSection
 *
 * Compact weekly view showing current week's focus, priorities, and planned activity.
 * Not a spreadsheet — visually segmented calm cards.
 *
 * Surfaces:
 *   - Section container: soft neutral border card
 *   - Weekly focus card: --surface-soft-a with brand accent
 *   - Weak areas card: --surface-soft-c with warning accent
 *   - Activity summary: --surface-soft-b with info accent
 *
 * Data drawn from AdaptiveLearnerRecommendations (no new DB queries).
 */

import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";

// ── Week focus card ───────────────────────────────────────────────────────────

function WeekFocusCard({
  trajectory,
  weeklyPriorities,
}: {
  trajectory: AdaptiveLearnerRecommendations["trajectory"];
  weeklyPriorities: string[];
}) {
  const trajectoryLabel: Record<AdaptiveLearnerRecommendations["trajectory"], string> = {
    building_foundation: "Building your foundation",
    improving: "Continuing improvement",
    on_track: "On track — staying consistent",
    needs_focused_review: "Focused remediation week",
    final_review: "Final exam preparation",
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background:
          "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 5%, var(--bg-page)))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 15%, transparent)",
      }}
    >
      <p
        className="mb-1 text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        This week's focus
      </p>
      <p
        className="mb-2 text-sm font-bold"
        style={{ color: "var(--semantic-brand)" }}
      >
        {trajectoryLabel[trajectory]}
      </p>
      {weeklyPriorities.length > 0 && (
        <ul className="space-y-1">
          {weeklyPriorities.slice(0, 3).map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: "var(--semantic-brand)" }} aria-hidden="true">·</span>
              <span
                className="text-xs leading-relaxed"
                style={{ color: "var(--semantic-text-secondary)" }}
              >
                {p}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Weak areas card ───────────────────────────────────────────────────────────

function WeakAreasCard({ weakTop3 }: { weakTop3: string[] }) {
  if (weakTop3.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background:
          "var(--surface-soft-c, color-mix(in srgb, var(--semantic-warning) 5%, var(--bg-page)))",
        border: "1px solid color-mix(in srgb, var(--semantic-warning) 18%, transparent)",
      }}
    >
      <p
        className="mb-2 text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Weak areas to target
      </p>
      <div className="flex flex-wrap gap-2">
        {weakTop3.map((topic, i) => (
          <span
            key={i}
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
              color: "var(--semantic-warning)",
              border:
                "1px solid color-mix(in srgb, var(--semantic-warning) 22%, transparent)",
            }}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Activity summary card ─────────────────────────────────────────────────────

function ActivitySummaryCard({
  planTrack,
  daysUntilExam,
}: {
  planTrack: AdaptiveLearnerRecommendations["planTrack"];
  daysUntilExam: number | null;
}) {
  // Derive week's recommended activity from planTrack status
  // PlanTrackStatus: "on_track" | "slightly_behind" | "at_risk" | "overdue"
  type PlanStatus = AdaptiveLearnerRecommendations["planTrack"]["status"];

  const activityHints: Record<PlanStatus, string[]> = {
    on_track: ["3–4 practice sessions", "1 CAT check-in", "Review due weak areas"],
    slightly_behind: ["4–5 practice sessions", "Prioritise weak-area drills", "1–2 CAT sessions"],
    at_risk: [
      "Practice daily",
      "Focus on top 3 weak topics",
      "2 CAT sessions this week",
    ],
    overdue: [
      "Focused weak-area drills daily",
      "2–3 CAT sessions",
      "Prioritise remediation over new lessons",
    ],
  };

  const hints = activityHints[planTrack.status] ?? [
    "Practice consistently",
    "Review weak areas",
    "1 CAT session",
  ];

  const examContext =
    daysUntilExam !== null && daysUntilExam <= 14
      ? "Exam very close — final stretch mode."
      : daysUntilExam !== null && daysUntilExam <= 28
        ? "Less than 4 weeks to exam."
        : null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background:
          "var(--surface-soft-b, color-mix(in srgb, var(--theme-secondary, var(--theme-primary)) 5%, var(--bg-page)))",
        border: "1px solid color-mix(in srgb, var(--semantic-info) 15%, transparent)",
      }}
    >
      <p
        className="mb-2 text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Recommended activity
      </p>
      {examContext && (
        <p
          className="mb-2 text-xs font-semibold"
          style={{ color: "var(--semantic-warning)" }}
        >
          {examContext}
        </p>
      )}
      <ul className="space-y-1.5">
        {hints.map((hint, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-info) 14%, var(--semantic-surface))",
                color: "var(--semantic-info)",
              }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {hint}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── WeeklyStudyPlanSection ────────────────────────────────────────────────────

export type WeeklyStudyPlanSectionProps = {
  adaptive: Pick<
    AdaptiveLearnerRecommendations,
    "trajectory" | "weeklyPriorities" | "weakTop3" | "planTrack"
  >;
  daysUntilExam: number | null;
};

export function WeeklyStudyPlanSection({
  adaptive,
  daysUntilExam,
}: WeeklyStudyPlanSectionProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid var(--semantic-border-soft)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--semantic-border-soft)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          This week
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Weekly study framework
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <WeekFocusCard
          trajectory={adaptive.trajectory}
          weeklyPriorities={adaptive.weeklyPriorities}
        />

        {adaptive.weakTop3.length > 0 && (
          <WeakAreasCard weakTop3={adaptive.weakTop3} />
        )}

        <ActivitySummaryCard
          planTrack={adaptive.planTrack}
          daysUntilExam={daysUntilExam}
        />
      </div>
    </div>
  );
}
