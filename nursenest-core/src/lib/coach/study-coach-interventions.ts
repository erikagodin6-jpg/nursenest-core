import type {
  CoachContextInput,
  CoachFollowUpAction,
  CoachIntervention,
  CoachInterventionSeverity,
  CoachSurface,
  ReadinessScore,
  LearnerPatternSnapshot,
} from "./study-coach-types";

const READINESS_ACTION_THRESHOLD = 48;

function act(label: string, intent: CoachFollowUpAction["intent"]): CoachFollowUpAction {
  return { label, intent };
}

function iv(
  id: string,
  type: string,
  severity: CoachInterventionSeverity,
  title: string,
  message: string,
  recommendedAction: CoachFollowUpAction | null,
  surface: CoachSurface,
): CoachIntervention {
  return {
    id,
    type,
    severity,
    title,
    message,
    recommendedAction,
    surface,
    dedupeKey: `${type}:${id}`,
  };
}

/**
 * Dashboard and report-style interventions from computed learner state.
 */
export function detectDashboardInterventions(
  readiness: ReadinessScore,
  input: CoachContextInput,
  patterns: LearnerPatternSnapshot,
  surface: CoachSurface = "dashboard",
): CoachIntervention[] {
  const out: CoachIntervention[] = [];

  if (readiness.score < READINESS_ACTION_THRESHOLD && readiness.confidence !== "low") {
    out.push(
      iv(
        "readiness_low",
        "readiness_drop",
        "watch",
        "Readiness Snapshot",
        "Signals across practice and weak topics sit below a comfortable band. A short review block on the top priority topic will help most.",
        act("What to Study Next", "what_next"),
        surface,
      ),
    );
  }

  if (patterns.repeatedWeakTopics.length >= 2) {
    out.push(
      iv(
        "cluster_weak",
        "weak_cluster",
        "action",
        "Repeated Misses Detected",
        "The same topic names keep appearing with misses. A focused drill plus one lesson pass usually stabilizes this.",
        act("Focus Areas to Review", "weak_summary"),
        surface,
      ),
    );
  }

  if (input.topicsDeclining.length >= 2) {
    out.push(
      iv(
        "trend_down",
        "performance_trend",
        "watch",
        "Recent Pattern",
        "More topics are trending down than up in the last window. Keep sessions shorter and repeat one weak topic before adding new ones.",
        act("Build a Quick Review", "quick_plan"),
        surface,
      ),
    );
  }

  if (input.daysSinceLastActivity != null && input.daysSinceLastActivity > 7 && input.weakTopicCount >= 2) {
    out.push(
      iv(
        "return_gap",
        "inactivity_weak",
        "info",
        "Welcome Back",
        "Weak topics are still flagged from prior work. Start with one drill set before a longer session.",
        act("What to Study Next", "what_next"),
        surface,
      ),
    );
  }

  return out;
}

export type ReviewInterventionItem = {
  topic: string | null;
  isCorrect: boolean;
  confidence: "high" | "medium" | "low" | null;
};

/**
 * Quiet session-level cues from a single smart review batch (no server fetch).
 */
export function detectReviewSessionInterventions(
  items: ReviewInterventionItem[],
  surface: CoachSurface = "review",
): CoachIntervention[] {
  const out: CoachIntervention[] = [];
  const wrongHigh = items.filter((i) => !i.isCorrect && i.confidence === "high").length;
  if (wrongHigh >= 2) {
    out.push(
      iv(
        "review_wrong_high",
        "confidence_mismatch",
        "watch",
        "High Confidence Misses",
        "Several misses came with high confidence. Slow the next pass and re-read rationales before the next block.",
        act("Focus Areas to Review", "weak_summary"),
        surface,
      ),
    );
  }

  const topicCounts = new Map<string, number>();
  for (const i of items) {
    if (i.isCorrect || !i.topic?.trim()) continue;
    const k = i.topic.trim().toLowerCase();
    topicCounts.set(k, (topicCounts.get(k) ?? 0) + 1);
  }
  for (const [topic, n] of topicCounts) {
    if (n >= 2) {
      out.push(
        iv(
          `repeat_${topic.slice(0, 24)}`,
          "same_topic_misses",
          "action",
          "Repeated Misses Detected",
          `This review batch has multiple misses in the same topic area (${topic}). A short drill on that topic is the next best step.`,
          act("Quiz Me on This", "quiz_concept"),
          surface,
        ),
      );
      break;
    }
  }

  const wrongLowConfFast = items.filter((i) => !i.isCorrect && (i.confidence === "low" || i.confidence == null)).length;
  if (wrongLowConfFast >= 3 && wrongHigh === 0) {
    out.push(
      iv(
        "review_rushed",
        "guessing_pattern",
        "info",
        "Review Pace",
        "Several misses came with low or unset confidence. Mark confidence next time so review can separate guesses from knowledge.",
        null,
        surface,
      ),
    );
  }

  return out;
}

/** Pick the highest severity intervention, then stable order. */
export function rankInterventions(list: CoachIntervention[]): CoachIntervention[] {
  const sev: Record<CoachInterventionSeverity, number> = { action: 0, watch: 1, info: 2 };
  return [...list].sort((a, b) => {
    const d = sev[a.severity] - sev[b.severity];
    if (d !== 0) return d;
    return a.dedupeKey.localeCompare(b.dedupeKey);
  });
}

/** Filter out interventions whose dedupe keys appeared recently (caller supplies keys from storage). */
export function filterInterventionsByCooldown(
  list: CoachIntervention[],
  recentlyShownDedupeKeys: Set<string>,
): CoachIntervention[] {
  return list.filter((i) => !recentlyShownDedupeKeys.has(i.dedupeKey));
}
