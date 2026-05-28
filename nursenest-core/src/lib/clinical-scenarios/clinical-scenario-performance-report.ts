import { aggregateTrajectoryLabel, type BranchingEngineState } from "@/lib/clinical-scenarios/branching-scenario-engine";
import {
  computeScenarioOutcome,
  type ScenarioOutcomeResult,
} from "@/lib/clinical-scenarios/clinical-scenario-outcome-engine";
export type PerformanceReportScenarioMeta = {
  stages: { length: number };
  canonicalCategoryId: string;
  tierFocus: string;
};

export type PerformanceReportSection = {
  title: string;
  items: string[];
};

export type ClinicalScenarioPerformanceReport = ScenarioOutcomeResult & {
  headline: string;
  strengths: PerformanceReportSection;
  needsImprovement: PerformanceReportSection;
  timeline: Array<{
    stageOrder: number;
    label: string;
    isCorrect: boolean;
    trajectory: string;
  }>;
  patientOutcomeLabel: string;
  escalationNotes: string[];
  remediationTopics: string[];
};

export function buildClinicalScenarioPerformanceReport(args: {
  scenario: PerformanceReportScenarioMeta;
  branchState: BranchingEngineState;
}): ClinicalScenarioPerformanceReport {
  const { scenario, branchState } = args;
  const outcome = computeScenarioOutcome({
    trajectoryPath: branchState.trajectoryPath,
    incorrectCount: branchState.incorrectCount,
    incorrectWeight: branchState.incorrectWeight,
    totalStages: scenario.stages.length,
    mistakeLabels: branchState.mistakeLabels,
  });

  const agg = aggregateTrajectoryLabel(branchState.trajectoryPath);
  const strengths: string[] = [];
  const needs: string[] = [];

  const correctEscalation = branchState.decisionTrail.some(
    (d) => d.isCorrect && (d.effect === "escalate" || d.trajectory === "improves"),
  );
  const delayed = branchState.decisionTrail.filter((d) => !d.isCorrect && d.effect === "delay");
  const unsafe = branchState.decisionTrail.filter((d) => !d.isCorrect && d.trajectory === "deteriorates");

  if (branchState.incorrectCount === 0) strengths.push("Consistent safe prioritization across the case");
  if (correctEscalation) strengths.push("Strong early escalation recognition");
  if (agg === "improving") strengths.push("Patient trajectory improved with your interventions");
  if (branchState.rationaleTrail.length >= 3) strengths.push("Engaged with clinical rationale at each decision point");

  if (delayed.length) needs.push("Delayed provider notification or reassessment timing");
  if (unsafe.length) needs.push("Unsafe prioritization choices that worsened the patient");
  if (branchState.mistakeLabels.length) {
    needs.push(`Review decisions: ${branchState.mistakeLabels.slice(0, 3).join("; ")}`);
  }
  if (agg === "deteriorating") needs.push("Missed signs of deterioration — reinforce ABCs and escalation triggers");

  const patientOutcomeLabel =
    outcome.outcome === "stabilized"
      ? "Patient stabilized"
      : outcome.outcome === "critical"
        ? "Patient critically ill — mixed recovery"
        : "Preventable deterioration pathway";

  const headline =
    outcome.outcome === "stabilized"
      ? "Your decisions supported stabilization — the patient responded to timely nursing judgment."
      : outcome.outcome === "critical"
        ? "Your decisions created a high-acuity course — timely reassessment limited further harm."
        : "Your decisions led to decompensation — review escalation and prioritization in debrief.";

  const escalationNotes: string[] = [];
  for (const d of branchState.decisionTrail) {
    if (d.effect === "escalate") escalationNotes.push(`Stage ${d.stageOrder + 1}: escalation pathway activated`);
    if (!d.isCorrect && d.effect === "delay") {
      escalationNotes.push(`Stage ${d.stageOrder + 1}: delayed action increased risk`);
    }
  }

  const remediationTopics = [
    scenario.canonicalCategoryId.replace(/_/g, " "),
    scenario.tierFocus.replace(/_/g, " "),
    ...branchState.mistakeLabels.slice(0, 2),
  ].filter(Boolean);

  return {
    ...outcome,
    headline,
    strengths: { title: "Strengths", items: strengths.length ? strengths : ["Completed the simulation — review pearls below."] },
    needsImprovement: {
      title: "Needs improvement",
      items: needs.length ? needs : ["No major errors recorded — maintain this judgment under pressure."],
    },
    timeline: branchState.decisionTrail.map((d) => ({
      stageOrder: d.stageOrder,
      label: d.pickedLabel,
      isCorrect: d.isCorrect,
      trajectory: d.trajectory,
    })),
    patientOutcomeLabel,
    escalationNotes,
    remediationTopics,
  };
}

export function flashcardsFromPerformanceReport(report: ClinicalScenarioPerformanceReport): Array<{ id: string; front: string; back: string }> {
  const cards: Array<{ id: string; front: string; back: string }> = [];
  report.needsImprovement.items.forEach((item, i) => {
    cards.push({
      id: `remediation-${i}`,
      front: `What should you do differently next time? (${item.slice(0, 64)}…)`,
      back: item,
    });
  });
  report.clinicalPearls.slice(0, 3).forEach((pearl, i) => {
    cards.push({
      id: `pearl-${i}`,
      front: "Clinical pearl from this case",
      back: pearl,
    });
  });
  return cards.slice(0, 8);
}
