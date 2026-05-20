#!/usr/bin/env npx tsx
/**
 * Idempotent seed: upserts 60 multi-stage branching clinical scenarios (15 topics × 4 tiers).
 * Match key: title prefix [seed:<seedKey>] + pathwayId + tierFocus.
 *
 * Usage (from nursenest-core/): npx tsx scripts/seed-branching-clinical-scenarios.mts
 * Requires DATABASE_URL.
 */
import "../src/lib/db/script-env-bootstrap";

import { Prisma } from "@prisma/client";
import { allBranchingClinicalSeedSpecs } from "../src/lib/clinical-scenarios/branching-clinical-scenarios-catalog";
import {
  consequencesFromOptions,
  correctId,
  optionsToPrismaJson,
  whyWrongFromOptions,
} from "../src/lib/clinical-scenarios/branching-scenario-seed-types";
import { prisma } from "../src/lib/db";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";

async function main() {
  if (!isDatabaseUrlConfigured()) {
    console.error("DATABASE_URL not configured; skipping seed.");
    process.exit(1);
  }

  const specs = allBranchingClinicalSeedSpecs();
  let created = 0;
  let updated = 0;

  for (const spec of specs) {
    const prefix = `[seed:${spec.seedKey}]`;
    const existing = await prisma.clinicalNursingScenario.findFirst({
      where: {
        pathwayId: spec.pathwayId,
        tierFocus: spec.tierFocus,
        title: { startsWith: prefix },
      },
      select: { id: true },
    });

    const stageCreates = spec.stages.map((s) => ({
      orderIndex: s.orderIndex,
      scenarioText: s.scenarioText,
      vitals: s.vitals as Prisma.InputJsonValue,
      assessmentFindings: s.assessmentFindings,
      labUpdates: s.labUpdates as Prisma.InputJsonValue | undefined,
      questionStem: s.questionStem,
      optionsJson: optionsToPrismaJson(s.options),
      correctOptionId: correctId(s.options),
      rationale: s.rationale,
      whyWrongByOptionId: whyWrongFromOptions(s.options),
      clinicalJudgmentFocus: s.clinicalJudgmentFocus,
      consequencesByOptionId: consequencesFromOptions(s.options),
      nextStageOrder: s.nextStageOrder,
    }));

    if (existing) {
      await prisma.$transaction(async (tx) => {
        await tx.clinicalNursingScenarioStage.deleteMany({ where: { scenarioId: existing.id } });
        await tx.clinicalNursingScenario.update({
          where: { id: existing.id },
          data: {
            title: spec.title,
            canonicalCategoryId: spec.canonicalCategoryId,
            difficulty: spec.difficulty,
            patientAgeContext: spec.patientAgeContext,
            presentingConcern: spec.presentingConcern,
            briefHistory: spec.briefHistory,
            medicationsAllergies: spec.medicationsAllergies,
            initialVitals: spec.initialVitals as Prisma.InputJsonValue,
            assessmentFindings: spec.assessmentFindings,
            labsDiagnostics: spec.labsDiagnostics as Prisma.InputJsonValue | undefined,
            referencesJson: spec.referencesJson as Prisma.InputJsonValue,
            publishStatus: "APPROVED",
            stages: { create: stageCreates },
          },
        });
      });
      updated += 1;
    } else {
      await prisma.clinicalNursingScenario.create({
        data: {
          title: spec.title,
          pathwayId: spec.pathwayId,
          canonicalCategoryId: spec.canonicalCategoryId,
          tierFocus: spec.tierFocus,
          difficulty: spec.difficulty,
          patientAgeContext: spec.patientAgeContext,
          presentingConcern: spec.presentingConcern,
          briefHistory: spec.briefHistory,
          medicationsAllergies: spec.medicationsAllergies,
          initialVitals: spec.initialVitals as Prisma.InputJsonValue,
          assessmentFindings: spec.assessmentFindings,
          labsDiagnostics: spec.labsDiagnostics as Prisma.InputJsonValue | undefined,
          referencesJson: spec.referencesJson as Prisma.InputJsonValue,
          publishStatus: "APPROVED",
          stages: { create: stageCreates },
        },
      });
      created += 1;
    }
  }

  console.log(`Branching clinical scenarios: created=${created}, updated=${updated}, total processed=${specs.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
