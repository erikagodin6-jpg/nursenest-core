import type { QuestionOutcome, QuestionTimingSignal, TimingIntelligenceResult } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

function formatElapsed(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "Not recorded";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export function buildQuestionTimingSignals(args: {
  outcomes: QuestionOutcome[];
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
  timingByQuestionId?: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }>;
}): QuestionTimingSignal[] {
  const { outcomes, confidenceByQuestionId, timingByQuestionId } = args;
  return outcomes.map((o) => ({
    questionId: o.questionId,
    isCorrect: o.isCorrect,
    topic: o.topic,
    questionType: o.questionType,
    confidence: confidenceByQuestionId?.[o.questionId],
    dwellMs: timingByQuestionId?.[o.questionId]?.dwellMs,
    answerChanges: timingByQuestionId?.[o.questionId]?.answerChanges,
    rereads: timingByQuestionId?.[o.questionId]?.rereads,
  }));
}

export function analyzeTimingIntelligence(args: {
  elapsedMs?: number | null;
  totalQuestions: number;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  signals: QuestionTimingSignal[];
}): TimingIntelligenceResult {
  const { elapsedMs, totalQuestions, timedMode, timeLimitSec, signals } = args;
  const elapsedLabel = formatElapsed(elapsedMs);
  const avgSecPerQuestion =
    elapsedMs != null && totalQuestions > 0 ? Math.round(elapsedMs / 1000 / totalQuestions) : null;

  const recommendations: string[] = [];
  let pacingLabel = "Balanced pacing";
  let pacingDetail = "Your time use looked even across the session.";

  const hesitationClusterTopics = new Map<string, number>();
  const rapidGuessTopics = new Map<string, number>();

  for (const s of signals) {
    const topic = s.topic?.trim() || "General";
    if (s.dwellMs != null && s.dwellMs > 120_000 && !s.isCorrect) {
      hesitationClusterTopics.set(topic, (hesitationClusterTopics.get(topic) ?? 0) + 1);
    }
    if (s.dwellMs != null && s.dwellMs < 8_000) {
      rapidGuessTopics.set(topic, (rapidGuessTopics.get(topic) ?? 0) + 1);
    }
    if (s.confidence === "high" && !s.isCorrect && s.dwellMs != null && s.dwellMs < 15_000) {
      rapidGuessTopics.set(topic, (rapidGuessTopics.get(topic) ?? 0) + 1);
    }
    if ((s.confidence === "low" || s.confidence === "medium") && s.isCorrect && s.dwellMs != null && s.dwellMs > 90_000) {
      hesitationClusterTopics.set(topic, (hesitationClusterTopics.get(topic) ?? 0) + 1);
    }
  }

  const topHesitation = [...hesitationClusterTopics.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const topRapid = [...rapidGuessTopics.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  if (topHesitation) {
    pacingLabel = "Hesitation clusters detected";
    pacingDetail = `Response patterns in ${topHesitation} suggest overthinking or uncertainty during escalation-style stems.`;
    recommendations.push(
      `Practice ${topHesitation} prioritization with a timed rule: name the unstable finding, then choose the first nursing action.`,
    );
  }

  if (topRapid) {
    pacingDetail = `${pacingDetail} Rapid responses in ${topRapid} may indicate guessing — add a brief safety check before submit.`.trim();
    recommendations.push(`Slow down on ${topRapid} stems: read vitals and red-flag language before selecting an answer.`);
  }

  if (avgSecPerQuestion != null && avgSecPerQuestion < 45) {
    pacingLabel = pacingLabel === "Balanced pacing" ? "Fast pacing" : pacingLabel;
    if (!topRapid) {
      pacingDetail = "You moved quickly per item. Pair speed with a deliberate stabilization check on unstable scenarios.";
    }
  } else if (avgSecPerQuestion != null && avgSecPerQuestion > 150) {
    pacingLabel = pacingLabel === "Balanced pacing" ? "Deliberate pacing" : pacingLabel;
    if (!topHesitation) {
      pacingDetail = "You invested more time per item — watch for late-session fatigue on full-length runs.";
    }
  }

  if (timedMode && timeLimitSec != null && elapsedMs != null && elapsedMs / 1000 / timeLimitSec >= 0.92) {
    recommendations.push("On the next timed run, flag uncertain items early so review time stays under your control.");
  }

  return {
    elapsedLabel,
    avgSecPerQuestion,
    pacingLabel,
    pacingDetail,
    recommendations: [...new Set(recommendations)].slice(0, 3),
    signals,
    hesitationClusterTopics: [...hesitationClusterTopics.keys()].slice(0, 3),
    rapidGuessTopics: [...rapidGuessTopics.keys()].slice(0, 3),
  };
}
