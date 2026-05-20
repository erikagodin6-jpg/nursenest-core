import type { QuestionOutcome, QuestionTimingSignal, TimingIntelligenceV2Result } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import {
  buildQuestionTimingSignals,
  analyzeTimingIntelligence,
} from "@/lib/learner/rn-coaching-intelligence/timing-intelligence-base";
import { readQuestionPerformanceEvents } from "@/lib/learner/question-performance-events";

function isSataType(type: string | null | undefined): boolean {
  const u = (type ?? "").toUpperCase();
  return u.includes("SATA") || u.includes("SELECT_ALL");
}

function isMatrixType(type: string | null | undefined): boolean {
  const u = (type ?? "").toUpperCase();
  return u.includes("MATRIX") || u.includes("BOWTIE") || u.includes("DRAG");
}

export function ingestTimingFromPerformanceEvents(
  userId: string,
  questionIds: string[],
): Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }> {
  const events = readQuestionPerformanceEvents(userId, 220);
  const idSet = new Set(questionIds);
  const out: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }> = {};
  for (const ev of events) {
    if (!idSet.has(ev.questionId)) continue;
    out[ev.questionId] = { dwellMs: ev.timeSpentMs, ...out[ev.questionId] };
  }
  return out;
}

function analyzeCognitiveBehavior(signals: QuestionTimingSignal[], outcomes: QuestionOutcome[]) {
  const outcomeById = new Map(outcomes.map((o) => [o.questionId, o]));
  let answerChangeRisk = false;
  let sataHesitation = false;
  let matrixHesitation = false;
  let highConfWrong = 0;
  let lowConfRight = 0;
  let rated = 0;

  for (const s of signals) {
    if ((s.answerChanges ?? 0) >= 2 && !s.isCorrect) answerChangeRisk = true;
    const o = outcomeById.get(s.questionId);
    if (o && isSataType(o.questionType) && (s.dwellMs ?? 0) > 100_000) sataHesitation = true;
    if (o && isMatrixType(o.questionType) && (s.dwellMs ?? 0) > 120_000) matrixHesitation = true;
    if (s.confidence) {
      rated += 1;
      if (s.confidence === "high" && !s.isCorrect) highConfWrong += 1;
      if ((s.confidence === "low" || s.confidence === "medium") && s.isCorrect) lowConfRight += 1;
    }
  }

  const n = signals.length;
  const late = signals.slice(Math.floor(n * 0.75));
  const early = signals.slice(0, Math.floor(n * 0.25));
  const lateWrong = late.filter((s) => !s.isCorrect).length / Math.max(1, late.length);
  const earlyWrong = early.filter((s) => !s.isCorrect).length / Math.max(1, early.length);
  const lateSessionAccuracyDrop = n >= 8 && lateWrong > earlyWrong + 0.15;
  const lateFastWrong = late.filter((s) => (s.dwellMs ?? 99999) < 10_000 && !s.isCorrect).length;
  const fatigueDetected = n >= 12 && (lateSessionAccuracyDrop || lateFastWrong >= 2);
  const confidenceInstability = rated >= 4 ? Math.min(1, (highConfWrong + lowConfRight) / rated) : 0;

  return {
    fatigueDetected,
    lateSessionAccuracyDrop,
    sataHesitation,
    matrixHesitation,
    answerChangeRisk,
    confidenceInstability,
    exhibitOverloadSuspected: false,
  };
}

export function analyzeTimingIntelligenceV2(args: {
  elapsedMs?: number | null;
  totalQuestions: number;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  outcomes: QuestionOutcome[];
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
  timingByQuestionId?: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }>;
}): TimingIntelligenceV2Result {
  const signals = buildQuestionTimingSignals({
    outcomes: args.outcomes,
    confidenceByQuestionId: args.confidenceByQuestionId,
    timingByQuestionId: args.timingByQuestionId,
  });
  const base = analyzeTimingIntelligence({
    elapsedMs: args.elapsedMs,
    totalQuestions: args.totalQuestions,
    timedMode: args.timedMode,
    timeLimitSec: args.timeLimitSec,
    signals,
  });
  const cognitive = analyzeCognitiveBehavior(signals, args.outcomes);
  const coachingNarratives: string[] = [];
  if (cognitive.fatigueDetected) {
    coachingNarratives.push("Late-session performance softened — use shorter timed blocks.");
  }
  if (cognitive.sataHesitation) {
    coachingNarratives.push("SATA items took disproportionate time — evaluate each option independently.");
  }
  if (cognitive.confidenceInstability >= 0.35) {
    coachingNarratives.push("Confidence and accuracy misaligned — reinforce then repeat under time pressure.");
  }

  return {
    ...base,
    pacingDetail: cognitive.fatigueDetected
      ? `${base.pacingDetail} Fatigue curve detected toward session end.`.trim()
      : base.pacingDetail,
    recommendations: [...new Set([...base.recommendations, ...coachingNarratives])].slice(0, 4),
    cognitive,
    coachingNarratives,
  };
}
