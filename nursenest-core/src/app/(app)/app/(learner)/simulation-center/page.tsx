import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { SimulationCenterClient } from "./simulation-center-client";
import { SIMULATION_CATALOG, SIMULATION_COUNT } from "@/lib/physiology-monitor/simulation-catalog";
import type { SimulationCenterData } from "./simulation-center-client";
import { trackSimulationEvent } from "@/lib/physiology-monitor/simulation-conversion-events";

export const metadata: Metadata = {
  title: "Simulation Center | NurseNest",
  description: "Practice clinical deterioration, earn readiness clearances, and build expertise with 51 patient simulations.",
};

export const dynamic = "force-dynamic";

async function loadSimulationCenterData(userId: string): Promise<SimulationCenterData> {
  // Load completed sessions from ClinicalScenarioSimulationRun
  let completedConditions: string[] = [];
  let sessionCount = 0;
  let avgScore = 0;
  let totalSimSeconds = 0;
  let harmGreenCount = 0;

  if (isDatabaseUrlConfigured()) {
    try {
      const runs = await prisma.clinicalScenarioSimulationRun.findMany({
        where: { userId, scenarioId: { startsWith: "monitor:" } },
        select: { scenarioId: true, summary: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      sessionCount = runs.length;
      completedConditions = [...new Set(
        runs.map((r) => String(r.scenarioId).replace("monitor:", ""))
      )];

      const scores = runs.map((r) => {
        const s = r.summary as Record<string, unknown>;
        return Number(s.compositeScore ?? 0);
      }).filter((s) => s > 0);

      avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      harmGreenCount = runs.filter((r) => {
        const s = r.summary as Record<string, unknown>;
        return s.harmColor === "green";
      }).length;

      // Estimate hours practiced (each sim avg 15 min)
      totalSimSeconds = sessionCount * 15 * 60;
    } catch { /* DB unavailable — use defaults */ }
  }

  return {
    sessionCount,
    completedConditions,
    totalSimulations: SIMULATION_COUNT,
    avgCompositeScore: avgScore,
    estimatedHours: Math.round(totalSimSeconds / 3600 * 10) / 10,
    safeSessionRate: sessionCount > 0 ? Math.round((harmGreenCount / sessionCount) * 100) : 0,
    simulations: SIMULATION_CATALOG,
  };
}

export default async function SimulationCenterPage() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) {
    redirect("/app");
  }

  const data = await loadSimulationCenterData(gate.userId);
  void trackSimulationEvent(gate.userId, "simulation_center_viewed", { tier: String(gate.entitlement.tier ?? "unknown") });

  return (
    <Suspense fallback={<div className="px-4 py-8 text-sm text-[var(--semantic-text-muted)]">Loading Simulation Center…</div>}>
      <SimulationCenterClient data={data} />
    </Suspense>
  );
}
