import type { CatExamReport } from "@/lib/exams/cat-types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { CoachingModel, ReadinessReliabilityAssessment } from "@/lib/learner/post-exam-coaching/types";

export function assessReadinessReliability(args: {
  coachingModel: CoachingModel;
  totalQuestions: number;
  domainCount: number;
  coach?: CatResultsCoachSnapshot | null;
  catReport?: CatExamReport | null;
  confidenceVolatility?: number;
  pacingAnomaly?: boolean;
  sessionCompletedCleanly?: boolean;
}): ReadinessReliabilityAssessment {
  const {
    coachingModel,
    totalQuestions,
    domainCount,
    coach,
    catReport,
    confidenceVolatility = 0,
    pacingAnomaly = false,
    sessionCompletedCleanly = true,
  } = args;

  const factors: string[] = [];
  let score = 0;

  if (totalQuestions >= 45) score += 2;
  else if (totalQuestions >= 25) score += 1;
  else factors.push("short session length");

  if (domainCount >= 4) score += 1;
  else if (domainCount < 2) factors.push("limited domain coverage");

  const reliability = coach?.reliabilityLevel;
  if (reliability === "high") score += 2;
  else if (reliability === "medium") score += 1;
  else if (reliability === "low") factors.push("estimate still settling");

  const se = catReport?.se;
  if (se != null && se <= 0.35) score += 1;
  else if (se != null && se >= 0.6) factors.push("wide precision band");

  if (confidenceVolatility >= 0.35) factors.push("confidence swings within the session");
  if (pacingAnomaly) factors.push("uneven pacing pattern");
  if (!sessionCompletedCleanly) factors.push("session ended before a clean stopping signal");

  if (coachingModel === "loft_readiness") {
    score = Math.min(score, 2);
    if (totalQuestions < 8) factors.push("small LOFT sample — collect more simulations");
  }

  let level: ReadinessReliabilityAssessment["level"] = "moderate";
  if (score >= 4 && factors.length <= 1) level = "high";
  else if (score <= 1 || factors.length >= 3) level = "low";

  const softenPredictions = level === "low" || coach?.passOutlookOmitted === true;

  const guidance =
    level === "high"
      ? "This outlook is reasonably stable for the length and coverage of this session. Use it to prioritize your next study block."
      : level === "moderate"
        ? "Treat this as directional. One more assessment in your weak domains will sharpen the picture."
        : "Keep collecting sessions before treating readiness as settled. Focus on trends across your last few runs, not this score alone.";

  return { level, factors: factors.slice(0, 4), softenPredictions, guidance };
}
