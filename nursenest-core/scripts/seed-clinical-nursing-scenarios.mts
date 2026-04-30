#!/usr/bin/env npx tsx
/**
 * Production-quality clinical nursing scenario seed (60 branching cases: 15 topics × 4 tiers).
 *
 * Defaults: dry-run (no DB writes). Scenarios are created as DRAFT unless --publish=true.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts --apply=true
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts --apply=true --tier=RN --limit=5
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts --apply=true --pathwayId=ca-rn-nclex-rn
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts --apply=true --update=true
 *   npx tsx scripts/seed-clinical-nursing-scenarios.mts --apply=true --publish=true
 *
 * Requires DATABASE_URL when --apply=true.
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
import { validateClinicalScenarioReadyToPublish } from "../src/lib/clinical-scenarios/clinical-scenario-publish-guard";
import {
  catalogDraftScenarioTitle,
  catalogDraftTitleMatchPrefix,
  enrichCatalogDraftReferencesJson,
  filterBranchingSpecsForSeed,
  parseClinicalScenarioSeedCliArgs,
  validateBranchingSpecForProductionSeed,
} from "../src/lib/clinical-scenarios/seed-clinical-nursing-scenarios-pipeline";
import { prisma } from "../src/lib/db";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { getExamPathwayById } from "../src/lib/exam-pathways";

const LOG = {
  match: "[CLINICAL SCENARIO SEED MATCH]",
  skip: "[CLINICAL SCENARIO SEED SKIPPED]",
  created: "[CLINICAL SCENARIO SEED CREATED]",
  updated: "[CLINICAL SCENARIO SEED UPDATED]",
  dry: "[CLINICAL SCENARIO SEED DRY-RUN]",
} as const;

async function main() {
  const argv = process.argv.slice(2);
  const cli = parseClinicalScenarioSeedCliArgs(argv);
  const all = allBranchingClinicalSeedSpecs();
  const specs = filterBranchingSpecsForSeed(all, cli);

  if (cli.pathwayId) {
    const p = getExamPathwayById(cli.pathwayId);
    if (!p) {
      console.error(`Unknown pathwayId: ${cli.pathwayId}`);
      process.exit(1);
    }
  }

  for (const spec of specs) {
    const v = validateBranchingSpecForProductionSeed(spec);
    if (v.length) {
      console.error(spec.seedKey, v);
      process.exit(1);
    }
  }

  if (cli.apply && !isDatabaseUrlConfigured()) {
    console.error("DATABASE_URL not configured; cannot --apply.");
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let matched = 0;

  for (const spec of specs) {
    const title = catalogDraftScenarioTitle(spec);
    const prefix = catalogDraftTitleMatchPrefix(spec);

    if (!cli.apply) {
      console.log(`${LOG.dry} would upsert: ${title}`);
      continue;
    }

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

    const publishStatus = cli.publish ? ("APPROVED" as const) : ("DRAFT" as const);
    const refs = enrichCatalogDraftReferencesJson(spec);

    if (existing) {
      matched += 1;
      console.log(`${LOG.match} ${prefix}`);
      if (!cli.update) {
        skipped += 1;
        console.log(`${LOG.skip} ${prefix} (use --update=true to replace stages)`);
        continue;
      }
      await prisma.$transaction(async (tx) => {
        await tx.clinicalNursingScenarioStage.deleteMany({ where: { scenarioId: existing.id } });
        const row = await tx.clinicalNursingScenario.update({
          where: { id: existing.id },
          data: {
            title,
            canonicalCategoryId: spec.canonicalCategoryId,
            difficulty: spec.difficulty,
            patientAgeContext: spec.patientAgeContext,
            presentingConcern: spec.presentingConcern,
            briefHistory: spec.briefHistory,
            medicationsAllergies: spec.medicationsAllergies,
            initialVitals: spec.initialVitals as Prisma.InputJsonValue,
            assessmentFindings: spec.assessmentFindings,
            labsDiagnostics: spec.labsDiagnostics as Prisma.InputJsonValue | undefined,
            referencesJson: refs,
            publishStatus,
            stages: { create: stageCreates },
          },
          include: { stages: { orderBy: { orderIndex: "asc" } } },
        });
        if (publishStatus === "APPROVED") {
          const guard = validateClinicalScenarioReadyToPublish(row);
          if (!guard.ok) throw new Error(`Publish guard failed: ${guard.message}`);
        }
      });
      updated += 1;
      console.log(`${LOG.updated} ${prefix}`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const row = await tx.clinicalNursingScenario.create({
        data: {
          title,
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
          referencesJson: refs,
          isPremium: false,
          publishStatus,
          stages: { create: stageCreates },
        },
        include: { stages: { orderBy: { orderIndex: "asc" } } },
      });
      if (publishStatus === "APPROVED") {
        const guard = validateClinicalScenarioReadyToPublish(row);
        if (!guard.ok) throw new Error(`Publish guard failed: ${guard.message}`);
      }
    });

    created += 1;
    console.log(`${LOG.created} ${prefix}`);
  }

  console.log(
    `Clinical nursing scenario seed: dryRun=${cli.dryRun} processed=${specs.length} created=${created} updated=${updated} skipped=${skipped} matchedExisting=${matched}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
