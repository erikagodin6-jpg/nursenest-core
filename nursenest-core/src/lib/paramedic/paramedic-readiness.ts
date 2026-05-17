import { PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT } from "@/lib/paramedic/airway/paramedic-airway-foundations";
import { PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT } from "@/lib/paramedic/trauma/paramedic-trauma-foundations";
import { PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT } from "@/lib/paramedic/runtime/ecg-module-adapter";
import { PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT } from "@/lib/paramedic/scenarios/paramedic-scenario-catalog";

export type ParamedicReadinessArea =
  | "airway"
  | "trauma"
  | "ecg"
  | "scenarios"
  | "runtime"
  | "ui"
  | "questions"
  | "billing"
  | "qa";

export type ParamedicReadinessStatus = "not-started" | "scaffolded" | "maturing" | "production-candidate" | "production-ready";

export type ParamedicReadinessAreaSnapshot = {
  area: ParamedicReadinessArea;
  label: string;
  percent: number;
  status: ParamedicReadinessStatus;
  notes: string[];
};

export type ParamedicSliceReadinessSnapshot = {
  slice: "paramedic";
  overallPercent: number;
  visibleProductPercent: number;
  architecturePercent: number;
  generatedAt: string;
  areas: ParamedicReadinessAreaSnapshot[];
  nextHighestImpactWork: string[];
};

function statusFromPercent(percent: number): ParamedicReadinessStatus {
  if (percent >= 95) return "production-ready";
  if (percent >= 85) return "production-candidate";
  if (percent >= 60) return "maturing";
  if (percent >= 1) return "scaffolded";
  return "not-started";
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getParamedicReadinessAreas(): ParamedicReadinessAreaSnapshot[] {
  const airway = clampPercent(PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT);
  const trauma = clampPercent(PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT);
  const ecg = clampPercent(PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT);
  const scenarios = clampPercent(PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT);

  return [
    {
      area: "airway",
      label: "Airway Foundations",
      percent: airway,
      status: statusFromPercent(airway),
      notes: [
        "Typed curriculum is implemented.",
        "Lessons include EMS assessment, deterioration, scenario prompts, practice tags, and flashcard mapping.",
        "Still needs rendered learner UI and question-bank ingestion.",
      ],
    },
    {
      area: "trauma",
      label: "Trauma Foundations",
      percent: trauma,
      status: statusFromPercent(trauma),
      notes: [
        "Typed curriculum is implemented.",
        "Lessons include XABCDE, hemorrhage control, shock, chest trauma, spinal motion restriction, and transport logic.",
        "Still needs rendered learner UI and question-bank ingestion.",
      ],
    },
    {
      area: "ecg",
      label: "EMS ECG Adapter",
      percent: ecg,
      status: statusFromPercent(ecg),
      notes: [
        "EMS ECG now adapts the canonical ECG module instead of duplicating it.",
        "Adds transport, instability, artifact verification, and EMS decision framing.",
        "Still needs rendered ECG drill/scenario UI.",
      ],
    },
    {
      area: "scenarios",
      label: "Scenario Catalog",
      percent: scenarios,
      status: statusFromPercent(scenarios),
      notes: [
        "Inferior STEMI rural transport scenario is cataloged with SEO and readiness domains.",
        "Scenario runtime connects patient state, ECG, transport, timeline, risk, and debrief data.",
        "Still needs interactive progression engine and React scenario player.",
      ],
    },
    {
      area: "runtime",
      label: "Runtime Contracts",
      percent: 78,
      status: statusFromPercent(78),
      notes: [
        "Patient, ECG, transport, and scenario contracts are implemented.",
        "Operational risk and instability inference exist.",
        "Still needs mutation engine, persistence, and adaptive integration.",
      ],
    },
    {
      area: "ui",
      label: "Visible Product UI",
      percent: 38,
      status: statusFromPercent(38),
      notes: [
        "Product and component direction is defined.",
        "Actual dashboard, scenario player, ECG viewer, vitals monitor, and debrief UI are not yet implemented.",
      ],
    },
    {
      area: "questions",
      label: "Question Bank",
      percent: 12,
      status: statusFromPercent(12),
      notes: [
        "Practice taxonomy is defined through tags.",
        "Production EMS question items are not yet seeded at meaningful volume.",
      ],
    },
    {
      area: "billing",
      label: "Billing and Entitlements",
      percent: 8,
      status: statusFromPercent(8),
      notes: [
        "Commercial packaging is defined conceptually.",
        "Dedicated paramedic entitlement, Stripe mapping, and checkout surfaces still need implementation.",
      ],
    },
    {
      area: "qa",
      label: "QA and Governance",
      percent: 15,
      status: statusFromPercent(15),
      notes: [
        "Readiness helpers exist for content slices.",
        "Contract tests, route tests, accessibility tests, and visual QA still need to be added.",
      ],
    },
  ];
}

export function calculateParamedicOverallReadinessPercent(areas: ParamedicReadinessAreaSnapshot[] = getParamedicReadinessAreas()): number {
  const weights: Record<ParamedicReadinessArea, number> = {
    airway: 0.12,
    trauma: 0.12,
    ecg: 0.12,
    scenarios: 0.14,
    runtime: 0.16,
    ui: 0.14,
    questions: 0.10,
    billing: 0.05,
    qa: 0.05,
  };

  const score = areas.reduce((sum, area) => sum + area.percent * weights[area.area], 0);
  return clampPercent(score);
}

export function getParamedicSliceReadinessSnapshot(): ParamedicSliceReadinessSnapshot {
  const areas = getParamedicReadinessAreas();
  return {
    slice: "paramedic",
    overallPercent: calculateParamedicOverallReadinessPercent(areas),
    visibleProductPercent: 38,
    architecturePercent: 96,
    generatedAt: new Date().toISOString(),
    areas,
    nextHighestImpactWork: [
      "Build the React scenario player for the Inferior STEMI rural transport scenario.",
      "Build EMS vitals monitor and ECG scenario panel using the shared ECG module adapter.",
      "Add route/SEO surface for the paramedic scenario catalog.",
      "Seed the first 100–150 EMS questions for Airway, Trauma, and STEMI.",
      "Add contract tests for readiness percentages and ECG adapter mappings.",
    ],
  };
}

export const PARAMEDIC_SLICE_READINESS_SNAPSHOT = getParamedicSliceReadinessSnapshot();
