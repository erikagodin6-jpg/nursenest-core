import "server-only";

/**
 * Session feedback engine.
 *
 * Generates contextual micro-win messages from a learner's recent session data.
 * Messages are short, calm, and specific. No hype, no exclamation overload,
 * no generic praise. Each message references something the learner actually did.
 *
 * Psychology: progress visibility + competence signaling + next-step clarity.
 */

export interface SessionFeedbackInput {
  /** Number of questions answered this session */
  questionsAnswered: number;
  /** Number correct */
  correctCount: number;
  /** Topics where accuracy improved vs prior data */
  improvedTopics: string[];
  /** Topics where the learner was strong (>75% accuracy, 5+ attempts) */
  strongTopics: string[];
  /** Topics flagged as weak */
  weakTopics: string[];
  /** Whether high-confidence errors were corrected (reviewed) */
  reviewedOverconfidentErrors: boolean;
  /** Current streak days */
  streakDays: number;
  /** Whether today's daily goal was completed */
  dailyGoalComplete: boolean;
  /** Readiness band if available */
  readinessBand: string | null;
  /** Previous session accuracy if available (for comparison) */
  previousAccuracyPct: number | null;
  /** Current session accuracy */
  currentAccuracyPct: number | null;
}

export interface SessionFeedback {
  /** Primary feedback line (always present) */
  primary: string;
  /** Optional secondary line with guidance */
  secondary: string | null;
  /** Tone for styling */
  tone: "positive" | "neutral" | "guidance";
}

/**
 * Generate a single, focused feedback message for the learner.
 * Priority order: improvement > strength > streak > completion > guidance.
 */
export function generateSessionFeedback(input: SessionFeedbackInput): SessionFeedback {
  // 1. Topic improvement (strongest signal)
  if (input.improvedTopics.length > 0) {
    const topic = input.improvedTopics[0]!;
    return {
      primary: `You improved in ${topic} this session.`,
      secondary:
        input.improvedTopics.length > 1
          ? `Also trending up: ${input.improvedTopics.slice(1, 3).join(", ")}.`
          : null,
      tone: "positive",
    };
  }

  // 2. Accuracy improvement vs last session
  if (
    input.currentAccuracyPct != null &&
    input.previousAccuracyPct != null &&
    input.currentAccuracyPct > input.previousAccuracyPct
  ) {
    const delta = input.currentAccuracyPct - input.previousAccuracyPct;
    return {
      primary: `Your accuracy went up ${delta} points since your last session.`,
      secondary: null,
      tone: "positive",
    };
  }

  // 3. Reviewed overconfident errors
  if (input.reviewedOverconfidentErrors) {
    return {
      primary: "You reviewed high-priority mistakes. That is the fastest way to improve.",
      secondary: null,
      tone: "positive",
    };
  }

  // 4. Strong topic acknowledgment
  if (input.strongTopics.length > 0) {
    const topic = input.strongTopics[0]!;
    return {
      primary: `You are performing well in ${topic}.`,
      secondary: input.weakTopics.length > 0
        ? `Next, try a set on ${input.weakTopics[0]} to round things out.`
        : null,
      tone: "positive",
    };
  }

  // 5. Streak continuation
  if (input.streakDays >= 3) {
    return {
      primary: `${input.streakDays} days in a row. Consistency like this adds up.`,
      secondary: null,
      tone: "positive",
    };
  }

  // 6. Daily goal completion
  if (input.dailyGoalComplete) {
    return {
      primary: "Today's study goal is complete.",
      secondary: null,
      tone: "positive",
    };
  }

  // 7. Good accuracy
  if (input.currentAccuracyPct != null && input.currentAccuracyPct >= 70) {
    return {
      primary: `${input.currentAccuracyPct}% accuracy this session. Solid work.`,
      secondary: null,
      tone: "positive",
    };
  }

  // 8. Completion with guidance
  if (input.questionsAnswered > 0) {
    if (input.weakTopics.length > 0) {
      return {
        primary: `${input.questionsAnswered} questions completed.`,
        secondary: `Focus on ${input.weakTopics[0]} next to strengthen your weakest area.`,
        tone: "guidance",
      };
    }
    return {
      primary: `${input.questionsAnswered} questions completed. Good progress.`,
      secondary: null,
      tone: "neutral",
    };
  }

  // 9. Fallback
  return {
    primary: "Session recorded.",
    secondary: null,
    tone: "neutral",
  };
}

/**
 * Generate multiple feedback lines for richer surfaces (e.g. dashboard momentum).
 * Returns up to `max` distinct, non-overlapping messages.
 */
export function generateMultiSessionFeedback(
  input: SessionFeedbackInput,
  max = 3,
): string[] {
  const lines: string[] = [];

  if (input.improvedTopics.length > 0) {
    lines.push(`You improved in ${input.improvedTopics[0]} this session.`);
  }

  if (
    input.currentAccuracyPct != null &&
    input.previousAccuracyPct != null &&
    input.currentAccuracyPct > input.previousAccuracyPct
  ) {
    const delta = input.currentAccuracyPct - input.previousAccuracyPct;
    lines.push(`Accuracy up ${delta} points vs your last session.`);
  }

  if (input.strongTopics.length > 0 && lines.length < max) {
    lines.push(`Performing well in ${input.strongTopics[0]}.`);
  }

  if (input.streakDays >= 3 && lines.length < max) {
    lines.push(`${input.streakDays}-day study streak.`);
  }

  if (input.dailyGoalComplete && lines.length < max) {
    lines.push("Today's goal is complete.");
  }

  if (input.reviewedOverconfidentErrors && lines.length < max) {
    lines.push("Reviewed high-priority mistakes.");
  }

  if (input.weakTopics.length > 0 && lines.length < max) {
    lines.push(`Next focus: ${input.weakTopics[0]}.`);
  }

  return lines.slice(0, max);
}
