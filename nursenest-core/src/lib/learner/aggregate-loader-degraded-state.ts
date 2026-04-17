export type LearnerAggregateDegradedReason =
  | "durability_degraded"
  | "temporarily_unavailable";

export type LearnerAggregateDegradedState = {
  active: true;
  reason: LearnerAggregateDegradedReason;
  panels: string[];
};

export function learnerAggregateDegradedState(
  reason: LearnerAggregateDegradedReason,
  panels: string[],
): LearnerAggregateDegradedState {
  return {
    active: true,
    reason,
    panels: [...new Set(panels.map((panel) => panel.trim()).filter(Boolean))],
  };
}
