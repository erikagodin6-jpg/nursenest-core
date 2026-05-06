import assert from "node:assert/strict";
import { test } from "node:test";
import { branchingCatalogCounts, allBranchingClinicalSeedSpecs } from "@/lib/clinical-scenarios/branching-clinical-scenarios-catalog";
import {
  buildClinicalNursingScenarioLearnerCatalogWhere,
  clinicalNursingScenarioRowVisibleToLearner,
} from "@/lib/clinical-scenarios/clinical-nursing-scenario-learner-rules";
import {
  CATALOG_DRAFT_SEED_PREFIX,
  allCatalogBranchingSpecsForSeed,
  catalogDraftScenarioTitle,
  catalogSeedCountsByTier,
  filterBranchingSpecsForSeed,
  parseClinicalScenarioSeedCliArgs,
  resolveCatalogSeedUpsertAction,
  topicSlugFromSeedKey,
  validateBranchingSpecForProductionSeed,
} from "@/lib/clinical-scenarios/seed-clinical-nursing-scenarios-pipeline";

test("parseClinicalScenarioSeedCliArgs defaults to dry run (no apply)", () => {
  const cli = parseClinicalScenarioSeedCliArgs([]);
  assert.equal(cli.dryRun, true);
  assert.equal(cli.apply, false);
  assert.equal(cli.publish, false);
  assert.equal(cli.update, false);
});

test("parseClinicalScenarioSeedCliArgs supports apply tier pathwayId limit update publish", () => {
  const cli = parseClinicalScenarioSeedCliArgs([
    "--apply=true",
    "--tier=PN",
    "--pathwayId=ca-rpn-rex-pn",
    "--limit=3",
    "--update=true",
    "--publish=true",
  ]);
  assert.equal(cli.dryRun, false);
  assert.equal(cli.apply, true);
  assert.equal(cli.tier, "RPN_PN");
  assert.equal(cli.pathwayId, "ca-rpn-rex-pn");
  assert.equal(cli.limit, 3);
  assert.equal(cli.update, true);
  assert.equal(cli.publish, true);
});

test("filterBranchingSpecsForSeed respects tier pathway and limit", () => {
  const all = allBranchingClinicalSeedSpecs();
  const rn = filterBranchingSpecsForSeed(all, { tier: "RN_NCLEX_RN", pathwayId: null, limit: null });
  assert.equal(rn.length, 15);
  const limited = filterBranchingSpecsForSeed(all, { tier: "NP", pathwayId: null, limit: 2 });
  assert.equal(limited.length, 2);
  const pathway = filterBranchingSpecsForSeed(all, { tier: null, pathwayId: "ca-np-cnple", limit: null });
  assert.equal(pathway.length, 15);
});

test("catalog has 60 scenarios with 15 per tier", () => {
  const counts = branchingCatalogCounts();
  assert.equal(counts.total, 60);
  assert.equal(counts.perTier, 15);
  const by = catalogSeedCountsByTier(allCatalogBranchingSpecsForSeed());
  assert.equal(by.RN_NCLEX_RN, 15);
  assert.equal(by.RPN_PN, 15);
  assert.equal(by.NP, 15);
  assert.equal(by.NEW_GRAD, 15);
});

test("every catalog spec passes production seed validation", () => {
  for (const s of allCatalogBranchingSpecsForSeed()) {
    const err = validateBranchingSpecForProductionSeed(s);
    assert.deepEqual(err, [], s.seedKey);
  }
});

test("catalog draft title uses stable catalog prefix and seedKey", () => {
  const spec = allBranchingClinicalSeedSpecs()[0]!;
  const t = catalogDraftScenarioTitle(spec);
  assert.ok(t.startsWith(`[seed:${CATALOG_DRAFT_SEED_PREFIX}-${spec.seedKey}]`));
});

test("topicSlugFromSeedKey extracts slug after tier", () => {
  assert.equal(topicSlugFromSeedKey("b1-RN_NCLEX_RN-mi-acs"), "mi-acs");
  assert.equal(topicSlugFromSeedKey("b1-NEW_GRAD-sepsis-shock"), "sepsis-shock");
});

test("buildClinicalNursingScenarioLearnerCatalogWhere hides drafts for subscribers", () => {
  const w = buildClinicalNursingScenarioLearnerCatalogWhere({
    pathwayId: " ca-rn-nclex-rn ",
    includeDraftsForStaff: false,
  });
  assert.equal(w.publishStatus, "APPROVED");
  assert.equal(w.pathwayId, "ca-rn-nclex-rn");
});

test("buildClinicalNursingScenarioLearnerCatalogWhere omits publish filter for staff", () => {
  const w = buildClinicalNursingScenarioLearnerCatalogWhere({
    pathwayId: "ca-rn-nclex-rn",
    includeDraftsForStaff: true,
  });
  assert.equal(w.publishStatus, undefined);
});

test("clinicalNursingScenarioRowVisibleToLearner matches staff vs subscriber rules", () => {
  assert.equal(clinicalNursingScenarioRowVisibleToLearner("DRAFT", false), false);
  assert.equal(clinicalNursingScenarioRowVisibleToLearner("APPROVED", false), true);
  assert.equal(clinicalNursingScenarioRowVisibleToLearner("DRAFT", true), true);
});

test("resolveCatalogSeedUpsertAction skips duplicate keys unless update", () => {
  assert.equal(resolveCatalogSeedUpsertAction(null, false), "create");
  assert.equal(resolveCatalogSeedUpsertAction("id-1", false), "skip");
  assert.equal(resolveCatalogSeedUpsertAction("id-1", true), "update");
});
