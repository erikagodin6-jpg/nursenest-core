export type PatientTrajectory = "improving" | "stable" | "deteriorating";

const ALIASES: Record<string, PatientTrajectory> = {
  improved: "improving",
  improving: "improving",
  better: "improving",
  stable: "stable",
  unchanged: "stable",
  deteriorated: "deteriorating",
  deteriorating: "deteriorating",
  worse: "deteriorating",
};

/**
 * Maps stored consequence strings (per answer option) to a compact trajectory label for UI.
 */
export function patientTrajectoryFromConsequence(raw: string | null | undefined): PatientTrajectory {
  const k = (raw ?? "").trim().toLowerCase();
  if (!k) return "stable";
  return ALIASES[k] ?? "stable";
}

export function trajectoryLabelText(t: PatientTrajectory): string {
  switch (t) {
    case "improving":
      return "Improving";
    case "deteriorating":
      return "Deteriorating";
    default:
      return "Stable";
  }
}
