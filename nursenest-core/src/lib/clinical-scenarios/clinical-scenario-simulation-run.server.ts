import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type ClinicalScenarioRunSummary = {
  incorrectCount: number;
  incorrectWeight: number;
  trajectoryPath: string[];
  maxStageOrderReached: number;
  completedScenario: boolean;
  premiumUnlocked: boolean;
  trajectoryAggregate: string;
  /** Mirrors learner-visible premium flag for downstream weak-area segmentation. */
  isPremiumScenario?: boolean;
};

export async function recordClinicalScenarioSimulationRun(opts: {
  userId: string;
  scenarioId: string;
  pathwayId: string;
  tierFocus: string;
  summary: ClinicalScenarioRunSummary;
}): Promise<void> {
  if (!isDatabaseUrlConfigured()) return;
  const payload: Prisma.InputJsonValue = {
    ...opts.summary,
    recordedAt: new Date().toISOString(),
  };
  try {
    await prisma.clinicalScenarioSimulationRun.create({
      data: {
        userId: opts.userId,
        scenarioId: opts.scenarioId.slice(0, 64),
        pathwayId: opts.pathwayId.slice(0, 64),
        tierFocus: opts.tierFocus.slice(0, 32),
        summary: payload,
      },
    });
  } catch {
    // never throw from persistence / analytics path
  }
}
