import { aggregateTrajectoryLabel } from "@/lib/clinical-scenarios/branching-scenario-engine";
import type { PatientTrajectory } from "@/lib/clinical-scenarios/clinical-scenario-trajectory";

export type ScenarioOutcomeLabel = "stabilized" | "critical" | "deteriorated";

export type ScenarioOutcomeResult = {
  outcome: ScenarioOutcomeLabel;
  summary: string;
  keyMistakes: string[];
  clinicalPearls: string[];
};

/**
 * End-of-case classification: mostly-correct → stabilized; mixed → critical; high error burden → deteriorated.
 */
export function computeScenarioOutcome(args: {
  trajectoryPath: PatientTrajectory[];
  incorrectCount: number;
  incorrectWeight: number;
  totalStages: number;
  mistakeLabels: string[];
}): ScenarioOutcomeResult {
  const { trajectoryPath, incorrectCount, incorrectWeight, totalStages, mistakeLabels } = args;
  const agg = aggregateTrajectoryLabel(trajectoryPath);
  const denom = Math.max(1, totalStages);

  let outcome: ScenarioOutcomeLabel;
  if (incorrectCount === 0 && incorrectWeight === 0) {
    outcome = agg === "deteriorating" ? "critical" : "stabilized";
  } else if (incorrectCount >= 3 || incorrectWeight >= 6 || (incorrectCount >= 2 && agg === "deteriorating")) {
    outcome = "deteriorated";
  } else {
    outcome = "critical";
  }

  const summary =
    outcome === "stabilized"
      ? `You completed ${denom} stage(s) with a stable-to-improving course and no major decision errors.`
      : outcome === "critical"
        ? `You finished the case with a mixed trajectory (${incorrectCount} suboptimal choice(s); weighted burden ${incorrectWeight}). Timely reassessment limited downstream harm.`
        : `The simulation ended with a high burden of suboptimal or delayed actions (${incorrectCount} errors, weighted ${incorrectWeight}), consistent with clinical deterioration.`;

  const keyMistakes =
    mistakeLabels.length > 0
      ? mistakeLabels.slice(-8)
      : incorrectCount > 0
        ? ["Review stages where you deviated from the fastest safe pathway (ABCs, time-sensitive bundles, escalation)."]
        : [];

  const clinicalPearls =
    outcome === "stabilized"
      ? [
          "Prioritize objective triggers (vitals, ECG, labs) before reassurance alone in red-flag presentations.",
          "Use tight SBAR when escalating — it preserves team optionality under time pressure.",
        ]
      : outcome === "critical"
        ? [
            "Delayed correct actions still consume tissue time in ACS, sepsis, stroke, and airway emergencies.",
            "When unsure, activate the pathway (sepsis bundle, ACS, stroke code) instead of serial delays.",
          ]
        : [
            "Choices tagged “delay” model opportunity cost: documentation and non-urgent tasks should not block stabilization.",
            "A “limit” consequence models loss of a safer intervention window — treat it as irreversible in debrief.",
          ];

  return { outcome, summary, keyMistakes, clinicalPearls };
}
