import type { Metadata } from "next";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  computeReadinessProfile,
  READINESS_DOMAIN_LABELS,
  READINESS_DOMAIN_DESCRIPTIONS,
  READINESS_BAND_LABELS,
  type ReadinessProfile,
  type ReadinessDomain,
} from "@/lib/physiology-monitor/readiness-score-engine";
import type { ReadinessInput } from "@/lib/physiology-monitor/readiness-score-engine";
import { ClearanceCenterClient } from "./clearance-center-client";

export const metadata: Metadata = {
  title: "Clearance Center | NurseNest Simulations",
  description: "Earn clinical clearances by demonstrating competency across simulation domains.",
};

export const dynamic = "force-dynamic";

// Clearance requirements per domain
export const CLEARANCE_REQUIREMENTS: Record<ReadinessDomain, {
  requiredScore: number;
  minSessions: number;
  requiredConditions: string[];
  badgeLabel: string;
  badgeDescription: string;
  unit: string;
}> = {
  telemetry: {
    requiredScore: 75,
    minSessions: 5,
    requiredConditions: ["afib_rvr", "svt", "hyperkalemia"],
    badgeLabel: "Telemetry Ready",
    badgeDescription: "Demonstrates competency in continuous cardiac monitoring, alarm management, and rhythm recognition.",
    unit: "Telemetry / Step-Down Unit",
  },
  icu: {
    requiredScore: 82,
    minSessions: 8,
    requiredConditions: ["sepsis", "stemi", "ards"],
    badgeLabel: "ICU Ready",
    badgeDescription: "Demonstrates competency with critical care physiology, vasopressor management, and multiorgan failure.",
    unit: "ICU / CVICU / MICU",
  },
  rapid_response: {
    requiredScore: 78,
    minSessions: 5,
    requiredConditions: ["sepsis", "gi_bleed"],
    badgeLabel: "Rapid Response Ready",
    badgeDescription: "Demonstrates early deterioration recognition and timely escalation to rapid response team.",
    unit: "Medical / Surgical / Step-Down",
  },
  ecg_arrhythmia: {
    requiredScore: 80,
    minSessions: 6,
    requiredConditions: ["afib_rvr", "svt", "vt_to_vf"],
    badgeLabel: "ECG Proficient",
    badgeDescription: "Demonstrates proficiency in rhythm interpretation and arrhythmia management.",
    unit: "Telemetry / Cardiac / ICU",
  },
  shock_recognition: {
    requiredScore: 78,
    minSessions: 6,
    requiredConditions: ["sepsis", "anaphylaxis"],
    badgeLabel: "Shock Recognition Ready",
    badgeDescription: "Demonstrates ability to identify and initiate management of distributive, cardiogenic, and hypovolemic shock.",
    unit: "Emergency / ICU / Step-Down",
  },
  rt_critical_care: {
    requiredScore: 80,
    minSessions: 5,
    requiredConditions: ["ards", "rt_auto_peep", "rt_accidental_extubation"],
    badgeLabel: "RT Critical Care Ready",
    badgeDescription: "Demonstrates competency in ventilator management, airway emergencies, and respiratory waveform interpretation.",
    unit: "ICU / MICU / Respiratory",
  },
  new_graduate_safe_practice: {
    requiredScore: 70,
    minSessions: 4,
    requiredConditions: ["sepsis"],
    badgeLabel: "Safe Practice Certified",
    badgeDescription: "Demonstrates consistent safe practice: timely escalation, harm avoidance, and deterioration recognition.",
    unit: "All Clinical Settings",
  },
};

export type ClearanceData = {
  profile: ReadinessProfile;
  sessionCount: number;
  conditionsPracticed: string[];
};

async function loadClearanceData(userId: string): Promise<ClearanceData> {
  let sessionCount = 0;
  let conditionsPracticed: string[] = [];

  if (isDatabaseUrlConfigured()) {
    try {
      const runs = await prisma.clinicalScenarioSimulationRun.findMany({
        where: { userId, scenarioId: { startsWith: "monitor:" } },
        select: { scenarioId: true, summary: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      sessionCount = runs.length;
      conditionsPracticed = [...new Set(runs.map((r) => String(r.scenarioId).replace("monitor:", "")))];

      const summaries = runs.map((r) => r.summary as Record<string, unknown>);
      const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

      const profile = computeReadinessProfile({
        sessionCount,
        avgCompositeScore: avg(summaries.map((s) => Number(s.compositeScore ?? 0))),
        avgClinicalJudgmentScore: avg(summaries.map((s) => Number(s.clinicalJudgmentScore ?? 0))),
        avgMonitorInterpretationScore: avg(summaries.map((s) => Number(s.compositeScore ?? 0))) * 0.9,
        avgTimeToInterventionScore: avg(summaries.map((s) => Number(s.timeToInterventionScore ?? 0))),
        avgHarmIndexScore: avg(summaries.map((s) => Number(s.harmIndexScore ?? 0))),
        greenHarmRate: summaries.filter((s) => s.harmColor === "green").length / Math.max(1, sessionCount),
        redHarmRate: summaries.filter((s) => s.harmColor === "red").length / Math.max(1, sessionCount),
        conditionsPracticed,
        timelyEscalationRate: summaries.filter((s) => Boolean(s.escalationTimely)).length / Math.max(1, sessionCount),
        remediationCompletionRate: 0,
      });

      return { profile, sessionCount, conditionsPracticed };
    } catch { /* fall through */ }
  }

  return {
    profile: computeReadinessProfile({
      sessionCount: 0, avgCompositeScore: 0, avgClinicalJudgmentScore: 0,
      avgMonitorInterpretationScore: 0, avgTimeToInterventionScore: 0,
      avgHarmIndexScore: 0, greenHarmRate: 0, redHarmRate: 0,
      conditionsPracticed: [], timelyEscalationRate: 0, remediationCompletionRate: 0,
    }),
    sessionCount: 0,
    conditionsPracticed: [],
  };
}

export default async function ClearanceCenterPage() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) redirect("/app");

  const data = await loadClearanceData(gate.userId);
  return <ClearanceCenterClient data={data} requirements={CLEARANCE_REQUIREMENTS} />;
}
