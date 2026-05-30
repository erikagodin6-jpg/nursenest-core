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
  readinessBandFromScore,
  type ReadinessProfile,
  type ReadinessDomain,
} from "@/lib/physiology-monitor/readiness-score-engine";
import type { ReadinessInput } from "@/lib/physiology-monitor/readiness-score-engine";
import { ReadinessDashboardClient } from "./readiness-dashboard-client";

export const metadata: Metadata = {
  title: "Clinical Readiness Dashboard | NurseNest",
  description: "Track your readiness across 7 clinical domains — Telemetry, ICU, Rapid Response, ECG, Shock, RT, and New Graduate.",
};

export const dynamic = "force-dynamic";

async function loadReadinessData(userId: string): Promise<{
  profile: ReadinessProfile;
  sessionCount: number;
  recentConditions: string[];
}> {
  let profile: ReadinessProfile;
  let sessionCount = 0;
  let recentConditions: string[] = [];

  if (!isDatabaseUrlConfigured()) {
    profile = computeReadinessProfile({
      sessionCount: 0, avgCompositeScore: 0, avgClinicalJudgmentScore: 0,
      avgMonitorInterpretationScore: 0, avgTimeToInterventionScore: 0,
      avgHarmIndexScore: 0, greenHarmRate: 0, redHarmRate: 0,
      conditionsPracticed: [], timelyEscalationRate: 0, remediationCompletionRate: 0,
    });
    return { profile, sessionCount: 0, recentConditions: [] };
  }

  try {
    const runs = await prisma.clinicalScenarioSimulationRun.findMany({
      where: { userId, scenarioId: { startsWith: "monitor:" } },
      select: { scenarioId: true, summary: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    sessionCount = runs.length;

    const summaries = runs.map((r) => r.summary as Record<string, unknown>);

    const avg = (arr: number[]) => arr.length > 0
      ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

    const scores = summaries.map((s) => Number(s.compositeScore ?? 0));
    const cjScores = summaries.map((s) => Number(s.clinicalJudgmentScore ?? 0));
    const harmScores = summaries.map((s) => Number(s.harmIndexScore ?? 0));
    const ttiScores = summaries.map((s) => Number(s.timeToInterventionScore ?? 0));

    const greenHarm = summaries.filter((s) => s.harmColor === "green").length;
    const redHarm = summaries.filter((s) => s.harmColor === "red").length;
    const timelyEscalation = summaries.filter((s) => Boolean(s.escalationTimely)).length;
    const remediationDone = summaries.filter((s) => Boolean(s.remediationCompleted)).length;

    recentConditions = [...new Set(
      runs.map((r) => String(r.scenarioId).replace("monitor:", ""))
    )];

    const readinessInput: ReadinessInput = {
      sessionCount,
      avgCompositeScore: avg(scores),
      avgClinicalJudgmentScore: avg(cjScores),
      avgMonitorInterpretationScore: avg(scores) * 0.9, // proxy
      avgTimeToInterventionScore: avg(ttiScores),
      avgHarmIndexScore: avg(harmScores),
      greenHarmRate: sessionCount > 0 ? greenHarm / sessionCount : 0,
      redHarmRate: sessionCount > 0 ? redHarm / sessionCount : 0,
      conditionsPracticed: recentConditions,
      timelyEscalationRate: sessionCount > 0 ? timelyEscalation / sessionCount : 0,
      remediationCompletionRate: sessionCount > 0 ? remediationDone / sessionCount : 0,
    };

    profile = computeReadinessProfile(readinessInput);
  } catch {
    profile = computeReadinessProfile({
      sessionCount: 0, avgCompositeScore: 0, avgClinicalJudgmentScore: 0,
      avgMonitorInterpretationScore: 0, avgTimeToInterventionScore: 0,
      avgHarmIndexScore: 0, greenHarmRate: 0, redHarmRate: 0,
      conditionsPracticed: [], timelyEscalationRate: 0, remediationCompletionRate: 0,
    });
  }

  return { profile, sessionCount, recentConditions };
}

export default async function ReadinessDashboardPage() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) redirect("/app");

  const { profile, sessionCount, recentConditions } = await loadReadinessData(gate.userId);

  return (
    <ReadinessDashboardClient
      profile={profile}
      sessionCount={sessionCount}
      recentConditions={recentConditions}
    />
  );
}
