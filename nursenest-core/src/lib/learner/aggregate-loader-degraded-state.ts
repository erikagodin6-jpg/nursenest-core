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

/** Merge segment-level degradation into an existing durability/aggregate flag without dropping panels. */
export function mergeLearnerAggregateDegraded(
  base: LearnerAggregateDegradedState | undefined,
  extra: LearnerAggregateDegradedState | undefined,
): LearnerAggregateDegradedState | undefined {
  if (!base && !extra) return undefined;
  if (!base) return extra;
  if (!extra) return base;
  const panels = [...new Set([...base.panels, ...extra.panels])];
  const reason =
    base.reason === "durability_degraded" || extra.reason === "durability_degraded"
      ? "durability_degraded"
      : "temporarily_unavailable";
  return { active: true, reason, panels };
}
