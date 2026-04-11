"use client";

/**
 * Client-side session feedback generator.
 *
 * Generates a focused micro-win message from post-session data
 * available in the client (no server calls needed).
 */

export interface PostSessionData {
  score: number;
  total: number;
  accuracyPct: number | null;
  byTopic?: Record<string, { correct: number; total: number }> | null;
}

export interface ClientSessionFeedback {
  primary: string;
  secondary: string | null;
  tone: "positive" | "neutral" | "guidance";
}

export function generateClientSessionFeedback(data: PostSessionData): ClientSessionFeedback {
  const { score, total, accuracyPct, byTopic } = data;

  const strongTopics: string[] = [];
  const weakTopics: string[] = [];

  if (byTopic) {
    for (const [topic, row] of Object.entries(byTopic)) {
      if (row.total < 2) continue;
      const acc = row.correct / row.total;
      if (acc >= 0.75) strongTopics.push(topic);
      else if (acc < 0.5) weakTopics.push(topic);
    }
  }

  if (accuracyPct != null && accuracyPct >= 80 && total >= 5) {
    return {
      primary: `${accuracyPct}% accuracy across ${total} questions. Strong session.`,
      secondary: weakTopics.length > 0
        ? `Consider reviewing ${weakTopics[0]} next.`
        : null,
      tone: "positive",
    };
  }

  if (strongTopics.length > 0) {
    return {
      primary: `You performed well in ${strongTopics[0]}${strongTopics.length > 1 ? ` and ${strongTopics.length - 1} more` : ""}.`,
      secondary: weakTopics.length > 0
        ? `Focus on ${weakTopics[0]} to round things out.`
        : null,
      tone: "positive",
    };
  }

  if (accuracyPct != null && accuracyPct >= 60) {
    return {
      primary: `${score} of ${total} correct. Good progress.`,
      secondary: weakTopics.length > 0
        ? `Next focus: ${weakTopics[0]}.`
        : null,
      tone: "neutral",
    };
  }

  if (total > 0 && weakTopics.length > 0) {
    return {
      primary: `${total} questions completed.`,
      secondary: `Focus on ${weakTopics[0]} in your next session to build accuracy.`,
      tone: "guidance",
    };
  }

  if (total > 0) {
    return {
      primary: `${total} questions completed. Every session builds toward readiness.`,
      secondary: null,
      tone: "neutral",
    };
  }

  return {
    primary: "Session recorded.",
    secondary: null,
    tone: "neutral",
  };
}
