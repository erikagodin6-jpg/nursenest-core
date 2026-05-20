import type { TimingIntelligenceV2Result } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type TimingRiskBand = "low" | "moderate" | "elevated" | "high";

export type TimingCognitionSignals = {
  riskBand: TimingRiskBand;
  fatigueTrajectory: boolean;
  hesitationClusterCount: number;
  sataFriction: boolean;
  answerChangeInstability: boolean;
  unsafeRapidResponse: boolean;
  lateSessionDecay: boolean;
};

export function deriveTimingCognitionSignals(args: {
  learnerState: RnLearnerStateSnapshot;
  timingV2?: TimingIntelligenceV2Result | null;
}): TimingCognitionSignals {
  const { learnerState, timingV2 } = args;
  const c = timingV2?.cognitive;
  const fatigueTrajectory =
    Boolean(c?.fatigueDetected || c?.lateSessionAccuracyDrop) || learnerState.pacingProfile === "volatile";
  const hesitationClusterCount = timingV2?.hesitationClusterTopics.length ?? 0;
  const sataFriction = Boolean(c?.sataHesitation);
  const answerChangeInstability = Boolean(c?.answerChangeRisk);
  const unsafeRapidResponse =
    Boolean(c?.exhibitOverloadSuspected) ||
    ((timingV2?.rapidGuessTopics.length ?? 0) > 0 && learnerState.confidenceInstability >= 0.4);
  const lateSessionDecay = Boolean(c?.lateSessionAccuracyDrop || c?.fatigueDetected);

  let riskScore = 0;
  if (fatigueTrajectory) riskScore += 2;
  if (hesitationClusterCount >= 2) riskScore += 2;
  if (sataFriction) riskScore += 1;
  if (answerChangeInstability) riskScore += 2;
  if (unsafeRapidResponse) riskScore += 2;
  if (lateSessionDecay) riskScore += 1;
  if (learnerState.hesitationProfile === "high") riskScore += 1;

  const riskBand: TimingRiskBand =
    riskScore >= 7 ? "high" : riskScore >= 5 ? "elevated" : riskScore >= 2 ? "moderate" : "low";

  return {
    riskBand,
    fatigueTrajectory,
    hesitationClusterCount,
    sataFriction,
    answerChangeInstability,
    unsafeRapidResponse,
    lateSessionDecay,
  };
}

export function deriveTimingRiskBand(learnerState: RnLearnerStateSnapshot): TimingRiskBand {
  return deriveTimingCognitionSignals({ learnerState }).riskBand;
}

export function studyPlanDensityFromTiming(signals: TimingCognitionSignals): "light" | "standard" | "focused" {
  if (signals.riskBand === "high" || signals.fatigueTrajectory) return "light";
  if (signals.riskBand === "elevated") return "standard";
  return "focused";
}
